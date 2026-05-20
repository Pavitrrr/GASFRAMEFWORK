import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ethers } from "ethers";
import { useReadContract } from "../hooks/useContract";
import { useWallet } from "../context/WalletContext";
import { useUGF } from "../hooks/useUGF";
import UGFStatusBar from "../components/UGFStatusBar";

export default function TakeQuiz() {
  const { quizId } = useParams();
  const navigate = useNavigate();
  const contract = useReadContract();
  const { address, signer, connect } = useWallet();
  const { gaslessMint, status, statusLabel, txHash, error, isLoading } = useUGF();

  const [quiz, setQuiz] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState(null);
  const [passed, setPassed] = useState(false);
  const [loading, setLoading] = useState(true);
  const [alreadyMinted, setAlreadyMinted] = useState(false);
  const [mintDone, setMintDone] = useState(false);

  useEffect(() => {
    if (contract) loadQuiz();
  }, [contract, quizId]);

  useEffect(() => {
    if (contract && address) checkAlreadyMinted();
  }, [contract, address, quizId]);

  async function loadQuiz() {
    try {
      setLoading(true);
      const q = await contract.quizzes(quizId);
      setQuiz(q);
      const parsed = JSON.parse(q.questionsJson);
      setQuestions(parsed);
    } catch (err) {
      console.error("Failed to load quiz:", err);
    } finally {
      setLoading(false);
    }
  }

  async function checkAlreadyMinted() {
    try {
      const tokenId = await contract.learnerCertificate(address, quizId);
      if (tokenId.toString() !== "0") setAlreadyMinted(true);
    } catch {}
  }

  function handleAnswer(qIndex, optionIndex) {
    setAnswers((prev) => ({ ...prev, [qIndex]: optionIndex }));
  }

  function submitQuiz() {
    let correct = 0;
    questions.forEach((q, i) => {
      if (answers[i] === q.answer) correct++;
    });
    const pct = Math.round((correct / questions.length) * 100);
    setScore(pct);
    setPassed(pct >= Number(quiz.passingScore));
    setSubmitted(true);
  }

  async function handleMint() {
    if (!signer) { connect(); return; }
    try {
      // Issuer signs: keccak256(learner, quizId, score)
      // In production the issuer signs server-side. For hackathon demo,
      // we use a pre-signed approach: the issuer's private key signs via
      // a backend endpoint. Here we simulate with a placeholder that shows
      // the full UGF flow — replace ISSUER_PRIVATE_KEY in .env for real use.
      const issuerPrivKey = import.meta.env.VITE_ISSUER_PRIVATE_KEY;
      if (!issuerPrivKey) {
        alert("VITE_ISSUER_PRIVATE_KEY not set in .env — see README for setup.");
        return;
      }
      const issuerWallet = new ethers.Wallet(issuerPrivKey);
      const messageHash = ethers.solidityPackedKeccak256(
        ["address", "uint256", "uint8"],
        [address, BigInt(quizId), score]
      );
      const issuerSignature = await issuerWallet.signMessage(ethers.getBytes(messageHash));

      await gaslessMint(signer, Number(quizId), score, issuerSignature);
      setMintDone(true);
    } catch (err) {
      console.error("Mint failed:", err);
    }
  }

  if (loading) return <div className="page-container"><div className="loading">Loading quiz...</div></div>;
  if (!quiz) return <div className="page-container"><div className="empty-state">Quiz not found.</div></div>;

  const allAnswered = questions.length > 0 && Object.keys(answers).length === questions.length;

  return (
    <div className="page-container quiz-page">
      <div className="quiz-header">
        <span className="quiz-skill-tag">{quiz.skill}</span>
        <h1>{quiz.title}</h1>
        <p>Pass score: {quiz.passingScore.toString()}% · {questions.length} questions</p>
      </div>

      {alreadyMinted && !mintDone && (
        <div className="alert alert-info">
          ✅ You already have a certificate for this quiz.{" "}
          <button className="link-btn" onClick={() => navigate(`/profile/${address}`)}>
            View your profile →
          </button>
        </div>
      )}

      {!submitted ? (
        <div className="questions-list">
          {questions.map((q, i) => (
            <div key={i} className="question-card">
              <p className="question-text">
                <span className="question-num">Q{i + 1}.</span> {q.question}
              </p>
              <div className="options-list">
                {q.options.map((opt, j) => (
                  <button
                    key={j}
                    className={`option-btn ${answers[i] === j ? "selected" : ""}`}
                    onClick={() => handleAnswer(i, j)}
                  >
                    <span className="option-letter">{String.fromCharCode(65 + j)}</span>
                    {opt}
                  </button>
                ))}
              </div>
            </div>
          ))}

          <div className="quiz-submit">
            <button
              className="btn btn-primary btn-lg"
              onClick={submitQuiz}
              disabled={!allAnswered}
            >
              Submit Quiz ({Object.keys(answers).length}/{questions.length} answered)
            </button>
          </div>
        </div>
      ) : (
        <div className="quiz-result">
          <div className={`result-card ${passed ? "passed" : "failed"}`}>
            <div className="result-icon">{passed ? "🎉" : "😔"}</div>
            <h2>{passed ? "You Passed!" : "Not Quite"}</h2>
            <div className="result-score">{score}%</div>
            <p>
              {passed
                ? `You scored ${score}% — above the ${quiz.passingScore.toString()}% passing threshold.`
                : `You scored ${score}% — you need ${quiz.passingScore.toString()}% to pass. Try again!`}
            </p>

            {passed && !alreadyMinted && !mintDone && (
              <div className="mint-section">
                <p className="mint-info">
                  🏅 Mint your soulbound certificate on-chain — gaslessly via UGF.
                  You pay in Mock USD, no ETH needed.
                </p>
                {!address ? (
                  <button className="btn btn-primary btn-lg" onClick={connect}>
                    Connect Wallet to Mint
                  </button>
                ) : (
                  <button
                    className="btn btn-primary btn-lg"
                    onClick={handleMint}
                    disabled={isLoading}
                  >
                    {isLoading ? "Minting..." : "Mint Certificate (Gasless)"}
                  </button>
                )}
                <UGFStatusBar
                  status={status}
                  statusLabel={statusLabel}
                  txHash={txHash}
                  error={error}
                />
              </div>
            )}

            {mintDone && (
              <div className="mint-success">
                <p>🏅 Certificate minted on-chain!</p>
                <div className="mint-actions">
                  <button
                    className="btn btn-primary"
                    onClick={() => navigate(`/profile/${address}`)}
                  >
                    View My Profile
                  </button>
                  <button
                    className="btn btn-outline"
                    onClick={() => navigate(`/leaderboard/${quizId}`)}
                  >
                    View Leaderboard
                  </button>
                </div>
              </div>
            )}

            {!passed && (
              <button
                className="btn btn-outline btn-lg"
                onClick={() => { setSubmitted(false); setAnswers({}); setScore(null); }}
              >
                Try Again
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
