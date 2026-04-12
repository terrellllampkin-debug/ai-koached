import { Link, useLocation } from "@tanstack/react-router";
import { Logo } from "@/components/Logo";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { useState, useEffect } from "react";
import {
  Home, CreditCard, Building2, DollarSign, Coins,
  FileText, BarChart3, LogOut, ChevronLeft, ChevronRight,
  User, Crown, Scale, Shirt,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const navItems = [
  { to: "/empire", icon: Home, label: "HQ", exact: true },
  { to: "/empire/credit", icon: CreditCard, label: "Credit Empire" },
  { to: "/empire/entity", icon: Building2, label: "Entity Builder" },
  { to: "/empire/revenue", icon: DollarSign, label: "Revenue HQ" },
  { to: "/empire/koach", icon: Coins, label: "$KOACHED Tower" },
  { to: "/empire/grants", icon: FileText, label: "Grant Office" },
  { to: "/empire/markets", icon: BarChart3, label: "Market District" },
  { to: "/empire/avatar", icon: Shirt, label: "Avatar Creator" },
  { to: "/empire/pricing", icon: Crown, label: "Pricing" },
  { to: "/empire/legal", icon: Scale, label: "Legal & FAQ" },
];

export function EmpireNav() {
  const { user, logout } = useAuth();
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(false);
  const [koachBalance, setKoachBalance] = useState(0);
  const [displayName, setDisplayName] = useState("CEO");

  useEffect(() => {
    if (!user) return;
    supabase.from("profiles").select("display_name").eq("user_id", user.id).single()
      .then(({ data }) => { if (data?.display_name) setDisplayName(data.display_name); });
    supabase.from("koach_balances").select("balance").eq("user_id", user.id).single()
      .then(({ data }) => { if (data) setKoachBalance(data.balance); });
  }, [user]);

  return (
    <aside
      className={cn(
        "fixed left-0 top-0 bottom-0 z-40 flex flex-col bg-sidebar border-r border-sidebar-border transition-all duration-300",
        collapsed ? "w-16" : "w-56"
      )}
    >
      {/* Logo */}
      <div className="flex items-center gap-2 px-3 py-4 border-b border-sidebar-border">
        <Logo size={28} />
        {!collapsed && (
          <span className="font-heading text-xs font-bold tracking-wider text-sidebar-primary truncate">
            AI KOACHED
          </span>
        )}
      </div>

      {/* Nav */}
      <nav className="flex-1 py-2 space-y-0.5 px-2 overflow-y-auto">
        {navItems.map((item) => {
          const isActive = item.exact
            ? location.pathname === item.to
            : location.pathname.startsWith(item.to);
          return (
            <Link
              key={item.to}
              to={item.to}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-colors",
                isActive
                  ? "bg-sidebar-accent text-sidebar-accent-foreground font-medium"
                  : "text-sidebar-foreground/70 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground"
              )}
              title={collapsed ? item.label : undefined}
            >
              <item.icon className={cn("w-4 h-4 shrink-0", isActive && "text-sidebar-primary")} />
              {!collapsed && <span className="truncate">{item.label}</span>}
            </Link>
          );
        })}
      </nav>

      {/* Balance */}
      {!collapsed && (
        <div className="mx-2 mb-2 p-3 rounded-lg bg-sidebar-accent/30 border border-sidebar-border">
          <div className="flex items-center gap-2">
            <Coins className="w-4 h-4 text-sidebar-primary" />
            <span className="font-mono text-sm font-bold text-sidebar-primary">
              {koachBalance.toLocaleString()}
            </span>
          </div>
          <p className="text-[10px] text-sidebar-foreground/50 mt-0.5">$KOACHED Balance</p>
        </div>
      )}

      {/* User */}
      <div className="border-t border-sidebar-border px-2 py-3">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-sidebar-primary/20 flex items-center justify-center shrink-0">
            <User className="w-4 h-4 text-sidebar-primary" />
          </div>
          {!collapsed && (
            <div className="flex-1 min-w-0">
              <p className="text-xs font-medium text-sidebar-foreground truncate">{displayName}</p>
              <p className="text-[10px] text-sidebar-foreground/50">Free Tier</p>
            </div>
          )}
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7 shrink-0 text-sidebar-foreground/50 hover:text-destructive"
            onClick={logout}
            title="Log out"
          >
            <LogOut className="w-3.5 h-3.5" />
          </Button>
        </div>
      </div>

      {/* Collapse toggle */}
      <button
        onClick={() => setCollapsed(!collapsed)}
        className="absolute -right-3 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-sidebar-primary text-sidebar-primary-foreground flex items-center justify-center shadow-md hover:scale-110 transition-transform"
      >
        {collapsed ? <ChevronRight className="w-3 h-3" /> : <ChevronLeft className="w-3 h-3" />}
      </button>
    </aside>
  );
}
