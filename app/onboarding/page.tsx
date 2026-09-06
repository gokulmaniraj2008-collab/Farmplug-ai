'use client';

import { useMemo, useState } from 'react';
import { ArrowRight, Check, Leaf, MapPin, Sparkles, TrendingUp, Users, Wheat } from 'lucide-react';

const steps = [
  { label: 'Goal', title: 'What do you want FarmPlug AI to help you achieve?', sub: 'Choose your main outcome. You can change this later.' },
  { label: 'Farm & Crop', title: 'Tell us what you are growing.', sub: 'This lets FarmPlug tailor market and selling recommendations.' },
  { label: 'Market Needs', title: 'What matters most when you sell?', sub: 'We use these preferences to prioritize opportunities.' },
  { label: 'First Insight', title: 'Here is your first FarmPlug insight.', sub: 'This is a transparent example until live market data is available.' },
  { label: 'Ready', title: 'Your FarmPlug workspace is ready.', sub: 'Next, create a produce listing and start comparing buyer opportunities.' },
];

export default function OnboardingPage() {
  const [step, setStep] = useState(0);
  const [goal, setGoal] = useState('Get better prices');
  const [crop, setCrop] = useState('Tomato');
  const [quantity, setQuantity] = useState('500');
  const [priority, setPriority] = useState('Better price');
  const current = steps[step];
  const progress = useMemo(() => ((step + 1) / steps.length) * 100, [step]);

  const next = () => setStep((value) => Math.min(value + 1, steps.length - 1));
  const back = () => setStep((value) => Math.max(value - 1, 0));

  return (
    <main style={styles.page}>
      <div style={styles.shell}>
        <header style={styles.header}>
          <div style={styles.brand}><span style={styles.logo}><Leaf size={20} /></span><b>FarmPlug <span style={{ color: '#4f8f3a' }}>AI</span></b></div>
          <button style={styles.skip} onClick={() => setStep(4)}>Skip for now</button>
        </header>

        <section style={styles.card}>
          <div style={styles.progressWrap}>
            <div style={styles.progressTrack}><div style={{ ...styles.progress, width: `${progress}%` }} /></div>
            <div style={styles.steps}>
              {steps.map((item, index) => <div key={item.label} style={styles.stepItem}>
                <span style={{ ...styles.stepDot, ...(index <= step ? styles.stepDotActive : {}) }}>{index < step ? <Check size={14} /> : index + 1}</span>
                <small style={{ ...(index === step ? styles.stepLabelActive : {}) }}>{item.label}</small>
              </div>)}
            </div>
          </div>

          <div style={styles.content}>
            <div style={styles.eyebrow}>STEP {step + 1} OF 5</div>
            <h1 style={styles.title}>{current.title}</h1>
            <p style={styles.sub}>{current.sub}</p>

            {step === 0 && <div style={styles.grid}>{['Get better prices', 'Find verified buyers', 'Know when to sell', 'Manage my FPO'].map((item) => <button key={item} onClick={() => setGoal(item)} style={{ ...styles.option, ...(goal === item ? styles.optionActive : {}) }}><span style={styles.icon}><TrendingUp size={20} /></span><span><b>{item}</b><small>{item === 'Get better prices' ? 'Price discovery & comparison' : item === 'Find verified buyers' ? 'Direct buyer matching' : item === 'Know when to sell' ? 'Selling-window guidance' : 'Supply & farmer coordination'}</small></span>{goal === item && <Check size={18} />}</button>)}</div>}

            {step === 1 && <div style={styles.form}><label>Farm location</label><div style={styles.inputLike}><MapPin size={18} /> Coimbatore, Tamil Nadu</div><label>Primary crop</label><select value={crop} onChange={(e) => setCrop(e.target.value)} style={styles.input}><option>Tomato</option><option>Onion</option><option>Potato</option><option>Mango</option><option>Other</option></select><label>Expected available quantity (kg)</label><input value={quantity} onChange={(e) => setQuantity(e.target.value)} type="number" min="1" style={styles.input} /></div>}

            {step === 2 && <div style={styles.grid}>{['Better price', 'Nearby buyer', 'Fast payment', 'Reliable delivery'].map((item) => <button key={item} onClick={() => setPriority(item)} style={{ ...styles.option, ...(priority === item ? styles.optionActive : {}) }}><span style={styles.icon}>{item === 'Nearby buyer' ? <Users size={20} /> : <Wheat size={20} />}</span><span><b>{item}</b><small>{item === 'Better price' ? 'Maximize selling value' : item === 'Nearby buyer' ? 'Reduce travel distance' : item === 'Fast payment' ? 'Prioritize payment speed' : 'Simplify logistics'}</small></span>{priority === item && <Check size={18} />}</button>)}</div>}

            {step === 3 && <div style={styles.insight}><div style={styles.insightIcon}><Sparkles size={24} /></div><div><span style={styles.badge}>TRANSPARENT DEMO INSIGHT</span><h2>{crop} • {quantity} kg</h2><p>Your selected goal is <b>{goal.toLowerCase()}</b>, with <b>{priority.toLowerCase()}</b> as your selling priority.</p><div style={styles.insightRow}><span>AI price discovery</span><b>Ready to compare</b></div><div style={styles.insightRow}><span>Buyer matching</span><b>Ready after listing</b></div><div style={styles.notice}>Live price/forecast data is not invented here. FarmPlug will show verified stored data when available.</div></div></div>}

            {step === 4 && <div style={styles.ready}><div style={styles.readyIcon}><Check size={32} /></div><h2>Ready to make your first market decision.</h2><div style={styles.summary}><span>Goal</span><b>{goal}</b><span>Crop</span><b>{crop} • {quantity} kg</b><span>Priority</span><b>{priority}</b></div><button style={styles.primary} onClick={() => window.location.href = '/app-v2'}>Open FarmPlug workspace <ArrowRight size={18} /></button></div>}
          </div>

          {step < 4 && <div style={styles.footer}><button style={styles.secondary} disabled={step === 0} onClick={back}>Back</button><button style={styles.primary} onClick={next}>{step === 3 ? 'Continue' : 'Continue'} <ArrowRight size={18} /></button></div>}
        </section>

        <p style={styles.bottomNote}><Leaf size={14} /> Every step creates value. You can update your choices later.</p>
      </div>
    </main>
  );
}

