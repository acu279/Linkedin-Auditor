import { useState, useRef } from "react";

const SECTIONS = [
  { id: "photo", name: "Profile Photo & Banner", icon: "📸", criteria: ["Professional headshot, not a selfie", "Face covers 60–70% of frame", "Custom banner (not default blue)", "Banner communicates niche or tagline"] },
  { id: "headline", name: "Headline", icon: "✍️", criteria: ["Not just a job title", "Contains who you help + outcome you create", "Has 2–3 searchable keywords", "Uses close to 220 character limit"] },
  { id: "about", name: "About / Summary", icon: "💬", criteria: ["Written in first person", "Covers who you are, what you do, who you help", "Keywords embedded naturally", "Ends with a call to action", "Long enough to trigger 'see more'"] },
  { id: "featured", name: "Featured Section", icon: "⭐", criteria: ["Section is turned on and filled", "Contains posts, articles, or portfolio links", "Most impressive work pinned first"] },
  { id: "experience", name: "Experience", icon: "💼", criteria: ["All roles have descriptions", "Descriptions have numbers and metrics", "Written as impact bullets not duty lists", "Media attached where relevant"] },
  { id: "education", name: "Education", icon: "🎓", criteria: ["Degree, institution, years filled", "Activities or description added", "Certifications from education included"] },
  { id: "skills", name: "Skills & Endorsements", icon: "🏷️", criteria: ["At least 10 skills added (50 allowed)", "Top 3 skills pinned and relevant", "Key skills have endorsements", "Skill names match recruiter search terms"] },
  { id: "recommendations", name: "Recommendations", icon: "💌", criteria: ["At least 3 recommendations", "From different role types", "Specific and not generic", "At least 1 from last 2 years"] },
  { id: "certifications", name: "Certifications", icon: "🏅", criteria: ["All relevant certifications listed", "Expiry dates filled in", "Credential URLs added"] },
  { id: "projects", name: "Projects", icon: "🔧", criteria: ["Projects section exists and is used", "Each project has title, description, outcome", "Links to live work attached"] },
  { id: "volunteer", name: "Volunteer Experience", icon: "❤️", criteria: ["Any volunteering added", "Organization, role, dates filled", "Description shows impact"] },
  { id: "languages", name: "Languages", icon: "🌐", criteria: ["All languages added", "Proficiency level set correctly"] },
  { id: "activity", name: "Activity & Content", icon: "📣", criteria: ["Posted or shared in last 30 days", "Commenting meaningfully on others posts", "At least 1 original post in last 90 days"] },
  { id: "seo", name: "Connection Strategy & SEO", icon: "🔍", criteria: ["500+ connections", "Custom LinkedIn URL set", "Location accurate", "Industry set correctly", "Open To Work configured if seeking"] },
];

