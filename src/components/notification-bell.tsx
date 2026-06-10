"use client";

import { useEffect, useRef, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import Link from "next/link";

type NotificationData = Record<string, string>;

type Notification = {
  id: string;
  type: string;
  title: string;
  body: string | null;
  data: NotificationData | null;
  read: boolean;
  created_at: string | null;
};

export function NotificationBell({ userId }: { userId: string }) {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const supabaseRef = useRef(createClient());
  const supabase = supabaseRef.current;

  const unread = notifications.filter((n) => !n.read).length;

  const fetchNotifications = async () => {
    const { data } = await supabase
      .from("notifications")
      .select("id, type, title, body, data, read, created_at")
      .eq("user_id", userId)
      .order("created_at", { ascending: false })
      .limit(20);
    if (data) setNotifications(data.map((row) => ({
      ...row,
      data: typeof row.data === 'object' && row.data !== null && !Array.isArray(row.data)
        ? (row.data as NotificationData)
        : null,
    })));
  };

  useEffect(() => {
    fetchNotifications();

    const channelName = `notifications-${userId}-${performance.now()}`;
    const channel = supabase
      .channel(channelName)
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "notifications", filter: `user_id=eq.${userId}` },
        () => fetchNotifications()
      )
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, [userId]);

  // Close on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const markRead = async () => {
    const unreadIds = notifications.filter((n) => !n.read).map((n) => n.id);
    if (!unreadIds.length) return;
    await supabase.from("notifications").update({ read: true }).in("id", unreadIds);
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const handleOpen = () => {
    const next = !open;
    setOpen(next);
    if (next && unread > 0) {
      setTimeout(markRead, 1500);
    }
  };

  const icon = (type: string) => {
    if (type === "application_received") return "📬";
    if (type === "application_accepted") return "🎉";
    if (type === "application_rejected") return "❌";
    return "🔔";
  };

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={handleOpen}
        className="relative p-1.5 rounded-lg hover:bg-muted transition-colors"
        aria-label="Notifications"
      >
        <svg viewBox="0 0 24 24" className="w-5 h-5 fill-none stroke-current stroke-[1.8]">
          <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M13.73 21a2 2 0 0 1-3.46 0" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        {unread > 0 && (
          <span className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] bg-primary text-primary-foreground text-[10px] font-bold rounded-full flex items-center justify-center px-1 leading-none">
            {unread > 9 ? "9+" : unread}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-80 max-h-[420px] overflow-y-auto bg-card border border-border/60 rounded-2xl shadow-xl shadow-black/10 z-50">
          <div className="px-4 py-3 border-b border-border/60 flex items-center justify-between">
            <p className="text-sm font-semibold">Notifications</p>
            {unread > 0 && (
              <button onClick={markRead} className="text-xs text-muted-foreground hover:text-foreground transition-colors">
                Mark all read
              </button>
            )}
          </div>

          {notifications.length === 0 ? (
            <div className="px-4 py-8 text-center">
              <p className="text-2xl mb-2">🔔</p>
              <p className="text-sm text-muted-foreground">No notifications yet</p>
            </div>
          ) : (
            <div className="divide-y divide-border/40">
              {notifications.map((n) => {
                const projectId = n.data?.project_id;
                const content = (
                  <div className={`px-4 py-3 hover:bg-muted/40 transition-colors cursor-pointer flex gap-3 ${!n.read ? "bg-primary/3" : ""}`}>
                    <span className="text-lg shrink-0 mt-0.5">{icon(n.type)}</span>
                    <div className="flex-1 min-w-0">
                      <p className={`text-sm leading-snug ${!n.read ? "font-medium" : ""}`}>{n.title}</p>
                      {n.body && <p className="text-xs text-muted-foreground mt-0.5 line-clamp-2">{n.body}</p>}
                      {n.created_at && (
                        <p className="text-xs text-muted-foreground mt-1">
                          {new Date(n.created_at).toLocaleDateString("en-GB", { day: "numeric", month: "short" })}
                        </p>
                      )}
                    </div>
                    {!n.read && <span className="w-2 h-2 rounded-full bg-primary shrink-0 mt-1.5" />}
                  </div>
                );

                return projectId ? (
                  <Link key={n.id} href={`/projects/${projectId}`} onClick={() => setOpen(false)}>
                    {content}
                  </Link>
                ) : (
                  <div key={n.id}>{content}</div>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
