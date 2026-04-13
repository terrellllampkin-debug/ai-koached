import { createFileRoute } from "@tanstack/react-router";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Upload, FileText, AlertTriangle, CheckCircle2, Download,
  Trash2, Shield, Loader2, ChevronDown, ChevronUp, Copy, Search,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/empire/credit-scanner")({
  head: () => ({
    meta: [
      { title: "Credit Report Scanner — AI KOACHED" },
      { name: "description", content: "Upload your credit report and AI auto-scans for errors, generates dispute letters." },
    ],
  }),
  component: CreditScannerPage,
});

interface DisputeLetter {
  id: string;
  bureau: string;
  account_name: string;
  error_type: string;
  error_description: string;
  letter_content: string;
  status: string;
  created_at: string;
}

interface AnalysisResult {
  errors: Array<{
    bureau: string;
    account_name: string;
    error_type: string;
    error_description: string;
    dispute_letter: string;
  }>;
  summary: {
    total_errors: number;
    high_priority: number;
    estimated_score_impact: string;
    recommendations: string[];
  };
}

function CreditScannerPage() {
  const { user, isAuthenticated } = useAuth();
  const [uploading, setUploading] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);
  const [analysis, setAnalysis] = useState<AnalysisResult | null>(null);
  const [letters, setLetters] = useState<DisputeLetter[]>([]);
  const [expandedLetter, setExpandedLetter] = useState<string | null>(null);
  const [dragOver, setDragOver] = useState(false);
  const [copied, setCopied] = useState<string | null>(null);
  const [error, setError] = useState("");

  // Load existing dispute letters
  useEffect(() => {
    if (!user) return;
    supabase
      .from("dispute_letters")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
      .then(({ data }) => {
        if (data) setLetters(data as DisputeLetter[]);
      });
  }, [user]);

  const extractTextFromFile = async (file: File): Promise<string> => {
    // For text files, read directly
    if (file.type === "text/plain" || file.name.endsWith(".txt")) {
      return await file.text();
    }
    // For PDF or other files, read as text (basic extraction)
    // The AI can work with raw text content
    const text = await file.text();
    // Clean up binary content but keep readable text
    return text.replace(/[^\x20-\x7E\n\r\t]/g, " ").replace(/\s{3,}/g, "\n");
  };

  const handleUpload = useCallback(async (file: File) => {
    if (!user) return;
    setError("");

    // Validate file
    const validTypes = ["application/pdf", "text/plain", "text/html"];
    const maxSize = 10 * 1024 * 1024; // 10MB

    if (!validTypes.includes(file.type) && !file.name.endsWith(".txt") && !file.name.endsWith(".pdf")) {
      setError("Please upload a PDF or text file of your credit report");
      return;
    }
    if (file.size > maxSize) {
      setError("File too large. Maximum 10MB.");
      return;
    }

    setUploading(true);
    setAnalyzing(false);
    setAnalysis(null);

    try {
      // Upload to storage
      const filePath = `${user.id}/${Date.now()}-${file.name}`;
      const { error: uploadErr } = await supabase.storage
        .from("credit-reports")
        .upload(filePath, file);

      if (uploadErr) {
        setError("Upload failed: " + uploadErr.message);
        setUploading(false);
        return;
      }

      setUploading(false);
      setAnalyzing(true);

      // Extract text
      const reportText = await extractTextFromFile(file);

      if (reportText.length < 50) {
        setError("Could not extract enough text from the file. Try uploading a text version of your credit report.");
        setAnalyzing(false);
        return;
      }

      // Send to analysis
      const { data: sessionData } = await supabase.auth.getSession();
      const resp = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/analyze-credit-report`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${sessionData.session?.access_token}`,
          },
          body: JSON.stringify({ reportText }),
        }
      );

      if (!resp.ok) {
        const err = await resp.json().catch(() => ({ error: "Analysis failed" }));
        setError(err.error || "Analysis failed");
        setAnalyzing(false);
        return;
      }

      const result = await resp.json();
      setAnalysis(result);

      // Reload letters from DB
      const { data: newLetters } = await supabase
        .from("dispute_letters")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });
      if (newLetters) setLetters(newLetters as DisputeLetter[]);

    } catch (err) {
      setError("Something went wrong. Please try again.");
    }
    setAnalyzing(false);
  }, [user]);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file) handleUpload(file);
  }, [handleUpload]);

  const handleFileInput = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleUpload(file);
  }, [handleUpload]);

  const copyLetter = (id: string, content: string) => {
    navigator.clipboard.writeText(content);
    setCopied(id);
    setTimeout(() => setCopied(null), 2000);
  };

  const downloadLetter = (letter: DisputeLetter) => {
    const blob = new Blob([letter.letter_content], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `dispute-${letter.bureau}-${letter.account_name.replace(/\s+/g, "-")}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const deleteLetter = async (id: string) => {
    await supabase.from("dispute_letters").delete().eq("id", id);
    setLetters((prev) => prev.filter((l) => l.id !== id));
  };

  if (!isAuthenticated) return null;

  const bureauColor: Record<string, string> = {
    Experian: "#0033A0",
    Equifax: "#C41230",
    TransUnion: "#00AEEF",
    Unknown: "#888",
  };

  return (
    <div className="min-h-screen bg-background text-foreground p-6">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 rounded-xl bg-destructive/10 flex items-center justify-center">
            <Search className="w-6 h-6 text-destructive" />
          </div>
          <div>
            <h1 className="font-heading text-xl font-bold">Credit Report Scanner</h1>
            <p className="text-sm text-muted-foreground">
              Upload your report → AI scans for errors → Get dispute letters in seconds
            </p>
          </div>
        </div>

        {/* Upload Zone */}
        <div
          onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
          onDragLeave={() => setDragOver(false)}
          onDrop={handleDrop}
          className={cn(
            "relative border-2 border-dashed rounded-2xl p-10 text-center transition-all mb-8 cursor-pointer",
            dragOver
              ? "border-primary bg-primary/5 scale-[1.01]"
              : "border-border hover:border-primary/50 hover:bg-muted/30",
            (uploading || analyzing) && "pointer-events-none opacity-60"
          )}
          onClick={() => {
            if (!uploading && !analyzing) {
              document.getElementById("credit-file-input")?.click();
            }
          }}
        >
          <input
            id="credit-file-input"
            type="file"
            accept=".pdf,.txt,.html"
            onChange={handleFileInput}
            className="hidden"
          />

          {uploading ? (
            <div className="flex flex-col items-center gap-3">
              <Loader2 className="w-10 h-10 animate-spin text-primary" />
              <p className="font-semibold">Uploading report...</p>
            </div>
          ) : analyzing ? (
            <div className="flex flex-col items-center gap-3">
              <Loader2 className="w-10 h-10 animate-spin text-accent" />
              <p className="font-semibold">AI is scanning your report for errors...</p>
              <p className="text-sm text-muted-foreground">This may take 30-60 seconds</p>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-3">
              <Upload className="w-10 h-10 text-muted-foreground" />
              <p className="font-semibold">Drop your credit report here</p>
              <p className="text-sm text-muted-foreground">
                PDF or TXT • Max 10MB • Your data is encrypted and private
              </p>
              <Button variant="outline" size="sm" className="mt-2 gap-2">
                <FileText className="w-4 h-4" />
                Choose File
              </Button>
            </div>
          )}
        </div>

        {error && (
          <div className="mb-6 p-4 rounded-xl bg-destructive/10 border border-destructive/30 text-destructive text-sm flex items-start gap-2">
            <AlertTriangle className="w-4 h-4 mt-0.5 shrink-0" />
            {error}
          </div>
        )}

        {/* Analysis Results */}
        <AnimatePresence>
          {analysis && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-8"
            >
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
                <div className="p-4 rounded-xl bg-card border border-border">
                  <p className="text-2xl font-bold text-destructive">{analysis.summary.total_errors}</p>
                  <p className="text-xs text-muted-foreground">Errors Found</p>
                </div>
                <div className="p-4 rounded-xl bg-card border border-border">
                  <p className="text-2xl font-bold text-accent">{analysis.summary.high_priority}</p>
                  <p className="text-xs text-muted-foreground">High Priority</p>
                </div>
                <div className="p-4 rounded-xl bg-card border border-border col-span-2">
                  <p className="text-lg font-bold text-primary">{analysis.summary.estimated_score_impact}</p>
                  <p className="text-xs text-muted-foreground">Estimated Impact if Corrected</p>
                </div>
              </div>

              {analysis.summary.recommendations && analysis.summary.recommendations.length > 0 && (
                <div className="p-4 rounded-xl bg-primary/5 border border-primary/20 mb-6">
                  <h3 className="font-semibold text-sm mb-2 flex items-center gap-2">
                    <Shield className="w-4 h-4 text-primary" />
                    Recommendations
                  </h3>
                  <ul className="space-y-1">
                    {analysis.summary.recommendations.map((rec, i) => (
                      <li key={i} className="text-sm text-muted-foreground flex items-start gap-2">
                        <CheckCircle2 className="w-3 h-3 mt-1 text-primary shrink-0" />
                        {rec}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Dispute Letters */}
        {letters.length > 0 && (
          <div>
            <h2 className="font-heading text-lg font-bold mb-4 flex items-center gap-2">
              <FileText className="w-5 h-5 text-primary" />
              Your Dispute Letters ({letters.length})
            </h2>

            <div className="space-y-3">
              {letters.map((letter) => (
                <motion.div
                  key={letter.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="rounded-xl border border-border bg-card overflow-hidden"
                >
                  <button
                    onClick={() => setExpandedLetter(expandedLetter === letter.id ? null : letter.id)}
                    className="w-full flex items-center gap-3 p-4 text-left hover:bg-muted/30 transition-colors"
                  >
                    <div
                      className="w-3 h-3 rounded-full shrink-0"
                      style={{ backgroundColor: bureauColor[letter.bureau] || "#888" }}
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold truncate">{letter.account_name}</p>
                      <p className="text-xs text-muted-foreground">
                        {letter.bureau} • {letter.error_type}
                      </p>
                    </div>
                    <span className={cn(
                      "text-[10px] font-mono px-2 py-0.5 rounded-full",
                      letter.status === "sent" ? "bg-green-500/20 text-green-500" : "bg-accent/20 text-accent"
                    )}>
                      {letter.status.toUpperCase()}
                    </span>
                    {expandedLetter === letter.id ? (
                      <ChevronUp className="w-4 h-4 text-muted-foreground" />
                    ) : (
                      <ChevronDown className="w-4 h-4 text-muted-foreground" />
                    )}
                  </button>

                  <AnimatePresence>
                    {expandedLetter === letter.id && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="overflow-hidden"
                      >
                        <div className="px-4 pb-4 border-t border-border pt-3">
                          <p className="text-xs text-muted-foreground mb-2">{letter.error_description}</p>
                          <div className="bg-muted/30 rounded-lg p-4 text-xs font-mono leading-relaxed whitespace-pre-wrap max-h-80 overflow-y-auto mb-3">
                            {letter.letter_content}
                          </div>
                          <div className="flex gap-2">
                            <Button
                              size="sm"
                              variant="outline"
                              className="gap-1 text-xs"
                              onClick={() => copyLetter(letter.id, letter.letter_content)}
                            >
                              <Copy className="w-3 h-3" />
                              {copied === letter.id ? "Copied!" : "Copy"}
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              className="gap-1 text-xs"
                              onClick={() => downloadLetter(letter)}
                            >
                              <Download className="w-3 h-3" />
                              Download
                            </Button>
                            <Button
                              size="sm"
                              variant="ghost"
                              className="gap-1 text-xs text-destructive hover:text-destructive ml-auto"
                              onClick={() => deleteLetter(letter.id)}
                            >
                              <Trash2 className="w-3 h-3" />
                            </Button>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              ))}
            </div>
          </div>
        )}

        {/* Compliance Notice */}
        <div className="mt-8 p-4 rounded-xl bg-muted/20 border border-border">
          <p className="text-[10px] text-muted-foreground leading-relaxed">
            <strong>DISCLAIMER:</strong> AI KOACHED provides document preparation and credit education services only. 
            We do not guarantee specific credit score improvements. Dispute letters are generated using 2026 FCRA-compliant 
            templates. We recommend reviewing each letter before sending. You have the right to dispute inaccurate 
            information on your credit report under the Fair Credit Reporting Act (15 U.S.C. §1681). 
            Billing occurs only after services are performed per CROA (15 U.S.C. §1679) and TSR (16 CFR Part 310).
          </p>
        </div>
      </div>
    </div>
  );
}
