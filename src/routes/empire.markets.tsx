import { createFileRoute } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { useAuth } from "@/hooks/useAuth";
import { BarChart3, TrendingUp, TrendingDown, AlertTriangle, Coins } from "lucide-react";

export const Route = createFileRoute("/empire/markets")({
  head: () => ({
    meta: [
      { title: "Market District — AI KOACHED" },
      { name: "description", content: "Live market data for stocks, crypto, and forex." },
    ],
  }),
  component: MarketsPage,
});

const mockIndexes = [
  { symbol: "SPY", name: "S&P 500 ETF", price: 612.34, change: 1.2 },
  { symbol: "QQQ", name: "NASDAQ ETF", price: 518.91, change: 1.8 },
  { symbol: "DIA", name: "Dow Jones ETF", price: 428.50, change: 0.4 },
  { symbol: "IWM", name: "Russell 2000", price: 224.10, change: -0.6 },
];

const mockCrypto = [
  { symbol: "BTC", name: "Bitcoin", price: 104250, change: 2.1 },
  { symbol: "ETH", name: "Ethereum", price: 3890, change: 1.5 },
  { symbol: "SOL", name: "Solana", price: 218.50, change: 4.2 },
  { symbol: "BNB", name: "BNB", price: 625.80, change: 0.8 },
  { symbol: "$KOACH", name: "$KOACHED Token", price: null, change: null, special: true },
];

const mockForex = [
  { symbol: "EUR/USD", name: "Euro / US Dollar", price: 1.0842, change: 0.15 },
  { symbol: "GBP/USD", name: "Pound / US Dollar", price: 1.2715, change: -0.22 },
  { symbol: "USD/JPY", name: "US Dollar / Yen", price: 154.32, change: 0.48 },
  { symbol: "USD/CAD", name: "US Dollar / Canadian", price: 1.3621, change: -0.11 },
];

function TickerRow({ symbol, name, price, change, special }: { symbol: string; name: string; price: number | null; change: number | null; special?: boolean }) {
  if (special) {
    return (
      <div className="flex items-center justify-between p-3 rounded-lg pulse-gold" style={{ background: "oklch(0.78 0.13 85 / 8%)", border: "1px solid oklch(0.78 0.13 85 / 30%)" }}>
        <div className="flex items-center gap-2">
          <Coins className="w-4 h-4 text-primary" />
          <div>
            <p className="text-sm font-mono font-bold text-primary">{symbol}</p>
            <p className="text-[10px] text-muted-foreground">{name}</p>
          </div>
        </div>
        <div className="text-right">
          <span className="text-[10px] font-mono font-bold text-primary px-2 py-1 rounded-full bg-primary/10 border border-primary/20">
            Pre-Launch Aug 2026
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-between p-3 rounded-lg border border-border/50 hover:border-primary/20 transition-colors">
      <div>
        <p className="text-sm font-mono font-bold">{symbol}</p>
        <p className="text-[10px] text-muted-foreground">{name}</p>
      </div>
      <div className="text-right">
        <p className="text-sm font-mono">${price?.toLocaleString()}</p>
        <p className={`text-xs font-mono flex items-center gap-1 justify-end ${(change ?? 0) >= 0 ? "text-success" : "text-destructive"}`}>
          {(change ?? 0) >= 0 ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
          {(change ?? 0) >= 0 ? "+" : ""}{change}%
        </p>
      </div>
    </div>
  );
}

function MarketsPage() {
  const { isAuthenticated } = useAuth();
  if (!isAuthenticated) return null;

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-6">
          <h1 className="font-heading text-2xl font-bold flex items-center gap-2">
            <BarChart3 className="w-6 h-6 text-secondary" />
            Market District
          </h1>
          <p className="text-sm text-muted-foreground">Live market data • Indexes • Crypto • Forex</p>
        </div>

        {/* Red Disclaimer */}
        <div className="mb-6 p-3 rounded-xl border flex items-start gap-2" style={{ borderColor: "oklch(0.58 0.22 25 / 30%)", background: "oklch(0.58 0.22 25 / 5%)" }}>
          <AlertTriangle className="w-4 h-4 text-destructive mt-0.5 shrink-0" />
          <p className="text-[10px] text-muted-foreground">
            <strong className="text-destructive">FINANCIAL DISCLAIMER:</strong> AI KOACHED does not provide financial advice. Market data is for informational purposes only. All investment decisions are self-directed. Past performance does not guarantee future results. $KOACHED is a utility token, not a security.
          </p>
        </div>

        {/* 3-Column Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Indexes */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass-card p-5">
            <h2 className="font-heading text-base font-semibold mb-4 flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-primary" />
              Indexes
            </h2>
            <div className="space-y-2">
              {mockIndexes.map((t) => (
                <TickerRow key={t.symbol} {...t} />
              ))}
            </div>
          </motion.div>

          {/* Crypto */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }} className="glass-card p-5">
            <h2 className="font-heading text-base font-semibold mb-4 flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-secondary" />
              Crypto
            </h2>
            <div className="space-y-2">
              {mockCrypto.map((t) => (
                <TickerRow key={t.symbol} {...t} />
              ))}
            </div>
          </motion.div>

          {/* Forex */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="glass-card p-5">
            <h2 className="font-heading text-base font-semibold mb-4 flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-success" />
              Forex
            </h2>
            <div className="space-y-2">
              {mockForex.map((t) => (
                <TickerRow key={t.symbol} {...t} />
              ))}
            </div>
          </motion.div>
        </div>

        <p className="text-[10px] text-muted-foreground mt-6 text-center font-mono">
          📊 Live data integration coming soon — Financial Modeling Prep & CoinGecko
        </p>
      </div>
    </div>
  );
}
