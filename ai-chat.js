// ai-chat.js - AarvJS AI Chat UI & Webhook Logic

const WEBHOOK_URL = "https://aarvjs01.app.n8n.cloud/webhook-test/portfolio-ai-assistant";

const aiChatHTML = `
<div id="ai-chat-widget">
    <div class="ai-chat-panel" id="ai-chat-panel">
        <div class="ai-chat-header">
            <h3 class="ai-header-title"><i class="fa-solid fa-robot"></i> AarvJS AI</h3>
            <div class="ai-header-actions">
                <button class="ai-icon-btn" id="ai-clear-btn" title="Clear Chat"><i class="fa-solid fa-trash-can"></i></button>
                <button class="ai-icon-btn" id="ai-min-btn" title="Minimize"><i class="fa-solid fa-minus"></i></button>
                <button class="ai-icon-btn" id="ai-close-btn" title="Close"><i class="fa-solid fa-xmark"></i></button>
            </div>
        </div>
        
        <div class="ai-chat-body" id="ai-chat-body">
            <!-- Welcome Message -->
            <div class="ai-msg ai">
                <div class="ai-msg-content">
                    Hi! I am AarvJS AI. I can tell you about Arvind's projects, skills, services, and how to contact him. How can I help you today?
                </div>
                <div class="ai-msg-meta">
                    <span class="ai-avatar"><i class="fa-solid fa-robot"></i></span> AarvJS AI
                </div>
            </div>
        </div>
        
        <div class="ai-chat-footer">
            <div class="ai-voice-controls">
                <div class="ai-status-container">
                    <span class="ai-status-text" id="ai-status-text">Ready</span>
                    <div class="ai-waveform" id="ai-waveform" style="display: none;">
                        <div class="wave-bar"></div>
                        <div class="wave-bar"></div>
                        <div class="wave-bar"></div>
                        <div class="wave-bar"></div>
                        <div class="wave-bar"></div>
                    </div>
                </div>
                <button class="ai-voice-btn" id="ai-stop-speak-btn" style="display: none;">
                    <i class="fa-solid fa-volume-xmark"></i> Stop Speaking
                </button>
            </div>
            <div class="ai-input-wrapper">
                <button class="ai-action-btn" id="ai-mic-btn" title="Start Voice Input">
                    <i class="fa-solid fa-microphone"></i>
                </button>
                <input type="text" class="ai-input" id="ai-input" placeholder="Ask something..." autocomplete="off">
                <button class="ai-action-btn send-btn" id="ai-send-btn" title="Send Message">
                    <i class="fa-solid fa-paper-plane"></i>
                </button>
            </div>
        </div>
    </div>

    <button class="ai-chat-trigger" id="ai-chat-trigger" title="Ask AarvJS AI">
        <i class="fa-solid fa-robot"></i>
    </button>
</div>
`;

// Inject HTML
document.body.insertAdjacentHTML('beforeend', aiChatHTML);

// DOM Elements
const widget = document.getElementById('ai-chat-widget');
const triggerBtn = document.getElementById('ai-chat-trigger');
const panel = document.getElementById('ai-chat-panel');
const closeBtn = document.getElementById('ai-close-btn');
const minBtn = document.getElementById('ai-min-btn');
const clearBtn = document.getElementById('ai-clear-btn');
const chatBody = document.getElementById('ai-chat-body');
const inputField = document.getElementById('ai-input');
const sendBtn = document.getElementById('ai-send-btn');
const micBtn = document.getElementById('ai-mic-btn');
const statusText = document.getElementById('ai-status-text');
const stopSpeakBtn = document.getElementById('ai-stop-speak-btn');
const waveform = document.getElementById('ai-waveform');

let isLoading = false;
let currentAbortController = null;

// --- AIVoice Initialization ---
if (window.AIVoice) {
    window.AIVoice.init({
        onStateChange: handleVoiceStateChange,
        onResult: handleVoiceResult,
        onError: handleVoiceError
    });
}

function handleVoiceStateChange(state) {
    // Reset classes
    micBtn.className = 'ai-action-btn';
    triggerBtn.className = 'ai-chat-trigger';
    panel.classList.remove('speaking-glow');
    stopSpeakBtn.style.display = 'none';
    waveform.style.display = 'none';

    switch (state) {
        case 'IDLE':
            statusText.innerText = 'Ready';
            micBtn.innerHTML = '<i class="fa-solid fa-microphone"></i>';
            break;
        case 'LISTENING':
            statusText.innerText = 'Listening...';
            micBtn.classList.add('listening');
            micBtn.innerHTML = '<i class="fa-solid fa-ear-listen"></i>';
            break;
        case 'PROCESSING':
            statusText.innerText = 'Processing...';
            micBtn.innerHTML = '<i class="fa-solid fa-microphone"></i>';
            showTyping();
            break;
        case 'SPEAKING':
            statusText.innerText = 'Speaking...';
            micBtn.innerHTML = '<i class="fa-solid fa-microphone"></i>';
            panel.classList.add('speaking-glow');
            stopSpeakBtn.style.display = 'inline-flex';
            waveform.style.display = 'flex';
            break;
        case 'ERROR':
            micBtn.innerHTML = '<i class="fa-solid fa-microphone"></i>';
            break;
    }
}

