<div align="center">

# 🚀 NxtWave Growth Challenge
### Student Referral & Workshop Registration Platform

**Built for the NxtWave Growth Intern Challenge**

[![Next.js](https://img.shields.io/badge/Next.js-14-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-CSS-06B6D4?style=for-the-badge&logo=tailwindcss)](https://tailwindcss.com/)
[![Vercel](https://img.shields.io/badge/Deployed-Vercel-black?style=for-the-badge&logo=vercel)](https://nxtwave-growth-challenge-amber.vercel.app/)

<br/>

**[🌐 Live Demo](https://nxtwave-growth-challenge-amber.vercel.app/) · [📋 Register](https://nxtwave-growth-challenge-amber.vercel.app/register) · [🏆 Leaderboard](https://nxtwave-growth-challenge-amber.vercel.app/leaderboard) · [📊 Admin](https://nxtwave-growth-challenge-amber.vercel.app/admin)**

</div>

---

## 📌 What Is This?

This is a **full-stack viral referral platform** built to solve a real growth challenge:

> **Get 500 final-year engineering students to register for a free AI workshop within 7 days — with only ₹2,000 budget.**

Instead of burning money on ads (which would cost ₹70,000+ for 500 students), this platform builds a **student-to-student referral loop** — where every registered student becomes a micro-ambassador at their college.

---

## 🎯 The Challenge

| | |
|---|---|
| **Workshop** | "Build Your First AI Project in 60 Minutes" |
| **Target** | 500 final-year engineering students (Batch 2025 & 2026) |
| **Deadline** | 7 days |
| **Total Budget** | ₹2,000 |
| **Standard Ad Cost** | ₹140 per student × 500 = ₹70,000 |
| **This Platform's CPA** | **< ₹6 per student (96% cheaper)** |

---

## 🌐 Live Demo

**🔗 [https://nxtwave-growth-challenge-amber.vercel.app](https://nxtwave-growth-challenge-amber.vercel.app)**

| Page | URL | Access |
|------|-----|--------|
| 🏠 Landing Page | `/` | Public |
| 📝 Register | `/register` | Public |
| 👤 Student Dashboard | `/dashboard/NXT-10012` | Public |
| 🏆 Leaderboard | `/leaderboard` | Public |
| 📊 Admin Hub | `/admin` | Passkey: `admin` |

---

## 📸 Screenshots

### 🏠 Workshop Landing Page
![Workshop Landing Page](screenshots/landing-page.png)

### 📝 Registration with Referral Attribution
![Registration Page](screenshots/registration.png)

### 👤 Student Referral Dashboard
![Student Dashboard](screenshots/student-dashboard.png)

### 🏆 Campus Leaderboard
![Campus Leaderboard](screenshots/leaderboard.png)

### 📊 Growth Admin Dashboard
![Admin Dashboard](screenshots/admin-dashboard.png)

---

## ⚡ Quick Start

```bash
# 1. Clone
git clone https://github.com/Sriramnischay/nxtwave-growth-challenge.git
cd nxtwave-growth-challenge

# 2. Install
npm install

# 3. Run (development)
npm run dev
```

Open **[http://localhost:3000](http://localhost:3000)**

```bash
# Production build
npm run build
npm start

# Run automated tests
node scripts/test-e2e.js
```

---

## 🔄 How the Growth Loop Works

```
Student discovers workshop
        ↓
Fills 30-second registration form
        ↓
Gets unique referral code (e.g. NXT-A7K92)
        ↓
1-click WhatsApp share to college group
        ↓
Batchmates register via referral link
        ↓
Referrer unlocks milestone perks 🎁
        ↓
Leaderboard ranking updates live 🏆
```

Every registered student becomes a distribution channel. One motivated student can bring in 5–10 batchmates from their college WhatsApp groups.

---

## 📈 Growth Strategy

### Why Peer Referrals Beat Paid Ads

| Metric | Paid Ads | This Platform |
|--------|----------|---------------|
| **Cost for 500 Students** | ₹70,000 | **₹2,000** |
| **Cost Per Registration** | ~₹140 | **~₹4–6** |
| **Trust Factor** | Low (cold ad) | **High (classmate)** |
| **Virality K-Factor** | 0.0 | **≥ 0.52** |
| **Savings** | Baseline | **~96% cheaper** |

### Budget Allocation (₹2,000)
- **₹1,200** — Digital milestone rewards (AI starter kits, templates, Discord access)
- **₹500** — Targeted seed posts in 10 engineering college communities
- **₹300** — WhatsApp group outreach coordination

### Why Students Actually Share
1. **Placement-grade hook** — They build a real GenAI project for campus interviews
2. **Peer trust** — A classmate's recommendation converts 5× better than an ad
3. **Personal stake** — They get tangible rewards (resume reviews, mentorship) for each referral

---

## ✨ Key Features

### 🏠 Workshop Landing Page
- Student-focused headline with 60-minute AI curriculum breakdown
- Placement comparison: generic college clone vs. deployed GenAI project
- Real-time registration ticker + FAQ accordion
- Single-click jump to registration

### 📝 Referral Registration (`/register`)
- 30-second form: Name, Email, College, Branch, Graduation Year
- Auto-detects referral code from URL (`?ref=NXT-XXXXX`)
- Confetti animation on successful registration
- **Anti-abuse built-in:**
  - ❌ Duplicate email rejected
  - ❌ Self-referral blocked
  - ⚠️ Invalid referral code → degrades gracefully to direct registration

### 👤 Student Dashboard (`/dashboard/[code]`)
- Personal referral code + 1-click copy
- **WhatsApp share button** with pre-crafted student message
- Milestone progress tracker:

  | Referrals | Reward |
  |-----------|--------|
  | 🚀 1 | AI Starter Kit + 50 Prompt Templates |
  | ⚡ 3 | VIP Discord + AI Resume Checklist |
  | 🏆 5 | 1-on-1 Portfolio Session + Ambassador Certificate |
  | 👑 10 | Fast-track NxtWave Internship Referral |

- Live list of referred batchmates

### 🏆 Campus Leaderboard (`/leaderboard`)
- Gold / Silver / Bronze podium cards
- Live search by name, college, or branch
- Personal rank highlighted for the active student
- Email addresses never exposed (privacy-safe)

### 📊 Growth Admin Dashboard (`/admin`)
- **500-student goal tracker** with progress bar
- Daily signup chart: Direct vs. Referral breakdown
- Virality K-Factor and CPA calculated in real-time
- College and branch distribution charts
- **Simulate registration** modal for live testing
- **Export CSV** of all registrations
- Reset to seed data / Clear all data

---

## ✅ Automated Tests

```
🚀 RUNNING END-TO-END VERIFICATION TESTS
=====================================================

TEST 1: Admin Stats Initial Load               ✅ Passed
TEST 2: Student 1 Direct Registration          ✅ Passed  → NXT-YLCLW
TEST 3: Student 1 Dashboard API                ✅ Passed
TEST 4: Student 2 Registers via NXT-YLCLW      ✅ Passed  → Referral attributed
TEST 5: Referral Count & Milestone Update      ✅ Passed  → 1 referral, AI Starter Kit unlocked
TEST 6: Duplicate Email Prevention             ✅ Passed  → Rejected
TEST 7: Self-Referral Prevention               ✅ Passed  → Blocked
TEST 8: Invalid Referral Code Handling         ✅ Passed  → Graceful warning
TEST 9: Leaderboard Ranking Check              ✅ Passed

=====================================================
SUMMARY: 9 Passed, 0 Failed ✅
=====================================================
```

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| **Framework** | Next.js 14 (App Router) |
| **Language** | TypeScript |
| **Styling** | Tailwind CSS |
| **Charts** | Recharts |
| **Icons** | Lucide React |
| **Animations** | Canvas Confetti |
| **Database (Local)** | JSON file (`data/db.json`) |
| **Database (Production)** | Upstash Redis (Vercel-compatible) |
| **Deployment** | Vercel |

---

## 📁 Project Structure

```
nxtwave-growth-challenge/
├── data/
│   └── db.json                    # Local JSON database
├── screenshots/                   # App screenshots for README
├── scripts/
│   └── test-e2e.js                # 9-step E2E test suite
├── src/
│   ├── app/
│   │   ├── page.tsx               # 🏠 Workshop landing page
│   │   ├── register/page.tsx      # 📝 Registration + referral attribution
│   │   ├── dashboard/[code]/      # 👤 Student referral dashboard
│   │   ├── leaderboard/page.tsx   # 🏆 Campus leaderboard
│   │   ├── admin/page.tsx         # 📊 Growth admin hub
│   │   └── api/
│   │       ├── register/          # POST: Register student
│   │       ├── student/[code]/    # GET: Student profile + referrals
│   │       ├── leaderboard/       # GET: Ranked leaderboard
│   │       └── admin/stats/       # GET/POST: Stats + reset/clear
│   ├── components/
│   │   ├── Navbar.tsx
│   │   ├── RegistrationForm.tsx
│   │   ├── MilestonesCard.tsx
│   │   ├── GrowthLoopExplainer.tsx
│   │   └── WorkshopRoadmap.tsx
│   ├── lib/
│   │   ├── db.ts                  # DB abstraction (Redis + JSON fallback)
│   │   └── constants.ts           # Config, FAQ, milestones
│   └── types/index.ts             # TypeScript interfaces
├── next.config.mjs
├── tailwind.config.ts
└── tsconfig.json
```

---

## 🔧 Environment Variables (for Production)

For persistent data on Vercel, add these in **Vercel → Settings → Environment Variables**:

```env
UPSTASH_REDIS_REST_URL=your_url_here
UPSTASH_REDIS_REST_TOKEN=your_token_here
```

Get them free at **[console.upstash.com](https://console.upstash.com)** → Create Database → REST API tab.

> Without these, the app still works using `/tmp` storage (ephemeral, resets on cold start).

---

## 🚀 Future Improvements

1. **WhatsApp Cloud API** — Auto-send workshop links and reminders on registration
2. **Inter-College Tournaments** — Campus vs campus referral competitions
3. **Google Calendar Integration** — 1-click event generation to maximize attendance
4. **LinkedIn Certificate Verification** — Public `/verify/[id]` page for placement portfolios
5. **SMS OTP Verification** — Reduce fake registrations further

---

## 💡 Conclusion

This project shows how a **product-led growth strategy** with the right student incentives can:

- Reach **500 engineering students in 7 days**
- Spend **₹2,000 instead of ₹70,000**
- Achieve **96% cost savings** over paid advertising
- Generate organic word-of-mouth through placement-relevant perks

The referral loop works because the workshop solves a real student problem (placement prep), making every registered student genuinely motivated to bring their batchmates along.

---

<div align="center">

Built with ❤️ for the **NxtWave Growth Intern Challenge**

**[🌐 Live Demo](https://nxtwave-growth-challenge-amber.vercel.app/) · [⭐ Star this repo](https://github.com/Sriramnischay/nxtwave-growth-challenge)**

</div>
