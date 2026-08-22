"use client";

import { Search } from "lucide-react";

interface SessionsSearchBarProps {
  query: string;
  onQueryChange: (value: string) => void;
}

export default function SessionsSearchBar({
  query,
  onQueryChange,
}: SessionsSearchBarProps) {
  return (
    <div className="relative w-full sm:w-[372px] sm:flex-none">
      <input
        type="text"
        value={query}
        onChange={(e) => onQueryChange(e.target.value)}
        placeholder="جستجو کنید..."
        className="w-full h-10 rounded-lg border border-[#E4E1D8] bg-white pr-9 pl-3 text-right text-sm text-[#262420] placeholder:text-[#8C8A80] transition-colors focus:border-[#A9762F] focus:outline-none"
      />
      <Search
        size={18}
        className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[#A9762F]"
      />
    </div>
  );
}