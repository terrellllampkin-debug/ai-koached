import { createFileRoute } from "@tanstack/react-router";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { useState, useEffect } from "react";
import { CalendarCheck, Plus, Check, AlertTriangle, Clock, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/empire/compliance")({
  head: () => ({
    meta: [
      { title: "Compliance Calendar — AI KOACHED" },
      { name: "description", content: "Track every business filing deadline, tax date, and license renewal." },
    ],
  }),
  component: CompliancePage,
});

interface Deadline {
  id: string;
  title: string;
  description: string | null;
  deadline_date: string;
  category: string;
  country: string;
  is_completed: boolean;
}

const CATEGORY_COLORS: Record<string, string> = {
  filing: "bg-blue-500/20 text-blue-400",
  tax: "bg-red-500/20 text-red-400",
  license: "bg-green-500/20 text-green-400",
  renewal: "bg-yellow-500/20 text-yellow-400",
  compliance: "bg-purple-500/20 text-purple-400",
};

function CompliancePage() {
  const { user, isAuthenticated } = useAuth();
  const [deadlines, setDeadlines] = useState<Deadline[]>([]);
  const [showAdd, setShowAdd] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newDate, setNewDate] = useState("");
  const [newCategory, setNewCategory] = useState("filing");
  const [newCountry, setNewCountry] = useState("US");

  useEffect(() => {
    if (!user) return;
    supabase
      .from("compliance_deadlines")
      .select("id, title, description, deadline_date, category, country, is_completed")
      .eq("user_id", user.id)
      .order("deadline_date", { ascending: true })
      .then(({ data }) => {
        if (data) setDeadlines(data);
      });
  }, [user]);

  const addDeadline = async () => {
    if (!user || !newTitle.trim() || !newDate) return;
    const { data, error } = await supabase
      .from("compliance_deadlines")
      .insert({ user_id: user.id, title: newTitle, deadline_date: newDate, category: newCategory, country: newCountry })
      .select()
      .single();
    if (data && !error) {
      setDeadlines((prev) => [...prev, data].sort((a, b) => a.deadline_date.localeCompare(b.deadline_date)));
      setNewTitle("");
      setNewDate("");
      setShowAdd(false);
    }
  };

  const toggleComplete = async (id: string, current: boolean) => {
    await supabase.from("compliance_deadlines").update({ is_completed: !current }).eq("id", id);
    setDeadlines((prev) => prev.map((d) => (d.id === id ? { ...d, is_completed: !current } : d)));
  };

  const deleteDeadline = async (id: string) => {
    await supabase.from("compliance_deadlines").delete().eq("id", id);
    setDeadlines((prev) => prev.filter((d) => d.id !== id));
  };

  if (!isAuthenticated) return null;

  const today = new Date().toISOString().split("T")[0];
  const upcoming = deadlines.filter((d) => !d.is_completed && d.deadline_date >= today);
  const overdue = deadlines.filter((d) => !d.is_completed && d.deadline_date < today);
  const completed = deadlines.filter((d) => d.is_completed);

  return (
    <div className="min-h-screen bg-background text-foreground p-6 max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
            <CalendarCheck className="w-6 h-6 text-primary" />
          </div>
          <div>
            <h1 className="font-heading text-2xl font-bold">Compliance Calendar</h1>
            <p className="text-sm text-muted-foreground">Never miss a filing deadline, tax date, or license renewal</p>
          </div>
        </div>
        <Button onClick={() => setShowAdd(!showAdd)} className="gap-2">
          <Plus className="w-4 h-4" /> Add Deadline
        </Button>
      </div>

      {/* Tip */}
      <div className="mb-6 p-4 rounded-xl bg-accent/5 border border-accent/20">
        <p className="text-sm text-accent">
          💡 <strong>Tip:</strong> Go to <strong>AI Workers → Compliance Coach</strong> and tell it your business details. It will generate ALL your deadlines automatically for the next 12 months.
        </p>
      </div>

      {/* Add form */}
      {showAdd && (
        <div className="mb-6 p-4 rounded-xl bg-card border border-border space-y-3">
          <Input placeholder="Deadline title (e.g., Annual Report Filing)" value={newTitle} onChange={(e) => setNewTitle(e.target.value)} />
          <div className="flex gap-3">
            <Input type="date" value={newDate} onChange={(e) => setNewDate(e.target.value)} className="flex-1" />
            <select value={newCategory} onChange={(e) => setNewCategory(e.target.value)} className="rounded-lg bg-muted px-3 py-2 text-sm border border-border">
              <option value="filing">Filing</option>
              <option value="tax">Tax</option>
              <option value="license">License</option>
              <option value="renewal">Renewal</option>
              <option value="compliance">Compliance</option>
            </select>
            <Input placeholder="Country" value={newCountry} onChange={(e) => setNewCountry(e.target.value)} className="w-24" />
          </div>
          <Button onClick={addDeadline} className="w-full">Add to Calendar</Button>
        </div>
      )}

      {/* Overdue */}
      {overdue.length > 0 && (
        <section className="mb-8">
          <div className="flex items-center gap-2 mb-3">
            <AlertTriangle className="w-4 h-4 text-destructive" />
            <h2 className="font-heading text-lg font-bold text-destructive">Overdue ({overdue.length})</h2>
          </div>
          <div className="space-y-2">
            {overdue.map((d) => (
              <DeadlineCard key={d.id} deadline={d} onToggle={toggleComplete} onDelete={deleteDeadline} isOverdue />
            ))}
          </div>
        </section>
      )}

      {/* Upcoming */}
      <section className="mb-8">
        <div className="flex items-center gap-2 mb-3">
          <Clock className="w-4 h-4 text-primary" />
          <h2 className="font-heading text-lg font-bold">Upcoming ({upcoming.length})</h2>
        </div>
        {upcoming.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground">
            <CalendarCheck className="w-12 h-12 mx-auto mb-3 opacity-30" />
            <p className="text-sm">No upcoming deadlines. Use <strong>Compliance Coach</strong> to generate your calendar.</p>
          </div>
        ) : (
          <div className="space-y-2">
            {upcoming.map((d) => (
              <DeadlineCard key={d.id} deadline={d} onToggle={toggleComplete} onDelete={deleteDeadline} />
            ))}
          </div>
        )}
      </section>

      {/* Completed */}
      {completed.length > 0 && (
        <section>
          <div className="flex items-center gap-2 mb-3">
            <Check className="w-4 h-4 text-green-500" />
            <h2 className="font-heading text-lg font-bold text-muted-foreground">Completed ({completed.length})</h2>
          </div>
          <div className="space-y-2 opacity-60">
            {completed.map((d) => (
              <DeadlineCard key={d.id} deadline={d} onToggle={toggleComplete} onDelete={deleteDeadline} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}

function DeadlineCard({
  deadline,
  onToggle,
  onDelete,
  isOverdue,
}: {
  deadline: Deadline;
  onToggle: (id: string, current: boolean) => void;
  onDelete: (id: string) => void;
  isOverdue?: boolean;
}) {
  const daysUntil = Math.ceil((new Date(deadline.deadline_date).getTime() - Date.now()) / 86400000);
  const urgencyText = isOverdue
    ? `${Math.abs(daysUntil)} days overdue`
    : daysUntil === 0
      ? "Today!"
      : daysUntil <= 7
        ? `${daysUntil} days left`
        : `${daysUntil} days`;

  return (
    <div className={cn("flex items-center gap-3 p-3 rounded-xl border transition-colors", isOverdue ? "bg-destructive/5 border-destructive/30" : "bg-card border-border")}>
      <button
        onClick={() => onToggle(deadline.id, deadline.is_completed)}
        className={cn(
          "w-6 h-6 rounded-full border-2 flex items-center justify-center shrink-0 transition-colors",
          deadline.is_completed ? "bg-green-500 border-green-500" : "border-muted-foreground/30 hover:border-primary"
        )}
      >
        {deadline.is_completed && <Check className="w-3 h-3 text-white" />}
      </button>
      <div className="flex-1 min-w-0">
        <p className={cn("text-sm font-medium", deadline.is_completed && "line-through text-muted-foreground")}>{deadline.title}</p>
        <div className="flex items-center gap-2 mt-0.5">
          <span className={cn("text-[10px] font-mono uppercase px-1.5 py-0.5 rounded", CATEGORY_COLORS[deadline.category] || "bg-muted text-muted-foreground")}>
            {deadline.category}
          </span>
          <span className="text-[10px] text-muted-foreground">{deadline.country}</span>
        </div>
      </div>
      <div className="text-right shrink-0">
        <p className={cn("text-xs font-mono", isOverdue ? "text-destructive font-bold" : daysUntil <= 7 ? "text-yellow-500" : "text-muted-foreground")}>
          {urgencyText}
        </p>
        <p className="text-[10px] text-muted-foreground">{new Date(deadline.deadline_date).toLocaleDateString()}</p>
      </div>
      <button onClick={() => onDelete(deadline.id)} className="text-muted-foreground/30 hover:text-destructive transition-colors">
        <Trash2 className="w-3.5 h-3.5" />
      </button>
    </div>
  );
}
