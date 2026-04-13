import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { useState, useEffect } from "react";
import {
  Store, Star, ShieldCheck, MapPin, Globe, Mail, Phone,
  ArrowLeft, Briefcase, Package, Wrench, ExternalLink,
  MessageSquare, Send,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/empire/community/$businessId")({
  head: () => ({
    meta: [
      { title: "Business Shop — AI KOACHED" },
      { name: "description", content: "View business profile, products, and services." },
    ],
  }),
  component: BusinessShopPage,
});

interface Listing {
  id: string;
  title: string;
  description: string | null;
  price: number | null;
  currency: string;
  category: string | null;
  listing_type: string;
  images: string[] | null;
  is_active: boolean;
}

interface Review {
  id: string;
  reviewer_user_id: string;
  rating: number;
  review_text: string | null;
  created_at: string;
}

function BusinessShopPage() {
  const { businessId } = Route.useParams();
  const { user } = useAuth();
  const [profile, setProfile] = useState<any>(null);
  const [listings, setListings] = useState<Listing[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<"products" | "services" | "reviews">("services");
  const [reviewText, setReviewText] = useState("");
  const [reviewRating, setReviewRating] = useState(5);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    loadData();
  }, [businessId]);

  async function loadData() {
    setLoading(true);
    const [profileRes, listingsRes, reviewsRes] = await Promise.all([
      supabase.from("business_profiles").select("*").eq("id", businessId).single(),
      supabase.from("business_listings").select("*").eq("business_profile_id", businessId).eq("is_active", true),
      supabase.from("business_reviews").select("*").eq("business_profile_id", businessId).order("created_at", { ascending: false }),
    ]);
    if (profileRes.data) setProfile(profileRes.data);
    if (listingsRes.data) setListings(listingsRes.data as Listing[]);
    if (reviewsRes.data) setReviews(reviewsRes.data as Review[]);
    setLoading(false);
  }

  async function submitReview() {
    if (!user || !reviewText.trim()) return;
    setSubmitting(true);
    await supabase.from("business_reviews").insert({
      business_profile_id: businessId,
      reviewer_user_id: user.id,
      rating: reviewRating,
      review_text: reviewText.trim(),
    });
    setReviewText("");
    setReviewRating(5);
    loadData();
    setSubmitting(false);
  }

  const products = listings.filter((l) => l.listing_type === "product");
  const services = listings.filter((l) => l.listing_type === "service");
  const avgRating = reviews.length > 0 ? (reviews.reduce((s, r) => s + r.rating, 0) / reviews.length).toFixed(1) : null;

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center text-center">
        <div>
          <Store className="w-12 h-12 text-muted-foreground/30 mx-auto mb-4" />
          <h2 className="font-heading text-lg font-bold mb-2">Business not found</h2>
          <Link to="/empire/community">
            <Button variant="outline" className="gap-2">
              <ArrowLeft className="w-4 h-4" /> Back to Community
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground p-6 lg:p-8">
      <div className="max-w-5xl mx-auto">
        {/* Back */}
        <Link to="/empire/community" className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground mb-6">
          <ArrowLeft className="w-3 h-3" /> Back to Community
        </Link>

        {/* Profile Header */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-card border border-border rounded-2xl p-6 lg:p-8 mb-6"
        >
          <div className="flex items-start gap-4">
            <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center shrink-0">
              {profile.logo_url ? (
                <img src={profile.logo_url} alt="" className="w-14 h-14 rounded-xl object-cover" />
              ) : (
                <Store className="w-7 h-7 text-primary" />
              )}
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <h1 className="font-heading text-xl lg:text-2xl font-bold">{profile.business_name}</h1>
                {profile.is_verified && <ShieldCheck className="w-5 h-5 text-primary" />}
              </div>
              <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground mb-3">
                <span className="flex items-center gap-1">
                  <MapPin className="w-3 h-3" />
                  {profile.city ? `${profile.city}, ${profile.country}` : profile.country}
                </span>
                {profile.industry && (
                  <span className="flex items-center gap-1">
                    <Briefcase className="w-3 h-3" /> {profile.industry}
                  </span>
                )}
                {avgRating && (
                  <span className="flex items-center gap-1">
                    <Star className="w-3 h-3 text-primary fill-primary" /> {avgRating} ({reviews.length})
                  </span>
                )}
              </div>
              {profile.description && (
                <p className="text-sm text-muted-foreground mb-3">{profile.description}</p>
              )}
              {profile.services_offered && profile.services_offered.length > 0 && (
                <div className="flex flex-wrap gap-1 mb-3">
                  {profile.services_offered.map((s: string) => (
                    <span key={s} className="text-[10px] px-2 py-0.5 rounded-full bg-primary/10 text-primary font-medium">
                      {s}
                    </span>
                  ))}
                </div>
              )}
              <div className="flex gap-2">
                {profile.contact_email && (
                  <a href={`mailto:${profile.contact_email}`}>
                    <Button variant="outline" size="sm" className="gap-1 text-xs">
                      <Mail className="w-3 h-3" /> Email
                    </Button>
                  </a>
                )}
                {profile.website_url && (
                  <a href={profile.website_url} target="_blank" rel="noopener noreferrer">
                    <Button variant="outline" size="sm" className="gap-1 text-xs">
                      <ExternalLink className="w-3 h-3" /> Website
                    </Button>
                  </a>
                )}
              </div>
            </div>
          </div>
        </motion.div>

        {/* Tabs */}
        <div className="flex gap-1 mb-6 border-b border-border">
          {[
            { key: "services" as const, label: "Services", count: services.length, icon: Wrench },
            { key: "products" as const, label: "Products", count: products.length, icon: Package },
            { key: "reviews" as const, label: "Reviews", count: reviews.length, icon: MessageSquare },
          ].map((t) => (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              className={cn(
                "flex items-center gap-1.5 px-4 py-2.5 text-sm font-medium border-b-2 -mb-px transition-colors",
                tab === t.key
                  ? "border-primary text-primary"
                  : "border-transparent text-muted-foreground hover:text-foreground"
              )}
            >
              <t.icon className="w-4 h-4" />
              {t.label} ({t.count})
            </button>
          ))}
        </div>

        {/* Content */}
        {(tab === "services" || tab === "products") && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {(tab === "services" ? services : products).length === 0 ? (
              <div className="col-span-full text-center py-12 text-muted-foreground">
                <Package className="w-8 h-8 mx-auto mb-2 opacity-30" />
                <p className="text-sm">No {tab} listed yet.</p>
              </div>
            ) : (
              (tab === "services" ? services : products).map((item) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="bg-card border border-border rounded-xl p-5 hover:border-primary/20 transition-colors"
                >
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="font-heading text-sm font-bold">{item.title}</h3>
                    {item.price != null && (
                      <span className="text-sm font-bold text-primary font-mono">
                        {item.currency} {Number(item.price).toFixed(2)}
                      </span>
                    )}
                  </div>
                  {item.description && (
                    <p className="text-xs text-muted-foreground mb-2">{item.description}</p>
                  )}
                  {item.category && (
                    <span className="text-[9px] px-2 py-0.5 rounded-full bg-muted text-muted-foreground">
                      {item.category}
                    </span>
                  )}
                </motion.div>
              ))
            )}
          </div>
        )}

        {tab === "reviews" && (
          <div className="space-y-4">
            {/* Write review */}
            {user && profile.user_id !== user.id && (
              <div className="bg-card border border-border rounded-xl p-5">
                <h3 className="text-sm font-bold mb-3">Write a Review</h3>
                <div className="flex gap-1 mb-3">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <button key={s} onClick={() => setReviewRating(s)}>
                      <Star
                        className={cn(
                          "w-5 h-5 transition-colors",
                          s <= reviewRating ? "text-primary fill-primary" : "text-muted-foreground"
                        )}
                      />
                    </button>
                  ))}
                </div>
                <div className="flex gap-2">
                  <Input
                    value={reviewText}
                    onChange={(e) => setReviewText(e.target.value)}
                    placeholder="Share your experience..."
                    className="flex-1"
                  />
                  <Button onClick={submitReview} disabled={submitting || !reviewText.trim()} size="sm" className="gap-1">
                    <Send className="w-3 h-3" /> Submit
                  </Button>
                </div>
              </div>
            )}

            {reviews.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">
                <MessageSquare className="w-8 h-8 mx-auto mb-2 opacity-30" />
                <p className="text-sm">No reviews yet. Be the first!</p>
              </div>
            ) : (
              reviews.map((r) => (
                <div key={r.id} className="bg-card border border-border rounded-xl p-4">
                  <div className="flex items-center gap-1 mb-1">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        className={cn("w-3 h-3", i < r.rating ? "text-primary fill-primary" : "text-muted-foreground")}
                      />
                    ))}
                    <span className="text-[10px] text-muted-foreground ml-2">
                      {new Date(r.created_at).toLocaleDateString()}
                    </span>
                  </div>
                  {r.review_text && <p className="text-xs text-foreground">{r.review_text}</p>}
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
}
