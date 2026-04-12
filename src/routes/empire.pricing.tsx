import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import {
  Crown, Zap, Building2, Rocket, Shield,
  CreditCard, Users, Briefcase, Globe, Bot,
  Check, Star, ArrowRight, ToggleLeft, ToggleRight,
} from "lucide-react";

export const Route = createFileRoute("/empire/pricing")({
  head: () => ({
    meta: [
      { title: "Pricing — AI KOACHED" },
      { name: "description", content: "Membership tiers, credit services, entity formation, and AI workforce packages." },
    ],
  }),
  component: PricingPage,
});

/* ─── data ──────────────────────────────────────────────── */

const memberships = [
  {
    tier: "Free",
    monthly: 0,
    annual: 0,
    icon: Zap,
    color: "text-muted-foreground",
    border: "border-border",
    features: [
      "Landing page access",
      "Platform preview",
      "Community preview only",
    ],
    koached: 0,
    tools: 0,
  },
  {
    tier: "Starter",
    monthly: 47,
    annual: 470,
    icon: Rocket,
    color: "text-primary",
    border: "border-primary/30",
    popular: true,
    features: [
      "30 AI business tools",
      "All 4 AI agents",
      "Full community (8 channels)",
      "Dashboard with $12K tracker",
      "Credit Empire page",
      "Entity Builder page",
      "Revenue Tracker page",
      "Grant pipeline",
    ],
    koached: 100,
    tools: 30,
  },
  {
    tier: "Builder",
    monthly: 97,
    annual: 970,
    icon: Building2,
    color: "text-purple-accent",
    border: "border-purple-accent/30",
    features: [
      "Everything in Starter",
      "60 AI tools unlocked",
      "Grant application writer",
      "Content Studio",
      "Full Global Empire page",
    ],
    koached: 250,
    tools: 60,
  },
  {
    tier: "Empire",
    monthly: 197,
    annual: 1970,
    icon: Crown,
    color: "text-primary",
    border: "border-primary/30",
    features: [
      "Everything in Builder",
      "90 AI tools unlocked",
      "SMS alerts for grant deadlines",
      "Priority AI agent responses",
    ],
    koached: 500,
    tools: 90,
  },
  {
    tier: "Dynasty",
    monthly: 497,
    annual: 4970,
    icon: Star,
    color: "text-primary",
    border: "border-primary/50",
    features: [
      "Everything in Empire",
      "110+ ALL tools unlocked",
      "Dynasty Mastermind community",
      "Monthly strategy session",
      "White glove onboarding",
      "First access to new features",
    ],
    koached: 1000,
    tools: 110,
  },
];

const creditServices = [
  { name: "Basic Credit Dispute", price: 79, desc: "15 items/round · 35-day cycle · All 3 bureaus · CROA compliant" },
  { name: "Full Service Credit", price: 99, desc: "Unlimited disputes · Goodwill letters · Credit builder guidance" },
  { name: "Premium Credit", price: 119, desc: "Cease & desist · Debt validation · Inquiry disputes · Expedited rounds" },
  { name: "Couples Basic", price: 119, desc: "Two people — basic dispute service for both partners" },
  { name: "Couples Full Service", price: 149, desc: "Two people — unlimited disputes, goodwill letters, full guidance" },
  { name: "Couples Premium", price: 179, desc: "Two people — everything in Premium for both partners" },
  { name: "Business Credit Builder", price: 147, desc: "Paydex monitoring · Net-30 vendors · DUNS setup · Corporate card tracker" },
  { name: "Paydex Accelerator", price: 197, desc: "Accelerated Paydex plan · 180-day empire plan · Weekly check-ins" },
];

const entityFormation = [
  { name: "Wyoming LLC", price: 197 },
  { name: "Wyoming C-Corp", price: 247 },
  { name: "Texas LLC", price: 147 },
  { name: "Florida LLC", price: 147 },
  { name: "Delaware LLC", price: 197 },
  { name: "EIN Assistance", price: 77 },
  { name: "DUNS Number Setup", price: 97 },
];

const aiPackages = [
  {
    name: "Starter AI Team",
    price: 997,
    workers: 5,
    desc: "Customer support chatbot, bookkeeping, social media scheduling, grant researcher, email marketing",
    humanCost: "$20,000/mo",
  },
  {
    name: "Full AI Workforce",
    price: 997,
    workers: 15,
    desc: "Everything in Starter + market researcher, proposal writer, appointment setter, lead researcher, financial reporter, content writer, HR screener, competitor monitor, news aggregator, international research",
    humanCost: "$55,000/mo",
  },
  {
    name: "Empire AI Operating System",
    price: 2997,
    workers: 30,
    desc: "Full AI workforce + complete done-for-you business build — entity formed, website live, bank accounts, credit building, grants applied, revenue system running",
    humanCost: "$100,000+",
    flagship: true,
  },
];

