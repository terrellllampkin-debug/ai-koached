import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Logo } from "@/components/Logo";
import { supabase } from "@/integrations/supabase/client";
import { LogOut, Coins, Building2, Trophy, Bell, Map, Home } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { User } from "@supabase/supabase-js";

interface HUDProps {
  user: User | null;
  onLogout: () => void;
  view: "office" | "city";
  onViewChange: (view: "office" | "city") => void;
}

export function HUD({ user, onLogout, view, onViewChange }: HUDProps) {
  const [koachBalance, setKoachBalance] = useState(0);
  const [displayName, setDisplayName] = useState("");
  const [officeName, setOfficeName] = useState("Starter Desk");

  useEffect(() => {
    if (!user) return;

    async function loadProfile() {
      const { data: profile } = await supabase
        .from("profiles")
        .select("display_name, office")
        .eq("user_id", user!.id)
        .single();

      if (profile) {
        setDisplayName(profile.display_name || "CEO");
        const officeLabels: Record<string, string> = {
          starter_desk: "Starter Desk",
          corner_office: "Corner Office",
          penthouse: "Penthouse",
          skyscraper: "Skyscraper",
          empire_tower: "Empire Tower",
        };
        setOfficeName(officeLabels[profile.office] || "Starter Desk");
      }

      const { data: balance } = await supabase
        .from("koach_balances")
        .select("balance")
        .eq("user_id", user!.id)
        .single();

      if (balance) setKoachBalance(balance.balance);
    }

    loadProfile();
  }, [user]);

  return (
    <>
      {/* Top bar */}
      <motion.div
        initial={{ y: -60, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.3, duration: 0.5 }}
        className="absolute top-0 left-0 right-0 z-20 pointer-events-none"
      >
        <div className="flex items-center justify-between px-4 py-3 pointer-events-auto">
          {/* Left — Logo + office */}
          <div className="flex items-center gap-3 bg-background/60 backdrop-blur-xl rounded-xl px-4 py-2 border border-border">
            <Logo size={28} />
            <div>
              <p className="text-xs font-heading font-semibold text-primary tracking-wider">AI KOACHED</p>
              <p className="text-[10px] text-muted-foreground">{officeName}</p>
            </div>
          </div>

          {/* Center — Stats + View Toggle */}
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-2 bg-background/60 backdrop-blur-xl rounded-xl px-4 py-2 border border-border">
              <Coins className="w-4 h-4 text-primary" />
              <span className="font-mono text-sm font-bold text-primary">{koachBalance.toLocaleString()}</span>
              <span className="text-[10px] text-muted-foreground">$KOACHED</span>
            </div>
            <Button
              variant="ghost"
              size="sm"
              className="bg-background/60 backdrop-blur-xl border border-border hover:border-primary/40 gap-1.5 text-xs"
              onClick={() => onViewChange(view === "office" ? "city" : "office")}
            >
              {view === "office" ? (
                <>
                  <Map className="w-3.5 h-3.5 text-primary" />
                  City
                </>
              ) : (
                <>
                  <Home className="w-3.5 h-3.5 text-primary" />
                  Office
                </>
              )}
            </Button>
          </div>

          {/* Right — User + actions */}
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              className="bg-background/60 backdrop-blur-xl border border-border hover:border-primary/40 h-9 w-9"
            >
              <Bell className="w-4 h-4 text-muted-foreground" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="bg-background/60 backdrop-blur-xl border border-border hover:border-primary/40 h-9 w-9"
            >
              <Trophy className="w-4 h-4 text-muted-foreground" />
            </Button>
            <div className="flex items-center gap-2 bg-background/60 backdrop-blur-xl rounded-xl px-3 py-2 border border-border">
              <div className="w-7 h-7 rounded-full bg-primary/20 flex items-center justify-center text-xs font-bold text-primary">
                {displayName[0]?.toUpperCase() || "C"}
              </div>
              <span className="text-xs font-medium text-foreground hidden sm:inline">{displayName}</span>
              <Button
                variant="ghost"
                size="icon"
                className="h-6 w-6 hover:text-destructive"
                onClick={onLogout}
              >
                <LogOut className="w-3.5 h-3.5" />
              </Button>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Bottom hint */}
      <motion.div
        initial={{ y: 40, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 1, duration: 0.5 }}
        className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20"
      >
        <div className="flex items-center gap-2 bg-background/60 backdrop-blur-xl rounded-full px-4 py-2 border border-border text-xs text-muted-foreground">
          <Building2 className="w-3.5 h-3.5 text-primary" />
          {view === "office"
            ? "Click a desk to talk to your AI workers • Click City to explore"
            : "Click a building to enter • Click Office to return"}
        </div>
      </motion.div>
    </>
  );
}
