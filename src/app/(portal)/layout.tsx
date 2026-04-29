import Link from "next/link";
import { Briefcase } from "lucide-react";

export default function PortalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-white dark:bg-slate-950">
      {/* Portal Header */}
      <nav className="sticky top-0 z-50 bg-white/80 dark:bg-slate-950/80 backdrop-blur-md border-b border-slate-100 dark:border-slate-800 px-6 py-4">
        <div className="max-w-4xl mx-auto flex justify-between items-center">
          <Link href="/jobs" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-accent rounded-lg flex items-center justify-center text-white font-black shadow-lg shadow-accent/20">T</div>
            <span className="text-xl font-black tracking-tighter">TesIS Portal</span>
          </Link>
          <Link href="/login" className="text-sm font-bold text-slate-500 hover:text-accent transition-colors">
            Acceso Empresa
          </Link>
        </div>
      </nav>

      {/* Portal Content */}
      <main className="max-w-4xl mx-auto px-4 py-8">
        {children}
      </main>

      {/* Portal Footer */}
      <footer className="max-w-4xl mx-auto px-6 py-12 border-t border-slate-50 dark:border-slate-900 text-center">
        <p className="text-xs text-slate-400 font-bold uppercase tracking-widest">© 2026 TesIS-AI • Oportunidades de Carrera</p>
      </footer>
    </div>
  );
}
