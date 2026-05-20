import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useReadContract } from "../hooks/useContract";
import { useWallet } from "../context/WalletContext";

export default function IssuerDashboard() {
  const { address, connect } = useWallet();
  const contract = useReadContract();
  const navigate = useNavigate();

  const [myQuizzes, setMyQuizzes] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (contract && address) loadMyQuizzes();
  }, [contract, address]);

  async function loadMyQuizzes() {
    try {
      setLoading(true);
      const ids = await contract.getIssuerQuizzes(address);
      const quizzes = await Promise.all(
        ids.map((id) => contract.quizzes(id))
      );
      setMyQuizzes(quizzes);
    } catch (err) {
      console.error("Failed to load issuer quizzes:", err);
    } finally {
      setLoading(false);
    }
  }

  if (!address) {
    return (
      <div className="page-container">
        <div className="connect-prompt">
          <h2>Issuer Dashboard</h2>
          <p>Connect your wallet to create and manage quizzes.</p>
          <button className="btn btn-primary btn-lg" onClick={connect}>
            Connect Wallet
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="page-container">
      <div className="page-header">
        <div>
          <h1>Issuer Dashboard</h1>
          <p>Create quizzes and issue verifiable skill certificates.</p>
        </div>
        <Link to="/issuer/create" className="btn btn-primary">
          + Create Quiz
        </Link>
      </div>

      <div className="stats-row">
        <div className="stat-card">
          <div className="stat-value">{myQuizzes.length}</div>
          <div className="stat-label">Quizzes Created</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{myQuizzes.filter((q) => q.active).length}</div>
          <div className="stat-label">Active</div>
        </div>
      </div>

      <h2>My Quizzes</h2>

      {loading ? (
        <div className="loading">Loading your quizzes...</div>
      ) : myQuizzes.length === 0 ? (
        <div className="empty-state">
          <p>You haven't created any quizzes yet.</p>
          <Link to="/issuer/create" className="btn btn-primary">
            Create Your First Quiz
          </Link>
        </div>
      ) : (
        <div className="quiz-list">
          {myQuizzes.map((quiz) => (
            <div key={quiz.id.toString()} className="quiz-list-item">
              <div className="quiz-list-info">
                <span className="quiz-skill-tag">{quiz.skill}</span>
                <h3>{quiz.title}</h3>
                <span className={`status-badge ${quiz.active ? "active" : "inactive"}`}>
                  {quiz.active ? "Active" : "Inactive"}
                </span>
              </div>
              <div className="quiz-list-actions">
                <button
                  className="btn btn-sm btn-outline"
                  onClick={() => navigate(`/leaderboard/${quiz.id}`)}
                >
                  Leaderboard
                </button>
                <button
                  className="btn btn-sm btn-ghost"
                  onClick={() => navigate(`/quiz/${quiz.id}`)}
                >
                  Preview
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
