import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Logo } from "@/components/Logo";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { Sparkles, ArrowRight, Bot, Target } from "lucide-react";

export const Route = createFileRoute("/empire/onboarding")({
  head: () => ({
    meta: [
      { title: "Welcome \u2014 AI KOACHED" },
      { name: "description", content: "Your AI team is ready to build your empire." },
    ],
  }),
  component: OnboardingPage,
});

const HOT_BUSINESSES = [
  { id: "ai_content_agency", emoji: "\u270d\ufe0f", name: "AI Content Agency", tagline: "Write for businesses using AI", income: "$2K\u2013$10K/mo", speed: "First $ in 7 days", difficulty: "Beginner", color: "#D4AF37", firstStep: "DM 10 local businesses offering one free social post today." },
  { id: "ai_virtual_assistant", emoji: "\ud83d\udcbc", name: "AI Virtual Assistant", tagline: "Handle admin for busy founders", income: "$1.5K\u2013$6K/mo", speed: "First $ in 3 days", difficulty: "Beginner", color: "#4CAF50", firstStep: "Post in 3 entrepreneur Facebook groups offering AI-powered VA services." },
  { id: "ai_social_media_manager", emoji: "\ud83d\udcf1", name: "AI Social Media Manager", tagline: "Run social for local businesses", income: "$1K\u2013$5K/mo", speed: "First $ in 7 days", difficulty: "Beginner", color: "#E91E63", firstStep: "Offer a free 30-day trial to one restaurant or salon near you." },
  { id: "ai_chatbot_agency", emoji: "\ud83e\udd16", name: "AI Chatbot Agency", tagline: "Build chatbots for small businesses", income: "$3K\u2013$15K/mo", speed: "First $ in 14 days", difficulty: "Intermediate", color: "#2196F3", firstStep: "Target dental offices, gyms, and law firms \u2014 offer a free 30-day pilot." },
  { id: "ai_lead_generation", emoji: "\ud83c\udfaf", name: "AI Lead Generation", tagline: "Find clients for businesses using AI", income: "$3K\u2013$20K/mo", speed: "First $ in 14 days", difficulty: "Intermediate", color: "#FF5722", firstStep: "Run a free pilot \u2014 deliver 100 qualified leads before charging anything." },
  { id: "ai_automation_consultant", emoji: "\u26a1", name: "AI Automation Consultant", tagline: "Make businesses run on autopilot", income: "$5K\u2013$25K/mo", speed: "First $ in 7 days", difficulty: "Intermediate", color: "#9C27B0", firstStep: "Audit one business workflow for free. Show them how much time they waste." },
  { id: "ai_credit_repair", emoji: "\ud83d\udcb3", name: "AI Credit Repair Agency", tagline: "Help clients fix their credit", income: "$3K\u2013$20K/mo", speed: "First $ in 14 days", difficulty: "Intermediate", color: "#E53935", firstStep: "Offer a free credit report review. Find one error, show them you can fix it." },
  { id: "ai_saas", emoji: "\ud83d\ude80", name: "AI SaaS Platform", tagline: "Build a niche AI tool for one industry", income: "$5K\u2013$100K+/mo", speed: "First $ in 30\u201390 days", difficulty: "Advanced", color: "#00BCD4", firstStep: "Identify one painful manual process in a specific industry. Build the AI fix." },
];

const CHAT_STARTERS_NETWORK = [
  "I want to start a business but have no idea what to do",
  "I got laid off and want to work for myself using AI",
  "I have a business idea and need help building it",
  "I want to make money online with AI tools",
];

