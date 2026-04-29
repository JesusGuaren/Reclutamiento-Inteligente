"use client";

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { Application } from '@/types';
import { 
  Calendar as CalendarIcon, 
  Clock, 
  User, 
  Mail, 
  Video, 
  MapPin, 
  CheckCircle2, 
  XCircle,
  ChevronRight,
  ExternalLink
} from 'lucide-react';
import Link from 'next/link';

export default function AgendaPage() {
  const [interviews, setInterviews] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchInterviews();
  }, []);

  async function fetchInterviews() {
    setLoading(true);
    const { data } = await supabase
      .from('applications')
      .select('*, candidate:candidates(*), job:jobs(*)')
      .eq('estado', 'entrevista_pendiente')
      .order('fecha_entrevista', { ascending: true });
    
    if (data) setInterviews(data as any);
    setLoading(false);
  }

  const markAsDone = async (id: string) => {
    const { error } = await supabase
      .from('applications')
      .update({ estado: 'entrevista_realizada' })
      .eq('id', id);
    
    if (!error) {
      setInterviews(prev => prev.filter(i => i.id !== id));
    }
  };

  if (loading) return <div className="p-20 text-center animate-pulse">Cargando agenda de entrevistas...</div>;

  return (
    <div className="space-y-10 animate-in fade-in duration-700 pb-20">
      <header className="space-y-2">
        <h1 className="text-4xl font-black tracking-tighter">Agenda de Entrevistas</h1>
        <p className="text-slate-500 text-lg">Gestiona tus próximas reuniones con los candidatos seleccionados.</p>
      </header>

      {interviews.length === 0 ? (
        <div className="py-20 text-center border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-[3rem] bg-slate-50/50 dark:bg-slate-900/50">
          <CalendarIcon className="mx-auto text-slate-300 mb-4" size={48} />
          <p className="text-slate-500 font-bold">No hay entrevistas agendadas por ahora.</p>
          <Link href="/ranking" className="text-accent hover:underline text-sm font-bold mt-2 inline-block">
            Ir a Selección para agendar
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6">
          {interviews.map(interview => {
            const date = new Date(interview.fecha_entrevista!);
            return (
              <div key={interview.id} className="group bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-200 dark:border-slate-800 p-8 shadow-sm hover:shadow-xl hover:border-accent transition-all flex flex-col md:flex-row gap-8">
                {/* Date/Time Badge */}
                <div className="flex-shrink-0 w-full md:w-32 flex flex-col items-center justify-center p-4 bg-accent/5 dark:bg-accent/10 rounded-3xl border border-accent/10">
                  <span className="text-xs font-black text-accent uppercase tracking-widest mb-1">
                    {date.toLocaleDateString('es-ES', { month: 'short' })}
                  </span>
                  <span className="text-4xl font-black text-slate-900 dark:text-white">
                    {date.getDate()}
                  </span>
                  <span className="text-sm font-bold text-slate-500 mt-2 flex items-center gap-1">
                    <Clock size={14} /> {date.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>

                {/* Candidate Info */}
                <div className="flex-1 space-y-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-2xl font-black group-hover:text-accent transition-colors">{interview.candidate?.nombre}</h3>
                      <p className="text-sm font-bold text-slate-400 uppercase tracking-widest">{interview.job?.titulo}</p>
                    </div>
                    <div className="p-3 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 rounded-2xl font-black text-xs">
                      {Math.round(interview.score)}% Fit
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="flex items-center gap-3 text-slate-600 dark:text-slate-400 text-sm">
                      <div className="p-2 bg-slate-100 dark:bg-slate-800 rounded-lg"><Mail size={16} /></div>
                      {interview.candidate?.email || 'email@ejemplo.com'}
                    </div>
                    <div className="flex items-center gap-3 text-slate-600 dark:text-slate-400 text-sm">
                      <div className="p-2 bg-slate-100 dark:bg-slate-800 rounded-lg"><Video size={16} /></div>
                      Google Meet / Zoom
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex flex-row md:flex-col justify-center gap-2 border-t md:border-t-0 md:border-l border-slate-100 dark:border-slate-800 pt-6 md:pt-0 md:pl-8">
                  <button 
                    onClick={() => markAsDone(interview.id)}
                    className="flex-1 px-6 py-3 bg-emerald-500 text-white font-bold rounded-2xl hover:bg-emerald-600 transition-all flex items-center justify-center gap-2"
                  >
                    <CheckCircle2 size={18} /> Finalizar
                  </button>
                  <Link 
                    href="/ranking"
                    className="flex-1 px-6 py-3 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-bold rounded-2xl hover:bg-slate-200 transition-all flex items-center justify-center gap-2"
                  >
                    <ExternalLink size={18} /> Ver Perfil
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
