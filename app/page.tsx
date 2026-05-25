"use client";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import type { User } from "@supabase/supabase-js";

// ── DATA FICTIVE ──────────────────────────────────────────────
const FRIENDS_FEED = [
  { id: 1, name: "Sarah K.", username: "@sarah_k", emoji: "🧒", category: "Nature", categoryEmoji: "🌿", categoryColor: "#22c55e", challenge: "Walk barefoot on grass for 5 minutes", image: "https://images.unsplash.com/photo-1448375240586-882707db888b?w=800&q=80", fromFriend: false, streak: 12 },
  { id: 2, name: "Marcus R.", username: "@marcus_r", emoji: "👦", category: "Nourriture", categoryEmoji: "🍕", categoryColor: "#f97316", challenge: "Try a food you've never eaten before", image: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=800&q=80", fromFriend: true, streak: 8 },
  { id: 3, name: "Elena M.", username: "@elena_m", emoji: "👧", category: "Créativité", categoryEmoji: "🎨", categoryColor: "#a855f7", challenge: "Draw something with your non-dominant hand", image: "https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=800&q=80", fromFriend: false, streak: 15 },
];

const FRIENDS_LIST = [
  { id: 1, name: "Sarah K.", username: "@sarah_k", emoji: "🧒", streak: 12 },
  { id: 2, name: "Marcus R.", username: "@marcus_r", emoji: "👦", streak: 8 },
  { id: 3, name: "Elena M.", username: "@elena_m", emoji: "👧", streak: 15 },
];

const COMPLETED_CHALLENGES = [
  { id: 1, category: "Nature", categoryEmoji: "🌿", categoryColor: "#22c55e", title: "Walk barefoot on grass", image: "https://images.unsplash.com/photo-1448375240586-882707db888b?w=400&q=80" },
  { id: 2, category: "Nourriture", categoryEmoji: "🍕", categoryColor: "#f97316", title: "Try a new food", image: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400&q=80" },
  { id: 3, category: "Sport", categoryEmoji: "⚡", categoryColor: "#3b82f6", title: "Do 20 jumping jacks", image: "https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=400&q=80" },
  { id: 4, category: "Créativité", categoryEmoji: "🎨", categoryColor: "#a855f7", title: "Sketch something around you", image: "https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=400&q=80" },
];

const DAILY_CHALLENGES = [
  { id: 1, category: "Nourriture", categoryEmoji: "🍕", categoryColor: "#f97316", title: "Try a food you've never eaten before", fromFriend: "Marcus R.", duration: "< 5 min" },
  { id: 2, category: "Nature", categoryEmoji: "🌿", categoryColor: "#22c55e", title: "Walk barefoot on grass for 5 minutes", fromFriend: null, duration: "< 5 min" },
  { id: 3, category: "Créativité", categoryEmoji: "🎨", categoryColor: "#a855f7", title: "Draw something with your non-dominant hand", fromFriend: null, duration: "< 5 min" },
  { id: 4, category: "Sport", categoryEmoji: "⚡", categoryColor: "#3b82f6", title: "Do 20 jumping jacks right now", fromFriend: "Sarah K.", duration: "< 5 min" },
  { id: 5, category: "Social", categoryEmoji: "💬", categoryColor: "#ec4899", title: "Compliment a stranger today", fromFriend: null, duration: "< 5 min" },
];

// ── COULEURS ──────────────────────────────────────────────────
const BG = "#0d1117";
const CARD = "#161b27";
const CARD2 = "#1e2736";
const ORANGE = "#f97040";
const WHITE = "#ffffff";
const GRAY = "#8b9ab0";

// ── COMPOSANTS DE BASE ────────────────────────────────────────
function Avatar({ emoji, size = 44 }: { emoji: string; size?: number }) {
  return (
    <div style={{ width: size, height: size, borderRadius: "50%", background: "linear-gradient(135deg, #f97040, #f4a261)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: size * 0.45, flexShrink: 0 }}>
      {emoji}
    </div>
  );
}

function CategoryTag({ emoji, label, color }: { emoji: string; label: string; color: string }) {
  return (
    <span style={{ display: "inline-flex", alignItems: "center", gap: 5, background: `${color}22`, color, borderRadius: 20, padding: "4px 12px", fontSize: 13, fontWeight: 600 }}>
      {emoji} {label}
    </span>
  );
}

// ── AUTH PAGE ─────────────────────────────────────────────────
function AuthPage({ onSuccess }: { onSuccess: () => void }) {
  const [mode, setMode] = useState<"login" | "register">("login");
  const [form, setForm] = useState({ name: "", username: "", email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async () => {
    setError(""); setMessage("");
    if (!form.email || !form.password) { setError("Remplis tous les champs."); return; }
    if (mode === "register" && (!form.name || !form.username)) { setError("Remplis tous les champs."); return; }
    setLoading(true);

    if (mode === "register") {
      const { error } = await supabase.auth.signUp({
        email: form.email,
        password: form.password,
        options: { data: { name: form.name, username: `@${form.username.replace("@", "")}`, emoji: "👤" } }
      });
      if (error) { setError(error.message); setLoading(false); return; }
      setMessage("✅ Compte créé ! Vérifie ta boîte mail pour confirmer.");
      setLoading(false);
    } else {
      const { error } = await supabase.auth.signInWithPassword({ email: form.email, password: form.password });
      if (error) { setError("Email ou mot de passe incorrect."); setLoading(false); return; }
      onSuccess();
    }
  };

  return (
    <div style={{ minHeight: "100vh", background: BG, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "24px 20px" }}>
      <div style={{ textAlign: "center", marginBottom: 40 }}>
        <div style={{ fontSize: 56 }}>🎲</div>
        <div style={{ color: WHITE, fontSize: 32, fontWeight: 800, marginTop: 8 }}>Unplanned</div>
        <div style={{ color: GRAY, fontSize: 15, marginTop: 6 }}>Casse ta routine, un défi à la fois.</div>
      </div>
      <div style={{ display: "flex", background: CARD, borderRadius: 14, padding: 4, marginBottom: 28, width: "100%", maxWidth: 400 }}>
        {(["login", "register"] as const).map((m) => (
          <button key={m} onClick={() => { setMode(m); setError(""); setMessage(""); }}
            style={{ flex: 1, padding: "12px", borderRadius: 10, border: "none", cursor: "pointer", fontWeight: 700, fontSize: 15, background: mode === m ? ORANGE : "transparent", color: mode === m ? WHITE : GRAY }}>
            {m === "login" ? "Connexion" : "Inscription"}
          </button>
        ))}
      </div>
      <div style={{ width: "100%", maxWidth: 400, display: "flex", flexDirection: "column", gap: 12 }}>
        {mode === "register" && (
          <>
            <input placeholder="Ton prénom" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })}
              style={{ background: CARD, border: "none", borderRadius: 14, padding: "16px", color: WHITE, fontSize: 15, outline: "none" }} />
            <input placeholder="Nom d'utilisateur (sans @)" value={form.username} onChange={e => setForm({ ...form, username: e.target.value })}
              style={{ background: CARD, border: "none", borderRadius: 14, padding: "16px", color: WHITE, fontSize: 15, outline: "none" }} />
          </>
        )}
        <input placeholder="Adresse email" value={form.email} type="email" onChange={e => setForm({ ...form, email: e.target.value })}
          style={{ background: CARD, border: "none", borderRadius: 14, padding: "16px", color: WHITE, fontSize: 15, outline: "none" }} />
        <input placeholder="Mot de passe" value={form.password} type="password" onChange={e => setForm({ ...form, password: e.target.value })}
          style={{ background: CARD, border: "none", borderRadius: 14, padding: "16px", color: WHITE, fontSize: 15, outline: "none" }} />
        {error && <div style={{ color: "#f87171", fontSize: 14, textAlign: "center", background: "#f8717122", borderRadius: 10, padding: "10px" }}>{error}</div>}
        {message && <div style={{ color: "#4ade80", fontSize: 14, textAlign: "center", background: "#4ade8022", borderRadius: 10, padding: "10px" }}>{message}</div>}
        <button onClick={handleSubmit} disabled={loading}
          style={{ background: ORANGE, border: "none", borderRadius: 14, padding: "18px", color: WHITE, fontSize: 17, fontWeight: 700, cursor: loading ? "not-allowed" : "pointer", opacity: loading ? 0.8 : 1 }}>
          {loading ? "Chargement..." : mode === "login" ? "Se connecter" : "Créer mon compte"}
        </button>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{ flex: 1, height: 1, background: CARD2 }} />
          <span style={{ color: GRAY, fontSize: 13 }}>ou</span>
          <div style={{ flex: 1, height: 1, background: CARD2 }} />
        </div>
        <button style={{ background: CARD, border: `1px solid ${CARD2}`, borderRadius: 14, padding: "16px", color: WHITE, fontSize: 15, fontWeight: 600, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 10 }}>
          <span style={{ fontSize: 20 }}>🌐</span> Continuer avec Google
        </button>
        {mode === "login" && (
          <div style={{ textAlign: "center", marginTop: 8 }}>
            <span style={{ color: ORANGE, fontSize: 14, cursor: "pointer" }}>Mot de passe oublié ?</span>
          </div>
        )}
      </div>
    </div>
  );
}

// ── FEED PAGE ─────────────────────────────────────────────────
function FeedPage() {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16, padding: "0 0 100px" }}>
      {FRIENDS_FEED.map((item) => (
        <div key={item.id} style={{ background: CARD, borderRadius: 20, overflow: "hidden" }}>
          <div style={{ padding: "16px 16px 12px", display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
            <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
              <Avatar emoji={item.emoji} />
              <div>
                <div style={{ color: WHITE, fontWeight: 700, fontSize: 16 }}>{item.name}</div>
                {item.fromFriend && <div style={{ color: ORANGE, fontSize: 13 }}>🔥 Envoyé par un ami</div>}
              </div>
            </div>
            <CategoryTag emoji={item.categoryEmoji} label={item.category} color={item.categoryColor} />
          </div>
          <div style={{ color: WHITE, fontSize: 18, fontWeight: 500, padding: "0 16px 12px" }}>{item.challenge}</div>
          <img src={item.image} alt={item.challenge} style={{ width: "100%", height: 260, objectFit: "cover", display: "block" }} />
        </div>
      ))}
    </div>
  );
}

// ── DAILY CHALLENGE PAGE ──────────────────────────────────────
function DailyChallengePage({ onBack }: { onBack: () => void }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [rerollsLeft, setRerollsLeft] = useState(4);
  const [accepted, setAccepted] = useState(false);
  const [flipping, setFlipping] = useState(false);
  const challenge = DAILY_CHALLENGES[currentIndex];

  const handleReroll = () => {
    if (rerollsLeft === 0 || flipping) return;
    setFlipping(true);
    setTimeout(() => { setCurrentIndex((prev) => (prev + 1) % DAILY_CHALLENGES.length); setRerollsLeft((prev) => prev - 1); setFlipping(false); }, 300);
  };

  return (
    <div style={{ paddingBottom: 100 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 16, padding: "0 0 24px" }}>
        <button onClick={onBack} style={{ background: "none", border: "none", color: WHITE, fontSize: 22, cursor: "pointer" }}>←</button>
        <h2 style={{ color: WHITE, fontSize: 22, fontWeight: 700, margin: 0 }}>Défi du Jour</h2>
      </div>
      <div style={{ background: CARD, borderRadius: 24, overflow: "hidden", transition: "opacity 0.3s, transform 0.3s", opacity: flipping ? 0 : 1, transform: flipping ? "scale(0.97)" : "scale(1)" }}>
        <div style={{ padding: "24px 24px 0", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <CategoryTag emoji={challenge.categoryEmoji} label={challenge.category} color={challenge.categoryColor} />
          <span style={{ color: GRAY, fontSize: 13 }}>⏱ {challenge.duration}</span>
        </div>
        <div style={{ padding: "24px 24px 8px" }}>
          <div style={{ color: WHITE, fontSize: 26, fontWeight: 800, lineHeight: 1.3 }}>{challenge.title}</div>
        </div>
        {challenge.fromFriend ? (
          <div style={{ padding: "0 24px 24px", display: "flex", alignItems: "center", gap: 8 }}>
            <Avatar emoji="👦" size={32} />
            <span style={{ color: ORANGE, fontSize: 14, fontWeight: 600 }}>Envoyé par {challenge.fromFriend} 👋</span>
          </div>
        ) : (
          <div style={{ padding: "0 24px 24px" }}><span style={{ color: GRAY, fontSize: 14 }}>📋 Défi du catalogue</span></div>
        )}
        <div style={{ background: `${challenge.categoryColor}15`, margin: "0 24px 24px", borderRadius: 16, height: 160, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 80 }}>
          {challenge.categoryEmoji}
        </div>
      </div>
      {!accepted ? (
        <div style={{ marginTop: 24, display: "flex", flexDirection: "column", gap: 12 }}>
          <button onClick={() => setAccepted(true)} style={{ background: ORANGE, border: "none", borderRadius: 16, padding: "18px", color: WHITE, fontSize: 18, fontWeight: 700, cursor: "pointer", width: "100%" }}>
            ✅ Accepter le défi
          </button>
          <button onClick={handleReroll} disabled={rerollsLeft === 0}
            style={{ background: rerollsLeft === 0 ? CARD2 : CARD, border: `2px solid ${rerollsLeft === 0 ? CARD2 : ORANGE}`, borderRadius: 16, padding: "16px", color: rerollsLeft === 0 ? GRAY : WHITE, fontSize: 16, fontWeight: 600, cursor: rerollsLeft === 0 ? "not-allowed" : "pointer", width: "100%", display: "flex", alignItems: "center", justifyContent: "center", gap: 10 }}>
            🎲 Reroll
            <span style={{ background: rerollsLeft === 0 ? CARD2 : `${ORANGE}33`, color: rerollsLeft === 0 ? GRAY : ORANGE, borderRadius: 20, padding: "2px 10px", fontSize: 14, fontWeight: 700 }}>
              {rerollsLeft}/4
            </span>
          </button>
          {rerollsLeft === 0 && <div style={{ textAlign: "center", color: GRAY, fontSize: 14 }}>Plus de rerolls disponibles pour aujourd'hui 😅</div>}
        </div>
      ) : (
        <div style={{ marginTop: 24, background: CARD, borderRadius: 20, padding: 24, textAlign: "center" }}>
          <div style={{ fontSize: 56 }}>🎉</div>
          <div style={{ color: WHITE, fontSize: 20, fontWeight: 700, marginTop: 12 }}>Défi accepté !</div>
          <div style={{ color: GRAY, fontSize: 15, marginTop: 8 }}>Tu as jusqu'à minuit pour le réaliser.</div>
          <button onClick={onBack} style={{ marginTop: 20, background: ORANGE, border: "none", borderRadius: 14, padding: "14px 32px", color: WHITE, fontSize: 16, fontWeight: 700, cursor: "pointer" }}>
            Retour au fil
          </button>
        </div>
      )}
    </div>
  );
}

// ── PROFILE PAGE ──────────────────────────────────────────────
function ProfilePage({ user, onBack, onUpdate }: { user: User; onBack: () => void; onUpdate: () => void }) {
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({
    name: user.user_metadata?.name || "",
    username: (user.user_metadata?.username || "").replace("@", ""),
  });
  const [loading, setLoading] = useState(false);

  const handleSave = async () => {
    setLoading(true);
    await supabase.auth.updateUser({ data: { name: form.name, username: `@${form.username.replace("@", "")}` } });
    onUpdate();
    setEditing(false);
    setLoading(false);
  };

  const name = user.user_metadata?.name || "Utilisateur";
  const username = user.user_metadata?.username || "@utilisateur";
  const emoji = user.user_metadata?.emoji || "👤";

  return (
    <div style={{ paddingBottom: 100 }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 0 20px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <button onClick={onBack} style={{ background: "none", border: "none", color: WHITE, fontSize: 22, cursor: "pointer" }}>←</button>
          <h2 style={{ color: WHITE, fontSize: 22, fontWeight: 700, margin: 0 }}>Mon Profil</h2>
        </div>
        <button onClick={() => setEditing(!editing)}
          style={{ background: CARD2, border: "none", borderRadius: 10, padding: "8px 16px", color: WHITE, fontSize: 14, fontWeight: 600, cursor: "pointer" }}>
          {editing ? "Annuler" : "✏️ Modifier"}
        </button>
      </div>

      <div style={{ background: CARD, borderRadius: 20, padding: 24, marginBottom: 20, display: "flex", alignItems: "center", gap: 16 }}>
        <Avatar emoji={emoji} size={64} />
        <div style={{ flex: 1 }}>
          {editing ? (
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              <input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })}
                placeholder="Prénom" style={{ background: CARD2, border: "none", borderRadius: 10, padding: "10px 14px", color: WHITE, fontSize: 15, outline: "none" }} />
              <input value={form.username} onChange={e => setForm({ ...form, username: e.target.value })}
                placeholder="username" style={{ background: CARD2, border: "none", borderRadius: 10, padding: "10px 14px", color: WHITE, fontSize: 15, outline: "none" }} />
              <button onClick={handleSave} disabled={loading}
                style={{ background: ORANGE, border: "none", borderRadius: 10, padding: "10px", color: WHITE, fontWeight: 700, cursor: "pointer", fontSize: 14 }}>
                {loading ? "Sauvegarde..." : "💾 Sauvegarder"}
              </button>
            </div>
          ) : (
            <>
              <div style={{ color: WHITE, fontWeight: 700, fontSize: 20 }}>{name}</div>
              <div style={{ color: GRAY, fontSize: 14 }}>{username}</div>
              <div style={{ color: GRAY, fontSize: 13, marginTop: 4 }}>{user.email}</div>
            </>
          )}
        </div>
      </div>

      <div style={{ background: "linear-gradient(135deg, #f97040, #f4a261)", borderRadius: 20, padding: "32px 24px", textAlign: "center", marginBottom: 24 }}>
        <div style={{ color: WHITE, fontSize: 56, fontWeight: 800 }}>7</div>
        <div style={{ color: "rgba(255,255,255,0.85)", fontSize: 16 }}>Série de Jours 🔥</div>
      </div>

      <div style={{ display: "flex", justifyContent: "space-around", marginBottom: 32 }}>
        {[["6", "Terminés"], ["12", "Envoyés"], ["8", "Reçus"]].map(([n, l]) => (
          <div key={l} style={{ textAlign: "center" }}>
            <div style={{ color: WHITE, fontSize: 32, fontWeight: 800 }}>{n}</div>
            <div style={{ color: GRAY, fontSize: 14 }}>{l}</div>
          </div>
        ))}
      </div>

      <h3 style={{ color: WHITE, fontSize: 20, fontWeight: 700, marginBottom: 16 }}>Défis Terminés</h3>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
        {COMPLETED_CHALLENGES.map((c) => (
          <div key={c.id} style={{ borderRadius: 16, overflow: "hidden", position: "relative" }}>
            <img src={c.image} alt={c.title} style={{ width: "100%", height: 160, objectFit: "cover", display: "block" }} />
            <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, background: "linear-gradient(transparent, rgba(0,0,0,0.8))", padding: "24px 10px 10px" }}>
              <CategoryTag emoji={c.categoryEmoji} label={c.category} color={c.categoryColor} />
              <div style={{ color: WHITE, fontSize: 13, fontWeight: 600, marginTop: 4 }}>{c.title}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── FRIENDS PAGE ──────────────────────────────────────────────
function FriendsPage({ onBack }: { onBack: () => void }) {
  const [search, setSearch] = useState("");
  const filtered = FRIENDS_LIST.filter(f =>
    f.name.toLowerCase().includes(search.toLowerCase()) ||
    f.username.toLowerCase().includes(search.toLowerCase())
  );
  return (
    <div style={{ paddingBottom: 100 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 16, padding: "0 0 20px" }}>
        <button onClick={onBack} style={{ background: "none", border: "none", color: WHITE, fontSize: 22, cursor: "pointer" }}>←</button>
        <h2 style={{ color: WHITE, fontSize: 22, fontWeight: 700, margin: 0 }}>Amis</h2>
      </div>
      <input placeholder="Rechercher des amis..." value={search} onChange={e => setSearch(e.target.value)}
        style={{ width: "100%", background: CARD2, border: "none", borderRadius: 14, padding: "14px 16px", color: WHITE, fontSize: 15, marginBottom: 16, boxSizing: "border-box" }} />
      <button style={{ width: "100%", background: ORANGE, border: "none", borderRadius: 14, padding: "16px", color: WHITE, fontSize: 16, fontWeight: 700, cursor: "pointer", marginBottom: 20, display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
        👥 Ajouter des Amis
      </button>
      <div style={{ background: CARD, borderRadius: 16, overflow: "hidden" }}>
        <div style={{ padding: "12px 16px", color: GRAY, fontSize: 14 }}>{filtered.length} amis</div>
        {filtered.map((f, i) => (
          <div key={f.id} style={{ display: "flex", alignItems: "center", padding: "14px 16px", borderTop: i > 0 ? `1px solid ${CARD2}` : "none" }}>
            <Avatar emoji={f.emoji} />
            <div style={{ flex: 1, marginLeft: 12 }}>
              <div style={{ color: WHITE, fontWeight: 700 }}>{f.name}</div>
              <div style={{ color: GRAY, fontSize: 13 }}>{f.username}</div>
            </div>
            <div style={{ background: CARD2, borderRadius: 20, padding: "6px 14px", display: "flex", alignItems: "center", gap: 6 }}>
              <span>🔥</span><span style={{ color: WHITE, fontWeight: 700 }}>{f.streak}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── SETTINGS PAGE ─────────────────────────────────────────────
function SettingsPage({ onBack, onLogout }: { onBack: () => void; onLogout: () => void }) {
  const [darkMode, setDarkMode] = useState(true);
  const [notifs, setNotifs] = useState(true);
  const [showConfirm, setShowConfirm] = useState(false);

  return (
    <div style={{ paddingBottom: 100 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 16, padding: "0 0 20px" }}>
        <button onClick={onBack} style={{ background: "none", border: "none", color: WHITE, fontSize: 22, cursor: "pointer" }}>←</button>
        <h2 style={{ color: WHITE, fontSize: 22, fontWeight: 700, margin: 0 }}>Paramètres</h2>
      </div>
      <div style={{ color: GRAY, fontSize: 12, fontWeight: 700, letterSpacing: 1, marginBottom: 8 }}>PRÉFÉRENCES</div>
      <div style={{ background: CARD, borderRadius: 16, marginBottom: 24, overflow: "hidden" }}>
        <div style={{ display: "flex", alignItems: "center", padding: "16px", justifyContent: "space-between", borderBottom: `1px solid ${CARD2}` }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12, color: WHITE }}><span>🌐</span>Langue</div>
          <span style={{ color: GRAY }}>Français →</span>
        </div>
        {[{ icon: "🌙", label: "Mode Nuit", val: darkMode, set: setDarkMode }, { icon: "🔔", label: "Notifications Push", val: notifs, set: setNotifs }].map((item) => (
          <div key={item.label} style={{ display: "flex", alignItems: "center", padding: "16px", justifyContent: "space-between", borderTop: `1px solid ${CARD2}` }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12, color: WHITE }}><span>{item.icon}</span>{item.label}</div>
            <div onClick={() => item.set(!item.val)} style={{ width: 50, height: 28, borderRadius: 14, background: item.val ? ORANGE : CARD2, cursor: "pointer", position: "relative", transition: "background 0.2s" }}>
              <div style={{ position: "absolute", top: 3, left: item.val ? 25 : 3, width: 22, height: 22, borderRadius: "50%", background: WHITE, transition: "left 0.2s" }} />
            </div>
          </div>
        ))}
      </div>
      <div style={{ color: GRAY, fontSize: 12, fontWeight: 700, letterSpacing: 1, marginBottom: 8 }}>COMPTE</div>
      <div style={{ background: CARD, borderRadius: 16, overflow: "hidden", marginBottom: 24 }}>
        {[{ icon: "🛡️", label: "Confidentialité et Sécurité" }, { icon: "❓", label: "Aide et Support" }, { icon: "ℹ️", label: "À propos", right: "v1.0.0" }].map((item, i) => (
          <div key={item.label} style={{ display: "flex", alignItems: "center", padding: "16px", justifyContent: "space-between", borderTop: i > 0 ? `1px solid ${CARD2}` : "none", cursor: "pointer" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12, color: WHITE }}><span>{item.icon}</span>{item.label}</div>
            <span style={{ color: GRAY }}>{(item as { right?: string }).right ?? "→"}</span>
          </div>
        ))}
      </div>
      <button onClick={() => setShowConfirm(true)}
        style={{ width: "100%", background: "#ef444422", border: "2px solid #ef4444", borderRadius: 14, padding: "16px", color: "#ef4444", fontSize: 16, fontWeight: 700, cursor: "pointer" }}>
        🚪 Se déconnecter
      </button>
      {showConfirm && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.7)", zIndex: 100, display: "flex", alignItems: "center", justifyContent: "center", padding: 24 }}>
          <div style={{ background: CARD, borderRadius: 20, padding: 28, maxWidth: 340, width: "100%", textAlign: "center" }}>
            <div style={{ fontSize: 40 }}>🚪</div>
            <div style={{ color: WHITE, fontSize: 20, fontWeight: 700, marginTop: 12 }}>Se déconnecter ?</div>
            <div style={{ color: GRAY, fontSize: 14, marginTop: 8 }}>Tu devras te reconnecter pour accéder à ton compte.</div>
            <div style={{ display: "flex", gap: 12, marginTop: 24 }}>
              <button onClick={() => setShowConfirm(false)} style={{ flex: 1, background: CARD2, border: "none", borderRadius: 12, padding: "14px", color: WHITE, fontWeight: 600, cursor: "pointer" }}>Annuler</button>
              <button onClick={onLogout} style={{ flex: 1, background: "#ef4444", border: "none", borderRadius: 12, padding: "14px", color: WHITE, fontWeight: 700, cursor: "pointer" }}>Déconnexion</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ── BURGER MENU ───────────────────────────────────────────────
function BurgerMenu({ open, onClose, onNavigate, user }: { open: boolean; onClose: () => void; onNavigate: (page: string) => void; user: User }) {
  const name = user.user_metadata?.name || "Utilisateur";
  const username = user.user_metadata?.username || "@utilisateur";
  const emoji = user.user_metadata?.emoji || "👤";

  const items = [
    { icon: "🏠", label: "Mon Fil", page: "feed" },
    { icon: "👤", label: "Mon Profil", page: "profile" },
    { icon: "👥", label: "Amis", page: "friends" },
    { icon: "⚙️", label: "Paramètres", page: "settings" },
  ];

  return (
    <>
      {open && <div onClick={onClose} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", zIndex: 40 }} />}
      <div style={{ position: "fixed", top: 0, left: 0, bottom: 0, width: 280, background: CARD, zIndex: 50, transform: open ? "translateX(0)" : "translateX(-100%)", transition: "transform 0.3s ease", padding: 24, display: "flex", flexDirection: "column" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 40, marginTop: 20 }}>
          <Avatar emoji={emoji} size={56} />
          <div>
            <div style={{ color: WHITE, fontWeight: 700, fontSize: 18 }}>{name}</div>
            <div style={{ color: GRAY, fontSize: 14 }}>{username}</div>
          </div>
        </div>
        {items.map((item) => (
          <button key={item.page} onClick={() => { onNavigate(item.page); onClose(); }}
            style={{ display: "flex", alignItems: "center", gap: 16, background: "none", border: "none", color: WHITE, fontSize: 18, fontWeight: 600, padding: "14px 0", cursor: "pointer", textAlign: "left" }}>
            <span style={{ color: ORANGE, fontSize: 20 }}>{item.icon}</span>{item.label}
          </button>
        ))}
        <div style={{ flex: 1 }} />
        <button onClick={() => { onNavigate("settings"); onClose(); }}
          style={{ display: "flex", alignItems: "center", gap: 16, background: "none", border: "none", color: "#ef4444", fontSize: 16, fontWeight: 600, padding: "14px 0", cursor: "pointer" }}>
          <span style={{ fontSize: 20 }}>🚪</span> Se déconnecter
        </button>
      </div>
    </>
  );
}

// ── APP ───────────────────────────────────────────────────────
export default function App() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [menuOpen, setMenuOpen] = useState(false);
  const [page, setPage] = useState("feed");

  useEffect(() => {
    // Récupère la session au chargement
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });
    // Écoute les changements de session
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });
    return () => subscription.unsubscribe();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setPage("feed");
    setMenuOpen(false);
  };

  const refreshUser = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    setUser(user);
  };

  if (loading) return (
    <div style={{ minHeight: "100vh", background: BG, display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div style={{ textAlign: "center" }}>
        <div style={{ fontSize: 56 }}>🎲</div>
        <div style={{ color: GRAY, fontSize: 16, marginTop: 16 }}>Chargement...</div>
      </div>
    </div>
  );

  if (!user) return <AuthPage onSuccess={() => {}} />;

  const renderPage = () => {
    switch (page) {
      case "profile": return <ProfilePage user={user} onBack={() => setPage("feed")} onUpdate={refreshUser} />;
      case "friends": return <FriendsPage onBack={() => setPage("feed")} />;
      case "settings": return <SettingsPage onBack={() => setPage("feed")} onLogout={handleLogout} />;
      case "daily": return <DailyChallengePage onBack={() => setPage("feed")} />;
      default: return <FeedPage />;
    }
  };

  return (
    <div style={{ background: BG, minHeight: "100vh", fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif" }}>
      <BurgerMenu open={menuOpen} onClose={() => setMenuOpen(false)} onNavigate={setPage} user={user} />
      <div style={{ position: "sticky", top: 0, background: BG, zIndex: 30, padding: "16px 20px", display: "flex", alignItems: "center", justifyContent: "space-between", borderBottom: `1px solid ${CARD}` }}>
        <button onClick={() => setMenuOpen(true)} style={{ background: "none", border: "none", cursor: "pointer", display: "flex", flexDirection: "column", gap: 5 }}>
          {[0, 1, 2].map(i => <div key={i} style={{ width: 24, height: 2, background: WHITE, borderRadius: 2 }} />)}
        </button>
        <span style={{ color: WHITE, fontSize: 20, fontWeight: 800 }}>Unplanned</span>
        <button onClick={() => setPage("daily")} style={{ background: "none", border: "none", color: ORANGE, fontSize: 26, cursor: "pointer", lineHeight: 1 }}>+</button>
      </div>
      <div style={{ maxWidth: 680, margin: "0 auto", padding: "20px 16px" }}>
        {renderPage()}
      </div>
    </div>
  );
}