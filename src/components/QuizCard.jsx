import { Link } from "react-router-dom";

export default function QuizCard({ quiz }) {
  const short = (addr) => `${addr.slice(0, 6)}...${addr.slice(-4)}`;
  const date = new Date(Number(quiz.createdAt) * 1000).toLocaleDateString();

  return (
    <div className={`quiz-card ${!quiz.active ? "inactive" : ""}`}>
      <div className="quiz-card-header">
        <span className="quiz-skill-tag">{quiz.skill}</span>
        {!quiz.active && <span className="quiz-inactive-tag">Inactive</span>}
      </div>
      <h3 className="quiz-title">{quiz.title}</h3>
      <div className="quiz-meta">
        <span>By: {short(quiz.issuer)}</span>
        <span>Pass: {quiz.passingScore.toString()}%</span>
        <span>{date}</span>
      </div>
      {quiz.active && (
        <Link to={`/quiz/${quiz.id}`} className="btn btn-primary btn-full">
          Take Quiz →
        </Link>
      )}
    </div>
  );
}
