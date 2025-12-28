# 🏥 MedTranslate - Healthcare Translation Web App

A real-time, multilingual communication tool designed to bridge language barriers between healthcare providers and patients. Built with accessibility and ease-of-use in mind.

![Healthcare Translation App](https://img.shields.io/badge/Healthcare-Translation-0ea5e9?style=for-the-badge)
![React](https://img.shields.io/badge/React-18-61dafb?style=for-the-badge&logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178c6?style=for-the-badge&logo=typescript)

---

## 📋 Table of Contents

- [Overview](#overview)
- [Features](#features)
- [How It Works](#how-it-works)
- [Step-by-Step Usage Guide](#step-by-step-usage-guide)
- [Supported Languages](#supported-languages)
- [Technical Requirements](#technical-requirements)
- [Local Development](#local-development)
- [Deployment Options](#deployment-options)
- [Privacy & Security](#privacy--security)
- [Troubleshooting](#troubleshooting)

---

## 🎯 Overview

**MedTranslate** is a web-based application that enables real-time voice translation between healthcare providers and patients who speak different languages. The app uses AI-powered speech recognition, medical terminology correction, and natural-sounding text-to-speech to facilitate clear, accurate medical communication.

### Use Cases

- 🏨 **Hospitals & Clinics** - Doctor-patient consultations
- 🚑 **Emergency Rooms** - Quick communication with non-English speaking patients
- 💊 **Pharmacies** - Explaining medication instructions
- 🏠 **Home Healthcare** - Caregiver-patient communication
- 📞 **Telehealth** - Remote medical consultations

---

## ✨ Features

| Feature | Description |
|---------|-------------|
| 🎤 **Voice Recording** | Record speech with a single tap |
| 🧠 **AI Medical Correction** | Automatically corrects medical terminology (e.g., "met form in" → "Metformin") |
| 🌐 **Multi-Language Translation** | Supports 10+ languages with medical accuracy |
| 🔊 **Natural Text-to-Speech** | Listen to translations with native-sounding voices |
| 🔄 **Language Swap** | Instantly swap provider/patient languages |
| 🗑️ **Session Clear** | One-click privacy protection - clears all data |
| 📱 **Mobile-First Design** | Works perfectly on phones, tablets, and desktops |
| 🔒 **Privacy-Focused** | No data stored on servers - completely stateless |

---

## 🔧 How It Works

```
┌─────────────────────────────────────────────────────────────────┐
│                        MedTranslate Flow                        │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  1. SPEAK          2. TRANSCRIBE       3. CORRECT               │
│  ┌─────────┐       ┌─────────────┐     ┌──────────────┐         │
│  │   🎤    │  ───▶ │ Speech-to-  │ ──▶ │ AI Medical   │         │
│  │  Voice  │       │    Text     │     │ Terminology  │         │
│  └─────────┘       └─────────────┘     │  Correction  │         │
│                                        └──────────────┘         │
│                                               │                 │
│                                               ▼                 │
│  6. LISTEN         5. SPEAK            4. TRANSLATE             │
│  ┌─────────┐       ┌─────────────┐     ┌──────────────┐         │
│  │   👂    │  ◀─── │ Text-to-    │ ◀── │ AI Medical   │         │
│  │ Patient │       │   Speech    │     │ Translation  │         │
│  └─────────┘       └─────────────┘     └──────────────┘         │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

## 📖 Step-by-Step Usage Guide

### Getting Started

1. **Open the App**
   - Navigate to the app URL in your web browser
   - Works best on Chrome, Edge, or Safari

2. **Allow Microphone Access**
   - When prompted, click "Allow" to enable microphone access
   - This is required for voice recording

### For Healthcare Providers

#### Step 1: Select Your Language
- In the **blue "Provider" section** (left/top)
- Click the language dropdown
- Select your spoken language (e.g., "English")

#### Step 2: Select Patient's Language
- In the **teal "Patient" section** (right/bottom)
- Click the language dropdown
- Select the patient's language (e.g., "Spanish")

#### Step 3: Record Your Message
1. Click the **"Start Recording"** button in your section
2. Speak clearly into your device's microphone
3. Click **"Stop Recording"** when finished
4. Wait for the AI to process and translate

#### Step 4: Play Translation for Patient
- The translation appears in the Patient section
- Click the **speaker icon (🔊)** to play the translation aloud
- The patient hears the message in their language

### For Patients (Responding)

#### Step 1: Record Response
1. Click **"Start Recording"** in the Patient section
2. Speak in your native language
3. Click **"Stop Recording"**

#### Step 2: Provider Listens
- The translation appears in the Provider section
- Provider clicks the **speaker icon** to hear the response

### Quick Actions

| Button | Location | Action |
|--------|----------|--------|
| 🔄 **Swap** | Header | Swaps provider/patient languages |
| 🗑️ **Clear** | Header | Erases all transcripts (privacy) |
| 🔊 **Speaker** | Each panel | Plays the text aloud |
| ⏹️ **Stop** | Each panel | Stops audio playback |

---

## 🌍 Supported Languages

| Language | Native Name | Flag |
|----------|-------------|------|
| English | English | 🇺🇸 |
| Spanish | Español | 🇪🇸 |
| French | Français | 🇫🇷 |
| German | Deutsch | 🇩🇪 |
| Italian | Italiano | 🇮🇹 |
| Portuguese | Português | 🇧🇷 |
| Chinese (Mandarin) | 中文 | 🇨🇳 |
| Japanese | 日本語 | 🇯🇵 |
| Korean | 한국어 | 🇰🇷 |
| Arabic | العربية | 🇸🇦 |
| Hindi | हिन्दी | 🇮🇳 |
| Russian | Русский | 🇷🇺 |

---

## 💻 Technical Requirements

### Browser Support
- ✅ Google Chrome (recommended)
- ✅ Microsoft Edge
- ✅ Safari
- ✅ Firefox
- ⚠️ Mobile browsers (Chrome/Safari)

### Device Requirements
- 🎤 Microphone (built-in or external)
- 🔊 Speakers or headphones
- 🌐 Internet connection

### Minimum Specifications
- Any modern smartphone, tablet, or computer
- 2GB RAM minimum
- Stable internet connection (3G or better)

---

## 🛠️ Local Development

### Prerequisites
- Node.js 18+ installed
- npm or bun package manager

### Setup Steps

```bash
# 1. Clone the repository
git clone <your-repo-url>

# 2. Navigate to project directory
cd <project-name>

# 3. Install dependencies
npm install

# 4. Start development server
npm run dev

# 5. Open in browser
# Navigate to http://localhost:5173
```

### Build for Production

```bash
# Create optimized build
npm run build

# Preview production build
npm run preview
```

### Deployed on Vercel
Link: [https://vercel.com/](https://medispeak-connect-3cox.vercel.app/)
---


## 🔒 Privacy & Security

### Data Handling

| Aspect | Implementation |
|--------|----------------|
| **Data Storage** | ❌ No data stored on servers |
| **Session Data** | Cleared on page refresh or "Clear Session" |
| **Audio Files** | Processed in-memory, never saved |
| **Transcripts** | Exist only in browser memory |

### HIPAA Considerations

⚠️ **Important:** While this app is designed with privacy in mind, for full HIPAA compliance in a production healthcare environment, you should:

1. Deploy on HIPAA-compliant infrastructure
2. Implement user authentication
3. Add audit logging
4. Sign a BAA with your cloud provider
5. Consult with a compliance officer

### Best Practices

- ✅ Clear session after each patient
- ✅ Use on secure, private networks
- ✅ Ensure device has updated security patches
- ✅ Don't leave the app unattended with patient data visible

---

## ❓ Troubleshooting

### Microphone Not Working

1. **Check browser permissions**
   - Click the lock icon in the address bar
   - Ensure microphone is set to "Allow"

2. **Check system permissions**
   - Windows: Settings → Privacy → Microphone
   - Mac: System Preferences → Security & Privacy → Microphone
   - Mobile: Settings → App Permissions → Microphone

3. **Try a different browser**
   - Chrome typically has the best support

### Audio Not Playing

1. **Check volume settings**
   - Ensure device volume is up
   - Check if browser tab is muted

2. **Try headphones**
   - Some devices block autoplay through speakers

---

## 📄 License

This project is open-source. Feel free to use, modify, and distribute.

---

## 🤝 Support

For issues or feature requests, please open a GitHub issue or contact the development team.

---

<p align="center">
  Made with ❤️ for better healthcare communication
</p>
