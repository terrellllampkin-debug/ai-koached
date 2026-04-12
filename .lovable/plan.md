

# AI Agents Architecture Research — AI KOACHED

## The Question

You have 4 AI agents (Max Credit, Empire Eva, Revenue Rex, Koach Coin) that need to run across different pages with unique personalities and system prompts. What's the best way to architect this?

## What's Available

- **Lovable AI Gateway** is ready (LOVABLE_API_KEY already configured)
- Gateway supports streaming SSE, tool calling, and structured output
- Models available: Gemini and GPT-5 family (no Claude directly, but these are equally capable)
- The gateway works through **server functions** (TanStack Start's `createServerFn`) — no separate edge functions needed

## Recommended Architecture

### Single Server Function, Multi-Agent Router

Instead of building 4 separate edge functions, we create **one server function** that accepts an `agent` parameter and routes to the correct system prompt. This is cleaner, easier to maintain, and avoids duplicating streaming logic.

```text
Client (chat bubble) 
  → createServerFn("POST") with { agent: "max-credit", messages: [...] }
  → Server picks system prompt from agent config map
  → Calls Lovable AI Gateway with streaming
  → Returns SSE stream to client
```

### Agent Configuration Map

Each agent gets a config object:

| Agent | ID | Color | Avatar | Page |
|-------|-----|-------|--------|------|
| Max Credit | `max-credit` | Gold #D4AF37 | "MC" | Credit Empire |
| Empire Eva | `empire-eva` | Purple #7F77DD | "EE" | Entity Builder |
| Revenue Rex | `revenue-rex` | Green #1DB977 | "RR" | Revenue Tracker |
| Koach Coin | `koach-coin` | Blue #3B82F6 | "KC" | $KOACH Token |

System prompts stay server-side only (never sent to the client).

### Shared Chat UI Component

One reusable `<AIChatBubble>` component that accepts agent ID, color, and avatar — renders the fixed bottom-right chat bubble on each page. All 4 agents share identical UI logic, just different configs.

### Model Choice

The gateway doesn't offer Claude directly, but **Google Gemini 3 Flash Preview** (default) or **GPT-5** are strong alternatives. Gemini Flash is fast and free-tier friendly — ideal for chat agents. We can use GPT-5 for the more complex agents (Empire Eva's entity strategy) if needed.

## What This Means for the Build

- **No external API keys needed** — Lovable AI is pre-configured
- **No edge functions needed** — server functions handle everything
- **One streaming implementation** shared across all 4 agents
- **Each agent's personality** is just a system prompt string on the server
- **Token earning (+5 $KOACH per use)** hooks into the same server function

## Recommendation

We don't need more research — the path is clear. I recommend we start building in this order:

1. **Landing page + brand setup** (fonts, colors, layout shell, sidebar nav)
2. **Auth flow** (Supabase Auth with tier-based access)
3. **Dashboard** (the central hub after login)
4. **AI chat system** (one server function + shared chat component, then drop it into each page as we build them)
5. **Feature pages** one at a time (Credit Empire, Entity Builder, Revenue Tracker, etc.)

This way the AI agents come online naturally as each page is built, and we avoid building infrastructure we don't need.

Shall I proceed with Phase 1 (landing page + brand/layout shell)?

