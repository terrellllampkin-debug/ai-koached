import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { useState, useEffect } from "react";
import {
  Search, Globe, Star, ShieldCheck, Store, Filter,
  MapPin, Briefcase, ExternalLink, ChevronRight, Users, Plus,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/empire/community")({
  head: () => ({
    meta: [
      { title: "Business Community — AI KOACHED" },
      { name: "description", content: "Browse verified businesses, find B2B partners, and shop from fellow entrepreneurs." },
    ],
  }),
  component: CommunityPage,
});

interface BusinessProfile {
  id: string;
  user_id: string;
  business_name: string;
  description: string | null;
  country: string;
  city: string | null;
  industry: string | null;
  services_offered: string[] | null;
  website_url: string | null;
  logo_url: string | null;
  is_verified: boolean;
  created_at: string;
}

const COUNTRIES = [
  "All", "US", "UK", "CA", "NG", "GH", "AE", "IN", "AU", "DE", "FR", "BR", "MX", "KE", "ZA", "JM", "TT",
];

const INDUSTRIES = [
  "All", "Technology", "E-Commerce", "Consulting", "Marketing", "Real Estate",
  "Health & Wellness", "Food & Beverage", "Finance", "Education", "Creative Services",
  "Construction", "Transportation", "Beauty & Fashion", "Legal Services", "Other",
];

