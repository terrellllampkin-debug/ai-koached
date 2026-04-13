import { createFileRoute, Link } from "@tanstack/react-router";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { useState, useEffect } from "react";
import {
  Building2, Plus, CheckCircle, Clock, AlertCircle,
  ChevronRight, ExternalLink, FileText, Trash2,
  ArrowRight, Sparkles, Info,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/empire/entity")({
  head: () => ({
    meta: [
      { title: "Entity Builder — AI KOACHED" },
      { name: "description", content: "Form LLCs, Corps, and Trusts step-by-step with guided links." },
    ],
  }),
  component: EntityPage,
});

/* ─── Formation Steps (like ZenBusiness / LegalZoom) ─── */
const FORMATION_STEPS = [
  {
    key: "choose_type",
    label: "Choose Entity Type",
    description: "Select LLC, S-Corp, C-Corp, or Trust based on your goals.",
    tip: "Most new businesses start with an LLC — it's the easiest to form and offers liability protection.",
  },
  {
    key: "choose_state",
    label: "Choose Formation State",
    description: "Pick the state where you'll register your business.",
    tip: "Wyoming & Delaware are popular for privacy and low fees. Your home state works great too.",
  },
  {
    key: "name_search",
    label: "Check Name Availability",
    description: "Search your state's business registry to make sure your name isn't taken.",
    getLink: (state: string) => STATE_SOS_LINKS[state] || null,
    linkLabel: "Search State Registry →",
  },
  {
    key: "file_entity",
    label: "File with Secretary of State",
    description: "Submit your Articles of Organization (LLC) or Articles of Incorporation (Corp).",
    getLink: (state: string) => STATE_FILING_LINKS[state] || null,
    linkLabel: "File Online →",
    cost: "$50–$500 depending on state",
  },
  {
    key: "get_ein",
    label: "Get Your EIN (Tax ID)",
    description: "Apply for a free Employer Identification Number from the IRS. Takes ~5 minutes online.",
    link: "https://www.irs.gov/businesses/small-businesses-self-employed/apply-for-an-employer-identification-number-ein-online",
    linkLabel: "Apply on IRS.gov (Free) →",
  },
  {
    key: "operating_agreement",
    label: "Create Operating Agreement",
    description: "This document outlines ownership, roles, and how the business runs. Required for most LLCs.",
    internalLink: "/empire/documents",
    linkLabel: "Generate with AI →",
  },
  {
    key: "bank_account",
    label: "Open Business Bank Account",
    description: "Separate personal and business finances. You'll need your EIN and formation docs.",
    tip: "Recommended: Mercury, Relay, BlueVine, or your local credit union.",
  },
  {
    key: "licenses",
    label: "Get Business Licenses & Permits",
    description: "Check what licenses your city, county, and state require for your industry.",
    link: "https://www.sba.gov/business-guide/launch-your-business/apply-licenses-permits",
    linkLabel: "Check SBA License Guide →",
  },
  {
    key: "registered_agent",
    label: "Set Up Registered Agent",
    description: "Every entity needs a registered agent to receive legal mail. You can be your own or use a service.",
    tip: "Services like Northwest ($125/yr) or your state filing often include one.",
  },
  {
    key: "compliance_calendar",
    label: "Set Compliance Reminders",
    description: "Annual reports, franchise taxes, and renewal deadlines vary by state. Set them now so you never miss one.",
    internalLink: "/empire/compliance",
    linkLabel: "Go to Compliance Tracker →",
  },
];

const STATE_SOS_LINKS: Record<string, string> = {
  Delaware: "https://icis.corp.delaware.gov/ecorp/entitysearch/namesearch.aspx",
  Wyoming: "https://wyobiz.wyo.gov/Business/FilingSearch.aspx",
  Nevada: "https://esos.nv.gov/EntitySearch/OnlineEntitySearch",
  Texas: "https://mycpa.cpa.state.tx.us/coa/",
  Florida: "https://search.sunbiz.org/Inquiry/CorporationSearch/ByName",
  "New Mexico": "https://portal.sos.state.nm.us/BFS/online/CorporationBusinessSearch",
  California: "https://bizfileonline.sos.ca.gov/search/business",
  "New York": "https://apps.dos.ny.gov/publicInquiry/",
};

