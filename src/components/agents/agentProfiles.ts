import maxCreditImg from "@/assets/agents/max-credit.png";
import empireEvaImg from "@/assets/agents/empire-eva.png";
import revenueRexImg from "@/assets/agents/revenue-rex.png";
import koachCoinImg from "@/assets/agents/koach-coin.png";
import theArchitectImg from "@/assets/agents/the-architect.png";
import bizBuilderBrockImg from "@/assets/agents/biz-builder-brock.png";
import fixItFrankieImg from "@/assets/agents/fix-it-frankie.png";

export interface AgentProfile {
  name: string;
  specialty: string;
  color: string;
  emoji: string;
  image: string;
  gradient: string;
  description: string;
}

export const agentProfiles: Record<string, AgentProfile> = {
  ceo_coach: {
    name: "The Architect",
    specialty: "Master Business Builder",
    color: "#D4AF37",
    emoji: "🏗️",
    image: theArchitectImg,
    gradient: "linear-gradient(135deg, #1a1500 0%, #2d2000 50%, #0d0a00 100%)",
    description: "Interviews you, builds your full business plan, and dispatches AI workers",
  },
  max_credit: {
    name: "Max Credit",
    specialty: "Personal Credit Specialist",
    color: "#D4AF37",
    emoji: "💳",
    image: maxCreditImg,
    gradient: "linear-gradient(135deg, #1a0030 0%, #200040 50%, #0d0020 100%)",
    description: "Builds your personal credit profile and score to 800+",
  },
  biz_credit: {
    name: "Biz Builder Brock",
    specialty: "Business Credit Specialist",
    color: "#2196F3",
    emoji: "🏢",
    image: bizBuilderBrockImg,
    gradient: "linear-gradient(135deg, #001a33 0%, #002040 50%, #000d20 100%)",
    description: "Establishes D&B profile, Paydex score, vendor accounts",
  },
  credit_repair: {
    name: "Fix-It Frankie",
    specialty: "Credit Repair Specialist",
    color: "#E53935",
    emoji: "🔧",
    image: fixItFrankieImg,
    gradient: "linear-gradient(135deg, #1a0000 0%, #300000 50%, #1a0505 100%)",
    description: "Disputes errors, writes letters, restores your credit",
  },
  empire_eva: {
    name: "Empire Eva",
    specialty: "Entity Formation Expert",
    color: "#7F77DD",
    emoji: "🏛️",
    image: empireEvaImg,
    gradient: "linear-gradient(135deg, #0d0033 0%, #150050 50%, #0a0025 100%)",
    description: "Files entities in any country — US LLC, UK Ltd, UAE Free Zone & more",
  },
  revenue_rex: {
    name: "Revenue Rex",
    specialty: "Revenue Growth Strategist",
    color: "#4CAF50",
    emoji: "💰",
    image: revenueRexImg,
    gradient: "linear-gradient(135deg, #001a00 0%, #003000 50%, #001500 100%)",
    description: "Sets up payment processing, pricing, sales funnels",
  },
  koach_coin: {
    name: "KOACHed Coin",
    specialty: "$KOACHED Token Advisor",
    color: "#FF9800",
    emoji: "🪙",
    image: koachCoinImg,
    gradient: "linear-gradient(135deg, #1a0f00 0%, #2d1a00 50%, #1a1000 100%)",
    description: "Tracks your token earnings and utility",
  },
};
