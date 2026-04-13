"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { products as marketplaceListings, type VerificationState } from "@/lib/marketplace-data";

interface User {
  id: string;
  name: string;
  email: string;
  idea: string;
  status: "pending" | "approved" | "rejected";
  createdAt: string;
}

interface Lead {
  id: string;
  fullName: string;
  email: string;
  linkedIn: string;
  productName: string;
  productCategory: string;
  problemStatement: string;
  currentStage: string;
  existingUrl: string;
  expectedPrice: string;
  leadSource: string;
  status: string;
  createdAt: string;
}

interface Creator {
  id: string;
  leadId: string;
  fullName: string;
  email: string;
  linkedIn: string;
  activationToken: string;
  activated: boolean;
  suspended: boolean;
  qualityScore: number;
  createdAt: string;
}

interface Product {
  id: string;
  userId: string;
  name: string;
  description: string;
  status: string;
  createdAt: string;
}

interface Transaction {
  id: string;
  productId: string;
  userId: string;
  amount: number;
  platformFee: number;
  status: string;
  createdAt: string;
}

interface SupportTicket {
  id: string;
  productId: string;
  creatorId: string;
  type: string;
  priority: string;
  subject: string;
  description: string;
  status: string;
  escalationLevel: string;
  creatorResponse: string | null;
  resolution: string | null;
  createdAt: string;
}

type Tab = "leads" | "creators" | "users" | "products" | "transactions" | "support" | "marketplace" | "procurement";

