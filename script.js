const API_URL = "https://openai-proxy-ucgy.onrender.com/v1/responses";
let lastAIMessage = "";

/* ---------- ОТПРАВКА СООБЩЕНИЯ ---------- */
async function sendMessage() {
    const input = document.getElementById("userInput");
    const text = input.value.trim();
    if (!text) return;
    input.value = "";

    addMessage(text, "user");

    const response = await fetch(API_URL, {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({
            model: "gpt-4o-mini",
            input: text
        })
    });

    const data = await response.json();
    const ai = data.output[0].content[0].text;

    addMessage(ai, "ai");
    lastAIMessage = ai;
}

/* ---------- ДОБАВЛЕНИЕ СООБЩЕНИЙ ---------- */
function addMessage(text, role) {
    const chat = document.getElementById("chat");
    const div = document.createElement("div");
    div.className = "msg " + role;
    div.textContent = text;
    chat.appendChild(div);
    chat.scrollTop = chat.scrollHeight;
}

/* ---------- ОЗВУЧКА ---------- */
function speakLast() {
    if (!lastAIMessage) return;
    speak(lastAIMessage);
}

function speak(text) {
    const utter = new SpeechSynthesisUtterance(text);
    const voiceSelect = document.getElementById("voiceSelect").value;

    utter.lang = "ru-RU";
    utter.pitch = 1;

    // выбор голоса
    const voices = speechSynthesis.getVoices();
    if (voiceSelect === "male") {
        utter.voice = voices.find(v => v.name.includes("Male")) || null;
    } else {
        utter.voice = voices.find(v => v.name.includes("Female")) || null;
    }

    speechSynthesis.speak(utter);
}

/* ---------- ГОЛОСОВОЙ ВВОД ---------- */
function voiceInput() {
    const Rec = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!Rec) return alert("Голосовой ввод не поддерживается.");

    const rec = new Rec();
    rec.lang = "ru-RU";
    rec.start();

    rec.onresult = e => {
        document.getElementById("userInput").value = e.results[0][0].transcript;
    };
}

/* ---------- ТЕМЫ ---------- */
function toggleTheme() {
    const body = document.body;
    body.classList.toggle("light");
    body.classList.toggle("dark");
}

/* ---------- МЕНЮ НАСТРОЕК ---------- */
function toggleSettings() {
    document.getElementById("settingsPanel").classList.toggle("show");
}