const css = `
  @import url('https://fonts.googleapis.com/css2?family=Fraunces:ital,wght@0,300;0,400;0,500;1,300;1,400&family=DM+Sans:wght@300;400;500;600&display=swap');
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  :root {
    --bg: #F7F5F0; --surface: #FFFFFF; --border: #E8E4DC; --border2: #D4CFC4;
    --accent: #1A1A2E; --accent2: #4A4A8A;
    --green: #1E7A5C; --green-bg: #EAF5F0;
    --amber: #B8620A; --amber-bg: #FEF3E6;
    --red: #C0392B; --red-bg: #FDECEA;
    --text: #1A1A1A; --muted: #6B6560; --dim: #A09890;
    --shadow: 0 1px 3px rgba(0,0,0,0.06), 0 4px 16px rgba(0,0,0,0.04);
  }
  body { background: var(--bg); color: var(--text); font-family: 'DM Sans', sans-serif; min-height: 100vh; -webkit-font-smoothing: antialiased; }
  .app { max-width: 720px; margin: 0 auto; padding: 0 1rem 5rem; }
  .nav { display: flex; align-items: center; justify-content: space-between; padding: 1.5rem 0; margin-bottom: 1rem; border-bottom: 1px solid var(--border); }
  .nav-logo { font-family: 'Fraunces', serif; font-size: 1.1rem; font-weight: 500; color: var(--text); }
  .nav-logo span { color: var(--accent2); }
  .nav-badge { font-size: 11px; background: var(--accent); color: white; padding: 4px 10px; border-radius: 99px; font-weight: 500; letter-spacing: 0.04em; }
  .hero { padding: 3.5rem 0 2.5rem; }
  .hero-label { font-size: 12px; font-weight: 600; letter-spacing: 0.12em; text-transform: uppercase; color: var(--accent2); margin-bottom: 1rem; }
  .hero h1 { font-family: 'Fraunces', serif; font-size: clamp(2.2rem, 5vw, 3.2rem); font-weight: 400; line-height: 1.15; color: var(--text); margin-bottom: 1rem; letter-spacing: -0.02em; }
  .hero h1 em { font-style: italic; color: var(--accent2); }
  .hero p { font-size: 1rem; color: var(--muted); line-height: 1.65; max-width: 480px; }
  .how { margin: 2.5rem 0 2rem; }
  .how h2 { font-family: 'Fraunces', serif; font-size: 1rem; font-weight: 400; color: var(--muted); margin-bottom: 1.2rem; }
  .steps { display: grid; grid-template-columns: repeat(3,1fr); gap: 12px; }
  .step { background: var(--surface); border: 1px solid var(--border); border-radius: 14px; padding: 1.2rem; }
  .step-num { font-family: 'Fraunces', serif; font-size: 1.8rem; font-weight: 300; color: var(--border2); margin-bottom: 8px; }
  .step-title { font-size: 13px; font-weight: 600; color: var(--text); margin-bottom: 4px; }
  .step-desc { font-size: 12px; color: var(--muted); line-height: 1.5; }
  .upload-section { margin: 2rem 0; }
  .upload-tabs { display: flex; background: var(--surface); border: 1px solid var(--border); border-radius: 12px; padding: 4px; margin-bottom: 1.5rem; width: fit-content; gap: 0; }
  .upload-tab { padding: 8px 20px; border-radius: 9px; font-size: 13px; font-weight: 500; cursor: pointer; border: none; background: transparent; color: var(--muted); transition: all 0.15s; }
  .upload-tab.active { background: var(--accent); color: white; }
  .drop-zone { border: 2px dashed var(--border2); border-radius: 16px; padding: 3rem 2rem; text-align: center; cursor: pointer; transition: all 0.2s; background: var(--surface); }
  .drop-zone:hover, .drop-zone.dragging { border-color: var(--accent2); background: #F4F3FF; }
  .drop-icon { font-size: 2.5rem; margin-bottom: 1rem; }
  .drop-title { font-family: 'Fraunces', serif; font-size: 1.2rem; font-weight: 400; color: var(--text); margin-bottom: 0.4rem; }
  .drop-sub { font-size: 13px; color: var(--muted); }
  .drop-hint { margin-top: 1rem; font-size: 11px; color: var(--dim); background: var(--bg); padding: 6px 14px; border-radius: 99px; display: inline-block; line-height: 1.5; }
  .file-ready { background: var(--green-bg); border: 1px solid #B8DDD1; border-radius: 12px; padding: 14px 18px; display: flex; align-items: center; gap: 12px; margin-bottom: 1rem; }
  .file-ready-name { font-size: 14px; font-weight: 500; color: var(--green); flex: 1; }
  .file-ready-remove { background: none; border: none; color: var(--muted); cursor: pointer; font-size: 20px; }
  .url-box { display: flex; gap: 10px; }
  .url-input { flex: 1; background: var(--surface); border: 1px solid var(--border); border-radius: 12px; padding: 12px 16px; font-family: 'DM Sans', sans-serif; font-size: 14px; color: var(--text); outline: none; transition: border-color 0.15s; }
  .url-input:focus { border-color: var(--accent2); }
  .url-input::placeholder { color: var(--dim); }
  .analyze-btn { padding: 12px 24px; background: var(--accent); color: white; border: none; border-radius: 12px; font-family: 'DM Sans', sans-serif; font-size: 14px; font-weight: 600; cursor: pointer; transition: all 0.15s; white-space: nowrap; }
  .analyze-btn:hover:not(:disabled) { background: var(--accent2); transform: translateY(-1px); }
  .analyze-btn:disabled { opacity: 0.5; cursor: not-allowed; }
  .analyze-btn-full { width: 100%; margin-top: 1.2rem; padding: 14px; font-size: 15px; border-radius: 14px; }
  .analyzing-state { background: var(--surface); border: 1px solid var(--border); border-radius: 16px; padding: 3rem 2rem; text-align: center; margin-top: 1rem; }
  .spinner { width: 36px; height: 36px; border: 2px solid var(--border); border-top-color: var(--accent2); border-radius: 50%; animation: spin 0.8s linear infinite; margin: 0 auto 1.2rem; }
  @keyframes spin { to { transform: rotate(360deg); } }
  .analyzing-text { font-family: 'Fraunces', serif; font-size: 1.1rem; color: var(--text); margin-bottom: 6px; }
  .analyzing-sub { font-size: 13px; color: var(--muted); }
  .score-bar { background: var(--surface); border: 1px solid var(--border); border-radius: 16px; padding: 1.5rem; margin: 2rem 0; box-shadow: var(--shadow); display: flex; align-items: center; gap: 1.5rem; }
  .score-ring { position: relative; width: 80px; height: 80px; flex-shrink: 0; }
  .score-ring svg { width: 80px; height: 80px; transform: rotate(-90deg); }
  .score-ring-text { position: absolute; inset: 0; display: flex; flex-direction: column; align-items: center; justify-content: center; }
  .score-num { font-family: 'Fraunces', serif; font-size: 24px; font-weight: 500; color: var(--text); line-height: 1; }
  .score-denom { font-size: 10px; color: var(--dim); }
  .score-info { flex: 1; }
  .score-info h3 { font-family: 'Fraunces', serif; font-size: 1.1rem; font-weight: 500; margin-bottom: 4px; }
  .score-info p { font-size: 13px; color: var(--muted); }
  .score-pills { display: flex; gap: 6px; margin-top: 10px; flex-wrap: wrap; }
  .pill { font-size: 11px; font-weight: 500; padding: 3px 10px; border-radius: 99px; }
  .pill-g { background: var(--green-bg); color: var(--green); }
  .pill-a { background: var(--amber-bg); color: var(--amber); }
  .pill-r { background: var(--red-bg); color: var(--red); }
  .sections { display: flex; flex-direction: column; gap: 8px; }
  .sec-card { background: var(--surface); border: 1px solid var(--border); border-radius: 14px; overflow: hidden; transition: box-shadow 0.2s; }
  .sec-card:hover { box-shadow: var(--shadow); }
  .sec-card.rated-strong { border-left: 3px solid var(--green); }
  .sec-card.rated-partial { border-left: 3px solid var(--amber); }
  .sec-card.rated-weak { border-left: 3px solid var(--red); }
  .sec-header { display: flex; align-items: center; gap: 12px; padding: 14px 16px; cursor: pointer; user-select: none; }
  .sec-icon { font-size: 18px; width: 34px; height: 34px; background: var(--bg); border-radius: 8px; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
  .sec-name { flex: 1; font-size: 14px; font-weight: 500; }
  .sec-badge { font-size: 11px; font-weight: 600; padding: 3px 10px; border-radius: 99px; }
  .sb-none { background: var(--bg); color: var(--dim); }
  .sb-strong { background: var(--green-bg); color: var(--green); }
  .sb-partial { background: var(--amber-bg); color: var(--amber); }
  .sb-weak { background: var(--red-bg); color: var(--red); }
  .sec-chev { color: var(--dim); font-size: 16px; transition: transform 0.2s; }
  .sec-chev.open { transform: rotate(180deg); }
  .sec-body { display: none; border-top: 1px solid var(--border); }
  .sec-body.open { display: block; }
  .sec-body-inner { padding: 16px; }
  .criteria { display: flex; flex-direction: column; gap: 4px; margin-bottom: 14px; list-style: none; }
  .criteria li { font-size: 12px; color: var(--muted); display: flex; gap: 8px; align-items: flex-start; line-height: 1.5; }
  .criteria li::before { content: '→'; color: var(--dim); flex-shrink: 0; font-size: 11px; margin-top: 2px; }
  .ai-box { background: var(--bg); border-radius: 12px; padding: 16px; }
  .ai-box-label { font-size: 11px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.1em; color: var(--accent2); margin-bottom: 10px; }
  .ai-rating-badge { font-size: 12px; font-weight: 700; padding: 4px 12px; border-radius: 99px; display: inline-block; margin-bottom: 10px; }
  .ai-text { font-size: 13px; color: var(--text); line-height: 1.75; white-space: pre-wrap; }
  .cta { background: var(--accent); color: white; border-radius: 20px; padding: 2.5rem; text-align: center; margin-top: 2.5rem; }
  .cta h3 { font-family: 'Fraunces', serif; font-size: 1.4rem; font-weight: 400; margin-bottom: 0.5rem; }
  .cta p { font-size: 14px; opacity: 0.75; margin-bottom: 1.5rem; line-height: 1.6; }
  .cta-btns { display: flex; gap: 10px; justify-content: center; flex-wrap: wrap; }
  .btn-white { padding: 12px 28px; background: white; color: var(--accent); border: none; border-radius: 10px; font-family: 'DM Sans', sans-serif; font-size: 14px; font-weight: 600; cursor: pointer; }
  .btn-ghost { padding: 12px 28px; background: transparent; color: white; border: 1px solid rgba(255,255,255,0.3); border-radius: 10px; font-family: 'DM Sans', sans-serif; font-size: 14px; cursor: pointer; }
  .modal-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.4); backdrop-filter: blur(4px); display: flex; align-items: center; justify-content: center; z-index: 100; padding: 1rem; }
  .modal { background: var(--surface); border-radius: 20px; padding: 2rem; max-width: 640px; width: 100%; max-height: 85vh; overflow-y: auto; }
  .modal-header { display: flex; align-items: flex-start; justify-content: space-between; margin-bottom: 1.5rem; }
  .modal-title { font-family: 'Fraunces', serif; font-size: 1.4rem; font-weight: 400; }
  .modal-close { background: none; border: none; font-size: 24px; color: var(--muted); cursor: pointer; }
  .modal-score-row { background: var(--bg); border-radius: 12px; padding: 14px 18px; margin-bottom: 1.5rem; display: flex; align-items: center; gap: 12px; }
  .modal-score-num { font-family: 'Fraunces', serif; font-size: 2rem; font-weight: 400; }
  .modal-report-text { font-size: 14px; color: var(--text); line-height: 1.8; white-space: pre-wrap; background: var(--bg); border-radius: 12px; padding: 16px; margin-bottom: 1.5rem; }
  .modal-sec { margin-bottom: 1.2rem; padding-bottom: 1.2rem; border-bottom: 1px solid var(--border); }
  .modal-sec:last-child { border-bottom: none; }
  .modal-sec-name { font-size: 13px; font-weight: 600; margin-bottom: 6px; display: flex; align-items: center; gap: 8px; }
  .modal-sec-text { font-size: 13px; color: var(--muted); line-height: 1.6; }
  .modal-actions { display: flex; gap: 10px; }
  .btn-outline { padding: 10px 20px; background: transparent; border: 1px solid var(--border2); border-radius: 10px; font-family: 'DM Sans', sans-serif; font-size: 13px; font-weight: 500; color: var(--text); cursor: pointer; }
  .loading-state { text-align: center; padding: 2rem; }
  .spinner-sm { width: 28px; height: 28px; border: 2px solid var(--border); border-top-color: var(--accent2); border-radius: 50%; animation: spin 0.8s linear infinite; margin: 0 auto 1rem; }
  @media (max-width: 580px) { .steps { grid-template-columns: 1fr; } .score-bar { flex-direction: column; text-align: center; } .url-box { flex-direction: column; } }
`;

