import { createFileRoute } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { useState, useEffect } from "react";
import { DollarSign, TrendingUp, Target, Zap, Plus, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
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
  { name: "Stripe", status: "Recommended", monthlyVol: "$0-$50K", fees: "2.9% + $0.30" },
  { name: "Square", status: "Active", monthlyVol: "$0-$25K", fees: "2.6% + $0.10" },
  { name: "PayPal", status: "Backup", monthlyVol: "$0-$100K", fees: "2.99% + $0.49" },
  { name: "Shopify Payments", status: "E-commerce", monthlyVol: "$0-$100K", fees: "2.9% + $0.30" },
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

    // Realtime subscription
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
              <Button size="sm" className="bg-primary text-primary-foreground gap-1">
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

        {/* Revenue Goal */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="p-6 rounded-xl border border-border bg-card mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-heading text-lg font-semibold flex items-center gap-2">
              <Target className="w-5 h-5 text-primary" />
              Monthly Revenue Goal
            </h2>
            <span className="font-mono text-2xl font-bold text-primary">
              {loading ? "..." : `$${monthlyTotal.toLocaleString()}`}
            </span>
          </div>
          <Progress value={percentage} className="h-3 mb-2" />
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span>${monthlyTotal.toLocaleString()} earned</span>
            <span>${goal.toLocaleString()} goal</span>
          </div>
          <p className="mt-3 text-sm text-muted-foreground">
            ${(goal - monthlyTotal).toLocaleString()} to go! You're {percentage.toFixed(0)}% there 🚀
          </p>
        </motion.div>

        {/* Recent Revenue Entries */}
        {logs.length > 0 && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }} className="p-6 rounded-xl border border-border bg-card mb-6">
            <h2 className="font-heading text-lg font-semibold mb-4 flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-primary" />
              This Month's Revenue
            </h2>
            <div className="space-y-2">
              {logs.map((log) => (
                <div key={log.id} className="flex items-center justify-between py-2 border-b border-border last:border-0">
                  <div>
                    <p className="text-sm">{log.description || log.source}</p>
                    <p className="text-[10px] text-muted-foreground">{new Date(log.logged_date).toLocaleDateString()} • {log.source}</p>
                  </div>
                  <span className="font-mono text-sm font-bold text-success">+${Number(log.amount).toLocaleString()}</span>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Processor Rotation */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="p-6 rounded-xl border border-border bg-card">
          <h2 className="font-heading text-lg font-semibold mb-2 flex items-center gap-2">
            <Zap className="w-5 h-5 text-primary" />
            Processor Rotation Strategy
          </h2>
          <p className="text-xs text-muted-foreground mb-4">
            Rotate processors to build transaction history across multiple providers.
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
