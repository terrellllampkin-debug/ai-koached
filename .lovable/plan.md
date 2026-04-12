
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

## 🏗️ SPEED BUILD PLAN (3D-FIRST, AI-POWERED)

The 3D world IS the product. AI builds the code. Spline builds the scenes. Ship fast.

### Sprint 1 — Auth + 3D Office Shell (Day 1)
- Enable Lovable Cloud (database, auth, storage)
- Auth flow (email + Google sign-in)
- Database schema (users, profiles, avatars, office_level, $KOACH balances, milestones, achievements)
- Ready Player Me avatar creation in onboarding
- Spline Level 1 office (desk, monitors, door, 4 AI worker desks)
- R3F canvas as main shell — HUD overlay (stats, $KOACH, notifications)
- Click desk → AI chat | Click door → city

### Sprint 2 — AI Workers + City (Day 2-3)
- Server function multi-agent router (4 agents)
- AI workers at desks with Mixamo idle/typing animations
- Click worker → sliding chat panel with streaming (Lovable AI Gateway)
- +5 $KOACH per interaction
- Spline city street with clickable buildings
- 5 core buildings: Credit Empire, Entity Builder, Revenue HQ, $KOACH Tower, Grant Office
- Click building → enter interior scene with dedicated AI worker

### Sprint 3 — Market District + Live Data (Day 4-5)
- FMP + CoinGecko server functions (cached)
- S&P 500 Tower, NASDAQ Exchange, Crypto Exchange (Spline scenes)
- Live tickers, charts, gainers/losers inside each building
- Watchlist system (saved to DB, visible in office monitors)
- Legal disclaimer signs in every market building

### Sprint 4 — Community + Shops + Progression (Day 6-7)
- Community Plaza (Spline scene, member storefronts)
- Member profiles, directory, leaderboard billboard
- Shopify Storefront API — members connect own stores, products in 3D storefronts
- 5 office levels (desk → corner office → penthouse → skyscraper → empire tower)
- Achievement shelf, milestone celebrations, story mode missions
- Office auto-upgrades on real milestone hits

### Sprint 5 — Voice AI + Trading + Token (Day 8-10)
- ElevenLabs voice on AI workers + Convai lip-sync (premium)
- Alpaca OAuth2 — paper trading + live trading terminals in market buildings
- $KOACH SPL token mint on Solana
- Wallet connection (Phantom/Solflare) in $KOACH Tower
- DB points → on-chain tokens

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
