// CartPage.jsx - Flat Design / Table Layout
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import {
  ShoppingCart,
  Trash2,
  Plus,
  Minus,
  CreditCard,
  Shield,
  Truck,
  MapPin,
  Clock,
  CheckCircle,
  ChefHat,
  MessageSquare,
  Sparkles,
  ArrowLeft,
  Tag,
  AlertCircle,
} from "lucide-react";

import Plat1 from "@/assets/hero.avif";
import Plat2 from "@/assets/hero.avif";
import Plat3 from "@/assets/hero.avif";

/* ─── Palette & tokens ──────────────────────────────────────── */
const css = `
  @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=DM+Mono:wght@400;500&display=swap');

  .cart-root {
    --p: hsl(var(--primary));
    --p-10: hsl(var(--primary) / .10);
    --p-15: hsl(var(--primary) / .15);
    --p-20: hsl(var(--primary) / .20);
    --p-fg: hsl(var(--primary-foreground));
    --ink: #0f172a;
    --ink-2: #475569;
    --ink-3: #94a3b8;
    --line: #e2e8f0;
    --surface: #f8fafc;
    font-family: 'DM Sans', sans-serif;
  }

  /* ─ table ─ */
  .cart-table { width:100%; border-collapse:collapse; }
  .cart-table thead tr {
    background: var(--p);
    color: var(--p-fg);
  }
  .cart-table thead th {
    padding: 12px 16px;
    font-size: 12px;
    font-weight: 600;
    letter-spacing: .06em;
    text-transform: uppercase;
    white-space: nowrap;
    text-align: left;
  }
  .cart-table thead th:last-child { text-align: right; }
  .cart-table thead th.center { text-align: center; }

  .cart-table tbody tr {
    border-bottom: 1px solid var(--line);
    transition: background .15s;
  }
  .cart-table tbody tr:last-child { border-bottom: none; }
  .cart-table tbody tr:hover { background: var(--p-10); }
  .cart-table tbody td { padding: 14px 16px; vertical-align: middle; }
  .cart-table tbody td.right { text-align: right; }
  .cart-table tbody td.center { text-align: center; }

  /* ─ qty control ─ */
  .qty-ctrl {
    display: inline-flex;
    align-items: center;
    gap: 0;
    border: 1.5px solid var(--line);
    border-radius: 4px;
    overflow: hidden;
  }
  .qty-btn {
    width: 28px; height: 28px;
    display: flex; align-items: center; justify-content: center;
    background: none; border: none; cursor: pointer;
    color: var(--ink-2);
    transition: background .15s, color .15s;
  }
  .qty-btn:hover { background: var(--p-10); color: var(--p); }
  .qty-num {
    min-width: 32px; text-align: center;
    font-family: 'DM Mono', monospace;
    font-size: 13px; font-weight: 500;
    border-left: 1.5px solid var(--line);
    border-right: 1.5px solid var(--line);
    padding: 0 4px; line-height: 28px;
    color: var(--ink);
  }

  /* ─ delete btn ─ */
  .del-btn {
    background: none; border: none; cursor: pointer;
    color: var(--ink-3); padding: 4px;
    border-radius: 4px;
    transition: color .15s, background .15s;
    display: flex; align-items: center; justify-content: center;
  }
  .del-btn:hover { color: #ef4444; background: #fef2f2; }

  /* ─ restaurant header row ─ */
  .rest-header-row td {
    background: var(--p-10);
    padding: 8px 16px;
    font-size: 12px;
    font-weight: 700;
    letter-spacing: .04em;
    text-transform: uppercase;
    color: var(--p);
    border-bottom: 2px solid var(--p-20) !important;
  }

  /* ─ tag chip ─ */
  .tag-chip {
    display: inline-block;
    padding: 2px 8px;
    border: 1.5px solid var(--p-20);
    border-radius: 3px;
    font-size: 11px;
    font-weight: 500;
    color: var(--p);
    background: var(--p-10);
    margin-right: 4px;
  }

  /* ─ note chip ─ */
  .note-chip {
    display: inline-flex; align-items: center; gap: 4px;
    font-size: 11px; color: var(--ink-2);
    margin-top: 3px;
  }

  /* ─ summary card ─ */
  .summary-card {
    border: 1.5px solid var(--line);
    border-radius: 6px;
    overflow: hidden;
  }
  .summary-row {
    display: flex; justify-content: space-between; align-items: center;
    padding: 11px 18px;
    font-size: 14px;
    border-bottom: 1px solid var(--line);
  }
  .summary-row:last-child { border-bottom: none; }
  .summary-row.total {
    background: var(--p);
    color: var(--p-fg);
    font-weight: 700;
    font-size: 16px;
  }
  .summary-row.sub { color: var(--ink-2); }

  /* ─ status pill ─ */
  .pill-ok {
    display: inline-flex; align-items: center; gap: 5px;
    padding: 4px 10px; border-radius: 4px;
    font-size: 12px; font-weight: 600;
    background: #dcfce7; color: #16a34a;
  }
  .pill-warn {
    display: inline-flex; align-items: center; gap: 5px;
    padding: 4px 10px; border-radius: 4px;
    font-size: 12px; font-weight: 600;
    background: #fef9c3; color: #b45309;
  }

  /* ─ sidebar ─ */
  .sidebar-section {
    border: 1.5px solid var(--line);
    border-radius: 6px;
    overflow: hidden;
    margin-bottom: 16px;
  }
  .sidebar-section-header {
    padding: 12px 16px;
    background: var(--p);
    color: var(--p-fg);
    font-size: 13px;
    font-weight: 700;
    letter-spacing: .04em;
    text-transform: uppercase;
  }
  .sidebar-row {
    display: flex; align-items: center; gap: 10px;
    padding: 12px 16px;
    border-bottom: 1px solid var(--line);
    font-size: 13px;
    color: var(--ink-2);
  }
  .sidebar-row:last-child { border-bottom: none; }
  .sidebar-icon {
    width: 30px; height: 30px; border-radius: 4px;
    background: var(--p-10);
    color: var(--p);
    display: flex; align-items: center; justify-content: center;
    flex-shrink: 0;
  }

  /* ─ action btns ─ */
  .outline-btn {
    display: flex; align-items: center; gap: 8px;
    padding: 9px 14px; border-radius: 4px;
    border: 1.5px solid var(--line);
    background: white; color: var(--ink-2);
    font-size: 13px; font-weight: 500; cursor: pointer;
    transition: border-color .15s, color .15s, background .15s;
    width: 100%;
    text-decoration: none;
  }
  .outline-btn:hover {
    border-color: var(--p);
    color: var(--p);
    background: var(--p-10);
  }

  /* ─ promo bar ─ */
  .promo-bar {
    display: flex; align-items: center; justify-content: space-between;
    padding: 14px 20px;
    border: 1.5px solid var(--p-20);
    border-radius: 6px;
    background: var(--p-10);
    gap: 16px;
    flex-wrap: wrap;
  }

  /* ─ header band ─ */
  .page-band {
    background: var(--p);
    color: var(--p-fg);
  }

  /* ─ empty state ─ */
  .empty-icon {
    width: 80px; height: 80px; border-radius: 8px;
    background: var(--p-10);
    display: flex; align-items: center; justify-content: center;
    margin: 0 auto 24px;
  }

  /* ─ price mono ─ */
  .price { font-family: 'DM Mono', monospace; font-weight: 500; }
  .price-primary { color: var(--p); font-family: 'DM Mono', monospace; font-weight: 600; }
`;

