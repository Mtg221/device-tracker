import "./StatusBadge.css";

export default function StatusBadge({ status }) {
  return (
    <span className={`status-badge status-${status}`}>
      <span className="dot"></span>
      {status}
    </span>
  );
}
