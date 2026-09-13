import Link from "next/link";
import { createClient } from "@/lib/supabase/server";

type MarketplacePageProps = {
  searchParams: Promise<{ q?: string }>;
};

export default async function MarketplacePage({ searchParams }: MarketplacePageProps) {
  const params = await searchParams;
  const query = params.q?.trim() ?? "";
  const supabase = await createClient();

  let listingsQuery = supabase
    .from("farmplug_supply_listings")
    .select("id, crop_name, quantity_kg, quality_grade, location_text, expected_price_per_kg, status")
    .eq("status", "published")
    .order("created_at", { ascending: false })
    .limit(30);

  if (query) {
    const escapedQuery = query.replace(/[%_,]/g, "\\$&");
    listingsQuery = listingsQuery.or(`crop_name.ilike.%${escapedQuery}%,location_text.ilike.%${escapedQuery}%,quality_grade.ilike.%${escapedQuery}%`);
  }

  const { data, error } = await listingsQuery;

  return (
    <main className="mx-auto max-w-6xl px-6 py-10">
      <Link href="/" className="text-sm font-medium text-[#1B4332]">← FarmPlug AI</Link>

      <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-[#17211B]">Produce marketplace</h1>
          <p className="mt-2 text-sm text-[#5F6B63]">Search published produce by crop, location or quality.</p>
        </div>
        <Link href="/onboarding/role-selection" className="w-fit rounded-lg bg-[#1B4332] px-4 py-2 text-sm font-semibold text-white">Join FarmPlug</Link>
      </div>

      <form action="/marketplace" method="get" className="mt-6 flex flex-col gap-2 sm:flex-row">
        <label htmlFor="marketplace-search" className="sr-only">Search marketplace</label>
        <input
          id="marketplace-search"
          name="q"
          defaultValue={query}
          placeholder="Search crop, location or quality..."
          autoComplete="off"
          className="min-h-11 flex-1 rounded-lg border border-gray-300 bg-white px-4 text-sm text-[#17211B] outline-none ring-[#1B4332] focus:ring-2"
        />
        <button type="submit" className="min-h-11 rounded-lg bg-[#1B4332] px-5 text-sm font-semibold text-white">Search</button>
        {query && <Link href="/marketplace" className="inline-flex min-h-11 items-center justify-center rounded-lg border border-gray-300 px-5 text-sm font-semibold text-[#425047]">Clear</Link>}
      </form>

      {error ? (
        <div className="mt-8 rounded-2xl border border-red-200 bg-red-50 p-6 text-sm text-red-800">
          Marketplace listings could not be loaded right now. Please try again.
        </div>
      ) : !data?.length ? (
        <div className="mt-10 rounded-2xl border border-dashed border-gray-300 p-10 text-center text-sm text-[#5F6B63]">
          {query ? `No published listings matched “${query}”.` : "No published listings are available yet."}
        </div>
      ) : (
        <>
          <p className="mt-8 text-xs font-semibold uppercase tracking-wide text-[#6B756D]">
            {query ? `Results for “${query}”` : "Latest published listings"} · {data.length} shown
          </p>
          <div className="mt-3 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {data.map((item) => (
              <article key={item.id} className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
                <h2 className="font-semibold text-[#17211B]">{item.crop_name ?? "Produce"}</h2>
                <p className="mt-2 text-sm text-[#5F6B63]">{item.quantity_kg ?? "—"} kg · {item.quality_grade ?? "Grade not set"}</p>
                <p className="mt-1 text-xs text-[#5F6B63]">{item.location_text ?? "Location not set"}</p>
                {item.expected_price_per_kg != null && <p className="mt-4 text-sm font-semibold text-[#1B4332]">₹{item.expected_price_per_kg}/kg</p>}
              </article>
            ))}
          </div>
        </>
      )}
    </main>
  );
}
