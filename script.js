/* ═══════════════════════════════════════════════════════
   Smart City Dashboard — script.js
   ═══════════════════════════════════════════════════════ */

// ─── HuggingFace Token (read from environment variable during deployment) ───
const HF_TOKEN = (typeof process !== "undefined" && process.env) ? (process.env.HF_TOKEN || "") : "";

// ─── Global Data Stores ───
let weatherData = {};
let currencyData = {};
let citizenData = {};
let factData = {};

// ─── API Endpoints ───
const API = {
  weather:  "https://wttr.in/Pune?format=j1",
  currency: "https://open.er-api.com/v6/latest/USD",
  citizen:  "https://dummyjson.com/users/random",
  fact:     "https://uselessfacts.jsph.pl/api/v2/facts/random?language=en",
  hf:       "https://router.huggingface.co/v1/chat/completions",
};

/**
 * Fetch weather data from wttr.in
 */
async function fetchWeather() {
  const body = document.getElementById("weather-body");
  body.innerHTML = `<div class="loader"><div class="spinner"></div><span>Fetching weather…</span></div>`;

  try {
    const res = await fetch(API.weather);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    const cc = data.current_condition[0];

    // Update global store
    weatherData = {
      temperature: cc.temp_C,
      windspeed: cc.windspeedKmph,
      condition: cc.weatherDesc[0].value,
    };

    body.innerHTML = `
      <div class="data-big">
        <span class="data-big__number">${weatherData.temperature}°C</span>
        <span class="data-big__unit">${weatherData.condition}</span>
      </div>
      <div class="data-row">
        <span class="data-label">Wind Speed</span>
        <span class="data-value">${weatherData.windspeed} km/h</span>
      </div>
      <div class="data-row">
        <span class="data-label">Condition</span>
        <span class="data-value">${weatherData.condition}</span>
      </div>
    `;
  } catch (err) {
    console.error("Weather fetch failed:", err);
    body.innerHTML = `<p class="error-msg">⚠️ Weather unavailable</p>`;
  }
}

/**
 * Fetch currency exchange rates
 */
async function fetchCurrency() {
  const body = document.getElementById("currency-body");
  body.innerHTML = `<div class="loader"><div class="spinner"></div><span>Fetching rates…</span></div>`;

  try {
    const res = await fetch(API.currency);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();

    // Rates are USD-based → derive INR cross-rates
    const inrPerUsd = data.rates.INR;
    const inrToUsd = (1 / inrPerUsd).toFixed(4);
    const inrToEur = (1 / inrPerUsd * data.rates.EUR).toFixed(4);
    const inrToGbp = (1 / inrPerUsd * data.rates.GBP).toFixed(4);

    // Update global store
    currencyData = { usd: inrToUsd, eur: inrToEur, gbp: inrToGbp };

    body.innerHTML = `
      <div class="data-row">
        <span class="data-label">1 INR → USD</span>
        <span class="data-value">$${inrToUsd}</span>
      </div>
      <div class="data-row">
        <span class="data-label">1 INR → EUR</span>
        <span class="data-value">€${inrToEur}</span>
      </div>
      <div class="data-row">
        <span class="data-label">1 INR → GBP</span>
        <span class="data-value">£${inrToGbp}</span>
      </div>
    `;
  } catch (err) {
    console.error("Currency fetch failed:", err);
    body.innerHTML = `<p class="error-msg">⚠️ Failed to load currency data</p>`;
  }
}

/**
 * Fetch a random citizen profile
 */
async function fetchCitizen() {
  const body = document.getElementById("citizen-body");
  body.innerHTML = `<div class="loader"><div class="spinner"></div><span>Loading profile…</span></div>`;

  try {
    const res = await fetch("https://randomuser.me/api/");
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const json = await res.json();
    const user = json.results[0];

    const fullName = user.name.first + " " + user.name.last;

    // Update global store
    citizenData = {
      name: fullName,
      email: user.email,
      city: user.location.city,
      image: user.picture.large,
    };

    body.innerHTML = `
      <div class="profile-info">
        <img class="profile-img" src="${citizenData.image}" alt="${fullName}" />
        <div class="profile-details">
          <span class="profile-name">${fullName}</span>
          <span class="profile-location">📍 ${citizenData.city}</span>
          <span class="profile-email">✉️ ${citizenData.email}</span>
        </div>
      </div>
    `;
  } catch (err) {
    console.error("Citizen fetch failed:", err);
    body.innerHTML = `<p class="error-msg">⚠️ Citizen data unavailable</p>`;
  }
}

/**
 * Fetch a random fact
 */
