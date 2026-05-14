import { useState, useRef } from "react";

const SECTIONS = [
  {
    id: "photo",
    name: "Profile Photo & Banner",
    icon: "📸",
    fields: [
      { key: "photo_desc", label: "Describe your profile photo (or paste the URL)", type: "text", placeholder: "e.g. Professional headshot, studio background, business attire..." },
      { key: "banner_desc", label: "Describe your banner image", type: "text", placeholder: "e.g. Default LinkedIn blue banner / Custom branded banner with my tagline..." }
    ],
    criteria: ["Professional headshot, not a selfie", "Face covers 60–70% of frame", "Custom banner (not default)", "Banner communicates niche or tagline"]
  },
  {
    id: "headline",
    name: "Headline",
    icon: "✍️",
    fields: [
      { key: "headline", label: "Paste your current LinkedIn headline", type: "text", placeholder: "e.g. HR Manager at XYZ Company" }
    ],
    criteria: ["Not just a job title", "Contains who you help + outcome", "Has 2–3 searchable keywords", "Uses close to 220 character limit"]
  },
  {
    id: "about",
    name: "About / Summary",
    icon: "💬",
    fields: [
      { key: "about", label: "Paste your About section", type: "textarea", placeholder: "Paste your full LinkedIn About/Summary here..." }
    ],
    criteria: ["Written in first person", "Covers who you are, what you do, who you help", "Keywords embedded naturally", "Ends with a call to action", "Long enough to trigger 'see more'"]
  },
  {
    id: "featured",
    name: "Featured Section",
    icon: "⭐",
    fields: [
      { key: "featured", label: "What do you have in your Featured section?", type: "text", placeholder: "e.g. Nothing / 2 posts and a link to my portfolio / A case study PDF..." }
    ],
    criteria: ["Section is turned on and filled", "Contains posts, articles, or portfolio links", "Most impressive work pinned first", "Links point to working destinations"]
  },
  {
    id: "experience",
    name: "Experience",
    icon: "💼",
    fields: [
      { key: "experience", label: "Paste 1–2 of your experience descriptions", type: "textarea", placeholder: "e.g. HR Manager at ABC Corp (2021–present)\n- Managed recruitment\n- Handled onboarding..." }
    ],
    criteria: ["All roles have descriptions", "Descriptions have numbers and metrics", "Written as impact bullets not duty lists", "Media attached where relevant"]
  },
  {
    id: "education",
    name: "Education",
    icon: "🎓",
    fields: [
      { key: "education", label: "Describe your education section", type: "text", placeholder: "e.g. MBA from Delhi University 2018, Activities: HR Club President — description filled" }
    ],
    criteria: ["Degree, institution, years filled correctly", "Activities or description added", "Certifications from education included"]
  },
  {
    id: "skills",
    name: "Skills & Endorsements",
    icon: "🏷️",
    fields: [
      { key: "skills", label: "List your top 10 skills on LinkedIn", type: "textarea", placeholder: "e.g. Talent Acquisition, Employee Relations, HRIS, Performance Management..." },
      { key: "endorsements", label: "How many endorsements do your top skills have?", type: "text", placeholder: "e.g. Top skill has 12 endorsements, others have 3–5" }
    ],
    criteria: ["At least 10 skills added (50 allowed)", "Top 3 skills pinned and relevant", "Key skills have endorsements", "Skill names match recruiter search terms"]
  },
  {
    id: "recommendations",
    name: "Recommendations",
    icon: "💌",
    fields: [
      { key: "recommendations", label: "How many recommendations do you have, and from whom?", type: "text", placeholder: "e.g. 2 recommendations — one from my manager, one from a peer — both generic" }
    ],
    criteria: ["At least 3 recommendations", "From different role types (manager, peer, report, client)", "Specific and not generic", "At least 1 from last 2 years"]
  },
  {
    id: "certifications",
    name: "Licenses & Certifications",
    icon: "🏅",
    fields: [
      { key: "certifications", label: "List your certifications on LinkedIn", type: "text", placeholder: "e.g. SHRM-CP (2022), Google Analytics (2021), no credential URL added..." }
    ],
    criteria: ["All relevant certifications listed", "Expiry dates filled in", "Credential URLs added", "Outdated certs deprioritized"]
  },
  {
    id: "projects",
    name: "Projects",
    icon: "🔧",
    fields: [
      { key: "projects", label: "Describe your projects section", type: "text", placeholder: "e.g. Empty / 1 project: redesigned onboarding process, no link, no team members tagged" }
    ],
    criteria: ["Projects section exists and is used", "Each project has title, description, outcome", "Team members tagged", "Links to live work attached"]
  },
  {
    id: "volunteer",
    name: "Volunteer Experience",
    icon: "❤️",
    fields: [
      { key: "volunteer", label: "Any volunteer experience listed?", type: "text", placeholder: "e.g. None / Career mentor at XYZ NGO since 2022, description filled" }
    ],
    criteria: ["Any volunteering added (mentoring counts)", "Organization, role, dates filled", "Description shows impact"]
  },
  {
    id: "languages",
    name: "Languages",
    icon: "🌐",
    fields: [
      { key: "languages", label: "What languages are listed on your profile?", type: "text", placeholder: "e.g. English (Native), Hindi (Full Professional) — 2 languages listed" }
    ],
    criteria: ["All languages added (even conversational)", "Proficiency level set correctly"]
  },
  {
    id: "activity",
    name: "Activity & Content",
    icon: "📣",
    fields: [
      { key: "activity", label: "Describe your recent LinkedIn activity", type: "text", placeholder: "e.g. Haven't posted in 6 months, occasionally like posts, wrote 1 article last year" }
    ],
    criteria: ["Posted or shared in last 30 days", "Commenting meaningfully on others' posts", "At least 1 original post/article in last 90 days", "Posts reflect your expertise and niche"]
  },
  {
    id: "seo",
    name: "Connection Strategy & SEO",
    icon: "🔍",
    fields: [
      { key: "connections", label: "How many connections do you have?", type: "text", placeholder: "e.g. 312 connections" },
      { key: "url", label: "What is your LinkedIn URL?", type: "text", placeholder: "e.g. linkedin.com/in/john-doe-abc123 (custom) or a random string" },
      { key: "settings", label: "Any other profile settings configured?", type: "text", placeholder: "e.g. Open To Work enabled, location set to Delhi, industry set to HR" }
    ],
    criteria: ["500+ connections", "Custom LinkedIn URL set", "Location is accurate", "Industry set correctly", "Open To Work configured if seeking"]
  }
];