function CommunityPage() {
  const { user, isAuthenticated } = useAuth();
  const [businesses, setBusinesses] = useState<BusinessProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [countryFilter, setCountryFilter] = useState("All");
  const [industryFilter, setIndustryFilter] = useState("All");
  const [myProfile, setMyProfile] = useState<BusinessProfile | null>(null);

  useEffect(() => {
    loadBusinesses();
    if (user) loadMyProfile();
  }, [user]);

  async function loadBusinesses() {
    const { data } = await supabase
      .from("business_profiles")
      .select("*")
      .order("is_verified", { ascending: false })
      .order("created_at", { ascending: false });
    if (data) setBusinesses(data as BusinessProfile[]);
    setLoading(false);
  }

  async function loadMyProfile() {
    if (!user) return;
    const { data } = await supabase
      .from("business_profiles")
      .select("*")
      .eq("user_id", user.id)
      .single();
    if (data) setMyProfile(data as BusinessProfile);
  }

  const filtered = businesses.filter((b) => {
    if (search && !b.business_name.toLowerCase().includes(search.toLowerCase()) &&
        !b.description?.toLowerCase().includes(search.toLowerCase()) &&
        !b.industry?.toLowerCase().includes(search.toLowerCase())) return false;
    if (countryFilter !== "All" && b.country !== countryFilter) return false;
    if (industryFilter !== "All" && b.industry !== industryFilter) return false;
    return true;
  });

  if (!isAuthenticated) return null;

  return (
    <div className="min-h-screen bg-background text-foreground p-6 lg:p-8">
      {/* Header */}
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="font-heading text-2xl lg:text-3xl font-bold flex items-center gap-3">
              <Users className="w-7 h-7 text-primary" />
              B2B Community
            </h1>
            <p className="text-sm text-muted-foreground mt-1">
              Browse verified businesses • Find partners • Shop B2B
            </p>
          </div>
          <div className="flex gap-2">
            {!myProfile ? (
              <Link to="/empire/ai-workers">
                <Button className="gap-2 text-sm">
                  <Plus className="w-4 h-4" />
                  Create Business Profile
                </Button>
              </Link>
            ) : (
              <Link to={`/empire/community/${myProfile.id}` as string}>
                <Button variant="outline" className="gap-2 text-sm">
                  <Store className="w-4 h-4" />
                  My Shop
                </Button>
              </Link>
            )}
          </div>
        </div>

        {/* Filters */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search businesses..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10"
            />
          </div>
          <select
            value={countryFilter}
            onChange={(e) => setCountryFilter(e.target.value)}
            className="h-9 rounded-md border border-input bg-background px-3 text-sm"
          >
            {COUNTRIES.map((c) => (
              <option key={c} value={c}>{c === "All" ? "🌍 All Countries" : c}</option>
            ))}
          </select>
          <select
            value={industryFilter}
            onChange={(e) => setIndustryFilter(e.target.value)}
            className="h-9 rounded-md border border-input bg-background px-3 text-sm"
          >
            {INDUSTRIES.map((i) => (
              <option key={i} value={i}>{i === "All" ? "📋 All Industries" : i}</option>
            ))}
          </select>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          {[
            { label: "Total Businesses", value: businesses.length, icon: Store },
            { label: "Verified", value: businesses.filter(b => b.is_verified).length, icon: ShieldCheck },
            { label: "Countries", value: [...new Set(businesses.map(b => b.country))].length, icon: Globe },
          ].map((stat) => (
            <div key={stat.label} className="bg-card border border-border rounded-xl p-4 flex items-center gap-3">
              <stat.icon className="w-5 h-5 text-primary" />
              <div>
                <p className="font-heading text-lg font-bold">{stat.value}</p>
                <p className="text-[10px] text-muted-foreground">{stat.label}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Business Grid */}
        {loading ? (
          <div className="text-center py-20">
            <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto" />
            <p className="text-sm text-muted-foreground mt-3">Loading community...</p>
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-20 bg-card/50 rounded-2xl border border-border">
            <Store className="w-12 h-12 text-muted-foreground/30 mx-auto mb-4" />
            <h3 className="font-heading text-lg font-bold mb-2">No businesses found</h3>
            <p className="text-sm text-muted-foreground mb-4">
              {businesses.length === 0
                ? "Be the first to create a business profile!"
                : "Try adjusting your filters."}
            </p>
            <Link to="/empire/ai-workers">
              <Button className="gap-2">
                <Plus className="w-4 h-4" />
                Create Your Profile with AI
              </Button>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filtered.map((biz, i) => (
              <motion.div
                key={biz.id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.03 }}
              >
                <Link to={`/empire/community/${biz.id}` as string} className="block">
                  <div className="bg-card border border-border rounded-xl p-5 hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5 transition-all group cursor-pointer">
                    <div className="flex items-start gap-3 mb-3">
                      <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                        {biz.logo_url ? (
                          <img src={biz.logo_url} alt="" className="w-10 h-10 rounded-lg object-cover" />
                        ) : (
                          <Store className="w-5 h-5 text-primary" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-1.5">
                          <h3 className="font-heading text-sm font-bold truncate group-hover:text-primary transition-colors">
                            {biz.business_name}
                          </h3>
                          {biz.is_verified && (
                            <ShieldCheck className="w-4 h-4 text-primary shrink-0" />
                          )}
                        </div>
                        <div className="flex items-center gap-2 text-[10px] text-muted-foreground mt-0.5">
                          <span className="flex items-center gap-0.5">
                            <MapPin className="w-3 h-3" />
                            {biz.city ? `${biz.city}, ${biz.country}` : biz.country}
                          </span>
                          {biz.industry && (
                            <span className="flex items-center gap-0.5">
                              <Briefcase className="w-3 h-3" />
                              {biz.industry}
                            </span>
                          )}
                        </div>
                      </div>
                      <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors shrink-0 mt-1" />
                    </div>
                    {biz.description && (
                      <p className="text-xs text-muted-foreground line-clamp-2 mb-3">
                        {biz.description}
                      </p>
                    )}
                    {biz.services_offered && biz.services_offered.length > 0 && (
                      <div className="flex flex-wrap gap-1">
                        {biz.services_offered.slice(0, 3).map((s) => (
                          <span key={s} className="text-[9px] px-2 py-0.5 rounded-full bg-primary/10 text-primary font-medium">
                            {s}
                          </span>
                        ))}
                        {biz.services_offered.length > 3 && (
                          <span className="text-[9px] px-2 py-0.5 rounded-full bg-muted text-muted-foreground">
                            +{biz.services_offered.length - 3}
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
