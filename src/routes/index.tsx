import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { GoldParticles } from "@/components/GoldParticles";
import { Logo } from "@/components/Logo";
import {
  Building2, CreditCard, DollarSign, Globe, Brain, FileText,
  Users, Coins, BarChart3, PenTool, Wrench, Shield, Sparkles, TrendingUp,
  Check, ArrowRight, ChevronRight, Star, Clock, Bot,
} from "lucide-react";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "AI KOACHED — AI Guides You Through Building Your Entire Business" },
      { name: "description", content: "Answer 10 questions. AI handles entity formation, credit building, banking, grants, website, and revenue — step by step. You focus on your customers." },
      { property: "og:title", content: "AI KOACHED — Millionaires Momentum" },
      { property: "og:description", content: "AI guides you through every step of building your business. You focus on collecting the money." },
    ],
  }),
  component: LandingPage,
});

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.1, duration: 0.6, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] },
  }),
};

const dayByDay = [
  { day: "Day 1", title: "Answer 10 Questions", desc: "Empire Eva asks about your business, state, name, colors, domain. That's your only input for the day.", icon: Brain },
  { day: "Day 1", title: "AI Builds Your Foundation", desc: "Articles of Organization prepared, EIN application guided, operating agreement generated, website built and live at your domain.", icon: Building2 },
  { day: "Day 2", title: "Banking & Accounting Setup", desc: "AI guides you through Mercury + Chase accounts, connects Stripe/Square/PayPal, sets up processor rotation and auto-tracking.", icon: DollarSign },
  { day: "Day 3", title: "Credit Building Begins", desc: "Max Credit applies for DUNS, identifies your best net-30 vendors, pre-fills applications, and starts monitoring your Paydex.", icon: CreditCard },
  { day: "Day 4", title: "Grants & Revenue System", desc: "Revenue Rex finds grants you qualify for, writes applications, and builds your path to $12K/month with week-by-week plans.", icon: FileText },
  { day: "Day 5–30", title: "AI Workers Take Over", desc: "10 AI employees run your business 24/7 — customer support, bookkeeping, social media, email marketing, sales outreach, and more.", icon: Bot },
];

const aiWorkers = [
  { position: "Customer Support Agent", does: "Answers every customer question 24/7", cost: "$0/mo", humanCost: "$3,500/mo" },
  { position: "Bookkeeper", does: "Categorizes every transaction", cost: "$0/mo", humanCost: "$3,000/mo" },
  { position: "Social Media Manager", does: "Creates and schedules all content", cost: "$18/mo", humanCost: "$4,000/mo" },
  { position: "Grant Researcher", does: "Finds and writes grant applications", cost: "$20/mo", humanCost: "$3,000/mo" },
  { position: "Email Marketer", does: "Sends all automated sequences", cost: "$45/mo", humanCost: "$4,000/mo" },
  { position: "Sales Rep", does: "Sends cold outreach, follows up", cost: "$0/mo", humanCost: "$5,000/mo" },
];

const features = [
  { icon: Building2, title: "Entity Formation", desc: "AI-guided LLC, Corp & Trust formation in all 50 states" },
  { icon: CreditCard, title: "Credit Empire", desc: "Personal & business credit building with CROA compliance" },
  { icon: DollarSign, title: "Revenue Tracker", desc: "$12K/month goal system with processor rotation strategy" },
  { icon: Globe, title: "Global Empire", desc: "International entity formation across 12 countries" },
  { icon: Brain, title: "4 AI Agents", desc: "Max Credit, Empire Eva, Revenue Rex & KOACHed Coin" },
  { icon: FileText, title: "Grant Writing", desc: "AI-powered grant discovery and application writing" },
  { icon: Users, title: "Community", desc: "8 channels, challenges, leaderboards & $KOACHED rewards" },
  { icon: Coins, title: "$KOACHED Token", desc: "Utility token with staking, governance & premium AI access" },
  { icon: BarChart3, title: "Live Markets", desc: "Real-time crypto, forex & stock market data" },
  { icon: PenTool, title: "Content Studio", desc: "10-pillar content strategy with AI post generator" },
  { icon: Wrench, title: "110+ AI Tools", desc: "Business empire tools powered by AI" },
  { icon: Shield, title: "Legal Compliance", desc: "Terms, privacy, CROA disclosures & contracts" },
  { icon: Sparkles, title: "AI Morning Report", desc: "Wake up to see what your AI team did overnight" },
  { icon: TrendingUp, title: "Processor Rotation", desc: "Strategic rotation to position you for business loans" },
];