const COLORS = {
  bg: "#0A0A0F",
  surface: "#12121A",
  card: "#1A1A26",
  border: "#2A2A3E",
  accent: "#6C63FF",
  accentLight: "#8B84FF",
  gold: "#F5C842",
  green: "#2DD4A0",
  red: "#FF5B5B",
  amber: "#F5A623",
  text: "#F0EFF8",
  muted: "#8888AA",
  dim: "#55556A"
};

const css = `
  @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;500;600;700;800&family=DM+Sans:wght@300;400;500&display=swap');
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body { background: ${COLORS.bg}; color: ${COLORS.text}; font-family: 'DM Sans', sans-serif; min-height: 100vh; }
  h1,h2,h3,h4 { font-family: 'Syne', sans-serif; }
  .app { max-width: 860px; margin: 0 auto; padding: 2rem 1rem 4rem; }
  
  .hero { text-align: center; padding: 3rem 0 2.5rem; position: relative; }
  .hero-badge { display: inline-block; background: rgba(108,99,255,0.15); border: 1px solid rgba(108,99,255,0.3); color: ${COLORS.accentLight}; font-size: 12px; font-weight: 500; padding: 5px 14px; border-radius: 99px; margin-bottom: 1.5rem; letter-spacing: 0.08em; text-transform: uppercase; }
  .hero h1 { font-size: clamp(2rem, 5vw, 3.5rem); font-weight: 800; line-height: 1.1; margin-bottom: 1rem; background: linear-gradient(135deg, #fff 0%, ${COLORS.accentLight} 100%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; }
  .hero p { color: ${COLORS.muted}; font-size: 1.05rem; max-width: 520px; margin: 0 auto 2rem; line-height: 1.6; }
  
  .score-hero { background: ${COLORS.card}; border: 1px solid ${COLORS.border}; border-radius: 20px; padding: 2rem; margin-bottom: 2rem; display: flex; align-items: center; gap: 2rem; }
  .score-ring-wrap { position: relative; width: 110px; height: 110px; flex-shrink: 0; }
  .score-ring-wrap svg { width: 110px; height: 110px; transform: rotate(-90deg); }
  .score-ring-text { position: absolute; inset: 0; display: flex; flex-direction: column; align-items: center; justify-content: center; }
  .score-big { font-family: 'Syne', sans-serif; font-size: 28px; font-weight: 800; color: ${COLORS.text}; }
  .score-small { font-size: 11px; color: ${COLORS.muted}; }
  .score-info { flex: 1; }
  .score-info h2 { font-size: 1.3rem; margin-bottom: 0.4rem; }
  .score-info p { color: ${COLORS.muted}; font-size: 0.9rem; line-height: 1.5; }
  .progress-pills { display: flex; gap: 6px; margin-top: 12px; flex-wrap: wrap; }
  .pill { padding: 3px 10px; border-radius: 99px; font-size: 11px; font-weight: 500; }
  .pill-green { background: rgba(45,212,160,0.15); color: ${COLORS.green}; border: 1px solid rgba(45,212,160,0.3); }
  .pill-amber { background: rgba(245,166,35,0.15); color: ${COLORS.amber}; border: 1px solid rgba(245,166,35,0.3); }
  .pill-red { background: rgba(255,91,91,0.15); color: ${COLORS.red}; border: 1px solid rgba(255,91,91,0.3); }
  
  .section-card { background: ${COLORS.card}; border: 1px solid ${COLORS.border}; border-radius: 16px; margin-bottom: 12px; overflow: hidden; transition: border-color 0.2s; }
  .section-card.active { border-color: ${COLORS.accent}; }
  .section-header { display: flex; align-items: center; gap: 14px; padding: 1.1rem 1.4rem; cursor: pointer; user-select: none; transition: background 0.15s; }
  .section-header:hover { background: rgba(255,255,255,0.03); }
  .sec-icon { font-size: 20px; width: 36px; height: 36px; background: ${COLORS.surface}; border-radius: 10px; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
  .sec-name { flex: 1; font-family: 'Syne', sans-serif; font-size: 0.95rem; font-weight: 600; }
  .sec-status { display: flex; align-items: center; gap: 10px; }
  .status-badge { font-size: 11px; font-weight: 500; padding: 3px 10px; border-radius: 99px; }
  .sb-none { background: rgba(136,136,170,0.12); color: ${COLORS.dim}; }
  .sb-strong { background: rgba(45,212,160,0.15); color: ${COLORS.green}; }
  .sb-partial { background: rgba(245,166,35,0.15); color: ${COLORS.amber}; }
  .sb-weak { background: rgba(255,91,91,0.15); color: ${COLORS.red}; }
  .chev { color: ${COLORS.dim}; font-size: 18px; transition: transform 0.2s; }
  .chev.open { transform: rotate(180deg); }
  
  .section-body { padding: 0 1.4rem 1.4rem; display: none; }
  .section-body.open { display: block; }
  .sep { height: 1px; background: ${COLORS.border}; margin: 0 1.4rem 1.4rem; }
  
  .field-group { margin-bottom: 1rem; }
  .field-label { font-size: 13px; color: ${COLORS.muted}; margin-bottom: 6px; display: block; }
  .field-input { width: 100%; background: ${COLORS.surface}; border: 1px solid ${COLORS.border}; border-radius: 10px; padding: 10px 14px; color: ${COLORS.text}; font-family: 'DM Sans', sans-serif; font-size: 14px; outline: none; transition: border-color 0.15s; resize: vertical; }
  .field-input:focus { border-color: ${COLORS.accent}; }
  .field-input::placeholder { color: ${COLORS.dim}; }
  textarea.field-input { min-height: 100px; }
  
  .analyze-btn { width: 100%; margin-top: 12px; padding: 12px; background: linear-gradient(135deg, ${COLORS.accent}, ${COLORS.accentLight}); color: white; border: none; border-radius: 12px; font-family: 'Syne', sans-serif; font-size: 14px; font-weight: 600; cursor: pointer; transition: opacity 0.15s, transform 0.1s; letter-spacing: 0.02em; }
  .analyze-btn:hover { opacity: 0.9; transform: translateY(-1px); }
  .analyze-btn:disabled { opacity: 0.5; cursor: not-allowed; transform: none; }
  
  .ai-result { margin-top: 14px; background: ${COLORS.surface}; border: 1px solid ${COLORS.border}; border-radius: 12px; padding: 16px; }
  .ai-result-label { font-size: 11px; text-transform: uppercase; letter-spacing: 0.1em; color: ${COLORS.accent}; margin-bottom: 10px; font-weight: 600; }
  .ai-result-text { font-size: 14px; color: ${COLORS.text}; line-height: 1.7; white-space: pre-wrap; }
  .ai-score-line { display: flex; align-items: center; gap: 10px; margin-bottom: 10px; }
  .ai-score-badge { padding: 4px 14px; border-radius: 99px; font-size: 13px; font-weight: 700; font-family: 'Syne', sans-serif; }
  
  .criteria-list { list-style: none; display: flex; flex-direction: column; gap: 4px; margin-bottom: 14px; }
  .criteria-list li { font-size: 12px; color: ${COLORS.muted}; display: flex; align-items: center; gap: 8px; }
  .criteria-list li::before { content: '→'; color: ${COLORS.dim}; flex-shrink: 0; }
  
  .cta-bar { background: linear-gradient(135deg, rgba(108,99,255,0.1), rgba(108,99,255,0.05)); border: 1px solid rgba(108,99,255,0.25); border-radius: 20px; padding: 2rem; text-align: center; margin-top: 2.5rem; }
  .cta-bar h3 { font-size: 1.3rem; margin-bottom: 0.5rem; }
  .cta-bar p { color: ${COLORS.muted}; font-size: 0.9rem; margin-bottom: 1.2rem; }
  .cta-actions { display: flex; gap: 10px; justify-content: center; flex-wrap: wrap; }
  .btn-primary { padding: 11px 24px; background: ${COLORS.accent}; color: white; border: none; border-radius: 10px; font-family: 'Syne', sans-serif; font-size: 14px; font-weight: 600; cursor: pointer; transition: opacity 0.15s; }
  .btn-primary:hover { opacity: 0.85; }
  .btn-secondary { padding: 11px 24px; background: transparent; color: ${COLORS.text}; border: 1px solid ${COLORS.border}; border-radius: 10px; font-family: 'Syne', sans-serif; font-size: 14px; font-weight: 500; cursor: pointer; transition: background 0.15s; }
  .btn-secondary:hover { background: rgba(255,255,255,0.05); }
  
  .loading-dots span { display: inline-block; animation: blink 1.2s infinite; }
  .loading-dots span:nth-child(2) { animation-delay: 0.2s; }
  .loading-dots span:nth-child(3) { animation-delay: 0.4s; }
  @keyframes blink { 0%,80%,100% { opacity: 0; } 40% { opacity: 1; } }
  
  .report-modal { position: fixed; inset: 0; background: rgba(0,0,0,0.85); display: flex; align-items: center; justify-content: center; z-index: 100; padding: 1rem; }
  .report-box { background: ${COLORS.card}; border: 1px solid ${COLORS.border}; border-radius: 20px; padding: 2rem; max-width: 620px; width: 100%; max-height: 80vh; overflow-y: auto; }
  .report-box h3 { font-size: 1.4rem; margin-bottom: 1.5rem; }
  .report-section { margin-bottom: 1.2rem; padding-bottom: 1.2rem; border-bottom: 1px solid ${COLORS.border}; }
  .report-section:last-child { border-bottom: none; }
  .report-section-name { font-family: 'Syne', sans-serif; font-size: 14px; font-weight: 600; margin-bottom: 6px; display: flex; align-items: center; gap: 8px; }
  .report-section-text { font-size: 13px; color: ${COLORS.muted}; line-height: 1.6; }
  
  @media (max-width: 600px) {
    .score-hero { flex-direction: column; text-align: center; }
    .progress-pills { justify-content: center; }
  }
`;

