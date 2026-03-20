// JobsPage.jsx — Flat Style Modern
import { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Briefcase, MapPin, Clock, Users, Search, Bookmark,
  ChefHat, Utensils, Bike, Filter, X, Zap, CheckCircle,
  User, Shield, ArrowRight, TrendingUp, ExternalLink,
} from "lucide-react";
import { useCurrency } from "@/context/CurrencyContext";

/* ─── CSS ────────────────────────────────────────────────────── */
const css = `
  @import url('https://fonts.googleapis.com/css2?family=Sora:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap');

  .jobs-root {
    --p:      hsl(var(--primary));
    --p-10:   hsl(var(--primary) / .10);
    --p-20:   hsl(var(--primary) / .20);
    --p-fg:   hsl(var(--primary-foreground));
    --ink:    #0f172a;
    --ink-2:  #64748b;
    --ink-3:  #94a3b8;
    --line:   #e2e8f0;
    --bg:     #f8fafc;
    font-family: 'Sora', sans-serif;
  }

  /* ── page header ── */
  .jobs-header {
    background: var(--p);
    color: var(--p-fg);
    padding: 40px 24px 36px;
  }
  .jobs-header h1 {
    font-size: clamp(22px, 4vw, 32px);
    font-weight: 700;
    letter-spacing: -.02em;
    margin: 0 0 6px;
  }
  .jobs-header p { font-size: 14px; opacity: .78; margin: 0; }

  /* ── stat pills (header) ── */
  .stat-pills {
    display: flex; flex-wrap: wrap; gap: 8px;
    margin-top: 20px;
  }
  .stat-pill {
    display: inline-flex; align-items: center; gap: 6px;
    padding: 5px 12px;
    background: rgba(255,255,255,.15);
    border-radius: 4px;
    font-size: 12px; font-weight: 600;
  }

  /* ── search bar ── */
  .search-wrap {
    position: relative; margin-top: 20px;
  }
  .search-wrap svg {
    position: absolute; left: 14px; top: 50%;
    transform: translateY(-50%);
    color: var(--ink-3);
    pointer-events: none;
  }
  .search-input {
    width: 100%; max-width: 480px;
    padding: 10px 16px 10px 42px;
    border: none; border-radius: 4px;
    font-family: 'Sora', sans-serif;
    font-size: 13px;
    outline: none;
    background: white;
    color: var(--ink);
  }
  .search-input::placeholder { color: var(--ink-3); }

  /* ── filter bar ── */
  .filter-bar {
    background: white;
    border-bottom: 1.5px solid var(--line);
    padding: 0 24px;
    display: flex; align-items: center; gap: 0;
    overflow-x: auto;
    scrollbar-width: none;
  }
  .filter-bar::-webkit-scrollbar { display: none; }

  .filter-group {
    display: flex; align-items: center; gap: 0;
    border-right: 1.5px solid var(--line);
    padding: 0 16px 0 0;
    margin-right: 16px;
    flex-shrink: 0;
  }
  .filter-group:last-child { border-right: none; }
  .filter-label {
    font-size: 11px; font-weight: 700;
    text-transform: uppercase; letter-spacing: .06em;
    color: var(--ink-3); margin-right: 8px; white-space: nowrap;
  }

  .chip {
    display: inline-flex; align-items: center; gap: 5px;
    padding: 6px 12px;
    border-radius: 3px;
    font-size: 12px; font-weight: 600;
    cursor: pointer;
    border: none; background: none;
    color: var(--ink-2);
    white-space: nowrap;
    transition: background .12s, color .12s;
    font-family: 'Sora', sans-serif;
    height: 44px;
  }
  .chip:hover { background: var(--p-10); color: var(--p); }
  .chip.active {
    background: var(--p);
    color: var(--p-fg);
  }
  .chip-count {
    font-family: 'JetBrains Mono', monospace;
    font-size: 10px; opacity: .7;
  }

  /* ── results bar ── */
  .results-bar {
    display: flex; align-items: center; justify-content: space-between;
    padding: 14px 24px;
    font-size: 13px;
    background: var(--bg);
    border-bottom: 1.5px solid var(--line);
    flex-wrap: wrap; gap: 8px;
  }
  .results-count {
    font-weight: 700; color: var(--ink);
    font-family: 'JetBrains Mono', monospace;
    font-size: 14px;
  }
  .reset-btn {
    display: inline-flex; align-items: center; gap: 5px;
    padding: 5px 10px; border-radius: 3px;
    border: 1.5px solid var(--line);
    background: white; color: var(--ink-2);
    font-size: 11px; font-weight: 600;
    cursor: pointer; font-family: 'Sora', sans-serif;
    transition: border-color .12s, color .12s;
    letter-spacing: .03em;
  }
  .reset-btn:hover { border-color: var(--p); color: var(--p); }

  /* ── job list ── */
  .job-list { padding: 20px 24px; display: flex; flex-direction: column; gap: 10px; }

  /* ── job card ── */
  .job-card {
    display: grid;
    grid-template-columns: 44px 1fr auto;
    gap: 14px;
    align-items: start;
    padding: 16px;
    background: white;
    border: 1.5px solid var(--line);
    border-radius: 6px;
    transition: border-color .15s, box-shadow .15s;
    text-decoration: none; color: inherit;
    cursor: default;
  }
  .job-card:hover {
    border-color: var(--p);
    box-shadow: 0 2px 12px hsl(var(--primary) / .10);
  }

  /* logo icon */
  .job-logo {
    width: 44px; height: 44px; border-radius: 6px;
    display: flex; align-items: center; justify-content: center;
    flex-shrink: 0;
    font-size: 18px;
  }

  /* body */
  .job-title {
    font-size: 15px; font-weight: 700; color: var(--ink);
    margin: 0 0 2px; line-height: 1.3;
  }
  .job-restaurant {
    font-size: 12px; color: var(--ink-2); margin: 0 0 8px;
    display: flex; align-items: center; gap: 6px;
  }
  .job-meta {
    display: flex; flex-wrap: wrap; gap: 6px;
    align-items: center;
  }

  /* tags */
  .tag {
    display: inline-flex; align-items: center; gap: 4px;
    padding: 3px 8px; border-radius: 3px;
    font-size: 11px; font-weight: 600;
    border: 1.5px solid var(--line);
    color: var(--ink-2); background: var(--bg);
  }
  .tag.cat-cuisine    { border-color: #fed7aa; background: #fff7ed; color: #c2410c; }
  .tag.cat-service    { border-color: #bfdbfe; background: #eff6ff; color: #1d4ed8; }
  .tag.cat-livraison  { border-color: #bbf7d0; background: #f0fdf4; color: #15803d; }
  .tag.cat-management { border-color: #ddd6fe; background: #faf5ff; color: #7c3aed; }
  .tag.type-cdi       { border-color: #a7f3d0; background: #ecfdf5; color: #065f46; }
  .tag.type-cdd       { border-color: #fde68a; background: #fffbeb; color: #92400e; }
  .tag.type-freelance { border-color: #e5e7eb; background: #f9fafb; color: #374151; }
  .tag.type-app       { border-color: #dbeafe; background: #eff6ff; color: #1e40af; }
  .tag.urgent         { border-color: #fecaca; background: #fef2f2; color: #dc2626; animation: pulse 2s infinite; }

  @keyframes pulse {
    0%, 100% { opacity: 1; }
    50% { opacity: .65; }
  }

  /* right col */
  .job-right {
    display: flex; flex-direction: column; align-items: flex-end;
    gap: 8px; flex-shrink: 0;
  }
  .job-salary {
    font-family: 'JetBrains Mono', monospace;
    font-size: 13px; font-weight: 600; color: var(--p);
    white-space: nowrap; text-align: right;
  }
  .job-salary-sub {
    font-family: 'JetBrains Mono', monospace;
    font-size: 10px; color: var(--ink-3); text-align: right;
    white-space: nowrap;
  }
  .job-date { font-size: 11px; color: var(--ink-3); white-space: nowrap; }

  /* save btn */
  .save-btn {
    background: none; border: none; padding: 4px; cursor: pointer;
    color: var(--ink-3); border-radius: 3px;
    transition: color .12s, background .12s;
    display: flex;
  }
  .save-btn:hover { color: var(--p); background: var(--p-10); }
  .save-btn.saved { color: var(--p); }

  /* apply btn */
  .apply-btn {
    display: inline-flex; align-items: center; gap: 6px;
    padding: 7px 14px;
    background: var(--p); color: var(--p-fg);
    border: none; border-radius: 4px;
    font-family: 'Sora', sans-serif;
    font-size: 12px; font-weight: 700;
    cursor: pointer; white-space: nowrap;
    transition: opacity .12s;
    text-decoration: none;
  }
  .apply-btn:hover { opacity: .88; }

  /* ── empty state ── */
  .empty-state {
    padding: 60px 24px; text-align: center;
  }
  .empty-icon {
    width: 64px; height: 64px; border-radius: 8px;
    background: var(--p-10); color: var(--p);
    display: flex; align-items: center; justify-content: center;
    margin: 0 auto 20px;
  }
  .empty-state h3 { font-size: 18px; font-weight: 700; margin: 0 0 6px; }
  .empty-state p  { font-size: 13px; color: var(--ink-2); margin: 0 0 20px; }

  /* ── CTA banner ── */
  .cta-banner {
    margin: 8px 24px 24px;
    padding: 20px 24px;
    border: 1.5px solid var(--p-20);
    border-radius: 6px;
    background: var(--p-10);
    display: flex; justify-content: space-between; align-items: center;
    flex-wrap: wrap; gap: 16px;
  }
  .cta-banner h3 { font-size: 15px; font-weight: 700; margin: 0 0 3px; color: var(--ink); }
  .cta-banner p  { font-size: 12px; color: var(--ink-2); margin: 0; }
  .cta-actions   { display: flex; gap: 8px; flex-wrap: wrap; }

  /* ── tips aside (inside cards on mobile hidden, inline on desktop) ── */
  .tips-strip {
    margin: 0 24px 8px;
    padding: 12px 16px;
    border: 1.5px solid var(--line);
    border-radius: 6px;
    background: white;
    display: flex; gap: 24px; flex-wrap: wrap;
  }
  .tip-item {
    display: flex; align-items: center; gap: 8px;
    font-size: 12px; color: var(--ink-2);
  }
  .tip-icon {
    width: 28px; height: 28px; border-radius: 4px;
    display: flex; align-items: center; justify-content: center;
    background: var(--p-10); color: var(--p); flex-shrink: 0;
  }

  /* ── responsive ── */
  .job-right-mobile {
    display: none;
  }

  @media (max-width: 600px) {
    .job-card { grid-template-columns: 36px 1fr; }
    .job-right { display: none; }
    .job-right-mobile {
      grid-column: 1 / -1;
      display: flex; justify-content: space-between; align-items: center;
      padding-top: 10px; border-top: 1px solid var(--line); margin-top: 4px;
    }
  }
`;

