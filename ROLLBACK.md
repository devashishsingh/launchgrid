# BLOYI Readiness — Rollback Guide

The readiness module is intentionally **isolated** so it can be turned off,
emptied, or fully removed without touching any of the existing creator,
marketplace, or procurement code.

There are three rollback paths, ordered from softest to hardest.

---

## Path 1 — Disable via feature flag (zero data loss)

Set the environment variable before starting Next:

```powershell
$env:ENABLE_READINESS = "false"
npm run dev
```

When the flag is `false`:

- `src/middleware.ts` rewrites every `/readiness/**` request to
  `/readiness/disabled`
- All `/api/readiness/**` routes return `404` with `{ error: "Readiness disabled" }`
- No data is deleted; flipping the flag back to `"true"` restores the workspace
  and every account, ledger entry, and engine run is intact.

This is the safest and recommended way to take the module offline temporarily.

---

## Path 2 — Purge readiness data (keep the code)

Delete every account, session, submission, ledger entry, engine run, and
score snapshot but leave the source code in place:

```powershell
npm run readiness:purge
```

This runs `rm -rf data/readiness`. The next first-time visit will recreate the
empty collection files. The rest of the app (`data/db.json`,
`data/procurement.json`) is **untouched**.

To re-seed after a purge:

```powershell
npm run seed:readiness
```

---

## Path 3 — Full removal (delete the module)

If you want the readiness module gone entirely:

```powershell
# 1. Source code
Remove-Item -Recurse -Force src/lib/readiness
Remove-Item -Recurse -Force src/components/readiness
Remove-Item -Recurse -Force src/app/readiness
Remove-Item -Recurse -Force src/app/api/readiness

# 2. Middleware (delete the whole file or strip the matcher)
Remove-Item src/middleware.ts

# 3. Seed script
Remove-Item -Recurse -Force scripts

# 4. Data
Remove-Item -Recurse -Force data/readiness

# 5. package.json — manually remove the seed:readiness and readiness:purge
#    scripts and the "tsx" devDependency.

# 6. Admin tab — remove the "Readiness" tab from src/app/admin/AdminDashboard.tsx
```

After full removal, run `npm install` and `npm run build` to confirm the
project still compiles. **No file outside the four directories above is
touched by the readiness module**, so removal is non-destructive.

---

## Demo login (after running `npm run seed:readiness`)

```
URL       http://localhost:3000/readiness/login
Email     demo@bloyi.test
Password  Bloyi!Demo2026
```

The seed script prints the TOTP secret, an `otpauth://` URI, the current
6-digit code, eight one-time backup codes, and an ASCII QR code that you can
scan with any authenticator app (Google Authenticator, 1Password,
Authy, Microsoft Authenticator, …).
