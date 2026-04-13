"use client";

import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import CreatorDashboard from "./CreatorDashboard";

function CreatorContent() {
  const params = useSearchParams();
  const id = params.get("id");

  if (!id) {
    return (
      <div className="min-h-screen bg-background text-foreground flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Creator Dashboard</h1>
          <p className="text-muted">Please provide your creator ID to access the dashboard.</p>
        </div>
      </div>
    );
  }

  return <CreatorDashboard creatorId={id} />;
}

export default function CreatorPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-background" />}>
      <CreatorContent />
    </Suspense>
  );
}
