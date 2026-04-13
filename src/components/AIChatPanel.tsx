import { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Send, Sparkles, Coins } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";

const agentProfiles: Record<string, { name: string; specialty: string; color: string; emoji: string }> = {
  max_credit: { name: "Max Credit", specialty: "Personal Credit Specialist", color: "#D4AF37", emoji: "💳" },
  biz_credit: { name: "Biz Builder Brock", specialty: "Business Credit Specialist", color: "#2196F3", emoji: "🏢" },
  credit_repair: { name: "Fix-It Frankie", specialty: "Credit Repair Specialist", color: "#E53935", emoji: "🔧" },
  empire_eva: { name: "Empire Eva", specialty: "Entity Formation Expert", color: "#7F77DD", emoji: "🏛️" },
  revenue_rex: { name: "Revenue Rex", specialty: "Revenue Growth Strategist", color: "#4CAF50", emoji: "💰" },
  koach_coin: { name: "KOACHed Coin", specialty: "$KOACHED Token Advisor", color: "#FF9800", emoji: "🪙" },
};

interface Message {
  role: "user" | "assistant";
  content: string;
}

interface AIChatPanelProps {
  agent: string;
  onClose: () => void;
}

const CHAT_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/chat`;

export function AIChatPanel({ agent, onClose }: AIChatPanelProps) {
  const profile = agentProfiles[agent] || agentProfiles.max_credit;
  const { user, session } = useAuth();
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content: `Hey CEO! I'm ${profile.name}, your ${profile.specialty}. How can I help you build your empire today?`,
    },
  ]);
  const [input, setInput] = useState("");
  const [isStreaming, setIsStreaming] = useState(false);
  const [koachEarned, setKoachEarned] = useState(0);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = useCallback(async () => {
    if (!input.trim() || isStreaming) return;

    const userMessage = input.trim();
    setInput("");
    const userMsg: Message = { role: "user", content: userMessage };
    setMessages((prev) => [...prev, userMsg]);
    setIsStreaming(true);

    if (user) {
      supabase.from("chat_messages").insert({
        user_id: user.id,
        agent,
        role: "user",
        content: userMessage,
      }).then(() => {});
    }

    let assistantSoFar = "";

    try {
      const resp = await fetch(CHAT_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
        },
        body: JSON.stringify({
          messages: [...messages, userMsg].map((m) => ({
            role: m.role,
            content: m.content,
          })),
          agent,
        }),
      });

      if (!resp.ok || !resp.body) {
        const errData = await resp.json().catch(() => ({ error: "Failed to connect" }));
        setMessages((prev) => [
          ...prev,
          { role: "assistant", content: `⚠️ ${errData.error || "Something went wrong. Try again."}` },
        ]);
        setIsStreaming(false);
        return;
      }

      const reader = resp.body.getReader();
      const decoder = new TextDecoder();
      let textBuffer = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        textBuffer += decoder.decode(value, { stream: true });

        let newlineIndex: number;
        while ((newlineIndex = textBuffer.indexOf("\n")) !== -1) {
          let line = textBuffer.slice(0, newlineIndex);
          textBuffer = textBuffer.slice(newlineIndex + 1);

          if (line.endsWith("\r")) line = line.slice(0, -1);
          if (line.startsWith(":") || line.trim() === "") continue;
          if (!line.startsWith("data: ")) continue;

          const jsonStr = line.slice(6).trim();
          if (jsonStr === "[DONE]") break;

          try {
            const parsed = JSON.parse(jsonStr);
            const content = parsed.choices?.[0]?.delta?.content as string | undefined;
            if (content) {
              assistantSoFar += content;
              setMessages((prev) => {
                const last = prev[prev.length - 1];
                if (last?.role === "assistant" && prev.length > 1 && last.content !== messages[0]?.content) {
                  return prev.map((m, i) =>
                    i === prev.length - 1 ? { ...m, content: assistantSoFar } : m
                  );
                }
                return [...prev, { role: "assistant", content: assistantSoFar }];
              });
            }
          } catch {
            textBuffer = line + "\n" + textBuffer;
            break;
          }
        }
      }

      if (user && assistantSoFar) {
        supabase.from("chat_messages").insert({
          user_id: user.id,
          agent,
          role: "assistant",
          content: assistantSoFar,
        }).then(() => {});

        setKoachEarned((prev) => prev + 5);
      }
    } catch (e) {
      console.error("Stream error:", e);
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: "⚠️ Connection error. Please try again." },
      ]);
    } finally {
      setIsStreaming(false);
    }
  }, [input, isStreaming, messages, agent, user, session]);

  return (
    <AnimatePresence>
      <motion.div
        initial={{ x: 400, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        exit={{ x: 400, opacity: 0 }}
        transition={{ type: "spring", damping: 25, stiffness: 200 }}
        className="absolute right-0 top-0 bottom-0 w-full max-w-md z-30 flex flex-col bg-background/95 backdrop-blur-xl border-l border-border"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-border">
          <div className="flex items-center gap-3">
            <div
              className="w-10 h-10 rounded-full flex items-center justify-center text-lg"
              style={{ backgroundColor: profile.color + "20" }}
            >
              {profile.emoji}
            </div>
            <div>
              <h3 className="text-sm font-heading font-semibold" style={{ color: profile.color }}>
                {profile.name}
              </h3>
              <p className="text-[10px] text-muted-foreground">{profile.specialty}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {koachEarned > 0 && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="flex items-center gap-1 bg-primary/10 rounded-full px-2 py-1"
              >
                <Coins className="w-3 h-3 text-primary" />
                <span className="text-[10px] font-mono font-bold text-primary">+{koachEarned}</span>
              </motion.div>
            )}
            <Button variant="ghost" size="icon" onClick={onClose} className="h-8 w-8">
              <X className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((msg, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-[85%] rounded-xl px-4 py-2.5 text-sm leading-relaxed ${
                  msg.role === "user"
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted text-foreground"
                }`}
              >
                {msg.content}
              </div>
            </motion.div>
          ))}
          {isStreaming && messages[messages.length - 1]?.role !== "assistant" && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex justify-start"
            >
              <div className="bg-muted rounded-xl px-4 py-2.5 flex items-center gap-2">
                <Sparkles className="w-3.5 h-3.5 text-primary animate-pulse" />
                <span className="text-sm text-muted-foreground">Thinking...</span>
              </div>
            </motion.div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div className="p-4 border-t border-border">
          <div className="flex items-center gap-2">
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSend()}
              placeholder={`Ask ${profile.name}...`}
              className="bg-muted border-border"
              disabled={isStreaming}
            />
            <Button
              size="icon"
              onClick={handleSend}
              disabled={!input.trim() || isStreaming}
              className="bg-primary text-primary-foreground hover:bg-primary/90 shrink-0"
            >
              <Send className="w-4 h-4" />
            </Button>
          </div>
          <p className="mt-2 text-[10px] text-muted-foreground text-center">
            +5 $KOACHED per interaction • Powered by AI
          </p>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
