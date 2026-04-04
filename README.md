# 🏙️ Smart City Citizen Information Dashboard

A modern, real-time citizen information dashboard built with **vanilla HTML, CSS & JavaScript**. It pulls live data from four public APIs and includes an AI-powered chatbot that answers questions using the dashboard's live data.

![Dashboard Preview](https://img.shields.io/badge/status-production--ready-brightgreen)

---

## ✨ Features

| Feature | Details |
|---|---|
| 🌤️ **Weather** | Live temperature, wind speed & weather conditions (Pune, India) |
| 💱 **Currency** | Real-time INR → USD / EUR / GBP exchange rates |
| 👤 **Citizen Profile** | Random citizen with photo, name, email & city |
| 💡 **City Fact** | Random fun fact displayed as "City Fact of the Day" |
| 🤖 **AI Chatbot** | Context-aware assistant powered by Mistral-7B via HuggingFace |
| 🔄 **Refresh** | Each card has an independent refresh button |
| 📱 **Responsive** | Fully responsive on mobile, tablet & desktop |

---

## 🗂️ Project Structure

```
/project
├── index.html       # Main page with dashboard layout & chatbot UI
├── style.css        # Complete design system (dark mode, animations)
├── script.js        # All logic: fetch, refresh, chatbot, HF integration
├── .env.example     # Environment variable template
└── README.md        # This file
```

---

## 🔑 APIs Used

| Card | API | Auth |
|---|---|---|
| Weather | [Open-Meteo](https://open-meteo.com/) | None |
| Currency | [ExchangeRate-API](https://open.er-api.com/) | None |
| Citizen | [Random User](https://randomuser.me/) | None |
| Fact | [Useless Facts](https://uselessfacts.jsph.pl/) | None |
| Chatbot | [HuggingFace Inference](https://huggingface.co/inference-api) | API Token |

---

## 🔐 Environment Setup

### Create `.env` file locally

Copy the example file and add your real token:

```bash
cp .env.example .env
```

Then edit `.env`:

```
HF_TOKEN=your_huggingface_token_here
```

> ⚠️ **Never commit your `.env` file to Git.** Add it to `.gitignore`.

### How the token is used

In `script.js`, the token is read via environment variable:

```js
const HF_TOKEN = process.env.HF_TOKEN || "";
```

This is used in the `askHF()` function:

```js
Authorization: `Bearer ${HF_TOKEN}`
```

No API key is hardcoded anywhere in the source code.

---

## 🚀 Vercel Deployment Guide

### Step 1 — Get a HuggingFace Token

1. Create an account at [huggingface.co](https://huggingface.co)
2. Go to **Settings → Access Tokens**
3. Create a new token with **Read** access
4. Copy the token

### Step 2 — Push to GitHub

```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO.git
git push -u origin main
```

### Step 3 — Add Environment Variable (HF_TOKEN)

1. In your Vercel project, go to **Settings → Environment Variables**
2. Add a new variable:

   | Name | Value |
   |---|---|
   | `HF_TOKEN` | `hf_xxxxxxxxxxxxxxxxxxxx` |

3. Click **Save**

### Step 4 — Set the Build Command (Crucial for Vanilla JS)

Because this is a Vanilla JS project, Vercel won't automatically inject `process.env`. We dynamically generate an `env.js` file during deployment instead!

1. Go to **Settings → General → Build & Development Settings**
2. Turn on the **Build Command** override toggle.
3. Set the build command to exactly this:
   ```bash
   echo "window.process = { env: { HF_TOKEN: '$HF_TOKEN' } };" > env.js
   ```
4. Click **Save**

### Step 5 — Redeploy

Go to **Deployments** and click **Redeploy** to apply the environment variable and build command.

---

## 🧪 Run Locally

Simply open `index.html` in a browser. 

For the chatbot to work locally, verify that `env.js` has been created securely mirroring your true API key like:
```javascript
window.process = { env: { HF_TOKEN: "hf_your_key..." } };
```

---

## 🔒 Security

- The HuggingFace API token is **never hardcoded** in any file
- No API key appears in `index.html`
- The token is referenced **only** via `process.env.HF_TOKEN` in `script.js`
- The `.env.example` file shows the required variable without exposing secrets
- Add `.env` to `.gitignore` to prevent accidental commits

---

## 🛠️ Tech Stack

- **HTML5** — Semantic markup
- **CSS3** — Custom properties, gradients, glassmorphism, animations
- **Vanilla JavaScript** — async/await, Fetch API, DOM manipulation
- **HuggingFace** — Mistral-7B-Instruct-v0.2 for AI chat

---

## 📄 License

MIT © 2026
