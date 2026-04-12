
# AI KOACHED — Complete Research & Master Build Plan

## 📊 FULL INTEGRATION RESEARCH

### 1. 3D World Engine

| Tool | What It Does | Cost | Integration Method |
|------|-------------|------|--------------------|
| **Spline Design** | Visual 3D scene builder (office, buildings, city) | Free tier available, $12/mo Starter, $20/mo Pro | `@splinetool/react-spline` npm — embed as React component with click events |
| **React Three Fiber + Drei** | Programmatic 3D for custom scenes, avatars, HUD | Free (open source) | npm packages, full React integration |
| **Three.js** | Underlying 3D engine | Free | Powers R3F under the hood |

**Verdict:** Use **Spline** for designing the city/office/building scenes visually, export as React components. Use **React Three Fiber** for dynamic elements (avatars walking, HUD stats, real-time data displays). They work together — Spline scenes can load inside R3F canvases.

---

### 2. Avatar System

| Tool | What It Does | Cost | Integration Method |
|------|-------------|------|--------------------|
| **Ready Player Me** | Selfie → 3D avatar, full customization | Free for dev, commercial license required for production | `@readyplayerme/react-avatar-creator` — iframe embed, returns GLB URL |
| **Mixamo** (Adobe) | 2,500+ free character animations (idle, walk, sit, type) | Free | Export FBX → convert to GLB via mixamo-to-glb.com |

**Verdict:** Member uploads selfie or builds avatar in Ready Player Me iframe → gets GLB URL → stored in database → loaded into office scene with Mixamo animations applied. Animations: idle at desk, typing, walking, sitting.

---

### 3. AI Workers (Talking NPCs)

| Tool | What It Does | Cost | Integration Method |
|------|-------------|------|--------------------|
| **Convai Web SDK v2.0** | Real-time voice AI characters with lip-sync, emotions, actions | Free tier available, paid plans for production (~$99/mo) | `convai-web-sdk` npm, WebSocket streaming |
| **ElevenLabs Conversational AI** | Voice synthesis for AI agent responses | $0.10/min Starter, $0.08/min Business (annual) | WebSocket API, React SDK available |
| **Lovable AI Gateway** | Text-based AI chat (system prompts, streaming) | Included with Lovable | `createServerFn` — already available, no extra cost |

**Verdict:** Three layers of AI interaction:
- **Text chat** (default, free): Lovable AI Gateway via server functions — always available
- **Voice responses** (premium): ElevenLabs for voice output on agent responses
- **Full NPC mode** (ultimate): Convai for lip-synced 3D characters that talk back

Start with text chat (free), layer voice and NPC as premium features.

---

### 4. Market Data

| Tool | What It Does | Cost | Integration Method |
|------|-------------|------|--------------------|
| **Financial Modeling Prep** | S&P 500, NASDAQ, stock quotes, sector performance, historical | Free (250 calls/day), $15/mo Starter (unlimited) | REST API via server functions |
| **CoinGecko** | Crypto prices (BTC, ETH, SOL, etc.), market cap, Fear & Greed | Free (30 calls/min), $35/mo Basic (500 calls/min) | REST API |

**Verdict:** FMP free tier enough for dev. CoinGecko free tier works for crypto. Both called from server functions to protect API keys and cache responses.

---

### 5. Trading

| Tool | What It Does | Cost | Integration Method |
|------|-------------|------|--------------------|
| **Alpaca Broker API** | Stock + crypto trading, paper trading, OAuth2 for member accounts | Free (revenue share on trades) | OAuth2 flow, REST API, WebSocket for real-time |

**Verdict:** Members connect their own brokerage accounts via OAuth2. Paper trading sandbox for practice. AI KOACHED never recommends trades — members self-direct. FINRA regulated, SIPC insured up to $500K.

**Legal requirement:** Permanent disclaimers in all market buildings. AI agents NEVER suggest specific trades.

---

### 6. Member Shops / Marketplace

| Tool | What It Does | Cost | Integration Method |
|------|-------------|------|--------------------|
| **Shopify (Lovable integration)** | Members can have their own product shops | Dev store free, paid plans after claiming | Lovable's built-in Shopify integration |
| **Shopify Storefront API** | Headless commerce — display products in custom UI | Included with Shopify | GraphQL API, `@shopify/hydrogen-react` |

**Two approaches:**

**Option A — Shared marketplace:** One Shopify store + multi-vendor app (Webkul $15/mo). Members list products, marketplace handles checkout. AI KOACHED takes commission.

**Option B — Individual stores:** Each member creates/connects their own Shopify store. Community Plaza shows member businesses with links. Members fully own their shops.

**Recommendation:** Option B — members own their businesses, aligns with "build your empire" brand. Community Plaza is a directory. Members who sell connect their Shopify store via Storefront API, products appear on their AI KOACHED profile.

---

### 7. $KOACH Token (Solana)

| Tool | What It Does | Cost | Integration Method |
|------|-------------|------|--------------------|
| **Solana SPL Token** | Create $KOACH utility token | ~$0.01 to mint | Metaplex CLI or Raydium launchpad |
| **@solana/web3.js** | Wallet connection, token balance display | Free | npm package |

