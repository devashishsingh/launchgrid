import "./readiness.css";

export const metadata = {
  title: "BLOYI · Enterprise Readiness Workspace",
  description: "Take your indie product enterprise-ready. 18 modular gates, real engines, ledger-backed.",
};

export default function ReadinessLayout({ children }: { children: React.ReactNode }) {
  return <div className="min-h-screen bloyi-mesh">{children}</div>;
}
