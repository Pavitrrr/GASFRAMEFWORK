import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useWallet } from "../context/WalletContext";
import { useUGF } from "../hooks/useUGF";
import UGFStatusBar from "../components/UGFStatusBar";

const EMPTY_QUESTION = {
  question: "",
  options: ["", "", "", ""],
  answer: 0, // index of correct option
};

export default function CreateQuiz() {
  const navigate = useNavigate();
  const { address, signer, connect } = useWallet();
  const { gaslessCreateQuiz, status, statusLabel, txHash, error, isLoading } = useUGF();

  const [title, setTitle] = useState("");
  const [skill, setSkill] = useState("");
  const [passingScore, setPassingScore] = useState(70);
  const [questions, setQuestions] = useState([{ ...EMPTY_QUESTION, options: ["", "", "", ""] }]);
  const [formError, setFormError] = useState(null);
  const [done, setDone] = useState(false);

  function addQuestion() {
    setQuestions((prev) => [
      ...prev,
      { question: "", options: ["", "", "", ""], answer: 0 },
    ]);
  }

  function removeQuestion(i) {
    setQuestions((prev) => prev.filter((_, idx) => idx !== i));
  }

  function updateQuestion(i, field, value) {
    setQuestions((prev) => {
      const updated = [...prev];
      updated[i] = { ...updated[i], [field]: value };
      return updated;
    });
  }

  function updateOption(qi, oi, value) {
    setQuestions((prev) => {
      const updated = [...prev];
      const opts = [...updated[qi].options];
      opts[oi] = value;
      updated[qi] = { ...updated[qi], options: opts };
      return updated;
    });
  }

  function validate() {
    if (!title.trim()) return "Quiz title is required.";
    if (!skill.trim()) return "Skill name is required.";
    if (questions.length < 2) return "Add at least 2 questions.";
    for (let i = 0; i < questions.length; i++) {
      const q = questions[i];
      if (!q.question.trim()) return `Question ${i + 1} text is empty.`;
      if (q.options.some((o) => !o.trim())) return `All options in Q${i + 1} must be filled.`;
    }
    return null;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    const err = validate();
    if (err) { setFormError(err); return; }
    if (!signer) { connect(); return; }

    setFormError(null);

    const questionsJson = JSON.stringify(
      questions.map((q) => ({
        question: q.question,
        options: q.options,
        answer: q.answer,
      }))
    );

    try {
      await gaslessCreateQuiz(signer, title, skill, questionsJson, passingScore);
      setDone(true);
    } catch (err) {
      console.error(err);
    }
  }

  if (done) {
    return (
      <div className="page-container">
        <div className="success-screen">
          <div className="success-icon">🎉</div>
          <h2>Quiz Created On-Chain!</h2>
          <p>Your quiz is live on Base Sepolia. Learners can now take it and earn certificates.</p>
          {txHash && (
            <a
              href={`https://sepolia.basescan.org/tx/${txHash}`}
              target="_blank"
              rel="noreferrer"
              className="btn btn-outline"
            >
              View Transaction ↗
            </a>
          )}
          <div className="success-actions">
            <button className="btn btn-primary" onClick={() => navigate("/issuer")}>
              Back to Dashboard
            </button>
            <button className="btn btn-outline" onClick={() => navigate("/quizzes")}>
              Browse Quizzes
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="page-container">
      <div className="page-header">
        <h1>Create a Quiz</h1>
        <p>Deploy a skill quiz on-chain. Gaslessly via UGF.</p>
      </div>

      <form className="create-quiz-form" onSubmit={handleSubmit}>
        {/* Basic Info */}
        <div className="form-section">
          <h2>Quiz Details</h2>
          <div className="form-row">
            <div className="form-group">
              <label>Quiz Title *</label>
              <input
                type="text"
                placeholder="e.g. React Fundamentals"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="form-input"
              />
            </div>
            <div className="form-group">
              <label>Skill *</label>
              <input
                type="text"
                placeholder="e.g. React, Solidity, Python"
                value={skill}
                onChange={(e) => setSkill(e.target.value)}
                className="form-input"
              />
            </div>
          </div>
          <div className="form-group">
            <label>Passing Score: {passingScore}%</label>
            <input
              type="range"
              min={50}
              max={100}
              step={5}
              value={passingScore}
              onChange={(e) => setPassingScore(Number(e.target.value))}
              className="form-range"
            />
            <div className="range-labels">
              <span>50%</span><span>100%</span>
            </div>
          </div>
        </div>

        {/* Questions */}
        <div className="form-section">
          <div className="section-header">
            <h2>Questions ({questions.length})</h2>
            <button type="button" className="btn btn-outline btn-sm" onClick={addQuestion}>
              + Add Question
            </button>
          </div>

          {questions.map((q, qi) => (
            <div key={qi} className="question-editor">
              <div className="question-editor-header">
                <span>Question {qi + 1}</span>
                {questions.length > 1 && (
                  <button
                    type="button"
                    className="btn btn-ghost btn-sm"
                    onClick={() => removeQuestion(qi)}
                  >
                    Remove
                  </button>
                )}
              </div>
              <input
                type="text"
                placeholder="Enter your question..."
                value={q.question}
                onChange={(e) => updateQuestion(qi, "question", e.target.value)}
                className="form-input"
              />
              <div className="options-editor">
                {q.options.map((opt, oi) => (
                  <div key={oi} className="option-editor-row">
                    <input
                      type="radio"
                      name={`correct-${qi}`}
                      checked={q.answer === oi}
                      onChange={() => updateQuestion(qi, "answer", oi)}
                      title="Mark as correct answer"
                    />
                    <input
                      type="text"
                      placeholder={`Option ${String.fromCharCode(65 + oi)}`}
                      value={opt}
                      onChange={(e) => updateOption(qi, oi, e.target.value)}
                      className={`form-input option-input ${q.answer === oi ? "correct-option" : ""}`}
                    />
                    {q.answer === oi && <span className="correct-label">✓ Correct</span>}
                  </div>
                ))}
              </div>
              <p className="option-hint">Select the radio button next to the correct answer.</p>
            </div>
          ))}
        </div>

        {formError && <div className="alert alert-error">{formError}</div>}

        <UGFStatusBar
          status={status}
          statusLabel={statusLabel}
          txHash={txHash}
          error={error}
        />

        <div className="form-actions">
          {!address ? (
            <button type="button" className="btn btn-primary btn-lg" onClick={connect}>
              Connect Wallet to Deploy
            </button>
          ) : (
            <button
              type="submit"
              className="btn btn-primary btn-lg"
              disabled={isLoading}
            >
              {isLoading ? "Deploying..." : "Deploy Quiz On-Chain (Gasless)"}
            </button>
          )}
        </div>
      </form>
    </div>
  );
}
