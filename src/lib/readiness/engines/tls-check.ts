/** TLS check — connect to host:443, evaluate protocol + cert validity. */
import { connect } from "tls";
import type { EngineAdapter, EngineResult } from "./types";
import { fid } from "./types";
import type { EngineFinding } from "../store";

export const tlsCheck: EngineAdapter = {
  id: "tls-check",
  label: "TLS check",
  kind: "real",
  description: "We open a TLS connection to your host and evaluate protocol version + certificate validity.",
  inputSchema: {
    fields: [
      { name: "host", label: "Host (e.g. api.example.com)", kind: "text", required: true, placeholder: "api.example.com" },
    ],
  },
  async run(ctx): Promise<EngineResult> {
    const host = String(ctx.input.host ?? "").trim().replace(/^https?:\/\//, "").replace(/\/.*$/, "");
    if (!host) {
      return { status: "error", score: 0, findings: [], inputSummary: "no host" };
    }
    return new Promise<EngineResult>((resolve) => {
      const socket = connect(
        { host, port: 443, servername: host, timeout: 12_000, rejectUnauthorized: false },
        () => {
          try {
            const cert = socket.getPeerCertificate(true);
            const proto = socket.getProtocol() ?? "";
            const findings: EngineFinding[] = [];
            let score = 100;
            if (!/TLSv1\.[23]/.test(proto)) {
              score -= 40;
              findings.push({
                id: fid("proto"),
                severity: "high",
                title: `Weak TLS protocol: ${proto || "unknown"}`,
                detail: "Negotiated protocol is below TLS 1.2.",
                remediation: "Disable TLS 1.0/1.1 and require TLS 1.2 or 1.3.",
              });
            }
            if (cert && cert.valid_to) {
              const exp = new Date(cert.valid_to).getTime();
              const days = Math.floor((exp - Date.now()) / 86_400_000);
              if (days < 0) {
                score -= 60;
                findings.push({ id: fid("expired"), severity: "critical", title: "Certificate expired", detail: `Expired on ${cert.valid_to}.`, remediation: "Renew the certificate immediately." });
              } else if (days < 14) {
                score -= 25;
                findings.push({ id: fid("expiring"), severity: "high", title: `Certificate expires in ${days}d`, detail: `valid_to=${cert.valid_to}`, remediation: "Renew before expiry; automate via ACME/Let's Encrypt." });
              }
            } else {
              score -= 30;
              findings.push({ id: fid("nocert"), severity: "high", title: "Could not read peer certificate", detail: "Server did not present a parseable certificate.", remediation: "Verify your TLS termination configuration." });
            }
            if (!socket.authorized) {
              score -= 20;
              findings.push({
                id: fid("authz"),
                severity: "medium",
                title: "Certificate not trusted by Node defaults",
                detail: socket.authorizationError ? String(socket.authorizationError) : "self-signed or unknown CA",
                remediation: "Use a publicly-trusted CA or document why a private CA is acceptable.",
              });
            }
            socket.end();
            resolve({
              status: score >= 90 ? "pass" : score >= 60 ? "warn" : "fail",
              score: Math.max(0, score),
              findings: findings.length
                ? findings
                : [{ id: fid("ok"), severity: "info", title: "TLS healthy", detail: `Protocol ${proto}, valid certificate.`, remediation: "Maintain automated renewal." }],
              inputSummary: `${host} ${proto}`,
            });
          } catch (e) {
            socket.destroy();
            resolve({
              status: "error", score: 0, findings: [{ id: fid("err"), severity: "info", title: "TLS error", detail: e instanceof Error ? e.message : "unknown", remediation: "Check TLS configuration." }], inputSummary: "tls error",
            });
          }
        }
      );
      socket.on("error", (e) => {
        resolve({ status: "error", score: 0, findings: [{ id: fid("conn"), severity: "info", title: "TLS connection failed", detail: e.message, remediation: "Confirm the host accepts TLS on port 443." }], inputSummary: "conn err" });
      });
      socket.on("timeout", () => {
        socket.destroy();
        resolve({ status: "error", score: 0, findings: [{ id: fid("to"), severity: "info", title: "TLS timeout", detail: "Connection exceeded 12s.", remediation: "Confirm the host is reachable." }], inputSummary: "timeout" });
      });
    });
  },
};
