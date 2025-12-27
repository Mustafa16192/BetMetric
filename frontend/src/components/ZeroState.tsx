type Props = {
  onInitialize: () => void
}

export default function ZeroState({ onInitialize }: Props) {
  return (
    <div className="flex h-[420px] flex-col items-center justify-center gap-4 rounded-lg border border-border-subtle bg-surface-100 text-center">
      <p className="text-xs uppercase tracking-[0.3em] text-text-tertiary">Zero State</p>
      <h2 className="text-xl font-semibold">The strategy map is empty</h2>
      <p className="max-w-md text-sm text-text-secondary">
        Initialize your root bet to begin tracking burn versus return.
      </p>
      <button
        type="button"
        className="neon-button animate-pulse-neon"
        onClick={onInitialize}
      >
        + Initialize Strategy
      </button>
    </div>
  )
}
