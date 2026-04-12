import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { Shield, ChevronDown, Scale, CreditCard, Coins, BarChart3, DollarSign, Building2, FileText, HelpCircle } from "lucide-react";

export const Route = createFileRoute("/empire/legal")({
  head: () => ({
    meta: [
      { title: "Legal Disclosures & FAQ — AI KOACHED" },
      { name: "description", content: "AI KOACHED legal disclosures, CROA compliance, disclaimers, and frequently asked questions." },
    ],
  }),
  component: LegalPage,
});

/* ─── Accordion helper ───────────────────────────────── */
function Accordion({ title, children, defaultOpen = false }: { title: string; children: React.ReactNode; defaultOpen?: boolean }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="border border-border rounded-lg overflow-hidden">
      <button onClick={() => setOpen(!open)} className="w-full flex items-center justify-between p-4 text-left hover:bg-muted/30 transition-colors">
        <span className="font-medium text-sm">{title}</span>
        <ChevronDown className={cn("w-4 h-4 text-muted-foreground transition-transform", open && "rotate-180")} />
      </button>
      {open && <div className="px-4 pb-4 text-xs text-muted-foreground leading-relaxed space-y-3">{children}</div>}
    </div>
  );
}

/* ─── Page ───────────────────────────────────────────── */
function LegalPage() {
  const [tab, setTab] = useState<"disclosures" | "faq">("disclosures");

  return (
    <div className="min-h-screen p-6 md:p-10 max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl md:text-3xl font-heading font-bold flex items-center gap-2">
          <Scale className="w-6 h-6 text-primary" />
          Legal &amp; Disclosures
        </h1>
        <p className="text-sm text-muted-foreground mt-1">Last updated: April 2026 · Koach Bridge Holdings, Inc.</p>
      </div>

      {/* Tab toggle */}
      <div className="flex gap-2 mb-8">
        {(["disclosures", "faq"] as const).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={cn(
              "px-4 py-2 rounded-lg text-sm font-medium transition-all",
              tab === t ? "bg-primary text-primary-foreground" : "bg-card text-muted-foreground hover:text-foreground"
            )}
          >
            {t === "disclosures" ? "⚖️ Disclosures" : "❓ FAQ"}
          </button>
        ))}
      </div>

      {tab === "disclosures" && (
        <div className="space-y-4">
          {/* 1 — General */}
          <Accordion title="1. General Platform Disclaimer" defaultOpen>
            <p><strong>AI KOACHED</strong> is a business education, guidance, and AI-powered tools platform operated by Koach Bridge Holdings, Inc. ("Company," "we," "us," or "our").</p>
            <p><strong>No Professional Advice.</strong> The information, tools, AI agents, and content provided on AI KOACHED do not constitute legal, financial, tax, accounting, investment, or professional advice of any kind. All content is provided for educational and informational purposes only.</p>
            <p><strong>No Guarantees.</strong> Results vary significantly based on individual effort, business type, market conditions, economic factors, and other variables beyond our control. Any revenue figures, income projections, credit score improvements, grant approvals, or business milestones mentioned are examples only and are not typical results.</p>
            <p><strong>AI-Generated Content.</strong> AI KOACHED uses artificial intelligence to generate content, recommendations, documents, and guidance. AI-generated content may contain errors, inaccuracies, or omissions. All AI-generated content should be independently verified before relying on it for any business, legal, or financial decision.</p>
            <p><strong>Third-Party Services.</strong> AI KOACHED integrates with and recommends third-party services including but not limited to Stripe, Square, PayPal, Mercury, Alpaca Securities, and others. AI KOACHED does not control and is not responsible for the actions, terms, or availability of third-party services.</p>
            <p><strong>No Attorney-Client Relationship.</strong> Use of AI KOACHED does not create an attorney-client relationship. For legal matters, consult a licensed attorney in your jurisdiction.</p>
            <p><strong>No Accountant Relationship.</strong> Use of AI KOACHED does not create an accountant-client relationship. For tax and accounting matters, consult a licensed CPA or tax professional.</p>
          </Accordion>

          {/* 2 — CROA */}
          <Accordion title="2. CROA Required Disclosure — Consumer Credit File Rights">
            <p className="font-bold text-foreground">CONSUMER CREDIT FILE RIGHTS UNDER STATE AND FEDERAL LAW</p>
            <p>You have a right to dispute inaccurate information in your credit report by contacting the credit bureau directly. However, neither you nor any credit repair company or credit repair organization has the right to have accurate, current, and verifiable information removed from your credit report. The credit bureau must remove accurate, negative information from your report only if it is over 7 years old. Bankruptcy information can be reported for 10 years.</p>
            <p>You have a right to obtain a copy of your credit report from a credit bureau. You may be charged a reasonable fee. There is no fee, however, if you have been turned down for credit, employment, insurance, or a rental dwelling because of information in your credit report within the preceding 60 days. The credit bureau must provide someone to help you interpret the information in your credit report. You are entitled to receive a free copy of your credit report if you are unemployed and intend to apply for employment in the next 60 days, if you are a recipient of public welfare assistance, or if you have reason to believe that there is inaccurate information in your credit report due to fraud.</p>
            <p>You have a right to sue a credit repair organization that violates the Credit Repair Organizations Act. This law prohibits deceptive practices by credit repair organizations.</p>
            <p>You have the right to cancel your contract with any credit repair organization for any reason within 3 business days from the date you signed it.</p>
            <p><strong>Credit repair organizations are prohibited from:</strong></p>
            <ul className="list-disc pl-5 space-y-1">
              <li>Making false claims about their services</li>
              <li>Charging you until they have completed the promised services</li>
              <li>Performing any services until they have your signature on a written contract and have completed a 3-day waiting period</li>
            </ul>
            <div className="mt-3 p-3 rounded-lg bg-primary/5 border border-primary/20">
              <p className="font-bold text-foreground text-xs">IMPORTANT NOTICE REGARDING AI KOACHED CREDIT SERVICES:</p>
              <ul className="list-disc pl-5 space-y-1 mt-2">
                <li>AI KOACHED provides document preparation assistance only</li>
                <li>AI KOACHED does NOT guarantee any specific credit score improvement</li>
                <li>AI KOACHED does NOT guarantee removal of any specific item from your credit report</li>
                <li>AI KOACHED does NOT provide legal representation</li>
                <li>Billing for credit services occurs ONLY after each service round is completed and verified — never in advance</li>
                <li>You may cancel credit services at any time with no penalty</li>
                <li>You have 3 business days after signing to cancel for a full refund</li>
              </ul>
              <p className="mt-2 text-[10px]">Per 15 U.S.C. §1679 et seq. (Credit Repair Organizations Act)</p>
            </div>
          </Accordion>

          {/* 3 — $KOACHED Token */}
          <Accordion title="3. $KOACHED Utility Token Disclaimer">
            <p><strong>NOT AN INVESTMENT.</strong> The $KOACHED token is a utility token only. It is NOT a security, NOT an investment, NOT a cryptocurrency for speculative purposes, and NOT an offer to sell any security or investment product.</p>
            <p><strong>PRE-LAUNCH VALUE.</strong> The current value of $KOACHED is $0.00 (zero dollars). There is no guarantee that $KOACHED will have any monetary value at or after launch.</p>
            <p><strong>NO EXPECTATION OF PROFIT.</strong> Purchasing, earning, or holding $KOACHED tokens carries no expectation of profit. The value of $KOACHED may be zero at all times.</p>
            <p><strong>UTILITY ONLY.</strong> $KOACHED tokens are designed solely for use within the AI KOACHED platform to access discounts, unlock platform features, participate in governance voting, and for other platform-specific purposes.</p>
            <p><strong>REGULATORY UNCERTAINTY.</strong> The legal and regulatory status of utility tokens is uncertain and evolving. Changes in laws and regulations may adversely affect the utility, transferability, or value of $KOACHED tokens.</p>
            <p><strong>NO REFUND.</strong> $KOACHED tokens earned or received as part of a membership are non-refundable.</p>
            <p><strong>CONSULT A PROFESSIONAL.</strong> Before making any decision related to digital assets, consult a licensed financial advisor and legal counsel familiar with your jurisdiction's laws on digital assets.</p>
            <p className="text-[10px]">This disclosure is made pursuant to applicable securities laws and regulations. AI KOACHED has sought legal guidance to structure $KOACHED as a utility token and not a security; however, no guarantee is made regarding its regulatory classification in any jurisdiction.</p>
          </Accordion>

          {/* 4 — Market Data */}
          <Accordion title="4. Market Data & Financial Disclaimer">
            <p><strong>NOT FINANCIAL ADVICE.</strong> All market data, stock prices, cryptocurrency prices, index levels, and financial information displayed on AI KOACHED is for informational purposes only. Nothing on AI KOACHED constitutes financial advice, investment advice, trading advice, or a recommendation to buy, sell, or hold any security, cryptocurrency, or financial instrument.</p>
            <p><strong>BROKERAGE SERVICES.</strong> Stock and cryptocurrency trading within AI KOACHED is facilitated by Alpaca Securities LLC, member FINRA/SIPC. AI KOACHED is not a registered broker-dealer. All trades are self-directed by the member. Alpaca Securities LLC is solely responsible for trade execution, custody, and compliance.</p>
            <p><strong>MARKET DATA ACCURACY.</strong> Market data displayed on AI KOACHED may be delayed and is provided by third-party data providers. AI KOACHED makes no warranty regarding the accuracy, completeness, or timeliness of market data.</p>
            <p><strong>RISK OF LOSS.</strong> Investing in stocks, ETFs, and cryptocurrency involves substantial risk and you may lose some or all of your investment. Past performance is not indicative of future results.</p>
            <p><strong>CRYPTO RISK.</strong> Cryptocurrency is highly speculative, involves significant risk, and is not protected by FDIC or SIPC insurance. Cryptocurrency values can go to zero.</p>
            <p><strong>$KOACHED IS NOT A FINANCIAL INSTRUMENT.</strong> The $KOACHED token displayed on the market data screen is a utility token valued at $0.00 pre-launch and is NOT a tradeable financial instrument.</p>
            <p className="text-[10px]">Brokerage services are provided by Alpaca Securities LLC, member FINRA/SIPC. Cryptocurrency services are provided by Alpaca Crypto LLC, a FinCEN registered money services business (NMLS #2160858).</p>
          </Accordion>

          {/* 5 — Income */}
          <Accordion title="5. Income & Earnings Disclaimer">
            <p>The $12,000/month revenue goal featured on AI KOACHED is an aspirational target to help members structure their business growth — it is NOT a guarantee of income, a typical result, or a representation that members will earn any specific amount.</p>
            <p><strong>Results Are Not Typical.</strong> The income figures, revenue examples, and business outcomes mentioned on AI KOACHED are not typical. Most members will earn significantly less. Some members will earn nothing.</p>
            <p><strong>Your Results Depend On You.</strong> Your success on AI KOACHED depends entirely on your effort, your business idea, market demand, execution, and factors outside our control.</p>
            <p><strong>No Get-Rich-Quick Claims.</strong> AI KOACHED is not a get-rich-quick program. Building a successful business takes time, effort, and dedication regardless of the tools available.</p>
            <p><strong>FTC Compliance.</strong> AI KOACHED complies with the Federal Trade Commission's guidelines on income disclosure. Any income examples shared by members in the community represent their individual experience and should not be interpreted as typical.</p>
          </Accordion>

          {/* 6 — Entity Formation */}
          <Accordion title="6. Entity Formation Disclaimer">
            <p>AI KOACHED provides guided assistance with business entity formation. We are NOT a law firm and do NOT provide legal advice.</p>
            <ul className="list-disc pl-5 space-y-1">
              <li>State filing fees are separate and paid directly by the member to the state</li>
              <li>AI KOACHED service fees are for preparation and guidance only</li>
              <li>Formation documents should be reviewed by a licensed attorney before filing</li>
              <li>State processing times are set by each state and are outside our control</li>
              <li>Entity formation does not guarantee business success, liability protection in all circumstances, or any specific tax treatment</li>
              <li>Members should consult a licensed attorney and CPA regarding the appropriate entity structure for their situation</li>
            </ul>
          </Accordion>

          {/* 7 — Grants */}
          <Accordion title="7. Grant Application Disclaimer">
            <p>AI KOACHED assists members in identifying and applying for business grants. We make no guarantee that:</p>
            <ul className="list-disc pl-5 space-y-1">
              <li>Any member will receive any grant funding</li>
              <li>Grant information is current or accurate at time of application</li>
              <li>Any specific grant application will be approved</li>
              <li>Grant programs will remain open or funded</li>
            </ul>
            <p>Grants are awarded at the sole discretion of the granting organization. AI KOACHED is not affiliated with any grant organization and has no influence over grant award decisions.</p>
          </Accordion>

          <div className="mt-6 p-4 rounded-lg bg-muted/30 border border-border text-[10px] text-muted-foreground/60">
            AI KOACHED is not affiliated with, endorsed by, or connected to ZenBusiness, Sky Blue Credit, Kajabi, Skool, GoHighLevel, Alpaca Securities, Dun &amp; Bradstreet, or any other third-party service mentioned on this platform.
          </div>
        </div>
      )}

      {tab === "faq" && (
        <div className="space-y-6">
          {/* About */}
          <div>
            <h2 className="font-heading text-lg font-bold mb-3 flex items-center gap-2">🏢 About the Platform</h2>
            <div className="space-y-2">
              <Accordion title="What is AI KOACHED?">
                <p>AI KOACHED is the world's first AI-powered business formation and operating system built for everyday people. We combine entity formation guidance, credit building, grant writing, website creation, AI workers, live market data, and a business community into one platform — starting at $47/month.</p>
              </Accordion>
              <Accordion title="Who is AI KOACHED for?">
                <p>AI KOACHED is for two types of people:</p>
                <ul className="list-disc pl-5 space-y-1">
                  <li>People who already have a business and want to optimize it, build credit, apply for grants, and scale with AI workers</li>
                  <li>People who want to start a business and want AI to guide and build everything for them</li>
                </ul>
              </Accordion>
              <Accordion title="Who built AI KOACHED?">
                <p>AI KOACHED is operated by Koach Bridge Holdings, Inc. — a Wyoming C-Corporation founded by entrepreneurs for entrepreneurs.</p>
              </Accordion>
              <Accordion title="Is AI KOACHED a coaching program?">
                <p>No. AI KOACHED is a full software platform with AI tools, AI agents, and guided automation. We don't teach you how to build a business — our AI helps build it with you.</p>
              </Accordion>
              <Accordion title="What makes AI KOACHED different from other platforms?">
                <p>No other platform combines entity formation + credit repair + grant writing + website building + AI workers + community + token rewards + live market data + 3D avatar world in one place. We are a new category — an AI-powered business operating system.</p>
              </Accordion>
            </div>
          </div>

          {/* Membership */}
          <div>
            <h2 className="font-heading text-lg font-bold mb-3 flex items-center gap-2">💳 Membership &amp; Pricing</h2>
            <div className="space-y-2">
              <Accordion title="How much does AI KOACHED cost?">
                <ul className="list-disc pl-5 space-y-1">
                  <li><strong>Free:</strong> $0/month — preview access</li>
                  <li><strong>Starter:</strong> $47/month — 30 AI tools, all 4 AI agents, community access</li>
                  <li><strong>Builder:</strong> $97/month — 60 AI tools, full features</li>
                  <li><strong>Empire:</strong> $197/month — 90 AI tools, SMS alerts</li>
                  <li><strong>Dynasty:</strong> $497/month — 110+ tools, everything unlocked</li>
                </ul>
                <p>Annual plans save 2 months (17% discount).</p>
              </Accordion>
              <Accordion title="Is there a free trial?">
                <p>Yes. The Free tier lets you explore the platform with no credit card required. You can upgrade anytime.</p>
              </Accordion>
              <Accordion title="Can I cancel anytime?">
                <p>Yes. Monthly memberships can be cancelled anytime with no penalty and no cancellation fees. Your access continues through the end of your billing period.</p>
              </Accordion>
              <Accordion title="Do you offer refunds?">
                <p><strong>Memberships:</strong> 30-day satisfaction refund on your first month if you haven't used the platform extensively.</p>
                <p><strong>Credit services:</strong> 90-day satisfaction guarantee if you complete the full process and are not satisfied.</p>
                <p><strong>One-time formation services:</strong> Non-refundable after filing begins with the state.</p>
              </Accordion>
              <Accordion title="What payment methods do you accept?">
                <p>All major credit and debit cards (Visa, Mastercard, American Express, Discover) processed securely through Stripe. We do not store your payment information.</p>
              </Accordion>
              <Accordion title="Do prices ever increase?">
                <p>Founding member rates are locked in for as long as your membership stays active without a lapse. If you cancel and rejoin, current pricing applies.</p>
              </Accordion>
            </div>
          </div>

          {/* Tools */}
          <div>
            <h2 className="font-heading text-lg font-bold mb-3 flex items-center gap-2">🔧 Tools &amp; AI Agents</h2>
            <div className="space-y-2">
              <Accordion title="What are the 110+ AI tools?">
                <p>AI KOACHED includes over 110 business tools powered by Claude AI covering: entity formation, credit building, grant writing, legal documents, marketing, content creation, financial analysis, global expansion, AI strategy, and more. Tools are gated by membership tier.</p>
              </Accordion>
              <Accordion title="What are the 4 AI agents?">
                <ul className="list-disc pl-5 space-y-1">
                  <li><strong>Max Credit</strong> — Credit repair, Paydex building, dispute letters, net-30 vendors</li>
                  <li><strong>Empire Eva</strong> — Entity formation, trust structures, money flow, EIN, DUNS</li>
                  <li><strong>Revenue Rex</strong> — $12K goal tracking, grants, processor rotation, loan eligibility</li>
                  <li><strong>KOACHed Coin</strong> — $KOACHED token, live market data, crypto, forex</li>
                </ul>
                <p>All 4 agents are available 24/7 to Starter and above members.</p>
              </Accordion>
              <Accordion title="How accurate are the AI tools?">
                <p>Our AI tools are powered by Claude (by Anthropic), one of the most advanced AI systems available. However, AI can make errors. Always verify AI-generated content — especially legal documents, financial calculations, and dispute letters — before using them.</p>
              </Accordion>
              <Accordion title="Can AI KOACHED file my LLC for me?">
                <p>AI KOACHED guides you through every step of the filing process and prepares your documents. The actual filing is done by you on your state's Secretary of State website. State fees are paid directly to the state — AI KOACHED does not handle state fees.</p>
              </Accordion>
              <Accordion title="Does AI KOACHED repair my credit for me?">
                <p>AI KOACHED generates CROA-compliant dispute letters and guides you through the dispute process. You review and submit the letters. Results vary and are not guaranteed. Per federal law, we bill only after each service round is completed.</p>
              </Accordion>
            </div>
          </div>

          {/* Credit */}
          <div>
            <h2 className="font-heading text-lg font-bold mb-3 flex items-center gap-2">💳 Credit Services</h2>
            <div className="space-y-2">
              <Accordion title="What is CROA and why does it matter?">
                <p>CROA stands for the Credit Repair Organizations Act (15 U.S.C. §1679). It is federal law that governs how credit repair services operate. Key protections include: you cannot be charged before services are performed, you have 3 days to cancel after signing, and no one can guarantee specific credit results.</p>
              </Accordion>
              <Accordion title="When am I billed for credit services?">
                <p>NEVER upfront. Per CROA, you are only billed after each dispute round is completed and verified. You will never be charged for credit services before work is done.</p>
              </Accordion>
              <Accordion title="Can AI KOACHED guarantee my credit score will improve?">
                <p>No. No one can legally guarantee credit score improvement. We can generate and submit dispute letters on your behalf for inaccurate, unverifiable, or erroneous items. Results depend on what the bureaus and creditors determine.</p>
              </Accordion>
              <Accordion title="How long does credit repair take?">
                <p>Each dispute round takes approximately 35-45 days. Most members do 2-4 rounds. Significant results are typically seen within 3-6 months of consistent work.</p>
              </Accordion>
              <Accordion title="What is business credit and how is it different from personal credit?">
                <p>Business credit is built on your company's EIN and DUNS number — not your Social Security Number. It is completely separate from personal credit. You can build excellent business credit even with poor personal credit.</p>
              </Accordion>
              <Accordion title="What is a Paydex score?">
                <p>Paydex is Dun &amp; Bradstreet's business credit score, ranging from 0-100. A Paydex of 80+ means you consistently pay invoices on time or early and makes you eligible for business loans from most lenders.</p>
              </Accordion>
            </div>
          </div>

          {/* Entity */}
          <div>
            <h2 className="font-heading text-lg font-bold mb-3 flex items-center gap-2">🏢 Entity Formation</h2>
            <div className="space-y-2">
              <Accordion title="Do I need an LLC?">
                <p>AI KOACHED recommends consulting an attorney, but generally most business owners benefit from an LLC for liability protection and credibility. Empire Eva helps you determine the right structure for your situation.</p>
              </Accordion>
              <Accordion title="What state should I form my LLC in?">
                <p>Wyoming is typically recommended for privacy and asset protection. Texas and Florida are good choices for residents of those states. The right answer depends on your situation — Empire Eva asks you questions to make the right recommendation.</p>
              </Accordion>
              <Accordion title="How long does LLC formation take?">
                <p><strong>Wyoming:</strong> 3-5 days standard, same day expedited. <strong>Texas:</strong> Same day online. <strong>Florida:</strong> 3-5 days. <strong>Delaware:</strong> 3-5 days. State processing times are outside our control.</p>
              </Accordion>
              <Accordion title="Can non-US residents form a US business through AI KOACHED?">
                <p>Yes. Non-US residents can legally form and own a Wyoming LLC. You need a passport, a US virtual mailbox address, and the filing fee. You cannot apply for an EIN online — you must call the IRS at +1 (267) 941-1099.</p>
              </Accordion>
            </div>
          </div>

          {/* Grants */}
          <div>
            <h2 className="font-heading text-lg font-bold mb-3 flex items-center gap-2">💰 Grants</h2>
            <div className="space-y-2">
              <Accordion title="Does AI KOACHED guarantee I'll win grants?">
                <p>No. Grants are awarded at the sole discretion of the granting organization. AI KOACHED helps you identify grants you qualify for and writes competitive applications — but we cannot control award decisions.</p>
              </Accordion>
              <Accordion title="Is grant money taxable?">
                <p>Generally yes — business grants are typically taxable income. Consult a CPA for guidance on your specific situation.</p>
              </Accordion>
              <Accordion title="How does the grant application writer work?">
                <p>You select a grant, Claude AI reviews the grant requirements and writes a complete application tailored to your business. You review, customize, and submit directly to the granting organization.</p>
              </Accordion>
            </div>
          </div>

          {/* Banking */}
          <div>
            <h2 className="font-heading text-lg font-bold mb-3 flex items-center gap-2">🏦 Banking &amp; Payments</h2>
            <div className="space-y-2">
              <Accordion title="Does AI KOACHED help me open a bank account?">
                <p>Yes. Empire Eva guides you through opening accounts at Mercury, Relay, Chase, and other recommended banks — step by step, field by field. The account opening is completed directly with the bank. AI KOACHED does not hold or handle your money.</p>
              </Accordion>
              <Accordion title="What is processor rotation?">
                <p>Processor rotation is a revenue strategy where you cycle revenue across Stripe, Square, and PayPal over a 6-month period. Each processor builds a separate lending relationship. After 6 months of consistent history, you may qualify for loans from all three — potentially $50,000-$150,000+ in total.</p>
              </Accordion>
            </div>
          </div>

          {/* Market Data */}
          <div>
            <h2 className="font-heading text-lg font-bold mb-3 flex items-center gap-2">📈 Market Data &amp; Trading</h2>
            <div className="space-y-2">
              <Accordion title="Where does the live market data come from?">
                <p>Market data is provided by Financial Modeling Prep (FMP) and CoinGecko. Data refreshes every 60 seconds during market hours.</p>
              </Accordion>
              <Accordion title="Can I actually buy stocks and crypto through AI KOACHED?">
                <p>Yes. Trading is available through Alpaca Securities LLC, a FINRA-regulated broker-dealer with SIPC insurance up to $500,000. All trades are self-directed — AI KOACHED never recommends trades. You decide what to buy or sell.</p>
              </Accordion>
              <Accordion title="What is the $KOACHED token worth right now?">
                <p>$0.00. The $KOACHED token is pre-launch. It is a utility token with no current monetary value. Launch target is August 1, 2026 on the Solana blockchain.</p>
              </Accordion>
              <Accordion title="What is paper trading?">
                <p>Paper trading lets you practice buying and selling stocks with simulated money using real market prices. It's a great way to learn trading without risk. All new members start in paper trading mode.</p>
              </Accordion>
            </div>
          </div>

          {/* International */}
          <div>
            <h2 className="font-heading text-lg font-bold mb-3 flex items-center gap-2">🌍 International Members</h2>
            <div className="space-y-2">
              <Accordion title="Can I join AI KOACHED if I live outside the US?">
                <p>Yes. AI KOACHED is built for global members. The Global Empire page provides formation guides for 12 countries and guidance on forming a US entity as a non-US resident.</p>
              </Accordion>
              <Accordion title="What bank can I use as a non-US resident?">
                <p>Mercury and Relay both accept non-US residents with a passport. Wise Business is recommended for international payments and currency conversion.</p>
              </Accordion>
            </div>
          </div>

          {/* 3D World */}
          <div>
            <h2 className="font-heading text-lg font-bold mb-3 flex items-center gap-2">🤖 AI Empire World &amp; Avatar</h2>
            <div className="space-y-2">
              <Accordion title="What is the 3D Empire World?">
                <p>The 3D Empire World is an immersive 3D virtual office environment where members log in through their CEO avatar, watch their AI workers at their desks, see real-time stats floating in 3D space, and walk into market buildings to watch live data and trade.</p>
              </Accordion>
              <Accordion title="Do I need special equipment for the 3D world?">
                <p>No. The 3D Empire World runs in your browser on any computer. No VR headset, no special app, no special hardware required. For mobile devices with limited GPU capability, a 2D dashboard alternative is automatically shown.</p>
              </Accordion>
              <Accordion title="Do I have to use the 3D world?">
                <p>No. The 3D Empire World is optional. You can always switch to the standard 2D dashboard with one click. All platform features work in both modes.</p>
              </Accordion>
            </div>
          </div>

          {/* Privacy */}
          <div>
            <h2 className="font-heading text-lg font-bold mb-3 flex items-center gap-2">🔐 Privacy &amp; Security</h2>
            <div className="space-y-2">
              <Accordion title="Is my data secure?">
                <p>AI KOACHED uses secure database management with row-level security, SSL encryption for all data in transit, and does not sell member data to third parties.</p>
              </Accordion>
              <Accordion title="Does AI KOACHED sell my data?">
                <p>No. AI KOACHED does not sell, rent, or share your personal data with third parties for marketing purposes. See our Privacy Policy for complete details.</p>
              </Accordion>
              <Accordion title="Is my EIN and SSN stored securely?">
                <p>EIN numbers are encrypted in our database. We never store your Social Security Number — SSN is used only during EIN application guidance and is not transmitted to or stored by AI KOACHED.</p>
              </Accordion>
            </div>
          </div>

          {/* Results */}
          <div>
            <h2 className="font-heading text-lg font-bold mb-3 flex items-center gap-2">🎯 Results &amp; Expectations</h2>
            <div className="space-y-2">
              <Accordion title="How long until I have a complete business?">
                <p>Members who follow the complete onboarding process typically have their entity formed, website live, bank accounts open, and credit building started within 30 days. Results depend on your responsiveness and the state's processing time.</p>
              </Accordion>
              <Accordion title="How long until I hit $12K/month?">
                <p>Revenue growth depends entirely on your business type, effort, market, and execution. The $12,000/month goal is an aspirational benchmark — not a timeline or guarantee. Revenue Rex builds a specific plan for your situation on Day 1.</p>
              </Accordion>
              <Accordion title="How long until Paydex hits 80?">
                <p>With consistent net-30 payments and our recommended vendor sequence, most members reach Paydex 75-80 within 90 days. Results vary based on payment history and number of accounts opened.</p>
              </Accordion>
            </div>
          </div>

          {/* Support */}
          <div>
            <h2 className="font-heading text-lg font-bold mb-3 flex items-center gap-2">📞 Support</h2>
            <div className="space-y-2">
              <Accordion title="How do I get help?">
                <ul className="list-disc pl-5 space-y-1">
                  <li>AI agents (Max Credit, Empire Eva, Revenue Rex, KOACHed Coin) are available 24/7 inside the platform</li>
                  <li>Community posts and member DMs</li>
                  <li>Support email: support@aikoached.com</li>
                  <li>Dynasty members receive priority support and monthly strategy sessions</li>
                </ul>
              </Accordion>
              <Accordion title="What if the AI gives me wrong information?">
                <p>AI can make mistakes. Always verify important information — especially legal documents, financial advice, and formation details — with a licensed professional before relying on it. If you find an error, report it using the thumbs down button on any AI response.</p>
              </Accordion>
            </div>
          </div>

          {/* Legal Notes */}
          <div>
            <h2 className="font-heading text-lg font-bold mb-3 flex items-center gap-2">⚠️ Legal Notes</h2>
            <div className="space-y-2">
              <Accordion title="Is AI KOACHED a law firm?">
                <p>No. AI KOACHED is not a law firm and does not provide legal advice. For legal matters consult a licensed attorney.</p>
              </Accordion>
              <Accordion title="Is AI KOACHED a financial advisor?">
                <p>No. AI KOACHED is not a registered investment advisor and does not provide financial or investment advice. For financial matters consult a licensed financial advisor.</p>
              </Accordion>
              <Accordion title="Is AI KOACHED a credit repair organization under CROA?">
                <p>Yes. AI KOACHED's credit dispute document preparation services qualify as credit repair services under the Credit Repair Organizations Act and we operate in full compliance with CROA requirements.</p>
              </Accordion>
              <Accordion title="What jurisdiction governs disputes?">
                <p>These terms are governed by the laws of the State of Wyoming. Any disputes shall be resolved through binding arbitration in Wyoming.</p>
              </Accordion>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
