import { Link } from "react-router-dom";

export default function CertificateCard({ cert }) {
  const date = new Date(Number(cert.issuedAt) * 1000).toLocaleDateString();
  const short = (addr) => `${addr.slice(0, 6)}...${addr.slice(-4)}`;

  return (
    <div className="cert-card">
      <div className="cert-badge">🏅</div>
      <div className="cert-info">
        <h3 className="cert-title">{cert.quizTitle}</h3>
        <span className="cert-skill">{cert.skill}</span>
        <div className="cert-score">
          <span className="score-value">{cert.score.toString()}%</span>
          <span className="score-label">Score</span>
        </div>
        <div className="cert-meta">
          <span>Issued by: {short(cert.issuer)}</span>
          <span>{date}</span>
        </div>
        <div className="cert-actions">
          <Link to={`/leaderboard/${cert.quizId}`} className="btn btn-sm btn-outline">
            View Leaderboard
          </Link>
          <a
            href={`https://sepolia.basescan.org/token/${import.meta.env.VITE_CONTRACT_ADDRESS}?a=${cert.learner}`}
            target="_blank"
            rel="noreferrer"
            className="btn btn-sm btn-ghost"
          >
            Verify On-Chain ↗
          </a>
        </div>
      </div>
    </div>
  );
}