function ScoreRing({ score }) {
  const r = 42;
  const circ = 2 * Math.PI * r;
  const filled = (score / 100) * circ;
  const color = score >= 75 ? COLORS.green : score >= 45 ? COLORS.amber : COLORS.red;
  return (
    <div className="score-ring-wrap">
      <svg viewBox="0 0 110 110">
        <circle cx="55" cy="55" r={r} fill="none" stroke={COLORS.border} strokeWidth="8" />
        <circle cx="55" cy="55" r={r} fill="none" stroke={color} strokeWidth="8"
          strokeDasharray={`${filled} ${circ}`} strokeLinecap="round" style={{ transition: "stroke-dasharray 0.6s ease" }} />
      </svg>
      <div className="score-ring-text">
        <span className="score-big">{score}</span>
        <span className="score-small">/ 100</span>
      </div>
    </div>
  );
}

function getScoreLabel(score) {
  if (score >= 85) return "LinkedIn All-Star 🏆";
  if (score >= 70) return "Strong Profile 💪";
  if (score >= 50) return "Good Start 📈";
  if (score >= 25) return "Needs Work 🔧";
  return "Just Getting Started";
}

function getScoreColor(score) {
  if (score >= 70) return COLORS.green;
  if (score >= 45) return COLORS.amber;
  return COLORS.red;
}

