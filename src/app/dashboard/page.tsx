"use client";

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { Job } from '@/types';
import Link from 'next/link';
import { 
  Plus, 
  Users, 
  Briefcase, 
  TrendingUp, 
  ChevronRight, 
  TestTube,
  Settings2,
  PauseCircle,
  PlayCircle,
  XCircle
} from 'lucide-react';
import { runTests } from '@/lib/tests';

export default function DashboardPage() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [stats, setStats] = useState({ jobs: 0, candidates: 0, avgScore: 0 });
  const [loading, setLoading] = useState(true);
  const [role, setRole] = useState('reclutador');

  useEffect(() => {
    fetchData();
  }, []);

  async function fetchData() {
    setLoading(true);
    const { data: { session } } = await supabase.auth.getSession();
    const { data: profile } = await supabase.from('profiles').select('rol').eq('id', session?.user.id).single();
    if (profile) setRole(profile.rol);

    const { data: jobsData } = await supabase.from('jobs').select('*').order('created_at', { ascending: false });
    const { count: candCount } = await supabase.from('candidates').select('*', { count: 'exact', head: true });
    const { data: appsData } = await supabase.from('applications').select('score');

    if (jobsData) setJobs(jobsData);
    const avg = appsData && appsData.length > 0 
      ? appsData.reduce((acc, curr) => acc + curr.score, 0) / appsData.length 
      : 0;

    setStats({ jobs: jobsData?.length || 0, candidates: candCount || 0, avgScore: Math.round(avg) });
    setLoading(false);
  }

  const updateJobStatus = async (id: string, newStatus: string) => {
    const { error } = await supabase.from('jobs').update({ estado: newStatus }).eq('id', id);
    if (!error) fetchData();
  };

  if (loading) return <div className="p-20 text-center animate-pulse">Cargando tu panel...</div>;

  return (
    <div className="space-y-10 animate-in fade-in duration-700">
      <header className="space-y-2">
        <div className="flex items-center gap-3">
          <h1 className="text-5xl font-black tracking-tighter text-slate-900 dark:text-white">TesIS-AI</h1>
          <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest mt-2 ${
            role === 'administrador' ? 'bg-purple-100 text-purple-600 border border-purple-200' : 'bg-blue-100 text-blue-600 border border-blue-200'
          }`}>
            {role}
          </span>
        </div>
        <p className="text-slate-500 text-lg">
          {role === 'administrador' ? "Consola de Supervisión Global." : "Panel de Gestión de Reclutamiento."}
        </p>
      </header>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="stat-card p-8 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="flex items-center gap-4 mb-4">
            <div className="p-3 bg-blue-50 dark:bg-blue-900/30 text-blue-600 rounded-2xl"><Briefcase size={24} /></div>
            <p className="font-bold text-slate-500 uppercase text-xs tracking-widest">Ofertas Activas</p>
          </div>
          <p className="text-5xl font-black">{stats.jobs}</p>
        </div>

        <div className="stat-card p-8 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="flex items-center gap-4 mb-4">
            <div className="p-3 bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 rounded-2xl"><Users size={24} /></div>
            <p className="font-bold text-slate-500 uppercase text-xs tracking-widest">Candidatos Totales</p>
          </div>
          <p className="text-5xl font-black">{stats.candidates}</p>
        </div>

        <div className="stat-card p-8 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="flex items-center gap-4 mb-4">
            <div className="p-3 bg-purple-50 dark:bg-purple-900/30 text-purple-600 rounded-2xl"><TrendingUp size={24} /></div>
            <p className="font-bold text-slate-500 uppercase text-xs tracking-widest">Promedio Score</p>
          </div>
          <p className="text-5xl font-black">{stats.avgScore}%</p>
        </div>
      </div>

      {/* Visual Analytics */}
      <div className="p-8 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
        <h3 className="text-xl font-bold flex items-center gap-2">
          <TrendingUp className="text-accent" size={20} /> Análisis de Talento
        </h3>
        <div className="h-48 flex items-end gap-2 px-4 border-b border-slate-100 dark:border-slate-800 pb-2">
          {[40, 65, 80, 45, 90, 70, 55, 85, 60, 75].map((val, i) => (
            <div key={i} className="flex-1 flex flex-col items-center gap-2 group">
              <div 
                className="w-full bg-slate-100 dark:bg-slate-800 rounded-t-lg group-hover:bg-accent transition-all duration-500 relative"
                style={{ height: `${val}%` }}
              >
                <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-slate-900 text-white text-[10px] px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                  Frecuencia: {val}%
                </div>
              </div>
              <span className="text-[10px] text-slate-400 font-bold uppercase">{10 + (i * 10)}%</span>
            </div>
          ))}
        </div>
        <p className="text-xs text-slate-400 text-center italic">Distribución de puntajes por rango de evaluación (0% - 100%)</p>
      </div>

      {/* Main Actions */}
      <div className="flex flex-wrap gap-4 items-center justify-between">
        <h2 className="text-3xl font-black">Gestionar Ofertas</h2>
        <div className="flex gap-3">
          <button 
            onClick={async () => { await runTests(); fetchData(); }}
            className="flex items-center gap-2 px-6 py-3 bg-blue-50 text-blue-600 font-bold rounded-2xl hover:bg-blue-100 transition-all border border-blue-100"
          >
            <TestTube size={20} /> Cargar Pruebas
          </button>
          <Link href="/jobs/new" className="flex items-center gap-2 px-6 py-3 bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-bold rounded-2xl shadow-xl hover:opacity-90 transition-all">
            <Plus size={20} /> Nueva Oferta
          </Link>
        </div>
      </div>

      {/* Jobs List with Management */}
      <div className="grid grid-cols-1 gap-6">
        {jobs.map(job => (
          <div key={job.id} className="group p-6 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-6 hover:shadow-lg transition-all">
            <div className="space-y-1 flex-1">
              <div className="flex items-center gap-3">
                <h3 className="text-xl font-bold group-hover:text-accent transition-colors">{job.titulo}</h3>
                <span className={`px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-tighter ${
                  job.estado === 'activa' ? 'bg-emerald-100 text-emerald-600' :
                  job.estado === 'pausada' ? 'bg-amber-100 text-amber-600' : 'bg-slate-100 text-slate-500'
                }`}>
                  {job.estado}
                </span>
              </div>
              <p className="text-slate-500 text-sm line-clamp-1">{job.descripcion || "Sin descripción"}</p>
              <div className="flex gap-2 mt-2">
                <span className="text-[10px] px-2 py-0.5 bg-slate-50 dark:bg-slate-800 rounded text-slate-400 font-bold uppercase">{job.nivel}</span>
                <span className="text-[10px] px-2 py-0.5 bg-slate-50 dark:bg-slate-800 rounded text-slate-400 font-bold uppercase">{job.experiencia_min} años exp.</span>
              </div>
            </div>

            <div className="flex items-center gap-2 border-t md:border-t-0 pt-4 md:pt-0">
              {job.estado === 'activa' ? (
                <button onClick={() => updateJobStatus(job.id, 'pausada')} className="p-3 text-amber-500 hover:bg-amber-50 rounded-2xl transition-colors" title="Pausar">
                  <PauseCircle size={24} />
                </button>
              ) : (
                <button onClick={() => updateJobStatus(job.id, 'activa')} className="p-3 text-emerald-500 hover:bg-emerald-50 rounded-2xl transition-colors" title="Activar">
                  <PlayCircle size={24} />
                </button>
              )}
              <button onClick={() => updateJobStatus(job.id, 'cerrada')} className="p-3 text-red-500 hover:bg-red-50 rounded-2xl transition-colors" title="Cerrar">
                <XCircle size={24} />
              </button>
              <Link href={`/jobs/${job.id}/edit`} className="p-3 text-slate-400 hover:text-accent hover:bg-slate-50 rounded-2xl transition-colors" title="Editar">
                <Settings2 size={24} />
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
