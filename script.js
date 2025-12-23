const socket = io('http://localhost:5000'); // This stays here!

const form = document.getElementById('chat-form');
const input = document.getElementById('message-input');
const messagesDiv = document.getElementById('messages');
const themeToggle = document.getElementById('theme-toggle');
const voiceToggle = document.getElementById('voice-toggle');
const languageSelect = document.getElementById('language-select');

let voiceEnabled = false;

// Dark Mode logic
themeToggle.addEventListener('click', () => {
    const html = document.documentElement;
    const isLight = html.getAttribute('data-theme') === 'light';
    html.setAttribute('data-theme', isLight ? 'dark' : 'light');
    themeToggle.innerText = isLight ? '☀️ Light Mode' : '🌙 Dark Mode';
});

// Voice Logic
voiceToggle.addEventListener('click', () => {
    voiceEnabled = !voiceEnabled;
    voiceToggle.innerText = voiceEnabled ? "🔊" : "🔈";
});

function speakMessage(text) {
    if (voiceEnabled && window.speechSynthesis) {
        const utterance = new SpeechSynthesisUtterance(text);
        const langMap = { 'en': 'en-US', 'mr': 'mr-IN', 'hi': 'hi-IN' };
        utterance.lang = langMap[languageSelect.value] || 'en-US';
        window.speechSynthesis.speak(utterance);
    }
}

form.addEventListener('submit', (e) => {
    e.preventDefault();
    if (input.value.trim()) {
        socket.emit('chat message', input.value);
        input.value = '';
    }
});

socket.on('chat message', (data) => {
    const type = (data.sender === 'me') ? 'sent' : 'received';
    addMessageToUI(data.text, type);
    if (type === 'received') speakMessage(data.text);
});

function addMessageToUI(text, type) {
    const item = document.createElement('div');
    item.textContent = text;
    item.className = `message ${type}`; 
    messagesDiv.appendChild(item);
    messagesDiv.scrollTop = messagesDiv.scrollHeight;
}