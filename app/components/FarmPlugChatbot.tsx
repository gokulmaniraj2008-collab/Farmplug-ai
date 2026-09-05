'use client';

import { FormEvent, useState } from 'react';
import { Bot, ChevronDown, Send, Sparkles, X } from 'lucide-react';

type Message = { role: 'bot' | 'user'; text: string };

const quick = ['How can I sell my tomato?', 'Find buyers for 5,000 kg', 'What is FreshLife AI?', 'How does FarmPlug help FPOs?'];

function answer(input: string) {
  const q = input.toLowerCase();
  if (q.includes('tomato') || q.includes('sell')) return 'For the prototype, FarmPlug AI can assess your crop, quantity, quality, location and harvest timing, then suggest a selling window and suitable buyer matches. These are AI Demo Predictions — Prototype Demonstration results.';
  if (q.includes('buyer')) return 'Use the Decision Center with your quantity and quality. FarmPlug AI ranks demo buyer matches using quantity, quality, location, delivery fit and demand relevance. Demo data is not a real order book.';
  if (q.includes('freshlife') || q.includes('window')) return 'FreshLife AI is FarmPlug AI’s selling-window intelligence module. It is designed to estimate when perishable produce should be moved to market, subject to future validation with real storage and quality data.';
  if (q.includes('fpo') || q.includes('aggregation')) return 'FarmPlug AI helps FPOs combine fragmented farmer supply into bulk opportunities, then align the aggregated volume with suitable buyer requirements and collection planning.';
  if (q.includes('market') || q.includes('demand')) return 'FarmPlug AI focuses on market intelligence around the transaction: demand outlook, production decision support, selling-window intelligence, buyer matching, aggregation and logistics. It complements existing market infrastructure rather than replacing it.';
  return 'I can help with FarmPlug AI’s demand outlook, selling window, buyer matching, supply aggregation, FreshLife AI and logistics workflow. Try one of the suggested questions below.';
}

export default function FarmPlugChatbot() {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<Message[]>([
    { role: 'bot', text: 'Hi! I’m FarmPlug AI Assistant. Ask me about markets, buyers, selling windows, FPO aggregation or the demo.' },
  ]);

  const send = (event?: FormEvent) => {
    event?.preventDefault();
    const text = input.trim();
    if (!text) return;
    setMessages(prev => [...prev, { role: 'user', text }, { role: 'bot', text: answer(text) }]);
    setInput('');
  };

  return <>
    <button aria-label="Open FarmPlug AI chatbot" onClick={() => setOpen(true)} style={{position:'fixed',right:18,bottom:92,zIndex:120,width:58,height:58,border:0,borderRadius:'50%',background:'#166534',color:'#fff',display:open?'none':'grid',placeItems:'center',boxShadow:'0 12px 30px rgba(22,101,52,.32)',cursor:'pointer'}}><Bot size={25}/></button>
    {open && <div style={{position:'fixed',right:18,bottom:92,zIndex:121,width:'min(390px,calc(100vw - 28px))',height:'min(620px,calc(100vh - 125px))',background:'#fff',border:'1px solid #dfeae1',borderRadius:22,boxShadow:'0 20px 60px rgba(16,37,26,.22)',overflow:'hidden',display:'flex',flexDirection:'column'}}>
      <div style={{background:'#166534',color:'#fff',padding:'16px 17px',display:'flex',alignItems:'center',gap:11}}><span style={{width:38,height:38,borderRadius:13,background:'rgba(255,255,255,.14)',display:'grid',placeItems:'center'}}><Sparkles size={19}/></span><div style={{flex:1}}><b style={{display:'block'}}>FarmPlug AI Assistant</b><span style={{fontSize:11,opacity:.82}}>Market & farm intelligence • Demo</span></div><button aria-label="Close chatbot" onClick={() => setOpen(false)} style={{background:'transparent',border:0,color:'#fff',cursor:'pointer'}}><X size={20}/></button></div>
      <div style={{padding:'10px 12px',background:'#f7fbf7',borderBottom:'1px solid #e7efe8',display:'flex',gap:7,overflowX:'auto'}}>{quick.map(q => <button key={q} onClick={() => { setInput(q); }} style={{whiteSpace:'nowrap',border:'1px solid #dfeae1',background:'#fff',borderRadius:999,padding:'7px 10px',fontSize:10,color:'#425247',cursor:'pointer'}}>{q}</button>)}</div>
      <div style={{flex:1,overflowY:'auto',padding:14,background:'#fbfdfb'}}>{messages.map((m,i)=><div key={i} style={{display:'flex',justifyContent:m.role==='user'?'flex-end':'flex-start',margin:'0 0 10px'}}><div style={{maxWidth:'84%',padding:'10px 12px',borderRadius:m.role==='user'?'15px 15px 4px 15px':'15px 15px 15px 4px',background:m.role==='user'?'#eaf8ed':'#fff',border:'1px solid #e3ece5',fontSize:13,lineHeight:1.5,color:'#26352b'}}>{m.text}</div></div>)}</div>
      <form onSubmit={send} style={{display:'flex',gap:8,padding:10,borderTop:'1px solid #e3ece5',background:'#fff'}}><input value={input} onChange={e=>setInput(e.target.value)} placeholder="Ask FarmPlug AI…" aria-label="Ask FarmPlug AI" style={{flex:1,minWidth:0,border:'1px solid #dfeae1',borderRadius:13,padding:'11px 12px',outline:'none'}}/><button aria-label="Send message" style={{width:43,height:43,border:0,borderRadius:13,background:'#166534',color:'#fff',display:'grid',placeItems:'center',cursor:'pointer'}}><Send size={17}/></button></form>
      <div style={{fontSize:9,color:'#78857d',textAlign:'center',padding:'0 10px 8px'}}>Prototype assistant • Not a substitute for validated agronomic or commercial advice</div>
    </div>}
  </>;
}
