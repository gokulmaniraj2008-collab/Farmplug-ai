'use client';

import Link from 'next/link';

export default function DownloadPage() {
  return (
    <main style={{ minHeight: '100vh', display: 'grid', placeItems: 'center', padding: '24px', background: 'linear-gradient(145deg,#f4fbf1,#ffffff)' }}>
      <section style={{ width: '100%', maxWidth: 560, textAlign: 'center', padding: '32px', borderRadius: 28, background: '#fff', boxShadow: '0 20px 60px rgba(25,80,30,.12)', border: '1px solid #dcebd8' }}>
        <div style={{ fontSize: 54 }}>🌾</div>
        <h1 style={{ fontSize: 34, margin: '8px 0 6px' }}>FarmPlug AI</h1>
        <p style={{ fontSize: 18, color: '#45604a' }}>Farmer Android App</p>
        <p style={{ lineHeight: 1.6, color: '#5b6d5e' }}>
          Get the FarmPlug AI Farmer App directly from FarmPlug.
        </p>
        <a href="/api/download-apk" download="FarmPlug-AI.apk" style={{ display: 'block', width: '100%', boxSizing: 'border-box', padding: '15px 20px', borderRadius: 14, background: '#166534', color: '#fff', fontWeight: 800, fontSize: 16, marginTop: 22, textDecoration: 'none' }}>
          Download App
        </a>
        <div style={{ textAlign: 'left', marginTop: 22, padding: 16, borderRadius: 16, background: '#f7fbf7', border: '1px solid #e3ece5' }}>
          <strong>Android installation</strong>
          <p style={{ fontSize: 13, lineHeight: 1.5, color: '#5b6d5e', margin: '7px 0 0' }}>
            The app download stays on the FarmPlug domain. After downloading, open the APK and allow installation from this source if Android asks.
          </p>
        </div>
        <Link href="/" style={{ display: 'inline-block', marginTop: 18, color: '#166534', fontWeight: 700 }}>Continue on FarmPlug Web →</Link>
        <p style={{ fontSize: 12, color: '#738076', marginTop: 14 }}>FarmPlug AI • Farmer App</p>
      </section>
    </main>
  );
}
