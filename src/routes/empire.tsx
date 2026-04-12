import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useAuth } from "@/hooks/useAuth";
import { Office3D } from "@/components/3d/Office3D";
import { HUD } from "@/components/3d/HUD";
import { AIChatPanel } from "@/components/AIChatPanel";
import { useState } from "react";

export const Route = createFileRoute("/empire")({
  head: () => ({
    meta: [
      { title: "Your Empire — AI KOACHED" },
      { name: "description", content: "Your 3D business empire headquarters." },
    ],
  }),
  component: EmpirePage,
});

function EmpirePage() {
  const { user, isAuthenticated, isLoading, logout } = useAuth();
  const navigate = useNavigate();
  const [activeAgent, setActiveAgent] = useState<string | null>(null);

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

  return (
    <div className="relative w-full h-screen overflow-hidden bg-background">
      {/* 3D Office Canvas */}
      <Office3D onDeskClick={(agent) => setActiveAgent(agent)} />

      {/* HUD Overlay */}
      <HUD user={user} onLogout={logout} />

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
