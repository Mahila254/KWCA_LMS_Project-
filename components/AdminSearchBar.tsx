import { Search } from "lucide-react";

// A plain GET form — works without any client-side JS. Submitting it
// navigates to the same admin page with ?q=<value>, and the server
// component on the other end re-queries Prisma with that filter.
export default function AdminSearchBar({
  action,
  placeholder,
  defaultValue,
}: {
  action: string;
  placeholder: string;
  defaultValue?: string;
}) {
  return (
    <form
      action={action}
      method="GET"
      className="mb-6 flex items-center gap-3 rounded-2xl border bg-white px-4 py-3"
    >
      <Search size={19} className="shrink-0 text-gray-400" />

      <input
        type="text"
        name="q"
        defaultValue={defaultValue}
        placeholder={placeholder}
        className="w-full outline-none"
      />

      <button
        type="submit"
        className="shrink-0 rounded-xl bg-[#1E1D59] px-5 py-2 font-bold text-white hover:bg-[#14123D]"
      >
        Search
      </button>

      {defaultValue && (
        <a
          href={action}
          className="shrink-0 rounded-xl border px-4 py-2 font-bold text-gray-600 hover:bg-gray-50"
        >
          Clear
        </a>
      )}
    </form>
  );
}
