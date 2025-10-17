export function PaperFrame({ children, className = "" }) {
  return (
    <div
      className={`paperframe ${className}`}
    >
      {children}
    </div>
  );
}