async function fetchFact() {
  const body = document.getElementById("fact-body");
  body.innerHTML = `<div class="loader"><div class="spinner"></div><span>Finding a fact…</span></div>`;

  try {
    const res = await fetch(API.fact);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();

    // Update global store
    factData = { fact: data.text };

    body.innerHTML = `<p class="fact-text">"${data.text}"</p>`;
  } catch (err) {
    console.error("Fact fetch failed:", err);
    body.innerHTML = `<p class="error-msg">⚠️ Failed to load city fact</p>`;
  }
}

/* ═══════════════════════════════════════════════════════
   Refresh Handlers
   ═══════════════════════════════════════════════════════ */

function refreshWeather()  { fetchWeather();  }
function refreshCurrency() { fetchCurrency(); }
function refreshCitizen()  { fetchCitizen();  }
function refreshFact()     { fetchFact();     }

/* ═══════════════════════════════════════════════════════
   Chatbot
   ═══════════════════════════════════════════════════════ */

/**
 * Toggle chatbot window visibility
 */
function toggleChat() {
  const win = document.getElementById("chat-window");
  const fab = document.getElementById("fab-icon");
  const isOpen = win.classList.toggle("chat-window--open");
  fab.textContent = isOpen ? "✕" : "💬";

  if (isOpen) {
    document.getElementById("chat-input").focus();
  }
}

/**
 * Append a chat bubble to the message list
 */
function appendBubble(text, sender) {
  const container = document.getElementById("chat-messages");
  const bubble = document.createElement("div");
  bubble.className = `chat-bubble chat-bubble--${sender}`;

  const time = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  bubble.innerHTML = `<p>${text}</p><span class="chat-bubble__time">${time}</span>`;

  container.appendChild(bubble);
  container.scrollTop = container.scrollHeight;
}

/**
 * Show / hide typing indicator
 */
function showTyping() {
  const container = document.getElementById("chat-messages");
  const el = document.createElement("div");
  el.className = "typing-indicator";
  el.id = "typing-indicator";
  el.innerHTML = `<span></span><span></span><span></span>`;
  container.appendChild(el);
  container.scrollTop = container.scrollHeight;
}
function hideTyping() {
  const el = document.getElementById("typing-indicator");
  if (el) el.remove();
}

/**
 * Build the live context string from global variables
 */
function buildContext() {
  return `
You are a helpful Smart City assistant.

Answer ONLY based on this live dashboard data.

WEATHER:
Temperature ${weatherData.temperature}
Wind ${weatherData.windspeed}
Condition ${weatherData.condition}

CURRENCY:
1 INR = ${currencyData.usd} USD
1 INR = ${currencyData.eur} EUR
1 INR = ${currencyData.gbp} GBP

CITIZEN:
${citizenData.name}
${citizenData.city}
${citizenData.email}

CITY FACT:
${factData.fact}

If question is unrelated say:
"I only answer based on dashboard data."
`;
}

/**
 * Call HuggingFace Inference API
 */
async function askHF(question) {
  const liveContext = buildContext();

  const res = await fetch(API.hf, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${HF_TOKEN}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "Qwen/Qwen2.5-72B-Instruct",
      messages: [
        { role: "system", content: liveContext },
        { role: "user", content: question }
      ],
      max_tokens: 150
    }),
  });

  if (!res.ok) throw new Error(`HF API error: ${res.status}`);

  const data = await res.json();

  // If model is loading, retry after wait (for serverless inference)
  if (data.error && data.estimated_time) {
    const wait = Math.min(data.estimated_time * 1000, 30000);
    await new Promise((r) => setTimeout(r, wait));
    return askHF(question); // retry once
  }

  // Parse new OpenAI-compatible choices response
  if (data.choices && data.choices[0] && data.choices[0].message) {
    return data.choices[0].message.content.trim() || "I only know the dashboard data.";
  }

  return "I only know the dashboard data.";
}

/**
 * Send a user message and get an AI response
 */
async function sendMessage() {
  const input = document.getElementById("chat-input");
  const question = input.value.trim();

  // Guard: empty check
  if (!question) return;

  // Display user bubble
  appendBubble(question, "user");
  input.value = "";

  // Show typing indicator
  showTyping();

  try {
    const reply = await askHF(question);
    hideTyping();
    appendBubble(reply, "bot");
  } catch (err) {
    console.error("Chatbot error:", err);
    hideTyping();
    appendBubble("⚠️ AI unavailable right now. Please try again later.", "bot");
  }
}

/* ═══════════════════════════════════════════════════════
   Initialise on Page Load
   ═══════════════════════════════════════════════════════ */

window.onload = function () {
  // Set welcome chatbot timestamp
  const welcomeTime = document.getElementById("welcome-time");
  if (welcomeTime) {
    welcomeTime.textContent = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  }

  fetchWeather();
  fetchCurrency();
  fetchCitizen();
  fetchFact();
};
