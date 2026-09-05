'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';

export default function DownloadPage() {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [installed, setInstalled] = useState(false);

  useEffect(() => {
    const onBeforeInstallPrompt = (event: Event) => {
      event.preventDefault();
      setDeferredPrompt(event as Event & { prompt: () => Promise<void>; userChoice: Promise<unknown> });
    };
    const onInstalled = () => setInstalled(true);
    window.addEventListener('beforeinstallprompt', onBeforeInstallPrompt as EventListener);
    window.addEventListener('appinstalled', onInstalled);
    return () => {
      window.removeEventListener('beforeinstallprompt', onBeforeInstallPrompt as EventListener);
      window.removeEventListener('appinstalled', onInstalled);
    };
  }, []);

  async function installApp() {
    if (!deferredPrompt) return;
    await deferredPrompt.prompt();
    await deferredPrompt.userChoice;
    setDeferredPrompt(null);
  }

  return (
    <main style={{minHeight:'100vh',display:'grid',placeItems:'center',padding:'24px',background:'linear-gradient(145deg,#f4fbf1,#ffffff)'}}>
      <section style={{width:'100%',maxWidth:560,textAlign:'center',padding:'32px',borderRadius:28,background:'#fff',boxShadow:'0 20px 60px rgba(25,80,30,.12)',border:'1px solid #dcebd8'}}>
        <div style={{fontSize:54}}>🌾</div>
        <h1 style={{fontSize:34,margin:'8px 0 6px'}}>FarmPlug AI</h1>
        <p style={{fontSize:18,color:'#45604a',marginBottom:8}}>Farmer PWA</p>
        <p style={{lineHeight:1.6,color:'#5b6d5e'}}>Use FarmPlug like an Android app without maintaining a separate Flutter client. List produce, run AI decisions, and track farm-to-market orders from one source of truth.</p>
        <button onClick={installApp} disabled={!deferredPrompt || installed} style={{width:'100%',padding:'15px 20px',border:0,borderRadius:14,background:installed?'#64756a':deferredPrompt?'#166534':'#91a097',color:'#fff',fontWeight:800,fontSize:16,marginTop:22,cursor:deferredPrompt && !installed?'pointer':'default'}}>
          {installed ? 'FarmPlug Installed ✓' : deferredPrompt ? 'Install FarmPlug on Android' : 'Open in Chrome to Install'}
        </button>
        <div style={{textAlign:'left',marginTop:22,padding:16,borderRadius:16,background:'#f7fbf7',border:'1px solid #e3ece5'}}>
          <strong>Android Chrome</strong>
          <p style={{fontSize:13,lineHeight:1.5,color:'#5b6d5e',margin:'7px 0 0'}}>If the install button is unavailable, open FarmPlug in Chrome, tap the browser menu, then choose <b>Install app</b> or <b>Add to Home screen</b>.</p>
        </div>
        <Link href="/" style={{display:'inline-block',marginTop:18,color:'#166534',fontWeight:700}}>Continue on FarmPlug Web →</Link>
        <p style={{fontSize:12,color:'#738076',marginTop:14}}>One Next.js codebase • One backend • One AI Decision Center</p>
      </section>
    </main>
  );
}
