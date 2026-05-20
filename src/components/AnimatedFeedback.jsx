import { useEffect, useState } from "react";

/**
 * Full-screen animated overlay for success, error, and network states
 */
export function SuccessAnimation({ show, message, subMessage, onDone }) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (show) {
      setVisible(true);
      const t = setTimeout(() => {
        setVisible(false);
        onDone?.();
      }, 3000);
      return () => clearTimeout(t);
    }
  }, [show]);

  if (!visible) return null;

  return (
    <div className="feedback-overlay success-overlay">
      <div className="feedback-content">
        <div className="feedback-icon-wrap success-icon-wrap">
          <div className="checkmark-circle">
            <svg viewBox="0 0 52 52" className="checkmark-svg">
              <circle className="checkmark-circle-bg" cx="26" cy="26" r="25" fill="none" />
              <path className="checkmark-check" fill="none" d="M14.1 27.2l7.1 7.2 16.7-16.8" />
            </svg>
          </div>
        </div>
        <h2 className="feedback-title">{message || "Success!"}</h2>
        {subMessage && <p className="feedback-sub">{subMessage}</p>}
        <div className="feedback-particles">
          {Array.from({ length: 12 }).map((_, i) => (
            <div key={i} className="confetti-piece" style={{ "--i": i }} />
          ))}
        </div>
      </div>
    </div>
  );
}

export function ErrorAnimation({ show, message, onDone }) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (show) {
      setVisible(true);
      const t = setTimeout(() => {
        setVisible(false);
        onDone?.();
      }, 3500);
      return () => clearTimeout(t);
    }
  }, [show]);

  if (!visible) return null;

  return (
    <div className="feedback-overlay error-overlay">
      <div className="feedback-content">
        <div className="feedback-icon-wrap error-icon-wrap">
          <div className="error-x">
            <span />
            <span />
          </div>
        </div>
        <h2 className="feedback-title">Transaction Failed</h2>
        <p className="feedback-sub">{message || "Something went wrong. Please try again."}</p>
      </div>
    </div>
  );
}

export function NetworkErrorAnimation({ show, onRetry }) {
  if (!show) return null;

  return (
    <div className="feedback-overlay network-overlay">
      <div className="feedback-content">
        <div className="feedback-icon-wrap network-icon-wrap">
          <div className="network-icon">
            <div className="wifi-bar bar1" />
            <div className="wifi-bar bar2" />
            <div className="wifi-bar bar3" />
            <div className="wifi-x">✕</div>
          </div>
        </div>
        <h2 className="feedback-title">Network Error</h2>
        <p className="feedback-sub">Can't connect to Base Sepolia. Check your connection.</p>
        {onRetry && (
          <button className="btn btn-primary" onClick={onRetry} style={{ marginTop: "20px" }}>
            Retry
          </button>
        )}
      </div>
    </div>
  );
}

/**
 * Inline toast notification
 */
export function Toast({ message, type = "info", show, onClose }) {
  useEffect(() => {
    if (show) {
      const t = setTimeout(() => onClose?.(), 4000);
      return () => clearTimeout(t);
    }
  }, [show]);

  if (!show) return null;

  const icons = { success: "✅", error: "❌", info: "ℹ️", warning: "⚠️" };

  return (
    <div className={`toast toast-${type}`}>
      <span className="toast-icon">{icons[type]}</span>
      <span className="toast-msg">{message}</span>
      <button className="toast-close" onClick={onClose}>✕</button>
    </div>
  );
}

/**
 * Gas savings counter badge
 */
export function GasSavedBadge({ txCount = 0 }) {
  const saved = (txCount * 0.002).toFixed(4);
  if (txCount === 0) return null;

  return (
    <div className="gas-saved-badge">
      <span className="gas-saved-icon">⛽</span>
      <div>
        <div className="gas-saved-amount">{saved} ETH saved</div>
        <div className="gas-saved-label">via UGF gasless transactions</div>
      </div>
    </div>
  );
}
