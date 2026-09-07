# SocialGuard AI

SocialGuard AI is a full-stack social-media mining and risk-analysis system for detecting suspicious accounts and bot-like behavior using authorized, public, synthetic, or user-provided account metadata.

## Stack

- Frontend: Next.js App Router, TypeScript, Tailwind CSS, React Query, Axios, Recharts
- Backend: Express, TypeScript, Mongoose, JWT, HTTP-only cookies, Zod, Helmet, CORS, rate limiting, Pino
- Database: MongoDB

## Requirements

- Node.js 20+
- MongoDB Atlas or local MongoDB

## Setup

### 1. Backend

```bash
cd server
npm install
cp .env.example .env
# edit .env
npm run seed
npm run dev
```

Backend: http://localhost:5000
Health: http://localhost:5000/api/v1/health

### 2. Frontend

```bash
cd client
npm install
cp .env.local.example .env.local
npm run dev
```

Frontend: http://localhost:3000

Development accounts created by the seed:

- admin@socialguard.local / Admin123!
- researcher@socialguard.local / Researcher123!
- moderator@socialguard.local / Moderator123!

Change these passwords immediately outside development.

## Detection

The first version uses an explainable rule-based scoring engine. It does not claim certainty. Scores:

- 0-29: GENUINE
- 30-59: SUSPICIOUS
- 60-79: HIGH_RISK
- 80-100: LIKELY_BOT

The architecture isolates the detection provider so an ML model can be added later.

## Ethical use

Only analyze data you are authorized to process. Do not use this project for credential theft, account takeover, private-profile access, CAPTCHA/rate-limit bypass, evasion, or unauthorized scraping.

# SocialGuard

#Acccounts to use to see all features

<!-- admin@socialguard.local / Admin123!
researcher@socialguard.local / Researcher123!
moderator@socialguard.local / Moderator123! -->
