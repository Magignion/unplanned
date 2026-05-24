"use client";
import { useState } from "react";

// ── DATA FICTIVE ──────────────────────────────────────────────
const FRIENDS_FEED = [
  {
    id: 1,
    name: "Sarah K.",
    username: "@sarah_k",
    emoji: "🧒",
    category: "Nature",
    categoryEmoji: "🌿",
    categoryColor: "#22c55e",
    challenge: "Walk barefoot on grass for 5 minutes",
    image: "https://images.unsplash.com/photo-1448375240586-882707db888b?w=800&q=80",
    fromFriend: false,
    streak: 12,
  },
  {
    id: 2,
    name: "Marcus R.",
    username: "@marcus_r",
    emoji: "👦",
    category: "Nourriture",
    categoryEmoji: "🍕",
    categoryColor: "#f97316",
    challenge: "Try a food you've never eaten before",
    image: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=800&q=80",
    fromFriend: true,
    streak: 8,
  },
  {
    id: 3,
    name: "Elena M.",
    username: "@elena_m",
    emoji: "👧",
    category: "Créativité",
    categoryEmoji: "🎨",
    categoryColor: "#a855f7",
    challenge: "Draw something with your non-dominant hand",
    image: "https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=800&q=80",
    fromFriend: false,
    streak: 15,
  },
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

// ── COULEURS ──────────────────────────────────────────────────
const BG = "#0d1117";
const CARD = "#161b27";
const CARD2 = "#1e2736";
const ORANGE = "#f97040";
const WHITE = "#ffffff";
const GRAY = "#8b9ab0";

// ── COMPOSANTS ────────────────────────────────────────────────

function Avatar({ emoji, size = 44 }: { emoji: string; size?: number }) {
  return (
    <div style={{
      width: size, height: size, borderRadius: "50%",
      background: "linear-gradient(135deg, #f97040, #f4a261)",
      display: "flex", alignItems: "center", justifyContent: "center",
      fontSize: size * 0.45, flexShrink: 0,
    }}>{emoji}</div>
  );
}

function CategoryTag({ emoji, label, color }: { emoji: string; label: string; color: string }) {
  return (
    <span style={{
      display: "inline-flex", alignItems: "center", gap: 5,
      background: `${color}22`, color: color,
      borderRadius: 20, padding: "4px 12px", fontSize: 13, fontWeight: 600,
    }}>{emoji} {label}</span>
  );
}
// ── PAGE DÉFI DU JOUR ─────────────────────────────────────────
const DAILY_CHALLENGES = [
  { id: 1, category: "Nourriture", categoryEmoji: "🍕", categoryColor: "#f97316", title: "Try a food you've never eaten before", fromFriend: "Marcus R.", duration: "< 5 min" },
  { id: 2, category: "Nature", categoryEmoji: "🌿", categoryColor: "#22c55e", title: "Walk barefoot on grass for 5 minutes", fromFriend: null, duration: "< 5 min" },
  { id: 3, category: "Créativité", categoryEmoji: "🎨", categoryColor: "#a855f7", title: "Draw something with your non-dominant hand", fromFriend: null, duration: "< 5 min" },
  { id: 4, category: "Sport", categoryEmoji: "⚡", categoryColor: "#3b82f6", title: "Do 20 jumping jacks right now", fromFriend: "Sarah K.", duration: "< 5 min" },
  { id: 5, category: "Social", categoryEmoji: "💬", categoryColor: "#ec4899", title: "Compliment a stranger today", fromFriend: null, duration: "< 5 min" },
];

function DailyChallengePage({ onBack }: { onBack: () => void }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [rerollsLeft, setRerollsLeft] = useState(4);
  const [accepted, setAccepted] = useState(false);
  const [flipping, setFlipping] = useState(false);

  const challenge = DAILY_CHALLENGES[currentIndex];

  const handleReroll = () => {
    if (rerollsLeft === 0 || flipping) return;
    setFlipping(true);
    setTimeout(() => {
      setCurrentIndex((prev) => (prev + 1) % DAILY_CHALLENGES.length);
      setRerollsLeft((prev) => prev - 1);
      setFlipping(false);
    }, 300);
  };

  return (
    <div style={{ paddingBottom: 100 }}>
      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", gap: 16, padding: "0 0 24px" }}>
        <button onClick={onBack} style={{ background: "none", border: "none", color: WHITE, fontSize: 22, cursor: "pointer" }}>←</button>
        <h2 style={{ color: WHITE, fontSize: 22, fontWeight: 700, margin: 0 }}>Défi du Jour</h2>
      </div>

      {/* Carte défi */}
      <div style={{
        background: CARD,
        borderRadius: 24,
        overflow: "hidden",
        transition: "opacity 0.3s, transform 0.3s",
        opacity: flipping ? 0 : 1,
        transform: flipping ? "scale(0.97)" : "scale(1)",
      }}>
        {/* Top */}
        <div style={{ padding: "24px 24px 0", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <CategoryTag emoji={challenge.categoryEmoji} label={challenge.category} color={challenge.categoryColor} />
          <span style={{ color: GRAY, fontSize: 13 }}>⏱ {challenge.duration}</span>
        </div>

        {/* Titre */}
        <div style={{ padding: "24px 24px 8px" }}>
          <div style={{ color: WHITE, fontSize: 26, fontWeight: 800, lineHeight: 1.3 }}>
            {challenge.title}
          </div>
        </div>

        {/* Envoyé par */}
        {challenge.fromFriend ? (
          <div style={{ padding: "0 24px 24px", display: "flex", alignItems: "center", gap: 8 }}>
            <Avatar emoji="👦" size={32} />
            <span style={{ color: ORANGE, fontSize: 14, fontWeight: 600 }}>
              Envoyé par {challenge.fromFriend} 👋
            </span>
          </div>
        ) : (
          <div style={{ padding: "0 24px 24px" }}>
            <span style={{ color: GRAY, fontSize: 14 }}>📋 Défi du catalogue</span>
          </div>
        )}

        {/* Illustration emoji grande */}
        <div style={{
          background: `${challenge.categoryColor}15`,
          margin: "0 24px 24px",
          borderRadius: 16,
          height: 160,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: 80,
        }}>
          {challenge.categoryEmoji}
        </div>
      </div>

      {/* Boutons */}
      {!accepted ? (
        <div style={{ marginTop: 24, display: "flex", flexDirection: "column", gap: 12 }}>
          {/* Accepter */}
          <button
            onClick={() => setAccepted(true)}
            style={{
              background: ORANGE,
              border: "none",
              borderRadius: 16,
              padding: "18px",
              color: WHITE,
              fontSize: 18,
              fontWeight: 700,
              cursor: "pointer",
              width: "100%",
            }}
          >
            ✅ Accepter le défi
          </button>

          {/* Reroll */}
          <button
            onClick={handleReroll}
            disabled={rerollsLeft === 0}
            style={{
              background: rerollsLeft === 0 ? CARD2 : CARD,
              border: `2px solid ${rerollsLeft === 0 ? CARD2 : ORANGE}`,
              borderRadius: 16,
              padding: "16px",
              color: rerollsLeft === 0 ? GRAY : WHITE,
              fontSize: 16,
              fontWeight: 600,
              cursor: rerollsLeft === 0 ? "not-allowed" : "pointer",
              width: "100%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 10,
            }}
          >
            🎲 Reroll
            <span style={{
              background: rerollsLeft === 0 ? CARD2 : `${ORANGE}33`,
              color: rerollsLeft === 0 ? GRAY : ORANGE,
              borderRadius: 20,
              padding: "2px 10px",
              fontSize: 14,
              fontWeight: 700,
            }}>
              {rerollsLeft}/4
            </span>
          </button>
        </div>
      ) : (
        /* État accepté */
        <div style={{ marginTop: 24, background: CARD, borderRadius: 20, padding: 24, textAlign: "center" }}>
          <div style={{ fontSize: 56 }}>🎉</div>
          <div style={{ color: WHITE, fontSize: 20, fontWeight: 700, marginTop: 12 }}>Défi accepté !</div>
          <div style={{ color: GRAY, fontSize: 15, marginTop: 8 }}>Tu as jusqu'à minuit pour le réaliser.</div>
          <button
            onClick={onBack}
            style={{ marginTop: 20, background: ORANGE, border: "none", borderRadius: 14, padding: "14px 32px", color: WHITE, fontSize: 16, fontWeight: 700, cursor: "pointer" }}
          >
            Retour au fil
          </button>
        </div>
      )}

      {/* Rerolls épuisés */}
      {rerollsLeft === 0 && !accepted && (
        <div style={{ marginTop: 16, textAlign: "center", color: GRAY, fontSize: 14 }}>
          Plus de rerolls disponibles pour aujourd'hui 😅
        </div>
      )}
    </div>
  );
}
// ── PAGE FEED ─────────────────────────────────────────────────
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
                {item.fromFriend && (
                  <div style={{ color: ORANGE, fontSize: 13, display: "flex", alignItems: "center", gap: 4 }}>
                    🔥 Envoyé par un ami
                  </div>
                )}
              </div>
            </div>
            <CategoryTag emoji={item.categoryEmoji} label={item.category} color={item.categoryColor} />
          </div>
          <div style={{ color: WHITE, fontSize: 18, fontWeight: 500, padding: "0 16px 12px" }}>
            {item.challenge}
          </div>
          <img src={item.image} alt={item.challenge} style={{ width: "100%", height: 260, objectFit: "cover", display: "block" }} />
        </div>
      ))}
    </div>
  );
}

