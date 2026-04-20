import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useRef, useState, useCallback } from "react";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/empire/world")({
  head: () => ({
    meta: [
      { title: "KoachVerse — Empire World" },
      { name: "description", content: "Walk through your AI empire in real-time 3D." },
    ],
  }),
  component: KoachVerse,
});

const AGENTS = [
  { id: "aria", name: "ARIA", role: "CEO Coach", color: "#D4AF37", tasks: ["Building empire strategy", "Setting Q2 targets", "Reviewing performance", "Planning expansion"] },
  { id: "nova", name: "NOVA", role: "Credit Repair", color: "#FF6B00", tasks: ["Disputing Equifax errors", "Filing CFPB complaint", "Credit analysis", "Sending dispute letters"] },
  { id: "lex", name: "LEX", role: "Legal Counsel", color: "#4488FF", tasks: ["Reviewing contracts", "Filing corporate docs", "CROA compliance", "Trademark research"] },
  { id: "blaze", name: "BLAZE", role: "Marketing", color: "#FF2244", tasks: ["Running TikTok campaign", "Creating viral content", "A/B testing hooks", "Scheduling posts"] },
  { id: "pixel", name: "PIXEL", role: "Web Design", color: "#AA44FF", tasks: ["Building landing page", "Optimizing conversion", "Mobile responsive fixes", "Brand assets"] },
  { id: "closer", name: "CLOSER", role: "Sales", color: "#00CC66", tasks: ["Following up leads", "Sending proposals", "Closing $2K deal", "Qualifying prospects"] },
  { id: "ledger", name: "LEDGER", role: "Finance", color: "#00AAFF", tasks: ["Monthly P&L report", "Tax optimization", "Cash flow analysis", "Invoice management"] },
  { id: "ranker", name: "RANKER", role: "SEO", color: "#FFAA00", tasks: ["Keyword research", "Backlink building", "Content optimization", "Schema markup"] },
  { id: "vibe", name: "VIBE", role: "Social Media", color: "#FF44AA", tasks: ["Instagram Reels posted", "LinkedIn article live", "Twitter engagement up", "Content scheduled"] },
  { id: "mercury", name: "MERCURY", role: "Email Marketing", color: "#44DDFF", tasks: ["Drip sequence sent", "Open rate 42%", "List cleaning done", "A/B subject test"] },
  { id: "pulse", name: "PULSE", role: "HR", color: "#88FF44", tasks: ["Onboarding checklist", "Performance review", "Culture audit", "Policy update"] },
  { id: "oracle", name: "ORACLE", role: "Data Analyst", color: "#FF8844", tasks: ["Revenue dashboard", "Churn analysis", "Funnel optimization", "Cohort report"] },
  { id: "genesis", name: "GENESIS", role: "AI Builder", color: "#44FFDD", tasks: ["Training new model", "Deploying edge function", "Agent calibration", "Tool integration"] },
  { id: "hawk", name: "HAWK", role: "Intel Officer", color: "#FFDD00", tasks: ["Market intelligence", "Competitor analysis", "Trend detection", "Opportunity mapping"] },
  { id: "forge", name: "FORGE", role: "Construction", color: "#FF6644", tasks: ["Permit application", "Contractor bid review", "Property valuation", "Flip timeline update"] },
];

