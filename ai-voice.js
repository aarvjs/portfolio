// ai-voice.js - AarvJS AI Voice Module
// Handles all Speech Recognition and Synthesis logic

window.AIVoice = (function() {
    let recognition = null;
    let synthesis = window.speechSynthesis;
    let isSupported = false;
    
    // States: IDLE, LISTENING, PROCESSING, SPEAKING, ERROR
    let currentState = 'IDLE';
    let stateChangeCallback = null;
    let resultCallback = null;
    let errorCallback = null;
    
    let debounceTimer = null;
    let retryCount = 0;
    
    function init(callbacks) {
        stateChangeCallback = callbacks.onStateChange || (() => {});
        resultCallback = callbacks.onResult || (() => {});
        errorCallback = callbacks.onError || (() => {});
        
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        if (SpeechRecognition) {
            isSupported = true;
            recognition = new SpeechRecognition();
            recognition.continuous = false; // Auto stops after one sentence (better for flow)
            recognition.lang = 'en-US';
            recognition.interimResults = false;
            
            recognition.onstart = () => {
                retryCount = 0;
                setState('LISTENING');
                stopSpeaking(); // Prevent AI speaking while listening
            };
            
            recognition.onresult = (event) => {
                const transcript = event.results[0][0].transcript;
                setState('PROCESSING');
                resultCallback(transcript);
            };
            
            recognition.onerror = (event) => {
                let errorMsg = 'Error occurred';
                if (event.error === 'not-allowed') {
                    errorMsg = 'Microphone permission denied. Please allow microphone access or type your message.';
                } else if (event.error === 'no-speech') {
                    errorMsg = 'No speech detected. Please try again.';
                } else if (event.error === 'network') {
                    errorMsg = 'Network error during speech recognition.';
                } else {
                    errorMsg = `Speech recognition error: ${event.error}`;
                }
                
                setState('ERROR');
                errorCallback(errorMsg, event.error);
                
                // Automatically return to idle
                setTimeout(() => {
                    if (currentState === 'ERROR') setState('IDLE');
                }, 3000);
            };
            
            recognition.onend = () => {
                // If stopped unexpectedly while still listening
                if (currentState === 'LISTENING') {
                    setState('IDLE');
                }
            };
            
            // Warmup voices
            if (synthesis) {
                synthesis.onvoiceschanged = () => synthesis.getVoices();
            }
        } else {
            console.warn("Speech Recognition not supported in this browser.");
        }
    }
    
    function setState(newState) {
        if (currentState === newState) return;
        currentState = newState;
        stateChangeCallback(newState);
    }
    
    function startListening() {
        if (!isSupported) {
            errorCallback("Voice recognition is not supported in this browser. Switching to typing mode.", "not-supported");
            setState('ERROR');
            setTimeout(() => setState('IDLE'), 3000);
            return;
        }
        
        if (currentState === 'LISTENING') {
            stopListening();
            return;
        }
        
        // Debounce protection to prevent rapid repeated clicks
        if (debounceTimer) return;
        debounceTimer = setTimeout(() => { debounceTimer = null; }, 500);
        
        stopSpeaking(); // Immediately cut off AI voice
        
        try {
            recognition.start();
        } catch (e) {
            console.warn("Recognition start overlap. Restarting...", e);
            recognition.stop();
            setTimeout(() => {
                if(currentState !== 'LISTENING') recognition.start();
            }, 300);
        }
    }
    
    function stopListening() {
        if (recognition && currentState === 'LISTENING') {
            recognition.stop();
            setState('IDLE');
        }
    }
    
    function speak(text) {
        if (!synthesis) return;
        
        stopSpeaking(); // Safely cancel previous speech
        
        // Clean text formatting
        let cleanText = text.replace(/<[^>]*>?/gm, ''); // remove HTML
        cleanText = cleanText.replace(/\*\*/g, ''); // remove markdown
        
        const utterance = new SpeechSynthesisUtterance(cleanText);
        utterance.rate = 1.05; // Slightly faster for natural feel
        utterance.pitch = 1.0;
        
        const voices = synthesis.getVoices();
        const preferredVoice = voices.find(v => 
            v.name.includes('Google US English') || 
            v.name.includes('Microsoft Mark') || 
            v.name.includes('Samantha') || 
            v.lang === 'en-US'
        );
        
        if (preferredVoice) utterance.voice = preferredVoice;
        
        utterance.onstart = () => {
            setState('SPEAKING');
        };
        
        utterance.onend = () => {
            if (currentState === 'SPEAKING') setState('IDLE');
        };
        
        utterance.onerror = (e) => {
            console.error('Speech synthesis error:', e);
            if (currentState === 'SPEAKING') setState('IDLE');
        };
        
        synthesis.speak(utterance);
    }
    
    function stopSpeaking() {
        if (synthesis && synthesis.speaking) {
            synthesis.cancel();
            if (currentState === 'SPEAKING') setState('IDLE');
        }
    }
    
    function setProcessing() {
        setState('PROCESSING');
    }
    
    return {
        init,
        startListening,
        stopListening,
        speak,
        stopSpeaking,
        setProcessing,
        isSupported: () => isSupported,
        getState: () => currentState
    };
})();
