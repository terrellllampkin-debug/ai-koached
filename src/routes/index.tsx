import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { GoldParticles } from "@/components/GoldParticles";
import { Logo } from "@/components/Logo";
import {
  Building2, CreditCard, DollarSign, Globe, Brain, FileText,
  Users, Coins, BarChart3, PenTool, Wrench, Shield, Sparkles, TrendingUp,
  Check, ArrowRight, ChevronRight, Star,
} from "lucide-react";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "AI KOACHED — AI Builds Your Business. You Collect The Money." },
      { name: "description", content: "Entity formation, credit building, grant writing, AI workers — all done for you. The most powerful AI business platform." },
      { property: "og:title", content: "AI KOACHED — Millionaires Momentum" },
      { property: "og:description", content: "AI builds your business. You collect the money." },
    ],
  }),
  component: LandingPage,
});

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.1, duration: 0.6, ease: [0.22, 1, 0.36, 1] },
  }),
};

const features = [
  { icon: Building2, title: "Entity Formation", desc: "AI-guided LLC, Corp & Trust formation in all 50 states" },
  { icon: CreditCard, title: "Credit Empire", desc: "Personal & business credit repair with CROA compliance" },
  { icon: DollarSign, title: "Revenue Tracker", desc: "$12K/month goal system with processor rotation strategy" },
  { icon: Globe, title: "Global Empire", desc: "International entity formation across 12 countries" },
  { icon: Brain, title: "4 AI Agents", desc: "Max Credit, Empire Eva, Revenue Rex & Koach Coin" },
  { icon: FileText, title: "Grant Writing", desc: "AI-powered grant discovery and application writing" },
  { icon: Users, title: "Community", desc: "8 channels, challenges, leaderboards & $KOACH rewards" },
  { icon: Coins, title: "$KOACH Token", desc: "Utility token with staking, governance & premium AI access" },
  { icon: BarChart3, title: "Live Markets", desc: "Real-time crypto, forex & stock market data" },
  { icon: PenTool, title: "Content Studio", desc: "10-pillar content strategy with AI post generator" },
  { icon: Wrench, title: "110+ AI Tools", desc: "Business empire tools powered by AI" },
  { icon: Shield, title: "Legal Compliance", desc: "Terms, privacy, CROA disclosures & contracts" },
  { icon: Sparkles, title: "AI Morning Report", desc: "Wake up to see what your AI team did overnight" },
  { icon: TrendingUp, title: "Processor Rotation", desc: "Strategic rotation to qualify for business loans" },
];

const tiers = [
  { name: "Free", price: "$0", period: "/forever", features: ["Community access", "3 AI tool uses/day", "Market data", "500 $KOACH signup bonus"], cta: "Start Free", popular: false },
  { name: "Starter", price: "$47", period: "/mo", features: ["Everything in Free", "Unlimited AI tools", "Revenue tracker", "1 entity formation", "Grant pipeline", "Daily $KOACH rewards"], cta: "Get Started", popular: false },
  { name: "Builder", price: "$97", period: "/mo", features: ["Everything in Starter", "4 AI agents access", "Content studio", "3 entity formations", "Processor rotation", "Priority support"], cta: "Start Building", popular: true },
  { name: "Empire", price: "$197", period: "/mo", features: ["Everything in Builder", "Unlimited entities", "Global empire tools", "Trust layer planning", "Money flow diagrams", "Empire structure views"], cta: "Build Empire", popular: false },
  { name: "Dynasty", price: "$497", period: "/mo", features: ["Everything in Empire", "Dynasty-only channels", "Dynasty AI tools", "1-on-1 strategy calls", "White-glove formation", "Maximum $KOACH allocation"], cta: "Join Dynasty", popular: false },
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
            <a href="#features" className="hover:text-primary transition-colors">Features</a>
            <a href="#pricing" className="hover:text-primary transition-colors">Pricing</a>
            <Link to="/" className="hover:text-primary transition-colors">Login</Link>
            <Button size="sm" className="bg-primary text-primary-foreground hover:bg-primary/90 font-semibold">
              Get Started
            </Button>
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
            AI Builds Your Business.{" "}
            <span className="text-primary">You Collect The Money.</span>
          </motion.h1>

          <motion.p
            initial="hidden"
            animate="visible"
            variants={fadeUp}
            custom={2}
            className="mt-6 text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto"
          >
            Entity formation, credit building, grant writing, AI workers — all done for you.
          </motion.p>

          <motion.div
            initial="hidden"
            animate="visible"
            variants={fadeUp}
            custom={3}
            className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <Button size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90 text-base px-8 py-6 font-semibold gap-2 group">
              I Already Have a Business
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Button>
            <Button size="lg" variant="outline" className="border-primary/40 text-primary hover:bg-primary/10 text-base px-8 py-6 font-semibold gap-2">
              I Want to Start a Business
              <ChevronRight className="w-4 h-4" />
            </Button>
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
              $KOACH Rewards
            </div>
          </motion.div>
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
              14 integrated systems working together to build your business empire.
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
            <p className="mt-4 text-muted-foreground">Real members. Real results.</p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { name: "Marcus J.", tier: "Empire", quote: "Formed 3 LLCs, got my Paydex to 80, and hit $12K/month in 4 months. The AI agents are like having a full team." },
              { name: "Priya S.", tier: "Builder", quote: "The processor rotation strategy alone got me approved for Stripe Capital. Game changer for cash flow." },
              { name: "David O.", tier: "Dynasty", quote: "Running entities in 3 countries now. The Global Empire tools plus Empire Eva made it seamless." },
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

      {/* CTA */}
      <section className="py-24 relative">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 text-center">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
            custom={0}
          >
            <h2 className="font-heading text-3xl sm:text-4xl font-bold">
              Ready to Build Your <span className="text-primary">Empire</span>?
            </h2>
            <p className="mt-4 text-muted-foreground">
              Join thousands of members building generational wealth with AI.
            </p>
            <Button size="lg" className="mt-8 bg-primary text-primary-foreground hover:bg-primary/90 text-base px-10 py-6 font-semibold gap-2 group">
              Start Your Empire Today
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Button>
          </motion.div>
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
