import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import {
  Crown, Zap, Building2, Rocket, Shield,
  Users, Briefcase, Bot, Store,
  Check, Star, ArrowRight, Sparkles, Globe,
  CreditCard, FileText, Target, TrendingUp,
} from "lucide-react";

export const Route = createFileRoute("/empire/pricing")({
  head: () => ({
    meta: [
      { title: "Pricing — AI KOACHED" },
      { name: "description", content: "Membership tiers, storefront rentals, credit services, and AI workforce packages. Start free." },
    ],
  }),
  component: PricingPage,
});

/* ═══════════════════════════════════════════════════════════
   MEMBERSHIP TIERS
   ═══════════════════════════════════════════════════════════ */
const memberships = [
  {
    tier: "Free",
    monthly: 0,
    annual: 0,
    icon: Zap,
    tagline: "Browse & explore",
    highlight: false,
    features: [
      "Browse the B2B Marketplace & shops",
      "View community listings & storefronts",
      "See business profiles & reviews",
      "Preview all AI tools (read-only)",
      "Platform tour & demo access",
      "See pricing, services & products",
    ],
    excluded: [
      "No AI agent access",
      "No credit tools",
      "No entity formation",
      "No storefront",
    ],
    koached: 0,
    agents: 0,
    cta: "Start Free",
    ctaStyle: "outline" as const,
  },
  {
    tier: "Starter",
    monthly: 47,
    annual: 470,
    icon: Rocket,
    tagline: "Launch your business",
    highlight: true,
    popular: true,
    features: [
      "14 AI agents build your business",
      "Empire Roadmap (step-by-step journey)",
      "Credit Empire dashboard",
      "Entity Builder page",
      "Revenue Tracker + $12K goal system",
      "B2B Community access (buy & sell)",
      "1 Storefront listing included",
      "Credit Scanner (1 report/mo)",
      "Doc Generator (5 docs/mo)",
      "Grant pipeline access",
      "100 $KOACHED tokens/mo",
    ],
    koached: 100,
    agents: 14,
    cta: "Start Building",
    ctaStyle: "default" as const,
  },
  {
    tier: "Builder",
    monthly: 97,
    annual: 970,
    icon: Building2,
    tagline: "Scale to profitability",
    highlight: false,
    features: [
      "Everything in Starter",
      "Unlimited Credit Scanner reports",
      "Unlimited Doc Generator",
      "3 Storefront listings included",
      "Priority AI responses (faster)",
      "Content Studio for marketing",
      "Full Global Empire page",
      "Grant application writer AI",
      "Sales Closer + Growth Engine priority",
      "250 $KOACHED tokens/mo",
    ],
    koached: 250,
    agents: 14,
    cta: "Go Builder",
    ctaStyle: "default" as const,
  },
  {
    tier: "Empire",
    monthly: 197,
    annual: 1970,
    icon: Crown,
    tagline: "Dominate your market",
    highlight: false,
    features: [
      "Everything in Builder",
      "Unlimited Storefront listings",
      "Featured placement in marketplace",
      "SMS alerts for deadlines & grants",
      "Compliance auto-monitoring",
      "Multi-entity management",
      "Advanced analytics dashboard",
      "500 $KOACHED tokens/mo",
    ],
    koached: 500,
    agents: 14,
    cta: "Go Empire",
    ctaStyle: "default" as const,
  },
  {
    tier: "Dynasty",
    monthly: 497,
    annual: 4970,
    icon: Star,
    tagline: "The top 1%",
    highlight: false,
    flagship: true,
    features: [
      "Everything in Empire",
      "Dynasty Mastermind community",
      "Monthly 1-on-1 strategy session",
      "White glove onboarding",
      "Dedicated account manager AI",
      "First access to new features",
      "Custom branded storefront page",
      "1,000 $KOACHED tokens/mo",
    ],
    koached: 1000,
    agents: 14,
    cta: "Go Dynasty",
    ctaStyle: "default" as const,
  },
];

/* ═══════════════════════════════════════════════════════════
   STOREFRONT RENTAL — for people with existing businesses
   ═══════════════════════════════════════════════════════════ */
