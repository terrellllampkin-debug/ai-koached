import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Send, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const agentProfiles: Record<string, { name: string; specialty: string; color: string; emoji: string }> = {
  max_credit: { name: "Max Credit", specialty: "Credit Empire Specialist", color: "#D4AF37", emoji: "💳" },
  empire_eva: { name: "Empire Eva", specialty: "Entity Formation Expert", color: "#7F77DD", emoji: "🏛️" },
  revenue_rex: { name: "Revenue Rex", specialty: "Revenue Growth Strategist", color: "#4CAF50", emoji: "💰" },
  koach_coin: { name: "Koach Coin", specialty: "$KOACH Token Advisor", color: "#FF9800", emoji: "🪙" },
};

interface Message {
  role: "user" | "assistant";
  content: string;
}

interface AIChatPanelProps {
  agent: string;
  onClose: () => void;
}

export function AIChatPanel({ agent, onClose }: AIChatPanelProps) {
  const profile = agentProfiles[agent] || agentProfiles.max_credit;
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content: `Hey CEO! I'm ${profile.name}, your ${profile.specialty}. How can I help you build your empire today?`,
    },
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isTyping) return;

    const userMessage = input.trim();
    setInput("");
    setMessages((prev) => [...prev, { role: "user", content: userMessage }]);
    setIsTyping(true);

    // Placeholder response — will be replaced with Lovable AI Gateway
    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: `Great question! As ${profile.name}, I'm here to help you with ${profile.specialty.toLowerCase()}. The AI Gateway integration is coming next — then I'll give you real strategic advice! 🚀`,
        },
      ]);
      setIsTyping(false);
    }, 1500);
  };

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
          <Button variant="ghost" size="icon" onClick={onClose} className="h-8 w-8">
            <X className="w-4 h-4" />
          </Button>
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
                className={`max-w-[80%] rounded-xl px-4 py-2.5 text-sm leading-relaxed ${
                  msg.role === "user"
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted text-foreground"
                }`}
              >
                {msg.content}
              </div>
            </motion.div>
          ))}
          {isTyping && (
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
            />
            <Button
              size="icon"
              onClick={handleSend}
              disabled={!input.trim() || isTyping}
              className="bg-primary text-primary-foreground hover:bg-primary/90 shrink-0"
            >
              <Send className="w-4 h-4" />
            </Button>
          </div>
          <p className="mt-2 text-[10px] text-muted-foreground text-center">
            +5 $KOACH per interaction • AI-powered guidance
          </p>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