/* ─── Component ─────────────────────────────────────────────── */
const CartPage = () => {
  const navigate = useNavigate();

  const [cartItems, setCartItems] = useState([
    {
      id: 1,
      mealId: 1,
      title: "Poulet Yassa Complet",
      restaurant: "Le Dakarois",
      restaurantId: "1",
      price: 4500,
      quantity: 2,
      deliveryTime: "30-40 min",
      category: "Africain",
      description: "Poulet mariné au citron, riz blanc et légumes frais.",
      image: Plat1,
      tags: ["Épicé", "Traditionnel"],
      specialInstructions: "Sans piment",
    },
    {
      id: 2,
      mealId: 2,
      title: "Burger Gourmet Deluxe",
      restaurant: "Burger House",
      restaurantId: "2",
      price: 5000,
      quantity: 1,
      deliveryTime: "25-35 min",
      category: "Fast-food",
      description: "Double steak, cheddar, bacon et sauce maison.",
      image: Plat2,
      tags: ["Gourmet", "Nouveau"],
      specialInstructions: "Sans oignons",
    },
    {
      id: 3,
      mealId: 5,
      title: "Plateau Sushi Mix",
      restaurant: "Sushi Zen",
      restaurantId: "5",
      price: 8000,
      quantity: 1,
      deliveryTime: "40-50 min",
      category: "Japonais",
      description: "Assortiment sushis, sashimis et makis du jour.",
      image: Plat3,
      tags: ["Frais", "Premium"],
      specialInstructions: "",
    },
  ]);

  const restaurants = [
    { id: "1", name: "Le Dakarois",  deliveryFee: 500,  minimumOrder: 3000, rating: 4.8 },
    { id: "2", name: "Burger House", deliveryFee: 700,  minimumOrder: 2000, rating: 4.7 },
    { id: "5", name: "Sushi Zen",    deliveryFee: 800,  minimumOrder: 5000, rating: 4.9 },
  ];

  /* ─ helpers ─ */
  const updateQuantity = (id, qty) => {
    if (qty < 1) { removeItem(id); return; }
    setCartItems(cartItems.map(i => i.id === id ? { ...i, quantity: qty } : i));
  };
  const removeItem = (id) => setCartItems(cartItems.filter(i => i.id !== id));
  const clearCart  = () => setCartItems([]);
  const checkout   = () => navigate("/checkout");

  const groupedByRestaurant = cartItems.reduce((acc, item) => {
    if (!acc[item.restaurantId]) {
      const r = restaurants.find(r => r.id === item.restaurantId);
      acc[item.restaurantId] = { ...r, restaurantName: item.restaurant, items: [] };
    }
    acc[item.restaurantId].items.push(item);
    return acc;
  }, {});

  const getSubtotal    = (rid) => cartItems.filter(i => i.restaurantId === rid).reduce((s, i) => s + i.price * i.quantity, 0);
  const meetsMin       = (rid) => { const r = restaurants.find(x => x.id === rid); return getSubtotal(rid) >= (r?.minimumOrder || 0); };

  const subtotal    = cartItems.reduce((s, i) => s + i.price * i.quantity, 0);
  const deliveryFee = Object.values(groupedByRestaurant).reduce((max, g) => Math.max(max, g.deliveryFee || 0), 0);
  const total       = subtotal + deliveryFee;
  const totalQty    = cartItems.reduce((s, i) => s + i.quantity, 0);
  const allReady    = Object.keys(groupedByRestaurant).every(rid => meetsMin(rid));
  const fmt         = (n) => n.toLocaleString("fr-FR");

  /* ─ Empty state ─ */
  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-white cart-root">
        <style>{css}</style>
        <div className="px-6 py-10 page-band">
          <div className="max-w-5xl mx-auto">
            <h1 className="text-2xl font-bold tracking-tight">Mon Panier</h1>
          </div>
        </div>
        <div className="max-w-md px-6 py-20 mx-auto text-center">
          <div className="empty-icon">
            <ShoppingCart size={36} style={{ color: "var(--p)" }} />
          </div>
          <h2 className="mb-2 text-xl font-bold" style={{ color: "var(--ink)" }}>Votre panier est vide</h2>
          <p className="mb-8 text-sm" style={{ color: "var(--ink-2)" }}>
            Ajoutez des plats à votre panier pour commencer une commande.
          </p>
          <div className="flex flex-col gap-3">
            <Button asChild className="gap-2">
              <Link to="/menu"><ChefHat size={15} /> Explorer le menu</Link>
            </Button>
            <Link to="/restaurants" className="justify-center outline-btn">
              <MapPin size={15} /> Voir les restaurants
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white cart-root">
      <style>{css}</style>

      {/* ── Header band ── */}
      <div className="px-6 py-8 page-band">
        <div className="flex flex-wrap items-end justify-between max-w-6xl gap-4 mx-auto">
          <div>
            <button
              onClick={() => navigate(-1)}
              className="flex items-center gap-1 mb-3 text-sm transition-opacity opacity-70 hover:opacity-100"
              style={{ color: "var(--p-fg)", background: "none", border: "none", cursor: "pointer" }}
            >
              <ArrowLeft size={14} /> Retour
            </button>
            <h1 className="text-2xl font-bold tracking-tight">Mon Panier</h1>
            <p className="mt-1 text-sm opacity-75">
              <Clock size={13} className="inline mr-1" />
              Livraison estimée : 30-45 min — {totalQty} article{totalQty > 1 ? "s" : ""}
            </p>
          </div>
          <button
            onClick={clearCart}
            style={{ background: "none", border: "1.5px solid rgba(255,255,255,.35)", borderRadius: 4, padding: "7px 14px", color: "var(--p-fg)", cursor: "pointer", fontSize: 13, display: "flex", alignItems: "center", gap: 6 }}
          >
            <Trash2 size={13} /> Vider le panier
          </button>
        </div>
      </div>

      {/* ── Main layout ── */}
      <div className="max-w-6xl mx-auto px-4 lg:px-6 py-8 grid lg:grid-cols-[1fr_320px] gap-8 items-start">

        {/* ── LEFT: Table(s) ── */}
        <div className="space-y-8">
          {Object.values(groupedByRestaurant).map((group, gi) => {
            const sub   = getSubtotal(group.id);
            const ready = meetsMin(group.id);
            const r     = restaurants.find(x => x.id === group.id);

            return (
              <motion.div
                key={group.id}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: gi * 0.07 }}
                style={{ border: "1.5px solid var(--line)", borderRadius: 6, overflow: "hidden" }}
              >
                {/* Restaurant meta bar */}
                <div style={{ background: "var(--surface)", padding: "12px 16px", borderBottom: "1.5px solid var(--line)", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 8 }}>
                  <button
                    onClick={() => navigate(`/restaurant/${group.id}`)}
                    style={{ background: "none", border: "none", cursor: "pointer", display: "flex", alignItems: "center", gap: 10 }}
                  >
                    <span style={{ width: 36, height: 36, borderRadius: 4, background: "var(--p)", color: "var(--p-fg)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                      <ChefHat size={16} />
                    </span>
                    <div style={{ textAlign: "left" }}>
                      <p style={{ fontWeight: 700, fontSize: 14, color: "var(--ink)" }}>{group.restaurantName}</p>
                      <p style={{ fontSize: 12, color: "var(--ink-2)" }}>
                        <Truck size={11} className="inline mr-1" />
                        Livraison {fmt(group.deliveryFee)} XOF
                        {group.items[0]?.deliveryTime && ` · ${group.items[0].deliveryTime}`}
                      </p>
                    </div>
                  </button>
                  <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    {ready
                      ? <span className="pill-ok"><CheckCircle size={12} /> Prêt</span>
                      : <span className="pill-warn"><AlertCircle size={12} /> Min. {fmt(r?.minimumOrder || 0)} XOF</span>
                    }
                    <span className="price-primary" style={{ fontSize: 15 }}>{fmt(sub)} XOF</span>
                  </div>
                </div>

                {/* Table */}
                <div style={{ overflowX: "auto" }}>
                  <table className="cart-table">
                    <thead>
                      <tr>
                        <th style={{ width: 48 }}></th>
                        <th>Plat</th>
                        <th className="center" style={{ width: 120 }}>Qté</th>
                        <th style={{ width: 110, textAlign: "right" }}>Prix unit.</th>
                        <th style={{ width: 120, textAlign: "right" }}>Sous-total</th>
                        <th style={{ width: 44 }}></th>
                      </tr>
                    </thead>
                    <AnimatePresence>
                      <tbody>
                        {group.items.map((item) => (
                          <motion.tr
                            key={item.id}
                            exit={{ opacity: 0, height: 0 }}
                            transition={{ duration: 0.2 }}
                          >
                            {/* Thumbnail */}
                            <td style={{ paddingRight: 0 }}>
                              <div style={{ width: 40, height: 40, borderRadius: 4, overflow: "hidden", flexShrink: 0 }}>
                                <img src={item.image} alt={item.title} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                              </div>
                            </td>

                            {/* Name + tags */}
                            <td>
                              <p style={{ fontWeight: 600, fontSize: 14, color: "var(--ink)", marginBottom: 3 }}>{item.title}</p>
                              <div style={{ display: "flex", flexWrap: "wrap", gap: 0, marginBottom: item.specialInstructions ? 2 : 0 }}>
                                {item.tags.map((t, i) => <span key={i} className="tag-chip">{t}</span>)}
                              </div>
                              {item.specialInstructions && (
                                <p className="note-chip">
                                  <Tag size={10} /> {item.specialInstructions}
                                </p>
                              )}
                            </td>

                            {/* Qty control */}
                            <td className="center">
                              <div className="qty-ctrl">
                                <button className="qty-btn" onClick={() => updateQuantity(item.id, item.quantity - 1)}>
                                  <Minus size={12} />
                                </button>
                                <span className="qty-num">{item.quantity}</span>
                                <button className="qty-btn" onClick={() => updateQuantity(item.id, item.quantity + 1)}>
                                  <Plus size={12} />
                                </button>
                              </div>
                            </td>

                            {/* Unit price */}
                            <td className="right">
                              <span className="price" style={{ fontSize: 13, color: "var(--ink-2)" }}>{fmt(item.price)}</span>
                            </td>

                            {/* Subtotal */}
                            <td className="right">
                              <span className="price-primary" style={{ fontSize: 14 }}>{fmt(item.price * item.quantity)}</span>
                            </td>

                            {/* Delete */}
                            <td className="center">
                              <button className="del-btn" onClick={() => removeItem(item.id)}>
                                <Trash2 size={14} />
                              </button>
                            </td>
                          </motion.tr>
                        ))}
                      </tbody>
                    </AnimatePresence>
                    {/* Footer row: restaurant total */}
                    <tfoot>
                      <tr style={{ background: "var(--p-10)", borderTop: "1.5px solid var(--p-20)" }}>
                        <td colSpan={4} style={{ padding: "10px 16px", fontSize: 12, fontWeight: 700, textTransform: "uppercase", letterSpacing: ".04em", color: "var(--ink-2)" }}>
                          Total {group.restaurantName}
                        </td>
                        <td colSpan={2} style={{ padding: "10px 16px", textAlign: "right" }}>
                          <span className="price-primary" style={{ fontSize: 15 }}>
                            {fmt(sub + group.deliveryFee)} XOF
                          </span>
                        </td>
                      </tr>
                    </tfoot>
                  </table>
                </div>

                {/* Min. order warning */}
                {!ready && (
                  <div style={{ padding: "10px 16px", background: "#fffbeb", borderTop: "1.5px solid #fde68a", fontSize: 12, color: "#92400e", display: "flex", gap: 6, alignItems: "center" }}>
                    <AlertCircle size={13} />
                    Il manque <strong style={{ fontFamily: "DM Mono, monospace" }}>&nbsp;{fmt((r?.minimumOrder || 0) - sub)} XOF&nbsp;</strong> pour atteindre le minimum de commande.
                  </div>
                )}
              </motion.div>
            );
          })}

          {/* ── Récapitulatif global (inline, sous les tables) ── */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25 }}
          >
            <div style={{ border: "1.5px solid var(--line)", borderRadius: 6, overflow: "hidden" }}>
              <div style={{ padding: "10px 16px", background: "var(--surface)", borderBottom: "1.5px solid var(--line)", fontWeight: 700, fontSize: 13, letterSpacing: ".04em", textTransform: "uppercase", color: "var(--ink-2)" }}>
                Récapitulatif
              </div>
              <table className="cart-table">
                <tbody>
                  {Object.values(groupedByRestaurant).map((g) => (
                    <tr key={g.id}>
                      <td style={{ color: "var(--ink-2)", fontSize: 13 }}>{g.restaurantName}</td>
                      <td style={{ textAlign: "right", fontSize: 13 }}>
                        <span className="price">{fmt(getSubtotal(g.id))} XOF</span>
                      </td>
                      <td style={{ textAlign: "right", fontSize: 12, color: "var(--ink-3)", paddingLeft: 0 }}>
                        + {fmt(g.deliveryFee)} livraison
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </motion.div>

          {/* ── Promo bar ── */}
          {subtotal < 10000 && (
            <div className="promo-bar">
              <p style={{ fontSize: 13, color: "var(--ink)" }}>
                <strong>🚚 Livraison offerte</strong> — plus que{" "}
                <span className="price" style={{ color: "var(--p)", fontWeight: 700 }}>
                  {fmt(10000 - subtotal)} XOF
                </span>{" "}
                pour en bénéficier.
              </p>
              <Link to="/menu" style={{ background: "var(--p)", color: "var(--p-fg)", borderRadius: 4, padding: "7px 14px", fontSize: 13, fontWeight: 600, textDecoration: "none", whiteSpace: "nowrap" }}>
                + Ajouter
              </Link>
            </div>
          )}
        </div>

        {/* ── RIGHT: Sidebar ── */}
        <motion.div
          initial={{ opacity: 0, x: 16 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.15 }}
          className="space-y-0"
        >
          {/* Totaux */}
          <div className="summary-card" style={{ marginBottom: 16 }}>
            <div style={{ padding: "12px 18px", background: "var(--surface)", borderBottom: "1px solid var(--line)", fontWeight: 700, fontSize: 13, letterSpacing: ".04em", textTransform: "uppercase", color: "var(--ink-2)" }}>
              Montant à payer
            </div>
            <div className="summary-row sub">
              <span>Sous-total plats</span>
              <span className="price">{fmt(subtotal)} XOF</span>
            </div>
            <div className="summary-row sub">
              <span>Frais de livraison</span>
              <span className="price">{fmt(deliveryFee)} XOF</span>
            </div>
            <div className="summary-row total">
              <span>Total</span>
              <span className="price">{fmt(total)} XOF</span>
            </div>
          </div>

          {/* Status + CTA */}
          <div className="sidebar-section" style={{ marginBottom: 16 }}>
            <div className="sidebar-section-header">Passer commande</div>
            <div style={{ padding: 16 }}>
              <div style={{ padding: "9px 12px", borderRadius: 4, marginBottom: 14, fontSize: 12, display: "flex", gap: 7, alignItems: "center", background: allReady ? "#dcfce7" : "#fef9c3", color: allReady ? "#16a34a" : "#92400e" }}>
                {allReady ? <CheckCircle size={13} /> : <AlertCircle size={13} />}
                {allReady ? "Toutes les conditions sont remplies" : "Certains minimums non atteints"}
              </div>
              <Button
                className="w-full gap-2"
                size="default"
                onClick={checkout}
                disabled={!allReady}
              >
                <CreditCard size={15} /> Procéder au paiement
              </Button>
              <p style={{ fontSize: 11, color: "var(--ink-3)", textAlign: "center", marginTop: 8 }}>
                <Shield size={10} className="inline mr-1" /> Paiement sécurisé
              </p>
            </div>
          </div>

          {/* Avantages */}
          <div className="sidebar-section" style={{ marginBottom: 16 }}>
            <div className="sidebar-section-header">Nos garanties</div>
            {[
              { icon: <Truck size={15} />,     label: "Livraison rapide",  sub: "30-45 min en moyenne" },
              { icon: <Shield size={15} />,    label: "Paiement sécurisé", sub: "Cryptage SSL 256-bit" },
              { icon: <Sparkles size={15} />,  label: "Plats frais",       sub: "Préparés à la commande" },
            ].map(({ icon, label, sub }) => (
              <div className="sidebar-row" key={label}>
                <span className="sidebar-icon">{icon}</span>
                <div>
                  <p style={{ fontWeight: 600, color: "var(--ink)", fontSize: 13 }}>{label}</p>
                  <p style={{ fontSize: 11, marginTop: 1 }}>{sub}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Actions rapides */}
          <div className="sidebar-section">
            <div className="sidebar-section-header">Actions</div>
            <div style={{ padding: "10px 12px", display: "flex", flexDirection: "column", gap: 8 }}>
              {[
                { to: "/contact",     icon: <MessageSquare size={14} />, label: "Support client" },
                { to: "/restaurants", icon: <MapPin size={14} />,        label: "Plus de restaurants" },
                { to: "/menu",        icon: <ChefHat size={14} />,       label: "Continuer mes achats" },
              ].map(({ to, icon, label }) => (
                <Link key={to} to={to} className="outline-btn">
                  {icon} {label}
                </Link>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default CartPage;