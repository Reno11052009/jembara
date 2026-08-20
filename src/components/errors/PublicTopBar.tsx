export default function PublicTopBar() {
  return (
    <header className="flex items-center justify-between border-b border-hairline px-6 py-4 sm:px-10">
      <div className="flex items-center gap-2">
        <span className="h-8 w-8 rounded-lg bg-brand" />
        <span className="font-display text-lg font-black text-ink">
          Jem<span className="text-brand">Bara</span>
        </span>
      </div>
      <a href="#" className="font-body text-sm font-medium text-ink-muted hover:text-ink">
        Bantuan
      </a>
    </header>
  );
}