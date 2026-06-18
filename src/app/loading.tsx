export default function Loading() {
  return (
    <main className="loading-screen" aria-label="Loading">
      <div className="loading-mark" aria-hidden="true">
        <span className="loading-letter">A</span>
        <span className="loading-ring loading-ring-one" />
        <span className="loading-ring loading-ring-two" />
        <span className="loading-orbit loading-orbit-one" />
        <span className="loading-orbit loading-orbit-two" />
      </div>
    </main>
  );
}