function OnboardingPage() {
  const { user, isAuthenticated, isLoading } = useAuth();
  const navigate = useNavigate();
  const [step, setStep] = useState<"welcome"|"path"|"ai-pick"|"self-input"|"confirm">("welcome");
  const [displayName, setDisplayName] = useState("");
  const [selectedPath, setSelectedPath] = useState<"ai"|"self"|null>(null);
  const [selectedBusiness, setSelectedBusiness] = useState<typeof HOT_BUSINESSES[0]|null>(null);
  const [chatMessages, setChatMessages] = useState<{role:"user"|"assistant";content:string}[]>([]);
  const [chatInput, setChatInput] = useState("");
  const [chatLoading, setChatLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const chatEndRef = useRef<HTMLButtonElement>(null);

  if (isLoading) return null;
  if (!isAuthenticated) { navigate({ to: "/login" }); return null; }

  const sendToArchitect = async (msg: string) => {
    if (!msg.trim() || chatLoading) return;
    const userMsg = { role: "user" as const, content: msg };
    const newHistory = [...chatMessages, userMsg];
    setChatMessages(newHistory);
    setChatInput("");
    setChatLoading(true);
    try {
      const r = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/smart-onboarding`, {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mode: "chat", messages: newHistory }),
      });
      const data = await r.json();
      setChatMessages((prev) => [...prev, { role: "assistant", content: data.reply || "Let me think about that..." }]);
      if (data.is_complete && data.recommended_business) {
        const biz = HOT_BUSINESSES.find((b) => b.id === data.recommended_business.id);
        if (biz) { setSelectedBusiness(biz); setTimeout(() => setStep("confirm"), 1200); }
      }
    } catch { setChatMessages((prev) => [...prev, { role: "assistant", content: "What type of work do you enjoy?" }]); }
    setChatLoading(false);
  };

  const handleFinish = async () => {
    if (!user) return;
    setSaving(true);
    await supabase.from("profiles").update({ display_name: displayName||undefined, onboarding_complete: true }).eq("user_id", user.id);
    await supabase.from("user_onboarding").upsert({ user_id:user.id, path:selectedPath||"self", recommended_business_id:selectedBusiness?.id, business_idea:selectedBusiness?.name||chatInput, onboarding_complete:true, route_to:"/empire/ai-workers", first_agent:"ceo_coach", completed_at:new Date().toISOString() }, { onConflict:"user_id" });
    await supabase.from("empire_journey").upsert({ user_id:user.id, phase:"discovery", current_step:1, next_agent:"ceo_coach" }, { onConflict:"user_id" });
    navigate({ to: "/empire/ai-workers" });
  };

  const progress = { welcome:10, path:30, "ai-pick":55, "self-input":55, confirm:90 }[step];

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      <div className="fixed top-0 left-0 right-0 h-0.5 bg-muted z-50">
        <motion.div className="h-full bg-primary" animate={{ width: `${progress}%` }} transition={{ duration: 0.4 }} />
      </div>
      <div className="flex-1 flex items-center justify-center px-4 py-16">
        <AnimatePresence mode="wait">
          {step==="welcome"&&(<motion.div key="welcome" initial={{opacity:0,y:24}} animate={{opacity:1,y:0}} exit={{opacity:0,y:-24}} className="max-w-lg w-full text-center"><Logo size={48}/><h1 className="font-heading text-3xl font-bold mt-4">Welcome, CEO</h1><p className="text-muted-foreground mt-3 text-sm max-w-sm mx-auto">Your AI team of 15 specialists is ready.</p><div className="mt-6 inline-flex items-center gap-2 px-4 py-2 rounded-full border border-primary/20 bg-primary/5 text-primary text-sm"><Sparkles className="w4 h-4"/><span className="font-mono font-bold">+500 $KOACH</span><span className="text-xs text-muted-foreground">welcome bonus</span></div><Input value={displayName} onChange={(e)=>setDisplayName(e.target.value)} onKeyDown={(e)=>e.key==="Enter"&&displayName.trim()&&setStep("path")} placeholder="Your first name" className="mt-6 bg-card border-border text-center text-base" autoFocus/><Button size="lg" onClick={()=>setStep("path")} disabled={!displayName.trim()} className="mt-4 bg-primary text-primary-foreground gap-2 w-full">Let&apos;s{Gop <ArrowRight className="w4 h-4"/></Button></motion.div>)}
          {step==="path"&&(<motion.div key="path" initial={{opacity:0,y:24}} animate={{opacity:1,y:0}} exit={{opacity:0,y:-24}} className="max-w-xl w-full"><h2 className="font-heading text-2xl font-bold text-center">Hey {displayName} 🐋>2><p className="text-muted-foreground text-center mt-2 text-sm">How would you like to get started?</p><div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-4"><button onClick={()=>{setSelectedPath("ai");setStep("ai-pick");}} className="group p6 rounded-xl border border-border bg-card hover:border-primary/50 hover:bg-primary/5 transition-all text-left"><div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center mb-4"><Bot className="w-5 h-5 text-primary"/></div><h3 className="font-heading text-base font-semibold">I don&apos;t know what to build</h3><p className="text-xs text-muted-foreground mt-2">AI picks the perfect business. April 2026 researched.</p><div className="mt-4 flex items-center gap-1 text-primary text-xs font-semibold">AI picks for you <ArrowRight className="w3 h-3"/></div></button><button onClick={()=>{setSelectedPath("self");setChatMessages([{role:"assistant",content:`Hey ${displayName}! I'm The Architect. Tell me what you want to build and I'll make a 90-day plan.`}]);setStep("self-input");}} className="group p-6 rounded-xl border border-border bg-card hover:border-primary/50 hover:bg-primary/5 transition-all text-left"><div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center mb-4"><Target className="w-5 h-5 text-primary"/></div><h3 className="font-heading text-base font-semibold">I already have an idea</h3><p className="text-xs text-muted-foreground mt-2">Tell The Architect. They will set up your empire roadmap.</p><div className="mt-4 flex items-center gap-1 text-primary text-xs font-semibold">Start building now <ArrowRight className="w-3 h-3"/></div></button></div></motion.div>)}
          {step==="ai-pick"&&(<motion.div key="ai-pick" initial={{opacity:0,y:24}} animate={{opacity:1,y:0}} exit={{opacity:0,y:-24}} className="max-w-3xl w-full"><h2 className="font-heading text-2xl font-bold text-center">🟕 Hottest AI Fusinesses &mdash; April 2026</h2><p className="text-muted-foreground text-center mt-2 text-sm">Pick one. The Architect builds your 90-day plan.</p><div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-3">{HOT_BUSINESSES.map((biz)=>(<button key={biz.id} onClick={()=>{setSelectedBusiness(biz);setStep("confirm");}} className="group p-4 rounded-xl border border-border bg-card hover:border-primary/40 hover:bg-primary/5 transition-all text-left"><div className="flex items-start gap-3"><span className="text-2xl leading-none mt-0.5">{biz.emoji}</span><div className="flex-1 min-w-0"><div className="flex items-center justify-between gap-2"><h3 className="font-heading text-sm font-semibold truncate">{biz.name}</h3><span className="text-[9px] font-mono font-bold px-1.5 py-0.5 rounded shrink-0" style={{backgroundColor:biz.color+"20",color:biz.color}}>{biz.difficulty}</span></div><p className="text-xs text-muted-foreground mt-0.5">{biz.tagline}</p><div className="flex items-center gap-3 mt-2"><span className="text-[10px] font-mono font-bold" style={{color:biz.color}}>{biz.income}</span><span className="text-[10px] text-muted-foreground">{biz.speed}</span></div></div></div></button>))}</div></motion.div>)}
          {step==="self-input"&&(<motion.div key="self-input" initial={{opacity:0,y:24}} animate={{opacity:1,y:0}} exit={{opacity:0,y:-24}} className="max-w-xl w-full"><div className="flex items-center gap-3 mb-4"><div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-lg">🏗️</div><div><h2 className="font-heading text-lg font-bold">The Architect</h2><p className="text-xs text-muted-foreground">Master Business Builder</p></div><div className="ml-auto flex items-center gap-1 text-[10px] text-green-500 font-mono"><div className="w4.5 h-1.5 rounded-full bg-green-500"/>ONLINE</div></div><div className="bg-card border border-border rounded-xl p-4 h-64 overflow-y-auto space-y-3">{chatMessages.map((msg,i)=>(<div key={i} className={`flex ${msg.role==="user"?"justify-end":"justify-start"}`}><div className={`max-w[85%] rounded-xl px-3 py-2 text-sm leading-relaxed whitespace-pre-wrap ${msg.role==="user"?"bg-primary text-primary-foreground rounded-br-sm":"bg-muted text-foreground rounded-bl-sm"}`}>{msg.content}</div></div>))}{chatLoading&&<div className="flex justify-start"><div className="bg-muted rounded-xl px-3 py-2 text-sm text-muted-foreground">Thinking...</div></div>}<div internalRef={chatEndRef}/></div>{notWorking<length=>{chatMessages.length<=1&&(<div className="mt-3 flex flex-wrap gap-2">{CHAT_STARTERS_NETWORK.map((s)=><button key={s} onClick={()=>sendToArchitect(s)} className="text-xs px-3 py-1.5 rounded-full border border-primary/20 text-primary/80 hover:bg-primary/5 hover:border-primary/40 transition-colors">{s}</button>)}</div>)}<div className="mt-3 flex gap-2"><Input value={chatInput} onChange={(e)=>setChatInput(e.target.value)} onKeyDown={(_)=>g.key==="Enter"&&sendToArchitect(chatInput)} placeholder="Tell The Architect what you want to build..." className="bg-muted border-border text-sm" disabled={chatLoading}/><Button size="icon" onClick={()=>sendToArchitect(chatInput)} disabled={!chatInput.trim()||chatLoading} className="bg-primary text-primary-foreground shrink-0"><ArrowRight className="w-4 h-4"/></Button></div><button onClick={()=>setStep("ai-pick")} className="mt-3 w-full text-xs text-muted-foreground hover:text-primary transition-colors">Browse all business ideas &rarr;</button></motion.div>)}
          {step==="confirm"&&selectedBusiness&&(<motion.div key="confirm" initial={{opacity:0,scale:0.95}} animate={{opacity:1,scale:1}} exit={{opacity:0}} className="max-w-lg w-full"><div className="text-center mb-6"><span className="text-5xl">{selectedBusiness.emoji}</span><h2 className="font-heading text-2xl font-bold mt-3">Your Business Is Chosen</h2><p className="text-muted-foreground text-sm mt-1">The Architect builds your 90-day plan when you enter.</p></div><div className="p-6 rounded-xl border" style={{borderColor:selectedBusiness.color+"40",background:selectedBusiness.color+"08"}}><h3 className="font-heading text-xl font-bold" style={{color:selectedBusiness.color}}>{selectedBusiness.name}</h3><p className="text-sm text-muted-foreground mt-1">{selectedBusiness.tagline}</p><div className="grid grid-cols-2 gap-3 mt-4"><div className="p-3 rounded-lg bg-background/50"><p className="text-[10px] text-muted-foreground uppercase font-mono">Income Potential</p><p className="font-mono font-bold text-sm mt-0.5" style={{color:selectedBusiness.color}}>{selectedBusiness.income}</p></div><div className="p-3 rounded-lg bg-background/50"><p className="text-[10px] text-muted-foreground uppercase font-mono">First Dollar</p><p className="font-mono font-bold text-sm mt-0.5" style={{color:selectedBusiness.color}}>{selectedBusiness.speed}</p></div></div><div className="mt-4 p-3 rounded-lg bg-background/50"><p className="text-[10px] text-muted-foreground uppercase font-mono mb-1">Your First Step Today</p><p className="text-sm text-foreground leading-relaxed">{selectedBusiness.firstStep}</p></div></div><div className="mt-4 flex items-center justify-between"><button onClick={()=>setStep("ai-pick")} className="text-xs text-muted-foreground hover:text-primary transition-colors">&larr{ Change</button><Button onClick={handleFinish} disabled={saving} className="bg-primary text-primary-foreground gap-2">{saving?"Setting up...":"Enter Your Empire"} <ArrowRight className="w-4 h-4"/></Button></div></motion.div>)}
        </AnimatePresence>
      </div>
    </div>
  );
}
