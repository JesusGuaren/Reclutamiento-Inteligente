"use client";

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { Application } from '@/types';
import { 
  User, 
  ChevronRight, 
  Search, 
  MoreHorizontal,
  ArrowRightLeft,
  CheckCircle2,
  XCircle,
  MessageSquare,
  Clock
} from 'lucide-react';

const COLUMNS = [
  { id: 'evaluado', title: 'Evaluados', color: 'bg-blue-500', icon: <User size={16} /> },
  { id: 'entrevista', title: 'Entrevista', color: 'bg-purple-500', icon: <MessageSquare size={16} /> },
  { id: 'prueba', title: 'Prueba Técnica', color: 'bg-amber-500', icon: <Clock size={16} /> },
  { id: 'contratado', title: 'Contratados', color: 'bg-emerald-500', icon: <CheckCircle2 size={16} /> },
  { id: 'rechazado', title: 'Descartados', color: 'bg-red-500', icon: <XCircle size={16} /> },
];

export default function PipelinePage() {
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [expandedId, setExpandedId] = useState<string | null>(null);

  useEffect(() => {
    fetchApplications();
  }, []);

  async function fetchApplications() {
    setLoading(true);
    const { data } = await supabase
      .from('applications')
      .select('*, candidate:candidates(*), job:jobs(*)')
      .order('score', { ascending: false });
    
    if (data) setApplications(data as any);
    setLoading(false);
  }

  const updateStatus = async (appId: string, newStatus: string) => {
    const { error } = await supabase
      .from('applications')
      .update({ estado: newStatus })
      .eq('id', appId);
    
    if (!error) {
      setApplications(apps => apps.map(a => a.id === appId ? { ...a, estado: newStatus } : a));
    } else {
      alert("Error al mover candidato: " + error.message);
    }
  };

  const filteredApps = applications.filter(app => 
    app.candidate?.nombre?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) return <div className="p-20 text-center">Cargando pipeline...</div>;

  return (
    <div className="space-y-8 animate-in fade-in duration-700 pb-20">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-black">Pipeline de Selección</h1>
          <p className="text-slate-500 text-sm italic">Gestiona el progreso de tus candidatos de forma visual.</p>
        </div>
        <div className="relative w-full md:w-64">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input 
            type="text"
            placeholder="Buscar candidato..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-full border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-sm outline-none focus:ring-2 focus:ring-accent"
          />
        </div>
      </div>

      <div className="flex gap-6 overflow-x-auto pb-6 -mx-6 px-6 scrollbar-hide">
        {COLUMNS.map(col => (
          <div key={col.id} className="flex-shrink-0 w-80 flex flex-col gap-4">
            <div className="flex items-center justify-between px-2">
              <div className="flex items-center gap-2">
                <div className={`w-2 h-2 rounded-full ${col.color}`}></div>
                <h3 className="font-bold text-sm uppercase tracking-widest">{col.title}</h3>
                <span className="text-[10px] font-black bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-full text-slate-400">
                  {filteredApps.filter(a => (a.estado || 'evaluado') === col.id).length}
                </span>
              </div>
              <MoreHorizontal size={16} className="text-slate-400" />
            </div>

            <div className="flex-1 min-h-[500px] p-3 bg-slate-100/50 dark:bg-slate-900/50 rounded-[2rem] border-2 border-dashed border-slate-200 dark:border-slate-800 space-y-3">
              {filteredApps
                .filter(app => (app.estado || 'evaluado') === col.id)
                .map(app => (
                  <div 
                    key={app.id}
                    className="p-4 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md hover:border-accent transition-all group"
                  >
                    <div className="flex justify-between items-center mb-3">
                      <div className="w-10 h-10 rounded-xl bg-slate-50 dark:bg-slate-800 flex items-center justify-center text-xs font-black border border-slate-100 dark:border-slate-700 shadow-sm">
                        {Math.round(app.score)}%
                      </div>
                      <select 
                        value={app.estado || 'evaluado'}
                        onChange={(e) => updateStatus(app.id, e.target.value)}
                        className="text-[10px] font-bold bg-slate-50 dark:bg-slate-800 border-none rounded-lg py-1 px-2 outline-none focus:ring-1 focus:ring-accent cursor-pointer"
                      >
                        {COLUMNS.map(c => (
                          <option key={c.id} value={c.id}>{c.title}</option>
                        ))}
                      </select>
                    </div>
                    
                    <div onClick={() => setExpandedId(expandedId === app.id ? null : app.id)} className="cursor-pointer">
                      <h4 className="font-bold text-sm group-hover:text-accent transition-colors">{app.candidate?.nombre}</h4>
                      <p className="text-[10px] text-slate-500 uppercase tracking-tighter mt-1">{app.job?.titulo}</p>
                    </div>

                    {expandedId === app.id && (
                      <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-800 space-y-4 animate-in slide-in-from-top-2 duration-300">
                        <div>
                          <p className="text-[10px] font-black text-slate-400 uppercase mb-2 tracking-widest">Análisis de Requisitos</p>
                          <div className="flex flex-wrap gap-1.5">
                            {app.job?.requisitos?.map(req => {
                              const hasIt = app.candidate?.habilidades?.some(h => h.toLowerCase().includes(req.toLowerCase()));
                              return (
                                <div key={req} className={`text-[10px] px-2 py-1 rounded-lg font-bold flex items-center gap-1.5 ${
                                  hasIt ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' : 'bg-red-50 text-red-600 border border-red-100'
                                }`}>
                                  {hasIt ? <CheckCircle2 size={12} /> : <XCircle size={12} />} {req}
                                </div>
                              );
                            })}
                            {(!app.job?.requisitos || app.job.requisitos.length === 0) && (
                              <p className="text-[10px] text-slate-400 italic">No hay requisitos definidos para este puesto.</p>
                            )}
                          </div>
                        </div>
                        <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-2xl text-[10px] text-slate-600 dark:text-slate-400 leading-relaxed">
                          <span className="font-black text-accent uppercase block mb-1">💡 Recomendación AI</span>
                          {Math.round(app.score) > 80 
                            ? "Perfil altamente compatible. Se recomienda avanzar a entrevista técnica para validar habilidades blandas." 
                            : "El perfil presenta brechas técnicas importantes. Evaluar si la experiencia compensa la falta de habilidades específicas."}
                        </div>
                      </div>
                    )}
                    
                    <div className="mt-4 pt-3 border-t border-slate-50 dark:border-slate-800 flex justify-between items-center">
                      <span className="text-[10px] font-bold text-slate-400">ID: {app.id.slice(0, 5)}</span>
                      <div className="flex -space-x-2">
                        <div className="w-6 h-6 rounded-full border-2 border-white dark:border-slate-900 bg-slate-200 overflow-hidden shadow-sm">
                          <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${app.candidate_id}`} alt="avatar" />
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
