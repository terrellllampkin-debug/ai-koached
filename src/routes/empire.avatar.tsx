import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { AvatarPreview, defaultAvatarConfig } from "@/components/3d/Avatar3D";
import type { AvatarConfig } from "@/components/3d/Avatar3D";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  User, Palette, Scissors, Shirt, Gem,
  Save, Check, Crown, Lock,
} from "lucide-react";

export const Route = createFileRoute("/empire/avatar")({
  head: () => ({
    meta: [
      { title: "Avatar Creator — AI KOACHED" },
      { name: "description", content: "Create your 3D business avatar for the AI KOACHED empire." },
    ],
  }),
  component: AvatarPage,
});

/* ─── Options ─── */
const skinTones = [
  { value: "#FFDBB4", label: "Light" },
  { value: "#E8B88A", label: "Medium Light" },
  { value: "#C68642", label: "Medium" },
  { value: "#8D5524", label: "Medium Dark" },
  { value: "#5C3317", label: "Dark" },
  { value: "#3B1E0E", label: "Deep" },
];

const hairStyles: { value: AvatarConfig["hairStyle"]; label: string }[] = [
  { value: "buzz", label: "Buzz Cut" },
  { value: "short", label: "Short" },
  { value: "medium", label: "Medium" },
  { value: "long", label: "Long" },
  { value: "afro", label: "Afro" },
  { value: "braids", label: "Braids" },
  { value: "none", label: "Bald" },
];

const hairColors = [
  { value: "#1a1a1a", label: "Black" },
  { value: "#4a3728", label: "Dark Brown" },
  { value: "#8B4513", label: "Brown" },
  { value: "#B8860B", label: "Golden" },
  { value: "#D4AF37", label: "Blonde" },
  { value: "#8B0000", label: "Auburn" },
  { value: "#808080", label: "Gray" },
  { value: "#FFFFFF", label: "White" },
];

const bodyTypes: { value: AvatarConfig["bodyType"]; label: string }[] = [
  { value: "slim", label: "Slim" },
  { value: "average", label: "Average" },
  { value: "athletic", label: "Athletic" },
  { value: "broad", label: "Broad" },
];

const outfits: { value: AvatarConfig["outfit"]; label: string; tier: string }[] = [
  { value: "casual", label: "Casual", tier: "free" },
  { value: "streetwear", label: "Streetwear", tier: "free" },
  { value: "tech", label: "Tech", tier: "free" },
  { value: "business_suit", label: "Business Suit", tier: "starter" },
  { value: "creative", label: "Creative", tier: "builder" },
  { value: "executive", label: "Executive", tier: "empire" },
];

const outfitColors = [
  { value: "#1a1a2e", label: "Navy" },
  { value: "#2d2d2d", label: "Charcoal" },
  { value: "#1a1a1a", label: "Black" },
  { value: "#4a2c2a", label: "Burgundy" },
  { value: "#2e4a3a", label: "Forest" },
  { value: "#D4AF37", label: "Gold" },
  { value: "#7F77DD", label: "Purple" },
  { value: "#FFFFFF", label: "White" },
];

const accessories: { value: AvatarConfig["accessory"]; label: string; icon: string }[] = [
  { value: "none", label: "None", icon: "—" },
  { value: "glasses", label: "Glasses", icon: "👓" },
  { value: "watch", label: "Gold Watch", icon: "⌚" },
  { value: "chain", label: "Chain", icon: "📿" },
  { value: "hat", label: "Hat", icon: "🎩" },
];

type Tab = "body" | "hair" | "outfit" | "accessories";

