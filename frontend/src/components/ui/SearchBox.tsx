"use client";

type Props = {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
};

export default function SearchBox({
  value,
  onChange,
  placeholder = "جستجو...",
}: Props) {
  return (
    <input
      type="text"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className="w-full sm:w-82 p-2 bg-white border border-[#E4E1D8] rounded-lg text-right text-sm placeholder:text-[#8C8A80] focus:outline-none focus:border-[#A9762F]"
    />
  );
}