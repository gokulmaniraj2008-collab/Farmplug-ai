"use client";
import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";

type UserRow = { id:string; email:string|null; role:string|null; farm_role:string|null; profile_complete:boolean; auth_provider:string|null; phone:string|null; location_text:string|null };
export default function AdminUsersPage(){
 const [users,setUsers]=useState<UserRow[]>([]); const [filter,setFilter]=useState("all");
 useEffect(()=>{(async()=>{const {data}=await createClient().from("profiles").select("id,email,role,farm_role,profile_complete,auth_provider,phone,location_text").order("email");setUsers(data??[]);})();},[]);
 const shown=filter==="all"?users:users.filter(u=>(u.role==="admin"?"admin":u.farm_role)===filter);
 return <main className="mx-auto max-w-6xl p-6"><h1 className="text-2xl font-bold">Users</h1><div className="mt-4 flex flex-wrap gap-2">{["all","farmer","buyer","fpo","admin"].map(x=><button key={x} onClick={()=>setFilter(x)} className={`rounded-full px-3 py-1 text-sm ${filter===x?"bg-green-600 text-white":"bg-gray-100"}`}>{x}</button>)}</div><div className="mt-5 overflow-x-auto rounded-2xl border"><table className="w-full text-left text-sm"><thead className="bg-gray-50"><tr>{["Email","Role","Phone","Location","Profile"].map(h=><th key={h} className="px-4 py-3">{h}</th>)}</tr></thead><tbody>{shown.map(u=><tr key={u.id} className="border-t"><td className="px-4 py-3">{u.email??"—"}</td><td className="px-4 py-3 capitalize">{u.role==="admin"?"admin":u.farm_role??"unassigned"}</td><td className="px-4 py-3">{u.phone??"—"}</td><td className="px-4 py-3">{u.location_text??"—"}</td><td className="px-4 py-3">{u.profile_complete?"Complete":"Incomplete"}</td></tr>)}</tbody></table></div></main>;
}
