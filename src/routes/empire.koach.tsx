import { createFileRoute } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { useState, useEffect } from "react";
import { Coins, Gift, History } from "lucide-react";

export const Route = createFileRoute("/empire/koach")({
  head: () => ({
    meta: [
      { title: "$KOACHED Tower — AI KOACHED" },
      { name: "description", content: "Your $KOACHED token balance and earn history." },
    ],
  }),
  component: KoachPage,
});

function KoachPage() {
  const { user, isAuthenticated } = useAuth();
  const [balance, setBalance] = useState(0);
  const [lifetimeEarned, setLifetimeEarned] = useState(0);
  const [transactions, setTransactions] = useState<Array<{ id: string; amount: number; reason: string; source: string | null; created_at: string }>>([]);

  useEffect(() => {
    if (!user) return;

    supabase.from("koach_balances").select("*").eq("user_id", user.id).single()
      .then(({ data }) => {
        if (data) {
          setBalance(data.balance);
          setLifetimeEarned(data.lifetime_earned);
        }
      });

    supabase.from("koach_transactions").select("*").eq("user_id", user.id)
      .order("created_at", { ascending: false }).limit(20)
      .then(({ data }) => { if (data) setTransactions(data); });
  }, [user]);

  if (!isAuthenticated) return null;

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="font-heading text-2xl font-bold flex items-center gap-2">
            <Coins className="w-6 h-6 text-primary" />
            $KOACHED Tower
          </h1>
          <p className="text-sm text-muted-foreground">Your utility token balance & history</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="p-6 rounded-xl border border-primary/30 bg-gradient-to-br from-primary/5 to-transparent"
          >
            <p className="text-sm text-muted-foreground mb-1">Current Balance</p>
            <p className="font-mono text-4xl font-bold text-primary">{balance.toLocaleString()}</p>
            <p className="text-xs text-muted-foreground mt-1">$KOACHED tokens</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1 }}
            className="p-6 rounded-xl border border-border bg-card"
          >
            <p className="text-sm text-muted-foreground mb-1">Lifetime Earned</p>
            <p className="font-mono text-4xl font-bold text-foreground">{lifetimeEarned.toLocaleString()}</p>
            <p className="text-xs text-muted-foreground mt-1">total $KOACHED earned</p>
          </motion.div>
        </div>

        {/* How to Earn */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="p-6 rounded-xl border border-border bg-card mb-6"
        >
          <h2 className="font-heading text-lg font-semibold mb-4 flex items-center gap-2">
            <Gift className="w-5 h-5 text-primary" />
            How to Earn $KOACHED
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {[
              { action: "AI Chat", reward: "+5", per: "per message" },
              { action: "Sign Up", reward: "+500", per: "one time" },
              { action: "Form Entity", reward: "+500", per: "per entity" },
              { action: "Get EIN", reward: "+250", per: "per EIN" },
              { action: "Hit $1K", reward: "+1,000", per: "milestone" },
              { action: "Hit $12K", reward: "+5,000", per: "milestone" },
            ].map((item) => (
              <div key={item.action} className="p-3 rounded-lg border border-border text-center">
                <p className="font-mono text-lg font-bold text-primary">{item.reward}</p>
                <p className="text-xs font-medium">{item.action}</p>
                <p className="text-[10px] text-muted-foreground">{item.per}</p>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Transaction History */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="p-6 rounded-xl border border-border bg-card"
        >
          <h2 className="font-heading text-lg font-semibold mb-4 flex items-center gap-2">
            <History className="w-5 h-5 text-primary" />
            Recent Transactions
          </h2>
          {transactions.length === 0 ? (
            <p className="text-sm text-muted-foreground">No transactions yet.</p>
          ) : (
            <div className="space-y-2">
              {transactions.map((tx) => (
                <div key={tx.id} className="flex items-center justify-between py-2 border-b border-border last:border-0">
                  <div>
                    <p className="text-sm">{tx.reason}</p>
                    <p className="text-[10px] text-muted-foreground">
                      {new Date(tx.created_at).toLocaleDateString()} • {tx.source || "system"}
                    </p>
                  </div>
                  <span className={`font-mono text-sm font-bold ${tx.amount > 0 ? "text-success" : "text-destructive"}`}>
                    {tx.amount > 0 ? "+" : ""}{tx.amount}
                  </span>
                </div>
              ))}
            </div>
          )}
        </motion.div>

        {/* Pre-launch notice */}
        <div className="mt-6 p-4 rounded-xl border border-primary/20 bg-primary/5 text-center">
          <p className="text-sm text-muted-foreground">
            🚀 $KOACHED is currently tracked in your account. On-chain Solana SPL token launch coming soon!
          </p>
          <p className="text-[10px] text-muted-foreground mt-1">
            $KOACHED is a utility token, NOT an investment or security.
          </p>
        </div>
      </div>
    </div>
  );
}
