import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { useAuth } from "@/hooks/useAuth";
import { ArrowLeft, DollarSign, TrendingUp, Target, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";

export const Route = createFileRoute("/empire/revenue")({
  head: () => ({
    meta: [
      { title: "Revenue HQ — AI KOACHED" },
      { name: "description", content: "Track your revenue and hit $12K/month." },
    ],
  }),
  component: RevenuePage,
});

const processors = [
  { name: "Stripe", status: "Recommended", monthlyVol: "$0-$50K", fees: "2.9% + $0.30" },
  { name: "Square", status: "Active", monthlyVol: "$0-$25K", fees: "2.6% + $0.10" },
  { name: "PayPal", status: "Backup", monthlyVol: "$0-$100K", fees: "2.99% + $0.49" },
  { name: "Shopify Payments", status: "E-commerce", monthlyVol: "$0-$100K", fees: "2.9% + $0.30" },
];

function RevenuePage() {
  const { isAuthenticated } = useAuth();
  if (!isAuthenticated) return null;

  const currentRevenue = 3200;
  const goal = 12000;
  const percentage = (currentRevenue / goal) * 100;

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="font-heading text-2xl font-bold flex items-center gap-2">
            <DollarSign className="w-6 h-6 text-success" />
            Revenue HQ
          </h1>
          <p className="text-sm text-muted-foreground">Track revenue & hit $12K/month</p>
        </div>

        {/* Revenue Goal */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-6 rounded-xl border border-border bg-card mb-6"
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-heading text-lg font-semibold flex items-center gap-2">
              <Target className="w-5 h-5 text-primary" />
              Monthly Revenue Goal
            </h2>
            <span className="font-mono text-2xl font-bold text-primary">${currentRevenue.toLocaleString()}</span>
          </div>
          <Progress value={percentage} className="h-3 mb-2" />
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span>${currentRevenue.toLocaleString()} earned</span>
            <span>${goal.toLocaleString()} goal</span>
          </div>
          <p className="mt-3 text-sm text-muted-foreground">
            ${(goal - currentRevenue).toLocaleString()} to go! You're {percentage.toFixed(0)}% there 🚀
          </p>
        </motion.div>

        {/* Processor Rotation */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="p-6 rounded-xl border border-border bg-card"
        >
          <h2 className="font-heading text-lg font-semibold mb-2 flex items-center gap-2">
            <Zap className="w-5 h-5 text-primary" />
            Processor Rotation Strategy
          </h2>
          <p className="text-xs text-muted-foreground mb-4">
            Rotate processors to build transaction history across multiple providers. This strengthens your business loan applications.
          </p>
          <div className="space-y-3">
            {processors.map((p) => (
              <div key={p.name} className="flex items-center justify-between p-3 rounded-lg border border-border">
                <div>
                  <p className="text-sm font-medium">{p.name}</p>
                  <p className="text-[10px] text-muted-foreground">Volume: {p.monthlyVol}</p>
                </div>
                <div className="text-right">
                  <p className="text-xs font-mono text-muted-foreground">{p.fees}</p>
                  <span className={`text-[10px] px-2 py-0.5 rounded-full ${
                    p.status === "Recommended" ? "bg-primary/10 text-primary" :
                    p.status === "Active" ? "bg-success/10 text-success" :
                    "bg-muted text-muted-foreground"
                  }`}>
                    {p.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