const tiers = [
  { name: "Free", price: "$0", period: "/forever", features: ["Community access", "3 AI tool uses/day", "Market data", "500 $KOACHED signup bonus"], cta: "Start Free", popular: false },
  { name: "Starter", price: "$47", period: "/mo", features: ["Everything in Free", "Unlimited AI tools", "Revenue tracker", "1 entity formation", "Grant pipeline", "Daily $KOACHED rewards"], cta: "Get Started", popular: false },
  { name: "Builder", price: "$97", period: "/mo", features: ["Everything in Starter", "4 AI agents access", "Content studio", "3 entity formations", "Processor rotation", "Priority support"], cta: "Start Building", popular: true },
  { name: "Empire", price: "$197", period: "/mo", features: ["Everything in Builder", "Unlimited entities", "Global empire tools", "Trust layer planning", "Money flow diagrams", "Empire structure views"], cta: "Build Empire", popular: false },
  { name: "Dynasty", price: "$497", period: "/mo", features: ["Everything in Empire", "Dynasty-only channels", "Dynasty AI tools", "1-on-1 strategy calls", "White-glove formation", "Maximum $KOACHED allocation"], cta: "Join Dynasty", popular: false },
];

function LandingPage() {
  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden">
      {/* Nav */}
      <nav className="fixed top-0 left-0 right-0 z-50 border-b border-border bg-background/80 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Logo size={36} />
            <span className="font-heading text-lg font-bold tracking-wider text-primary">AI KOACHED</span>
          </div>
          <div className="hidden md:flex items-center gap-6 text-sm text-muted-foreground">
            <a href="#how-it-works" className="hover:text-primary transition-colors">How It Works</a>
            <a href="#features" className="hover:text-primary transition-colors">Features</a>
            <a href="#pricing" className="hover:text-primary transition-colors">Pricing</a>
            <Link to="/login" className="hover:text-primary transition-colors">Login</Link>
            <Link to="/login">
              <Button size="sm" className="bg-primary text-primary-foreground hover:bg-primary/90 font-semibold">
                Get Started
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative min-h-screen flex items-center justify-center pt-16">
        <GoldParticles />
        <div className="absolute inset-0 bg-gradient-to-b from-background via-background/95 to-background pointer-events-none" />
        <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 text-center py-20">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={fadeUp}
            custom={0}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-primary/30 bg-primary/5 text-primary text-sm font-medium mb-8"
          >
            <Sparkles className="w-4 h-4" />
            Millionaires Momentum Platform
          </motion.div>

          <motion.h1
            initial="hidden"
            animate="visible"
            variants={fadeUp}
            custom={1}
            className="font-heading text-4xl sm:text-5xl md:text-7xl font-bold leading-tight tracking-tight"
          >
            You Answer 10 Questions.{" "}
            <span className="text-primary">AI Builds Your Business.</span>
          </motion.h1>

          <motion.p
            initial="hidden"
            animate="visible"
            variants={fadeUp}
            custom={2}
            className="mt-6 text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto"
          >
            AI guides you through entity formation, credit building, banking, grants, website creation, and revenue generation — step by step. You focus on your customers.
          </motion.p>

          <motion.div
            initial="hidden"
            animate="visible"
            variants={fadeUp}
            custom={3}
            className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <Link to="/login">
              <Button size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90 text-base px-8 py-6 font-semibold gap-2 group">
                I Already Have a Business
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
            <Link to="/login">
              <Button size="lg" variant="outline" className="border-primary/40 text-primary hover:bg-primary/10 text-base px-8 py-6 font-semibold gap-2">
                I Want to Start a Business
                <ChevronRight className="w-4 h-4" />
              </Button>
            </Link>
          </motion.div>

          <motion.div
            initial="hidden"
            animate="visible"
            variants={fadeUp}
            custom={4}
            className="mt-12 flex items-center justify-center gap-8 text-sm text-muted-foreground"
          >
            <div className="flex items-center gap-2">
              <Check className="w-4 h-4 text-success" />
              4 AI Agents
            </div>
            <div className="flex items-center gap-2">
              <Check className="w-4 h-4 text-success" />
              110+ Tools
            </div>
            <div className="flex items-center gap-2">
              <Check className="w-4 h-4 text-success" />
              $KOACHED Rewards
            </div>
          </motion.div>
        </div>
      </section>

      {/* How It Works — Day by Day */}
      <section id="how-it-works" className="py-24 relative">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={fadeUp}
            custom={0}
            className="text-center mb-16"
          >
            <h2 className="font-heading text-3xl sm:text-4xl font-bold text-foreground">
              How It Works — <span className="text-primary">Day by Day</span>
            </h2>
            <p className="mt-4 text-muted-foreground max-w-xl mx-auto">
              Members who follow the complete program typically have their entity formed, website live, and credit building within 30 days.
            </p>
          </motion.div>

          <div className="space-y-4">
            {dayByDay.map((step, i) => (
              <motion.div
                key={step.title}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-50px" }}
                variants={fadeUp}
                custom={i % 3}
                className="flex gap-5 p-5 rounded-xl border border-border bg-card hover:border-primary/40 transition-all"
              >
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                  <step.icon className="w-6 h-6 text-primary" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-1">
                    <span className="px-2 py-0.5 rounded-full bg-primary/10 text-primary text-xs font-mono font-bold">{step.day}</span>
                    <h3 className="font-heading text-base font-semibold">{step.title}</h3>
                  </div>
                  <p className="text-sm text-muted-foreground leading-relaxed">{step.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* AI Workers */}
      <section className="py-24 relative">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={fadeUp}
            custom={0}
            className="text-center mb-16"
          >
            <h2 className="font-heading text-3xl sm:text-4xl font-bold text-foreground">
              Your <span className="text-primary">AI Workforce</span>
            </h2>
            <p className="mt-4 text-muted-foreground max-w-xl mx-auto">
              AI employees designed to handle your daily business operations — for a fraction of what human staff would cost.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {aiWorkers.map((w, i) => (
              <motion.div
                key={w.position}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-50px" }}
                variants={fadeUp}
                custom={i % 3}
                className="p-5 rounded-xl border border-border bg-card"
              >
                <h3 className="font-heading text-sm font-semibold mb-1">{w.position}</h3>
                <p className="text-xs text-muted-foreground mb-3">{w.does}</p>
                <div className="flex items-center justify-between text-xs">
                  <span className="font-mono font-bold text-primary">{w.cost}</span>
                  <span className="text-muted-foreground line-through">{w.humanCost}</span>
                </div>
              </motion.div>
            ))}
          </div>
          <p className="text-center mt-6 text-sm text-muted-foreground">
            Total AI workforce: <span className="font-mono font-bold text-primary">~$148/mo</span> vs <span className="line-through">$36,000/mo</span> for human equivalents
          </p>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-24 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={fadeUp}
            custom={0}
            className="text-center mb-16"
          >
            <h2 className="font-heading text-3xl sm:text-4xl font-bold text-foreground">
              Your Complete <span className="text-primary">Empire Toolkit</span>
            </h2>
            <p className="mt-4 text-muted-foreground max-w-xl mx-auto">
              14 integrated systems designed to work together to help you build your business empire.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {features.map((f, i) => (
              <motion.div
                key={f.title}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-50px" }}
                variants={fadeUp}
                custom={i % 4}
                className="group p-5 rounded-xl border border-border bg-card backdrop-blur-sm hover:border-primary/40 transition-all duration-300"
              >
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center mb-3 group-hover:bg-primary/20 transition-colors">
                  <f.icon className="w-5 h-5 text-primary" />
                </div>
                <h3 className="font-heading text-sm font-semibold mb-1">{f.title}</h3>
                <p className="text-xs text-muted-foreground leading-relaxed">{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="py-24 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={fadeUp}
            custom={0}
            className="text-center mb-16"
          >
            <h2 className="font-heading text-3xl sm:text-4xl font-bold text-foreground">
              Choose Your <span className="text-primary">Tier</span>
            </h2>
            <p className="mt-4 text-muted-foreground">
              Every tier unlocks more power. Dynasty members get the gold treatment.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {tiers.map((tier, i) => (
              <motion.div
                key={tier.name}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-50px" }}
                variants={fadeUp}
                custom={i}
                className={`relative flex flex-col p-6 rounded-xl border backdrop-blur-sm transition-all duration-300 ${
                  tier.popular
                    ? "border-primary bg-primary/5 shadow-[0_0_40px_-10px] shadow-primary/20 scale-[1.02]"
                    : tier.name === "Dynasty"
                    ? "border-primary/60 bg-gradient-to-b from-primary/10 to-transparent"
                    : "border-border bg-card hover:border-primary/30"
                }`}
              >
                {tier.popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 bg-primary text-primary-foreground text-xs font-bold rounded-full">
                    MOST POPULAR
                  </div>
                )}
                {tier.name === "Dynasty" && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 bg-primary text-primary-foreground text-xs font-bold rounded-full flex items-center gap-1">
                    <Star className="w-3 h-3" /> DYNASTY
                  </div>
                )}
                <h3 className="font-heading text-lg font-semibold">{tier.name}</h3>
                <div className="mt-3 flex items-baseline gap-1">
                  <span className="font-mono text-3xl font-bold text-primary">{tier.price}</span>
                  <span className="text-sm text-muted-foreground">{tier.period}</span>
                </div>
                <ul className="mt-5 flex-1 space-y-2.5">
                  {tier.features.map((f) => (
                    <li key={f} className="flex items-start gap-2 text-xs text-muted-foreground">
                      <Check className="w-3.5 h-3.5 text-success mt-0.5 shrink-0" />
                      {f}
                    </li>
                  ))}
                </ul>
                <Button
                  className={`mt-6 w-full font-semibold ${
                    tier.popular || tier.name === "Dynasty"
                      ? "bg-primary text-primary-foreground hover:bg-primary/90"
                      : "bg-muted text-foreground hover:bg-muted/80"
                  }`}
                >
                  {tier.cta}
                </Button>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-24 relative">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={fadeUp}
            custom={0}
            className="text-center mb-16"
          >
            <h2 className="font-heading text-3xl sm:text-4xl font-bold text-foreground">
              Empire <span className="text-primary">Builders</span>
            </h2>
            <p className="mt-4 text-muted-foreground">Real members. Real progress.</p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { name: "Marcus J.", tier: "Empire", quote: "Formed 3 LLCs using the system, built my Paydex toward 80, and the AI revenue tools helped me hit my monthly goals in 4 months." },
              { name: "Priya S.", tier: "Builder", quote: "The processor rotation strategy positioned me for Stripe Capital approval. The system made cash flow management so much clearer." },
              { name: "David O.", tier: "Dynasty", quote: "Running entities in 3 countries now. The Global Empire tools plus Empire Eva guided me through the entire process seamlessly." },
            ].map((t, i) => (
              <motion.div
                key={t.name}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-50px" }}
                variants={fadeUp}
                custom={i}
                className="p-6 rounded-xl border border-border bg-card"
              >
                <div className="flex items-center gap-1 mb-4">
                  {Array.from({ length: 5 }).map((_, j) => (
                    <Star key={j} className="w-4 h-4 fill-primary text-primary" />
                  ))}
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed mb-4">"{t.quote}"</p>
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-primary/20 flex items-center justify-center text-sm font-bold text-primary">
                    {t.name[0]}
                  </div>
                  <div>
                    <div className="text-sm font-medium">{t.name}</div>
                    <div className="text-xs text-primary">{t.tier} Member</div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 90-Day Satisfaction Guarantee */}
      <section className="py-24 relative">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 text-center">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
            custom={0}
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-primary/30 bg-primary/5 text-primary text-sm font-medium mb-6">
              <Shield className="w-4 h-4" />
              90-Day Satisfaction Guarantee
            </div>
            <h2 className="font-heading text-3xl sm:text-4xl font-bold">
              Our System Is <span className="text-primary">Built to Deliver</span>
            </h2>
            <p className="mt-4 text-muted-foreground max-w-xl mx-auto">
              If you complete the full onboarding process and are not satisfied with the platform's tools and guidance, we'll refund your membership. No questions asked.
            </p>
            <Link to="/login">
              <Button size="lg" className="mt-8 bg-primary text-primary-foreground hover:bg-primary/90 text-base px-10 py-6 font-semibold gap-2 group">
                Start Your Empire Today
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Disclaimers */}
      <section className="py-12 border-t border-border">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 space-y-4 text-[10px] text-muted-foreground/60 leading-relaxed">
          <p><strong>General Disclaimer:</strong> Results vary. Individual outcomes depend on effort, business type, market conditions, and other factors. AI KOACHED provides tools and guidance — not guaranteed business results.</p>
          <p><strong>Credit Services (CROA):</strong> AI KOACHED provides document preparation services only. No specific credit score improvement is guaranteed. Results vary. Billing occurs only after services are performed per 15 U.S.C. §1679.</p>
          <p><strong>Income/Revenue:</strong> $12,000/month is an aspirational goal — not a guaranteed income. Revenue results vary based on business type, effort, market, and execution. This is not a get-rich-quick program.</p>
          <p><strong>Market Data:</strong> Not financial advice. Market data is for informational purposes only. Investing involves risk. You may lose money. $KOACHED is a utility token, not an investment or security.</p>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-3">
              <Logo size={28} />
              <span className="font-heading text-sm font-bold tracking-wider text-primary">AI KOACHED</span>
            </div>
            <div className="flex items-center gap-6 text-sm text-muted-foreground">
              <Link to="/" className="hover:text-primary transition-colors">Terms</Link>
              <Link to="/" className="hover:text-primary transition-colors">Privacy</Link>
              <Link to="/" className="hover:text-primary transition-colors">CROA Disclosure</Link>
              <Link to="/" className="hover:text-primary transition-colors">Disclaimer</Link>
            </div>
            <p className="text-xs text-muted-foreground">© 2026 AI KOACHED. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