const STATE_FILING_LINKS: Record<string, string> = {
  Delaware: "https://corp.delaware.gov/howtoform/",
  Wyoming: "https://wyobiz.wyo.gov/Business/FilingSearch.aspx",
  Nevada: "https://www.nvsos.gov/sos/businesses/start-a-business",
  Texas: "https://www.sos.state.tx.us/corp/forms_702.shtml",
  Florida: "https://dos.fl.gov/sunbiz/start-business/efile/fl-llc/",
  "New Mexico": "https://portal.sos.state.nm.us/BFS/online/",
  California: "https://bizfileonline.sos.ca.gov/forms",
  "New York": "https://dos.ny.gov/business-filings",
};

const entityTypes = ["LLC", "S-Corp", "C-Corp", "Trust", "Sole Proprietorship"];
const states = ["Delaware", "Wyoming", "Nevada", "Texas", "Florida", "New Mexico", "California", "New York"];

type EntityRow = {
  id: string;
  name: string;
  entity_type: string;
  state: string | null;
  ein: string | null;
  status: string;
  formed_at: string | null;
  formation_steps: Record<string, boolean>;
};

function EntityPage() {
  const { user, isAuthenticated } = useAuth();
  const [entities, setEntities] = useState<EntityRow[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [selectedEntityId, setSelectedEntityId] = useState<string | null>(null);
  const [newName, setNewName] = useState("");
  const [newType, setNewType] = useState("");
  const [newState, setNewState] = useState("");

  useEffect(() => {
    if (!user) return;
    supabase.from("entities").select("*").eq("user_id", user.id).order("created_at", { ascending: false })
      .then(({ data }) => {
        if (data) setEntities(data.map(e => ({
          ...e,
          formation_steps: (e.formation_steps as Record<string, boolean>) || {},
        })));
      });
  }, [user]);

  const handleCreate = async () => {
    if (!user || !newName || !newType) return;
    const initialSteps: Record<string, boolean> = {};
    if (newType) initialSteps["choose_type"] = true;
    if (newState) initialSteps["choose_state"] = true;

    const { data } = await supabase.from("entities").insert({
      user_id: user.id,
      name: newName,
      entity_type: newType,
      state: newState || null,
      status: "in_progress",
      formation_steps: initialSteps,
    }).select().single();
    if (data) {
      const newEntity = { ...data, formation_steps: initialSteps };
      setEntities((prev) => [newEntity, ...prev]);
      setSelectedEntityId(data.id);
      setShowForm(false);
      setNewName("");
      setNewType("");
      setNewState("");
    }
  };

  const toggleStep = async (entityId: string, stepKey: string) => {
    const entity = entities.find(e => e.id === entityId);
    if (!entity || !user) return;

    const updated = { ...entity.formation_steps, [stepKey]: !entity.formation_steps[stepKey] };
    setEntities(prev => prev.map(e => e.id === entityId ? { ...e, formation_steps: updated } : e));

    const completedCount = Object.values(updated).filter(Boolean).length;
    const newStatus = completedCount === FORMATION_STEPS.length ? "formed" :
                      completedCount > 0 ? "in_progress" : "planned";

    await supabase.from("entities").update({
      formation_steps: updated,
      status: newStatus,
      ...(newStatus === "formed" ? { formed_at: new Date().toISOString() } : {}),
    }).eq("id", entityId).eq("user_id", user.id);

    setEntities(prev => prev.map(e => e.id === entityId ? { ...e, status: newStatus } : e));
  };

  if (!isAuthenticated) return null;

  const selectedEntity = entities.find(e => e.id === selectedEntityId);

  const statusIcon = (status: string) => {
    if (status === "formed") return <CheckCircle className="w-4 h-4 text-green-500" />;
    if (status === "in_progress") return <Clock className="w-4 h-4 text-primary" />;
    return <AlertCircle className="w-4 h-4 text-muted-foreground" />;
  };

  const getProgress = (e: EntityRow) => {
    const done = Object.values(e.formation_steps).filter(Boolean).length;
    return Math.round((done / FORMATION_STEPS.length) * 100);
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="max-w-5xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="font-heading text-2xl font-bold flex items-center gap-2">
              <Building2 className="w-6 h-6 text-secondary" />
              Entity Builder
            </h1>
            <p className="text-sm text-muted-foreground">
              Form your business step-by-step — we link you directly to every filing site
            </p>
          </div>
          <Button onClick={() => { setShowForm(true); setSelectedEntityId(null); }} className="bg-primary text-primary-foreground gap-1">
            <Plus className="w-4 h-4" /> New Entity
          </Button>
        </div>

        {/* Create Form */}
        <AnimatePresence>
          {showForm && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="mb-6 p-6 rounded-xl border border-primary/30 bg-card overflow-hidden"
            >
              <h3 className="font-heading font-semibold mb-2">Start a New Entity</h3>
              <p className="text-xs text-muted-foreground mb-4">
                Don't worry — you'll go through each step after creating. Just pick the basics to get started.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <Input placeholder="Business name" value={newName} onChange={(e) => setNewName(e.target.value)} className="bg-background" />
                <Select value={newType} onValueChange={setNewType}>
                  <SelectTrigger className="bg-background"><SelectValue placeholder="Entity type" /></SelectTrigger>
                  <SelectContent>
                    {entityTypes.map((t) => <SelectItem key={t} value={t}>{t}</SelectItem>)}
                  </SelectContent>
                </Select>
                <Select value={newState} onValueChange={setNewState}>
                  <SelectTrigger className="bg-background"><SelectValue placeholder="Formation state" /></SelectTrigger>
                  <SelectContent>
                    {states.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div className="flex gap-2 mt-4">
                <Button onClick={handleCreate} disabled={!newName || !newType} className="bg-primary text-primary-foreground gap-1">
                  <Sparkles className="w-4 h-4" /> Create & Start Formation
                </Button>
                <Button variant="ghost" onClick={() => setShowForm(false)}>Cancel</Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left: Entity list */}
          <div className="space-y-3">
            {entities.length === 0 && !showForm ? (
              <div className="text-center py-16 col-span-3">
                <Building2 className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground mb-4">No entities yet. Start building your corporate structure.</p>
                <Button onClick={() => setShowForm(true)} className="bg-primary text-primary-foreground gap-1">
                  <Plus className="w-4 h-4" /> Create Your First Entity
                </Button>
              </div>
            ) : (
              entities.map((entity) => (
                <motion.button
                  key={entity.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  onClick={() => { setSelectedEntityId(entity.id); setShowForm(false); }}
                  className={cn(
                    "w-full text-left p-4 rounded-xl border transition-all",
                    selectedEntityId === entity.id
                      ? "border-primary bg-primary/5 shadow-lg shadow-primary/10"
                      : "border-border bg-card hover:border-primary/30"
                  )}
                >
                  <div className="flex items-center gap-3 mb-2">
                    {statusIcon(entity.status)}
                    <p className="font-medium text-sm truncate">{entity.name}</p>
                  </div>
                  <p className="text-[10px] text-muted-foreground mb-2">
                    {entity.entity_type} • {entity.state || "No state"}
                  </p>
                  <div className="h-1.5 rounded-full bg-muted overflow-hidden">
                    <div
                      className="h-full rounded-full bg-primary transition-all duration-500"
                      style={{ width: `${getProgress(entity)}%` }}
                    />
                  </div>
                  <p className="text-[10px] text-muted-foreground mt-1">{getProgress(entity)}% complete</p>
                </motion.button>
              ))
            )}
          </div>

          {/* Right: Formation checklist */}
          {selectedEntity && (
            <div className="lg:col-span-2">
              <EntityDetail
                entity={selectedEntity}
                onToggleStep={(key) => toggleStep(selectedEntity.id, key)}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

/* ─── Entity Detail Panel ─── */
function EntityDetail({
  entity,
  onToggleStep,
}: {
  entity: EntityRow;
  onToggleStep: (key: string) => void;
}) {
  const completedCount = Object.values(entity.formation_steps).filter(Boolean).length;
  const progress = Math.round((completedCount / FORMATION_STEPS.length) * 100);

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      className="space-y-4"
    >
      {/* Entity header */}
      <div className="p-5 rounded-xl border border-border bg-card">
        <div className="flex items-center justify-between mb-3">
          <div>
            <h2 className="font-heading text-lg font-bold">{entity.name}</h2>
            <p className="text-xs text-muted-foreground">
              {entity.entity_type} • {entity.state || "State TBD"} • {entity.ein ? `EIN: ${entity.ein}` : "No EIN yet"}
            </p>
          </div>
          <span className={cn(
            "text-xs px-3 py-1 rounded-full font-medium",
            entity.status === "formed" ? "bg-green-500/10 text-green-500" :
            entity.status === "in_progress" ? "bg-primary/10 text-primary" :
            "bg-muted text-muted-foreground"
          )}>
            {entity.status === "formed" ? "✅ Formed" :
             entity.status === "in_progress" ? "🔨 In Progress" : "📋 Planned"}
          </span>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex-1 h-2 rounded-full bg-muted overflow-hidden">
            <motion.div
              className="h-full rounded-full bg-primary"
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
            />
          </div>
          <span className="text-xs font-mono text-primary font-bold">{completedCount}/{FORMATION_STEPS.length}</span>
        </div>
      </div>

      {/* Steps */}
      <div className="space-y-2">
        {FORMATION_STEPS.map((step, i) => {
          const isDone = entity.formation_steps[step.key];
          const externalLink = step.link || (step.getLink ? step.getLink(entity.state || "") : null);
          const internalLink = (step as any).internalLink;

          return (
            <motion.div
              key={step.key}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.03 }}
              className={cn(
                "p-4 rounded-xl border transition-all",
                isDone
                  ? "border-primary/30 bg-primary/5"
                  : "border-border bg-card hover:border-primary/20"
              )}
            >
              <div className="flex items-start gap-3">
                {/* Checkbox */}
                <button
                  onClick={() => onToggleStep(step.key)}
                  className={cn(
                    "mt-0.5 w-6 h-6 rounded-full border-2 flex items-center justify-center shrink-0 transition-colors",
                    isDone ? "border-primary bg-primary" : "border-muted-foreground/30 hover:border-primary/50"
                  )}
                >
                  {isDone && <CheckCircle className="w-4 h-4 text-primary-foreground" />}
                  {!isDone && <span className="text-[10px] text-muted-foreground font-bold">{i + 1}</span>}
                </button>

                <div className="flex-1 min-w-0">
                  <p className={cn("font-medium text-sm", isDone && "line-through text-muted-foreground")}>
                    {step.label}
                  </p>
                  <p className="text-xs text-muted-foreground mt-0.5">{step.description}</p>

                  {step.tip && (
                    <div className="mt-2 flex items-start gap-1.5 text-[10px] text-muted-foreground bg-muted/30 rounded-lg p-2">
                      <Info className="w-3 h-3 mt-0.5 shrink-0" />
                      <span>{step.tip}</span>
                    </div>
                  )}

                  {step.cost && (
                    <p className="text-[10px] text-primary mt-1 font-medium">💰 {step.cost}</p>
                  )}

                  {/* Action links */}
                  <div className="flex flex-wrap gap-2 mt-2">
                    {externalLink && (
                      <a
                        href={externalLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-xs font-medium text-primary hover:underline"
                      >
                        <ExternalLink className="w-3 h-3" />
                        {step.linkLabel}
                      </a>
                    )}
                    {internalLink && (
                      <Link
                        to={internalLink}
                        className="inline-flex items-center gap-1 text-xs font-medium text-secondary hover:underline"
                      >
                        <FileText className="w-3 h-3" />
                        {step.linkLabel}
                      </Link>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Completion message */}
      {progress === 100 && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="p-6 rounded-xl border-2 border-primary bg-gradient-to-br from-primary/10 to-accent/5 text-center"
        >
          <CheckCircle className="w-10 h-10 text-primary mx-auto mb-2" />
          <h3 className="font-heading text-lg font-bold">Entity Fully Formed! 🎉</h3>
          <p className="text-xs text-muted-foreground mt-1 max-w-sm mx-auto">
            {entity.name} is set up and ready to do business. Head to Credit Empire to start building business credit.
          </p>
          <Link to="/empire/credit" className="mt-3 inline-flex items-center gap-1 text-sm font-medium text-primary hover:underline">
            Build Business Credit <ArrowRight className="w-4 h-4" />
          </Link>
        </motion.div>
      )}

      {/* Disclaimer */}
      <div className="p-3 rounded-xl bg-muted/20 border border-border">
        <p className="text-[9px] text-muted-foreground leading-relaxed">
          <strong>DISCLAIMER:</strong> AI KOACHED provides links to official government filing sites for your convenience. 
          We do not file on your behalf. Filing fees are paid directly to the state. 
          We recommend consulting a licensed attorney for complex structures.
        </p>
      </div>
    </motion.div>
  );
}
