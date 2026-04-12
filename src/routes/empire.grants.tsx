import { createFileRoute } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { useAuth } from "@/hooks/useAuth";
import { FileText, Search, CheckCircle, Clock, DollarSign } from "lucide-react";
import { Input } from "@/components/ui/input";

export const Route = createFileRoute("/empire/grants")({
  head: () => ({
    meta: [
      { title: "Grant Office — AI KOACHED" },
      { name: "description", content: "Discover and apply for business grants with AI." },
    ],
  }),
  component: GrantsPage,
});

const sampleGrants = [
  { name: "SBA Small Business Innovation Research", amount: "$50K - $1.5M", deadline: "Rolling", category: "Federal", status: "open" },
  { name: "Minority Business Development Grant", amount: "$10K - $100K", deadline: "Mar 2026", category: "Federal", status: "open" },
  { name: "State Small Business Credit Initiative", amount: "$5K - $50K", deadline: "Quarterly", category: "State", status: "open" },
  { name: "Verizon Small Business Digital Ready", amount: "$10K", deadline: "Monthly", category: "Corporate", status: "open" },
  { name: "FedEx Small Business Grant", amount: "$25K - $50K", deadline: "Apr 2026", category: "Corporate", status: "upcoming" },
  { name: "National Science Foundation SBIR", amount: "$275K", deadline: "Jun 2026", category: "Federal", status: "upcoming" },
];

function GrantsPage() {
  const { isAuthenticated } = useAuth();
  if (!isAuthenticated) return null;

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="font-heading text-2xl font-bold flex items-center gap-2">
            <FileText className="w-6 h-6 text-destructive" />
            Grant Office
          </h1>
          <p className="text-sm text-muted-foreground">Discover grants & let AI write applications</p>
        </div>

        {/* Search */}
        <div className="relative mb-6">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input placeholder="Search grants by name, category, or amount..." className="pl-10 bg-card border-border" />
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          {[
            { label: "Available Grants", value: "4", icon: CheckCircle, color: "text-success" },
            { label: "Upcoming", value: "2", icon: Clock, color: "text-primary" },
            { label: "Total Value", value: "$2M+", icon: DollarSign, color: "text-primary" },
          ].map((stat) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-4 rounded-xl border border-border bg-card text-center"
            >
              <stat.icon className={`w-5 h-5 mx-auto mb-1 ${stat.color}`} />
              <p className="font-mono text-xl font-bold">{stat.value}</p>
              <p className="text-[10px] text-muted-foreground">{stat.label}</p>
            </motion.div>
          ))}
        </div>

        {/* Grant List */}
        <div className="space-y-3">
          {sampleGrants.map((grant, i) => (
            <motion.div
              key={grant.name}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="flex items-center justify-between p-4 rounded-xl border border-border bg-card hover:border-primary/30 transition-colors"
            >
              <div className="flex-1">
                <p className="text-sm font-medium">{grant.name}</p>
                <p className="text-xs text-muted-foreground mt-1">
                  {grant.category} • Deadline: {grant.deadline}
                </p>
              </div>
              <div className="text-right ml-4">
                <p className="font-mono text-sm font-bold text-primary">{grant.amount}</p>
                <span className={`text-[10px] px-2 py-0.5 rounded-full ${
                  grant.status === "open" ? "bg-success/10 text-success" : "bg-muted text-muted-foreground"
                }`}>
                  {grant.status}
                </span>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="mt-6 text-center">
          <p className="text-xs text-muted-foreground">
            💡 AI-powered grant writing coming soon — the AI will draft full applications for you
          </p>
        </div>
      </div>
    </div>
  );
}
