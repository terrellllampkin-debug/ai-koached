
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

## 🏗️ COMPRESSED BUILD PLAN (3D-FIRST)

The 3D world is NOT a layer — it IS the product. Every phase ships 3D.

### Phase 1 — Foundation + 3D Shell (Day 1-3)
- ✅ Landing page + brand system (DONE)
- Enable Lovable Cloud (database, auth)
- Auth flow (email + Google sign-in)
- Database schema (users, profiles, avatars, milestones, achievements, $KOACH balances)
- Ready Player Me: Avatar creation during onboarding (selfie → GLB → stored in DB)
- Spline: Design Level 1 starter office (desk, chair, monitors, door)
- React Three Fiber canvas as main app shell (replaces traditional dashboard)
- Click desk → opens AI chat panel
- Click door → navigates to city view
- HUD overlay (stats bar, $KOACH balance, notifications)

### Phase 2 — AI Workers in the Office (Day 4-6)
- Single server function multi-agent router
- 4 AI worker NPCs at desks (Max Credit, Empire Eva, Revenue Rex, Koach Coin)
- Mixamo: idle/typing animations on worker avatars
- Click worker → chat panel slides in with that agent's context
- Text chat streaming via Lovable AI Gateway
- +5 $KOACH per interaction tracking
- Each worker desk has floating name tag + specialty label

### Phase 3 — The City + Core Buildings (Day 7-12)
- Spline: City street view (buildings you can click to enter)
- Credit Empire building → credit score tracking, vendor accounts, net-30 guide
- Entity Builder building → LLC formation workflow, EIN tracking
- Revenue HQ building → $12K goal tracker, processor recommendations
- $KOACH Tower → balance, earn history, pre-launch display
- Grant Office → grant pipeline tracking
- Click building exterior → enter building interior (Spline scene swap)
- Each building has its own AI worker NPC inside

### Phase 4 — Market District (Day 13-16)
- FMP + CoinGecko API integration (server functions, cached)
- Spline: S&P 500 Tower (skyscraper with live ticker displays)
- Spline: NASDAQ Exchange (trading floor aesthetic)
- Spline: Crypto Exchange (futuristic/neon)
- Walk into any market building → see live data, charts, gainers/losers
- Watchlist system (save stocks/crypto, visible in your office)
- Legal disclaimers rendered as signs inside each market building

### Phase 5 — Community Plaza + Member Shops (Day 17-20)
- Spline: Community Plaza (open area with member storefronts)
- Member directory — click avatar → view profile
- Public profiles (business type, tier, achievements, watchlists)
- Member shops via Shopify Storefront API (members connect their own stores)
- Products displayed in 3D storefront windows
- Leaderboard billboard in plaza ($KOACH, revenue, credit score)
- Public wins feed on plaza screens

### Phase 6 — Progression + Office Evolution (Day 21-24)
- 5 office levels (starter desk → corner office → penthouse → skyscraper → empire tower)
- Spline: Design all 5 office scenes
- Achievement/trophy shelf in office (entity formed, EIN, first $1K, etc.)
- Milestone celebrations (confetti, office upgrade animation)
- Story mode missions (Day 0 → $12K month) as quest markers in HUD
- Office auto-upgrades when real milestones hit

### Phase 7 — Voice AI + Full NPC Mode (Day 25-28)
- ElevenLabs: Voice responses for AI workers
- Convai: Lip-sync on 3D worker models (premium tier)
- Voice toggle in HUD (text vs voice)
- Workers gesture and emote during conversations

### Phase 8 — Live Trading (Day 29-32)
- Alpaca OAuth2 (member connects brokerage inside market building)
- Paper trading terminal inside market buildings
- Buy/sell UI as in-world screens
- Trade history on office monitor
- Legal compliance review

### Phase 9 — $KOACH Token Launch (Day 33-35)
- Mint SPL token on Solana
- Wallet connection (Phantom, Solflare) via $KOACH Tower
- Database $KOACH → on-chain tokens
- Token trading board in $KOACH Tower

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
