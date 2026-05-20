import { useState, useEffect } from "react";
import { useReadContract } from "../hooks/useContract";
import QuizCard from "../components/QuizCard";

export default function BrowseQuizzes() {
  const contract = useReadContract();
  const [quizzes, setQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [skillFilter, setSkillFilter] = useState("All");

  useEffect(() => {
    if (!contract) return;
    loadQuizzes();
  }, [contract]);

  async function loadQuizzes() {
    try {
      setLoading(true);
      const all = await contract.getAllQuizzes();
      // Convert BigInt fields
      const parsed = all.map((q) => ({
        id: q.id,
        issuer: q.issuer,
        title: q.title,
        skill: q.skill,
        questionsJson: q.questionsJson,
        passingScore: q.passingScore,
        active: q.active,
        createdAt: q.createdAt,
      }));
      setQuizzes(parsed.filter((q) => q.active));
    } catch (err) {
      console.error("Failed to load quizzes:", err);
    } finally {
      setLoading(false);
    }
  }

  const skills = ["All", ...new Set(quizzes.map((q) => q.skill))];

  const filtered = quizzes.filter((q) => {
    const matchSearch =
      q.title.toLowerCase().includes(search.toLowerCase()) ||
      q.skill.toLowerCase().includes(search.toLowerCase());
    const matchSkill = skillFilter === "All" || q.skill === skillFilter;
    return matchSearch && matchSkill;
  });

  if (!contract) {
    return (
      <div className="page-container">
        <div className="empty-state">
          <p>⚠️ Contract not configured. Add VITE_CONTRACT_ADDRESS to your .env file.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="page-container">
      <div className="page-header">
        <h1>Browse Quizzes</h1>
        <p>Take a quiz, pass it, and earn a soulbound certificate — gaslessly.</p>
      </div>

      <div className="filters">
        <input
          className="search-input"
          type="text"
          placeholder="Search quizzes..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <div className="skill-filters">
          {skills.map((s) => (
            <button
              key={s}
              className={`filter-btn ${skillFilter === s ? "active" : ""}`}
              onClick={() => setSkillFilter(s)}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="loading-grid">
          {[1, 2, 3].map((i) => (
            <div key={i} className="quiz-card skeleton" />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="empty-state">
          <p>No quizzes found. Be the first to create one!</p>
        </div>
      ) : (
        <div className="quiz-grid">
          {filtered.map((quiz) => (
            <QuizCard key={quiz.id.toString()} quiz={quiz} />
          ))}
        </div>
      )}
    </div>
  );
}
