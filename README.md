<div align="center">

# 🎨 Chrom<span>ai</span>

### AI-powered color palette generator

Describe the atmosphere you want in a few words — Chromai instantly crafts custom, harmonious color palettes for you in seconds.

[![Next.js](https://img.shields.io/badge/Next.js-16-000000?logo=nextdotjs&logoColor=white)](https://nextjs.org)
[![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=black)](https://react.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-4-06B6D4?logo=tailwindcss&logoColor=white)](https://tailwindcss.com)
[![OpenRouter](https://img.shields.io/badge/AI-OpenRouter-8b5cf6)](https://openrouter.ai)
[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](#-license)

[Live Demo](https://chromai.app) · [Features](#-features) · [Getting Started](#-getting-started) · [How It Works](#%EF%B8%8F-how-it-works)

</div>

---

## ✨ About

**Chromai** is a web app that turns color decisions into seconds. You type the mood or scene you have in mind (for example *"seaside café at sunset"* or *"minimal tech startup"*), and the AI model running behind the scenes generates **3 different color palettes** that fit that atmosphere. Each palette contains **2 harmonious colors**, a short description, and a usage suggestion.

Built for designers, developers, and creative professionals — it pairs color intuition with the speed of AI.

## 🚀 Features

- 🧠 **AI palette generation** — Describe an atmosphere in natural language and get harmonious palettes instantly
- 🎚️ **Multiple AI models** — Free and premium tiers with many models (Gemini, GPT, Claude, DeepSeek, MiniMax, Kimi, MiMo…)
- 🔑 **Your own OpenRouter key** — Unlock premium models with a personal key stored securely in your browser
- 🌍 **Multilingual UI** — Turkish, English, and German (i18n)
- 🌗 **Light / dark theme** — Automatic system-theme matching via `next-themes`
- 🎨 **Neumorphic UI** — A modern, animated design system with soft shadows
- 📋 **Copy & use** — Copy HEX codes with a single click
- 🛟 **Smart fallback** — Keeps working by falling back to a local palette library when the API is unavailable
- 🔍 **SEO-ready** — Includes `sitemap`, `robots`, `manifest`, and JSON-LD structured data

## 🛠️ Tech Stack

| Layer | Technologies |
| --- | --- |
| **Framework** | [Next.js 16](https://nextjs.org) (App Router), [React 19](https://react.dev) |
| **Language** | [TypeScript](https://www.typescriptlang.org) |
| **Styling** | [Tailwind CSS v4](https://tailwindcss.com), `tw-animate-css`, neumorphic design system |
| **UI Components** | [shadcn/ui](https://ui.shadcn.com), [Radix UI](https://www.radix-ui.com), [Iconify](https://iconify.design), `sonner` (toasts) |
| **AI** | [OpenRouter](https://openrouter.ai) Chat Completions API |
| **Theme & i18n** | `next-themes`, custom i18n store (tr / en / de) |
| **Package Manager** | [Bun](https://bun.sh) (npm / pnpm / yarn also work) |

## 📦 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org) 18+ or [Bun](https://bun.sh)
- An [OpenRouter API key](https://openrouter.ai/keys) (for AI generation)

### Steps

```bash
# 1. Clone the repository
git clone https://github.com/musayazlik/chromai.git
cd chromai

# 2. Install dependencies
bun install      # or: npm install / pnpm install

# 3. Set up environment variables (see below)
cp .env.example .env   # or create the .env file manually

# 4. Start the development server
bun dev          # or: npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser. 🎉

### 🔐 Environment Variables

Create a `.env` file in the project root:

```env
# OpenRouter API key — https://openrouter.ai/keys
# AI palette generation does not work without this key; if it is missing,
# the app automatically falls back to the local palette library.
OPENROUTER_API_KEY=sk-or-...

# Optional: your site URL for OpenRouter rankings
OPENROUTER_SITE_URL=https://chromai.app
```

> 💡 If `OPENROUTER_API_KEY` is not set, the app won't crash — the request returns an error and the UI shows the local palette library.

## ⚙️ How It Works

```
User types an atmosphere
        │
        ▼
components/chromai/composer.tsx  ──►  lib/generate-client.ts
        │                                     │
        │                          POST /api/generate { prompt, model, locale }
        ▼                                     ▼
app/api/generate/route.ts  ──►  OpenRouter Chat Completions API
        │
        │  • Builds a language-specific prompt (tr/en/de)
        │  • Extracts and validates JSON from the model response
        │  • Normalizes into 3 palettes, each with 2 colors
        ▼
Palettes are rendered as cards in the UI
```

- **Models** ([lib/models.ts](lib/models.ts)) are split into two tiers:
  - 🆓 **Free models** — selectable without a key
  - 💎 **Premium models** — unlocked once the user's own OpenRouter key is saved in the browser
- **The client-side key** ([lib/api-key.ts](lib/api-key.ts)) is stored in `localStorage`, obfuscated with XOR + Base64, and only unlocks premium model selection in the UI; the generation request itself runs through the server-side `OPENROUTER_API_KEY`.

## 📁 Project Structure

```
chromai/
├── app/
│   ├── api/generate/route.ts   # API route that generates palettes via OpenRouter
│   ├── layout.tsx              # Root layout, SEO metadata, providers
│   ├── page.tsx                # Home page (Hero, Generator, FAQ, Founder)
│   ├── manifest.ts · robots.ts · sitemap.ts
│   └── globals.css             # Design system & theme variables
├── components/
│   ├── chromai/                # App components (composer, palette-card, …)
│   ├── ui/                     # shadcn/ui-based primitives
│   └── magicui/                # Visual effects (particles)
├── lib/
│   ├── models.ts               # AI model catalog (free / premium)
│   ├── api-key.ts              # Client-side key storage
│   ├── generate-client.ts      # Request layer to the API route
│   ├── colors.ts · types.ts    # Color helpers & types
│   ├── i18n/                   # Multilingual messages and store (tr/en/de)
│   └── seo/                    # JSON-LD structured data
└── ...
```

## 📜 Scripts

| Command | Description |
| --- | --- |
| `bun dev` | Start the development server |
| `bun run build` | Create a production build |
| `bun start` | Start the production server |
| `bun run lint` | Run ESLint checks |

## ☁️ Deployment

Since this is a Next.js app, the easiest way is [Vercel](https://vercel.com/new):

1. Import the repository into Vercel
2. Add the `OPENROUTER_API_KEY` (and optional `OPENROUTER_SITE_URL`) environment variables
3. Deploy 🚀

## 🤝 Contributing

Contributions, bug reports, and suggestions are very welcome! Feel free to open an [issue](https://github.com/musayazlik/chromai/issues) or submit a pull request.

## 👤 Developer

**Musa Yazlık** — Founder & Developer

[![GitHub](https://img.shields.io/badge/GitHub-musayazlik-181717?logo=github)](https://github.com/musayazlik)
[![LinkedIn](https://img.shields.io/badge/LinkedIn-musayazlik-0A66C2?logo=linkedin&logoColor=white)](https://www.linkedin.com/in/musayazlik/)
[![Instagram](https://img.shields.io/badge/Instagram-musa__yazlik-E4405F?logo=instagram&logoColor=white)](https://www.instagram.com/musa_yazlik/)

## 📄 License

This project is licensed under the [MIT License](LICENSE).

---

<div align="center">

Made with love and a little color. 🎨 · **Chromai**

</div>
