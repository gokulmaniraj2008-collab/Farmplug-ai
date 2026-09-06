import Link from "next/link";

export default function AboutPage() {
  return <main className="mx-auto max-w-4xl px-6 py-12"><Link href="/" className="text-sm font-medium text-[#1B4332]">← FarmPlug AI</Link><h1 className="mt-10 text-4xl font-bold text-[#17211B]">About FarmPlug AI</h1><p className="mt-5 text-lg leading-8 text-[#5F6B63]">FarmPlug AI is an agricultural technology platform focused on making farm information, produce supply, buyer demand and market workflows easier to connect.</p><div className="mt-8 rounded-2xl border border-gray-200 bg-white p-6"><h2 className="font-semibold text-[#17211B]">Our approach</h2><p className="mt-2 text-sm leading-7 text-[#5F6B63]">Build practical digital tools around real agricultural workflows, keep transaction states transparent, and give farmers and buyers a clearer path from information to action.</p></div></main>;
}
