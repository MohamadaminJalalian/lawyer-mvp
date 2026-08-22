"use client";

import { Search } from "lucide-react";

type Props = {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
};

export default function SearchBox({
  value,
  onChange,
  placeholder = "جستجو کنید...",
  className = "",
}: Props) {
  return (
    <div
      className={`relative w-full sm:w-[372px] sm:flex-none ${className}`}
    >
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="
          w-full
          h-10
          rounded-lg
          border
          border-[#E4E1D8]
          bg-white
          pr-9
          pl-3
          text-right
          text-sm
          text-[#262420]
          placeholder:text-[#8C8A80]
          transition-colors
          focus:border-[#A9762F]
          focus:outline-none
        "
      />

      <Search
        size={16}
        className="
    absolute
    right-3
    top-1/2
    -translate-y-1/2
    text-[#A9762F]
  "
      />
    </div>
  );
}