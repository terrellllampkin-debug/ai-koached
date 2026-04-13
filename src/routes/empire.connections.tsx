import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import {
  Plug, Mail, MessageSquare, Phone, Shield,
  FileText, BarChart3, Bell, CheckCircle, ExternalLink,
  ArrowRight, Zap, Globe,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/empire/connections")({
  head: () => ({
    meta: [
      { title: "Connections & Integrations — AI KOACHED" },
      { name: "description", content: "Connect third-party tools to supercharge your business operations." },
    ],
  }),
  component: ConnectionsPage,
});

interface Connection {
  id: string;
  name: string;
  description: string;
  icon: typeof Mail;
  category: "communication" | "analytics" | "security" | "productivity" | "marketing";
  status: "available" | "coming_soon";
  features: string[];
}

const CONNECTIONS: Connection[] = [
  {
    id: "resend",
    name: "Email (Resend)",
    description: "Send transactional emails — welcome messages, receipts, dispute confirmations, and milestone alerts to your members.",
    icon: Mail,
    category: "communication",
    status: "available",
    features: ["Welcome emails", "Dispute status updates", "Revenue milestone alerts", "Credit score change notifications"],
  },
  {
    id: "twilio",
    name: "SMS Alerts (Twilio)",
    description: "Send SMS notifications for critical business updates — credit changes, entity approvals, revenue milestones, and security alerts.",
    icon: Phone,
    category: "communication",
    status: "available",
    features: ["Credit alert SMS", "Entity filing updates", "Revenue milestone texts", "Security notifications"],
  },
  {
    id: "slack",
    name: "Slack Notifications",
    description: "Get business updates in your Slack workspace — new B2B orders, community activity, grant deadlines, and AI worker completions.",
    icon: MessageSquare,
    category: "communication",
    status: "available",
    features: ["B2B order notifications", "Community activity", "Grant deadline alerts", "AI worker task completions"],
  },
  {
    id: "hubspot",
    name: "CRM (HubSpot)",
    description: "Sync your B2B community contacts and business interactions to HubSpot for advanced customer relationship management.",
    icon: BarChart3,
    category: "marketing",
    status: "available",
    features: ["Contact sync", "Deal tracking", "B2B interaction history", "Sales pipeline"],
  },
  {
    id: "elevenlabs",
    name: "Voice AI (ElevenLabs)",
    description: "Give your AI workers a voice — text-to-speech for coaching sessions, business plan presentations, and accessibility.",
    icon: Zap,
    category: "productivity",
    status: "available",
    features: ["AI coach voice calls", "Business plan narration", "Accessibility support", "Voice notifications"],
  },
  {
    id: "firecrawl",
    name: "Web Scraping (Firecrawl)",
    description: "Automatically research competitors, scrape grant databases, monitor industry news, and find B2B leads for your business.",
    icon: Globe,
    category: "analytics",
    status: "available",
    features: ["Competitor research", "Grant database scanning", "Industry news monitoring", "B2B lead generation"],
  },
  {
    id: "aikido",
    name: "Security Scanning (Aikido)",
    description: "Continuous security scanning for your business website and applications. Protect your customers and stay compliant.",
    icon: Shield,
    category: "security",
    status: "available",
    features: ["Vulnerability scanning", "Compliance checks", "Security alerts", "Penetration testing"],
  },
  {
    id: "contentful",
    name: "Content Management",
    description: "Manage blog posts, landing pages, and marketing content for your business using a powerful headless CMS.",
    icon: FileText,
    category: "marketing",
    status: "coming_soon",
    features: ["Blog management", "Landing pages", "SEO content", "Marketing campaigns"],
  },
];

const CATEGORIES = [
  { key: "all", label: "All" },
  { key: "communication", label: "📡 Communication" },
  { key: "analytics", label: "📊 Analytics" },
  { key: "marketing", label: "📢 Marketing" },
  { key: "productivity", label: "⚡ Productivity" },
  { key: "security", label: "🔒 Security" },
];

function ConnectionsPage() {
  const [category, setCategory] = useState("all");

  const filtered = category === "all"
    ? CONNECTIONS
    : CONNECTIONS.filter((c) => c.category === category);

  return (
    <div className="min-h-screen bg-background text-foreground p-6 lg:p-8">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="font-heading text-2xl lg:text-3xl font-bold flex items-center gap-3">
            <Plug className="w-7 h-7 text-primary" />
            Connections & Integrations
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Connect third-party tools to supercharge your business operations
          </p>
        </div>

        {/* Category filter */}
        <div className="flex flex-wrap gap-2 mb-8">
          {CATEGORIES.map((cat) => (
            <button
              key={cat.key}
              onClick={() => setCategory(cat.key)}
              className={cn(
                "px-3 py-1.5 rounded-lg text-xs font-medium transition-all",
                category === cat.key
                  ? "bg-primary text-primary-foreground"
                  : "bg-card border border-border text-muted-foreground hover:text-foreground"
              )}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Connections grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filtered.map((conn) => (
            <div
              key={conn.id}
              className={cn(
                "bg-card border border-border rounded-xl p-6 transition-all",
                conn.status === "available" ? "hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5" : "opacity-60"
              )}
            >
              <div className="flex items-start gap-3 mb-3">
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                  <conn.icon className="w-5 h-5 text-primary" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <h3 className="font-heading text-sm font-bold">{conn.name}</h3>
                    {conn.status === "coming_soon" && (
                      <span className="text-[9px] px-2 py-0.5 rounded-full bg-muted text-muted-foreground font-medium">
                        Coming Soon
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">{conn.description}</p>
                </div>
              </div>

              <div className="space-y-1 mb-4">
                {conn.features.map((f) => (
                  <div key={f} className="flex items-center gap-1.5 text-[10px] text-muted-foreground">
                    <CheckCircle className="w-3 h-3 text-primary/60" />
                    {f}
                  </div>
                ))}
              </div>

              {conn.status === "available" ? (
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full gap-1 text-xs"
                >
                  <Plug className="w-3 h-3" />
                  Connect
                  <ArrowRight className="w-3 h-3" />
                </Button>
              ) : (
                <Button variant="ghost" size="sm" className="w-full text-xs" disabled>
                  <Bell className="w-3 h-3 mr-1" />
                  Notify Me
                </Button>
              )}
            </div>
          ))}
        </div>

        {/* Help section */}
        <div className="mt-12 p-6 rounded-2xl bg-card border border-border text-center">
          <h3 className="font-heading text-base font-bold mb-2">Need a different integration?</h3>
          <p className="text-xs text-muted-foreground mb-4">
            We're constantly adding new connections. Let your AI workers know what tools you use and we'll prioritize them.
          </p>
          <div className="flex flex-wrap justify-center gap-2 text-[10px] text-muted-foreground">
            <span className="px-2 py-1 rounded bg-muted">Zapier</span>
            <span className="px-2 py-1 rounded bg-muted">QuickBooks</span>
            <span className="px-2 py-1 rounded bg-muted">Mailchimp</span>
            <span className="px-2 py-1 rounded bg-muted">Google Workspace</span>
            <span className="px-2 py-1 rounded bg-muted">Calendly</span>
            <span className="px-2 py-1 rounded bg-muted">Notion</span>
          </div>
        </div>
      </div>
    </div>
  );
}