const BUILDINGS = [
  { id: "hq", name: "EMPIRE HQ", type: "HEADQUARTERS", desc: "Command center for all 15 AI agents. Set strategy, monitor operations, deploy campaigns.", color: "#D4AF37", agents: ["aria"], link: "/empire/office" },
  { id: "bank", name: "KOACH BANK", type: "FINANCIAL INSTITUTION", desc: "Open real business accounts. Build credit history. Access business loans.", color: "#00AAFF", agents: ["ledger", "nova"], link: "#bank" },
  { id: "credit", name: "CREDIT CLINIC", type: "CREDIT REPAIR", desc: "Free AI credit analysis. Dispute letters. Score optimization strategy.", color: "#FF6B00", agents: ["nova"], link: "#credit" },
  { id: "studio", name: "BLAZE STUDIO"mit application", "Contractor bid review", "Property valuation", "Flip timeline update"] },
];

// ─── BUILDINGS ───
const BUILDINGS_BASE = BUILDINGS;

function KoachVerse() {
  const { user, isAuthenticated, isLoading } = useAuth();
  const navigate = useNavigate();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animFrameRef = useRef<number>(0);
  const keysRef = useRef<Record<string, boolean>>({});
  const mouseDeltaRef = useRef(0);
  const lastMouseXRef = useRef(0);
  const [koachBalance, setKoachBalance] = useState(1250);
  const [autoMode, setAutoMode] = useState(false);
  const [nearBuilding, setNearBuilding] = useState<typeof BUILDINGS[0] | null>(null);
  const [nearAgent, setNearAgent] = useState<typeof AGENTS[0] | null>(null);
  const [modalBuilding, setModalBuilding] = useState<typeof BUILDINGS[0] | null>(null);
  const [activityFeed, setActivityFeed] = useState<Array<{ agent: typeof AGENTS[0]; task: string; time: string }>>([]);
  const [gameReady, setGameReady] = useState(false);
  const [loadPercent, setLoadPercent] = useState(0);
  const [loadMsg, setLoadMsg] = useState("INITIALIZING EMPIRE...");
  const worldRef = useRef({
    player: { x: 600, y: 600, angle: 0 },
    walkers: AGENTS.map((agent) => ({
      agent,
      x: 300 + Math.random() * 700,
      y: 300 + Math.random() * 700,
      tx: 300 + Math.random() * 700,
      ty: 300 + Math.random() * 700,
      speed: 0.5 + Math.random() * 0.4,
      taskTimer: Math.floor(Math.random() * 200),
    })),
    autoTarget: null as typeof BUILDINGS[0] | null,
    buildings: BUILDINGS.map((b, i) => ({
      ...b,
      wx: [550, 250, 850, 250, 850, 150, 950, 450][i] ?? 400 + i * 120,
      wy: [180, 350, 350, 600, 550, 750, 750, 900][i] ?? 300 + i * 80,
      w: [160, 110, 100, 110, 90, 130, 110, 120][i] ?? 100,
      h: [180, 130, 120, 130, 160, 100, 150, 110][i] ?? 120,
    })),
  });
  const addActivity = useCallback((agent: typeof AGENTS[0], task: string) => {
    const time = new Date().toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" });
    setActivityFeed(prev => [{ agent, task, time }, ...prev].slice(0, 12));
    setKoachBalance(prev => prev + Math.floor(Math.random() * 50) + 10);
  }, []);
  useEffect(() => {
    const steps = ["INITIALIZING EMPIRE...", "LOADING 15 AI AGENTS...", "BUILDING CITY GRID...", "CONNECTING STRIPE GATEWAY...", "DEPLOYING NEURAL NETS...", "CALIBRATING PHYSICS...", "EMPIRE READY — WELCOME, CEO"];
    steps.forEach((msg, i) => {
      setTimeout(() => {
        setLoadMsg(msg);
        setLoadPercent(Math.round(((i + 1) / steps.length) * 100));
        if (i === steps.length - 1) setTimeout(() => setGameReady(true), 400);
      }, i * 350 + Math.random() * 150);
    });
    setTimeout(() => {
      AGENTS.slice(0, 4).forEach((a, i) =>
        setTimeout(() => addActivity(a, a.tasks[Math.floor(Math.random() * a.tasks.length)]), i * 700)
      );
    }, 2000);
  }, [addActivity]);
  useEffect(() => {
    if (!gameReady || !canvasRef.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d")!;
    const W = worldRef.current;
    const resize = () => { canvas.width = window.innerWidth; canvas.height = window.innerHeight; };
    resize();
    window.addEventListener("resize", resize);
    document.addEventListener("keydown", e => {
      keysRef.current[e.key.toLowerCase()] = true;
      if (e.key.toLowerCase() === "e") tryEnter();
      if (e.key.toLowerCase() === "q") setAutoMode(p => !p);
    });
    document.addEventListener("keyup", e => { keysRef.current[e.key.toLowerCase()] = false; });
    document.addEventListener("mousemove", e => {
      mouseDeltaRef.current += (e.clientX - lastMouseXRef.current) * 0.003;
      lastMouseXRef.current = e.clientX;
    });
    function isoProject(wx: number, wy: number) {
      const tx = (wx - W.player.x) * 1.1;
      const ty = (wy - W.player.y) * 1.1;
      const cos = Math.cos(-W.player.angle), sin = Math.sin(-W.player.angle);
      return { x: canvas.width / 2 + tx * cos - ty * sin, y: canvas.height / 2 + tx * sin + ty * cos };
    }
    function drawFrame() {
      const spd = 3;
      if (keysRef.current["w"] || keysRef.current["arrowup"]) { W.player.x += Math.sin(W.player.angle) * spd; W.player.y -= Math.cos(W.player.angle) * spd; }
      if (keysRef.current["s"] || keysRef.current["arrowdown"]) { W.player.x -= Math.sin(W.player.angle) * spd; W.player.y += Math.cos(W.player.angle) * spd; }
      if (keysRef.current["a"] || keysRef.current["arrowleft"]) W.player.angle -= 0.035;
      if (keysRef.current["d"] || keysRef.current["arrowright"]) W.player.angle += 0.035;
      W.player.angle += mouseDeltaRef.current; mouseDeltaRef.current = 0;
      W.player.x = Math.max(50, Math.min(1150, W.player.x));
      W.player.y = Math.max(50, Math.min(1150, W.player.y));
      if (autoMode) {
        if (!W.autoTarget) W.autoTarget = W.buildings[Math.floor(Math.random() * W.buildings.length)];
        const at = W.autoTarget!;
        const dx = at.wx + at.w / 2 - W.player.x, dy = at.wy + at.h / 2 - W.player.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 90) W.autoTarget = null;
        else {
          const ta = Math.atan2(dx, -dy);
          let da = ta - W.player.angle;
          while (da > Math.PI) da -= Math.PI * 2;
          while (da < -Math.PI) da += Math.PI * 2;
          W.player.angle += da * 0.06;
          W.player.x += Math.sin(W.player.angle) * 2.2;
          W.player.y -= Math.cos(W.player.angle) * 2.2;
        }
      }
      W.walkers.forEach(walker => {
        const dx = walker.tx - walker.x, dy = walker.ty - walker.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 15) { walker.tx = 200 + Math.random() * 900; walker.ty = 200 + Math.random() * 900; }
        else { walker.x += (dx / dist) * walker.speed; walker.y += (dy / dist) * walker.speed; }
        walker.taskTimer++;
        if (walker.taskTimer > 280 + Math.random() * 200) {
          walker.taskTimer = 0;
          const task = walker.agent.tasks[Math.floor(Math.random() * walker.agent.tasks.length)];
          if (Math.random() > 0.5) addActivity(walker.agent, task);
        }
      });
      let nearest: typeof W.buildings[0] | null = null; let nearDist = Infinity;
      W.buildings.forEach(b => {
        const cx = b.wx + b.w / 2, cy = b.wy + b.h / 2;
        const d = Math.sqrt((cx - W.player.x) ** 2 + (cy - W.player.y) ** 2);
        if (d < 120 && d < nearDist) { nearest = b; nearDist = d; }
      });
      setNearBuilding(nearest);
      let nearestAgent: (typeof W.walkers[0]) | null = null; let nearAgentDist = Infinity;
      W.walkers.forEach(w => {
        const d = Math.sqrt((w.x - W.player.x) ** 2 + (w.y - W.player.y) ** 2);
        if (d < 80 && d < nearAgentDist) { nearestAgent = w; nearAgentDist = d; }
      });
      setNearAgent(nearestAgent ? nearestAgent.agent : null);
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const sky = ctx.createLinearGradient(0, 0, 0, canvas.height);
      sky.addColorStop(0, "#000608"); sky.addColorStop(1, "#080F0A");
      ctx.fillStyle = sky; ctx.fillRect(0, 0, canvas.width, canvas.height);
      for (let i = 0; i < 180; i++) {
        ctx.fillStyle = `rgba(212,175,55,${0.1 + (i % 5) * 0.06})`;
        ctx.beginPath(); ctx.arc((i * 137.5) % canvas.width, (i * 89.3) % (canvas.height * 0.55), i % 3 === 0 ? 1.2 : 0.6, 0, Math.PI * 2); ctx.fill();
      }
      for (let gx = 0; gx < 1200; gx += 60) {
        for (let gy = 0; gy < 1200; gy += 60) {
          const d = Math.sqrt((gx - W.player.x) ** 2 + (gy - W.player.y) ** 2);
          if (d > 700) continue;
          const alpha = Math.max(0, 1 - d / 700);
          const p1 = isoProject(gx, gy), p2 = isoProject(gx + 60, gy);
          const p3 = isoProject(gx + 60, gy + 60), p4 = isoProject(gx, gy + 60);
          ctx.beginPath(); ctx.moveTo(p1.x, p1.y); ctx.lineTo(p2.x, p2.y); ctx.lineTo(p3.x, p3.y); ctx.lineTo(p4.x, p4.y); ctx.closePath();
          const isRoad = (Math.floor(gx / 60) % 4 === 0) || (Math.floor(gy / 60) % 4 === 0);
          ctx.fillStyle = isRoad ? `rgba(22,20,14,${alpha * 0.95})` : `rgba(12,12,10,${alpha * 0.85})`;
          ctx.fill(); ctx.strokeStyle = `rgba(212,175,55,${alpha * 0.07})`; ctx.lineWidth = 0.5; ctx.stroke();
        }
      }
      const sortedB = [...W.buildings].sort((a, b) => (b.wy + b.h / 2) - (a.wy + a.h / 2));
      sortedB.forEach(b => {
        const d = Math.sqrt((b.wx + b.w / 2 - W.player.x) ** 2 + (b.wy + b.h / 2 - W.player.y) ** 2);
        if (d > 700) return;
        const pos = isoProject(b.wx + b.w / 2, b.wy + b.h / 2);
        const scale = Math.max(0.3, 1 - d / 900), alpha = Math.max(0.15, 1 - d / 700);
        const isNear = nearest?.id === b.id;
        const hp = b.h * scale * 1.3, wp = b.w * scale;
        const hex = b.color.replace("#", "");
        const r = parseInt(hex.slice(0, 2), 16), g = parseInt(hex.slice(2, 4), 16), bv = parseInt(hex.slice(4, 6), 16);
        ctx.fillStyle = `rgba(0,0,0,${alpha * 0.35})`;
        ctx.beginPath(); ctx.ellipse(pos.x, pos.y + hp * 0.08, wp * 0.5, wp * 0.18, 0, 0, Math.PI * 2); ctx.fill();
        const grad = ctx.createLinearGradient(pos.x - wp / 2, pos.y - hp, pos.x + wp / 2, pos.y);
        grad.addColorStop(0, `rgba(${r},${g},${bv},${alpha * 0.75})`);
        grad.addColorStop(0.5, `rgba(${Math.floor(r * 0.65)},${Math.floor(g * 0.65)},${Math.floor(bv * 0.65)},${alpha * 0.85})`);
        grad.addColorStop(1, `rgba(${Math.floor(r * 0.25)},${Math.floor(g * 0.25)},${Math.floor(bv * 0.25)},${alpha * 0.95})`);
        ctx.fillStyle = grad; ctx.fillRect(pos.x - wp / 2, pos.y - hp, wp, hp);
        const rows = Math.max(2, Math.floor(b.h / 28)), cols = Math.max(2, Math.floor(b.w / 22));
        for (let row = 0; row < rows; row++) {
          for (let col = 0; col < cols; col++) {
            if (Math.sin(row * 7 + col * 13 + b.id.charCodeAt(0)) > 0.1) {
              ctx.fillStyle = `rgba(${r},${Math.min(255, g + 60)},${Math.min(255, bv + 60)},${alpha * 0.85})`;
              ctx.fillRect(pos.x - wp / 2 + (col + 0.5) * (wp / cols) - 3 * scale, pos.y - hp + (row + 0.5) * (hp / (rows + 1)) + 8 * scale - 4 * scale, 6 * scale, 7 * scale);
            }
          }
        }
        if (isNear) { ctx.shadowBlur = 25; ctx.shadowColor = b.color; }
        ctx.fillStyle = `rgba(${r},${g},${bv},${alpha * (isNear ? 0.95 : 0.55)})`;
        ctx.fillRect(pos.x - wp / 2, pos.y - hp, wp, 3 * scale); ctx.shadowBlur = 0;
        ctx.strokeStyle = isNear ? `rgba(${r},${g},${bv},0.95)` : `rgba(${r},${g},${bv},${alpha * 0.45})`;
        ctx.lineWidth = isNear ? 2 : 0.8; ctx.strokeRect(pos.x - wp / 2, pos.y - hp, wp, hp);
        if (d < 320) {
          ctx.fillStyle = `rgba(${r},${g},${bv},${alpha})`;
          ctx.font = `bold ${Math.max(9, 13 * scale)}px monospace`;
          ctx.textAlign = "center"; ctx.fillText(b.name, pos.x, pos.y - hp - 9 * scale);
        }
        if (isNear) {
          ctx.fillStyle = "rgba(0,255,136,0.95)";
          ctx.font = `${Math.max(8, 10 * scale)}px monospace`;
          ctx.textAlign = "center"; ctx.fillText("▼ PRESS E TO ENTER", pos.x, pos.y - hp - 26 * scale);
        }
      });
      W.walkers.forEach(walker => {
        const d = Math.sqrt((walker.x - W.player.x) ** 2 + (walker.y - W.player.y) ** 2);
        if (d > 450) return;
        const pos = isoProject(walker.x, walker.y);
        const scale = Math.max(0.35, 1 - d / 550), alpha = Math.max(0.2, 1 - d / 450);
        const hex = walker.agent.color.replace("#", "");
        const r = parseInt(hex.slice(0, 2), 16), g = parseInt(hex.slice(2, 4), 16), bv = parseInt(hex.slice(4, 6), 16);
        ctx.fillStyle = `rgba(0,0,0,${alpha * 0.4})`;
        ctx.beginPath(); ctx.ellipse(pos.x, pos.y + 3 * scale, 8 * scale, 3 * scale, 0, 0, Math.PI * 2); ctx.fill();
        ctx.shadowBlur = 14 * scale; ctx.shadowColor = walker.agent.color;
        ctx.fillStyle = `rgba(${r},${g},${bv},${alpha * 0.92})`;
        ctx.beginPath(); ctx.arc(pos.x, pos.y - 18 * scale, 8 * scale, 0, Math.PI * 2); ctx.fill();
        ctx.fillRect(pos.x - 5 * scale, pos.y - 13 * scale, 10 * scale, 14 * scale); ctx.shadowBlur = 0;
        const legSwing = Math.sin(Date.now() * 0.008 + walker.x) * 4 * scale;
        ctx.strokeStyle = `rgba(${r},${g},${bv},${alpha * 0.7})`; ctx.lineWidth = 2 * scale;
        ctx.beginPath(); ctx.moveTo(pos.x - 3 * scale, pos.y + 1 * scale); ctx.lineTo(pos.x - 3 * scale + legSwing, pos.y + 10 * scale); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(pos.x + 3 * scale, pos.y + 1 * scale); ctx.lineTo(pos.x + 3 * scale - legSwing, pos.y + 10 * scale); ctx.stroke();
        if (d < 150) { ctx.fillStyle = `rgba(${r},${g},${bv},${alpha})`; ctx.font = `${Math.max(7, 9 * scale)}px monospace`; ctx.textAlign = "center"; ctx.fillText(walker.agent.name, pos.x, pos.y - 30 * scale); }
        if (d < 80) { ctx.fillStyle = `rgba(255,255,255,${alpha * 0.7})`; ctx.font = `${Math.max(6, 8 * scale)}px monospace`; ctx.fillText(walker.agent.role.toUpperCase(), pos.x, pos.y - 40 * scale); }
      });
      ctx.save(); ctx.translate(canvas.width / 2, canvas.height / 2);
      ctx.shadowBlur = 22; ctx.shadowColor = "#D4AF37"; ctx.fillStyle = "#D4AF37";
      ctx.beginPath(); ctx.arc(0, -18, 10, 0, Math.PI * 2); ctx.fill();
      ctx.fillRect(-7, -12, 14, 14); ctx.shadowBlur = 0;
      ctx.font = "16px serif"; ctx.textAlign = "center"; ctx.fillText("👑", 0, -28); ctx.restore();
      animFrameRef.current = requestAnimationFrame(drawFrame);
    }
    animFrameRef.current = requestAnimationFrame(drawFrame);
    return () => { cancelAnimationFrame(animFrameRef.current); window.removeEventListener("resize", resize); };
  }, [gameReady, autoMode, addActivity]);
  function tryEnter() {
    const W = worldRef.current;
    let nearest: typeof W.buildings[0] | null = null; let nearDist = Infinity;
    W.buildings.forEach(b => {
      const cx = b.wx + b.w / 2, cy = b.wy + b.h / 2;
      const d = Math.sqrt((cx - W.player.x) ** 2 + (cy - W.player.y) ** 2);
      if (d < 120 && d < nearDist) { nearest = b; nearDist = d; }
    });
    if (nearest) setModalBuilding(nearest);
  }
  if (isLoading) return null;
  if (!isAuthenticated) { navigate({ to: "/login" }); return null; }
  return (
    <div style={{ position: "fixed", inset: 0, background: "#000", overflow: "hidden", fontFamily: "'Rajdhani', sans-serif", color: "#F0EDE0" }}>
      {!gameReady && (
        <div style={{ position: "fixed", inset: 0, background: "#0A0A0A", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", zIndex: 1000 }}>
          <div style={{ fontFamily: "monospace", fontSize: 56, color: "#D4AF37", letterSpacing: 8, textShadow: "0 0 40px rgba(212,175,55,0.7)", marginBottom: 8 }}>KOACHVERSE</div>
          <div style={{ fontFamily: "monospace", fontSize: 11, color: "#8B6914", letterSpacing: 8 }}>EMPIRE WORLD · AI KOACHED</div>
          <div style={{ width: 280, height: 2, background: "rgba(212,175,55,0.1)", marginTop: 48, borderRadius: 1, overflow: "hidden" }}>
            <div style={{ width: `${load) * 700,
      y: 300 + Math.random() * 700,
      tx: 300 + Math.random() * 700,
      ty: 300 + Math.random() * 700,
      speed: 0.5 + Math.random() * 0.4,
      taskTimer: Math.floor(Math.random() * 200),
    })),
    autoTarget: null as typeof BUILDINGS[0] | null,
    buildings: BUILDINGS.map((b, i) => ({
      ...b,
      wx: [550, 250, 850, 250, 850, 150, 950, 450][i] ?? 400 + i * 120,
      wy: [180, 350, 350, 600, 550, 750, 750, 900][i] ?? 300 + i * 80,
      w: [160, 110, 100, 110, 90, 130, 110, 120][i] ?? 100,
      h: [180, 130, 120, 130, 160, 100, 150, 110][i] ?? 120,
    })),
  });

  const addActivity = useCallback((agent: typeof AGENTS[0], task: string) => {
    const time = new Date().toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" });
    setActivityFeed(prev => [{ agent, task, time }, ...prev].slice(0, 12));
    setKoachBalance(prev => prev + Math.floor(Math.random() * 50) + 10);
  }, []);

  useEffect(() => {
    const steps = [
      "INITIALIZING EMPIRE...", "LOADING 15 AI AGENTS...", "BUILDING CITY GRID...",
      "CONNECTING STRIPE GATEWAY...", "DEPLOYING NEURAL NETS...", "CALIBRATING PHYSICS...",
      "EMPIRE READY — WELCOME, CEO"
    ];
    steps.forEach((msg, i) => {
      setTimeout(() => {
        setLoadMsg(msg);
        setLoadPercent(Math.round(((i + 1) / steps.length) * 100));
        if (i === steps.length - 1) setTimeout(() => setGameReady(true), 400);
      }, i * 350 + Math.random() * 150);
    });
    setTimeout(() => {
      AGENTS.slice(0, 4).forEach((a, i) =>
        setTimeout(() => addActivity(a, a.tasks[Math.floor(Math.random() * a.tasks.length)]), i * 700)
      );
    }, 2000);
  }, [addActivity]);

  useEffect(() => {
    if (!gameReady || !canvasRef.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d")!;
    const W = worldRef.current;

    const resize = () => { canvas.width = window.innerWidth; canvas.height = window.innerHeight; };
    resize();
    window.addEventListener("resize", resize);

    const onKey = (e: KeyboardEvent, down: boolean) => { keysRef.current[e.key.toLowerCase()] = down; };
    document.addEventListener("keydown", e => { onKey(e, true); if (e.key.toLowerCase() === "e") tryEnter(); if (e.key.toLowerCase() === "q") setAutoMode(p => !p); });
    document.addEventListener("keyup", e => onKey(e, false));
    document.addEventListener("mousemove", e => { mouseDeltaRef.current += (e.clientX - lastMouseXRef.current) * 0.003; lastMouseXRef.current = e.clientX; });

    function isoProject(wx: number, wy: number) {
      const tx = (wx - W.player.x) * 1.1;
      const ty = (wy - W.player.y) * 1.1;
      const cos = Math.cos(-W.player.angle), sin = Math.sin(-W.player.angle);
      return { x: canvas.width / 2 + tx * cos - ty * sin, y: canvas.height / 2 + tx * sin + ty * cos };
    }

    function drawFrame() {
      const spd = 3;
      if (keysRef.current["w"] || keysRef.current["arrowup"]) { W.player.x += Math.sin(W.player.angle) * spd; W.player.y -= Math.cos(W.player.angle) * spd; }
      if (keysRef.current["s"] || keysRef.current["arrowdown"]) { W.player.x -= Math.sin(W.player.angle) * spd; W.player.y += Math.cos(W.player.angle) * spd; }
      if (keysRef.current["a"] || keysRef.current["arrowleft"]) W.player.angle -= 0.035;
      if (keysRef.current["d"] || keysRef.current["arrowright"]) W.player.angle += 0.035;
      W.player.angle += mouseDeltaRef.current; mouseDeltaRef.current = 0;
      W.player.x = Math.max(50, Math.min(1150, W.player.x));
      W.player.y = Math.max(50, Math.min(1150, W.player.y));

      if (autoMode) {
        if (!W.autoTarget) W.autoTarget = W.buildings[Math.floor(Math.random() * W.buildings.length)];
        const at = W.autoTarget!;
        const dx = at.wx + at.w / 2 - W.player.x, dy = at.wy + at.h / 2 - W.player.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 90) W.autoTarget = null;
        else {
          const ta = Math.atan2(dx, -dy);
          let da = ta - W.player.angle;
          while (da > Math.PI) da -= Math.PI * 2; while (da < -Math.PI) da += Math.PI * 2;
          W.player.angle += da * 0.06;
          W.player.x += Math.sin(W.player.angle) * 2.2;
          W.player.y -= Math.cos(W.player.angle) * 2.2;
        }
      }

      W.walkers.forEach(walker => {
        const dx = walker.tx - walker.x, dy = walker.ty - walker.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 15) { walker.tx = 200 + Math.random() * 900; walker.ty = 200 + Math.random() * 900; }
        else { walker.x += (dx / dist) * walker.speed; walker.y += (dy / dist) * walker.speed; }
        walker.taskTimer++;
        if (walker.taskTimer > 280 + Math.random() * 200) {
          walker.taskTimer = 0;
          walker.agent = { ...walker.agent };
          const task = walker.agent.tasks[Math.floor(Math.random() * walker.agent.tasks.length)];
          if (Math.random() > 0.5) addActivity(walker.agent, task);
        }
      });

      let nearest: typeof W.buildings[0] | null = null; let nearDist = Infinity;
      W.buildings.forEach(b => {
        const cx = b.wx + b.w / 2, cy = b.wy + b.h / 2;
        const d = Math.sqrt((cx - W.player.x) ** 2 + (cy - W.player.y) ** 2);
        if (d < 120 && d < nearDist) { nearest = b; nearDist = d; }
      });
      setNearBuilding(nearest);

      let nearestAgent: typeof W.walkers[0] | null = null; let nearAgentDist = Infinity;
      W.walkers.forEach(w => {
        const d = Math.sqrt((w.x - W.player.x) ** 2 + (w.y - W.player.y) ** 2);
        if (d < 80 && d < nearAgentDist) { nearestAgent = w; nearAgentDist = d; }
      });
      setNearAgent(nearestAgent ? nearestAgent.agent : null);

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Sky

      const sky = ctx.createLinearGradient(0, 0, 0, canvas.height);
      sky.addColorStop(0, "#000608"); sky.addColorStop(1, "#080F0A");
      ctx.fillStyle = sky; ctx.fillRect(0, 0, canvas.width, canvas.height);

      for (let i = 0; i < 180; i++) {
        const sx = ((i * 137.5 + 0.5) % canvas.width);
        const sy = ((i * 89.3 + 0.3) % (canvas.height * 0.55));
        ctx.fillStyle = `rgba(212,175,55,${0.1 + (i % 5) * 0.06})`;
        ctx.beginPath(); ctx.arc(sx, sy, i % 3 === 0 ? 1.2 : 0.6, 0, Math.PI * 2); ctx.fill();
      }

      const gSize = 60;
      for (let gx = 0; gx < 1200; gx += gSize) {
        for (let gy = 0; gy < 1200; gy += gSize) {
          const d = Math.sqrt((gx - W.player.x) ** 2 + (gy - W.player.y) ** 2);
          if (d > 700) continue;
          const alpha = Math.max(0, 1 - d / 700);
          const p1 = isoProject(gx, gy), p2 = isoProject(gx + gSize, gy);
          const p3 = isoProject(gx + gSize, gy + gSize), p4 = isoProject(gx, gy + gSize);
          ctx.beginPath(); ctx.moveTo(p1.x, p1.y); ctx.lineTo(p2.x, p2.y); ctx.lineTo(p3.x, p3.y); ctx.lineTo(p4.x, p4.y); ctx.closePath();
          const isRoad = (Math.floor(gx / gSize) % 4 === 0) || (Math.floor(gy / gSize) % 4 === 0);
          ctx.fillStyle = isRoad ? `rgba(22,20,14,${alpha * 0.95})` : `rgba(12,12,10,${alpha * 0.85})`;
          ctx.fill();
          ctx.strokeStyle = `rgba(212,175,55,${alpha * 0.07})`; ctx.lineWidth = 0.5; ctx.stroke();
        }
      }

      const sortedBuildings = [...W.buildings].sort((a, b) => (b.wy + b.h / 2) - (a.wy + a.h / 2));
      sortedBuildings.forEach(b => {
        const d = Math.sqrt((b.wx + b.w / 2 - W.player.x) ** 2 + (b.wy + b.h / 2 - W.player.y) ** 2);
        if (d > 700) return;
        const pos = isoProject(b.wx + b.w / 2, b.wy + b.h / 2);
        const scale = Math.max(0.3, 1 - d / 900);
        const alpha = Math.max(0.15, 1 - d / 700);
        const isNear = nearest?.id === b.id;
        const hp = b.h * scale * 1.3, wp = b.w * scale;
        const hex = b.color.replace("#", "");
        const r = parseInt(hex.slice(0, 2), 16), g = parseInt(hex.slice(2, 4), 16), bv = parseInt(hex.slice(4, 6), 16);

        ctx.fillStyle = `rgba(0,0,0,${alpha * 0.35})`;
        ctx.beginPath(); ctx.ellipse(pos.x, pos.y + hp * 0.08, wp * 0.5, wp * 0.18, 0, 0, Math.PI * 2); ctx.fill();

        const grad = ctx.createLinearGradient(pos.x - wp / 2, pos.y - hp, pos.x + wp / 2, pos.y);
        grad.addColorStop(0, `rgba(${r},${g},${bv},${alpha * 0.75})`);
        grad.addColorStop(0.5, `rgba(${Math.floor(r * 0.65)},${Math.floor(g * 0.65)},${Math.floor(bv * 0.65)},${alpha * 0.85})`);
        grad.addColorStop(1, `rgba(${Math.floor(r * 0.25)},${Math.floor(g * 0.25)},${Math.floor(bv * 0.25)},${alpha * 0.95})`);
        ctx.fillStyle = grad;
        ctx.fillRect(pos.x - wp / 2, pos.y - hp, wp, hp);

        // Windows
        const rows = Math.max(2, Math.floor(b.h / 28));
        const cols = Math.max(2, Math.floor(b.w / 22));
        for (let row = 0; row < rows; row++) {
          for (let col = 0; col < cols; col++) {
            const wx2 = pos.x - wp / 2 + (col + 0.5) * (wp / cols);
            const wy2 = pos.y - hp + (row + 0.5) * (hp / (rows + 1)) + 8 * scale;
            if (Math.sin(row * 7 + col * 13 + b.id.charCodeAt(0)) > 0.1) {
              ctx.fillStyle = `rgba(${r},${Math.min(255, g + 60)},${Math.min(255, bv + 60)},${alpha * 0.85})`;
              ctx.fillRect(wx2 - 3 * scale, wy2 - 4 * scale, 6 * scale, 7 * scale);
            }
          }
        }

        if (isNear) { ctx.shadowBlur = 25; ctx.shadowColor = b.color; }
        ctx.fillStyle = `rgba(${r},${g},${bv},${alpha * (isNear ? 0.95 : 0.55)})`;
        ctx.fillRect(pos.x - wp / 2, pos.y - hp, wp, 3 * scale);
        ctx.shadowBlur = 0;

        ctx.strokeStyle = isNear ? `rgba(${r},${g},${bv},0.95)` : `rgba(${r},${g},${bv},${alpha * 0.45})`;
        ctx.lineWidth = isNear ? 2 : 0.8;
        ctx.strokeRect(pos.x - wp / 2, pos.y - hp, wp, hp);

        if (d < 320) {
          ctx.fillStyle = `rgba(${r},${g},${bv},${alpha})`;
          ctx.font = `bold ${Math.max(9, 13 * scale)}px 'Bebas Neue', 'Arial Narrow', sans-serif`;
          ctx.textAlign = "center"; ctx.fillText(b.name, pos.x, pos.y - hp - 9 * scale);
        }
        if (isNear) {
          ctx.fillStyle = "rgba(0,255,136,0.95)";
          ctx.font = `${Math.max(8, 10 * scale)}px monospace`;
          ctx.textAlign = "center"; ctx.fillText("▼ PRESS E TO ENTER", pos.x, pos.y - hp - 26 * scale);
        }
      });

      W.walkers.forEach(walker => {
        const d = Math.sqrt((walker.x - W.player.x) ** 2 + (walker.y - W.player.y) ** 2);
        if (d > 450) return;
        const pos = isoProject(walker.x, walker.y);
        const scale = Math.max(0.35, 1 - d / 550);
        const alpha = Math.max(0.2, 1 - d / 450);
        const hex = walker.agent.color.replace("#", "");
        const r = parseInt(hex.slice(0, 2), 16), g = parseInt(hex.slice(2, 4), 16), bv = parseInt(hex.slice(4, 6), 16);

        ctx.fillStyle = `rgba(0,0,0,${alpha * 0.4})`;
        ctx.beginPath(); ctx.ellipse(pos.x, pos.y + 3 * scale, 8 * scale, 3 * scale, 0, 0, Math.PI * 2); ctx.fill();

        ctx.shadowBlur = 14 * scale; ctx.shadowColor = walker.agent.color;
        ctx.fillStyle = `rgba(${r},${g},${bv},${alpha * 0.92})`;
        ctx.beginPath(); ctx.arc(pos.x, pos.y - 18 * scale, 8 * scale, 0, Math.PI * 2); ctx.fill();
        ctx.fillRect(pos.x - 5 * scale, pos.y - 13 * scale, 10 * scale, 14 * scale);
        ctx.shadowBlur = 0;

        const legSwing = Math.sin(Date.now() * 0.008 + walker.x) * 4 * scale;
        ctx.strokeStyle = `rgba(${r},${g},${bv},${alpha * 0.7})`; ctx.lineWidth = 2 * scale;
        ctx.beginPath(); ctx.moveTo(pos.x - 3 * scale, pos.y + 1 * scale); ctx.lineTo(pos.x - 3 * scale + legSwing, pos.y + 10 * scale); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(pos.x + 3 * scale, pos.y + 1 * scale); ctx.lineTo(pos.x + 3 * scale - legSwing, pos.y + 10 * scale); ctx.stroke();

        if (d < 150) {
          ctx.fillStyle = `rgba(${r},${g},${bv},${alpha})`;
          ctx.font = `${Math.max(7, 9 * scale)}px monospace`; ctx.textAlign = "center";
          ctx.fillText(walker.agent.name, pos.x, pos.y - 30 * scale);
        }
        if (d < 80) {
          ctx.fillStyle = `rgba(255,255,255,${alpha * 0.7})`;
          ctx.font = `${Math.max(6, 8 * scale)}px monospace`;
          ctx.fillText(walker.agent.role.toUpperCase(), pos.x, pos.y - 40 * scale);
        }
      });

      ctx.save();
      ctx.translate(canvas.width / 2, canvas.height / 2);
      ctx.shadowBlur = 22; ctx.shadowColor = "#D4AF37";
      ctx.fillStyle = "#D4AF37";
      ctx.beginPath(); ctx.arc(0, -18, 10, 0, Math.PI * 2); ctx.fill();
      ctx.fillRect(-7, -12, 14, 14);
      ctx.shadowBlur = 0;
      ctx.font = "16px serif"; ctx.textAlign = "center"; ctx.fillText("👑", 0, -28);
      ctx.restore();

      animFrameRef.current = requestAnimationFrame(drawFrame);
    }

    animFrameRef.current = requestAnimationFrame(drawFrame);
    return () => {
      cancelAnimationFrame(animFrameRef.current);
      window.removeEventListener("resize", resize);
    };
  }, [gameReady, autoMode, addActivity]);

  function tryEnter() {
    const W = worldRef.current;
    let nearest: typeof W.buildings[0] | null = null; let nearDist = Infinity;
    W.buildings.forEach(b => {
      const cx = b.wx + b.w / 2, cy = b.wy + b.h / 2;
      const d = Math.sqrt((cx - W.player.x) ** 2 + (cy - W.player.y) ** 2);
      if (d < 120 && d < nearDist) { nearest = b; nearDist = d; }
    });
    if (nearest) setModalBuilding(nearest);
  }

  if (isLoading) return null;
  if (!isAuthenticated) { navigate({ to: "/login" }); return null; }

  return (
    <div style={{ position: "fixed", inset: 0, background: "#000", overflow: "hidden", fontFamily: "'Rajdhani', sans-serif", color: "#F0EDE0" }}>
      {!gameReady && (
        <div style={{ position: "fixed", inset: 0, background: "#0A0A0A", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", zIndex: 1000 }}>
          <div style={{ fontFamily: "monospace", fontSize: 56, color: "#D4AF37", letterSpacing: 8, textShadow: "0 0 40px rgba(212,175,55,0.7)", marginBottom: 8 }}>KOACHVERSE</div>
          <div style={{ fontFamily: "monospace", fontSize: 11, color: "#8B6914", letterSpacing: 8 }}>EMPIRE WORLD · AI KOACHED</div>
          <div style={{ width: 280, height: 2, background: "rgba(212,175,55,0.1)", marginTop: 48, borderRadius: 1, overflow: "hidden" }}>
            <div style={{ width: `${loadPercent}%`, height: "100%", background: "#D4AF37", boxShadow: "0 0 10px #D4AF37", transition: "width 0.1s" }} />
          </div>
          <div style={{ fontFamily: "monospace", fontSize: 10, color: "#8B6914", letterSpacing: 3, marginTop: 12 }}>{loadMsg}</div>
        </div>
      )}

      <canvas ref={canvasRef} style={{ display: "block", width: "100%", height: "100%", cursor: "none" }} />

      <div style={{ position: "fixed", inset: 0, background: "repeating-linear-gradient(0deg,transparent,transparent 2px,rgba(0,0,0,0.04) 2px,rgba(0,0,0,0.04) 4px)", pointerEvents: "none", zIndex: 10 }} />
      <div style={{ position: "fixed", inset: 0, background: "radial-gradient(ellipse at center,transparent 45%,rgba(0,0,0,0.75) 100%)", pointerEvents: "none", zIndex: 9 }} />

      <div style={{ position: "fixed", top: 20, left: 24, zIndex: 100 }}>
        <div style={{ fontFamily: "monospace", fontSize: 26, color: "#D4AF37", letterSpacing: 4, textShadow: "0 0 18px rgba(212,175,55,0.6)" }}>KOACHVERSE</div>
        <div style={{ fontFamily: "monospace", fontSize: 9, color: "#8B6914", letterSpacing: 7, marginTop: -4 }}>AI KOACHED · EMPIRE WORLD</div>
      </div>

      <div style={{ position: "fixed", top: 20, right: 24, textAlign: "right", zIndex: 100 }}>
        <div style={{ fontFamily: "monospace", fontSize: 10, color: "#8B6914", letterSpacing: 3 }}>$KOACH BALANCE</div>
        <div style={{ fontFamily: "monospace", fontSize: 38, color: "#D4AF37", textShadow: "0 0 14px rgba(212,175,55,0.5)", lineHeight: 1 }}>{koachBalance.toLocaleString()}</div>
        <div style={{ fontFamily: "monospace", fontSize: 10, color: "#8B6914", letterSpacing: 2 }}>TOKENS</div>
      </div>

      <div style={{ position: "fixed", top: 80, right: 24, width: 250, background: "rgba(0,0,0,0.85)", border: "1px solid rgba(212,175,55,0.25)", zIndex: 100 }}>
        <div style={{ padding: "8px 12px", borderBottom: "1px solid rgba(212,175,55,0.15)", display: "flex", alignItems: "center", gap: 8 }}>
          <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#00FF88", boxShadow: "0 0 6px #00FF88" }} />
          <span style={{ fontFamily: "monospace", fontSize: 10, color: "#D4AF37", letterSpacing: 3 }}>LIVE AGENT FEED</span>
        </div>
        <div style={{ maxHeight: 300, overflowY: "hidden" }}>
          {activityFeed.slice(0, 8).map((item, i) => (
            <div key={i} style={{ padding: "5px 12px", borderBottom: "1px solid rgba(212,175,55,0.04)" }}>
              <div style={{ fontFamily: "monospace", fontSize: 9, color: item.agent.color, letterSpacing: 1 }}>{item.agent.name} · {item.agent.role.toUpperCase()}</div>
              <div style={{ fontSize: 11, color: "rgba(240,237,224,0.65)", marginTop: 1 }}>{item.task}</div>
              <div style={{ fontFamily: "monospace", fontSize: 8, color: "rgba(212,175,55,0.3)", marginTop: 1 }}>{item.time}</div>
            </div>
          ))}
        </div>
      </div>

      {nearAgent && (
        <div style={{ position: "fixed", top: 80, left: 24, width: 190, background: "rgba(0,0,0,0.88)", border: `1px solid ${nearAgent.color}44`, padding: 14, zIndex: 100 }}>
          <div style={{ fontSize: 28, textAlign: "center" }}>🤖</div>
          <div style={{ fontFamily: "monospace", fontSize: 16, color: nearAgent.color, textAlign: "center", letterSpacing: 2, marginTop: 4 }}>{nearAgent.name}</div>
          <div style={{ fontFamily: "monospace", fontSize: 9, color: "rgba(212,175,55,0.5)", textAlign: "center", letterSpacing: 2 }}>{nearAgent.role.toUpperCase()}</div>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 4, marginTop: 8, fontFamily: "monospace", fontSize: 9, color: "#00FF88" }}>
            <div style={{ width: 5, height: 5, borderRadius: "50%", background: "#00FF88" }} /> ONLINE
          </div>
        </div>
      )}

      <div style={{ position: "fixed", bottom: 24, left: "50%", transform: "translateX(-50%)", display: "flex", gap: 8, alignItems: "center", background: "rgba(0,0,0,0.85)", border: "1px solid rgba(212,175,55,0.2)", padding: "10px 16px", zIndex: 100 }}>
        {[["W A S D", "MOVE"], ["MOUSE", "LOOK"], ["E", "ENTER"], ["Q", "AUTO"]].map(([key, label]) => (
          <div key={key} style={{ display: "flex", alignItems: "center", gap: 5 }}>
            <span style={{ fontFamily: "monospace", fontSize: 10, background: "rgba(212,175,55,0.1)", border: "1px solid #8B6914", color: "#D4AF37", padding: "3px 7px", borderRadius: 3 }}>{key}</span>
            <span style={{ fontSize: 10, color: "rgba(240,237,224,0.4)", marginRight: 6 }}>{label}</span>
          </div>
        ))}
      </div>

      <div style={{ position: "fixed", bottom: 24, right: 24, zIndex: 100 }}>
        <button onClick={() => setAutoMode(p => !p)} style={{ fontFamily: "monospace", fontSize: 14, letterSpacing: 3, padding: "10px 18px", background: "transparent", border: `1px solid ${autoMode ? "#00FF88" : "#8B6914"}`, color: autoMode ? "#00FF88" : "#8B6914", cursor: "pointer", boxShadow: autoMode ? "0 0 20px rgba(0,255,136,0.2)" : "none" }}>
          ⚡ AUTO MODE
        </button>
        <div style={{ display: "flex", alignItems: "center", gap: 5, marginTop: 6, fontFamily: "monospace", fontSize: 9, color: autoMode ? "#00FF88" : "#8B6914", justifyContent: "center" }}>
          <div style={{ width: 5, height: 5, borderRadius: "50%", background: autoMode ? "#00FF88" : "#8B6914", boxShadow: autoMode ? "0 0 6px #00FF88" : "none" }} />
          {autoMode ? "AGENTS RUNNING" : "MANUAL CONTROL"}
        </div>
      </div>

      {modalBuilding && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.92)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 500, backdropFilter: "blur(4px)" }} onClick={() => setModalBuilding(null)}>
          <div style={{ background: "#111", border: `1px solid ${modalBuilding.color}`, padding: 40, maxWidth: 460, width: "90%", position: "relative", boxShadow: `0 0 60px ${modalBuilding.color}22` }} onClick={e => e.stopPropagation()}>
            <div style={{ position: "absolute", top: -1, left: 20, width: 60, height: 3, background: modalBuilding.color }} />
            <div style={{ fontFamily: "monospace", fontSize: 10, color: "rgba(212,175,55,0.5)", letterSpacing: 4 }}>{modalBuilding.type}</div>
            <div style={{ fontFamily: "monospace", fontSize: 40, color: modalBuilding.color, letterSpacing: 3, lineHeight: 1, marginTop: 6, textShadow: `0 0 20px ${modalBuilding.color}66` }}>{modalBuilding.name}</div>
            <div style={{ fontSize: 14, color: "rgba(240,237,224,0.65)", marginTop: 16, lineHeight: 1.7 }}>{modalBuilding.desc} Powered by your AI team — available 24/7, working autonomously on your empire.</div>
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginTop: 20 }}>
              {modalBuilding.agents.map(id => {
                const agent = AGENTS.find(a => a.id === id);
                return agent ? (
                  <span key={id} style={{ fontFamily: "monospace", fontSize: 9, padding: "4px 8px", border: `1px solid ${agent.color}44`, color: agent.color, borderRadius: 2 }}>{agent.name} · {agent.role.toUpperCase()}</span>
                ) : null;
              })}
              <span style={{ fontFamily: "monospace", fontSize: 9, padding: "4px 8px", border: "1px solid rgba(0,255,136,0.3)", color: "rgba(0,255,136,0.7)", borderRadius: 2 }}>● ONLINE</span>
            </div>
            <div style={{ display: "flex", gap: 12, marginTop: 28 }}>
              <button onClick={() => { if (modalBuilding.link.startsWith("/")) { navigate({ to: modalBuilding.link as any }); } setModalBuilding(null); }} style={{ flex: 1, fontFamily: "monospace", fontSize: 16, letterSpacing: 3, padding: "12px 0", background: modalBuilding.color, color: "#000", border: "none", cursor: "pointer" }}>ENTER ▶</button>
              <button onClick={() => setModalBuilding(null)} style={{ fontFamily: "monospace", fontSize: 16, letterSpacing: 2, padding: "12px 20px", background: "transparent", color: "#8B6914", border: "1px solid #8B6914", cursor: "pointer" }}>✕</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
