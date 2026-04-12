import { createFileRoute } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { useState, useEffect } from "react";
import { CreditCard, TrendingUp, Building2, CheckCircle } from "lucide-react";

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
  { name: "Uline", type: "Net-30", reportTo: "D&B", minOrder: "$50" },
  { name: "Grainger", type: "Net-30", reportTo: "D&B, Experian", minOrder: "$0" },
  { name: "Quill", type: "Net-30", reportTo: "D&B", minOrder: "$50" },
  { name: "Crown Office", type: "Net-30", reportTo: "D&B", minOrder: "$0" },
  { name: "Strategic Network Solutions", type: "Net-30", reportTo: "D&B, Experian, Equifax", minOrder: "$49" },
  { name: "The CEO Creative", type: "Net-30", reportTo: "D&B, Experian", minOrder: "$0" },
];

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
        <div className="mb-8">
          <h1 className="font-heading text-2xl font-bold flex items-center gap-2">
            <CreditCard className="w-6 h-6 text-primary" />
            Credit Empire
          </h1>
          <p className="text-sm text-muted-foreground">Build personal & business credit</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Your Accounts */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-6 rounded-xl border border-border bg-card"
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
                  <div key={acc.id} className="flex items-center justify-between p-3 rounded-lg bg-muted/50 border border-border">
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

          {/* Recommended Net-30 Vendors */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="p-6 rounded-xl border border-border bg-card"
          >
            <h2 className="font-heading text-lg font-semibold mb-4 flex items-center gap-2">
              <Building2 className="w-5 h-5 text-primary" />
              Net-30 Vendor Accounts
            </h2>
            <p className="text-xs text-muted-foreground mb-4">
              Open these accounts to start building business credit. Pay on time = Paydex score grows.
            </p>
            <div className="space-y-2">
              {vendorAccounts.map((vendor) => (
                <div key={vendor.name} className="flex items-center justify-between p-3 rounded-lg border border-border hover:border-primary/30 transition-colors">
                  <div>
                    <p className="text-sm font-medium">{vendor.name}</p>
                    <p className="text-[10px] text-muted-foreground">
                      {vendor.type} • Reports to: {vendor.reportTo}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-muted-foreground">Min: {vendor.minOrder}</p>
                    <CheckCircle className="w-4 h-4 text-success ml-auto mt-1" />
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* CROA Disclosure */}
        <div className="mt-8 p-4 rounded-xl border border-primary/20 bg-primary/5">
          <p className="text-[11px] text-muted-foreground leading-relaxed">
            <strong className="text-foreground">CROA Disclosure:</strong> AI KOACHED provides document preparation assistance only. We do NOT guarantee any specific credit score improvement or removal of any specific item from your credit report. Billing for credit services occurs ONLY after each service round is completed and verified — never in advance. You may cancel at any time with no penalty. You have 3 business days after signing to cancel for a full refund. Per 15 U.S.C. §1679 et seq. (Credit Repair Organizations Act).
          </p>
        </div>
      </div>
    </div>
  );
}
