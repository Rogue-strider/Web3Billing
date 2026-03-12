CURRENTLY IN DEVELOPING PHASE

# 🚀 Web3Billing — Crypto Subscription Platform

> **"The Stripe for Web3 Subscriptions"**

Web3Billing is a full-stack SaaS platform that enables **automated recurring crypto payments** for Web3 products. It allows merchants to create subscription plans, users to subscribe using wallets, and handles renewals, cancellations, analytics, and webhooks across multiple blockchains.

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Node.js](https://img.shields.io/badge/Node.js-18+-green.svg)](https://nodejs.org/)
[![React](https://img.shields.io/badge/React-18-blue.svg)](https://reactjs.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-brightgreen.svg)](https://www.mongodb.com/)
[![Solidity](https://img.shields.io/badge/Solidity-0.8.x-purple.svg)](https://soliditylang.org/)

---

## 🧠 Why Web3Billing?

Traditional crypto payments are **one-time**, **manual**, and **hard to manage** for recurring billing.

| Problem | Solution |
|---|---|
| No recurring crypto payments | ✅ Automated renewals |
| No lifecycle management | ✅ Subscription lifecycle (active → renewed → expired) |
| No merchant tools | ✅ Full merchant dashboard |
| Single-chain only | ✅ Multi-chain support |
| No integrations | ✅ Webhook-based integrations |

---

## 🏗️ Architecture Overview
```
Frontend (React)
      ↓
Backend (Node.js / Express)
      ↓
MongoDB (Plans, Subscriptions, Merchants, Users)
      ↓
Blockchain (Ethereum / Polygon / Solana)
      ↓
Cron Jobs (Renewals & Expiry)
```

---

## 🛠️ Tech Stack

### Frontend
- **React.js** — UI framework
- **Tailwind CSS** — Styling
- **React Hooks & Context** — State management
- **MetaMask / Phantom** — Wallet integrations

### Backend
- **Node.js + Express.js** — REST API server
- **MongoDB + Mongoose** — Database & ODM
- **JWT** — Access & refresh token auth
- **RBAC** — Role-based access control (merchant / user)

### Blockchain
- **Solidity** — Smart contracts (Ethereum / Polygon)
- **Rust + Anchor** — Solana programs
- **Web3.js / Ethers.js** — Blockchain interaction

### Infrastructure
- **node-cron** — Background job scheduling
- **Webhooks** — Event-driven merchant integrations

---

## ✨ Core Features

### 🔐 Authentication
- Wallet-based login
- JWT access & refresh tokens
- Role-based authorization

### 🏪 Merchant Features
- Create / activate / deactivate subscription plans
- Delete plans safely *(blocked if active subscriptions exist)*
- Full merchant dashboard

### 🔄 Subscription System
- Subscribe to plans via wallet
- Cancel at period end
- Auto-renew subscriptions
- Full subscription history

**Status Lifecycle:**
```
active → renewed → expired
```

### ⏱️ Cron Jobs

| Job | Purpose |
|---|---|
| Subscription Renewal | Auto-extend active subscriptions |
| Subscription Expiry | Expire canceled subscriptions at period end |

### 📊 Analytics Dashboard
- Active subscribers, MRR, history & charts over time

### 🔔 Webhooks
Events: `subscription_created` · `subscription_renewed` · `subscription_expired`

---

## 📂 Project Structure
```
web3billing/
├── backend/
│   ├── controllers/
│   ├── routes/
│   ├── models/
│   ├── middleware/
│   ├── jobs/             # cron jobs
│   ├── services/
│   └── utils/
│
└── frontend/
    ├── pages/
    ├── components/
    ├── services/
    ├── hooks/
    └── styles/
```

---

## ⚙️ Environment Variables
```env
PORT=5000
MONGO_URI=your_mongodb_uri
JWT_ACCESS_SECRET=your_secret
JWT_REFRESH_SECRET=your_secret
JWT_ACCESS_EXPIRES=15m
JWT_REFRESH_EXPIRES=7d
```

---

## ▶️ Running Locally
```bash
# Backend
cd backend && npm install && npm run dev

# Frontend
cd frontend && npm install && npm run dev
```

---

## 🧪 Testing Status

| Component | Status |
|---|---|
| Smart Contracts | ✅ 95%+ test coverage |
| Backend APIs | ✅ Manually tested |
| Cron Jobs | ✅ Tested locally |

---

## 🚧 Roadmap

### Phase 1 — SaaS Polish
- [ ] Pagination & better error handling
- [ ] Webhook testing UI

### Phase 2 — Security & Scaling
- [ ] Rate limiting · Input validation (Zod/Joi)
- [ ] Redis caching · Webhook signature verification

### Phase 3 — Business Features
- [ ] Trial periods · Multi-currency pricing
- [ ] Stripe + Crypto hybrid billing · Admin dashboard

### Phase 4 — Investor Ready
- [ ] Landing page · Demo video
- [ ] CI/CD · Production deployment (Domain + SSL)

---

## 💰 Business Potential

| Use Case | Description |
|---|---|
| Stripe for Web3 | Default crypto billing layer |
| DAO Subscriptions | Recurring payments for DAOs |
| SaaS Infrastructure | Plug-in billing for Web3 products |
| White-label B2B | Customizable enterprise product |

**Revenue models:** % per transaction · SaaS monthly fee · Enterprise licensing

---

## 🎯 Vision

> Build the **default subscription infrastructure for Web3**.

---

## 👨‍💻 Author

**Satyam** — Full-Stack Web3 Developer · 📍 India  
[![GitHub](https://img.shields.io/badge/GitHub-Profile-black?logo=github)](https://github.com/your-profile-here)

---

⭐ If you find this useful, **star the repo** — it helps a lot!

> This project demonstrates real SaaS architecture, Blockchain + Web2 integration, production-ready backend patterns, and strong system design.
