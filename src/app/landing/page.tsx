"use client";

import Link from 'next/link';
import { 
  Brain, 
  FileSearch, 
  Trophy, 
  ShieldCheck, 
  ChevronRight, 
  Sparkles,
  ArrowRight,
  Database
} from 'lucide-react';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white">
      {/* Hero Section */}
      <nav className="max-w-7xl mx-auto px-6 py-8 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 bg-accent rounded-xl flex items-center justify-center text-white font-black shadow-lg shadow-accent/20">T</div>
          <span className="text-2xl font-black tracking-tighter">TesIS-AI</span>
        </div>
        <Link href="/login" className="px-6 py-2 rounded-full border border-slate-200 dark:border-slate-800 font-bold hover:bg-slate-100 dark:hover:bg-slate-800 transition-all">
          Iniciar Sesión
        </Link>
      </nav>

      <main className="max-w-7xl mx-auto px-6 pt-20 pb-32">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
          <div className="space-y-8 animate-in slide-in-from-left duration-700">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-accent/10 text-accent rounded-full text-xs font-black uppercase tracking-widest">
              <Sparkles size={14} /> Sistema de Reclutamiento Inteligente
            </div>
            <h1 className="text-6xl md:text-8xl font-black leading-[0.9] tracking-tighter">
              El talento no es <span className="text-accent">azar</span>, es datos.
            </h1>
            <p className="text-xl text-slate-500 dark:text-slate-400 max-w-lg leading-relaxed">
              Elimina el sesgo cognitivo y optimiza tus procesos de selección con un motor de evaluación determinista basado en evidencia.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link href="/login" className="px-8 py-4 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-2xl font-black text-lg shadow-2xl hover:scale-105 transition-all flex items-center justify-center gap-2 group">
                Comenzar ahora <ArrowRight className="group-hover:translate-x-1 transition-transform" />
              </Link>
              <div className="flex -space-x-4 items-center pl-4">
                {[1,2,3,4].map(i => (
                  <div key={i} className="w-10 h-10 rounded-full border-2 border-white dark:border-slate-900 bg-slate-200 overflow-hidden shadow-sm">
                    <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${i + 10}`} alt="avatar" />
                  </div>
                ))}
                <span className="pl-6 text-sm font-bold text-slate-500">+500 Evaluaciones</span>
              </div>
            </div>
          </div>

          <div className="relative animate-in zoom-in duration-1000 delay-200">
            <div className="absolute -inset-4 bg-accent/20 blur-3xl rounded-full"></div>
            <div className="relative p-8 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-[3rem] shadow-2xl">
              <div className="space-y-6">
                <div className="flex items-center gap-4 p-4 bg-slate-50 dark:bg-slate-800 rounded-2xl">
                  <FileSearch className="text-accent" size={32} />
                  <div>
                    <p className="font-black">Parsing de PDF Automático</p>
                    <p className="text-xs text-slate-500">Extracción de texto estructurado en 2 segundos.</p>
                  </div>
                </div>
                <div className="flex items-center gap-4 p-4 bg-slate-50 dark:bg-slate-800 rounded-2xl">
                  <Brain className="text-purple-500" size={32} />
                  <div>
                    <p className="font-black">Scoring Determinista</p>
                    <p className="text-xs text-slate-500">Algoritmo basado en reglas (Cero Alucinaciones).</p>
                  </div>
                </div>
                <div className="flex items-center gap-4 p-4 bg-slate-50 dark:bg-slate-800 rounded-2xl">
                  <Trophy className="text-yellow-500" size={32} />
                  <div>
                    <p className="font-black">Selección de Talentos</p>
                    <p className="text-xs text-slate-500">Visualiza el potencial de forma equilibrada.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Features Grid */}
        <div className="mt-32 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="p-8 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 group hover:border-accent transition-colors">
            <div className="w-14 h-14 bg-slate-100 dark:bg-slate-800 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-accent/10 group-hover:text-accent transition-colors">
              <ShieldCheck size={28} />
            </div>
            <h3 className="text-xl font-bold mb-2">Privacidad de Datos</h3>
            <p className="text-slate-500 text-sm">Aislamiento total de información mediante políticas RLS (Row Level Security).</p>
          </div>
          <div className="p-8 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 group hover:border-accent transition-colors">
            <div className="w-14 h-14 bg-slate-100 dark:bg-slate-800 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-accent/10 group-hover:text-accent transition-colors">
              <Database size={28} />
            </div>
            <h3 className="text-xl font-bold mb-2">Infraestructura Robusta</h3>
            <p className="text-slate-500 text-sm">Respaldado por Supabase para una gestión de datos escalable y segura.</p>
          </div>
          <div className="p-8 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 group hover:border-accent transition-colors">
            <div className="w-14 h-14 bg-slate-100 dark:bg-slate-800 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-accent/10 group-hover:text-accent transition-colors">
              <ChevronRight size={28} />
            </div>
            <h3 className="text-xl font-bold mb-2">Basado en Next.js 15</h3>
            <p className="text-slate-500 text-sm">Tecnología de última generación para una experiencia de usuario fluida.</p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200 dark:border-slate-800 py-12 px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="text-slate-500 text-sm font-bold tracking-widest uppercase">© 2026 TesIS-AI • Proyecto de Tesis Profesional</p>
          <div className="flex gap-8">
            <Link href="/login" className="text-sm font-bold hover:text-accent transition-colors">Login</Link>
            <Link href="/login" className="text-sm font-bold hover:text-accent transition-colors">Registro</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