const storefronts = [
  {
    name: "Pop-Up Shop",
    monthly: 29,
    annual: 290,
    desc: "Perfect for side hustles or testing the market",
    features: [
      "1 product/service listing",
      "Basic business profile",
      "Accept payments via your own processor",
      "Listed in B2B marketplace search",
      "Customer reviews enabled",
    ],
    icon: Store,
  },
  {
    name: "Main Street",
    monthly: 59,
    annual: 590,
    desc: "For established businesses wanting more customers",
    popular: true,
    features: [
      "Up to 10 product/service listings",
      "Enhanced business profile with logo",
      "Featured in category browsing",
      "Direct messaging from buyers",
      "Analytics dashboard (views, clicks, leads)",
      "Customer reviews + ratings badge",
      "Share to social media integration",
    ],
    icon: Building2,
  },
  {
    name: "Flagship Store",
    monthly: 99,
    annual: 990,
    desc: "Premium visibility for serious businesses",
    features: [
      "Unlimited product/service listings",
      "Custom branded storefront page",
      "Top placement in marketplace",
      "Video showcase on profile",
      "Priority support",
      "Verified business badge",
      "API access for inventory sync",
      "Featured on homepage carousel",
    ],
    icon: Crown,
    flagship: true,
  },
];

/* ═══════════════════════════════════════════════════════════
   CREDIT SERVICES
   ═══════════════════════════════════════════════════════════ */
const creditServices = [
  { name: "Basic Credit Dispute", price: 79, desc: "15 items/round · 35-day cycle · All 3 bureaus · CROA compliant", icon: Shield },
  { name: "Full Service Credit", price: 99, desc: "Unlimited disputes · Goodwill letters · Credit builder guidance", icon: Shield },
  { name: "Premium Credit", price: 119, desc: "Cease & desist · Debt validation · Inquiry disputes · Expedited", icon: Crown },
  { name: "Couples Basic", price: 119, desc: "Two people — basic dispute service for both", icon: Users },
  { name: "Couples Full Service", price: 149, desc: "Two people — unlimited disputes + full guidance", icon: Users },
  { name: "Couples Premium", price: 179, desc: "Two people — everything in Premium for both", icon: Users },
  { name: "Business Credit Builder", price: 147, desc: "Paydex · Net-30 vendors · DUNS · Corporate card tracker", icon: Briefcase },
  { name: "Paydex Accelerator", price: 197, desc: "Accelerated Paydex · 180-day plan · Weekly check-ins", icon: TrendingUp },
];

/* ═══════════════════════════════════════════════════════════
   ENTITY FORMATION
   ═══════════════════════════════════════════════════════════ */
const entityFormation = [
  { name: "Wyoming LLC", price: 197 },
  { name: "Wyoming C-Corp", price: 247 },
  { name: "Texas LLC", price: 147 },
  { name: "Florida LLC", price: 147 },
  { name: "Delaware LLC", price: 197 },
  { name: "EIN Assistance", price: 77 },
  { name: "DUNS Number Setup", price: 97 },
];

/* ═══════════════════════════════════════════════════════════
   AI + DONE-FOR-YOU PACKAGES
   ═══════════════════════════════════════════════════════════ */
const aiPackages = [
  { name: "Starter AI Team", price: 497, workers: 5, desc: "5 AI workers installed — customer support, bookkeeping, social media, grant research, email marketing", humanCost: "$20K/mo" },
  { name: "Full AI Workforce", price: 997, workers: 15, desc: "15 AI workers — everything in Starter + proposal writer, lead gen, content, HR, competitor intel, financial reporting", humanCost: "$55K/mo" },
  { name: "Empire AI Operating System", price: 2997, workers: 30, desc: "30+ workers + complete done-for-you build — entity, website, credit, grants, revenue system all live", humanCost: "$100K+", flagship: true },
];

const doneForYou = [
  { name: "Business in a Box", price: 997, timeline: "30 days", desc: "Entity + website + email + payments + 5 AI workers + first grant application" },
  { name: "Full Empire Build", price: 2997, timeline: "90 days", desc: "Multi-entity + credit empire + 15 AI workers + revenue system + 3 months check-ins" },
  { name: "Global Empire Build", price: 4997, timeline: "90 days", desc: "US + international entity + dual structure + global payments + multi-currency routing", flagship: true },
];

