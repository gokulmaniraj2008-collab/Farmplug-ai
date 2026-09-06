// File location: app/dashboard/farmer/intelligence/page.tsx
"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
interface Crop { id: string; crop_name: string; }
function simulateMarketData(cropName: string) { let seed = 0; for (const ch of cropName) seed += ch.charCodeAt(0); const basePrice = 15 + (seed % 40); return { currentPricePerKg: basePrice, weekTrendPct: ((seed % 21) - 10), demandLevel: seed % 3 === 0 ? "High" : seed % 3 === 1 ? "Moderate" : "Low", sellingWindow: seed % 2 === 0 ? "Next 5–7 days" : "Next 10–14 days", forecastConfidence: 50 + (seed % 30) }; }
export default function FarmIntelligencePage() {
 const [crops,setCrops]=useState<Crop[]>([]); const [selectedCrop,setSelectedCrop]=useState(""); const [loading,setLoading]=useState(true);
 useEffect(()=>{load();},[]);
 async function load(){const supabase=createClient();const {data:{user}}=await supabase.auth.getUser();if(!user){setLoading(false);return;}const {data}=await supabase.from("crops").select("id, crop_name").eq("farmer_id",user.id);setCrops(data??[]);if(data&&data.length>0)setSelectedCrop(data[0].crop_name);setLoading(false);}
 if(loading)return <div className="p-6 text-sm text-gray-500">Loading...</div>;
 if(crops.length===0)return <div className="mx-auto max-w-2xl p-6"><h1 className="text-xl font-semibold text-[#17211B]">Farm Intelligence</h1><p className="mt-3 text-sm text-[#5F6B63]">This information is not available in the current workspace — add a crop first.</p></div>;
 const market=simulateMarketData(selectedCrop);
 return <div className="mx-auto max-w-2xl p-6"><h1 className="text-xl font-semibold text-[#17211B]">Farm Intelligence</h1><select value={selectedCrop} onChange={e=>setSelectedCrop(e.target.value)} className="mt-3 rounded-md border border-gray-300 px-3 py-2 text-sm">{crops.map(c=><option key={c.id} value={c.crop_name}>{c.crop_name}</option>)}</select><div className="mt-4 rounded-md border border-gray-200 p-4"><span className="inline-block rounded-full bg-[#2563EB]/10 px-2 py-1 text-[10px] font-semibold uppercase tracking-wide text-[#2563EB]">Simulated Forecast</span><div className="mt-3 grid grid-cols-2 gap-4"><Metric label="Current price" value={`₹${market.currentPricePerKg}/kg`} /><Metric label="7-day trend" value={`${market.weekTrendPct>0?"+":""}${market.weekTrendPct}%`} /><Metric label="Demand" value={market.demandLevel} /><Metric label="Selling window" value={market.sellingWindow} /></div><div className="mt-4 border-t border-gray-100 pt-3"><p className="text-xs text-[#5F6B63]">Forecast confidence: {market.forecastConfidence}% · Data status: Estimated (demo)</p></div></div><p className="mt-3 text-xs text-[#5F6B63]">This is calculated/estimated demo data, not a live market feed. Connect a real pricing source to make this production-accurate.</p></div>;
}
function Metric({label,value}:{label:string;value:string}){return <div><p className="text-xs text-[#5F6B63]">{label}</p><p className="mt-0.5 text-sm font-semibold text-[#17211B]">{value}</p></div>;}
