import { createFileRoute } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { useState, useEffect } from "react";
import { CreditCard, TrendingUp, Building2, CheckCircle, AlertTriangle, Shield } from "lucide-react";

export const Route = createFileRoute("/empire/credit")({
  head: () => ({
    meta: [
      { title: "Credit Empire — AI KOACHED" },
      { name: "description", content: "Build your personal and business credit empire." },
    ],
  }),
  component: CreditPage,
});

const vendorAccounts = [
  { name: "Uline", type: "Net-30", reportTo: "D&B", minOrder: "$50", status: "open", daysUntil: 18 },
  { name: "Grainger", type: "Net-30", reportTo: "D&B, Experian", minOrder: "$0", status: "pending", daysUntil: 30 },
  { name: "Quill", type: "Net-30", reportTo: "D&B", minOrder: "$50", status: "open", daysUntil: 12 },
  { name: "Crown Office", type: "Net-30", reportTo: "D&B", minOrder: "$0", status: "not_started", daysUntil: 30 },
  { name: "Strategic Network Solutions", type: "Net-30", reportTo: "D&B, Experian, Equifax", minOrder: "$49", status: "open", daysUntil: 22 },
  { name: "The CEO Creative", type: "Net-30", reportTo: "D&B, Experian", minOrder: "$0", status: "pending", daysUntil: 30 },
];

const bureaus = [
  { name: "Equifax", score: 712, max: 850, color: "oklch(0.58 0.22 25)" },
  { name: "Experian", score: 698, max: 850, color: "oklch(0.55 0.14 300)" },
  { name: "TransUnion", score: 725, max: 850, color: "oklch(0.72 0.19 155)" },
];

function ScoreRing({ name, score, max, color }: { name: string; score: number; max: number; color: string }) {
  const pct = (score / max) * 100;
  const deg = (pct / 100) * 360;
  return (
    <div className="flex flex-col items-center gap-2">
      <div
        className="score-ring"
        style={{
          background: `conic-gradient(${color} ${deg}deg, oklch(0.22 0.005 285) ${deg}deg)`,
        }}
      >
        <div className="w-[96px] h-[96px] rounded-full bg-background flex flex-col items-center justify-center">
          <span className="font-mono text-2xl font-bold" style={{ color }}>{score}</span>
          <span className="text-[9px] text-muted-foreground font-mono">/ {max}</span>
        </div>
      </div>
      <span className="text-xs font-heading font-semibold text-foreground">{name}</span>
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const styles: Record<string, string> = {
    open: "bg-success/15 text-success border-success/25",
    pending: "bg-primary/15 text-primary border-primary/25",
    not_started: "bg-secondary/15 text-secondary border-secondary/25",
  };
  const labels: Record<string, string> = {
    open: "Open",
    pending: "Pending",
    not_started: "Not Started",
  };
  return (
    <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-full border ${styles[status] || styles.not_started}`}>
      {labels[status] || status}
    </span>
  );
}

function CreditPage() {
  const { user, isAuthenticated } = useAuth();
  const [accounts, setAccounts] = useState<Array<{ id: string; account_name: string; account_type: string; credit_limit: number | null; balance: number | null; status: string }>>([]);

  useEffect(() => {
    if (!user) return;
    supabase
      .from("credit_accounts")
      .select("*")
      .eq("user_id", user.id)
      .then(({ data }) => {
        if (data) setAccounts(data);
      });
  }, [user]);

  if (!isAuthenticated) return null;

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* CROA Banner */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6 p-4 rounded-xl glass-card pulse-gold flex items-start gap-3"
        >
          <Shield className="w-5 h-5 text-primary shrink-0 mt-0.5" />
          <div>
            <p className="text-xs font-heading font-semibold text-primary mb-1">CROA COMPLIANCE NOTICE</p>
            <p className="text-[11px] text-muted-foreground leading-relaxed">
              AI KOACHED provides document preparation assistance only. We do NOT guarantee any specific credit score improvement. Billing occurs ONLY after each service round is completed. You may cancel at any time. You have 3 business days after signing to cancel for a full refund. Per 15 U.S.C. §1679 (Credit Repair Organizations Act).
            </p>
          </div>
        </motion.div>

        <div className="mb-8">
          <h1 className="font-heading text-2xl font-bold flex items-center gap-2">
            <CreditCard className="w-6 h-6 text-primary" />
            Credit Empire
          </h1>
          <p className="text-sm text-muted-foreground">Build personal & business credit</p>
        </div>

        {/* Score Rings */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-card p-6 mb-6"
        >
          <h2 className="font-heading text-lg font-semibold mb-6 text-center">Credit Bureau Scores</h2>
          <div className="flex justify-center gap-8 flex-wrap">
            {bureaus.map((b) => (
              <ScoreRing key={b.name} {...b} />
            ))}
          </div>
          <p className="text-center text-[10px] text-muted-foreground mt-4 font-mono">
            Scores update when you run Credit Scanner
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Your Accounts */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass-card p-6"
          >
            <h2 className="font-heading text-lg font-semibold mb-4 flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-primary" />
              Your Accounts ({accounts.length})
            </h2>
            {accounts.length === 0 ? (
              <p className="text-sm text-muted-foreground">No accounts tracked yet. Start with Net-30 vendors below!</p>
            ) : (
              <div className="space-y-3">
                {accounts.map((acc) => (
                  <div key={acc.id} className="flex items-center justify-between p-3 rounded-lg bg-muted/30 border border-border">
                    <div>
                      <p className="text-sm font-medium">{acc.account_name}</p>
                      <p className="text-xs text-muted-foreground">{acc.account_type}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-mono text-primary">${acc.credit_limit?.toLocaleString() || "N/A"}</p>
                      <p className="text-[10px] text-muted-foreground">{acc.status}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </motion.div>

          {/* Net-30 Vendor Table */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="glass-card p-6"
          >
            <h2 className="font-heading text-lg font-semibold mb-4 flex items-center gap-2">
              <Building2 className="w-5 h-5 text-primary" />
              Net-30 Vendor Accounts
            </h2>
            <p className="text-xs text-muted-foreground mb-4">
              Open these accounts to start building business credit. Pay on time = Paydex score grows.
            </p>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-[10px] text-muted-foreground font-mono uppercase border-b border-border">
                    <th className="text-left py-2 pr-2">Vendor</th>
                    <th className="text-left py-2 pr-2">Reports To</th>
                    <th className="text-left py-2 pr-2">Min Order</th>
                    <th className="text-left py-2 pr-2">Status</th>
                    <th className="text-right py-2">Days</th>
                  </tr>
                </thead>
                <tbody>
                  {vendorAccounts.map((vendor) => (
                    <tr key={vendor.name} className="border-b border-border/50 hover:bg-primary/5 transition-colors">
                      <td className="py-2.5 pr-2 font-medium">{vendor.name}</td>
                      <td className="py-2.5 pr-2 text-xs text-muted-foreground">{vendor.reportTo}</td>
                      <td className="py-2.5 pr-2 font-mono text-xs">{vendor.minOrder}</td>
                      <td className="py-2.5 pr-2"><StatusBadge status={vendor.status} /></td>
                      <td className="py-2.5 text-right font-mono text-xs text-muted-foreground">{vendor.daysUntil}d</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
