import Link from "next/link";

const actions = [
  ["🌱", "My Farm", "Manage farms and crops", "/dashboard/farmer/farm"],
  ["✦", "AI Intelligence", "Get crop and market insights", "/dashboard/farmer/intelligence"],
  ["🛒", "Market", "List produce and see demand", "/dashboard/farmer/listings"],
  ["▤", "Orders", "Track offers and deliveries", "/dashboard/farmer/orders"],
];

export default function FarmerHomePage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
      <section className="rounded-3xl border bg-white p-5 shadow-sm sm:p-7">
        <p className="text-xs font-black uppercase tracking-[.16em] text-[#17633a]">Farmer workspace</p>
        <div className="mt-2 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div><h1 className="text-3xl font-black tracking-tight sm:text-4xl">Good morning 👋</h1><p className="mt-2 text-sm leading-6 text-[#647067]">Your farm, intelligence, market and orders — connected in one place.</p></div>
          <Link href="/dashboard/farmer/farm" className="inline-flex min-h-11 items-center justify-center rounded-xl bg-[#17633a] px-5 text-sm font-extrabold text-white no-underline">Open my farm →</Link>
        </div>
      </section>

      <section className="mt-5 grid gap-4 sm:grid-cols-3">
        {[['Farm status','Ready to manage','🌱'],['AI insight','Check today','✦'],['Market','Explore demand','🛒']].map(([title,value,icon]) => <div key={title} className="rounded-2xl border bg-white p-5 shadow-sm"><span className="text-2xl">{icon}</span><p className="mt-4 text-xs font-bold uppercase tracking-wider text-[#647067]">{title}</p><p className="mt-1 font-extrabold">{value}</p></div>)}
      </section>

      <section className="mt-6 rounded-3xl border bg-[#eef6ef] p-5 sm:p-7">
        <div className="flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between"><div><p className="text-xs font-black uppercase tracking-[.16em] text-[#17633a]">AI intelligence</p><h2 className="mt-1 text-2xl font-black">Make the next farm decision with context.</h2></div><Link href="/dashboard/farmer/intelligence" className="mt-3 text-sm font-extrabold text-[#17633a] no-underline sm:mt-0">View intelligence →</Link></div>
        <div className="mt-5 rounded-2xl border border-[#cfe3d3] bg-white p-5"><p className="text-sm font-extrabold">Recommendation</p><p className="mt-2 text-sm leading-6 text-[#526058]">Open AI Intelligence to review crop, market and selling-window recommendations. Confirm before taking action.</p><div className="mt-4 flex flex-wrap gap-2 text-xs font-bold text-[#647067]"><span className="rounded-full bg-[#eef6ef] px-3 py-1.5">Confidence shown</span><span className="rounded-full bg-[#eef6ef] px-3 py-1.5">Data status shown</span><span className="rounded-full bg-[#eef6ef] px-3 py-1.5">User confirmation</span></div></div>
      </section>

      <section className="mt-7"><h2 className="text-xl font-black">Quick actions</h2><div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">{actions.map(([icon,title,text,href]) => <Link key={title} href={href} className="rounded-2xl border bg-white p-5 no-underline shadow-sm hover:-translate-y-0.5"><span className="text-2xl">{icon}</span><h3 className="mt-4 font-extrabold">{title}</h3><p className="mt-1 text-sm leading-5 text-[#647067]">{text}</p><span className="mt-4 block text-xs font-extrabold text-[#17633a]">Open →</span></Link>)}</div></section>
    </div>
  );
}
