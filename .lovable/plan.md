
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

## 🏗️ 1-DAY BLITZ BUILD (3D-FIRST, AI-POWERED)

The 3D world IS the product. AI builds every piece. One day. Let's go.

### Hour 1-2 — Auth + Database + 3D Office Shell
- Enable Lovable Cloud (database, auth, storage)
- Auth flow (email + Google sign-in)
- Full DB schema (users, profiles, avatars, office_level, koach_balance, milestones, achievements)
- Spline Level 1 office embedded via R3F (desk, monitors, door, 4 AI worker desks)
- HUD overlay (stats bar, $KOACH balance, notifications)
- Ready Player Me avatar creation in onboarding

### Hour 3-4 — AI Workers + Chat System
- Server function multi-agent router (Max Credit, Empire Eva, Revenue Rex, Koach Coin)
- Click worker desk → sliding chat panel with streaming (Lovable AI Gateway)
- Mixamo idle/typing animations on worker GLBs
- +5 $KOACH per interaction tracking
- Floating name tags + specialty labels on each worker

### Hour 5-6 — City + Core Buildings
- Spline city street with clickable building exteriors
- 5 buildings: Credit Empire, Entity Builder, Revenue HQ, $KOACH Tower, Grant Office
- Click building → interior scene with forms/trackers + dedicated AI worker
- Credit score tracking, LLC workflow, revenue goal, grant pipeline, token balance

### Hour 7-8 — Market District + Community
- FMP + CoinGecko server functions (cached)
- S&P 500 Tower, NASDAQ Exchange, Crypto Exchange scenes
- Live tickers, charts, watchlists
- Community Plaza with member profiles, leaderboard billboard, Shopify storefronts
- Legal disclaimers as in-world signs

### Hour 9-10 — Progression + Voice + Polish
- 5 office levels (auto-upgrade on real milestones)
- Achievement shelf, story mode missions, celebrations
- ElevenLabs voice on AI workers (premium toggle)
- Alpaca paper trading terminals in market buildings
- $KOACH token page (pre-launch, DB tracking → future Solana mint)

---

## 🔒 LEGAL REQUIREMENTS (NON-NEGOTIABLE)

1. Every market building: permanent in-world disclaimer signs
2. AI workers NEVER recommend specific stocks, ETFs, or crypto
3. All trades self-directed through Alpaca Securities LLC (FINRA/SIPC)
4. $KOACH = utility token, NOT investment or security
5. Member shops independently owned — AI KOACHED is a directory

---

## 🎯 KEY INSIGHT

The 3D world IS the interface. There is no "dashboard" — your office is your dashboard. There are no "pages" — there are buildings you walk into. Every feature lives inside the world. Members don't use a platform — they live in one.
