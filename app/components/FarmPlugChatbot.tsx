'use client';

import { FormEvent, useState } from 'react';
import { Bot, Send, Sparkles, X } from 'lucide-react';

type Message = { role: 'bot' | 'user'; text: string };
const quick = ['How can I sell my tomato?', 'Find buyers for 5,000 kg', 'What is FreshLife AI?', 'How does FarmPlug help FPOs?'];

export default function FarmPlugChatbot() {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { role: 'bot', text: 'Hi! I’m FarmPlug AI Assistant. Ask me about markets, buyers, selling windows, FPO aggregation or the demo.' },
  ]);

  const send = async (event?: FormEvent, preset?: string) => {
    event?.preventDefault();
    const text = (preset ?? input).trim();
    if (!text || loading) return;
    setInput('');
    setMessages(prev => [...prev, { role: 'user', text }]);
    setLoading(true);
    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: text, history: messages.slice(-8) }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Chat service unavailable');
      setMessages(prev => [...prev, { role: 'bot', text: data.text }]);
    } catch (error) {
      setMessages(prev => [...prev, { role: 'bot', text: error instanceof Error ? error.message : 'I could not reach Gemini right now. Please try again.' }]);
    } finally {
      setLoading(false);
    }
  };

  return <>
    <button aria-label="Open FarmPlug AI chatbot" onClick={() => setOpen(true)} style={{position:'fixed',right:18,bottom:92,zIndex:120,width:58,height:58,border:0,borderRadius:'50%',background:'#166534',color:'#fff',display:open?'none':'grid',placeItems:'center',boxShadow:'0 12px 30px rgba(22,101,52,.32)',cursor:'pointer'}}><Bot size={25}/></button>
    {open && <div style={{position:'fixed',right:18,bottom:92,zIndex:121,width:'min(390px,calc(100vw - 28px))',height:'min(620px,calc(100vh - 125px))',background:'#fff',border:'1px solid #dfeae1',borderRadius:22,boxShadow:'0 20px 60px rgba(16,37,26,.22)',overflow:'hidden',display:'flex',flexDirection:'column'}}>
      <div style={{background:'#166534',color:'#fff',padding:'16px 17px',display:'flex',alignItems:'center',gap:11}}><span style={{width:38,height:38,borderRadius:13,background:'rgba(255,255,255,.14)',display:'grid',placeItems:'center'}}><Sparkles size={19}/></span><div style={{flex:1}}><b style={{display:'block'}}>FarmPlug AI Assistant</b><span style={{fontSize:11,opacity:.82}}>Powered by Gemini • Farm intelligence</span></div><button aria-label="Close chatbot" onClick={() => setOpen(false)} style={{background:'transparent',border:0,color:'#fff',cursor:'pointer'}}><X size={20}/></button></div>
      <div style={{padding:'10px 12px',background:'#f7fbf7',borderBottom:'1px solid #e7efe8',display:'flex',gap:7,overflowX:'auto'}}>{quick.map(q => <button key={q} onClick={() => send(undefined,q)} disabled={loading} style={{whiteSpace:'nowrap',border:'1px solid #dfeae1',background:'#fff',borderRadius:999,padding:'7px 10px',fontSize:10,color:'#425247',cursor:'pointer'}}>{q}</button>)}</div>
      <div style={{flex:1,overflowY:'auto',padding:14,background:'#fbfdfb'}}>{messages.map((m,i)=><div key={i} style={{display:'flex',justifyContent:m.role==='user'?'flex-end':'flex-start',margin:'0 0 10px'}}><div style={{maxWidth:'84%',padding:'10px 12px',borderRadius:m.role==='user'?'15px 15px 4px 15px':'15px 15px 15px 4px',background:m.role==='user'?'#eaf8ed':'#fff',border:'1px solid #e3ece5',fontSize:13,lineHeight:1.5,color:'#26352b'}}>{m.text}</div></div>)}{loading&&<div style={{fontSize:12,color:'#64756a',padding:'5px 4px'}}>Gemini is thinking…</div>}</div>
      <form onSubmit={send} style={{display:'flex',gap:8,padding:10,borderTop:'1px solid #e3ece5',background:'#fff'}}><input value={input} onChange={e=>setInput(e.target.value)} placeholder="Ask FarmPlug AI…" aria-label="Ask FarmPlug AI" style={{flex:1,minWidth:0,border:'1px solid #dfeae1',borderRadius:13,padding:'11px 12px',outline:'none'}}/><button aria-label="Send message" disabled={loading} style={{width:43,height:43,border:0,borderRadius:13,background:'#166534',color:'#fff',display:'grid',placeItems:'center',cursor:'pointer',opacity:loading?.65:1}}><Send size={17}/></button></form>
      <div style={{fontSize:9,color:'#78857d',textAlign:'center',padding:'0 10px 8px'}}>Gemini-powered prototype assistant • Verify agronomic and commercial decisions before acting</div>
    </div>}
  </>;
}