/* ─── Data ───────────────────────────────────────────────────── */
const restaurants = [
  { id: 1, name: "Le Dakarois",   cuisine: "Africain",  color: "#ea580c", icon: "🍛" },
  { id: 2, name: "Burger House",  cuisine: "Fast-food", color: "#dc2626", icon: "🍔" },
  { id: 3, name: "Pizzeria Roma", cuisine: "Italien",   color: "#16a34a", icon: "🍕" },
  { id: 4, name: "Sushi Zen",     cuisine: "Japonais",  color: "#2563eb", icon: "🍱" },
  { id: 5, name: "Café de Paris", cuisine: "Café",      color: "#d97706", icon: "☕" },
];

const jobOffers = [
  {
    id: 1,  title: "Cuisinier Senior",       restaurantId: 1,
    type: "CDI",          category: "Cuisine",     location: "Plateau, Dakar",
    salaryRaw: 350000,    salaryLabel: "300K–400K", experience: "3–5 ans",
    description: "Cuisinier expérimenté pour notre cuisine traditionnelle sénégalaise.",
    skills: ["Cuisine africaine", "Gestion de brigade", "HACCP"],
    postedDate: "il y a 2 j", urgent: true,  schedule: "Temps plein",
  },
  {
    id: 2,  title: "Serveur / Serveuse",      restaurantId: 2,
    type: "CDD",          category: "Service",     location: "Almadies, Dakar",
    salaryRaw: 175000,    salaryLabel: "150K–200K", experience: "1–2 ans",
    description: "Serveurs dynamiques pour notre restaurant burger en pleine croissance.",
    skills: ["Accueil client", "Service de table", "Caisse"],
    postedDate: "il y a 5 j", urgent: false, schedule: "Temps plein",
  },
  {
    id: 3,  title: "Livreur à vélo",           restaurantId: 3,
    type: "Freelance",    category: "Livraison",   location: "Point E, Dakar",
    salaryRaw: null,      salaryLabel: "À la course", experience: "Débutant OK",
    description: "Livreurs à vélo pour livraisons de pizzas — horaires flexibles.",
    skills: ["Connaissance ville", "Ponctualité", "Service client"],
    postedDate: "il y a 1 sem", urgent: true,  schedule: "Flexible",
  },
  {
    id: 4,  title: "Apprenti Sushi Chef",       restaurantId: 4,
    type: "Apprentissage", category: "Cuisine",    location: "Ouakam, Dakar",
    salaryRaw: null,      salaryLabel: "Formation rémunérée", experience: "Étudiant/Débutant",
    description: "Formation complète en préparation de sushis pour profil motivé.",
    skills: ["Précision", "Hygiène", "Passion cuisine"],
    postedDate: "il y a 3 j", urgent: false, schedule: "Temps plein",
  },
  {
    id: 5,  title: "Livreur en scooter",        restaurantId: 2,
    type: "CDI",          category: "Livraison",   location: "Grand Dakar",
    salaryRaw: 275000,    salaryLabel: "250K–300K", experience: "1 an min.",
    description: "Livreur avec scooter personnel pour livraisons express toute la ville.",
    skills: ["Permis scooter", "GPS", "Gestion commandes"],
    postedDate: "il y a 1 j", urgent: true,  schedule: "Rotation",
  },
  {
    id: 6,  title: "Responsable de salle",      restaurantId: 5,
    type: "CDI",          category: "Management",  location: "Plateau, Dakar",
    salaryRaw: 450000,    salaryLabel: "400K–500K", experience: "5–7 ans",
    description: "Gestion d'équipe et organisation du service en salle de brasserie.",
    skills: ["Management", "Planification", "Formation équipe"],
    postedDate: "il y a 2 sem", urgent: false, schedule: "Temps plein",
  },
  {
    id: 7,  title: "Plongeur / Pizzaïolo",      restaurantId: 3,
    type: "CDD",          category: "Cuisine",     location: "Point E, Dakar",
    salaryRaw: 200000,    salaryLabel: "180K–220K", experience: "Débutant OK",
    description: "Poste polyvalent : préparation des pizzas et plonge en équipe.",
    skills: ["Travail d'équipe", "Rapidité", "Hygiène"],
    postedDate: "il y a 4 j", urgent: false, schedule: "Soirs & week-ends",
  },
  {
    id: 8,  title: "Livreur voiture",           restaurantId: 4,
    type: "Freelance",    category: "Livraison",   location: "Grand Dakar",
    salaryRaw: null,      salaryLabel: "À la course + bonus", experience: "2 ans min.",
    description: "Livreur avec véhicule personnel pour grandes commandes multiples.",
    skills: ["Permis B", "Véhicule personnel", "Organisation"],
    postedDate: "il y a 6 j", urgent: false, schedule: "Flexible",
  },
];

