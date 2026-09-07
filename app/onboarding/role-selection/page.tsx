"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, ArrowRight, Building2, Check, Leaf, ShoppingBasket } from "lucide-react";

type Role="farmer"|"buyer"|"fpo";
const roles:{value:Role;label:string;eyebrow:string;description:string;icon:typeof Leaf}[]=[
 {value:"farmer",label:"Farmer",eyebrow:"Grow & sell",description:"Manage your farm, crops, AI insights and selling opportunities.",icon:Leaf},
 {value:"buyer",label:"Buyer",eyebrow:"Source produce",description:"Create requirements, discover supply and connect with farmers.",icon:ShoppingBasket},
 {value:"fpo",label:"FPO / Aggregator",eyebrow:"Coordinate supply",description:"Aggregate farmers, manage collection and fulfil buyer demand.",icon:Building2},
];
export default function RoleSelectionPage(){
 const router=useRouter(); const[selected,setSelected]=useState<Role|null>(null);
 function submit(){if(!selected)return; localStorage.setItem("farmplug_onboarding_role",selected); router.push(`/signup?role=${selected}`)}
 return <main className="min-h-screen bg-[#F7FAF7] px-4 py-5 text-[#172117] sm:px-6 sm:py-8">
  <div className="mx-auto flex min-h-[calc(100vh-2.5rem)] max-w-3xl flex-col">
   <div className="flex items-center justify-between"><button onClick={()=>router.back()} aria-label="Go back" className="grid size-10 place-items-center rounded-full border border-[#DCE6DC] bg-white text-[#526052] shadow-sm transition hover:bg-[#F1F6F1]"><ArrowLeft size={18}/></button><div className="flex items-center gap-2 text-sm font-extrabold"><span className="grid size-9 place-items-center rounded-xl bg-[#EAF6ED] text-[#1E7A3D]"><Leaf size={19}/></span>FarmPlug AI</div><span className="w-10"/></div>
   <div className="mx-auto mt-8 w-full max-w-2xl sm:mt-12">
    <div className="flex items-center gap-2 text-xs font-bold text-[#2E9E4F]"><span className="grid size-6 place-items-center rounded-full bg-[#2E9E4F] text-white"><Check size={14}/></span>STEP 1 OF 3</div>
    <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-[#E3ECE3]"><div className="h-full w-1/3 rounded-full bg-[#2E9E4F]"/></div>
    <h1 className="mt-8 text-3xl font-black tracking-tight sm:text-5xl">What brings you to FarmPlug?</h1><p className="mt-3 max-w-xl text-sm leading-6 text-[#647064] sm:text-base">Choose your workspace. We’ll personalize the next steps around how you work.</p>
    <div className="mt-7 grid gap-3">{roles.map(r=>{const Icon=r.icon;const active=selected===r.value;return <button key={r.value} type="button" onClick={()=>setSelected(r.value)} aria-pressed={active} className={`relative flex min-h-28 w-full items-center gap-4 rounded-2xl border p-4 text-left transition duration-200 sm:p-5 ${active?"border-[#2E9E4F] bg-[#EDF8EF] shadow-[0_8px_24px_rgba(46,158,79,.10)]":"border-[#DCE6DC] bg-white hover:-translate-y-0.5 hover:border-[#B8DCC0] hover:shadow-sm"}`}><span className={`grid size-12 shrink-0 place-items-center rounded-2xl ${active?"bg-[#2E9E4F] text-white":"bg-[#EAF6ED] text-[#1E7A3D]"}`}><Icon size={23}/></span><span className="min-w-0"><span className="block text-xs font-bold uppercase tracking-wide text-[#8A6817]">{r.eyebrow}</span><span className="mt-0.5 block font-extrabold text-[#172117]">{r.label}</span><span className="mt-1 block text-sm leading-5 text-[#647064]">{r.description}</span></span>{active&&<span className="ml-auto grid size-7 shrink-0 place-items-center rounded-full bg-[#2E9E4F] text-white"><Check size={15}/></span>}</button>})}</div>
    <button disabled={!selected} onClick={submit} className="mt-5 flex min-h-13 w-full items-center justify-center gap-2 rounded-2xl bg-[#2E9E4F] text-sm font-extrabold text-white shadow-sm transition hover:bg-[#268C45] disabled:cursor-not-allowed disabled:opacity-40">Continue <ArrowRight size={18}/></button>
    <p className="mt-4 text-center text-xs text-[#7A857A]">You can change workspace details later. Admin access is assigned separately.</p>
   </div>
  </div>
 </main>;
}
