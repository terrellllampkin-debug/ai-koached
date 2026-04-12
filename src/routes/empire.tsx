import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useAuth } from "@/hooks/useAuth";
import { Office3D } from "@/components/3d/Office3D";
import { City3D } from "@/components/3d/City3D";
import { HUD } from "@/components/3d/HUD";
import { AIChatPanel } from "@/components/AIChatPanel";
import { useState, useEffect } from "react";

export const Route = createFileRoute("/empire")({
  head: () => ({
    meta: [
      { title: "Your Empire — AI KOACHED" },
      { name: "description", content: "Your 3D business empire headquarters." },
    ],
  }),
  component: EmpirePage,
});

type View = "office" | "city";

function EmpirePage() {
  const { user, isAuthenticated, isLoading, logout } = useAuth();
  const navigate = useNavigate();
  const [activeAgent, setActiveAgent] = useState<string | null>(null);
  const [view, setView] = useState<View>("office");

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="mt-4 text-muted-foreground font-mono text-sm">Loading your empire...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    navigate({ to: "/login" });
    return null;
  }

  const handleBuildingClick = (building: string) => {
    const routes: Record<string, string> = {
      credit: "/empire/credit",
      entity: "/empire/entity",
      revenue: "/empire/revenue",
      koach: "/empire/koach",
      grants: "/empire/grants",
      sp500: "/empire/markets",
      crypto: "/empire/markets",
    };
    const route = routes[building];
    if (route) navigate({ to: route });
  };

  return (
    <div className="relative w-full h-screen overflow-hidden bg-background">
      {/* 3D View */}
      {view === "office" ? (
        <Office3D onDeskClick={(agent) => setActiveAgent(agent)} />
      ) : (
        <City3D
          onBuildingClick={handleBuildingClick}
          onBackToOffice={() => setView("office")}
        />
      )}

      {/* HUD Overlay */}
      <HUD
        user={user}
        onLogout={logout}
        view={view}
        onViewChange={setView}
      />

      {/* AI Chat Panel */}
      {activeAgent && (
        <AIChatPanel
          agent={activeAgent}
          onClose={() => setActiveAgent(null)}
        />
      )}
    </div>
  );
}
