import { createFileRoute } from "@tanstack/react-router";
import { useAuth } from "@/hooks/useAuth";
import { useState, useCallback } from "react";
import { motion } from "framer-motion";
import {
  FileText, Download, Loader2, Copy, CheckCircle2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/empire/documents")({
  head: () => ({
    meta: [
      { title: "Document Generator — AI KOACHED" },
      { name: "description", content: "Generate professional legal documents, contracts, and agreements instantly." },
    ],
  }),
  component: DocumentsPage,
});

const DOC_TYPES = [
  "Operating Agreement", "NDA (Mutual)", "NDA (One-Way)", "Service Agreement",
  "Employment Agreement", "Independent Contractor Agreement", "Partnership Agreement",
  "Terms of Service", "Privacy Policy", "Bylaws", "Articles of Incorporation",
  "Cease & Desist", "Non-Compete Agreement", "Consulting Agreement",
  "Shareholder Agreement", "Lease Agreement", "Buy-Sell Agreement",
];

function DocumentsPage() {
  const { user, isAuthenticated } = useAuth();
  const [selectedType, setSelectedType] = useState("");
  const [details, setDetails] = useState("");
  const [generating, setGenerating] = useState(false);
  const [document, setDocument] = useState("");
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState("");

  const handleGenerate = useCallback(async () => {
    if (!selectedType || !details.trim() || !user) return;
    setError("");
    setGenerating(true);
    setDocument("");

    try {
      const { data: sessionData } = await (await import("@/integrations/supabase/client")).supabase.auth.getSession();
      const resp = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/generate-document`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${sessionData.session?.access_token}`,
          },
          body: JSON.stringify({ documentType: selectedType, details: details.trim() }),
        }
      );

      if (!resp.ok) {
        const err = await resp.json().catch(() => ({ error: "Generation failed" }));
        setError(err.error || "Generation failed");
        setGenerating(false);
        return;
      }

      const result = await resp.json();
      setDocument(result.document || "");
    } catch {
      setError("Something went wrong. Please try again.");
    }
    setGenerating(false);
  }, [selectedType, details, user]);

  const copyDoc = () => {
    navigator.clipboard.writeText(document);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const downloadDoc = () => {
    const blob = new Blob([document], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = window.document.createElement("a");
    a.href = url;
    a.download = `${selectedType.replace(/\s+/g, "-").toLowerCase()}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  if (!isAuthenticated) return null;

  return (
    <div className="min-h-screen bg-background text-foreground p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 rounded-xl bg-secondary/10 flex items-center justify-center">
            <FileText className="w-6 h-6 text-secondary" />
          </div>
          <div>
            <h1 className="font-heading text-xl font-bold">Document Generator</h1>
            <p className="text-sm text-muted-foreground">
              Generate professional legal documents instantly — contracts, NDAs, agreements & more
            </p>
          </div>
        </div>

        {/* Document Type Selection */}
        <div className="mb-6">
          <label className="text-sm font-semibold mb-2 block">Choose Document Type</label>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {DOC_TYPES.map((type) => (
              <button
                key={type}
                onClick={() => setSelectedType(type)}
                className={cn(
                  "p-3 rounded-lg border text-xs font-medium text-left transition-all",
                  selectedType === type
                    ? "border-primary bg-primary/10 text-primary"
                    : "border-border hover:border-primary/50 hover:bg-muted/30"
                )}
              >
                {type}
              </button>
            ))}
          </div>
        </div>

        {/* Details Input */}
        {selectedType && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6"
          >
            <label className="text-sm font-semibold mb-2 block">
              Provide Details for Your {selectedType}
            </label>
            <textarea
              value={details}
              onChange={(e) => setDetails(e.target.value)}
              placeholder={`Example: This is for a marketing consulting business called "XYZ Marketing LLC" in Delaware. The parties are John Smith (Company) and Jane Doe (Client). Services include social media management, SEO, and content creation. Payment is $5,000/month. Contract term is 12 months.`}
              className="w-full h-32 rounded-xl border border-border bg-muted/20 p-4 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-primary/50"
              maxLength={5000}
            />
            <div className="flex justify-between items-center mt-2">
              <p className="text-[10px] text-muted-foreground">{details.length}/5000 characters</p>
              <Button
                onClick={handleGenerate}
                disabled={generating || !details.trim()}
                className="gap-2"
              >
                {generating ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    <FileText className="w-4 h-4" />
                    Generate Document
                  </>
                )}
              </Button>
            </div>
          </motion.div>
        )}

        {error && (
          <div className="mb-6 p-4 rounded-xl bg-destructive/10 border border-destructive/30 text-destructive text-sm">
            {error}
          </div>
        )}

        {/* Generated Document */}
        {document && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="flex items-center justify-between mb-3">
              <h2 className="font-heading text-base font-bold flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-primary" />
                Your {selectedType}
              </h2>
              <div className="flex gap-2">
                <Button size="sm" variant="outline" className="gap-1 text-xs" onClick={copyDoc}>
                  <Copy className="w-3 h-3" />
                  {copied ? "Copied!" : "Copy"}
                </Button>
                <Button size="sm" variant="outline" className="gap-1 text-xs" onClick={downloadDoc}>
                  <Download className="w-3 h-3" />
                  Download
                </Button>
              </div>
            </div>
            <div className="rounded-xl border border-border bg-card p-6 text-sm leading-relaxed whitespace-pre-wrap max-h-[600px] overflow-y-auto font-mono">
              {document}
            </div>
          </motion.div>
        )}

        {/* Compliance Notice */}
        <div className="mt-8 p-4 rounded-xl bg-muted/20 border border-border">
          <p className="text-[10px] text-muted-foreground leading-relaxed">
            <strong>DISCLAIMER:</strong> Documents generated by AI KOACHED are templates for educational purposes. 
            We recommend having a licensed attorney review all documents before execution. 
            AI KOACHED is not a law firm and does not provide legal advice.
          </p>
        </div>
      </div>
    </div>
  );
}
