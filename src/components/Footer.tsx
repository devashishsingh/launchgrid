import Logo from "./Logo";

export default function Footer() {
  return (
    <footer className="relative pt-12 pb-6 px-6 overflow-hidden border-t border-white/[0.05]" style={{
      background: 'linear-gradient(180deg, rgba(12,12,18,0.5) 0%, var(--background) 100%)',
    }}>
      {/* Subtle gradient glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[1px] bg-gradient-to-r from-transparent via-accent/50 to-transparent" />

      <div className="max-w-6xl mx-auto">
        {/* Top section */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-14">
          {/* Brand */}
          <div className="md:col-span-1">
            <div className="flex items-center gap-2.5">
              <Logo size={28} />
              <span className="text-2xl font-bold tracking-tight">
                <span className="gradient-text">Launch</span>
                <span className="text-foreground">box</span>
              </span>
            </div>
            <p className="text-sm text-muted mt-3 leading-relaxed">
              Sell your software without registering a company. We handle legal, invoicing & compliance.
            </p>
            {/* Social icons */}
            <div className="flex items-center gap-3 mt-5">
              <a href="#" aria-label="Instagram" className="group w-11 h-11 rounded-xl bg-gradient-to-br from-[#f09433] via-[#e6683c] to-[#dc2743] flex items-center justify-center transition-all hover:scale-110 hover:shadow-lg hover:shadow-[#e6683c]/30">
                <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/></svg>
              </a>
              <a href="#" aria-label="LinkedIn" className="group w-10 h-10 rounded-xl bg-gradient-to-br from-[#0077B5] to-[#00A0DC] flex items-center justify-center transition-all hover:scale-110 hover:shadow-lg hover:shadow-[#0077B5]/30">
                <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
              </a>
              <a href="#" aria-label="Facebook" className="group w-10 h-10 rounded-xl bg-gradient-to-br from-[#1877F2] to-[#42A5F5] flex items-center justify-center transition-all hover:scale-110 hover:shadow-lg hover:shadow-[#1877F2]/30">
                <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
              </a>
              <a href="#" aria-label="Discord" className="group w-10 h-10 rounded-xl bg-gradient-to-br from-[#5865F2] to-[#7289DA] flex items-center justify-center transition-all hover:scale-110 hover:shadow-lg hover:shadow-[#5865F2]/30">
                <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24"><path d="M20.317 4.37a19.791 19.791 0 00-4.885-1.515.074.074 0 00-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 00-5.487 0 12.64 12.64 0 00-.617-1.25.077.077 0 00-.079-.037A19.736 19.736 0 003.677 4.37a.07.07 0 00-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 00.031.057 19.9 19.9 0 005.993 3.03.078.078 0 00.084-.028c.462-.63.874-1.295 1.226-1.994a.076.076 0 00-.041-.106 13.107 13.107 0 01-1.872-.892.077.077 0 01-.008-.128 10.2 10.2 0 00.372-.292.074.074 0 01.077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 01.078.01c.12.098.246.198.373.292a.077.077 0 01-.006.127 12.299 12.299 0 01-1.873.892.077.077 0 00-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 00.084.028 19.839 19.839 0 006.002-3.03.077.077 0 00.032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 00-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z"/></svg>
              </a>
              <a href="#" aria-label="Slack" className="group w-10 h-10 rounded-xl bg-gradient-to-br from-[#E01E5A] via-[#36C5F0] to-[#2EB67D] flex items-center justify-center transition-all hover:scale-110 hover:shadow-lg hover:shadow-[#36C5F0]/30">
                <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24"><path d="M5.042 15.165a2.528 2.528 0 01-2.52 2.523A2.528 2.528 0 010 15.165a2.527 2.527 0 012.522-2.52h2.52v2.52zM6.313 15.165a2.527 2.527 0 012.521-2.52 2.527 2.527 0 012.521 2.52v6.313A2.528 2.528 0 018.834 24a2.528 2.528 0 01-2.521-2.522v-6.313zM8.834 5.042a2.528 2.528 0 01-2.521-2.52A2.528 2.528 0 018.834 0a2.528 2.528 0 012.521 2.522v2.52H8.834zM8.834 6.313a2.528 2.528 0 012.521 2.521 2.528 2.528 0 01-2.521 2.521H2.522A2.528 2.528 0 010 8.834a2.528 2.528 0 012.522-2.521h6.312zM18.956 8.834a2.528 2.528 0 012.522-2.521A2.528 2.528 0 0124 8.834a2.528 2.528 0 01-2.522 2.521h-2.522V8.834zM17.688 8.834a2.528 2.528 0 01-2.523 2.521 2.527 2.527 0 01-2.52-2.521V2.522A2.527 2.527 0 0115.165 0a2.528 2.528 0 012.523 2.522v6.312zM15.165 18.956a2.528 2.528 0 012.523 2.522A2.528 2.528 0 0115.165 24a2.527 2.527 0 01-2.52-2.522v-2.522h2.52zM15.165 17.688a2.527 2.527 0 01-2.52-2.523 2.526 2.526 0 012.52-2.52h6.313A2.527 2.527 0 0124 15.165a2.528 2.528 0 01-2.522 2.523h-6.313z"/></svg>
              </a>
              <a href="#" aria-label="X / Twitter" className="group w-10 h-10 rounded-xl bg-gradient-to-br from-[#14171A] to-[#333] border border-white/10 flex items-center justify-center transition-all hover:scale-110 hover:shadow-lg hover:shadow-white/10">
                <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-sm font-semibold text-foreground uppercase tracking-wider mb-4">Platform</h4>
            <ul className="space-y-3">
              <li><a href="#problem" className="text-sm text-muted hover:text-accent transition-colors py-1">Why Launchbox</a></li>
              <li><a href="#solution" className="text-sm text-muted hover:text-accent transition-colors py-1">Solution</a></li>
              <li><a href="#how-it-works" className="text-sm text-muted hover:text-accent transition-colors py-1">What We Do</a></li>
              <li><a href="#lead-capture" className="text-sm text-muted hover:text-accent transition-colors py-1">Apply Now</a></li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h4 className="text-sm font-semibold text-foreground uppercase tracking-wider mb-4">Resources</h4>
            <ul className="space-y-3">
              <li><a href="#contact" className="text-sm text-muted hover:text-accent transition-colors py-1">Contact Us</a></li>
              <li><a href="#" className="text-sm text-muted hover:text-accent transition-colors py-1">FAQ</a></li>
              <li><a href="#" className="text-sm text-muted hover:text-accent transition-colors py-1">Creator Guide</a></li>
              <li><a href="#" className="text-sm text-muted hover:text-accent transition-colors py-1">Blog</a></li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="text-sm font-semibold text-foreground uppercase tracking-wider mb-4">Legal</h4>
            <ul className="space-y-3">
              <li><a href="#" className="text-sm text-muted hover:text-accent transition-colors py-1">Terms of Service</a></li>
              <li><a href="#" className="text-sm text-muted hover:text-accent transition-colors py-1">Privacy Policy</a></li>
              <li><a href="#" className="text-sm text-muted hover:text-accent transition-colors py-1">Cookie Policy</a></li>
              <li><a href="#" className="text-sm text-muted hover:text-accent transition-colors py-1">Refund Policy</a></li>
            </ul>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-border/30 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-xs text-muted/60">
            &copy; {new Date().getFullYear()} Launchbox Technologies Pvt. Ltd. All rights reserved.
          </p>
          <p className="text-xs text-muted/40">
            Built in India — for creators everywhere.
          </p>
        </div>
      </div>
    </footer>
  );
}
