"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

interface Creator {
  id: string;
  fullName: string;
  email: string;
  linkedIn: string;
  activated: boolean;
  suspended: boolean;
  qualityScore: number;
  createdAt: string;
}

interface WorkflowEntry {
  id: string;
  stage: string;
  status: string;
  actionRequired: string;
  nextStep: string;
  completedAt: string | null;
  createdAt: string;
}

interface Agreement {
  id: string;
  clause: string;
  title: string;
  description: string;
  status: string;
  version: string;
  signedAt: string | null;
}

interface Product {
  id: string;
  userId: string;
  name: string;
  description: string;
  status: string;
  createdAt: string;
}

const STAGE_LABELS: Record<string, string> = {
  lead_received: "Lead Received",
  founder_contacted: "Founder Contacted",
  discovery_completed: "Discovery Completed",
  payment_pending: "Payment Pending",
  payment_received: "Payment Received",
  activation_sent: "Activation Sent",
  account_active: "Account Active",
  agreements_pending: "Agreements Pending",
  agreements_signed: "Agreements Signed",
  product_listed: "Product Listed",
  first_sale: "First Sale",
  payout_pending: "Payout Pending",
  payout_released: "Payout Released",
};

type Tab = "overview" | "workflow" | "agreements" | "products";

export default function CreatorDashboard({ creatorId }: { creatorId: string }) {
  const [tab, setTab] = useState<Tab>("overview");
  const [creator, setCreator] = useState<Creator | null>(null);
  const [workflow, setWorkflow] = useState<WorkflowEntry[]>([]);
  const [agreements, setAgreements] = useState<Agreement[]>([]);
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    fetch(`/api/creators?id=${creatorId}`).then((r) => r.json()).then(setCreator);
    fetch(`/api/workflow?creatorId=${creatorId}`).then((r) => r.json()).then(setWorkflow);
    fetch(`/api/agreements?creatorId=${creatorId}`).then((r) => r.json()).then(setAgreements);
    fetch("/api/products").then((r) => r.json()).then(setProducts);
  }, [creatorId]);

  async function handleSign(agreementId: string) {
    const res = await fetch("/api/agreements", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: agreementId }),
    });
    if (res.ok) {
      const updated = await res.json();
      setAgreements((prev) => prev.map((a) => (a.id === updated.id ? updated : a)));
    }
  }

  const signedCount = agreements.filter((a) => a.status === "signed").length;
  const completedStages = workflow.filter((w) => w.status === "completed").length;
  const currentStage = workflow.find((w) => w.status === "pending");

  const tabs: { key: Tab; label: string }[] = [
    { key: "overview", label: "Overview" },
    { key: "workflow", label: "Workflow" },
    { key: "agreements", label: `Agreements (${signedCount}/${agreements.length})` },
    { key: "products", label: "Products" },
  ];

  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="border-b border-border px-6 py-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/" className="text-xl font-bold tracking-tight">
              <span className="gradient-text">Launch</span>
              <span className="text-foreground">Dock</span>
            </Link>
            <span className="text-xs bg-green-500/10 text-green-400 px-2 py-1 rounded">
              Creator
            </span>
          </div>
          {creator && (
            <p className="text-sm text-muted">{creator.fullName}</p>
          )}
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-6 py-8">
        {/* Status banner */}
        {creator?.suspended && (
          <div className="mb-6 bg-red-500/10 border border-red-500/20 rounded-xl px-5 py-3 text-sm text-red-400">
            Your account has been suspended. Please contact support.
          </div>
        )}

        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
          <div className="card-3d border border-border rounded-2xl p-5">
            <p className="text-xs text-muted uppercase tracking-widest">Quality Score</p>
            <p className="text-2xl font-bold mt-1 gradient-text">{creator?.qualityScore ?? "—"}</p>
          </div>
          <div className="card-3d border border-border rounded-2xl p-5">
            <p className="text-xs text-muted uppercase tracking-widest">Workflow</p>
            <p className="text-2xl font-bold mt-1">{completedStages}/{workflow.length}</p>
          </div>
          <div className="card-3d border border-border rounded-2xl p-5">
            <p className="text-xs text-muted uppercase tracking-widest">Agreements</p>
            <p className="text-2xl font-bold mt-1">{signedCount}/{agreements.length}</p>
          </div>
          <div className="card-3d border border-border rounded-2xl p-5">
            <p className="text-xs text-muted uppercase tracking-widest">Products</p>
            <p className="text-2xl font-bold mt-1">{products.filter((p) => p.userId === creatorId).length}</p>
          </div>
        </div>

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
              {t.label}
            </button>
          ))}
        </div>

        {/* Overview Tab */}
        {tab === "overview" && (
          <div className="space-y-6">
            {currentStage && (
              <div className="card-3d border border-accent/20 rounded-2xl p-6">
                <p className="text-xs text-accent uppercase tracking-widest mb-2">Current Stage</p>
                <h3 className="text-lg font-bold mb-1">
                  {STAGE_LABELS[currentStage.stage] || currentStage.stage}
                </h3>
                <p className="text-sm text-muted mb-1">
                  <span className="text-foreground/70">Action:</span> {currentStage.actionRequired}
                </p>
                <p className="text-sm text-muted">
                  <span className="text-foreground/70">Next:</span> {currentStage.nextStep}
                </p>
              </div>
            )}

            {agreements.filter((a) => a.status === "pending").length > 0 && (
              <div className="card-3d border border-yellow-500/20 rounded-2xl p-6">
                <p className="text-xs text-yellow-400 uppercase tracking-widest mb-2">Pending Agreements</p>
                <p className="text-sm text-muted">
                  You have {agreements.filter((a) => a.status === "pending").length} agreements to review and sign.
                </p>
                <button onClick={() => setTab("agreements")} className="text-sm text-accent mt-3 hover:underline">
                  Review agreements →
                </button>
              </div>
            )}
          </div>
        )}

        {/* Workflow Tab */}
        {tab === "workflow" && (
          <div className="relative">
            <div className="absolute left-6 top-0 bottom-0 w-px bg-linear-to-b from-accent/40 via-accent/20 to-transparent hidden sm:block" />
            <div className="space-y-4">
              {workflow.map((w) => (
                <div key={w.id} className="flex gap-5 items-start">
                  <div
                    className={`relative z-10 shrink-0 w-12 h-12 rounded-full border flex items-center justify-center text-xs font-bold ${
                      w.status === "completed"
                        ? "bg-green-500/10 border-green-500/30 text-green-400"
                        : "step-circle border-border text-muted"
                    }`}
                  >
                    {w.status === "completed" ? "✓" : "○"}
                  </div>
                  <div className="pt-1 pb-3 flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-semibold text-sm">
                        {STAGE_LABELS[w.stage] || w.stage}
                      </h3>
                      <span
                        className={`text-xs px-2 py-0.5 rounded ${
                          w.status === "completed"
                            ? "bg-green-500/10 text-green-400"
                            : "bg-yellow-500/10 text-yellow-400"
                        }`}
                      >
                        {w.status}
                      </span>
                    </div>
                    <p className="text-xs text-muted">Action: {w.actionRequired}</p>
                    <p className="text-xs text-muted">Next: {w.nextStep}</p>
                    {w.completedAt && (
                      <p className="text-xs text-muted/50 mt-1">
                        Completed: {new Date(w.completedAt).toLocaleDateString()}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Agreements Tab */}
        {tab === "agreements" && (
          <div className="space-y-3">
            {agreements.map((a) => (
              <div
                key={a.id}
                className="card-3d border border-border rounded-2xl p-5 flex flex-col sm:flex-row sm:items-center gap-4"
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-semibold text-sm">{a.title}</h3>
                    <span className="text-xs text-muted/50">v{a.version}</span>
                    <span
                      className={`text-xs px-2 py-0.5 rounded ${
                        a.status === "signed"
                          ? "bg-green-500/10 text-green-400"
                          : "bg-yellow-500/10 text-yellow-400"
                      }`}
                    >
                      {a.status}
                    </span>
                  </div>
                  <p className="text-xs text-muted leading-relaxed">{a.description}</p>
                  {a.signedAt && (
                    <p className="text-xs text-muted/50 mt-1">
                      Signed: {new Date(a.signedAt).toLocaleDateString()}
                    </p>
                  )}
                </div>
                {a.status === "pending" && (
                  <button
                    onClick={() => handleSign(a.id)}
                    className="text-xs bg-accent/10 text-accent hover:bg-accent/20 px-4 py-2 rounded-lg transition-colors shrink-0"
                  >
                    Review & Sign
                  </button>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Products Tab */}
        {tab === "products" && (
          <div className="space-y-3">
            {products.filter((p) => p.userId === creatorId).length === 0 && (
              <p className="text-sm text-muted py-8 text-center">
                No products listed yet. Complete your agreements to get started.
              </p>
            )}
            {products
              .filter((p) => p.userId === creatorId)
              .map((p) => (
                <div key={p.id} className="card-3d border border-border rounded-2xl p-5">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-semibold text-sm">{p.name}</h3>
                    <span className="text-xs bg-accent/10 text-accent px-2 py-0.5 rounded">
                      {p.status}
                    </span>
                  </div>
                  <p className="text-sm text-muted mt-1">{p.description}</p>
                </div>
              ))}
          </div>
        )}
      </div>
    </div>
  );
}