function handleVoiceResult(transcript) {
    inputField.value = transcript;
    handleSendMessage(transcript);
}

function handleVoiceError(errorMsg, code) {
    statusText.innerText = 'Error';
    addMessage(`<span style="color:#ff4757;"><i class="fa-solid fa-circle-exclamation"></i> ${errorMsg}</span>`, 'ai', true);
    if (code === 'not-supported') {
        inputField.focus();
    }
}

// --- UI Interaction ---
triggerBtn.addEventListener('click', () => {
    panel.classList.toggle('show');
    panel.classList.remove('minimized');
});

closeBtn.addEventListener('click', () => {
    panel.classList.remove('show');
    if (window.AIVoice) window.AIVoice.stopSpeaking();
});

minBtn.addEventListener('click', () => {
    panel.classList.toggle('minimized');
});

clearBtn.addEventListener('click', () => {
    const welcomeHtml = `
        <div class="ai-msg ai">
            <div class="ai-msg-content">Chat history cleared. How can I help you?</div>
            <div class="ai-msg-meta"><span class="ai-avatar"><i class="fa-solid fa-robot"></i></span> AarvJS AI</div>
        </div>
    `;
    chatBody.innerHTML = welcomeHtml;
    if (window.AIVoice) window.AIVoice.stopSpeaking();
});

micBtn.addEventListener('click', () => {
    if (window.AIVoice) window.AIVoice.startListening();
});

stopSpeakBtn.addEventListener('click', () => {
    if (window.AIVoice) window.AIVoice.stopSpeaking();
});

function scrollToBottom() {
    chatBody.scrollTop = chatBody.scrollHeight;
}

function addMessage(text, sender = 'user', isRawHtml = false) {
    const msgDiv = document.createElement('div');
    msgDiv.className = `ai-msg ${sender}`;

    const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    let contentHtml = isRawHtml ? text : escapeHTML(text);

    const avatarHtml = sender === 'user'
        ? `<span class="ai-avatar user-avatar"><i class="fa-solid fa-user"></i></span> You`
        : `<span class="ai-avatar"><i class="fa-solid fa-robot"></i></span> AarvJS AI`;

    msgDiv.innerHTML = `
        <div class="ai-msg-content">${contentHtml}</div>
        <div class="ai-msg-meta">${time} &bull; ${avatarHtml}</div>
    `;

    chatBody.appendChild(msgDiv);
    scrollToBottom();
}

function showTyping() {
    // Avoid multiple typing indicators
    hideTyping();
    const typingDiv = document.createElement('div');
    typingDiv.className = 'ai-msg ai typing-indicator-msg';
    typingDiv.innerHTML = `
        <div class="ai-msg-content">
            <div class="ai-typing-indicator">
                <div class="ai-typing-dot"></div>
                <div class="ai-typing-dot"></div>
                <div class="ai-typing-dot"></div>
            </div>
        </div>
    `;
    chatBody.appendChild(typingDiv);
    triggerBtn.classList.add('thinking');
    scrollToBottom();
}

function hideTyping() {
    const typingMsg = chatBody.querySelector('.typing-indicator-msg');
    if (typingMsg) typingMsg.remove();
    triggerBtn.classList.remove('thinking');
}