/* ─── Page ─── */
function AvatarPage() {
  const { user, isAuthenticated } = useAuth();
  const [config, setConfig] = useState<AvatarConfig>(defaultAvatarConfig);
  const [activeTab, setActiveTab] = useState<Tab>("body");
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [userTier, setUserTier] = useState("free");

  // Load existing avatar config
  useEffect(() => {
    if (!user) return;
    supabase
      .from("profiles")
      .select("avatar_config, tier")
      .eq("user_id", user.id)
      .single()
      .then(({ data }) => {
        if (data?.avatar_config && typeof data.avatar_config === "object" && Object.keys(data.avatar_config as object).length > 0) {
          setConfig({ ...defaultAvatarConfig, ...(data.avatar_config as Partial<AvatarConfig>) });
        }
        if (data?.tier) setUserTier(data.tier);
      });
  }, [user]);

  const updateConfig = (partial: Partial<AvatarConfig>) => {
    setConfig((prev) => ({ ...prev, ...partial }));
    setSaved(false);
  };

  const handleSave = async () => {
    if (!user) return;
    setSaving(true);
    await supabase
      .from("profiles")
      .update({ avatar_config: config as unknown as Record<string, unknown> })
      .eq("user_id", user.id);
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const tierLevel: Record<string, number> = { free: 0, starter: 1, builder: 2, empire: 3, dynasty: 4 };
  const canUseOutfit = (tier: string) => tierLevel[userTier] >= (tierLevel[tier] || 0);

  if (!isAuthenticated) return null;

  const tabs: { key: Tab; label: string; icon: typeof User }[] = [
    { key: "body", label: "Body", icon: User },
    { key: "hair", label: "Hair", icon: Scissors },
    { key: "outfit", label: "Outfit", icon: Shirt },
    { key: "accessories", label: "Extras", icon: Gem },
  ];

  return (
    <div className="min-h-screen p-6 md:p-10 max-w-6xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl md:text-3xl font-heading font-bold flex items-center gap-2">
          <User className="w-6 h-6 text-primary" />
          Avatar Creator
        </h1>
        <p className="text-sm text-muted-foreground">Create your 3D business avatar for the empire</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 3D Preview */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="rounded-xl border border-border bg-card overflow-hidden"
        >
          <AvatarPreview config={config} height="450px" />
          <div className="p-4 border-t border-border flex items-center justify-between">
            <p className="text-xs text-muted-foreground">Drag to rotate • Your avatar appears in the empire</p>
            <Button
              onClick={handleSave}
              disabled={saving || saved}
              className={cn(
                "gap-2",
                saved ? "bg-success text-success-foreground" : "bg-primary text-primary-foreground"
              )}
              size="sm"
            >
              {saved ? (
                <>
                  <Check className="w-4 h-4" /> Saved!
                </>
              ) : saving ? (
                "Saving..."
              ) : (
                <>
                  <Save className="w-4 h-4" /> Save Avatar
                </>
              )}
            </Button>
          </div>
        </motion.div>

        {/* Customization Panel */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="rounded-xl border border-border bg-card"
        >
          {/* Tabs */}
          <div className="flex border-b border-border">
            {tabs.map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={cn(
                  "flex-1 flex items-center justify-center gap-2 py-3 text-sm font-medium transition-colors",
                  activeTab === tab.key
                    ? "text-primary border-b-2 border-primary"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                <tab.icon className="w-4 h-4" />
                <span className="hidden sm:inline">{tab.label}</span>
              </button>
            ))}
          </div>

          <div className="p-5 space-y-5">
            {/* Body Tab */}
            {activeTab === "body" && (
              <>
                <div>
                  <label className="text-sm font-medium mb-3 block">Body Type</label>
                  <div className="grid grid-cols-4 gap-2">
                    {bodyTypes.map((bt) => (
                      <button
                        key={bt.value}
                        onClick={() => updateConfig({ bodyType: bt.value })}
                        className={cn(
                          "p-3 rounded-lg border text-xs font-medium text-center transition-all",
                          config.bodyType === bt.value
                            ? "border-primary bg-primary/10 text-primary"
                            : "border-border hover:border-primary/30"
                        )}
                      >
                        {bt.label}
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium mb-3 block">Skin Tone</label>
                  <div className="flex gap-2 flex-wrap">
                    {skinTones.map((st) => (
                      <button
                        key={st.value}
                        onClick={() => updateConfig({ skinTone: st.value })}
                        className={cn(
                          "w-10 h-10 rounded-full border-2 transition-all hover:scale-110",
                          config.skinTone === st.value
                            ? "border-primary ring-2 ring-primary/30 scale-110"
                            : "border-border"
                        )}
                        style={{ backgroundColor: st.value }}
                        title={st.label}
                      />
                    ))}
                  </div>
                </div>
              </>
            )}

            {/* Hair Tab */}
            {activeTab === "hair" && (
              <>
                <div>
                  <label className="text-sm font-medium mb-3 block">Hairstyle</label>
                  <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                    {hairStyles.map((hs) => (
                      <button
                        key={hs.value}
                        onClick={() => updateConfig({ hairStyle: hs.value })}
                        className={cn(
                          "p-3 rounded-lg border text-xs font-medium text-center transition-all",
                          config.hairStyle === hs.value
                            ? "border-primary bg-primary/10 text-primary"
                            : "border-border hover:border-primary/30"
                        )}
                      >
                        {hs.label}
                      </button>
                    ))}
                  </div>
                </div>
                {config.hairStyle !== "none" && (
                  <div>
                    <label className="text-sm font-medium mb-3 block">Hair Color</label>
                    <div className="flex gap-2 flex-wrap">
                      {hairColors.map((hc) => (
                        <button
                          key={hc.value}
                          onClick={() => updateConfig({ hairColor: hc.value })}
                          className={cn(
                            "w-9 h-9 rounded-full border-2 transition-all hover:scale-110",
                            config.hairColor === hc.value
                              ? "border-primary ring-2 ring-primary/30 scale-110"
                              : "border-border"
                          )}
                          style={{ backgroundColor: hc.value }}
                          title={hc.label}
                        />
                      ))}
                    </div>
                  </div>
                )}
              </>
            )}

            {/* Outfit Tab */}
            {activeTab === "outfit" && (
              <>
                <div>
                  <label className="text-sm font-medium mb-3 block">Outfit Style</label>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {outfits.map((o) => {
                      const locked = !canUseOutfit(o.tier);
                      return (
                        <button
                          key={o.value}
                          onClick={() => !locked && updateConfig({ outfit: o.value })}
                          disabled={locked}
                          className={cn(
                            "relative p-3 rounded-lg border text-xs font-medium text-center transition-all",
                            locked && "opacity-50 cursor-not-allowed",
                            config.outfit === o.value
                              ? "border-primary bg-primary/10 text-primary"
                              : "border-border hover:border-primary/30"
                          )}
                        >
                          {o.label}
                          {locked && (
                            <div className="absolute top-1 right-1">
                              <Lock className="w-3 h-3 text-muted-foreground" />
                            </div>
                          )}
                          {o.tier !== "free" && (
                            <div className="mt-1 flex items-center justify-center gap-1">
                              <Crown className="w-3 h-3 text-primary" />
                              <span className="text-[10px] text-muted-foreground capitalize">{o.tier}+</span>
                            </div>
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium mb-3 block">Outfit Color</label>
                  <div className="flex gap-2 flex-wrap">
                    {outfitColors.map((oc) => (
                      <button
                        key={oc.value}
                        onClick={() => updateConfig({ outfitColor: oc.value })}
                        className={cn(
                          "w-9 h-9 rounded-full border-2 transition-all hover:scale-110",
                          config.outfitColor === oc.value
                            ? "border-primary ring-2 ring-primary/30 scale-110"
                            : "border-border"
                        )}
                        style={{ backgroundColor: oc.value }}
                        title={oc.label}
                      />
                    ))}
                  </div>
                </div>
              </>
            )}

            {/* Accessories Tab */}
            {activeTab === "accessories" && (
              <div>
                <label className="text-sm font-medium mb-3 block">Accessory</label>
                <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
                  {accessories.map((a) => (
                    <button
                      key={a.value}
                      onClick={() => updateConfig({ accessory: a.value })}
                      className={cn(
                        "p-3 rounded-lg border text-center transition-all",
                        config.accessory === a.value
                          ? "border-primary bg-primary/10"
                          : "border-border hover:border-primary/30"
                      )}
                    >
                      <span className="text-xl block mb-1">{a.icon}</span>
                      <span className="text-xs font-medium">{a.label}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </motion.div>
      </div>

      {/* Tier unlock note */}
      <div className="mt-6 p-4 rounded-xl border border-primary/20 bg-primary/5 text-center">
        <p className="text-sm text-muted-foreground">
          👔 Upgrade your membership to unlock premium outfits like <strong className="text-primary">Executive</strong> and <strong className="text-primary">Creative</strong>
        </p>
      </div>
    </div>
  );
}