const doneForYou = [
  {
    name: "Business in a Box",
    price: 997,
    desc: "Entity + website + email + Stripe + 5 AI workers + first grant application",
    timeline: "30 days",
  },
  {
    name: "Full Empire Build",
    price: 2997,
    desc: "Multi-entity + full credit empire + 15 AI workers + revenue system + 3 months check-ins",
    timeline: "90 days",
  },
  {
    name: "Global Empire Build",
    price: 4997,
    desc: "US + international entity + dual structure + global payments + multi-currency revenue routing",
    timeline: "90 days",
    flagship: true,
  },
];

/* ─── component ─────────────────────────────────────────── */

function PricingPage() {
  const [annual, setAnnual] = useState(false);
  const [activeTab, setActiveTab] = useState<"memberships" | "credit" | "entity" | "ai" | "dfy">("memberships");

  const tabs = [
    { key: "memberships" as const, label: "Memberships", icon: Crown },
    { key: "credit" as const, label: "Credit Services", icon: Shield },
    { key: "entity" as const, label: "Entity Formation", icon: Building2 },
    { key: "ai" as const, label: "AI Workforce", icon: Bot },
    { key: "dfy" as const, label: "Done-For-You", icon: Briefcase },
  ];

  return (
    <div className="min-h-screen p-6 md:p-10 max-w-7xl mx-auto">
      {/* Header */}
      <div className="text-center mb-10">
        <h1 className="text-3xl md:text-4xl font-heading font-bold text-foreground mb-3">
          Choose Your <span className="text-primary">Empire</span> Level
        </h1>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Everything you need to build, protect, and scale your business — guided by AI every step of the way.
        </p>
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

      {/* Memberships */}
      {activeTab === "memberships" && (
        <>
          {/* Annual toggle */}
          <div className="flex items-center justify-center gap-3 mb-8">
            <span className={cn("text-sm", !annual ? "text-foreground font-medium" : "text-muted-foreground")}>Monthly</span>
            <button
              onClick={() => setAnnual(!annual)}
              className="relative w-14 h-7 rounded-full bg-muted transition-colors data-[on=true]:bg-primary"
              data-on={annual}
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

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
            {memberships.map((m) => {
              const price = annual && m.annual > 0 ? Math.round(m.annual / 12) : m.monthly;
              return (
                <div
                  key={m.tier}
                  className={cn(
                    "relative flex flex-col rounded-xl border p-5 bg-card transition-all hover:shadow-lg hover:shadow-primary/5",
                    m.border,
                    m.popular && "ring-1 ring-primary"
                  )}
                >
                  {m.popular && (
                    <Badge className="absolute -top-2.5 left-1/2 -translate-x-1/2 bg-primary text-primary-foreground text-[10px]">
                      Most Popular
                    </Badge>
                  )}
                  <div className="flex items-center gap-2 mb-3">
                    <m.icon className={cn("w-5 h-5", m.color)} />
                    <h3 className="font-heading text-lg font-bold">{m.tier}</h3>
                  </div>
                  <div className="mb-4">
                    <span className="text-3xl font-bold font-mono text-foreground">
                      ${price}
                    </span>
                    <span className="text-muted-foreground text-sm">/mo</span>
                    {annual && m.annual > 0 && (
                      <p className="text-[10px] text-muted-foreground mt-0.5">
                        ${m.annual}/yr billed annually
                      </p>
                    )}
                  </div>
                  {m.tools > 0 && (
                    <div className="flex items-center gap-3 mb-3 text-xs">
                      <span className="text-primary font-mono font-bold">{m.tools} tools</span>
                      <span className="text-muted-foreground">·</span>
                      <span className="text-primary font-mono font-bold">{m.koached} $KOACHED/mo</span>
                    </div>
                  )}
                  <ul className="flex-1 space-y-1.5 mb-4">
                    {m.features.map((f) => (
                      <li key={f} className="flex items-start gap-2 text-xs text-muted-foreground">
                        <Check className="w-3 h-3 text-success mt-0.5 shrink-0" />
                        {f}
                      </li>
                    ))}
                  </ul>
                  <Button
                    className={cn(
                      "w-full",
                      m.monthly === 0 ? "bg-muted text-foreground hover:bg-muted/80" : "bg-primary text-primary-foreground hover:bg-primary/90"
                    )}
                    size="sm"
                  >
                    {m.monthly === 0 ? "Get Started" : "Choose Plan"}
                  </Button>
                </div>
              );
            })}
          </div>
        </>
      )}

      {/* Credit Services */}
      {activeTab === "credit" && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-5xl mx-auto">
          {creditServices.map((s) => (
            <div key={s.name} className="flex flex-col rounded-xl border border-border p-5 bg-card">
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-heading text-base font-bold">{s.name}</h3>
                <span className="font-mono text-xl font-bold text-primary">${s.price}<span className="text-sm text-muted-foreground">/mo</span></span>
              </div>
              <p className="text-xs text-muted-foreground flex-1">{s.desc}</p>
              <Button size="sm" className="mt-4 bg-primary text-primary-foreground hover:bg-primary/90">
                Start Now <ArrowRight className="w-3 h-3 ml-1" />
              </Button>
            </div>
          ))}
          <div className="md:col-span-2 mt-2 p-4 rounded-lg bg-muted/30 border border-border">
            <p className="text-[11px] text-muted-foreground leading-relaxed">
              <strong>CROA Disclosure:</strong> AI KOACHED provides document preparation services only. No specific credit score improvement is guaranteed. Results vary. Billing occurs only after services are performed per 15 U.S.C. §1679.
            </p>
          </div>
        </div>
      )}

      {/* Entity Formation */}
      {activeTab === "entity" && (
        <div className="max-w-3xl mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {entityFormation.map((e) => (
              <div key={e.name} className="flex items-center justify-between rounded-xl border border-border p-4 bg-card hover:border-primary/30 transition-colors">
                <div className="flex items-center gap-3">
                  <Building2 className="w-4 h-4 text-primary" />
                  <span className="text-sm font-medium">{e.name}</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="font-mono text-lg font-bold text-primary">${e.price}</span>
                  <Button size="sm" variant="outline" className="text-xs border-primary/30 text-primary hover:bg-primary/10">
                    Start
                  </Button>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-4 p-4 rounded-lg bg-primary/5 border border-primary/20">
            <p className="text-xs text-muted-foreground">
              <strong className="text-primary">Builder+ members:</strong> Formation services are included or discounted with your membership. State filing fees apply separately.
            </p>
          </div>
          <div className="mt-2 p-4 rounded-lg bg-muted/30 border border-border">
            <p className="text-[11px] text-muted-foreground">
              <strong>Note:</strong> EIN is free to obtain directly from IRS.gov. The $77 fee covers our guided walkthrough service. State filing fees are separate and vary by state.
            </p>
          </div>
        </div>
      )}

      {/* AI Workforce Packages */}
      {activeTab === "ai" && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-5xl mx-auto">
          {aiPackages.map((pkg) => (
            <div
              key={pkg.name}
              className={cn(
                "flex flex-col rounded-xl border p-5 bg-card",
                pkg.flagship ? "border-primary ring-1 ring-primary" : "border-border"
              )}
            >
              {pkg.flagship && (
                <Badge className="self-start mb-3 bg-primary text-primary-foreground text-[10px]">Flagship</Badge>
              )}
              <h3 className="font-heading text-lg font-bold mb-1">{pkg.name}</h3>
              <div className="flex items-baseline gap-2 mb-3">
                <span className="font-mono text-3xl font-bold text-primary">${pkg.price.toLocaleString()}</span>
                <span className="text-xs text-muted-foreground">one-time</span>
              </div>
              <div className="flex items-center gap-2 mb-3">
                <Bot className="w-4 h-4 text-purple-accent" />
                <span className="text-sm font-mono font-bold text-purple-accent">{pkg.workers} AI workers</span>
                <span className="text-[10px] text-muted-foreground">replaces {pkg.humanCost} in staff</span>
              </div>
              <p className="text-xs text-muted-foreground flex-1 mb-4">{pkg.desc}</p>
              <Button className="w-full bg-primary text-primary-foreground hover:bg-primary/90" size="sm">
                Get Started <ArrowRight className="w-3 h-3 ml-1" />
              </Button>
            </div>
          ))}
        </div>
      )}

      {/* Done-For-You */}
      {activeTab === "dfy" && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-5xl mx-auto">
          {doneForYou.map((pkg) => (
            <div
              key={pkg.name}
              className={cn(
                "flex flex-col rounded-xl border p-5 bg-card",
                pkg.flagship ? "border-primary ring-1 ring-primary" : "border-border"
              )}
            >
              {pkg.flagship && (
                <Badge className="self-start mb-3 bg-primary text-primary-foreground text-[10px]">Premium</Badge>
              )}
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
      )}

      {/* Disclaimers */}
      <div className="mt-12 space-y-2 max-w-3xl mx-auto">
        <p className="text-[10px] text-muted-foreground/60 leading-relaxed">
          <strong>General:</strong> Results vary. Individual outcomes depend on effort, business type, market conditions, and other factors. AI KOACHED provides tools and guidance — not guaranteed business results.
        </p>
        <p className="text-[10px] text-muted-foreground/60 leading-relaxed">
          <strong>Income:</strong> $12,000/month is an aspirational goal — not a guaranteed income. Revenue results vary based on business type, effort, market, and execution.
        </p>
        <p className="text-[10px] text-muted-foreground/60 leading-relaxed">
          <strong>Market Data:</strong> Not financial advice. Market data is for informational purposes only. Investing involves risk. You may lose money.
        </p>
      </div>
    </div>
  );
}