// ── PAGE PROFIL ───────────────────────────────────────────────
function ProfilePage({ onBack }: { onBack: () => void }) {
  return (
    <div style={{ paddingBottom: 100 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 16, padding: "0 0 20px" }}>
        <button onClick={onBack} style={{ background: "none", border: "none", color: WHITE, fontSize: 22, cursor: "pointer" }}>←</button>
        <h2 style={{ color: WHITE, fontSize: 22, fontWeight: 700, margin: 0 }}>Mon Profil</h2>
      </div>
      {/* Streak banner */}
      <div style={{ background: "linear-gradient(135deg, #f97040, #f4a261)", borderRadius: 20, padding: "32px 24px", textAlign: "center", marginBottom: 24 }}>
        <div style={{ color: WHITE, fontSize: 56, fontWeight: 800 }}>7</div>
        <div style={{ color: "rgba(255,255,255,0.85)", fontSize: 16 }}>Série de Jours</div>
      </div>
      {/* Stats */}
      <div style={{ display: "flex", justifyContent: "space-around", marginBottom: 32 }}>
        {[["6", "Terminés"], ["12", "Envoyés"], ["8", "Reçus"]].map(([n, l]) => (
          <div key={l} style={{ textAlign: "center" }}>
            <div style={{ color: WHITE, fontSize: 32, fontWeight: 800 }}>{n}</div>
            <div style={{ color: GRAY, fontSize: 14 }}>{l}</div>
          </div>
        ))}
      </div>
      {/* Grid */}
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

// ── PAGE AMIS ─────────────────────────────────────────────────
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
      <input
        placeholder="Rechercher des amis..."
        value={search}
        onChange={e => setSearch(e.target.value)}
        style={{ width: "100%", background: CARD2, border: "none", borderRadius: 14, padding: "14px 16px", color: WHITE, fontSize: 15, marginBottom: 16, boxSizing: "border-box" }}
      />
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
              <span>🔥</span>
              <span style={{ color: WHITE, fontWeight: 700 }}>{f.streak}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── PAGE PARAMÈTRES ───────────────────────────────────────────
function SettingsPage({ onBack }: { onBack: () => void }) {
  const [darkMode, setDarkMode] = useState(true);
  const [notifs, setNotifs] = useState(true);

  return (
    <div style={{ paddingBottom: 100 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 16, padding: "0 0 20px" }}>
        <button onClick={onBack} style={{ background: "none", border: "none", color: WHITE, fontSize: 22, cursor: "pointer" }}>←</button>
        <h2 style={{ color: WHITE, fontSize: 22, fontWeight: 700, margin: 0 }}>Paramètres</h2>
      </div>
      <div style={{ color: GRAY, fontSize: 12, fontWeight: 700, letterSpacing: 1, marginBottom: 8 }}>PRÉFÉRENCES</div>
      <div style={{ background: CARD, borderRadius: 16, marginBottom: 24, overflow: "hidden" }}>
        {[
          { icon: "🌐", label: "Langue", right: "Français →" },
        ].map((item, i) => (
          <div key={i} style={{ display: "flex", alignItems: "center", padding: "16px", justifyContent: "space-between", borderBottom: `1px solid ${CARD2}` }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12, color: WHITE }}><span>{item.icon}</span>{item.label}</div>
            <span style={{ color: GRAY }}>{item.right}</span>
          </div>
        ))}
        {[
          { icon: "🌙", label: "Mode Nuit", val: darkMode, set: setDarkMode },
          { icon: "🔔", label: "Notifications Push", val: notifs, set: setNotifs },
        ].map((item, i) => (
          <div key={i} style={{ display: "flex", alignItems: "center", padding: "16px", justifyContent: "space-between", borderTop: `1px solid ${CARD2}` }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12, color: WHITE }}><span>{item.icon}</span>{item.label}</div>
            <div onClick={() => item.set(!item.val)} style={{ width: 50, height: 28, borderRadius: 14, background: item.val ? ORANGE : CARD2, cursor: "pointer", position: "relative", transition: "background 0.2s" }}>
              <div style={{ position: "absolute", top: 3, left: item.val ? 25 : 3, width: 22, height: 22, borderRadius: "50%", background: WHITE, transition: "left 0.2s" }} />
            </div>
          </div>
        ))}
      </div>
      <div style={{ color: GRAY, fontSize: 12, fontWeight: 700, letterSpacing: 1, marginBottom: 8 }}>COMPTE</div>
      <div style={{ background: CARD, borderRadius: 16, overflow: "hidden" }}>
        {[
          { icon: "🛡️", label: "Confidentialité et Sécurité" },
          { icon: "❓", label: "Aide et Support" },
          { icon: "ℹ️", label: "À propos", right: "v1.0.0" },
        ].map((item, i) => (
          <div key={i} style={{ display: "flex", alignItems: "center", padding: "16px", justifyContent: "space-between", borderTop: i > 0 ? `1px solid ${CARD2}` : "none", cursor: "pointer" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12, color: WHITE }}><span>{item.icon}</span>{item.label}</div>
            <span style={{ color: GRAY }}>{item.right ?? "→"}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── MENU BURGER ───────────────────────────────────────────────
function BurgerMenu({ open, onClose, onNavigate }: { open: boolean; onClose: () => void; onNavigate: (page: string) => void }) {
  const items = [
    { icon: "🏠", label: "Mon Fil", page: "feed" },
    { icon: "👤", label: "Mon Profil", page: "profile" },
    { icon: "👥", label: "Amis", page: "friends" },
    { icon: "⚙️", label: "Paramètres", page: "settings" },
    { icon: "🚪", label: "Se Déconnecter", page: "logout" },
  ];
  return (
    <>
      {open && <div onClick={onClose} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", zIndex: 40 }} />}
      <div style={{
        position: "fixed", top: 0, left: 0, bottom: 0, width: 280,
        background: CARD, zIndex: 50, transform: open ? "translateX(0)" : "translateX(-100%)",
        transition: "transform 0.3s ease", padding: 24, display: "flex", flexDirection: "column",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 40, marginTop: 20 }}>
          <Avatar emoji="👤" size={56} />
          <div>
            <div style={{ color: WHITE, fontWeight: 700, fontSize: 18 }}>Lucas</div>
            <div style={{ color: GRAY, fontSize: 14 }}>@lucas_m</div>
          </div>
        </div>
        {items.map((item) => (
          <button key={item.page} onClick={() => { onNavigate(item.page); onClose(); }}
            style={{ display: "flex", alignItems: "center", gap: 16, background: "none", border: "none", color: WHITE, fontSize: 18, fontWeight: 600, padding: "14px 0", cursor: "pointer", textAlign: "left" }}>
            <span style={{ color: ORANGE, fontSize: 20 }}>{item.icon}</span>
            {item.label}
          </button>
        ))}
      </div>
    </>
  );
}

// ── APP PRINCIPALE ────────────────────────────────────────────
export default function App() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [page, setPage] = useState("feed");

  const renderPage = () => {
    switch (page) {
      case "profile": return <ProfilePage onBack={() => setPage("feed")} />;
      case "friends": return <FriendsPage onBack={() => setPage("feed")} />;
      case "settings": return <SettingsPage onBack={() => setPage("feed")} />;
      case "daily": return <DailyChallengePage onBack={() => setPage("feed")} />;
      default: return <FeedPage />;
    }
  };

  return (
    <div style={{ background: BG, minHeight: "100vh", fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif" }}>
      <BurgerMenu open={menuOpen} onClose={() => setMenuOpen(false)} onNavigate={setPage} />
      {/* Header */}
      <div style={{ position: "sticky", top: 0, background: BG, zIndex: 30, padding: "16px 20px", display: "flex", alignItems: "center", justifyContent: "space-between", borderBottom: `1px solid ${CARD}` }}>
        <button onClick={() => setMenuOpen(true)} style={{ background: "none", border: "none", cursor: "pointer", display: "flex", flexDirection: "column", gap: 5 }}>
          {[0,1,2].map(i => <div key={i} style={{ width: 24, height: 2, background: WHITE, borderRadius: 2 }} />)}
        </button>
        <span style={{ color: WHITE, fontSize: 20, fontWeight: 800 }}>Unplanned</span>
        <button onClick={() => setPage("daily")} style={{ background: "none", border: "none", color: ORANGE, fontSize: 26, cursor: "pointer", lineHeight: 1 }}>+</button>
      </div>
      {/* Contenu */}
      <div style={{ maxWidth: 680, margin: "0 auto", padding: "20px 16px" }}>
        {renderPage()}
      </div>
    </div>
  );
}