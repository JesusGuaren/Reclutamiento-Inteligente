"use client";

import { useEffect, useState } from 'react';
import { Trophy, AlertCircle, ChevronRight, Info, Search, GitCompare, X, CheckCircle, Calendar, Trash2, Star, AlertTriangle } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { Application } from '@/types';
import { evaluateCandidate } from '@/lib/evaluator';

export default function RankingPage() {
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedEval, setSelectedEval] = useState<Application | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [compareList, setCompareList] = useState<Application[]>([]);
  const [minScore, setMinScore] = useState(0);
  const [interviewDate, setInterviewDate] = useState("");

  useEffect(() => {
    fetchApplications();
    // Limpieza automática de estados antiguos para que no digan "Entrevistado" a secas
    cleanupOldStatuses();
  }, []);

  async function cleanupOldStatuses() {
    await supabase
      .from('applications')
      .update({ estado: 'entrevista_pendiente' })
      .eq('estado', 'entrevistado');
  }

  async function fetchApplications() {
    setLoading(true);
    const { data, error } = await supabase
      .from('applications')
      .select(`
        *,
        candidate:candidates(*),
        job:jobs(*)
      `)
      .order('score', { ascending: false });

    if (!error && data) {
      setApplications(data as any);
    }
    setLoading(false);
  }

  async function updateApplication(id: string, updates: Partial<Application>) {
    const { error } = await supabase
      .from('applications')
      .update(updates)
      .eq('id', id);
    
    if (!error) {
      fetchApplications();
      if (selectedEval && selectedEval.id === id) {
        setSelectedEval({ ...selectedEval, ...updates });
      }
    }
  }

  const toggleCompare = (app: Application, e: React.MouseEvent) => {
    e.stopPropagation();
    if (compareList.find(item => item.id === app.id)) {
      setCompareList(compareList.filter(item => item.id !== app.id));
    } else if (compareList.length < 2) {
      setCompareList([...compareList, app]);
    }
  };

  const filteredApps = applications.filter(app => {
    const nombre = app.candidate?.nombre?.toLowerCase() || "";
    const titulo = app.job?.titulo?.toLowerCase() || "";
    const search = searchTerm.toLowerCase();
    const meetsMinScore = app.score >= minScore;
    return (nombre.includes(search) || titulo.includes(search)) && meetsMinScore;
  });

  if (loading) {
    return <div className="flex items-center justify-center h-96 text-slate-400">Analizando candidatos...</div>;
  }

  const downloadCSV = () => {
    const headers = ["Candidato", "Puesto", "Nivel", "Score Total", "Habilidades", "Experiencia", "Educación"];
    const rows = filteredApps.map(app => [
      app.candidate?.nombre,
      app.job?.titulo,
      app.job?.nivel,
      `${Math.round(app.score)}%`,
      `${app.detalle_score.habilidades}%`,
      `${app.detalle_score.experiencia}%`,
      `${app.detalle_score.educacion}%`
    ]);

    const csvContent = [headers, ...rows].map(e => e.join(",")).join("\n");
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", `Ranking_Candidatos_${new Date().toLocaleDateString()}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-20">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="space-y-1">
          <h1 className="text-3xl font-black italic tracking-tighter">SELECCIÓN DE TALENTOS</h1>
          <button 
            onClick={downloadCSV}
            className="text-xs font-bold text-accent hover:underline flex items-center gap-1"
          >
            Descargar reporte CSV
          </button>
        </div>
        <div className="flex flex-col md:flex-row gap-4 w-full md:w-auto">
          <div className="relative flex-1 md:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input 
              type="text"
              placeholder="Buscar..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-full border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-sm outline-none focus:ring-2 focus:ring-accent"
            />
          </div>
          <div className="flex items-center gap-3 bg-white dark:bg-slate-900 px-4 py-2 rounded-full border border-slate-200 dark:border-slate-800">
            <span className="text-xs font-bold text-slate-400 uppercase">Min Score: {minScore}%</span>
            <input 
              type="range" 
              min="0" 
              max="100" 
              value={minScore} 
              onChange={(e) => setMinScore(parseInt(e.target.value))}
              className="accent-accent w-24 h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer"
            />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {filteredApps.map((app, index) => (
          <div 
            key={app.id}
            onClick={() => setSelectedEval(app)}
            className={`group relative p-6 bg-white dark:bg-slate-900 rounded-3xl border transition-all cursor-pointer shadow-sm hover:shadow-md
              ${compareList.find(c => c.id === app.id) ? 'border-accent ring-2 ring-accent/20' : 'border-slate-200 dark:border-slate-800'}
            `}
          >
            <div className="flex items-center gap-6">
              <div className={`
                w-12 h-12 flex items-center justify-center rounded-2xl font-bold text-xl
                ${app.estado === 'seleccionado' ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/20' : 
                  app.estado === 'entrevista_pendiente' ? 'bg-blue-500 text-white shadow-lg shadow-blue-500/20' : 
                  index === 0 ? 'bg-yellow-400 text-white shadow-lg' : 'bg-slate-100 text-slate-400'}
              `}>
                {app.estado === 'seleccionado' ? <CheckCircle size={24} /> : 
                 app.estado === 'entrevista_pendiente' ? <Calendar size={24} /> : 
                 index === 0 ? <Trophy size={24} /> : index + 1}
              </div>
              
              <div className="flex-1">
                <h3 className="text-lg font-bold group-hover:text-accent">{app.candidate?.nombre || "Candidato"}</h3>
                <div className="flex items-center gap-2">
                  <span className="text-xs px-2 py-0.5 bg-slate-100 dark:bg-slate-800 rounded text-slate-500">{app.job?.titulo || "Oferta"}</span>
                  <span className={`text-xs px-2 py-0.5 rounded font-bold uppercase ${
                    app.estado === 'seleccionado' ? 'bg-emerald-100 text-emerald-600' :
                    (app.estado === 'entrevista_pendiente' || app.estado === 'entrevista_realizada') ? 'bg-blue-100 text-blue-600' :
                    'bg-slate-100 text-slate-500'
                  }`}>
                    {app.estado === 'entrevista_pendiente' ? 'Entrevista Pendiente' : 
                     app.estado === 'entrevista_realizada' ? 'Entrevista Realizada' : 
                     app.estado}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <button 
                  onClick={(e) => toggleCompare(app, e)}
                  className={`p-2 rounded-xl transition-colors ${compareList.find(c => c.id === app.id) ? 'bg-accent text-white' : 'bg-slate-50 dark:bg-slate-800 text-slate-400 hover:text-accent'}`}
                >
                  <GitCompare size={20} />
                </button>
                <div className="text-right">
                  <div className="text-2xl font-black">{Math.round(app.score)}%</div>
                </div>
                <ChevronRight className="text-slate-300" />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Modal de Detalle Premium */}
      {selectedEval && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in">
          <div className="w-full max-w-lg bg-white dark:bg-slate-900 rounded-3xl overflow-hidden shadow-2xl">
            <div className="p-8 space-y-6">
              <div className="flex justify-between items-start">
                <div>
                  <h2 className="text-2xl font-black">{selectedEval.candidate?.nombre}</h2>
                  <p className="text-slate-500">Puesto: {selectedEval.job?.titulo}</p>
                </div>
                <button onClick={() => setSelectedEval(null)} className="p-2 hover:bg-slate-100 rounded-full">
                  <X size={24} />
                </button>
              </div>

              <div className="grid grid-cols-2 gap-4">
                {Object.entries(selectedEval.detalle_score).map(([key, value]: [string, any]) => (
                  <div key={key} className="p-4 bg-slate-50 dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-800">
                    <p className="text-[10px] font-black uppercase text-slate-400 tracking-tighter">{key}</p>
                    <p className="text-2xl font-black text-slate-700 dark:text-slate-200">{Math.round(value)}%</p>
                    <div className="w-full bg-slate-200 dark:bg-slate-700 h-1.5 rounded-full mt-2 overflow-hidden">
                      <div className="bg-emerald-500 h-full" style={{ width: `${value}%` }} />
                    </div>
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {(() => {
                  // Si no hay fortalezas en la DB (datos antiguos), las calculamos al vuelo
                  let forts = selectedEval.fortalezas || [];
                  let debils = selectedEval.debilidades || [];
                  
                  if (forts.length === 0 && debils.length === 0 && selectedEval.job && selectedEval.candidate) {
                    const evalResult = evaluateCandidate(selectedEval.job as any, selectedEval.candidate as any);
                    forts = evalResult.fortalezas;
                    debils = evalResult.debilidades;
                  }

                  return (
                    <>
                      <div className="p-5 bg-emerald-50 dark:bg-emerald-900/20 rounded-2xl border border-emerald-100 dark:border-emerald-800">
                        <p className="text-xs font-bold text-emerald-600 mb-3 flex items-center gap-2 uppercase tracking-widest">
                          <Star size={14} /> Fortalezas
                        </p>
                        <ul className="space-y-2">
                          {forts.length > 0 ? forts.map((f, i) => (
                            <li key={i} className="text-sm text-slate-700 dark:text-slate-300 flex items-start gap-2">
                              <span className="text-emerald-500 mt-1">•</span> {f}
                            </li>
                          )) : (
                            <li className="text-xs text-slate-400 italic">No se identificaron fortalezas destacadas.</li>
                          )}
                        </ul>
                      </div>
                      <div className="p-5 bg-amber-50 dark:bg-amber-900/20 rounded-2xl border border-amber-100 dark:border-amber-800">
                        <p className="text-xs font-bold text-amber-600 mb-3 flex items-center gap-2 uppercase tracking-widest">
                          <AlertTriangle size={14} /> Áreas de Mejora
                        </p>
                        <ul className="space-y-2">
                          {debils.length > 0 ? debils.map((d, i) => (
                            <li key={i} className="text-sm text-slate-700 dark:text-slate-300 flex items-start gap-2">
                              <span className="text-amber-500 mt-1">•</span> {d}
                            </li>
                          )) : (
                            <li className="text-xs text-slate-400 italic">No se identificaron debilidades críticas.</li>
                          )}
                        </ul>
                      </div>
                    </>
                  );
                })()}
              </div>

              <div className="p-6 bg-slate-50 dark:bg-slate-800 rounded-3xl border border-slate-200 dark:border-slate-700 space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="font-bold flex items-center gap-2"><Calendar size={18} /> Agendar Entrevista</h3>
                  {selectedEval.fecha_entrevista && (
                    <span className="text-[10px] bg-blue-100 text-blue-600 px-2 py-1 rounded-full font-bold">
                      Programada: {new Date(selectedEval.fecha_entrevista).toLocaleDateString()}
                    </span>
                  )}
                </div>
                <div className="flex gap-2">
                  <input 
                    type="datetime-local" 
                    value={interviewDate}
                    onChange={(e) => setInterviewDate(e.target.value)}
                    className="flex-1 px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-900 text-sm"
                  />
                  <button 
                    onClick={() => updateApplication(selectedEval.id, { fecha_entrevista: interviewDate, estado: 'entrevista_pendiente' })}
                    className="px-4 py-2 bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-bold rounded-xl text-sm hover:opacity-90"
                  >
                    Agendar
                  </button>
                </div>
              </div>

              <div className="flex gap-3">
                <button 
                  onClick={() => updateApplication(selectedEval.id, { estado: 'seleccionado' })}
                  className="flex-1 py-4 bg-emerald-500 text-white font-bold rounded-2xl shadow-lg hover:bg-emerald-600 transition-all flex items-center justify-center gap-2"
                >
                  <CheckCircle size={20} /> SELECCIONAR
                </button>
                <button 
                  onClick={() => updateApplication(selectedEval.id, { estado: 'rechazado' })}
                  className="px-6 py-4 bg-slate-100 dark:bg-slate-800 text-slate-400 font-bold rounded-2xl hover:bg-red-50 hover:text-red-500 transition-all"
                >
                  <Trash2 size={20} />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Panel de Comparación */}
      {compareList.length === 2 && (
        <div className="fixed bottom-24 left-4 right-4 md:left-auto md:right-8 md:w-96 z-50 p-6 bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 animate-in slide-in-from-right">
          <div className="flex justify-between items-center mb-6">
            <h3 className="font-black flex items-center gap-2">
              <GitCompare size={18} className="text-accent" /> COMPARATIVA LADO A LADO
            </h3>
            <button onClick={() => setCompareList([])} className="text-slate-400"><X size={20} /></button>
          </div>
          
          <div className="space-y-4">
            <div className="flex justify-between text-[10px] font-bold text-slate-400 uppercase">
              <span className="truncate w-24">{compareList[0].candidate?.nombre}</span>
              <span>vs</span>
              <span className="truncate w-24 text-right">{compareList[1].candidate?.nombre}</span>
            </div>
            
            {['habilidades', 'experiencia', 'educacion', 'extras'].map(key => (
              <div key={key} className="space-y-1">
                <p className="text-[10px] font-bold text-center uppercase text-slate-500">{key}</p>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold w-8 text-right">{Math.round(compareList[0].detalle_score[key as any])}%</span>
                  <div className="flex-1 flex h-2 rounded-full overflow-hidden bg-slate-100 dark:bg-slate-800">
                    <div 
                      className="bg-blue-500 h-full transition-all" 
                      style={{ width: `${(compareList[0].detalle_score[key as any] / (compareList[0].detalle_score[key as any] + compareList[1].detalle_score[key as any])) * 100}%` }} 
                    />
                    <div 
                      className="bg-emerald-500 h-full transition-all" 
                      style={{ width: `${(compareList[1].detalle_score[key as any] / (compareList[0].detalle_score[key as any] + compareList[1].detalle_score[key as any])) * 100}%` }} 
                    />
                  </div>
                  <span className="text-xs font-bold w-8">{Math.round(compareList[1].detalle_score[key as any])}%</span>
                </div>
              </div>
            ))}

            <div className="pt-4 flex justify-between items-center border-t border-slate-100 dark:border-slate-800">
              <div className="text-center">
                <p className="text-2xl font-black text-blue-600">{Math.round(compareList[0].score)}%</p>
                <p className="text-[10px] font-bold">TOTAL</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-black text-emerald-600">{Math.round(compareList[1].score)}%</p>
                <p className="text-[10px] font-bold">TOTAL</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