**Verdict:** Start as internal points system (database). When ready, mint as SPL token on Solana. Pre-launch: $0.00 price, earned tokens tracked in DB. Post-launch: connect to Solana wallet.

---

## 💰 TOTAL MONTHLY COST BREAKDOWN

| Service | Plan | Monthly Cost |
|---------|------|-------------|
| Spline Design | Professional | $20 |
| Ready Player Me | Commercial license | TBD |
| Convai | Production | ~$99 |
| ElevenLabs | Starter | $22 |
| Financial Modeling Prep | Starter | $15 |
| CoinGecko | Demo (free) | $0 |
| Alpaca | Free (revenue share) | $0 |
| Lovable AI Gateway | Included | $0 |
| Shopify | N/A (members own stores) | $0 |
| **TOTAL** | | **~$156/mo** |

---

## 🏗️ PHASED BUILD PLAN

### Phase 1 — Foundation (Week 1-2)
- ✅ Landing page + brand system (DONE)
- Enable Lovable Cloud (database, auth)
- Auth flow (email + Google sign-in)
- Database schema (users, profiles, milestones, achievements, $KOACH balances)
- Sidebar navigation layout
- Dashboard (2D) — stats, progress bars, quick actions

### Phase 2 — AI Agents (Week 3-4)
- Single server function multi-agent router
- 4 agent system prompts (Max Credit, Empire Eva, Revenue Rex, Koach Coin)
- Shared `<AIChatBubble>` component
- Text chat streaming via Lovable AI Gateway
- +5 $KOACH per interaction tracking

### Phase 3 — Core Feature Pages (Week 5-8)
- Credit Empire (credit score tracking, vendor accounts, net-30 guide)
- Entity Builder (LLC formation workflow, EIN tracking)
- Revenue Tracker ($12K goal, processor recommendations)
- $KOACH Token page (balance, earn history, pre-launch display)
- Grant Writer (grant pipeline tracking)

### Phase 4 — Market Buildings (Week 9-11)
- FMP API integration (server function, cached)
- S&P 500 Tower page (live index, gainers/losers, sector cards, charts)
- NASDAQ Exchange page (tech stocks, volume leaders)
- Crypto Exchange page (CoinGecko, BTC/ETH/SOL, Fear & Greed)
- Watchlist system (save stocks/crypto, visible on profile)
- Legal disclaimers on all market pages

### Phase 5 — Community & Shops (Week 12-13)
- Member directory / Community Plaza
- Public profiles (business type, tier, achievements, watchlists)
- Member shops (Shopify Storefront API — members connect their own stores)
- Leaderboard ($KOACH, revenue milestone, credit score)
- Public wins feed

### Phase 6 — Progression System (Week 14-15)
- Office level system (5 levels with triggers)
- Achievement/trophy tracking (entity formed, EIN, first $1K, etc.)
- Milestone notifications and celebrations
- Story mode missions (Day 0 → $12K month)

### Phase 7 — 3D World (Week 16-22)
- Spline: Design Level 1-5 office scenes
- Spline: S&P 500 Tower, NASDAQ, Crypto Exchange
- Spline: Community Plaza and Global Empire Map
- Ready Player Me: Avatar creation during onboarding
- React Three Fiber: Load avatars into scenes
- Mixamo: idle/sit/type/walk animations
- Click AI worker desk → chat panel opens
- Click building → navigates to market page
- HUD overlay with floating stats

### Phase 8 — Voice AI (Week 23-25)
- ElevenLabs: Voice responses for agents
- Convai: Full NPC mode with lip-sync (premium tier)
- Voice toggle (text vs voice)

### Phase 9 — Trading (Week 26-28)
- Alpaca OAuth2 (member connects brokerage)
- Paper trading mode
- Buy/sell UI inside market pages
- Trade history
- Legal compliance review

### Phase 10 — $KOACH Token Launch (Week 29-30)
- Mint SPL token on Solana
- Wallet connection (Phantom, Solflare)
- Database $KOACH → on-chain tokens
- Token page goes live

---

## 🔒 LEGAL REQUIREMENTS (NON-NEGOTIABLE)

1. Every market page: permanent disclaimer ("AI KOACHED does not provide financial advice...")
2. AI agents NEVER recommend specific stocks, ETFs, or crypto
3. All trades self-directed through Alpaca Securities LLC (FINRA/SIPC)
4. $KOACH = utility token, NOT investment or security
5. Member shops independently owned — AI KOACHED is a directory

---

## 🎯 KEY INSIGHT

Everything through Phase 6 is pure web app — no 3D needed. Members get:
- Full AI agent system (4 agents, text chat)
- All business tools (credit, entities, revenue, grants)
- Live market data (stocks + crypto)
- Community with profiles and shops
- Progression system with office levels
- $KOACH token earning

The 3D world (Phase 7+) layers ON TOP of a fully functional platform. Members get value from Day 1. The 3D makes it unforgettable.
