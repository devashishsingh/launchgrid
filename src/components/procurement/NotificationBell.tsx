"use client";

import { useState, useEffect, useRef } from "react";

interface NotificationItem {
  id: string;
  type: string;
  title: string;
  message: string;
  read: boolean;
  createdAt: string;
}

const TYPE_ICONS: Record<string, string> = {
  requirement_submitted: "📋",
  requirement_parsed: "🤖",
  matches_ready: "🎯",
  rfp_issued: "📤",
  seller_interested: "✋",
  response_submitted: "📬",
  shortlisted: "⭐",
  evaluation_invited: "📩",
  rfp_awarded: "🏆",
  rfp_closed: "🔒",
};

export default function NotificationBell({ userId }: { userId: string }) {
  const [items, setItems] = useState<NotificationItem[]>([]);
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetch(`/api/procurement/requirements?buyerId=${userId}`)
      .then(() => {
        // Notifications endpoint — in MVP, we just show a placeholder
        // In production this would be /api/procurement/notifications?userId=...
      })
      .catch(() => {});
  }, [userId]);

  // Close on outside click
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const unread = items.filter((n) => !n.read).length;

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="relative p-2 rounded-lg hover:bg-white/5 transition-colors"
        aria-label="Notifications"
      >
        <svg
          className="w-5 h-5 text-muted"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
          />
        </svg>
        {unread > 0 && (
          <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-accent text-[10px] font-bold text-white rounded-full flex items-center justify-center">
            {unread > 9 ? "9+" : unread}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 top-full mt-2 w-80 max-h-96 overflow-y-auto bg-card border border-border rounded-xl shadow-2xl z-50">
          <div className="p-3 border-b border-border flex items-center justify-between">
            <span className="text-sm font-semibold">Notifications</span>
            {unread > 0 && (
              <span className="text-xs text-accent">{unread} unread</span>
            )}
          </div>
          {items.length === 0 ? (
            <div className="p-6 text-center text-sm text-muted">
              No notifications yet.
              <br />
              <span className="text-xs">Submit a requirement to get started.</span>
            </div>
          ) : (
            <div className="divide-y divide-border">
              {items.map((n) => (
                <div
                  key={n.id}
                  className={`p-3 hover:bg-white/5 transition-colors ${
                    !n.read ? "bg-accent/5" : ""
                  }`}
                >
                  <div className="flex items-start gap-2">
                    <span className="text-sm shrink-0">
                      {TYPE_ICONS[n.type] || "🔔"}
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="text-xs font-medium">{n.title}</p>
                      <p className="text-xs text-muted mt-0.5">{n.message}</p>
                      <p className="text-[10px] text-muted mt-1">
                        {new Date(n.createdAt).toLocaleString()}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
