export default function SearchBar() {
  return (
    <div className="mb-8">
      <input
        type="text"
        placeholder="جستجوی موکل، کد ملی یا شماره پرونده..."
        className="w-full rounded-2xl border border-slate-200 bg-white px-5 py-4 text-right shadow-sm outline-none transition focus:border-blue-500"
      />
    </div>
  );
}
