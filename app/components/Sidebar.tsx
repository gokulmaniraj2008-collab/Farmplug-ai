'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { Home, Sparkles, Store, Info, Menu, X, Users, Download, LayoutGrid, LogIn } from 'lucide-react';

const items=[
  {href:'/',label:'Home',icon:Home},
  {href:'/platform',label:'Platform',icon:LayoutGrid},
  {href:'/decision-center',label:'AI Intelligence',icon:Sparkles},
  {href:'/marketplace',label:'Marketplace',icon:Store},
  {href:'/farmer',label:'Farmers / FPOs',icon:Users},
  {href:'/buyer',label:'For Buyers',icon:Store},
  {href:'/about',label:'About',icon:Info},
  {href:'/signin',label:'Sign In',icon:LogIn},
  {href:'/download',label:'Download App',icon:Download},
];

const mobileItems=[items[0],items[2],items[3],items[4],items[8]];
const logo=<img src="/icons/farmplug-icon.svg" alt="FarmPlug AI logo" width={40} height={40}/>;

export default function Sidebar(){
  const pathname=usePathname();
  const[open,setOpen]=useState(false);
  const isActive=(href:string)=>href==='/'?pathname==='/':pathname===href||pathname.startsWith(`${href}/`);
  const nav=()=> <nav className="sideNav" aria-label="FarmPlug navigation">{items.map(({href,label,icon:Icon})=><Link key={href} href={href} onClick={()=>setOpen(false)} className={isActive(href)?'sideItem active':'sideItem'}><Icon size={19} strokeWidth={isActive(href)?2.5:2}/><span>{label}</span></Link>)}</nav>;
  return <>
    <button className="desktopMenuButton" onClick={()=>setOpen(true)} aria-label="Open navigation"><Menu size={22}/></button>
    {open&&<div className="sideOverlay" onClick={()=>setOpen(false)} aria-hidden="true"/>}
    <aside className={open?'desktopSidebar open':'desktopSidebar'} aria-label="Desktop navigation"><div className="sideBrand"><div className="sideLogo">{logo}</div><div><strong>FarmPlug AI</strong><small>Farm intelligence → market</small></div><button className="sideClose" onClick={()=>setOpen(false)} aria-label="Close navigation"><X size={21}/></button></div>{nav()}<div className="sideFooter">SIH 2026 · PS 26033<br/><span>Professional platform prototype</span></div></aside>
    <button className="mobileMenuButton" onClick={()=>setOpen(true)} aria-label="Open navigation"><Menu size={22}/></button>
    <aside className={open?'mobileSidebar open':'mobileSidebar'} aria-label="Mobile navigation"><div className="sideBrand"><div className="sideLogo">{logo}</div><div><strong>FarmPlug AI</strong><small>Platform</small></div><button className="sideClose" onClick={()=>setOpen(false)} aria-label="Close navigation"><X size={21}/></button></div>{nav()}<div className="sideFooter">SIH 2026 · PS 26033</div></aside>
    <nav className="bottomNav" aria-label="Quick mobile navigation">{mobileItems.map(({href,label,icon:Icon})=><Link key={href} href={href} className={isActive(href)?'bottomItem active':'bottomItem'}><Icon size={20} strokeWidth={isActive(href)?2.6:2}/><span>{label==='Download App'?'Download':label}</span></Link>)}</nav>
  </>;
}
