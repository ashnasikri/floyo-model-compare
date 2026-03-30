export default function Footer() {
  return (
    <footer className="border-t border-border mt-16">
      <div className="max-w-7xl mx-auto px-4 py-6 flex flex-col sm:flex-row items-center justify-between gap-3">
        <p className="font-sans text-xs text-muted text-center sm:text-left">
          Built by{" "}
          <a
            href="https://floyo.ai"
            target="_blank"
            rel="noopener noreferrer"
            className="text-violet hover:underline"
          >
            Floyo
          </a>{" "}
          — The fastest way to find and run AI workflows
        </p>
        <div className="flex items-center gap-4">
          <a
            href="https://floyo.ai"
            target="_blank"
            rel="noopener noreferrer"
            className="font-mono text-xs text-muted hover:text-text-sub transition-colors"
          >
            floyo.ai
          </a>
        </div>
      </div>
    </footer>
  );
}