function escapeHTML(str) {
    return str.replace(/[&<>'"]/g,
        tag => ({
            '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;'
        }[tag])
    );
}

// Rich Content Formatting (Cards/Chips)
function formatAIResponse(text) {
    let formatted = text;
    formatted = formatted.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
    formatted = formatted.replace(/(https?:\/\/[^\s<]+)/g, function (match) {
        if (match.includes('href=')) return match;
        return `<a href="${match}" target="_blank" class="ai-link-btn">View Link <i class="fa-solid fa-arrow-up-right-from-square" style="font-size:10px; margin-left:4px;"></i></a>`;
    });

    const lines = formatted.split('\n');
    let html = '';
    let inList = false;
    let listType = 'none';
    let contextBuffer = '';

    for (let line of lines) {
        const trimmed = line.trim();
        if (!trimmed) continue;

        if (trimmed.startsWith('- ') || trimmed.startsWith('* ')) {
            if (!inList) {
                inList = true;
                const lowerContext = contextBuffer.toLowerCase();
                if (lowerContext.includes('project') || lowerContext.includes('service') || lowerContext.includes('contact')) {
                    listType = 'cards';
                    html += '<div class="ai-card-grid">';
                } else if (lowerContext.includes('skill') || lowerContext.includes('technolog')) {
                    listType = 'chips';
                    html += '<div class="ai-chip-container">';
                } else {
                    listType = 'normal';
                    html += '<ul>';
                }
            }

            let content = trimmed.substring(2).trim();
            if (listType === 'cards') {
                const parts = content.split(':');
                if (parts.length > 1) {
                    html += `<div class="ai-card"><strong>${parts[0]}</strong>${parts.slice(1).join(':')}</div>`;
                } else {
                    html += `<div class="ai-card">${content}</div>`;
                }
            } else if (listType === 'chips') {
                html += `<span class="ai-chip">${content}</span>`;
            } else {
                html += `<li>${content}</li>`;
            }
        } else {
            if (inList) {
                inList = false;
                if (listType === 'cards') html += '</div>';
                else if (listType === 'chips') html += '</div>';
                else html += '</ul>';
            }
            html += `<p>${trimmed}</p>`;
            contextBuffer += trimmed + ' ';
        }
    }

    if (inList) {
        if (listType === 'cards') html += '</div>';
        else if (listType === 'chips') html += '</div>';
        else html += '</ul>';
    }

    return html;
}

// --- Webhook & Fallback Logic ---
async function getAIResponse(userMessage) {
    console.log("[AarvJS AI] 1. Sending request to production webhook...");
    console.log("[AarvJS AI] Webhook URL:", WEBHOOK_URL);

    const payload = {
        question: userMessage
    };

    console.log("[AarvJS AI] Request Payload:", JSON.stringify(payload));

    const controller = new AbortController();
    const timeoutId = setTimeout(() => {
        console.error("[AarvJS AI] Timeout: Request took longer than 20 seconds.");
        controller.abort();
    }, 20000);

    try {
        // Send request to n8n webhook
        const response = await fetch(WEBHOOK_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload),
            signal: controller.signal
        });

        // Wait for response completely
        clearTimeout(timeoutId);

        console.log(`[AarvJS AI] 2. Webhook response status: ${response.status} ${response.statusText}`);

        if (!response.ok) {
            throw new Error(`Webhook HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();
        console.log("[AarvJS AI] 3. Webhook response data:", data);

        // Return data.answer
        if (data && data.answer) {
            return data.answer;
        } else if (data && data[0] && data[0].answer) {
            return data[0].answer;
        } else {
            throw new Error("AI response received but answer field is missing.");
        }

    } catch (error) {
        clearTimeout(timeoutId);

        // THEN ONLY FALLBACK
        console.error("[AarvJS AI] Webhook failed. Error details:", error.message || error);

        if (error.name === 'AbortError') {
            console.warn("[AarvJS AI] Reason: Webhook was too slow (AbortError/Timeout).");
        } else if (!navigator.onLine) {
            console.warn("[AarvJS AI] Reason: No internet connection.");
        }

        if (error.message === "AI response received but answer field is missing.") {
            return "AI response received but answer field is missing.";
        }

        console.warn("[AarvJS AI] 4. Triggering LOCAL fallback response ONLY because webhook failed.");
        return getFallbackResponse(userMessage);
    }
}

function getFallbackResponse(message) {
    const msg = message.toLowerCase();

    if (msg.includes('project') || msg.includes('portfolio') || msg.includes('work')) {
        return "**Projects:**\n- Resume ATS Platform: AI-powered resume builder\n- A Cube Technology: Startup website redesign\n- LocalSite Builder: SaaS website generator";
    } else if (msg.includes('skill') || msg.includes('tech') || msg.includes('stack')) {
        return "**Skills:**\n- HTML5\n- CSS3 & Tailwind\n- JavaScript (ES6+)\n- Next.js & React\n- Node.js\n- Python";
    } else if (msg.includes('contact') || msg.includes('hire') || msg.includes('email') || msg.includes('phone')) {
        return "**Contact Information:**\nYou can reach Arvind directly through the Contact Form at the bottom of the page or via his social profiles linked on the left.";
    } else if (msg.includes('service') || msg.includes('offer')) {
        return "**Services:**\n- Full Stack Web Development\n- AI Agent Integration\n- UI/UX Redesign\n- Responsive Web Apps";
    } else {
        return "I am currently experiencing connection issues to my server brain. However, I am AarvJS AI, and I can tell you Arvind is a fantastic Full Stack Developer. Please explore the sections of the portfolio to find what you are looking for!";
    }
}

async function handleSendMessage(message) {
    if (!message || message.trim() === '') return;

    // Prevent duplicate concurrent requests
    if (isLoading) {
        console.warn("[AarvJS AI] Blocked duplicate request while already processing.");
        return;
    }

    // 1. Start request
    addMessage(message, 'user');
    inputField.value = '';

    // 2. Set loading = true
    isLoading = true;

    if (window.AIVoice) window.AIVoice.setProcessing();
    showTyping(); // Shows the thinking/loading UI

    // 3. Wait for AI response fully
    const finalAnswer = await getAIResponse(message);

    // 4 & 5. Stop loading & show AI response
    isLoading = false;
    hideTyping(); // Stops the loading UI

    console.log("[AarvJS AI] 5. Outputting final response to UI.");
    addMessage(formatAIResponse(finalAnswer), 'ai', true);

    if (window.AIVoice) {
        window.AIVoice.speak(finalAnswer);
    } else {
        statusText.innerText = 'Ready';
    }
}

// Input Events
sendBtn.addEventListener('click', () => {
    handleSendMessage(inputField.value);
});

inputField.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        handleSendMessage(inputField.value);
    }
});
