# ⚡ CodeClub Pro — The Hacker's Command Center

<p align="center">
  <img src="https://raw.githubusercontent.com/lucide-react/lucide/main/icons/terminal.svg" width="80" height="80" alt="Logo" />
</p>

<h3 align="center">hack. compete. dominate.</h3>

<p align="center">
  <img src="https://img.shields.io/badge/version-2.0.0-blueviolet?style=for-the-badge" alt="Version" />
  <img src="https://img.shields.io/badge/status-active-success?style=for-the-badge" alt="Status" />
  <img src="https://img.shields.io/badge/stack-Vite%20%7C%20React%20%7C%20Supabase-blue?style=for-the-badge" alt="Stack" />
</p>

---

## 🚀 Overview

**CodeClub Pro** is a terminal-native, high-performance coding platform designed specifically for college clubs and developer communities. It transforms learning into a competitive sport, featuring real-time battles, AI-powered evaluations, and a deep gamification layer that rewards consistency and skill.

Built for the next generation of hackers, the platform focuses on **DSA mastery**, **collaborative building**, and **peer-to-peer competition**.

---

## ✨ Core Features

| Feature | Description |
| :--- | :--- |
| **⚔️ 1v1 Battle Mode** | Challenge peers to real-time coding duels. Fastest correct solution wins the XP. |
| **🤖 AI Evaluation** | Instant feedback on coding challenges with AI-powered performance analysis. |
| **🏆 Legend Leaderboard** | Level up from *Beginner* to *Legend*. Weekly and all-time global rankings. |
| **🔥 Streak System** | Maintain daily coding streaks to unlock exclusive rewards and badges. |
| **📂 Project Showcase** | A gallery for members to feature their best GitHub projects and get peer-vetted. |
| **🛡️ Anti-Cheat Engine** | Integrated tab-switch detection, copy-paste tracking, and anomaly flagging. |
| **🤝 Team Dynamics** | Form teams, compete in team-based contests, and climb the guild boards. |
| **📊 Admin Analytics** | Deep insights into member performance, engagement metrics, and growth. |

---

## 🛠️ Technology Stack

- **Frontend Core:** [Vite](https://vitejs.dev/) + [React 18](https://reactjs.org/) + [TypeScript](https://www.typescriptlang.org/)
- **Styling:** [Tailwind CSS](https://tailwindcss.com/) + [Radix UI](https://www.radix-ui.com/) (shadcn/ui)
- **Backend/Auth:** [Supabase](https://supabase.com/) (PostgreSQL + Real-time)
- **Data Orchestration:** [TanStack Query](https://tanstack.com/query/latest) (React Query)
- **Visualization:** [Recharts](https://recharts.org/) (Performance & Growth tracking)
- **Components:** [Lucide Icons](https://lucide.dev/), [Sonner](https://sonner.emilkowal.ski/), [jsPDF](https://github.com/parallax/jsPDF)

---

## 📂 Project Structure

```bash
codeclub-pro/
├── src/
│   ├── components/       # Visual primitives (shadcn/ui + custom)
│   ├── pages/            # Core views (Leaderboard, Battle, Code, etc.)
│   ├── contexts/         # Auth and App state providers
│   ├── hooks/            # Custom React hooks (logic reuse)
│   ├── integrations/     # Third-party API & Supabase logic
│   ├── lib/              # Utility functions & global types
│   └── data/             # Mock data & constants
├── supabase/             # Database migrations & Functions
├── public/               # Static assets
└── tailwind.config.ts    # Brand themes & design tokens
```

---

## 🛠️ Getting Started

### 1. Prerequisites
- **Node.js** (v18+)
- **Bun** or **npm**
- **Supabase Account** (for backend functionality)

### 2. Configuration
Create a `.env` file in the root directory:
```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 3. Execution
```bash
# Install dependencies
bun install

# Start local development server
bun dev
```

---

## 🛡️ Hackathon Ready
CodeClub Pro is built with performance and security in mind. The **Anti-Cheat Engine** ensures integrity during competitions, while the **Battle Mode** uses real-time synchronization via Supabase for a lag-free experience.

---

<p align="center">
  Built with ⚡ by the <b>CodeClub Pro</b> Team.<br/>
  <i>"Dominate the stack, one line at a time."</i>
</p>
