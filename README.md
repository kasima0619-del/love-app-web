# LOVE APP — Web Prototype

**AISNS (AI + SNS)** — The AI layer above every social platform.

> One App. One World.  
> Developed by [合同会社LOVE](https://love-ap.net) · KASSI

---

## Overview

LOVE APP is a Next.js 15 prototype for the LOVE APP platform — an AI-powered super-app that connects LINE, WhatsApp, WeChat, Instagram, TikTok, and more under one roof, with AI Secretary **Nene** at its core.

This repository is the **web prototype** used for development demos and Kickstarter campaign material.

Official landing page: [love-ap.net](https://love-ap.net)

---

## Features (Prototype)

| Feature | Status |
|---|---|
| 🦉 AI Secretary Nene (Claude AI) | ✅ Working |
| 💬 Unified Messenger UI | ✅ UI Demo |
| 🏠 Dashboard | ✅ UI Demo |
| 📅 Schedule | ✅ UI Demo |
| 👥 Community | 🚧 In Progress |
| 📱 iOS / Android | 🚧 Planned |

---

## Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4
- **AI**: Anthropic Claude API (AI Secretary Nene)
- **Auth**: Mock (prototype phase — any input works)
- **Deploy**: Vercel

---

## Getting Started

### Prerequisites

- Node.js 20+
- npm

### Install

```bash
npm install
```

### Environment Variables

Create `.env.local`:

```env
# Anthropic Claude API (for AI Secretary Nene)
ANTHROPIC_API_KEY=your_key_here

# Optional: OpenAI fallback
OPENAI_API_KEY=your_key_here
```

### Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

### Build

```bash
npm run build
npm run start
```

---

## Project Structure

```
src/
├── app/
│   ├── (auth)/
│   │   └── login/          # Login page (prototype — any credentials work)
│   ├── api/
│   │   └── nene/           # AI Secretary Nene API endpoint
│   ├── dashboard/          # Main dashboard
│   ├── messages/           # Unified messenger
│   ├── nene/               # Nene chat interface
│   └── schedule/           # Schedule management
├── components/             # Shared UI components
└── lib/
    └── server/
        └── ai.ts           # AI provider abstraction (Claude / OpenAI)
```

---

## AI Secretary Nene

Nene is powered by Anthropic Claude and supports:

- SNS post creation (Instagram, TikTok, X, YouTube, LINE)
- Multi-language translation (JP / EN / ZH / KO / ES)
- Schedule creation & management
- Business consulting
- Learning support
- Mental support

API endpoint: `POST /api/nene`

```json
{
  "messages": [{ "role": "user", "text": "Instagramの投稿文を作って" }],
  "userName": "KASSI"
}
```

---

## Team

| Name | Role |
|---|---|
| KASSI | Founder & CEO |
| Nene | AI Secretary & CMO |
| KURO | CTO (AI Development Partner) |
| MIKA | Creative Designer |

---

## Links

- Official Site: [love-ap.net](https://love-ap.net)
- Kickstarter: [love-ap.net/kickstarter](https://love-ap.net/kickstarter)
- Pitch Deck: [love-ap.net/pitch-deck](https://love-ap.net/pitch-deck)
- App Preview: [love-ap.net/app-preview](https://love-ap.net/app-preview)

---

## License

© 2026 合同会社LOVE. All rights reserved.
