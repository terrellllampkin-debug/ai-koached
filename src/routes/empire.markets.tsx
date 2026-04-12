import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { useAuth } from "@/hooks/useAuth";
import { ArrowLeft, BarChart3, TrendingUp, TrendingDown, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/empire/markets")({
  head: () => ({
    meta: [
      { title: "Market District — AI KOACHED" },
      { name: "description", content: "Live market data for stocks and crypto." },
    ],
  }),
  component: MarketsPage,
});

const mockStocks = [
  { symbol: "SPY", name: "S&P 500 ETF", price: 612.34, change: 1.2 },
  { symbol: "QQQ", name: "NASDAQ ETF", price: 518.91, change: 1.8 },
  { symbol: "AAPL", name: "Apple Inc.", price: 248.50, change: 0.5 },
  { symbol: "MSFT", name: "Microsoft", price: 492.10, change: -0.3 },
  { symbol: "NVDA", name: "NVIDIA", price: 178.80, change: 3.2 },
  { symbol: "TSLA", name: "Tesla", price: 285.40, change: -1.5 },
];

const mockCrypto = [
  { symbol: "BTC", name: "Bitcoin", price: 104250, change: 2.1 },
  { symbol: "ETH", name: "Ethereum", price: 3890, change: 1.5 },
  { symbol: "SOL", name: "Solana", price: 218.50, change: 4.2 },
  { symbol: "BNB", name: "Binance Coin", price: 625.80, change: 0.8 },
];

function MarketsPage() {
  const { isAuthenticated } = useAuth();
  if (!isAuthenticated) return null;

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="font-heading text-2xl font-bold flex items-center gap-2">
            <BarChart3 className="w-6 h-6 text-chart-2" />
            Market District
          </h1>
          <p className="text-sm text-muted-foreground">Live market data • Stocks & Crypto</p>
        </div>

        {/* Disclaimer */}
        <div className="mb-6 p-3 rounded-lg border border-destructive/20 bg-destructive/5 flex items-start gap-2">
          <AlertTriangle className="w-4 h-4 text-destructive mt-0.5 shrink-0" />
          <p className="text-[10px] text-muted-foreground">
            AI KOACHED does not provide financial advice. Market data is for informational purposes only. All investment decisions are self-directed. Past performance does not guarantee future results.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Stocks */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-6 rounded-xl border border-border bg-card"
          >
            <h2 className="font-heading text-lg font-semibold mb-4 flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-blue-400" />
              Stocks
            </h2>
            <div className="space-y-2">
              {mockStocks.map((stock) => (
                <div key={stock.symbol} className="flex items-center justify-between p-3 rounded-lg border border-border hover:border-primary/20 transition-colors">
                  <div>
                    <p className="text-sm font-mono font-bold">{stock.symbol}</p>
                    <p className="text-[10px] text-muted-foreground">{stock.name}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-mono">${stock.price.toLocaleString()}</p>
                    <p className={`text-xs font-mono flex items-center gap-1 justify-end ${stock.change >= 0 ? "text-success" : "text-destructive"}`}>
                      {stock.change >= 0 ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                      {stock.change >= 0 ? "+" : ""}{stock.change}%
                    </p>
                  </div>
                </div>
              ))}
            </div>
            <p className="text-[10px] text-muted-foreground mt-3 text-center">
              📊 Live data via Financial Modeling Prep — coming soon
            </p>
          </motion.div>

          {/* Crypto */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="p-6 rounded-xl border border-border bg-card"
          >
            <h2 className="font-heading text-lg font-semibold mb-4 flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-cyan-400" />
              Crypto
            </h2>
            <div className="space-y-2">
              {mockCrypto.map((coin) => (
                <div key={coin.symbol} className="flex items-center justify-between p-3 rounded-lg border border-border hover:border-primary/20 transition-colors">
                  <div>
                    <p className="text-sm font-mono font-bold">{coin.symbol}</p>
                    <p className="text-[10px] text-muted-foreground">{coin.name}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-mono">${coin.price.toLocaleString()}</p>
                    <p className={`text-xs font-mono flex items-center gap-1 justify-end ${coin.change >= 0 ? "text-success" : "text-destructive"}`}>
                      {coin.change >= 0 ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                      {coin.change >= 0 ? "+" : ""}{coin.change}%
                    </p>
                  </div>
                </div>
              ))}
            </div>
            <p className="text-[10px] text-muted-foreground mt-3 text-center">
              🪙 Live data via CoinGecko — coming soon
            </p>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
