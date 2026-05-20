/**
 * Shows the UGF transaction lifecycle progress to the user.
 * Makes the gasless flow visible and educational.
 */
export default function UGFStatusBar({ status, statusLabel, txHash, error }) {
  if (!status) return null;

  const steps = ["authenticating", "quoting", "settling", "executing", "done"];
  const currentIndex = steps.indexOf(status);

  const stepLabels = {
    authenticating: "Auth",
    quoting: "Quote",
    settling: "Settle",
    executing: "Execute",
    done: "Done",
  };

  if (status === "error") {
    return (
      <div className="ugf-status ugf-error">
        <span>❌ {error || "Transaction failed"}</span>
      </div>
    );
  }

  return (
    <div className="ugf-status">
      <div className="ugf-steps">
        {steps.map((step, i) => (
          <div
            key={step}
            className={`ugf-step ${
              i < currentIndex ? "completed" : i === currentIndex ? "active" : "pending"
            }`}
          >
            <div className="ugf-step-dot">
              {i < currentIndex ? "✓" : i + 1}
            </div>
            <span>{stepLabels[step]}</span>
          </div>
        ))}
      </div>
      <p className="ugf-label">{statusLabel}</p>
      {txHash && (
        <p className="ugf-txhash">
          Tx:{" "}
          <a
            href={`https://sepolia.basescan.org/tx/${txHash}`}
            target="_blank"
            rel="noreferrer"
          >
            {txHash.slice(0, 10)}...{txHash.slice(-8)}
          </a>
        </p>
      )}
    </div>
  );
}
