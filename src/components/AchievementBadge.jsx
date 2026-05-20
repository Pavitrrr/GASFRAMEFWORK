/**
 * Achievement badge system — Bronze, Silver, Gold
 * Based on number of certificates earned
 */

export const ACHIEVEMENTS = [
  {
    id: "first_cert",
    name: "First Steps",
    description: "Earn your first certificate",
    icon: "🌱",
    tier: "bronze",
    requirement: 1,
  },
  {
    id: "three_certs",
    name: "Knowledge Seeker",
    description: "Earn 3 certificates",
    icon: "📚",
    tier: "silver",
    requirement: 3,
  },
  {
    id: "five_certs",
    name: "Skill Master",
    description: "Earn 5 certificates",
    icon: "⚡",
    tier: "gold",
    requirement: 5,
  },
  {
    id: "perfect_score",
    name: "Perfectionist",
    description: "Score 100% on any quiz",
    icon: "💯",
    tier: "gold",
    requirement: null,
    special: true,
  },
  {
    id: "web3_native",
    name: "Web3 Native",
    description: "Complete a gasless transaction",
    icon: "🔗",
    tier: "silver",
    requirement: null,
    special: true,
  },
  {
    id: "early_adopter",
    name: "Early Adopter",
    description: "One of the first SkillStamp users",
    icon: "🚀",
    tier: "bronze",
    requirement: null,
    special: true,
  },
];

const TIER_COLORS = {
  bronze: { bg: "rgba(205,127,50,0.12)", border: "rgba(205,127,50,0.3)", text: "#CD7F32", glow: "rgba(205,127,50,0.2)" },
  silver: { bg: "rgba(192,192,192,0.12)", border: "rgba(192,192,192,0.3)", text: "#A0A0A0", glow: "rgba(192,192,192,0.2)" },
  gold: { bg: "rgba(255,215,0,0.12)", border: "rgba(255,215,0,0.3)", text: "#FFD700", glow: "rgba(255,215,0,0.25)" },
};

export function getUnlockedAchievements(certs) {
  const unlocked = [];
  const certCount = certs.length;
  const hasGasless = certCount > 0;
  const hasPerfect = certs.some((c) => Number(c.score) === 100);

  ACHIEVEMENTS.forEach((a) => {
    if (a.requirement && certCount >= a.requirement) unlocked.push(a.id);
    if (a.id === "web3_native" && hasGasless) unlocked.push(a.id);
    if (a.id === "perfect_score" && hasPerfect) unlocked.push(a.id);
    if (a.id === "early_adopter") unlocked.push(a.id); // everyone gets this
  });

  return unlocked;
}

export default function AchievementBadge({ achievement, unlocked = false, size = "md" }) {
  const colors = TIER_COLORS[achievement.tier];

  return (
    <div
      className={`achievement-badge ${unlocked ? "unlocked" : "locked"} size-${size}`}
      style={unlocked ? {
        background: colors.bg,
        borderColor: colors.border,
        boxShadow: `0 0 16px ${colors.glow}`,
      } : {}}
      title={achievement.description}
    >
      <div className="achievement-icon">{unlocked ? achievement.icon : "🔒"}</div>
      <div className="achievement-info">
        <div className="achievement-name" style={unlocked ? { color: colors.text } : {}}>
          {achievement.name}
        </div>
        <div className="achievement-desc">{achievement.description}</div>
        <div className="achievement-tier" style={unlocked ? { color: colors.text } : {}}>
          {achievement.tier.toUpperCase()}
        </div>
      </div>
    </div>
  );
}
