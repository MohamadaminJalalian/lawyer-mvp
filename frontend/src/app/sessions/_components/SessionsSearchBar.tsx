"use client";

interface SessionsSearchBarProps {
  query: string;
  onQueryChange: (value: string) => void;
}

export default function SessionsSearchBar({ query, onQueryChange }: SessionsSearchBarProps) {
  return (
    <div className="flex max-w-xs items-center gap-2">
      <input
        type="text"
        value={query}
        onChange={(e) => onQueryChange(e.target.value)}
        placeholder="جست‌وجو با نام موکل یا تاریخ"
        className="w-full rounded-xl border border-[var(--border)] bg-[var(--surface)] px-3 py-2 text-sm text-[var(--text-primary)] outline-none transition focus:border-[var(--brand)]"
      />
      {query && (
        <button
          onClick={() => onQueryChange("")}
          className="whitespace-nowrap rounded-xl px-2 py-2 text-xs font-medium text-[var(--text-secondary)] transition hover:bg-[var(--surface-muted)]"
        >
          پاک کردن
        </button>
      )}
    </div>
  );
}