import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { useState, useEffect } from "react";
import { ArrowLeft, Building2, Plus, FileText, CheckCircle, Clock, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export const Route = createFileRoute("/empire/entity")({
  head: () => ({
    meta: [
      { title: "Entity Builder — AI KOACHED" },
      { name: "description", content: "Form LLCs, Corps, and Trusts to build your corporate structure." },
    ],
  }),
  component: EntityPage,
});

const entityTypes = ["LLC", "S-Corp", "C-Corp", "Trust", "Sole Proprietorship"];
const states = ["Delaware", "Wyoming", "Nevada", "Texas", "Florida", "New Mexico", "California", "New York"];

function EntityPage() {
  const { user, isAuthenticated } = useAuth();
  const [entities, setEntities] = useState<Array<{ id: string; name: string; entity_type: string; state: string | null; ein: string | null; status: string; formed_at: string | null }>>([]);
  const [showForm, setShowForm] = useState(false);
  const [newName, setNewName] = useState("");
  const [newType, setNewType] = useState("");
  const [newState, setNewState] = useState("");

  useEffect(() => {
    if (!user) return;
    supabase.from("entities").select("*").eq("user_id", user.id).order("created_at", { ascending: false })
      .then(({ data }) => { if (data) setEntities(data); });
  }, [user]);

  const handleCreate = async () => {
    if (!user || !newName || !newType) return;
    const { data } = await supabase.from("entities").insert({
      user_id: user.id,
      name: newName,
      entity_type: newType,
      state: newState || null,
      status: "planned",
    }).select().single();
    if (data) {
      setEntities((prev) => [data, ...prev]);
      setShowForm(false);
      setNewName("");
      setNewType("");
      setNewState("");
    }
  };

  if (!isAuthenticated) return null;

  const statusIcon = (status: string) => {
    if (status === "formed") return <CheckCircle className="w-4 h-4 text-success" />;
    if (status === "in_progress") return <Clock className="w-4 h-4 text-primary" />;
    return <AlertCircle className="w-4 h-4 text-muted-foreground" />;
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="font-heading text-2xl font-bold flex items-center gap-2">
              <Building2 className="w-6 h-6 text-secondary" />
              Entity Builder
            </h1>
            <p className="text-sm text-muted-foreground">Form and track your business entities</p>
          </div>
          <Button onClick={() => setShowForm(true)} className="bg-primary text-primary-foreground gap-1">
            <Plus className="w-4 h-4" /> New Entity
          </Button>
        </div>

        {showForm && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            className="mb-6 p-6 rounded-xl border border-primary/30 bg-card"
          >
            <h3 className="font-heading font-semibold mb-4">Create New Entity</h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <Input placeholder="Entity name" value={newName} onChange={(e) => setNewName(e.target.value)} className="bg-background" />
              <Select value={newType} onValueChange={setNewType}>
                <SelectTrigger className="bg-background"><SelectValue placeholder="Entity type" /></SelectTrigger>
                <SelectContent>
                  {entityTypes.map((t) => <SelectItem key={t} value={t}>{t}</SelectItem>)}
                </SelectContent>
              </Select>
              <Select value={newState} onValueChange={setNewState}>
                <SelectTrigger className="bg-background"><SelectValue placeholder="State" /></SelectTrigger>
                <SelectContent>
                  {states.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div className="flex gap-2 mt-4">
              <Button onClick={handleCreate} className="bg-primary text-primary-foreground">Create</Button>
              <Button variant="ghost" onClick={() => setShowForm(false)}>Cancel</Button>
            </div>
          </motion.div>
        )}

        <div className="space-y-3">
          {entities.length === 0 && !showForm ? (
            <div className="text-center py-16">
              <Building2 className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">No entities yet. Click "New Entity" to start building your corporate structure.</p>
            </div>
          ) : (
            entities.map((entity) => (
              <motion.div
                key={entity.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center justify-between p-4 rounded-xl border border-border bg-card hover:border-primary/30 transition-colors"
              >
                <div className="flex items-center gap-3">
                  {statusIcon(entity.status)}
                  <div>
                    <p className="font-medium">{entity.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {entity.entity_type} • {entity.state || "No state"} • {entity.ein ? `EIN: ${entity.ein}` : "No EIN"}
                    </p>
                  </div>
                </div>
                <span className={`text-xs px-2 py-1 rounded-full ${
                  entity.status === "formed" ? "bg-success/10 text-success" :
                  entity.status === "in_progress" ? "bg-primary/10 text-primary" :
                  "bg-muted text-muted-foreground"
                }`}>
                  {entity.status}
                </span>
              </motion.div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
