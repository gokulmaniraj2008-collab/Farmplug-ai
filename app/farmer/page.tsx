import Link from 'next/link';
import { ArrowRight, Bot, CheckCircle2, Download, Leaf, LineChart, MapPin, ShoppingCart, Smartphone, Wheat } from 'lucide-react';

const benefits=[['Manage farm supply','Keep crops, quantities, quality and availability organised in one farmer workspace.'],['Understand demand','See buyer requirements and market signals before deciding when and where to sell.'],['Use FarmPlug Intelligence','Review AI recommendations with reasons and confidence before taking action.'],['Connect to buyers','Match your available produce with relevant buyer requirements.']];

export default function FarmerPage(){
 return <main className="pageShell">
  <div className="mobilePageHead"><span>FARMERS / FPOs</span><b>FarmPlug AI</b><span>Join</span></div>
  <section className="pageHero">
   <span className="eyebrow"><Leaf size={14}/> FOR FARMERS / FPOs</span>
   <h1>Turn farm intelligence into better market decisions.</h1>
   <p>FarmPlug AI helps farmers and FPOs organise supply, understand demand, discover buyers and coordinate orders through one connected platform.</p>
   <div style={{display:'flex',gap:10,flexWrap:'wrap',marginTop:20}}>
    <Link href="/download" className="btn primary"><Download size={17}/> DOWNLOAD FARMER APP <ArrowRight size={16}/></Link>
    <Link href="/signin" className="btn secondary">SIGN IN</Link>
   </div>
  </section>
  <section className="pageCard"><h2><Smartphone size={21}/> The farmer experience</h2><p className="mutedText">The public website explains the platform. Daily farm operations happen in the dedicated mobile-first Farmer App with bottom navigation, notifications and phone capabilities.</p><div className="miniGrid"><div><Wheat size={20}/><b style={{display:'block',marginTop:9}}>My Farm</b><span className="mutedText">Crops, area and production</span></div><div><Bot size={20}/><b style={{display:'block',marginTop:9}}>AI Intelligence</b><span className="mutedText">Decision support</span></div><div><ShoppingCart size={20}/><b style={{display:'block',marginTop:9}}>Market</b><span className="mutedText">Demand and buyer matches</span></div><div><LineChart size={20}/><b style={{display:'block',marginTop:9}}>Orders</b><span className="mutedText">Fulfilment tracking</span></div></div></section>
  <section className="dashboardGrid">{benefits.map(([title,desc])=><div className="statCard" key={title}><CheckCircle2 size={19}/><strong style={{fontSize:17}}>{title}</strong><span>{desc}</span></div>)}</section>
  <section className="pageCard"><h2><Bot size={21}/> FarmPlug Intelligence</h2><p className="mutedText">Recommendations are designed as: <b>Recommendation → Reason → Confidence → Farmer confirmation.</b> This keeps AI as decision support rather than an unchecked automatic action.</p><div className="kpiRow"><b>Demand forecasting</b><span>Plan around demand</span></div><div className="kpiRow"><b>Selling-window intelligence</b><span>Review timing signals</span></div><div className="kpiRow"><b>Buyer matching</b><span>Connect supply to requirements</span></div><div className="kpiRow"><b>Route planning</b><span>Support collection and delivery</span></div></section>
  <section className="pageCard"><h2><MapPin size={21}/> Built for real farm workflows</h2><p className="mutedText">The app can evolve toward PWA/offline support, notifications, camera and GPS features while the website remains focused on discovery, explanation and onboarding.</p><Link href="/platform" className="btn secondary full">EXPLORE THE PLATFORM <ArrowRight size={16}/></Link></section>
 </main>;
}
