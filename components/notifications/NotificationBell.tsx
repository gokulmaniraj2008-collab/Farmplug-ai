// File location: components/notifications/NotificationBell.tsx
"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";

interface NotificationRow {
  id: string;
  title: string;
  body: string;
  is_read: boolean;
  created_at: string;
  entity_type: string | null;
  entity_id: string | null;
}

export default function NotificationBell() {
  const [notifications, setNotifications] = useState<NotificationRow[]>([]);
  const [open, setOpen] = useState(false);
  const supabase = createClient();

  useEffect(() => {
    let channel: ReturnType<typeof supabase.channel> | null = null;

    async function init() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      const { data } = await supabase.from("notifications").select("id, title, body, is_read, created_at, entity_type, entity_id").order("created_at", { ascending: false }).limit(20);
      setNotifications(data ?? []);
      channel = supabase.channel(`notifications:${user.id}`).on("postgres_changes", { event: "INSERT", schema: "public", table: "notifications", filter: `recipient_id=eq.${user.id}` }, (payload) => {
        setNotifications((prev) => [payload.new as NotificationRow, ...prev]);
      }).subscribe();
    }
    init();
    return () => { if (channel) supabase.removeChannel(channel); };
  }, []);

  const unreadCount = notifications.filter((n) => !n.is_read).length;

  async function markAllRead() {
    const unreadIds = notifications.filter((n) => !n.is_read).map((n) => n.id);
    if (unreadIds.length === 0) return;
    setNotifications((prev) => prev.map((n) => ({ ...n, is_read: true })));
    await supabase.from("notifications").update({ is_read: true }).in("id", unreadIds);
  }

  return (
    <div className="relative">
      <button type="button" onClick={() => { setOpen((v) => !v); if (!open) markAllRead(); }} className="relative rounded-full p-2 hover:bg-gray-100" aria-label="Notifications">
        🔔
        {unreadCount > 0 && <span className="absolute -right-0.5 -top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white">{unreadCount > 9 ? "9+" : unreadCount}</span>}
      </button>
      {open && <div className="absolute right-0 z-20 mt-2 w-80 rounded-lg border border-gray-200 bg-white shadow-lg"><div className="max-h-96 overflow-y-auto">
        {notifications.length === 0 ? <p className="p-4 text-sm text-gray-400">No notifications yet.</p> : notifications.map((n) => <div key={n.id} className="border-b border-gray-100 p-3 last:border-0"><div className="text-sm font-medium text-gray-900">{n.title}</div><div className="text-xs text-gray-500">{n.body}</div><div className="mt-1 text-[10px] text-gray-400">{new Date(n.created_at).toLocaleString()}</div></div>)}
      </div></div>}
    </div>
  );
}