const styles: Record<string, React.CSSProperties> = {
  page: { minHeight: '100vh', background: 'linear-gradient(180deg,#f5f8f1 0%,#fff 55%)', color: '#162014', padding: '16px' },
  shell: { width: '100%', maxWidth: 760, margin: '0 auto' },
  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 2px 18px' },
  brand: { display: 'flex', alignItems: 'center', gap: 9, fontSize: 19 },
  logo: { width: 36, height: 36, borderRadius: 12, display: 'grid', placeItems: 'center', background: '#173c20', color: '#fff' },
  skip: { border: 0, background: 'transparent', color: '#58705a', fontWeight: 700, padding: 8 },
  card: { background: '#fff', border: '1px solid #e5eadf', borderRadius: 24, boxShadow: '0 16px 50px rgba(29,52,25,.08)', overflow: 'hidden' },
  progressWrap: { padding: '22px 22px 10px' },
  progressTrack: { height: 4, background: '#e9eee5', borderRadius: 10, overflow: 'hidden' },
  progress: { height: '100%', background: '#4f8f3a', borderRadius: 10, transition: 'width .25s ease' },
  steps: { display: 'grid', gridTemplateColumns: 'repeat(5,1fr)', gap: 8, marginTop: 12 },
  stepItem: { display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6, minWidth: 0 },
  stepDot: { width: 30, height: 30, borderRadius: 999, display: 'grid', placeItems: 'center', background: '#f1f3ef', color: '#71806f', fontSize: 12, fontWeight: 800 },
  stepDotActive: { background: '#4f8f3a', color: '#fff' },
  stepLabelActive: { color: '#1d3f20', fontWeight: 800 },
  content: { padding: '30px clamp(18px,5vw,48px) 34px' },
  eyebrow: { color: '#4f8f3a', fontSize: 11, letterSpacing: 1.5, fontWeight: 900 },
  title: { fontSize: 'clamp(26px,6vw,40px)', lineHeight: 1.08, margin: '9px 0 10px', letterSpacing: '-.7px' },
  sub: { color: '#687266', margin: 0, fontSize: 15, lineHeight: 1.55, maxWidth: 600 },
  grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(240px,1fr))', gap: 12, marginTop: 26 },
  option: { display: 'flex', alignItems: 'center', gap: 12, textAlign: 'left', border: '1px solid #e4e9e0', background: '#fff', borderRadius: 16, padding: 16, minHeight: 82, cursor: 'pointer', color: '#1b251a' },
  optionActive: { borderColor: '#8cb27d', background: '#f5faF2', boxShadow: '0 0 0 2px rgba(79,143,58,.08)' },
  icon: { width: 42, height: 42, borderRadius: 13, display: 'grid', placeItems: 'center', background: '#eef6e9', color: '#4f8f3a', flexShrink: 0 },
  form: { display: 'grid', gap: 9, marginTop: 24 },
  input: { width: '100%', boxSizing: 'border-box', border: '1px solid #dfe5da', borderRadius: 13, padding: '13px 14px', fontSize: 15, background: '#fff', color: '#1b251a' },
  inputLike: { display: 'flex', alignItems: 'center', gap: 8, border: '1px solid #dfe5da', borderRadius: 13, padding: '13px 14px', color: '#3f4e3e', background: '#fafcf9' },
  insight: { marginTop: 25, border: '1px solid #dfe9d8', borderRadius: 20, padding: 20, display: 'flex', gap: 16, background: '#fbfdf9' },
  insightIcon: { width: 48, height: 48, borderRadius: 15, background: '#eaf4e4', color: '#4f8f3a', display: 'grid', placeItems: 'center', flexShrink: 0 },
  badge: { fontSize: 10, letterSpacing: 1, fontWeight: 900, color: '#6a8064' },
  insightRow: { display: 'flex', justifyContent: 'space-between', gap: 16, padding: '12px 0', borderBottom: '1px solid #e8eee5', fontSize: 14 },
  notice: { marginTop: 14, padding: 12, borderRadius: 12, background: '#f1f4ef', color: '#62705f', fontSize: 12, lineHeight: 1.5 },
  ready: { marginTop: 25, textAlign: 'center', padding: '14px 0 4px' },
  readyIcon: { margin: '0 auto 15px', width: 62, height: 62, borderRadius: 20, display: 'grid', placeItems: 'center', background: '#eaf4e4', color: '#4f8f3a' },
  summary: { display: 'grid', gridTemplateColumns: '1fr 1.5fr', gap: 10, textAlign: 'left', margin: '22px auto', maxWidth: 420, padding: 16, borderRadius: 16, background: '#f7f9f5', fontSize: 14 },
  footer: { display: 'flex', gap: 10, padding: '14px 22px 22px', borderTop: '1px solid #edf0eb' },
  secondary: { flex: 1, minHeight: 50, border: '1px solid #dfe5da', borderRadius: 13, background: '#fff', fontWeight: 800, color: '#566353' },
  primary: { flex: 2, minHeight: 50, border: 0, borderRadius: 13, background: '#173c20', color: '#fff', fontWeight: 800, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, cursor: 'pointer', padding: '0 18px' },
  bottomNote: { display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, color: '#73806f', fontSize: 12, margin: '16px 0' },
};
