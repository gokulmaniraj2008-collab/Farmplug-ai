'use client';
import { useEffect } from 'react';
export default function Error({reset}:{error:Error&{digest?:string};reset:()=>void}){useEffect(()=>{},[]);return <main className="pageShell"><section className="pageHero"><span className="eyebrow">APPLICATION ERROR</span><h1>Something went wrong.</h1><p>FarmPlug AI could not load this screen. Retry without losing your current session.</p></section><button className="btn primary" onClick={()=>reset()}>Retry</button></main>}
