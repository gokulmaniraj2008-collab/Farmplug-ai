import Link from 'next/link';

const apkUrl = 'https://github.com/gokulmaniraj2008-collab/Farmplug-ai/releases/latest/download/farmplug-farmer.apk';

export default function DownloadPage() {
  return (
    <main style={{minHeight:'100vh',display:'grid',placeItems:'center',padding:'24px',background:'linear-gradient(145deg,#f4fbf1,#ffffff)'}}>
      <section style={{width:'100%',maxWidth:520,textAlign:'center',padding:'32px',borderRadius:28,background:'#fff',boxShadow:'0 20px 60px rgba(25,80,30,.12)',border:'1px solid #dcebd8'}}>
        <div style={{fontSize:54}}>🌾</div>
        <h1 style={{fontSize:34,margin:'8px 0 6px'}}>FarmPlug AI</h1>
        <p style={{fontSize:18,color:'#45604a'}}>Farmer mobile app</p>
        <p style={{lineHeight:1.6,color:'#5b6d5e'}}>List your produce, run FarmPlug AI decisions, and track your farm-to-market orders from your Android phone.</p>
        <a href={apkUrl} style={{display:'block',padding:'15px 20px',borderRadius:14,background:'#1f7a3f',color:'#fff',fontWeight:800,textDecoration:'none',marginTop:22}}>Download Android APK</a>
        <p style={{fontSize:12,color:'#738076',marginTop:12}}>Prototype release • Android • Internet connection required</p>
        <Link href="/" style={{display:'inline-block',marginTop:10,color:'#1f7a3f',fontWeight:700}}>Continue on FarmPlug Web →</Link>
      </section>
    </main>
  );
}