export default function App() {
  const [inputs, setInputs] = useState({});
  const [open, setOpen] = useState(null);
  const [ratings, setRatings] = useState({});
  const [aiResults, setAiResults] = useState({});
  const [loading, setLoading] = useState({});
  const [showReport, setShowReport] = useState(false);
  const [generatingReport, setGeneratingReport] = useState(false);
  const [reportContent, setReportContent] = useState(null);

  const ratedSections = Object.keys(ratings);
  const strongCount = ratedSections.filter(k => ratings[k] === "strong").length;
  const partialCount = ratedSections.filter(k => ratings[k] === "partial").length;
  const weakCount = ratedSections.filter(k => ratings[k] === "weak").length;

  const scoreVal = ratedSections.length === 0 ? 0 :
    Math.round((strongCount * 100 + partialCount * 55 + weakCount * 10) / SECTIONS.length);

  async function analyzeSection(sec) {
    const sectionInputs = {};
    sec.fields.forEach(f => { sectionInputs[f.key] = inputs[f.key] || ""; });
    const hasInput = Object.values(sectionInputs).some(v => v.trim().length > 0);

    setLoading(prev => ({ ...prev, [sec.id]: true }));
    try {
      const prompt = `You are a LinkedIn profile expert and HR professional. Audit this LinkedIn section:

SECTION: ${sec.name}
CRITERIA TO CHECK: ${sec.criteria.join(", ")}

USER INPUT:
${sec.fields.map(f => `${f.label}: ${inputs[f.key] || "(not provided)"}`).join("\n")}

Provide:
1. SCORE: a rating out of 10 with label (Weak/Partial/Strong)
2. RATING: one word — "strong", "partial", or "weak"  
3. WHAT'S WORKING: 1–2 lines max
4. FIX THIS NOW: 2–3 specific, actionable fixes with exact wording suggestions where possible
5. QUICK WIN: one thing they can do in the next 5 minutes

Be brutally honest, direct, and specific. No fluff. Format clearly with these headers.`;

      const resp = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 1000,
          messages: [{ role: "user", content: prompt }]
        })
      });
      const data = await resp.json();
      const text = data.content?.map(b => b.text || "").join("") || "";

      // Extract rating
      const ratingMatch = text.match(/RATING:\s*(strong|partial|weak)/i);
      const rating = ratingMatch ? ratingMatch[1].toLowerCase() : (hasInput ? "partial" : "weak");

      setRatings(prev => ({ ...prev, [sec.id]: rating }));
      setAiResults(prev => ({ ...prev, [sec.id]: text }));
    } catch (e) {
      setAiResults(prev => ({ ...prev, [sec.id]: "Could not connect to AI. Please try again." }));
    }
    setLoading(prev => ({ ...prev, [sec.id]: false }));
  }

  async function generateReport() {
    setGeneratingReport(true);
    setShowReport(true);

    const summaries = SECTIONS.map(s => ({
      name: s.name,
      rating: ratings[s.id] || "not rated",
      feedback: aiResults[s.id] || "Not analyzed yet."
    }));

    try {
      const prompt = `You are a LinkedIn profile expert. Based on this audit summary, write a concise overall LinkedIn Profile Report.

AUDIT RESULTS:
${summaries.map(s => `${s.name}: ${s.rating.toUpperCase()}\n${s.feedback}`).join("\n\n---\n\n")}

Write a professional report with:
1. OVERALL VERDICT (2–3 sentences on the profile's current state)
2. TOP 3 WINS (what's already strong)
3. TOP 3 CRITICAL FIXES (most impactful improvements, in priority order)
4. 30-DAY ACTION PLAN (week-by-week, specific tasks)
5. POTENTIAL REACH IMPACT (what they can expect after fixing these things)

Be direct, specific, and motivating. No fluff.`;

      const resp = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 1500,
          messages: [{ role: "user", content: prompt }]
        })
      });
      const data = await resp.json();
      const text = data.content?.map(b => b.text || "").join("") || "";
      setReportContent(text);
    } catch (e) {
      setReportContent("Could not generate report. Please try again.");
    }
    setGeneratingReport(false);
  }

  function copyReport() {
    const sectionLines = SECTIONS.map(s => {
      const r = ratings[s.id] || "not rated";
      const fb = aiResults[s.id] || "Not analyzed.";
      return `## ${s.name} — ${r.toUpperCase()}\n${fb}`;
    }).join("\n\n");
    const full = `LINKEDIN PROFILE AUDIT REPORT\nOverall Score: ${scoreVal}/100 — ${getScoreLabel(scoreVal)}\n\n${sectionLines}\n\n---\nOVERALL REPORT\n${reportContent || ""}`;
    navigator.clipboard?.writeText(full);
  }

  return (
    <>
      <style>{css}</style>
      <div className="app">
        <div className="hero">
          <div className="hero-badge">AI-Powered Audit</div>
          <h1>LinkedIn Profile Auditor</h1>
          <p>Paste your profile content section by section. Get brutally honest AI feedback and a score — free, instant, no signup.</p>
        </div>

        <div className="score-hero">
          <ScoreRing score={scoreVal} />
          <div className="score-info">
            <h2 style={{ color: getScoreColor(scoreVal) }}>{getScoreLabel(scoreVal)}</h2>
            <p>{ratedSections.length === 0
              ? "Open any section below, paste your content, and hit Analyze. Your score builds as you go."
              : `${ratedSections.length} of ${SECTIONS.length} sections analyzed · ${SECTIONS.length - ratedSections.length} remaining`}
            </p>
            {ratedSections.length > 0 && (
              <div className="progress-pills">
                {strongCount > 0 && <span className="pill pill-green">✓ {strongCount} Strong</span>}
                {partialCount > 0 && <span className="pill pill-amber">~ {partialCount} Partial</span>}
                {weakCount > 0 && <span className="pill pill-red">✗ {weakCount} Weak</span>}
              </div>
            )}
          </div>
        </div>

        {SECTIONS.map((sec, i) => {
          const isOpen = open === sec.id;
          const rating = ratings[sec.id];
          const result = aiResults[sec.id];
          const isLoading = loading[sec.id];
          const sbClass = rating === "strong" ? "sb-strong" : rating === "partial" ? "sb-partial" : rating === "weak" ? "sb-weak" : "sb-none";
          const sbLabel = rating ? (rating.charAt(0).toUpperCase() + rating.slice(1)) : "Not rated";

          return (
            <div key={sec.id} className={`section-card ${isOpen ? "active" : ""}`}>
              <div className="section-header" onClick={() => setOpen(isOpen ? null : sec.id)}>
                <div className="sec-icon">{sec.icon}</div>
                <div className="sec-name">{i + 1}. {sec.name}</div>
                <div className="sec-status">
                  <span className={`status-badge ${sbClass}`}>{sbLabel}</span>
                  <span className={`chev ${isOpen ? "open" : ""}`}>▾</span>
                </div>
              </div>
              {isOpen && (
                <>
                  <div className="sep" />
                  <div className="section-body open">
                    <ul className="criteria-list">
                      {sec.criteria.map((c, ci) => <li key={ci}>{c}</li>)}
                    </ul>
                    {sec.fields.map(field => (
                      <div className="field-group" key={field.key}>
                        <label className="field-label">{field.label}</label>
                        {field.type === "textarea"
                          ? <textarea className="field-input" placeholder={field.placeholder} value={inputs[field.key] || ""} onChange={e => setInputs(p => ({ ...p, [field.key]: e.target.value }))} />
                          : <input className="field-input" placeholder={field.placeholder} value={inputs[field.key] || ""} onChange={e => setInputs(p => ({ ...p, [field.key]: e.target.value }))} />
                        }
                      </div>
                    ))}
                    <button className="analyze-btn" disabled={isLoading} onClick={() => analyzeSection(sec)}>
                      {isLoading ? <span className="loading-dots">Analyzing<span>.</span><span>.</span><span>.</span></span> : "✦ Analyze This Section"}
                    </button>
                    {result && (
                      <div className="ai-result">
                        <div className="ai-result-label">AI Feedback</div>
                        {rating && (
                          <div className="ai-score-line">
                            <span className="ai-score-badge" style={{
                              background: rating === "strong" ? "rgba(45,212,160,0.15)" : rating === "partial" ? "rgba(245,166,35,0.15)" : "rgba(255,91,91,0.15)",
                              color: rating === "strong" ? COLORS.green : rating === "partial" ? COLORS.amber : COLORS.red
                            }}>{rating.toUpperCase()}</span>
                          </div>
                        )}
                        <div className="ai-result-text">{result.replace(/RATING:\s*(strong|partial|weak)/gi, "").trim()}</div>
                      </div>
                    )}
                  </div>
                </>
              )}
            </div>
          );
        })}

        {ratedSections.length >= 3 && (
          <div className="cta-bar">
            <h3>Ready for your full report?</h3>
            <p>Generate a complete audit report with a 30-day action plan, priority fixes, and expected reach improvement.</p>
            <div className="cta-actions">
              <button className="btn-primary" onClick={generateReport}>Generate Full Report</button>
              <button className="btn-secondary" onClick={copyReport}>Copy Raw Data</button>
            </div>
          </div>
        )}
      </div>

      {showReport && (
        <div className="report-modal" onClick={e => { if (e.target.className === "report-modal") setShowReport(false); }}>
          <div className="report-box">
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1.5rem" }}>
              <h3>Full Audit Report — {scoreVal}/100</h3>
              <button onClick={() => setShowReport(false)} style={{ background: "none", border: "none", color: COLORS.muted, fontSize: "22px", cursor: "pointer" }}>×</button>
            </div>

            {generatingReport ? (
              <div style={{ textAlign: "center", padding: "2rem", color: COLORS.muted }}>
                <div className="loading-dots" style={{ fontSize: "1.1rem" }}>Generating your report<span>.</span><span>.</span><span>.</span></div>
              </div>
            ) : (
              <>
                <div style={{ background: COLORS.surface, border: `1px solid ${COLORS.border}`, borderRadius: "12px", padding: "16px", marginBottom: "1.5rem" }}>
                  <div style={{ fontSize: "11px", color: COLORS.accent, textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: "10px", fontWeight: 600 }}>AI Analysis</div>
                  <div style={{ fontSize: "14px", color: COLORS.text, lineHeight: 1.7, whiteSpace: "pre-wrap" }}>{reportContent}</div>
                </div>
                <div style={{ marginBottom: "1.5rem" }}>
                  <div style={{ fontFamily: "Syne", fontSize: "14px", fontWeight: 600, marginBottom: "12px", color: COLORS.muted, textTransform: "uppercase", letterSpacing: "0.08em", fontSize: "11px" }}>Section Breakdown</div>
                  {SECTIONS.map(s => {
                    const r = ratings[s.id];
                    if (!r) return null;
                    return (
                      <div key={s.id} className="report-section">
                        <div className="report-section-name">
                          <span>{s.icon}</span>
                          <span>{s.name}</span>
                          <span className={`status-badge ${r === "strong" ? "sb-strong" : r === "partial" ? "sb-partial" : "sb-weak"}`}>{r}</span>
                        </div>
                        <div className="report-section-text">{aiResults[s.id]?.split("\n").slice(0, 4).join(" ") || ""}</div>
                      </div>
                    );
                  })}
                </div>
                <div className="cta-actions">
                  <button className="btn-primary" onClick={copyReport}>Copy Full Report</button>
                  <button className="btn-secondary" onClick={() => setShowReport(false)}>Close</button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
}
