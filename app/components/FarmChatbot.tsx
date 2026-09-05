'use client';

import { useEffect, useMemo, useState } from 'react';
import { Bot, ChevronDown, Loader2, Send, Sparkles, X } from 'lucide-react';

type Message = { role: 'user' | 'assistant'; text: string };

const starters = [
  'What should I check before selling my crop?',
  'How does FarmPlug match me with buyers?',
  'Explain the selling window',
];

export default function FarmChatbot() {
  const [visible, setVisible] = useState(false);
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState('');
  const [busy, setBusy] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { role: 'assistant', text: 'Vanakkam! I’m FarmPlug AI. Ask me about your market, buyers, selling window, aggregation or orders.' },
  ]);

  useEffect(() => {
    setVisible(window.location.pathname === '/app-v2');
  }, []);

  const history = useMemo(() => messages.slice(-8), [messages]);

  if (!visible) return null;

  const send = async (preset?: string) => {
    const text = (preset ?? input).trim();
    if (!text || busy) return;
    setInput('');
    const next = [...messages, { role: 'user' as const, text }];
    setMessages(next);
    setBusy(true);
    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: text, history: history.map(m => ({ role: m.role, text: m.text })) }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data?.error || 'FarmPlug AI is temporarily unavailable.');
      setMessages(prev => [...prev, { role: 'assistant', text: data.text || 'I could not generate an answer. Please try again.' }]);
    } catch (error) {
      setMessages(prev => [...prev, { role: 'assistant', text: error instanceof Error ? error.message : 'Something went wrong. Please try again.' }]);
    } finally {
      setBusy(false);
    }
  };

  return <>
    <button className="fp-chat-fab" onClick={() => setOpen(v => !v)} aria-label={open ? 'Close FarmPlug AI' : 'Open FarmPlug AI'}>
      {open ? <X size={22} /> : <Bot size={23} />}
      {!open && <span className="fp-chat-dot" />}
    </button>

    {open && <section className="fp-chat-panel" aria-label="FarmPlug AI chat">
      <header className="fp-chat-head">
        <div className="fp-chat-avatar"><Sparkles size={18} /></div>
        <div><strong>FarmPlug AI</strong><span>Market & farm assistant</span></div>
        <button onClick={() => setOpen(false)} aria-label="Minimize chat"><ChevronDown size={19} /></button>
      </header>
      <div className="fp-chat-messages">
        {messages.map((m, i) => <div key={`${m.role}-${i}`} className={`fp-chat-msg ${m.role}`}><span>{m.text}</span></div>)}
        {busy && <div className="fp-chat-msg assistant"><span><Loader2 size={15} className="fp-spin" /> Thinking…</span></div>}
      </div>
      {messages.length === 1 && <div className="fp-chat-starters">{starters.map(s => <button key={s} onClick={() => send(s)}>{s}</button>)}</div>}
      <form className="fp-chat-input" onSubmit={e => { e.preventDefault(); void send(); }}>
        <input value={input} onChange={e => setInput(e.target.value)} placeholder="Ask FarmPlug AI…" maxLength={2000} disabled={busy} />
        <button type="submit" disabled={busy || !input.trim()} aria-label="Send"><Send size={18} /></button>
      </form>
      <small className="fp-chat-note">AI answers use available FarmPlug data. Prototype forecasts are clearly labelled.</small>
    </section>}

    <style jsx>{`
      .fp-chat-fab{position:fixed;right:18px;bottom:88px;width:56px;height:56px;border:0;border-radius:50%;background:#166534;color:#fff;display:grid;place-items:center;box-shadow:0 12px 32px rgba(22,101,52,.32);z-index:260;cursor:pointer}
      .fp-chat-dot{position:absolute;right:3px;top:3px;width:10px;height:10px;border-radius:50%;background:#86efac;border:2px solid #166534}
      .fp-chat-panel{position:fixed;right:16px;bottom:154px;width:min(390px,calc(100vw - 32px));height:min(620px,calc(100vh - 190px));background:#fff;border:1px solid #dfe9e2;border-radius:22px;box-shadow:0 24px 70px rgba(16,37,26,.22);z-index:259;display:flex;flex-direction:column;overflow:hidden}
      .fp-chat-head{display:flex;align-items:center;gap:10px;padding:14px 15px;background:#f4faf5;border-bottom:1px solid #e3ece5}
      .fp-chat-avatar{width:38px;height:38px;border-radius:13px;background:#e3f6e7;color:#166534;display:grid;place-items:center}
      .fp-chat-head div:nth-child(2){display:flex;flex-direction:column;flex:1}.fp-chat-head strong{font-size:14px;color:#163b23}.fp-chat-head span{font-size:10px;color:#718077;margin-top:2px}.fp-chat-head button{border:0;background:transparent;color:#64756a;cursor:pointer}
      .fp-chat-messages{flex:1;overflow:auto;padding:14px;display:flex;flex-direction:column;gap:9px;background:#fbfdfb}.fp-chat-msg{display:flex;max-width:88%;font-size:13px;line-height:1.5}.fp-chat-msg span{padding:10px 12px;border-radius:15px;white-space:pre-wrap}.fp-chat-msg.assistant{align-self:flex-start}.fp-chat-msg.assistant span{background:#eef7f0;color:#23412d;border-top-left-radius:5px}.fp-chat-msg.user{align-self:flex-end}.fp-chat-msg.user span{background:#166534;color:#fff;border-top-right-radius:5px}.fp-spin{vertical-align:-3px;animation:fp-spin 1s linear infinite}.fp-chat-starters{padding:8px 12px;display:flex;gap:7px;overflow:auto;border-top:1px solid #edf2ee}.fp-chat-starters button{white-space:nowrap;border:1px solid #dce8df;background:#fff;border-radius:999px;padding:8px 10px;font-size:10px;color:#31553d;cursor:pointer}
      .fp-chat-input{display:flex;gap:8px;padding:10px;border-top:1px solid #e3ece5;background:#fff}.fp-chat-input input{flex:1;min-width:0;border:1px solid #dfe9e2;border-radius:13px;padding:11px 12px;outline:none;font-size:13px}.fp-chat-input input:focus{border-color:#7ab889}.fp-chat-input button{width:42px;border:0;border-radius:13px;background:#166534;color:#fff;display:grid;place-items:center;cursor:pointer}.fp-chat-input button:disabled{opacity:.45;cursor:not-allowed}.fp-chat-note{padding:0 12px 10px;color:#89958e;font-size:9px;line-height:1.4}
      @keyframes fp-spin{to{transform:rotate(360deg)}}
      @media(max-width:480px){.fp-chat-fab{right:15px;bottom:91px}.fp-chat-panel{right:8px;bottom:151px;width:calc(100vw - 16px);height:min(70vh,600px);border-radius:20px}}
      @media(display-mode:standalone){.fp-chat-fab{bottom:88px}.fp-chat-panel{bottom:155px}}
    `}</style>
  </>;
}
