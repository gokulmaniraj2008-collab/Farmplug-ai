import Link from "next/link";

export default function PlatformPage() {
  return <main className="mx-auto max-w-5xl px-6 py-12"><Link href="/" className="text-sm font-medium text-[#1B4332]">← FarmPlug AI</Link><h1 className="mt-10 text-4xl font-bold text-[#17211B]">Platform overview</h1><p className="mt-4 max-w-3xl text-lg leading-8 text-[#5F6B63]">FarmPlug AI connects agricultural supply and demand through farm profiles, crop records, produce listings, buyer requirements, offers, orders, payments and logistics.</p><div className="mt-10 grid gap-4 sm:grid-cols-2">{["Farmer workspace","Buyer demand & matching","FPO aggregation & logistics","Admin operations & audit"].map(x=><div key={x} className="rounded-2xl border border-gray-200 bg-white p-5"><h2 className="font-semibold text-[#17211B]">{x}</h2><p className="mt-2 text-sm text-[#5F6B63]">Connected workflow designed to keep each participant focused on the actions relevant to their role.</p></div>)}</div></main>;
}