export default function AdminDashboard() {
  const [tab, setTab] = useState<Tab>("leads");
  const [users, setUsers] = useState<User[]>([]);
  const [leads, setLeads] = useState<Lead[]>([]);
  const [creators, setCreators] = useState<Creator[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [tickets, setTickets] = useState<SupportTicket[]>([]);
  const [procRequirements, setProcRequirements] = useState<{id:string;title:string;status:string;buyerId:string;createdAt:string}[]>([]);
  const [procRFPs, setProcRFPs] = useState<{id:string;requirementId:string;status:string;createdAt:string}[]>([]);

  useEffect(() => {
    fetch("/api/users").then((r) => r.json()).then(setUsers);
    fetch("/api/leads").then((r) => r.json()).then(setLeads);
    fetch("/api/creators").then((r) => r.json()).then(setCreators);
    fetch("/api/products").then((r) => r.json()).then(setProducts);
    fetch("/api/transactions").then((r) => r.json()).then(setTransactions);
    fetch("/api/support").then((r) => r.json()).then(setTickets);
    fetch("/api/procurement/requirements").then((r) => r.json()).then((d) => Array.isArray(d) ? setProcRequirements(d) : null).catch(() => {});
    fetch("/api/procurement/rfps").then((r) => r.json()).then((d) => Array.isArray(d) ? setProcRFPs(d) : null).catch(() => {});
  }, []);

  async function updateUserStatus(id: string, status: "approved" | "rejected") {
    const res = await fetch("/api/users", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, status }),
    });
    if (res.ok) {
      const updated = await res.json();
      setUsers((prev) => prev.map((u) => (u.id === id ? updated : u)));
    }
  }

  async function updateLeadStatus(id: string, status: string) {
    const res = await fetch("/api/leads", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, status }),
    });
    if (res.ok) {
      const updated = await res.json();
      setLeads((prev) => prev.map((l) => (l.id === id ? updated : l)));
    }
  }

  async function convertLeadToCreator(lead: Lead) {
    const res = await fetch("/api/creators", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        leadId: lead.id,
        fullName: lead.fullName,
        email: lead.email,
        linkedIn: lead.linkedIn,
      }),
    });
    if (res.ok) {
      const creator = await res.json();
      setCreators((prev) => [...prev, creator]);
      await updateLeadStatus(lead.id, "converted");
    }
  }

  async function handleCreatorAction(id: string, action: string) {
    const res = await fetch("/api/creators", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, action }),
    });
    if (res.ok) {
      const updated = await res.json();
      setCreators((prev) => prev.map((c) => (c.id === id ? updated : c)));
    }
  }

  async function updateProductStatus(id: string, status: string) {
    const body: Record<string, string> = { id, status };
    const res = await fetch("/api/products", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    if (res.ok) {
      const updated = await res.json();
      setProducts((prev) => prev.map((p) => (p.id === id ? updated : p)));
    }
  }

  async function escalateTicket(id: string, level: string) {
    const res = await fetch("/api/support", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, escalationLevel: level, status: "escalated" }),
    });
    if (res.ok) {
      const updated = await res.json();
      setTickets((prev) => prev.map((t) => (t.id === id ? updated : t)));
    }
  }

  const revenue = transactions.reduce((s, t) => s + t.platformFee, 0);
  const openTickets = tickets.filter((t) => t.status === "open" || t.status === "escalated");
  const lowQualityCreators = creators.filter((c) => c.qualityScore < 50);

  const tabs: { key: Tab; label: string; count: number }[] = [
    { key: "leads", label: "Leads", count: leads.length },
    { key: "creators", label: "Creators", count: creators.length },
    { key: "users", label: "Users (Legacy)", count: users.length },
    { key: "products", label: "Products", count: products.length },
    { key: "transactions", label: "Transactions", count: transactions.length },
    { key: "support", label: "Support", count: openTickets.length },
    { key: "marketplace", label: "Marketplace", count: marketplaceListings.length },
    { key: "procurement", label: "Procurement", count: procRequirements.length },
  ];

  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="border-b border-border px-6 py-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/" className="text-xl font-bold tracking-tight">
              Launch<span className="text-accent">Dock</span>
            </Link>
            <span className="text-xs bg-accent/10 text-accent px-2 py-1 rounded">
              Admin
            </span>
          </div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-6 py-8">
        {/* Stats row */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
          <div className="card-3d border border-border rounded-2xl p-4">
            <p className="text-xs text-muted uppercase tracking-widest">Leads</p>
            <p className="text-xl font-bold mt-1">{leads.length}</p>
            <p className="text-xs text-muted mt-1">{leads.filter((l) => l.status === "new").length} new</p>
          </div>
          <div className="card-3d border border-border rounded-2xl p-4">
            <p className="text-xs text-muted uppercase tracking-widest">Creators</p>
            <p className="text-xl font-bold mt-1">{creators.length}</p>
            <p className="text-xs text-muted mt-1">{creators.filter((c) => c.activated).length} active</p>
          </div>
          <div className="card-3d border border-border rounded-2xl p-4">
            <p className="text-xs text-muted uppercase tracking-widest">Products</p>
            <p className="text-xl font-bold mt-1">{products.length}</p>
          </div>
          <div className="card-3d border border-border rounded-2xl p-4">
            <p className="text-xs text-muted uppercase tracking-widest">Revenue</p>
            <p className="text-xl font-bold mt-1">${revenue.toFixed(2)}</p>
          </div>
          <div className="card-3d border border-border rounded-2xl p-4">
            <p className="text-xs text-muted uppercase tracking-widest">Open Tickets</p>
            <p className="text-xl font-bold mt-1 text-yellow-400">{openTickets.length}</p>
          </div>
          <div className="card-3d border border-border rounded-2xl p-4">
            <p className="text-xs text-muted uppercase tracking-widest">Low Quality</p>
            <p className="text-xl font-bold mt-1 text-red-400">{lowQualityCreators.length}</p>
          </div>
        </div>

        {/* Alerts */}
        {lowQualityCreators.length > 0 && (
          <div className="mb-6 bg-red-500/10 border border-red-500/20 rounded-xl px-5 py-3">
            <p className="text-sm text-red-400 font-medium">⚠ Quality Alerts</p>
            <p className="text-xs text-red-400/70 mt-1">
              {lowQualityCreators.map((c) => c.fullName).join(", ")} — quality score below 50. Review recommended.
            </p>
          </div>
        )}

        {openTickets.filter((t) => t.escalationLevel === "founder").length > 0 && (
          <div className="mb-6 bg-yellow-500/10 border border-yellow-500/20 rounded-xl px-5 py-3">
            <p className="text-sm text-yellow-400 font-medium">📋 Escalated to You</p>
            <p className="text-xs text-yellow-400/70 mt-1">
              {openTickets.filter((t) => t.escalationLevel === "founder").length} support tickets need your attention.
            </p>
          </div>
        )}

        {/* Tabs */}
        <div className="flex gap-1 mb-6 border-b border-border overflow-x-auto">
          {tabs.map((t) => (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              className={`px-4 py-2.5 text-sm font-medium transition-colors border-b-2 -mb-px whitespace-nowrap ${
                tab === t.key
                  ? "border-accent text-accent"
                  : "border-transparent text-muted hover:text-foreground"
              }`}
            >
              {t.label} <span className="text-xs opacity-60">({t.count})</span>
            </button>
          ))}
        </div>

        {/* ── LEADS TAB ── */}
        {tab === "leads" && (
          <div className="space-y-3">
            {leads.length === 0 && (
              <p className="text-sm text-muted py-8 text-center">No leads yet.</p>
            )}
            {leads.map((l) => (
              <div key={l.id} className="card-3d border border-border rounded-2xl p-5">
                <div className="flex flex-col sm:flex-row sm:items-start gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                      <h3 className="font-semibold text-sm">{l.fullName}</h3>
                      <span className="text-xs bg-accent/10 text-accent px-2 py-0.5 rounded">{l.productName}</span>
                      <span className={`text-xs px-2 py-0.5 rounded ${
                        l.status === "new" ? "bg-blue-500/10 text-blue-400"
                          : l.status === "contacted" ? "bg-yellow-500/10 text-yellow-400"
                          : l.status === "qualified" ? "bg-green-500/10 text-green-400"
                          : l.status === "converted" ? "bg-accent/10 text-accent"
                          : "bg-red-500/10 text-red-400"
                      }`}>
                        {l.status}
                      </span>
                    </div>
                    <p className="text-xs text-muted">{l.email} · {l.currentStage} · {l.leadSource}</p>
                    <p className="text-sm text-muted mt-2 line-clamp-2">{l.problemStatement}</p>
                    {l.expectedPrice && (
                      <p className="text-xs text-muted/60 mt-1">Price: {l.expectedPrice}</p>
                    )}
                    <p className="text-xs text-muted/50 mt-1">{new Date(l.createdAt).toLocaleDateString()}</p>
                  </div>

                  <div className="flex gap-2 shrink-0 flex-wrap">
                    {l.status === "new" && (
                      <button
                        onClick={() => updateLeadStatus(l.id, "contacted")}
                        className="text-xs bg-blue-500/10 text-blue-400 hover:bg-blue-500/20 px-3 py-1.5 rounded-lg transition-colors"
                      >
                        Mark Contacted
                      </button>
                    )}
                    {l.status === "contacted" && (
                      <button
                        onClick={() => updateLeadStatus(l.id, "qualified")}
                        className="text-xs bg-green-500/10 text-green-400 hover:bg-green-500/20 px-3 py-1.5 rounded-lg transition-colors"
                      >
                        Qualify
                      </button>
                    )}
                    {(l.status === "qualified") && (
                      <button
                        onClick={() => convertLeadToCreator(l)}
                        className="text-xs bg-accent/10 text-accent hover:bg-accent/20 px-3 py-1.5 rounded-lg transition-colors"
                      >
                        Convert to Creator
                      </button>
                    )}
                    {l.status !== "rejected" && l.status !== "converted" && (
                      <button
                        onClick={() => updateLeadStatus(l.id, "rejected")}
                        className="text-xs bg-red-500/10 text-red-400 hover:bg-red-500/20 px-3 py-1.5 rounded-lg transition-colors"
                      >
                        Reject
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* ── CREATORS TAB ── */}
        {tab === "creators" && (
          <div className="space-y-3">
            {creators.length === 0 && (
              <p className="text-sm text-muted py-8 text-center">No creators yet.</p>
            )}
            {creators.map((c) => (
              <div key={c.id} className="card-3d border border-border rounded-2xl p-5">
                <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                      <h3 className="font-semibold text-sm">{c.fullName}</h3>
                      <span className={`text-xs px-2 py-0.5 rounded ${
                        c.suspended ? "bg-red-500/10 text-red-400"
                          : c.activated ? "bg-green-500/10 text-green-400"
                          : "bg-yellow-500/10 text-yellow-400"
                      }`}>
                        {c.suspended ? "Suspended" : c.activated ? "Active" : "Pending"}
                      </span>
                      <span className={`text-xs px-2 py-0.5 rounded ${
                        c.qualityScore >= 70 ? "bg-green-500/10 text-green-400"
                          : c.qualityScore >= 40 ? "bg-yellow-500/10 text-yellow-400"
                          : "bg-red-500/10 text-red-400"
                      }`}>
                        Score: {c.qualityScore}
                      </span>
                    </div>
                    <p className="text-xs text-muted">{c.email}</p>
                    {c.linkedIn && (
                      <p className="text-xs text-accent/60 mt-1">{c.linkedIn}</p>
                    )}
                    <p className="text-xs text-muted/50 mt-1">{new Date(c.createdAt).toLocaleDateString()}</p>
                  </div>

                  <div className="flex gap-2 shrink-0 flex-wrap">
                    <Link
                      href={`/creator?id=${c.id}`}
                      className="text-xs bg-accent/10 text-accent hover:bg-accent/20 px-3 py-1.5 rounded-lg transition-colors"
                    >
                      View Dashboard
                    </Link>
                    {!c.suspended ? (
                      <button
                        onClick={() => handleCreatorAction(c.id, "suspend")}
                        className="text-xs bg-red-500/10 text-red-400 hover:bg-red-500/20 px-3 py-1.5 rounded-lg transition-colors"
                      >
                        Suspend
                      </button>
                    ) : (
                      <button
                        onClick={() => handleCreatorAction(c.id, "reinstate")}
                        className="text-xs bg-green-500/10 text-green-400 hover:bg-green-500/20 px-3 py-1.5 rounded-lg transition-colors"
                      >
                        Reinstate
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* ── USERS (LEGACY) TAB ── */}
        {tab === "users" && (
          <div className="space-y-3">
            {users.length === 0 && (
              <p className="text-sm text-muted py-8 text-center">No users yet.</p>
            )}
            {users.map((u) => (
              <div
                key={u.id}
                className="card-3d border border-border rounded-2xl p-5 flex flex-col sm:flex-row sm:items-center gap-4"
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-semibold text-sm">{u.name}</h3>
                    <span
                      className={`text-xs px-2 py-0.5 rounded ${
                        u.status === "approved"
                          ? "bg-green-500/10 text-green-400"
                          : u.status === "rejected"
                          ? "bg-red-500/10 text-red-400"
                          : "bg-yellow-500/10 text-yellow-400"
                      }`}
                    >
                      {u.status}
                    </span>
                  </div>
                  <p className="text-xs text-muted">{u.email}</p>
                  <p className="text-sm text-muted mt-2 line-clamp-2">{u.idea}</p>
                  <p className="text-xs text-muted/50 mt-2">{new Date(u.createdAt).toLocaleDateString()}</p>
                </div>

                {u.status === "pending" && (
                  <div className="flex gap-2 shrink-0">
                    <button
                      onClick={() => updateUserStatus(u.id, "approved")}
                      className="text-xs bg-green-500/10 text-green-400 hover:bg-green-500/20 px-3 py-1.5 rounded-lg transition-colors"
                    >
                      Approve
                    </button>
                    <button
                      onClick={() => updateUserStatus(u.id, "rejected")}
                      className="text-xs bg-red-500/10 text-red-400 hover:bg-red-500/20 px-3 py-1.5 rounded-lg transition-colors"
                    >
                      Reject
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* ── PRODUCTS TAB ── */}
        {tab === "products" && (
          <div className="space-y-3">
            {products.length === 0 && (
              <p className="text-sm text-muted py-8 text-center">No products yet.</p>
            )}
            {products.map((p) => (
              <div key={p.id} className="card-3d border border-border rounded-2xl p-5">
                <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-semibold text-sm">{p.name}</h3>
                      <span className={`text-xs px-2 py-0.5 rounded ${
                        p.status === "active" ? "bg-green-500/10 text-green-400"
                          : p.status === "suspended" ? "bg-red-500/10 text-red-400"
                          : p.status === "paused" ? "bg-yellow-500/10 text-yellow-400"
                          : "bg-accent/10 text-accent"
                      }`}>
                        {p.status}
                      </span>
                    </div>
                    <p className="text-sm text-muted mt-1">{p.description}</p>
                    <p className="text-xs text-muted/50 mt-2">User: {p.userId.slice(0, 8)}... · {new Date(p.createdAt).toLocaleDateString()}</p>
                  </div>

                  <div className="flex gap-2 shrink-0 flex-wrap">
                    {p.status !== "active" && p.status !== "suspended" && (
                      <button
                        onClick={() => updateProductStatus(p.id, "active")}
                        className="text-xs bg-green-500/10 text-green-400 hover:bg-green-500/20 px-3 py-1.5 rounded-lg transition-colors"
                      >
                        Activate
                      </button>
                    )}
                    {p.status === "active" && (
                      <button
                        onClick={() => updateProductStatus(p.id, "paused")}
                        className="text-xs bg-yellow-500/10 text-yellow-400 hover:bg-yellow-500/20 px-3 py-1.5 rounded-lg transition-colors"
                      >
                        Pause
                      </button>
                    )}
                    {p.status !== "suspended" && (
                      <button
                        onClick={() => updateProductStatus(p.id, "suspended")}
                        className="text-xs bg-red-500/10 text-red-400 hover:bg-red-500/20 px-3 py-1.5 rounded-lg transition-colors"
                      >
                        Suspend
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* ── TRANSACTIONS TAB ── */}
        {tab === "transactions" && (
          <div className="space-y-3">
            {transactions.length === 0 && (
              <p className="text-sm text-muted py-8 text-center">No transactions yet.</p>
            )}
            {transactions.map((t) => (
              <div key={t.id} className="card-3d border border-border rounded-2xl p-5 flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium">${t.amount.toFixed(2)}</p>
                  <p className="text-xs text-muted mt-1">Fee: ${t.platformFee.toFixed(2)} · Product: {t.productId.slice(0, 8)}...</p>
                  <p className="text-xs text-muted/50 mt-1">{new Date(t.createdAt).toLocaleDateString()}</p>
                </div>
                <span
                  className={`text-xs px-2 py-0.5 rounded ${
                    t.status === "completed" ? "bg-green-500/10 text-green-400"
                      : t.status === "failed" ? "bg-red-500/10 text-red-400"
                      : "bg-yellow-500/10 text-yellow-400"
                  }`}
                >
                  {t.status}
                </span>
              </div>
            ))}
          </div>
        )}

        {/* ── SUPPORT TAB ── */}
        {tab === "support" && (
          <div className="space-y-3">
            {tickets.length === 0 && (
              <p className="text-sm text-muted py-8 text-center">No support tickets yet.</p>
            )}
            {tickets.map((t) => (
              <div key={t.id} className="card-3d border border-border rounded-2xl p-5">
                <div className="flex flex-col sm:flex-row sm:items-start gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                      <h3 className="font-semibold text-sm">{t.subject}</h3>
                      <span className={`text-xs px-2 py-0.5 rounded ${
                        t.type === "complaint" ? "bg-red-500/10 text-red-400"
                          : t.type === "bug" ? "bg-orange-500/10 text-orange-400"
                          : t.type === "feature_request" ? "bg-blue-500/10 text-blue-400"
                          : "bg-green-500/10 text-green-400"
                      }`}>
                        {t.type}
                      </span>
                      <span className={`text-xs px-2 py-0.5 rounded ${
                        t.priority === "critical" ? "bg-red-500/10 text-red-400"
                          : t.priority === "high" ? "bg-orange-500/10 text-orange-400"
                          : t.priority === "medium" ? "bg-yellow-500/10 text-yellow-400"
                          : "bg-muted/10 text-muted"
                      }`}>
                        {t.priority}
                      </span>
                      <span className={`text-xs px-2 py-0.5 rounded ${
                        t.status === "resolved" || t.status === "closed" ? "bg-green-500/10 text-green-400"
                          : t.status === "escalated" ? "bg-red-500/10 text-red-400"
                          : "bg-yellow-500/10 text-yellow-400"
                      }`}>
                        {t.status}
                      </span>
                    </div>
                    <p className="text-sm text-muted mt-1 line-clamp-2">{t.description}</p>
                    <p className="text-xs text-muted/50 mt-2">
                      Escalation: {t.escalationLevel} · Creator: {t.creatorId.slice(0, 8)}... · {new Date(t.createdAt).toLocaleDateString()}
                    </p>
                    {t.creatorResponse && (
                      <div className="mt-2 text-xs bg-card/80 border border-border/50 rounded-lg px-3 py-2">
                        <span className="text-muted/70">Creator response:</span> {t.creatorResponse}
                      </div>
                    )}
                  </div>

                  <div className="flex gap-2 shrink-0 flex-wrap">
                    {t.escalationLevel === "creator" && t.status !== "resolved" && t.status !== "closed" && (
                      <button
                        onClick={() => escalateTicket(t.id, "founder")}
                        className="text-xs bg-yellow-500/10 text-yellow-400 hover:bg-yellow-500/20 px-3 py-1.5 rounded-lg transition-colors"
                      >
                        Escalate to Founder
                      </button>
                    )}
                    {t.escalationLevel === "founder" && t.status !== "resolved" && t.status !== "closed" && (
                      <button
                        onClick={() => escalateTicket(t.id, "termination_review")}
                        className="text-xs bg-red-500/10 text-red-400 hover:bg-red-500/20 px-3 py-1.5 rounded-lg transition-colors"
                      >
                        Termination Review
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* ── MARKETPLACE LISTINGS TAB ── */}
        {tab === "marketplace" && (
          <MarketplaceAdmin />
        )}

        {/* ── PROCUREMENT OVERSIGHT TAB ── */}
        {tab === "procurement" && (
          <div className="space-y-6">
            {/* Summary */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="card-3d border border-border rounded-2xl p-4">
                <p className="text-xs text-muted uppercase tracking-widest">Requirements</p>
                <p className="text-xl font-bold mt-1">{procRequirements.length}</p>
              </div>
              <div className="card-3d border border-border rounded-2xl p-4">
                <p className="text-xs text-muted uppercase tracking-widest">RFPs Issued</p>
                <p className="text-xl font-bold mt-1">{procRFPs.filter(r => r.status === "issued").length}</p>
              </div>
              <div className="card-3d border border-border rounded-2xl p-4">
                <p className="text-xs text-muted uppercase tracking-widest">Active</p>
                <p className="text-xl font-bold mt-1 text-accent">{procRequirements.filter(r => !["closed","draft"].includes(r.status)).length}</p>
              </div>
              <div className="card-3d border border-border rounded-2xl p-4">
                <p className="text-xs text-muted uppercase tracking-widest">Closed</p>
                <p className="text-xl font-bold mt-1">{procRequirements.filter(r => r.status === "closed").length}</p>
              </div>
            </div>

            {/* Requirements list */}
            <div>
              <h3 className="text-sm font-semibold mb-3">All Requirements</h3>
              {procRequirements.length === 0 ? (
                <p className="text-sm text-muted">No procurement requirements yet.</p>
              ) : (
                <div className="space-y-2">
                  {procRequirements.map((req) => (
                    <div key={req.id} className="card-3d border border-border rounded-xl p-4 flex items-center justify-between gap-4">
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-medium truncate">{req.title}</p>
                        <p className="text-xs text-muted">Buyer: {req.buyerId} · {new Date(req.createdAt).toLocaleDateString()}</p>
                      </div>
                      <span className={`text-xs px-2 py-0.5 rounded border ${
                        req.status === "matched" ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" :
                        req.status === "rfp_issued" ? "bg-blue-500/10 text-blue-400 border-blue-500/20" :
                        req.status === "closed" ? "bg-gray-500/10 text-gray-400 border-gray-500/20" :
                        "bg-yellow-500/10 text-yellow-400 border-yellow-500/20"
                      }`}>{req.status}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* RFPs list */}
            <div>
              <h3 className="text-sm font-semibold mb-3">All RFPs</h3>
              {procRFPs.length === 0 ? (
                <p className="text-sm text-muted">No RFPs issued yet.</p>
              ) : (
                <div className="space-y-2">
                  {procRFPs.map((rfp) => (
                    <div key={rfp.id} className="card-3d border border-border rounded-xl p-4 flex items-center justify-between gap-4">
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-medium">RFP #{rfp.id.slice(0, 8)}</p>
                        <p className="text-xs text-muted">Requirement: {rfp.requirementId.slice(0, 8)} · {new Date(rfp.createdAt).toLocaleDateString()}</p>
                      </div>
                      <span className={`text-xs px-2 py-0.5 rounded border ${
                        rfp.status === "issued" ? "bg-blue-500/10 text-blue-400 border-blue-500/20" :
                        rfp.status === "responses_received" ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" :
                        "bg-yellow-500/10 text-yellow-400 border-yellow-500/20"
                      }`}>{rfp.status}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ===== MARKETPLACE ADMIN — Verification Workflow =====
const verificationSteps: { key: VerificationState; label: string; icon: string }[] = [
  { key: "submitted", label: "Submitted", icon: "📥" },
  { key: "identity_verification", label: "Identity", icon: "🪪" },
  { key: "product_testing", label: "Testing", icon: "🧪" },
  { key: "legal_verification", label: "Legal", icon: "⚖️" },
  { key: "security_check", label: "Security", icon: "🔒" },
  { key: "support_readiness", label: "Support", icon: "🎧" },
  { key: "verified", label: "Verified", icon: "✅" },
  { key: "listed", label: "Listed", icon: "🟢" },
];

function MarketplaceAdmin() {
  const [listings] = useState(marketplaceListings);
  const [selectedSlug, setSelectedSlug] = useState<string | null>(null);
  const selected = listings.find((p) => p.slug === selectedSlug);

  return (
    <div className="space-y-6">
      {/* Summary cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="card-3d border border-border rounded-2xl p-4">
          <p className="text-xs text-muted uppercase tracking-widest">Total Listings</p>
          <p className="text-xl font-bold mt-1">{listings.length}</p>
        </div>
        <div className="card-3d border border-border rounded-2xl p-4">
          <p className="text-xs text-muted uppercase tracking-widest">Verified</p>
          <p className="text-xl font-bold mt-1 text-emerald-400">{listings.filter((l) => l.verification.state === "listed").length}</p>
        </div>
        <div className="card-3d border border-border rounded-2xl p-4">
          <p className="text-xs text-muted uppercase tracking-widest">Indie Founders</p>
          <p className="text-xl font-bold mt-1 text-amber-400">{listings.filter((l) => l.isIndie).length}</p>
        </div>
        <div className="card-3d border border-border rounded-2xl p-4">
          <p className="text-xs text-muted uppercase tracking-widest">Avg Trust Score</p>
          <p className="text-xl font-bold mt-1 text-accent">{(listings.reduce((s, l) => s + l.trustScore.overall, 0) / listings.length).toFixed(1)}</p>
        </div>
      </div>

      {/* Listings table */}
      <div className="space-y-3">
        {listings.map((l) => (
          <div key={l.slug} className="card-3d border border-border rounded-2xl p-5">
            <div className="flex flex-col sm:flex-row sm:items-center gap-4">
              <div className="flex items-center gap-3 flex-1 min-w-0">
                <span className="text-2xl">{l.logo}</span>
                <div className="min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="font-semibold text-sm">{l.name}</h3>
                    <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                      {l.verification.state}
                    </span>
                    <span className="text-[10px] px-2 py-0.5 rounded bg-accent/10 text-accent border border-accent/20">
                      🛡️ {l.trustScore.overall.toFixed(1)}
                    </span>
                    {l.isIndie && (
                      <span className="text-[10px] px-2 py-0.5 rounded bg-amber-500/10 text-amber-400 border border-amber-500/20">
                        🚀 Indie
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-muted truncate">{l.company} · {l.country} · {l.category}</p>
                </div>
              </div>
              <div className="flex gap-2 shrink-0 flex-wrap">
                <button
                  onClick={() => setSelectedSlug(selectedSlug === l.slug ? null : l.slug)}
                  className="text-xs bg-accent/10 text-accent hover:bg-accent/20 px-3 py-1.5 rounded-lg transition-colors"
                >
                  {selectedSlug === l.slug ? "Close" : "Review"}
                </button>
                <button className="text-xs bg-yellow-500/10 text-yellow-400 hover:bg-yellow-500/20 px-3 py-1.5 rounded-lg transition-colors">
                  Re-Test
                </button>
                <button className="text-xs bg-red-500/10 text-red-400 hover:bg-red-500/20 px-3 py-1.5 rounded-lg transition-colors">
                  Suspend
                </button>
              </div>
            </div>

            {/* Expanded review panel */}
            {selectedSlug === l.slug && selected && (
              <div className="mt-6 pt-6 border-t border-border space-y-6">
                {/* Verification workflow stepper */}
                <div>
                  <h4 className="text-xs uppercase tracking-wider text-muted mb-3 font-medium">Verification Pipeline</h4>
                  <div className="flex flex-wrap gap-2">
                    {verificationSteps.map((step) => {
                      const currentIdx = verificationSteps.findIndex((s) => s.key === selected.verification.state);
                      const stepIdx = verificationSteps.findIndex((s) => s.key === step.key);
                      const isPast = stepIdx <= currentIdx;
                      return (
                        <div key={step.key} className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs border transition-colors ${
                          isPast ? "bg-accent/10 border-accent/20 text-accent" : "bg-white/5 border-white/10 text-muted/50"
                        }`}>
                          <span>{step.icon}</span>
                          {step.label}
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Verification details grid */}
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {/* Origin */}
                  <div className="bg-white/[0.02] border border-white/5 rounded-xl p-4">
                    <h4 className="text-xs uppercase tracking-wider text-accent mb-2 font-medium">🪪 Origin / Authenticity</h4>
                    <div className="space-y-1.5 text-xs">
                      <CheckItem label="Founder" value={selected.verification.origin.founderName} />
                      <CheckItem label="Verified Email" pass={selected.verification.origin.verifiedEmail} />
                      <CheckItem label="Website" value={selected.verification.origin.website} />
                      <CheckItem label="Location" value={selected.verification.origin.businessLocation} />
                      <CheckItem label="Ownership" pass={selected.verification.origin.ownershipDeclaration} />
                      {selected.verification.origin.companyRegistration && (
                        <CheckItem label="Registration" value={selected.verification.origin.companyRegistration} />
                      )}
                    </div>
                  </div>

                  {/* Testing */}
                  <div className="bg-white/[0.02] border border-white/5 rounded-xl p-4">
                    <h4 className="text-xs uppercase tracking-wider text-accent mb-2 font-medium">🧪 Product Testing</h4>
                    <div className="space-y-1.5 text-xs">
                      <CheckItem label="Login" pass={selected.verification.testing.loginWorks} />
                      <CheckItem label="Signup" pass={selected.verification.testing.signupWorks} />
                      <CheckItem label="Core Features" pass={selected.verification.testing.coreFeatureWorks} />
                      <CheckItem label="Dashboard" pass={selected.verification.testing.dashboardWorks} />
                      <CheckItem label="Navigation" pass={selected.verification.testing.navigationWorks} />
                      <CheckItem label="Mobile" pass={selected.verification.testing.mobileResponsive} />
                      <CheckItem label="No UI Breaks" pass={selected.verification.testing.noCriticalUIBreak} />
                      <CheckItem label="No Dead Routes" pass={selected.verification.testing.noDeadRoutes} />
                      <p className="text-muted/60 pt-1">By: {selected.verification.testing.testedBy} on {selected.verification.testing.testedOn}</p>
                    </div>
                  </div>

                  {/* Legal */}
                  <div className="bg-white/[0.02] border border-white/5 rounded-xl p-4">
                    <h4 className="text-xs uppercase tracking-wider text-accent mb-2 font-medium">⚖️ Legal Readiness</h4>
                    <div className="space-y-1.5 text-xs">
                      <CheckItem label="Terms & Conditions" pass={selected.verification.legal.termsAndConditions} />
                      <CheckItem label="Privacy Policy" pass={selected.verification.legal.privacyPolicy} />
                      <CheckItem label="Refund Policy" pass={selected.verification.legal.refundPolicy} />
                      <CheckItem label="Support SLA" pass={selected.verification.legal.supportSLA} />
                      <CheckItem label="Ownership Declaration" pass={selected.verification.legal.ownershipDeclaration} />
                      <CheckItem label="Liability Boundaries" pass={selected.verification.legal.liabilityBoundaries} />
                      <CheckItem label="Creator Agreement" pass={selected.verification.legal.creatorAgreement} />
                    </div>
                  </div>

                  {/* Security */}
                  <div className="bg-white/[0.02] border border-white/5 rounded-xl p-4">
                    <h4 className="text-xs uppercase tracking-wider text-accent mb-2 font-medium">🔒 Security Basics</h4>
                    <div className="space-y-1.5 text-xs">
                      <CheckItem label="HTTPS" pass={selected.verification.security.https} />
                      <CheckItem label="Auth Protection" pass={selected.verification.security.authProtection} />
                      <CheckItem label="Session Security" pass={selected.verification.security.sessionSecurity} />
                      <CheckItem label="No Public Secrets" pass={selected.verification.security.noPublicSecrets} />
                      <CheckItem label="Role-Based Access" pass={selected.verification.security.roleBasedAccess} />
                      <CheckItem label="Secure File Access" pass={selected.verification.security.secureFileAccess} />
                      <CheckItem label="Tenant Isolation" pass={selected.verification.security.tenantIsolation} />
                    </div>
                  </div>

                  {/* Support */}
                  <div className="bg-white/[0.02] border border-white/5 rounded-xl p-4">
                    <h4 className="text-xs uppercase tracking-wider text-accent mb-2 font-medium">🎧 Support Readiness</h4>
                    <div className="space-y-1.5 text-xs">
                      <CheckItem label="Owner" value={selected.verification.support.supportOwner} />
                      <CheckItem label="Email" value={selected.verification.support.supportEmail} />
                      <CheckItem label="SLA" value={selected.verification.support.issueResponseSLA} />
                      <CheckItem label="Bug Fix Ownership" pass={selected.verification.support.bugFixOwnership} />
                      <CheckItem label="Maintenance" pass={selected.verification.support.maintenanceCommitment} />
                      <CheckItem label="Escalation" value={selected.verification.support.escalationContact} />
                    </div>
                  </div>

                  {/* Trust Score */}
                  <div className="bg-white/[0.02] border border-white/5 rounded-xl p-4">
                    <h4 className="text-xs uppercase tracking-wider text-accent mb-2 font-medium">🛡️ Trust Score: {selected.trustScore.overall.toFixed(1)}/10</h4>
                    <div className="space-y-1.5 text-xs">
                      {Object.entries(selected.trustScore.breakdown).map(([key, val]) => (
                        <div key={key} className="flex justify-between">
                          <span className="text-muted capitalize">{key.replace(/([A-Z])/g, " $1")}</span>
                          <span className={`font-medium ${(val as number) >= 9 ? "text-emerald-400" : (val as number) >= 8 ? "text-accent" : "text-amber-400"}`}>
                            {(val as number).toFixed(1)}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Admin actions */}
                <div className="flex flex-wrap gap-2 pt-2">
                  <button className="text-xs bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20 px-4 py-2 rounded-lg transition-colors">
                    ✅ Approve Listing
                  </button>
                  <button className="text-xs bg-yellow-500/10 text-yellow-400 hover:bg-yellow-500/20 px-4 py-2 rounded-lg transition-colors">
                    📋 Request Remediation
                  </button>
                  <button className="text-xs bg-blue-500/10 text-blue-400 hover:bg-blue-500/20 px-4 py-2 rounded-lg transition-colors">
                    📄 Request Legal Docs
                  </button>
                  <button className="text-xs bg-orange-500/10 text-orange-400 hover:bg-orange-500/20 px-4 py-2 rounded-lg transition-colors">
                    🧪 Re-Test Product
                  </button>
                  <button className="text-xs bg-red-500/10 text-red-400 hover:bg-red-500/20 px-4 py-2 rounded-lg transition-colors">
                    ⛔ Suspend Listing
                  </button>
                  <button className="text-xs bg-red-500/10 text-red-400 hover:bg-red-500/20 px-4 py-2 rounded-lg transition-colors">
                    🗑️ Delist
                  </button>
                  <button className="text-xs bg-red-900/20 text-red-400 hover:bg-red-900/30 px-4 py-2 rounded-lg transition-colors">
                    ❌ Terminate
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

function CheckItem({ label, pass, value }: { label: string; pass?: boolean; value?: string }) {
  if (value !== undefined) {
    return (
      <div className="flex justify-between gap-2">
        <span className="text-muted">{label}</span>
        <span className="font-medium text-right truncate max-w-[60%]">{value}</span>
      </div>
    );
  }
  return (
    <div className="flex items-center gap-2">
      <span className={pass ? "text-emerald-400" : "text-red-400"}>{pass ? "✓" : "✗"}</span>
      <span className="text-muted">{label}</span>
    </div>
  );
}