/* ═══════════════════════════════════════════════════════════
   COMPONENT
   ═══════════════════════════════════════════════════════════ */
type Tab = "memberships" | "storefronts" | "credit" | "entity" | "ai" | "dfy";

function PricingPage() {
  const [annual, setAnnual] = useState(false);
  const [activeTab, setActiveTab] = useState<Tab>("memberships");

  const tabs: { key: Tab; label: string; icon: typeof Crown }[] = [
    { key: "memberships", label: "Memberships", icon: Crown },
    { key: "storefronts", label: "Storefronts", icon: Store },
    { key: "credit", label: "Credit Services", icon: Shield },
    { key: "entity", label: "Entity Formation", icon: Building2 },
    { key: "ai", label: "AI Workforce", icon: Bot },
    { key: "dfy", label: "Done-For-You", icon: Briefcase },
  ];

  return (
    <div className="min-h-screen p-6 md:p-10 max-w-7xl mx-auto">
      {/* Hero */}
      <div className="text-center mb-10">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="text-3xl md:text-5xl font-heading font-bold text-foreground mb-3">
            Build Your <span className="text-primary">Empire</span>. Pick Your Level.
          </h1>
          <p className="text-muted-foreground max-w-2xl mx-auto text-sm md:text-base">
            Start free — browse shops, explore the marketplace, and see what's possible. When you're ready, your AI team builds everything.
          </p>
        </motion.div>

        {/* Social proof */}
        <div className="flex flex-wrap items-center justify-center gap-4 mt-6 text-xs text-muted-foreground">
          <div className="flex items-center gap-1.5">
            <Bot className="w-4 h-4 text-primary" />
            <span><strong className="text-foreground">14 AI agents</strong> work for you</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Globe className="w-4 h-4 text-primary" />
            <span><strong className="text-foreground">20+ countries</strong> supported</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Store className="w-4 h-4 text-primary" />
            <span><strong className="text-foreground">B2B marketplace</strong> included</span>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap justify-center gap-2 mb-8">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={cn(
              "flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all",
              activeTab === tab.key
                ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20"
                : "bg-card text-muted-foreground hover:text-foreground hover:bg-muted"
            )}
          >
            <tab.icon className="w-4 h-4" />
            {tab.label}
          </button>
        ))}
      </div>

      {/* ═══ MEMBERSHIPS ═══ */}
      {activeTab === "memberships" && (
        <>
          {/* Annual toggle */}
          <div className="flex items-center justify-center gap-3 mb-8">
            <span className={cn("text-sm", !annual ? "text-foreground font-medium" : "text-muted-foreground")}>Monthly</span>
            <button
              onClick={() => setAnnual(!annual)}
              className={cn("relative w-14 h-7 rounded-full transition-colors", annual ? "bg-primary" : "bg-muted")}
            >
              <span className={cn(
                "absolute top-0.5 w-6 h-6 rounded-full bg-foreground transition-transform",
                annual ? "translate-x-7" : "translate-x-0.5"
              )} />
            </button>
            <span className={cn("text-sm", annual ? "text-foreground font-medium" : "text-muted-foreground")}>
              Annual <Badge variant="secondary" className="ml-1 text-[10px]">Save 17%</Badge>
            </span>
          </div>

          {/* Free tier callout */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-3xl mx-auto mb-8 p-4 rounded-xl bg-primary/5 border border-primary/20 text-center"
          >
            <p className="text-sm text-foreground">
              <Sparkles className="w-4 h-4 inline text-primary mr-1" />
              <strong>Free users can browse every shop & storefront</strong> in the marketplace — see products, services, reviews, and profiles. Sign up for a paid plan when you're ready to build.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
            {memberships.map((m, idx) => {
              const price = annual && m.annual > 0 ? Math.round(m.annual / 12) : m.monthly;
              return (
                <motion.div
                  key={m.tier}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  className={cn(
                    "relative flex flex-col rounded-xl border p-5 bg-card transition-all hover:shadow-lg hover:shadow-primary/5",
                    m.popular && "ring-2 ring-primary border-primary/50",
                    m.flagship && "ring-1 ring-primary border-primary/30",
                    !m.popular && !m.flagship && "border-border"
                  )}
                >
                  {m.popular && (
                    <Badge className="absolute -top-2.5 left-1/2 -translate-x-1/2 bg-primary text-primary-foreground text-[10px]">
                      Most Popular
                    </Badge>
                  )}
                  {m.flagship && (
                    <Badge className="absolute -top-2.5 left-1/2 -translate-x-1/2 bg-primary text-primary-foreground text-[10px]">
                      Best Value
                    </Badge>
                  )}
                  <div className="flex items-center gap-2 mb-1">
                    <m.icon className="w-5 h-5 text-primary" />
                    <h3 className="font-heading text-lg font-bold">{m.tier}</h3>
                  </div>
                  <p className="text-[11px] text-muted-foreground mb-3">{m.tagline}</p>
                  <div className="mb-3">
                    <span className="text-3xl font-bold font-mono text-foreground">${price}</span>
                    <span className="text-muted-foreground text-sm">/mo</span>
                    {annual && m.annual > 0 && (
                      <p className="text-[10px] text-muted-foreground mt-0.5">${m.annual}/yr billed annually</p>
                    )}
                  </div>
                  {m.agents > 0 && (
                    <div className="flex items-center gap-2 mb-3 text-xs">
                      <span className="text-primary font-mono font-bold">{m.agents} AI agents</span>
                      <span className="text-muted-foreground">·</span>
                      <span className="text-primary font-mono font-bold">{m.koached} $K/mo</span>
                    </div>
                  )}
                  <ul className="flex-1 space-y-1.5 mb-3">
                    {m.features.map((f) => (
                      <li key={f} className="flex items-start gap-2 text-xs text-muted-foreground">
                        <Check className="w-3 h-3 text-green-500 mt-0.5 shrink-0" />
                        {f}
                      </li>
                    ))}
                  </ul>
                  {m.excluded && (
                    <ul className="space-y-1 mb-3">
                      {m.excluded.map((f) => (
                        <li key={f} className="flex items-start gap-2 text-[10px] text-muted-foreground/50">
                          <span className="mt-0.5 shrink-0">✕</span>
                          {f}
                        </li>
                      ))}
                    </ul>
                  )}
                  <Button
                    variant={m.ctaStyle === "outline" ? "outline" : "default"}
                    className={cn("w-full", m.ctaStyle === "default" && "bg-primary text-primary-foreground hover:bg-primary/90")}
                    size="sm"
                  >
                    {m.cta} <ArrowRight className="w-3 h-3 ml-1" />
                  </Button>
                </motion.div>
              );
            })}
          </div>

          {/* What you get at each level comparison */}
          <div className="mt-12 max-w-4xl mx-auto">
            <h2 className="font-heading text-xl font-bold text-center mb-6">What's Included at Every Level</h2>
            <div className="rounded-xl border border-border overflow-hidden">
              <table className="w-full text-xs">
                <thead>
                  <tr className="bg-card">
                    <th className="text-left p-3 font-medium text-muted-foreground">Feature</th>
                    {memberships.map((m) => (
                      <th key={m.tier} className="p-3 text-center font-bold">{m.tier}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {[
                    { feature: "Browse marketplace & shops", values: ["✅", "✅", "✅", "✅", "✅"] },
                    { feature: "AI agents (14 total)", values: ["—", "✅", "✅", "✅", "✅"] },
                    { feature: "Empire Roadmap (guided journey)", values: ["—", "✅", "✅", "✅", "✅"] },
                    { feature: "Credit Scanner", values: ["—", "1/mo", "∞", "∞", "∞"] },
                    { feature: "Doc Generator", values: ["—", "5/mo", "∞", "∞", "∞"] },
                    { feature: "Storefront listings", values: ["—", "1", "3", "∞", "∞ + custom"] },
                    { feature: "Featured marketplace placement", values: ["—", "—", "—", "✅", "✅"] },
                    { feature: "SMS deadline alerts", values: ["—", "—", "—", "✅", "✅"] },
                    { feature: "Mastermind community", values: ["—", "—", "—", "—", "✅"] },
                    { feature: "1-on-1 strategy sessions", values: ["—", "—", "—", "—", "Monthly"] },
                    { feature: "$KOACHED tokens/mo", values: ["0", "100", "250", "500", "1,000"] },
                  ].map((row) => (
                    <tr key={row.feature} className="border-t border-border">
                      <td className="p-3 text-muted-foreground">{row.feature}</td>
                      {row.values.map((v, i) => (
                        <td key={i} className={cn("p-3 text-center", v === "✅" ? "text-green-500" : v === "—" ? "text-muted-foreground/30" : "text-foreground font-mono")}>
                          {v}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}

      {/* ═══ STOREFRONTS ═══ */}
      {activeTab === "storefronts" && (
        <>
          <div className="text-center mb-8 max-w-2xl mx-auto">
            <h2 className="font-heading text-2xl font-bold mb-2">
              <Store className="w-6 h-6 inline text-primary mr-2" />
              Rent a Storefront
            </h2>
            <p className="text-sm text-muted-foreground">
              Already have a business or website? Rent a storefront in our B2B marketplace. Get your products and services in front of entrepreneurs who are actively building and buying.
            </p>
          </div>

          {/* Annual toggle */}
          <div className="flex items-center justify-center gap-3 mb-8">
            <span className={cn("text-sm", !annual ? "text-foreground font-medium" : "text-muted-foreground")}>Monthly</span>
            <button
              onClick={() => setAnnual(!annual)}
              className={cn("relative w-14 h-7 rounded-full transition-colors", annual ? "bg-primary" : "bg-muted")}
            >
              <span className={cn(
                "absolute top-0.5 w-6 h-6 rounded-full bg-foreground transition-transform",
                annual ? "translate-x-7" : "translate-x-0.5"
              )} />
            </button>
            <span className={cn("text-sm", annual ? "text-foreground font-medium" : "text-muted-foreground")}>
              Annual <Badge variant="secondary" className="ml-1 text-[10px]">Save 17%</Badge>
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {storefronts.map((sf, idx) => {
              const price = annual ? Math.round(sf.annual / 12) : sf.monthly;
              return (
                <motion.div
                  key={sf.name}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  className={cn(
                    "relative flex flex-col rounded-xl border p-6 bg-card transition-all hover:shadow-lg",
                    sf.popular && "ring-2 ring-primary border-primary/50",
                    sf.flagship && "ring-1 ring-primary border-primary/30",
                    !sf.popular && !sf.flagship && "border-border"
                  )}
                >
                  {sf.popular && (
                    <Badge className="absolute -top-2.5 left-1/2 -translate-x-1/2 bg-primary text-primary-foreground text-[10px]">
                      Most Popular
                    </Badge>
                  )}
                  {sf.flagship && (
                    <Badge className="absolute -top-2.5 left-1/2 -translate-x-1/2 bg-primary text-primary-foreground text-[10px]">
                      Premium
                    </Badge>
                  )}
                  <div className="flex items-center gap-2 mb-1">
                    <sf.icon className="w-5 h-5 text-primary" />
                    <h3 className="font-heading text-lg font-bold">{sf.name}</h3>
                  </div>
                  <p className="text-[11px] text-muted-foreground mb-4">{sf.desc}</p>
                  <div className="mb-4">
                    <span className="text-3xl font-bold font-mono text-foreground">${price}</span>
                    <span className="text-muted-foreground text-sm">/mo</span>
                    {annual && (
                      <p className="text-[10px] text-muted-foreground mt-0.5">${sf.annual}/yr billed annually</p>
                    )}
                  </div>
                  <ul className="flex-1 space-y-2 mb-4">
                    {sf.features.map((f) => (
                      <li key={f} className="flex items-start gap-2 text-xs text-muted-foreground">
                        <Check className="w-3 h-3 text-green-500 mt-0.5 shrink-0" />
                        {f}
                      </li>
                    ))}
                  </ul>
                  <Button className="w-full bg-primary text-primary-foreground hover:bg-primary/90" size="sm">
                    Rent This Storefront <ArrowRight className="w-3 h-3 ml-1" />
                  </Button>
                </motion.div>
              );
            })}
          </div>

          {/* Why rent */}
          <div className="mt-10 max-w-3xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              { icon: Users, title: "Built-in Audience", desc: "Entrepreneurs actively building businesses — they need YOUR services" },
              { icon: Target, title: "Qualified Buyers", desc: "Every user has a business profile — you know exactly who's shopping" },
              { icon: Globe, title: "20+ Countries", desc: "Reach entrepreneurs in the US, UK, Nigeria, UAE, India, and more" },
            ].map((item) => (
              <div key={item.title} className="text-center p-4 rounded-xl bg-muted/30 border border-border">
                <item.icon className="w-8 h-8 text-primary mx-auto mb-2" />
                <h4 className="font-heading text-sm font-bold mb-1">{item.title}</h4>
                <p className="text-[11px] text-muted-foreground">{item.desc}</p>
              </div>
            ))}
          </div>

          <div className="mt-6 max-w-2xl mx-auto p-4 rounded-xl bg-primary/5 border border-primary/20 text-center">
            <p className="text-xs text-muted-foreground">
              <strong className="text-primary">Already a member?</strong> Starter members get 1 listing free. Builder gets 3. Empire+ gets unlimited. Storefronts are for non-members or those wanting premium placement.
            </p>
          </div>
        </>
      )}

      {/* ═══ CREDIT SERVICES ═══ */}
      {activeTab === "credit" && (
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-8">
            <h2 className="font-heading text-2xl font-bold mb-2">Credit Services</h2>
            <p className="text-sm text-muted-foreground">AI-powered credit repair and building — billed monthly after each service round per CROA.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {creditServices.map((s) => (
              <div key={s.name} className="flex flex-col rounded-xl border border-border p-5 bg-card hover:border-primary/20 transition-colors">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <s.icon className="w-4 h-4 text-primary" />
                    <h3 className="font-heading text-base font-bold">{s.name}</h3>
                  </div>
                  <span className="font-mono text-xl font-bold text-primary">${s.price}<span className="text-sm text-muted-foreground">/mo</span></span>
                </div>
                <p className="text-xs text-muted-foreground flex-1">{s.desc}</p>
                <Button size="sm" className="mt-4 bg-primary text-primary-foreground hover:bg-primary/90">
                  Start Now <ArrowRight className="w-3 h-3 ml-1" />
                </Button>
              </div>
            ))}
          </div>
          <div className="mt-4 p-4 rounded-lg bg-muted/30 border border-border">
            <p className="text-[11px] text-muted-foreground leading-relaxed">
              <strong>CROA Disclosure:</strong> AI KOACHED provides document preparation services only. No specific credit score improvement is guaranteed. Results vary. Billing occurs only after services are performed per 15 U.S.C. §1679. You have the right to cancel within 3 business days.
            </p>
          </div>
        </div>
      )}

      {/* ═══ ENTITY FORMATION ═══ */}
      {activeTab === "entity" && (
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-8">
            <h2 className="font-heading text-2xl font-bold mb-2">Entity Formation</h2>
            <p className="text-sm text-muted-foreground">Form your business entity in any US state. International formations available via Empire Eva AI agent.</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {entityFormation.map((e) => (
              <div key={e.name} className="flex items-center justify-between rounded-xl border border-border p-4 bg-card hover:border-primary/20 transition-colors">
                <div className="flex items-center gap-3">
                  <Building2 className="w-4 h-4 text-primary" />
                  <span className="text-sm font-medium">{e.name}</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="font-mono text-lg font-bold text-primary">${e.price}</span>
                  <Button size="sm" variant="outline" className="text-xs border-primary/30 text-primary hover:bg-primary/10">Start</Button>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-4 space-y-2">
            <div className="p-4 rounded-lg bg-primary/5 border border-primary/20">
              <p className="text-xs text-muted-foreground">
                <strong className="text-primary">Builder+ members:</strong> Formation services are included or discounted. State filing fees apply separately.
              </p>
            </div>
            <div className="p-4 rounded-lg bg-muted/30 border border-border">
              <p className="text-[11px] text-muted-foreground">
                <strong>Note:</strong> EIN is free directly from IRS.gov. The $77 fee covers guided walkthrough. State fees are separate.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* ═══ AI WORKFORCE ═══ */}
      {activeTab === "ai" && (
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-8">
            <h2 className="font-heading text-2xl font-bold mb-2">AI Workforce Packages</h2>
            <p className="text-sm text-muted-foreground">One-time setup. AI workers run 24/7 building your business.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {aiPackages.map((pkg) => (
              <div key={pkg.name} className={cn(
                "flex flex-col rounded-xl border p-5 bg-card",
                pkg.flagship ? "border-primary ring-1 ring-primary" : "border-border"
              )}>
                {pkg.flagship && <Badge className="self-start mb-3 bg-primary text-primary-foreground text-[10px]">Flagship</Badge>}
                <h3 className="font-heading text-lg font-bold mb-1">{pkg.name}</h3>
                <div className="flex items-baseline gap-2 mb-3">
                  <span className="font-mono text-3xl font-bold text-primary">${pkg.price.toLocaleString()}</span>
                  <span className="text-xs text-muted-foreground">one-time</span>
                </div>
                <div className="flex items-center gap-2 mb-3 text-xs">
                  <Bot className="w-4 h-4 text-primary" />
                  <span className="font-mono font-bold text-primary">{pkg.workers} AI workers</span>
                  <span className="text-muted-foreground">replaces {pkg.humanCost}</span>
                </div>
                <p className="text-xs text-muted-foreground flex-1 mb-4">{pkg.desc}</p>
                <Button className="w-full bg-primary text-primary-foreground hover:bg-primary/90" size="sm">
                  Get Started <ArrowRight className="w-3 h-3 ml-1" />
                </Button>
              </div>
            ))}
          </div>

          <h3 className="font-heading text-xl font-bold text-center mt-12 mb-6">Done-For-You Builds</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {doneForYou.map((pkg) => (
              <div key={pkg.name} className={cn(
                "flex flex-col rounded-xl border p-5 bg-card",
                pkg.flagship ? "border-primary ring-1 ring-primary" : "border-border"
              )}>
                {pkg.flagship && <Badge className="self-start mb-3 bg-primary text-primary-foreground text-[10px]">Premium</Badge>}
                <h3 className="font-heading text-lg font-bold mb-1">{pkg.name}</h3>
                <div className="flex items-baseline gap-2 mb-1">
                  <span className="font-mono text-3xl font-bold text-primary">${pkg.price.toLocaleString()}</span>
                  <span className="text-xs text-muted-foreground">one-time</span>
                </div>
                <p className="text-[10px] text-muted-foreground mb-3">Delivered in {pkg.timeline}</p>
                <p className="text-xs text-muted-foreground flex-1 mb-4">{pkg.desc}</p>
                <Button className="w-full bg-primary text-primary-foreground hover:bg-primary/90" size="sm">
                  Start Build <ArrowRight className="w-3 h-3 ml-1" />
                </Button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ═══ Disclaimers ═══ */}
      <div className="mt-12 space-y-2 max-w-3xl mx-auto">
        <p className="text-[10px] text-muted-foreground/60 leading-relaxed">
          <strong>General:</strong> Results vary. Individual outcomes depend on effort, business type, market conditions, and other factors. AI KOACHED provides tools and guidance — not guaranteed business results.
        </p>
        <p className="text-[10px] text-muted-foreground/60 leading-relaxed">
          <strong>Income:</strong> $12,000/month is an aspirational goal — not a guaranteed income. Revenue results vary based on business type, effort, market, and execution.
        </p>
        <p className="text-[10px] text-muted-foreground/60 leading-relaxed">
          <strong>Credit:</strong> Document preparation services only. No specific credit score improvement is guaranteed. Billing after services rendered per CROA (15 U.S.C. §1679) and TSR (16 CFR Part 310).
        </p>
        <p className="text-[10px] text-muted-foreground/60 leading-relaxed">
          <strong>Market Data:</strong> Not financial advice. Market data is for informational purposes only. Investing involves risk. $KOACHED is a utility token, not a security or investment.
        </p>
      </div>
    </div>
  );
}
