import { createFileRoute } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { useState, useEffect } from "react";
import { DollarSign, TrendingUp, Target, Zap, Plus, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

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
  { name: "Stripe", status: "Recommended", monthlyVol: "$0-$50K", fees: "2.9% + $0.30", color: "#635bff", rotation: "Jan–Apr", loanEligible: true },
  { name: "Square", status: "Active", monthlyVol: "$0-$25K", fees: "2.6% + $0.10", color: "#3eb489", rotation: "May–Aug", loanEligible: false },
  { name: "PayPal", status: "Backup", monthlyVol: "$0-$100K", fees: "2.99% + $0.49", color: "#003087", rotation: "Sep–Dec", loanEligible: true },
  { name: "Shopify Payments", status: "E-commerce", monthlyVol: "$0-$100K", fees: "2.9% + $0.30", color: "#96bf48", rotation: "Rotating", loanEligible: false },
];

function RevenuePage() {
  const { user, isAuthenticated } = useAuth();
  const [logs, setLogs] = useState<Array<{ id: string; amount: number; source: string; description: string | null; logged_date: string }>>([]);
  const [monthlyTotal, setMonthlyTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [newAmount, setNewAmount] = useState("");
  const [newSource, setNewSource] = useState("");
  const [newDesc, setNewDesc] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const goal = 12000;
  const percentage = Math.min((monthlyTotal / goal) * 100, 100);

  useEffect(() => {
    if (!user) return;
    loadRevenue();

    const channel = supabase
      .channel("revenue-realtime")
      .on("postgres_changes", { event: "*", schema: "public", table: "revenue_logs", filter: `user_id=eq.${user.id}` }, () => {
        loadRevenue();
      })
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, [user]);

  const loadRevenue = async () => {
    if (!user) return;
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1).toISOString().split("T")[0];

    const { data } = await supabase
      .from("revenue_logs")
      .select("*")
      .eq("user_id", user.id)
      .gte("logged_date", startOfMonth)
      .order("logged_date", { ascending: false });

    if (data) {
      setLogs(data as any);
      setMonthlyTotal(data.reduce((sum, r: any) => sum + Number(r.amount), 0));
    }
    setLoading(false);
  };

  const handleAdd = async () => {
    if (!user || !newAmount || submitting) return;
    setSubmitting(true);
    await supabase.from("revenue_logs").insert({
      user_id: user.id,
      amount: parseFloat(newAmount),
      source: newSource || "manual",
      description: newDesc || null,
    });
    setNewAmount("");
    setNewSource("");
    setNewDesc("");
    setDialogOpen(false);
    setSubmitting(false);
  };

  if (!isAuthenticated) return null;

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="font-heading text-2xl font-bold flex items-center gap-2">
              <DollarSign className="w-6 h-6 text-success" />
              Revenue HQ
            </h1>
            <p className="text-sm text-muted-foreground">Track revenue & hit $12K/month</p>
          </div>
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button size="sm" className="gap-1" style={{ background: "linear-gradient(135deg, oklch(0.78 0.13 85), oklch(0.65 0.13 85))", color: "oklch(0.145 0.005 285)", boxShadow: "0 4px 20px oklch(0.78 0.13 85 / 25%)" }}>
                <Plus className="w-4 h-4" /> Log Revenue
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Log Revenue</DialogTitle>
              </DialogHeader>
              <div className="space-y-3 pt-2">
                <Input type="number" placeholder="Amount ($)" value={newAmount} onChange={(e) => setNewAmount(e.target.value)} />
                <Input placeholder="Source (e.g. Stripe, Cash, Invoice)" value={newSource} onChange={(e) => setNewSource(e.target.value)} />
                <Input placeholder="Description (optional)" value={newDesc} onChange={(e) => setNewDesc(e.target.value)} />
                <Button onClick={handleAdd} disabled={!newAmount || submitting} className="w-full bg-primary text-primary-foreground">
                  {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : "Add Revenue"}
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Revenue Goal — Premium */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass-card p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-heading text-lg font-semibold flex items-center gap-2">
              <Target className="w-5 h-5 text-primary" />
              Monthly Revenue Goal
            </h2>
            <span className="font-mono font-bold text-primary" style={{ fontSize: "42px", lineHeight: 1, textShadow: "0 0 30px oklch(0.78 0.13 85 / 30%)" }}>
              {loading ? "..." : `$${monthlyTotal.toLocaleString()}`}
            </span>
          </div>
          {/* Shimmer progress bar */}
          <div className="relative h-4 rounded-full bg-muted overflow-hidden mb-2">
            <div
              className="absolute inset-y-0 left-0 rounded-full transition-all duration-700"
              style={{
                width: `${percentage}%`,
                background: "linear-gradient(90deg, oklch(0.78 0.13 85), oklch(0.65 0.13 85))",
              }}
            />
            <div className="absolute inset-0 shimmer rounded-full" style={{ width: `${percentage}%` }} />
          </div>
          <div className="flex items-center justify-between text-xs text-muted-foreground font-mono">
            <span>${monthlyTotal.toLocaleString()} earned</span>
            <span>${goal.toLocaleString()} goal</span>
          </div>
          <p className="mt-3 text-sm text-muted-foreground">
            ${(goal - monthlyTotal).toLocaleString()} to go! You're <span className="font-mono font-bold text-primary">{percentage.toFixed(0)}%</span> there 🚀
          </p>
        </motion.div>

        {/* Recent Revenue */}
        {logs.length > 0 && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }} className="glass-card p-6 mb-6">
            <h2 className="font-heading text-lg font-semibold mb-4 flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-primary" />
              This Month's Revenue
            </h2>
            <div className="space-y-2">
              {logs.map((log) => (
                <div key={log.id} className="flex items-center justify-between py-2 border-b border-border/50 last:border-0">
                  <div>
                    <p className="text-sm">{log.description || log.source}</p>
                    <p className="text-[10px] text-muted-foreground font-mono">{new Date(log.logged_date).toLocaleDateString()} • {log.source}</p>
                  </div>
                  <span className="font-mono text-sm font-bold text-success">+${Number(log.amount).toLocaleString()}</span>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Processor Rotation — Color Coded */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="glass-card p-6">
          <h2 className="font-heading text-lg font-semibold mb-2 flex items-center gap-2">
            <Zap className="w-5 h-5 text-primary" />
            Processor Rotation Strategy
          </h2>
          <p className="text-xs text-muted-foreground mb-4">
            Rotate processors to build transaction history across multiple providers — positions you for business loans.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {processors.map((p) => (
              <div
                key={p.name}
                className="p-4 rounded-xl border transition-all hover:scale-[1.02]"
                style={{
                  borderColor: p.color + "40",
                  background: p.color + "08",
                }}
              >
                <div className="flex items-center justify-between mb-2">
                  <p className="text-sm font-heading font-semibold" style={{ color: p.color }}>{p.name}</p>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded-full border" style={{ borderColor: p.color + "40", color: p.color }}>
                    {p.status}
                  </span>
                </div>
                <div className="space-y-1 text-xs text-muted-foreground">
                  <p className="font-mono">Fees: {p.fees}</p>
                  <p className="font-mono">Rotation: {p.rotation}</p>
                  <p className="font-mono">
                    Loan Eligible: {p.loanEligible ? (
                      <span className="text-success font-bold">✓ Yes</span>
                    ) : (
                      <span className="text-muted-foreground">Not yet</span>
                    )}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
