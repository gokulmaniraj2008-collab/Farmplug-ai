'use client';
import { useState } from 'react';
import { Loader2,LogOut } from 'lucide-react';
import { supabase } from '../../lib/supabase';
export default function SignOutButton(){const [busy,setBusy]=useState(false);async function signOut(){if(!supabase)return;setBusy(true);await supabase.auth.signOut();location.href='/signin'}return <button type="button" className="btn secondary" onClick={signOut} disabled={busy}>{busy?<><Loader2 size={15}/> Signing out…</>:<><LogOut size={15}/> Sign out</>}</button>}