function ScoreRing({ score }) {
  const r = 30, circ = 2 * Math.PI * r;
  const filled = (score / 100) * circ;
  const color = score >= 70 ? "#1E7A5C" : score >= 45 ? "#B8620A" : "#C0392B";
  return (
    <div className="score-ring">
      <svg viewBox="0 0 80 80">
        <circle cx="40" cy="40" r={r} fill="none" stroke="#E8E4DC" strokeWidth="6" />
        <circle cx="40" cy="40" r={r} fill="none" stroke={color} strokeWidth="6"
          strokeDasharray={`${filled} ${circ}`} strokeLinecap="round"
          style={{ transition: "stroke-dasharray 0.6s ease" }} />
      </svg>
      <div className="score-ring-text">
        <span className="score-num">{score}</span>
        <span className="score-denom">/ 100</span>
      </div>
    </div>
  );
}

function getLabel(s) {
  if (s >= 85) return "LinkedIn All-Star 🏆";
  if (s >= 70) return "Strong Profile 💪";
  if (s >= 50) return "Good Progress 📈";
  if (s >= 25) return "Needs Work 🔧";
  return "Just Getting Started";
}

export default function App() {
  const [tab, setTab] = useState("pdf");
  const [pdfFile, setPdfFile] = useState(null);
  const [pdfBase64, setPdfBase64] = useState(null);
  const [url, setUrl] = useState("");
  const [dragging, setDragging] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);
  const [loadingMsg, setLoadingMsg] = useState("");
  const [analyzed, setAnalyzed] = useState(false);
  const [ratings, setRatings] = useState({});
  const [aiResults, setAiResults] = useState({});
  const [openSec, setOpenSec] = useState(null);
  const [showReport, setShowReport] = useState(false);
  const [reportText, setReportText] = useState("");
  const [generatingReport, setGeneratingReport] = useState(false);
  const fileRef = useRef();

  const rated = Object.keys(ratings);
  const strong = rated.filter(k => ratings[k] === "strong").length;
  const partial = rated.filter(k => ratings[k] === "partial").length;
  const weak = rated.filter(k => ratings[k] === "weak").length;
  const score = rated.length === 0 ? 0 : Math.round((strong * 100 + partial * 55 + weak * 10) / SECTIONS.length);

  function handleFile(file) {
    if (!file || file.type !== "application/pdf") { alert("Please upload a PDF file."); return; }
    setPdfFile(file);
    const reader = new FileReader();
    reader.onload = e => setPdfBase64(e.target.result.split(",")[1]);
    reader.readAsDataURL(file);
  }

  async function callGemini(prompt) {
    const resp = await fetch("/api/analyze", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ prompt })
    });
    const data = await resp.json();
    if (data.error) throw new Error(data.error);
    return data.text || "";
  }

  async function runAudit() {
    if (tab === "pdf" && !pdfBase64) { alert("Please upload your LinkedIn PDF first."); return; }
    if (tab === "url" && !url.trim()) { alert("Please enter your LinkedIn profile URL."); return; }
    setAnalyzing(true);
    const msgs = ["Reading your profile...", "Analyzing all 14 sections...", "Scoring each section...", "Almost done..."];
    let mi = 0;
    setLoadingMsg(msgs[0]);
    const iv = setInterval(() => { mi = (mi + 1) % msgs.length; setLoadingMsg(msgs[mi]); }, 3500);
    try {
      const context = tab === "url"
        ? `LinkedIn profile URL: ${url}. Analyze based on what a typical LinkedIn profile would contain and what is commonly missing.`
        : `The user has uploaded their LinkedIn profile as a PDF (base64 attached). Analyze all sections visible in the PDF.`;

      const prompt = `You are a brutally honest LinkedIn profile expert and HR professional.
${context}

Audit ALL 14 sections below. For EACH section provide feedback in EXACTLY this format:

SECTION: [exact section name from list]
RATING: [strong OR partial OR weak]
SCORE: [X/10]
WHAT'S WORKING: [1 line, or "Nothing visible yet" if not present]
FIX THIS NOW:
- [specific fix 1 with example wording]
- [specific fix 2 with example wording]
QUICK WIN: [one action doable in 5 minutes]
---

Sections to audit:
${SECTIONS.map((s, i) => `${i + 1}. ${s.name} — check for: ${s.criteria.join(", ")}`).join("\n")}

Be brutally specific. No fluff. If a section is missing from the profile, rate it weak.`;

      const text = await callGemini(prompt);
      const parts = text.split(/\n---+\n?/).filter(p => p.trim().length > 20);
      const newRatings = {};
      const newResults = {};

      SECTIONS.forEach((sec, i) => {
        const part = parts[i] || parts[Math.min(i, parts.length - 1)] || "";
        const rMatch = part.match(/RATING:\s*(strong|partial|weak)/i);
        newRatings[sec.id] = rMatch ? rMatch[1].toLowerCase() : "partial";
        newResults[sec.id] = part.replace(/SECTION:[^\n]*\n?/i, "").replace(/RATING:[^\n]*\n?/i, "").trim();
      });

      setRatings(newRatings);
      setAiResults(newResults);
      setAnalyzed(true);
      setOpenSec(SECTIONS[0].id);
    } catch (err) {
      alert("Error: " + err.message);
    }
    clearInterval(iv);
    setAnalyzing(false);
  }

  async function generateReport() {
    setGeneratingReport(true);
    setShowReport(true);
    try {
      const summary = SECTIONS.map(s => `${s.name}: ${ratings[s.id] || "not rated"}\n${aiResults[s.id] || ""}`).join("\n\n---\n\n");
      const prompt = `LinkedIn audit results:\n\n${summary}\n\nWrite a full report with:\n1. OVERALL VERDICT (3 honest sentences)\n2. TOP 3 STRENGTHS\n3. TOP 3 CRITICAL FIXES (ranked by impact)\n4. 30-DAY ACTION PLAN (Week 1–4 with specific tasks)\n5. EXPECTED REACH IMPACT (realistic numbers)\n\nBe direct and specific. No generic advice.`;
      const text = await callGemini(prompt);
      setReportText(text);
    } catch (e) {
      setReportText("Could not generate report. Please try again.");
    }
    setGeneratingReport(false);
  }

  function reset() {
    setAnalyzed(false); setRatings({}); setAiResults({});
    setPdfFile(null); setPdfBase64(null); setUrl(""); setOpenSec(null);
  }

  function copyReport() {
    const lines = SECTIONS.map(s => `## ${s.name} — ${(ratings[s.id] || "").toUpperCase()}\n${aiResults[s.id] || ""}`).join("\n\n");
    navigator.clipboard?.writeText(`LINKEDIN AUDIT — Score: ${score}/100\n\n${lines}\n\n---\n${reportText}`);
    alert("Copied!");
  }

  return (
    <>
      <style>{css}</style>
      <div className="app">
        <nav className="nav">
          <div className="nav-logo">LinkedIn <span>Auditor</span></div>
          <div className="nav-badge">Free · AI-Powered</div>
        </nav>

        {!analyzed && !analyzing && (
          <>
            <div className="hero">
              <div className="hero-label">14-Section Deep Audit</div>
              <h1>Your LinkedIn profile,<br /><em>honestly scored.</em></h1>
              <p>Upload your LinkedIn PDF or paste your profile URL. Get AI feedback on all 14 sections — free, instant, no signup needed.</p>
            </div>
            <div className="how">
              <h2>How it works</h2>
              <div className="steps">
                <div className="step"><div className="step-num">01</div><div className="step-title">Upload PDF or paste URL</div><div className="step-desc">Download your LinkedIn PDF in 30 seconds from LinkedIn settings</div></div>
                <div className="step"><div className="step-num">02</div><div className="step-title">AI audits all 14 sections</div><div className="step-desc">Gets scored on every section with specific, actionable fixes</div></div>
                <div className="step"><div className="step-num">03</div><div className="step-title">Get your action plan</div><div className="step-desc">30-day week-by-week plan to go from invisible to All-Star</div></div>
              </div>
            </div>
            <div className="upload-section">
              <div className="upload-tabs">
                <button className={`upload-tab ${tab === "pdf" ? "active" : ""}`} onClick={() => setTab("pdf")}>📄 Upload PDF</button>
                <button className={`upload-tab ${tab === "url" ? "active" : ""}`} onClick={() => setTab("url")}>🔗 Paste URL</button>
              </div>
              {tab === "pdf" && (
                <>
                  {pdfFile ? (
                    <div className="file-ready">
                      <span style={{fontSize:"20px"}}>✅</span>
                      <span className="file-ready-name">{pdfFile.name}</span>
                      <button className="file-ready-remove" onClick={() => { setPdfFile(null); setPdfBase64(null); }}>×</button>
                    </div>
                  ) : (
                    <div className={`drop-zone ${dragging ? "dragging" : ""}`}
                      onDragOver={e => { e.preventDefault(); setDragging(true); }}
                      onDragLeave={() => setDragging(false)}
                      onDrop={e => { e.preventDefault(); setDragging(false); handleFile(e.dataTransfer.files[0]); }}
                      onClick={() => fileRef.current.click()}>
                      <input ref={fileRef} type="file" accept=".pdf" style={{display:"none"}} onChange={e => handleFile(e.target.files[0])} />
                      <div className="drop-icon">📄</div>
                      <div className="drop-title">Drop your LinkedIn PDF here</div>
                      <div className="drop-sub">or click to browse</div>
                      <div className="drop-hint">LinkedIn → Me → Settings & Privacy → Data Privacy → Get a copy of your data → Profile</div>
                    </div>
                  )}
                  <button className="analyze-btn analyze-btn-full" disabled={!pdfFile} onClick={runAudit}>Audit My Profile →</button>
                </>
              )}
              {tab === "url" && (
                <>
                  <div className="url-box">
                    <input className="url-input" placeholder="https://linkedin.com/in/yourname" value={url} onChange={e => setUrl(e.target.value)} />
                    <button className="analyze-btn" disabled={!url.trim()} onClick={runAudit}>Audit →</button>
                  </div>
                  <p style={{fontSize:"12px",color:"var(--dim)",marginTop:"10px",lineHeight:1.6}}>Note: PDF upload gives more accurate results. URL analysis is based on AI estimation of typical profile patterns.</p>
                </>
              )}
            </div>
          </>
        )}

        {analyzing && (
          <div className="analyzing-state">
            <div className="spinner" />
            <div className="analyzing-text">{loadingMsg}</div>
            <div className="analyzing-sub">Analyzing all 14 LinkedIn sections...</div>
          </div>
        )}

        {analyzed && (
          <>
            <div className="score-bar">
              <ScoreRing score={score} />
              <div className="score-info">
                <h3>{getLabel(score)}</h3>
                <p>{rated.length} of {SECTIONS.length} sections analyzed</p>
                <div className="score-pills">
                  {strong > 0 && <span className="pill pill-g">✓ {strong} Strong</span>}
                  {partial > 0 && <span className="pill pill-a">~ {partial} Partial</span>}
                  {weak > 0 && <span className="pill pill-r">✗ {weak} Weak</span>}
                </div>
              </div>
            </div>
            <div className="sections">
              {SECTIONS.map((sec, i) => {
                const r = ratings[sec.id];
                const isOpen = openSec === sec.id;
                return (
                  <div key={sec.id} className={`sec-card${r ? " rated-" + r : ""}`}>
                    <div className="sec-header" onClick={() => setOpenSec(isOpen ? null : sec.id)}>
                      <div className="sec-icon">{sec.icon}</div>
                      <div className="sec-name">{i + 1}. {sec.name}</div>
                      <span className={`sec-badge ${r === "strong" ? "sb-strong" : r === "partial" ? "sb-partial" : r === "weak" ? "sb-weak" : "sb-none"}`}>
                        {r ? r.charAt(0).toUpperCase() + r.slice(1) : "—"}
                      </span>
                      <span className={`sec-chev ${isOpen ? "open" : ""}`}>▾</span>
                    </div>
                    <div className={`sec-body ${isOpen ? "open" : ""}`}>
                      <div className="sec-body-inner">
                        <ul className="criteria">{sec.criteria.map((c, ci) => <li key={ci}>{c}</li>)}</ul>
                        {aiResults[sec.id] && (
                          <div className="ai-box">
                            <div className="ai-box-label">AI Feedback</div>
                            {r && <div className="ai-rating-badge" style={{
                              background: r === "strong" ? "var(--green-bg)" : r === "partial" ? "var(--amber-bg)" : "var(--red-bg)",
                              color: r === "strong" ? "var(--green)" : r === "partial" ? "var(--amber)" : "var(--red)"
                            }}>{r.toUpperCase()}</div>}
                            <div className="ai-text">{aiResults[sec.id]}</div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
            <div className="cta">
              <h3>Get your full 30-day action plan</h3>
              <p>A complete report with priority fixes, week-by-week tasks, and expected reach improvement.</p>
              <div className="cta-btns">
                <button className="btn-white" onClick={generateReport}>Generate Report</button>
                <button className="btn-ghost" onClick={reset}>Start Over</button>
              </div>
            </div>
          </>
        )}
      </div>

      {showReport && (
        <div className="modal-overlay" onClick={e => { if (e.target.className === "modal-overlay") setShowReport(false); }}>
          <div className="modal">
            <div className="modal-header">
              <div className="modal-title">Your Audit Report</div>
              <button className="modal-close" onClick={() => setShowReport(false)}>×</button>
            </div>
            <div className="modal-score-row">
              <div className="modal-score-num">{score}/100</div>
              <div style={{fontSize:"14px",color:"var(--muted)"}}>{getLabel(score)}</div>
            </div>
            {generatingReport ? (
              <div className="loading-state">
                <div className="spinner-sm" />
                <div style={{fontSize:"14px",color:"var(--muted)"}}>Writing your 30-day plan...</div>
              </div>
            ) : (
              <>
                <div className="modal-report-text">{reportText}</div>
                <div style={{marginBottom:"1.5rem"}}>
                  <div style={{fontSize:"11px",fontWeight:600,textTransform:"uppercase",letterSpacing:"0.1em",color:"var(--muted)",marginBottom:"12px"}}>Section Breakdown</div>
                  {SECTIONS.map(s => {
                    const r = ratings[s.id];
                    if (!r) return null;
                    return (
                      <div key={s.id} className="modal-sec">
                        <div className="modal-sec-name">
                          <span>{s.icon}</span><span>{s.name}</span>
                          <span className={`sec-badge ${r === "strong" ? "sb-strong" : r === "partial" ? "sb-partial" : "sb-weak"}`}>{r}</span>
                        </div>
                        <div className="modal-sec-text">{(aiResults[s.id] || "").split("\n").slice(0, 3).join(" ")}</div>
                      </div>
                    );
                  })}
                </div>
                <div className="modal-actions">
                  <button className="analyze-btn" onClick={copyReport}>Copy Full Report</button>
                  <button className="btn-outline" onClick={() => setShowReport(false)}>Close</button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
}
