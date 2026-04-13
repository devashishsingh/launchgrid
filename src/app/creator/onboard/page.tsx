"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useState, Suspense } from "react";
import Link from "next/link";

function ActivateContent() {
  const params = useSearchParams();
  const token = params.get("token");
  const [status, setStatus] = useState<"loading" | "success" | "error">("loading");
  const [creatorId, setCreatorId] = useState<string>("");

  useEffect(() => {
    if (!token) {
      setStatus("error");
      return;
    }

    fetch("/api/creators", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: "activate", action: "activate", token }),
    })
      .then((r) => {
        if (!r.ok) throw new Error();
        return r.json();
      })
      .then((creator) => {
        setCreatorId(creator.id);
        setStatus("success");
      })
      .catch(() => setStatus("error"));
  }, [token]);

  if (status === "loading") {
    return (
      <div className="min-h-screen bg-background text-foreground flex items-center justify-center">
        <div className="text-center">
          <div className="text-4xl mb-4 animate-pulse">⚡</div>
          <h1 className="text-2xl font-bold mb-2">Activating your account...</h1>
          <p className="text-muted">Please wait a moment.</p>
        </div>
      </div>
    );
  }

  if (status === "error") {
    return (
      <div className="min-h-screen bg-background text-foreground flex items-center justify-center">
        <div className="text-center max-w-md">
          <div className="text-4xl mb-4">❌</div>
          <h1 className="text-2xl font-bold mb-2">Activation Failed</h1>
          <p className="text-muted mb-6">
            This activation link is invalid or has expired. Please contact support.
          </p>
          <Link href="/" className="text-accent hover:underline text-sm">
            Return to homepage
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground flex items-center justify-center">
      <div className="text-center max-w-lg">
        <div className="text-5xl mb-6">🎉</div>
        <h1 className="text-3xl font-bold mb-3">
          Welcome to <span className="gradient-text">Launchbox!</span>
        </h1>
        <p className="text-muted text-lg mb-8">
          Your creator account is now active. Here&apos;s what happens next:
        </p>

        <div className="card-3d gradient-border rounded-2xl p-8 text-left mb-8">
          <div className="relative z-10 space-y-4">
            {[
              { step: "1", text: "Review and sign all creator agreements" },
              { step: "2", text: "Complete your product listing" },
              { step: "3", text: "Get the Launchbox trust badge" },
              { step: "4", text: "Start selling to customers" },
            ].map((item) => (
              <div key={item.step} className="flex items-start gap-3">
                <span className="shrink-0 w-7 h-7 rounded-full bg-accent/10 border border-accent/20 flex items-center justify-center text-xs font-bold text-accent">
                  {item.step}
                </span>
                <p className="text-sm text-muted pt-0.5">{item.text}</p>
              </div>
            ))}
          </div>
        </div>

        <Link
          href={`/creator?id=${creatorId}`}
          className="btn-premium text-white px-8 py-3 rounded-xl text-sm font-semibold inline-block transition-all btn-3d"
        >
          Go to Creator Dashboard
        </Link>
      </div>
    </div>
  );
}

export default function OnboardPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-background" />}>
      <ActivateContent />
    </Suspense>
  );
}