/* ─── Helpers ────────────────────────────────────────────────── */
const CATEGORIES = ["Tous", "Cuisine", "Service", "Livraison", "Management"];
const TYPES      = ["Tous", "CDI", "CDD", "Freelance", "Apprentissage"];

const catClass = (c) => ({
  Cuisine: "cat-cuisine", Service: "cat-service",
  Livraison: "cat-livraison", Management: "cat-management",
}[c] || "");

const typeClass = (t) => ({
  CDI: "type-cdi", CDD: "type-cdd",
  Freelance: "type-freelance", Apprentissage: "type-app",
}[t] || "");

const catIcon = (c) => ({
  Cuisine: <ChefHat size={14} />, Service: <Utensils size={14} />,
  Livraison: <Bike size={14} />,  Management: <Users size={14} />,
}[c] || <Briefcase size={14} />);

/* ─── Component ─────────────────────────────────────────────── */
const JobsPage = () => {
  const { formatPrice } = useCurrency();

  const [savedJobs,  setSavedJobs]  = useState([]);
  const [search,     setSearch]     = useState("");
  const [selCat,     setSelCat]     = useState("Tous");
  const [selType,    setSelType]    = useState("Tous");

  const getRestaurant = (id) => restaurants.find(r => r.id === id) || restaurants[0];

  const filtered = useMemo(() => jobOffers.filter(j => {
    const r = getRestaurant(j.restaurantId);
    const q = search.toLowerCase();
    return (
      (selCat  === "Tous" || j.category === selCat) &&
      (selType === "Tous" || j.type     === selType) &&
      (!q || j.title.toLowerCase().includes(q)
          || r.name.toLowerCase().includes(q)
          || j.skills.some(s => s.toLowerCase().includes(q)))
    );
  }), [search, selCat, selType]);

  const hasFilters = selCat !== "Tous" || selType !== "Tous" || search !== "";
  const reset = () => { setSelCat("Tous"); setSelType("Tous"); setSearch(""); };
  const toggleSave = (id) => setSavedJobs(p => p.includes(id) ? p.filter(x => x !== id) : [...p, id]);

  // Salary display — use formatPrice when numeric, else raw label
  const displaySalary = (job) => {
    if (job.salaryRaw) return formatPrice(job.salaryRaw);
    return job.salaryLabel;
  };

  return (
    <div className="min-h-screen jobs-root" style={{ background: "var(--bg)" }}>
      <style>{css}</style>

      {/* ── Header ── */}
      <div className="jobs-header">
        <div style={{ maxWidth: 960, margin: "0 auto" }}>
          <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", flexWrap: "wrap", gap: 16 }}>
            <div>
              <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: ".1em", textTransform: "uppercase", opacity: .7, margin: "0 0 6px" }}>
                LivrerNourriture — Emplois
              </p>
              <h1>Trouvez votre poste<br />dans la restauration</h1>
              <p>Rejoignez nos restaurants partenaires et développez votre carrière</p>

              {/* Stats */}
              <div className="stat-pills">
                <span className="stat-pill"><Briefcase size={12} /> {jobOffers.length} offres actives</span>
                <span className="stat-pill"><Zap size={12} /> {jobOffers.filter(j => j.urgent).length} urgentes</span>
                <span className="stat-pill"><Bike size={12} /> {jobOffers.filter(j => j.category === "Livraison").length} postes livraison</span>
              </div>
            </div>

            {/* Search */}
            <div style={{ flexShrink: 0, alignSelf: "flex-end" }}>
              <div className="search-wrap">
                <Search size={15} />
                <input
                  className="search-input"
                  placeholder="Poste, restaurant, compétence…"
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Filter bar ── */}
      <div style={{ background: "white", borderBottom: "1.5px solid var(--line)" }}>
        <div style={{ maxWidth: 960, margin: "0 auto" }}>
          <div className="filter-bar">

            {/* Category */}
            <div className="filter-group" style={{ padding: "0 16px 0 0" }}>
              <span className="filter-label">Catégorie</span>
              {CATEGORIES.map(c => (
                <button
                  key={c}
                  className={`chip ${selCat === c ? "active" : ""}`}
                  onClick={() => setSelCat(c)}
                >
                  {c !== "Tous" && catIcon(c)}
                  {c}
                  {c !== "Tous" && (
                    <span className="chip-count">
                      {jobOffers.filter(j => j.category === c).length}
                    </span>
                  )}
                </button>
              ))}
            </div>

            {/* Contract type */}
            <div className="filter-group" style={{ borderRight: "none" }}>
              <span className="filter-label">Contrat</span>
              {TYPES.map(t => (
                <button
                  key={t}
                  className={`chip ${selType === t ? "active" : ""}`}
                  onClick={() => setSelType(t)}
                >
                  {t}
                  {t !== "Tous" && (
                    <span className="chip-count">
                      {jobOffers.filter(j => j.type === t).length}
                    </span>
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ── Results bar ── */}
      <div style={{ maxWidth: 960, margin: "0 auto" }}>
        <div className="results-bar">
          <span>
            <span className="results-count">{filtered.length}</span>
            <span style={{ color: "var(--ink-2)", fontSize: 13 }}>
              {" "}offre{filtered.length > 1 ? "s" : ""} trouvée{filtered.length > 1 ? "s" : ""}
            </span>
          </span>
          {hasFilters && (
            <button className="reset-btn" onClick={reset}>
              <X size={11} /> Réinitialiser
            </button>
          )}
        </div>
      </div>

      {/* ── Job list ── */}
      <div style={{ maxWidth: 960, margin: "0 auto" }}>
        {filtered.length > 0 ? (
          <div className="job-list">
            {filtered.map(job => {
              const r = getRestaurant(job.restaurantId);
              const saved = savedJobs.includes(job.id);
              return (
                <div key={job.id} className="job-card">

                  {/* Logo */}
                  <div
                    className="job-logo"
                    style={{ background: r.color + "18", fontSize: 22 }}
                    title={r.name}
                  >
                    {r.icon}
                  </div>

                  {/* Body */}
                  <div>
                    <h3 className="job-title">{job.title}</h3>
                    <p className="job-restaurant">
                      <span style={{ fontWeight: 600, color: "var(--ink)" }}>{r.name}</span>
                      <span style={{ color: "var(--line)" }}>·</span>
                      <MapPin size={11} style={{ flexShrink: 0 }} />
                      {job.location}
                    </p>
                    <p style={{ fontSize: 12, color: "var(--ink-2)", margin: "0 0 10px", lineHeight: 1.5 }}>
                      {job.description}
                    </p>
                    <div className="job-meta">
                      <span className={`tag ${catClass(job.category)}`}>
                        {catIcon(job.category)} {job.category}
                      </span>
                      <span className={`tag ${typeClass(job.type)}`}>
                        {job.type}
                      </span>
                      {job.urgent && (
                        <span className="tag urgent">
                          <Zap size={10} /> Urgent
                        </span>
                      )}
                      <span className="tag">
                        <Clock size={10} /> {job.schedule}
                      </span>
                      <span className="tag">
                        <Briefcase size={10} /> {job.experience}
                      </span>
                    </div>
                    {/* Skills */}
                    <div style={{ display: "flex", flexWrap: "wrap", gap: 4, marginTop: 8 }}>
                      {job.skills.map((s, i) => (
                        <span key={i} style={{ fontSize: 11, padding: "2px 7px", background: "var(--bg)", border: "1px solid var(--line)", borderRadius: 3, color: "var(--ink-2)" }}>
                          {s}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Right col — desktop */}
                  <div className="job-right">
                    <div>
                      <div className="job-salary">{displaySalary(job)}</div>
                      {job.salaryRaw && (
                        <div className="job-salary-sub">/ mois</div>
                      )}
                    </div>
                    <div className="job-date">{job.postedDate}</div>
                    <div style={{ display: "flex", gap: 6 }}>
                      <button
                        className={`save-btn ${saved ? "saved" : ""}`}
                        onClick={() => toggleSave(job.id)}
                        title={saved ? "Retirer des favoris" : "Sauvegarder"}
                      >
                        <Bookmark size={15} fill={saved ? "currentColor" : "none"} />
                      </button>
                      <Link to={`/apply/job/${job.id}`} className="apply-btn">
                        Postuler <ArrowRight size={12} />
                      </Link>
                    </div>
                  </div>

                  {/* Bottom row — mobile only */}
                  <div className="job-right-mobile">
                    <div>
                      <div className="job-salary">{displaySalary(job)}</div>
                      <div className="job-date" style={{ marginTop: 2 }}>{job.postedDate}</div>
                    </div>
                    <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
                      <button
                        className={`save-btn ${saved ? "saved" : ""}`}
                        onClick={() => toggleSave(job.id)}
                        title={saved ? "Retirer des favoris" : "Sauvegarder"}
                      >
                        <Bookmark size={15} fill={saved ? "currentColor" : "none"} />
                      </button>
                      <Link to={`/apply/job/${job.id}`} className="apply-btn">
                        Postuler <ArrowRight size={12} />
                      </Link>
                    </div>
                  </div>

                </div>
              );
            })}
          </div>
        ) : (
          <div className="empty-state">
            <div className="empty-icon"><Search size={28} /></div>
            <h3>Aucune offre trouvée</h3>
            <p>Essayez d'autres termes ou réinitialisez les filtres.</p>
            <button className="reset-btn" onClick={reset} style={{ margin: "0 auto" }}>
              <Filter size={11} /> Réinitialiser les filtres
            </button>
          </div>
        )}

        {/* ── Tips strip ── */}
        <div className="tips-strip">
          {[
            { icon: <CheckCircle size={13} />, text: "Préparez un CV simple et clair" },
            { icon: <Clock size={13} />,        text: "Soyez ponctuel aux entretiens" },
            { icon: <User size={13} />,         text: "Mentionnez votre expérience" },
            { icon: <Shield size={13} />,       text: "Certification HACCP = +atout" },
          ].map(({ icon, text }) => (
            <div className="tip-item" key={text}>
              <span className="tip-icon">{icon}</span>
              {text}
            </div>
          ))}
        </div>

        {/* ── CTA Banner ── */}
        <div className="cta-banner">
          <div>
            <h3>Vous êtes restaurateur ?</h3>
            <p>Recrutez des talents qualifiés et développez votre équipe avec LivrerNourriture</p>
          </div>
          <div className="cta-actions">
            <Link to="/recruiter/post-job" className="apply-btn">
              <Users size={13} /> Publier une offre
            </Link>
            <Link
              to="/restaurateurs/recrutement"
              style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "7px 14px", border: "1.5px solid var(--p)", borderRadius: 4, fontSize: 12, fontWeight: 700, color: "var(--p)", textDecoration: "none", background: "white", fontFamily: "Sora, sans-serif" }}
            >
              <ExternalLink size={12} /> Espace recruteur
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default JobsPage;