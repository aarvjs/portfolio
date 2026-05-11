// Webhook URL Placeholder
const WEBHOOK_URL = "https://aarvjs01.app.n8n.cloud/webhook-test/portfolio-ai-assistant";

// Create HTML structure dynamically
const aiAssistantHTML = `
    <button id="ai-assistant-btn" title="Ask Arvind AI">
        <i class="fa-solid fa-robot"></i>
    </button>

    <div id="ai-assistant-panel">
        <div class="ai-header">
            <h3><i class="fa-solid fa-robot"></i> Ask Arvind AI</h3>
            <button class="ai-close-btn" id="ai-close-btn" title="Close"><i class="fa-solid fa-xmark"></i></button>
        </div>
        <div class="ai-body">
            <div class="ai-response" id="ai-response">
                Hi! I am Arvind's AI Assistant. Click the microphone below and ask me anything about his portfolio, skills, or projects.
            </div>
        </div>
        <div class="ai-controls">
            <div class="ai-status" id="ai-status">Tap mic to start speaking</div>
            <button class="ai-mic-btn" id="ai-mic-btn" title="Hold/Tap to Speak">
                <i class="fa-solid fa-microphone"></i>
            </button>
            <div class="ai-wave-container" id="ai-wave-container">
                <div class="ai-wave"></div>
                <div class="ai-wave"></div>
                <div class="ai-wave"></div>
                <div class="ai-wave"></div>
                <div class="ai-wave"></div>
            </div>
        </div>
    </div>
`;

// Inject HTML to body
document.body.insertAdjacentHTML('beforeend', aiAssistantHTML);

// DOM Elements
const aiBtn = document.getElementById('ai-assistant-btn');
const aiPanel = document.getElementById('ai-assistant-panel');
const aiCloseBtn = document.getElementById('ai-close-btn');
const aiMicBtn = document.getElementById('ai-mic-btn');
const aiResponse = document.getElementById('ai-response');
const aiStatus = document.getElementById('ai-status');

// Toggle Panel
aiBtn.addEventListener('click', () => {
    aiPanel.classList.toggle('show');
    if (aiPanel.classList.contains('show')) {
        aiPanel.style.display = 'flex';
        // Small delay for CSS transition to trigger
        setTimeout(() => {
            aiPanel.style.opacity = '1';
            aiPanel.style.transform = 'translateY(0) scale(1)';
        }, 10);
    } else {
        closeAIPanel();
    }
});

aiCloseBtn.addEventListener('click', closeAIPanel);

function closeAIPanel() {
    aiPanel.classList.remove('show');
    aiPanel.style.opacity = '0';
    aiPanel.style.transform = 'translateY(20px) scale(0.95)';
    setTimeout(() => {
        aiPanel.style.display = 'none';
        stopSpeech(); // Stop speech if talking when closed
    }, 300);
}

// Speech Recognition Setup
const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
let recognition = null;

if (SpeechRecognition) {
    recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.lang = 'en-US';
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    recognition.onstart = function () {
        aiMicBtn.classList.add('listening');
        aiStatus.innerText = 'Listening...';
        aiResponse.innerHTML = '<em>Listening to your question...</em>';
        stopSpeech(); // Stop any ongoing speech
    };

    recognition.onresult = function (event) {
        const transcript = event.results[0][0].transcript;
        aiStatus.innerText = 'Processing...';
        aiResponse.innerHTML = `<strong>You:</strong> ${transcript}<br><br><em>Thinking...</em>`;
        sendToWebhook(transcript);
    };

    recognition.onerror = function (event) {
        aiMicBtn.classList.remove('listening');
        if (event.error === 'not-allowed') {
            aiStatus.innerText = 'Mic permission denied.';
            aiResponse.innerHTML = '<span style="color:#ff6b6b;">Please allow microphone access to use the voice assistant.</span>';
        } else if (event.error === 'no-speech') {
            aiStatus.innerText = 'No speech detected.';
            aiResponse.innerText = 'I could not hear anything. Please try again.';
        } else {
            aiStatus.innerText = 'Error occurred.';
            aiResponse.innerText = `Error: ${event.error}`;
        }
    };

    recognition.onend = function () {
        aiMicBtn.classList.remove('listening');
        if (aiStatus.innerText === 'Listening...') {
            aiStatus.innerText = 'Tap mic to start speaking';
        }
    };
} else {
    aiMicBtn.style.display = 'none';
    aiStatus.innerText = 'Speech Recognition not supported in this browser.';
}

// Mic Button Click
aiMicBtn.addEventListener('click', () => {
    if (!SpeechRecognition) {
        alert("Your browser does not support Voice Recognition. Please try Google Chrome.");
        return;
    }

    if (aiMicBtn.classList.contains('listening')) {
        recognition.stop();
    } else {
        try {
            recognition.start();
        } catch (e) {
            console.error("Recognition start error:", e);
        }
    }
});

// Webhook Request
async function sendToWebhook(question) {
    if (!question || question.trim() === '') {
        aiStatus.innerText = 'Empty question.';
        aiResponse.innerText = 'I did not catch that. Please try again.';
        return;
    }

    try {
        const response = await fetch(WEBHOOK_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            // Assuming webhook expects 'question', but also sending 'text' just in case.
            body: JSON.stringify({ question: question, text: question })
        });

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();

        // Parse n8n response format
        let answer = "Sorry, I could not process the response.";
        if (data && data.answer) {
            answer = data.answer;
        } else if (data && data[0] && data[0].answer) {
            answer = data[0].answer;
        } else if (typeof data === 'string') {
            answer = data;
        } else {
            // Fallback for generic JSON
            answer = JSON.stringify(data);
        }

        aiResponse.innerHTML = `<strong>You:</strong> ${question}<br><br><strong>Arvind AI:</strong> ${answer}`;
        aiStatus.innerText = 'Tap mic to speak again';

        // Speak the answer
        speakText(answer);

        // Auto scroll to bottom
        const aiBody = document.querySelector('.ai-body');
        aiBody.scrollTop = aiBody.scrollHeight;

    } catch (error) {
        console.error('Webhook error:', error);
        aiStatus.innerText = 'Network error.';
        aiResponse.innerHTML = `<strong>You:</strong> ${question}<br><br><span style="color:#ff6b6b;">Error: Could not connect to the AI server. Please check your network or try again later.</span>`;
    }
}

// Speech Synthesis
function speakText(text) {
    if ('speechSynthesis' in window) {
        stopSpeech(); // Stop current speech before starting new

        // Remove HTML tags for speaking, decode entities
        let tempDiv = document.createElement("div");
        tempDiv.innerHTML = text;
        const cleanText = tempDiv.textContent || tempDiv.innerText || "";

        const utterance = new SpeechSynthesisUtterance(cleanText);
        utterance.rate = 1.0; // Normal speed
        utterance.pitch = 1.0;
        utterance.volume = 1.0;

        // Select a good English voice if available
        const voices = speechSynthesis.getVoices();
        const preferredVoice = voices.find(voice =>
            voice.name.includes('Google US English') ||
            voice.name.includes('Microsoft Mark') ||
            voice.lang === 'en-US'
        );
        if (preferredVoice) {
            utterance.voice = preferredVoice;
        }

        speechSynthesis.speak(utterance);
    }
}

function stopSpeech() {
    if ('speechSynthesis' in window && speechSynthesis.speaking) {
        speechSynthesis.cancel();
    }
}

// Make sure voices are loaded (Chrome sometimes needs this)
if ('speechSynthesis' in window) {
    speechSynthesis.onvoiceschanged = function () {
        speechSynthesis.getVoices();
    };
}
