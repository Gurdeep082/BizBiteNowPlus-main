export default function ProductNote({
  note,
  setNote,
}) {
  return (
    <div className="rounded-xl border border-gray-200 dark:border-white/10 mt-4 bg-white dark:bg-[#181A1B] p-5 shadow-sm">
      <h3 className="mb-2 text-lg font-semibold text-gray-900 dark:text-white">
        Special Instructions
      </h3>

      <p className="mb-4 text-sm text-gray-500 dark:text-slate-400">
        Add any requests for this item (optional).
      </p>

      <textarea
        value={note}
        onChange={(e) => setNote(e.target.value)}
        maxLength={250}
        rows={4}
        placeholder="e.g. Less spicy, no onion, extra crispy..."
        className="w-full resize-none rounded-xl border border-gray-300 dark:border-slate-700 bg-transparent text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 px-4 py-3 outline-none transition focus:border-[#16522D] focus:ring-4 focus:ring-[#16522D]/10"
      />

      <div className="mt-2 text-right text-xs text-gray-400 dark:text-slate-500">
        {note.length}/250
      </div>
    </div>
  );
}