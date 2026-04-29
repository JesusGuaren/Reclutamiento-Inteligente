"use client";

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { Job } from '@/types';
import { 
  Briefcase, 
  MapPin, 
  Clock, 
  ChevronRight, 
  ChevronLeft, 
  Sparkles, 
  ShieldCheck,
  FileUp,
  X,
  Upload,
  CheckCircle2,
  Brain
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { evaluateCandidate } from '@/lib/evaluator';

export default function JobBoardPage() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showApplyModal, setShowApplyModal] = useState(false);
  const [postulando, setPostulando] = useState(false);
  const [postuladoExitoso, setPostuladoExitoso] = useState(false);
  
  // Formulario de postulación
  const [nombre, setNombre] = useState("");
  const [cvFile, setCvFile] = useState<File | null>(null);

  useEffect(() => {
    fetchJobs();
  }, []);

  async function fetchJobs() {
    setLoading(true);
    const { data } = await supabase
      .from('jobs')
      .select('*')
      .eq('estado', 'activa')
      .order('created_at', { ascending: false });
    
    if (data) setJobs(data);
    setLoading(false);
  }

  const nextJob = () => {
    if (currentIndex < jobs.length - 1) setCurrentIndex(currentIndex + 1);
  };

  const prevJob = () => {
    if (currentIndex > 0) setCurrentIndex(currentIndex - 1);
  };

  const handleApply = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!cvFile || !nombre) return;

    setPostulando(true);
    const selectedJob = jobs[currentIndex];

    try {
      // 1. Extraer datos del PDF
      const formData = new FormData();
      formData.append('file', cvFile);
      
      const res = await fetch('/api/extract', {
        method: 'POST',
        body: formData,
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || "No pudimos leer tu CV. Intenta con otro archivo.");
      }
      
      const data = await res.json();
      if (!data.structured) throw new Error("No pudimos extraer datos de tu CV. Intenta con otro archivo.");

      const extracted = data.structured;

      // 2. Crear Candidato
      const { data: candData, error: candError } = await supabase
        .from('candidates')
        .insert([{
          nombre,
          habilidades: extracted.skills,
          experiencia: extracted.experience,
          educacion: extracted.education?.[0] || 'Ninguno',
        }])
        .select()
        .single();

      if (candError) throw candError;

      // 3. Evaluar con IA
      const evaluation = evaluateCandidate(selectedJob as any, {
        id: candData.id,
        nombre: candData.nombre,
        habilidades: candData.habilidades,
        experiencia: candData.experiencia,
        educacion: candData.educacion as any
      });

      // 4. Crear Aplicación
      const { error: appError } = await supabase
        .from('applications')
        .insert([{
          job_id: selectedJob.id,
          candidate_id: candData.id,
          score: evaluation.score_total,
          detalle_score: evaluation.detalle,
          justificacion: evaluation.justificacion,
          fortalezas: evaluation.fortalezas,
          debilidades: evaluation.debilidades,
          estado: 'pendiente'
        }]);

      if (appError) throw appError;

      setPostuladoExitoso(true);
      setTimeout(() => {
        setShowApplyModal(false);
        setPostuladoExitoso(false);
        setNombre("");
        setCvFile(null);
        nextJob(); // Pasar a la siguiente oferta
      }, 3000);

    } catch (err: any) {
      alert(err.message || "Error al postular. Intenta nuevamente.");
    } finally {
      setPostulando(false);
    }
  };

  if (loading) return (
    <div className="h-[60vh] flex items-center justify-center">
      <div className="w-12 h-12 border-4 border-accent border-t-transparent rounded-full animate-spin"></div>
    </div>
  );

  if (jobs.length === 0) return (
    <div className="h-[60vh] flex flex-col items-center justify-center text-center space-y-4">
      <div className="p-6 bg-slate-100 dark:bg-slate-900 rounded-full text-slate-300">
        <Briefcase size={48} />
      </div>
      <h2 className="text-2xl font-black">No hay vacantes activas</h2>
      <p className="text-slate-500 max-w-xs">Vuelve más tarde para descubrir nuevas oportunidades.</p>
    </div>
  );

  const currentJob = jobs[currentIndex];

  return (
    <div className="max-w-2xl mx-auto space-y-8 pb-12">
      {/* Header Info */}
      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-sm font-black text-accent uppercase tracking-widest">Nuevas Vacantes</h2>
          <p className="text-slate-500 font-bold">{currentIndex + 1} de {jobs.length} disponibles</p>
        </div>
        <div className="flex gap-2">
          <button onClick={prevJob} disabled={currentIndex === 0} className="p-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl hover:bg-slate-50 transition-colors disabled:opacity-30">
            <ChevronLeft size={20} />
          </button>
          <button onClick={nextJob} disabled={currentIndex === jobs.length - 1} className="p-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl hover:bg-slate-50 transition-colors disabled:opacity-30">
            <ChevronRight size={20} />
          </button>
        </div>
      </div>

      {/* Job Card (Tinder Style) */}
      <AnimatePresence mode="wait">
        <motion.div 
          key={currentJob.id}
          initial={{ opacity: 0, x: 20, scale: 0.95 }}
          animate={{ opacity: 1, x: 0, scale: 1 }}
          exit={{ opacity: 0, x: -20, scale: 0.95 }}
          className="relative bg-white dark:bg-slate-900 rounded-[3rem] border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden"
        >
          <div className="h-40 bg-gradient-to-br from-accent to-indigo-600 p-8 flex items-end">
            <div className="p-4 bg-white/10 backdrop-blur-md rounded-2xl border border-white/20">
              <Briefcase className="text-white" size={32} />
            </div>
          </div>

          <div className="p-10 space-y-8">
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-xs font-black text-accent uppercase tracking-widest">
                <Sparkles size={14} /> Oferta Destacada
              </div>
              <h1 className="text-4xl font-black tracking-tighter leading-none">{currentJob.titulo}</h1>
              <div className="flex flex-wrap gap-4 pt-2">
                <span className="flex items-center gap-1.5 text-sm font-bold text-slate-500">
                  <MapPin size={16} /> Remoto / Híbrido
                </span>
                <span className="flex items-center gap-1.5 text-sm font-bold text-slate-500">
                  <Clock size={16} /> Full-Time
                </span>
                <span className="px-3 py-1 bg-slate-100 dark:bg-slate-800 rounded-full text-[10px] font-black uppercase tracking-widest">
                  {currentJob.nivel}
                </span>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-bold">Descripción del puesto</h3>
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                {currentJob.descripcion || "Buscamos profesionales apasionados para unirse a nuestro equipo de alto impacto. Valoramos la proactividad y el aprendizaje continuo."}
              </p>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-bold">Requisitos Clave</h3>
              <div className="flex flex-wrap gap-2">
                {currentJob.habilidades_requeridas.map(skill => (
                  <span key={skill} className="px-4 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-xl text-sm font-bold text-slate-700 dark:text-slate-300">
                    {skill}
                  </span>
                ))}
              </div>
            </div>

            <button 
              onClick={() => setShowApplyModal(true)}
              className="w-full py-5 bg-accent text-white rounded-[2rem] font-black text-xl shadow-xl shadow-accent/20 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-3"
            >
              Postular Ahora <Sparkles size={24} />
            </button>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Modal de Postulación */}
      <AnimatePresence>
        {showApplyModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => !postulando && setShowApplyModal(false)}
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="relative w-full max-w-lg bg-white dark:bg-slate-900 rounded-[3rem] shadow-2xl overflow-hidden p-10"
            >
              {!postuladoExitoso ? (
                <>
                  <div className="flex justify-between items-center mb-8">
                    <h2 className="text-3xl font-black tracking-tighter">Postulación Rápida</h2>
                    <button onClick={() => setShowApplyModal(false)} className="p-2 hover:bg-slate-100 rounded-full transition-colors">
                      <X size={24} />
                    </button>
                  </div>

                  <form onSubmit={handleApply} className="space-y-6">
                    <div className="space-y-2">
                      <label className="text-xs font-black text-slate-400 uppercase tracking-widest">Nombre Completo</label>
                      <input 
                        required
                        value={nombre}
                        onChange={(e) => setNombre(e.target.value)}
                        placeholder="Ej: Juan Pérez"
                        className="w-full px-6 py-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-transparent outline-none focus:ring-2 focus:ring-accent font-bold"
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="text-xs font-black text-slate-400 uppercase tracking-widest">Tu CV (PDF)</label>
                      <label className="flex flex-col items-center justify-center w-full h-40 border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-[2rem] cursor-pointer hover:bg-slate-50 transition-colors">
                        <div className="flex flex-col items-center justify-center pt-5 pb-6">
                          {cvFile ? (
                            <>
                              <CheckCircle2 className="text-accent mb-2" size={40} />
                              <p className="text-sm font-black">{cvFile.name}</p>
                            </>
                          ) : (
                            <>
                              <FileUp className="text-slate-300 mb-2" size={40} />
                              <p className="text-sm font-bold text-slate-400">Click para subir PDF</p>
                            </>
                          )}
                        </div>
                        <input type="file" className="hidden" accept=".pdf" onChange={(e) => setCvFile(e.target.files?.[0] || null)} />
                      </label>
                    </div>

                    <button 
                      disabled={postulando || !cvFile || !nombre}
                      type="submit"
                      className="w-full py-5 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-2xl font-black text-lg shadow-xl hover:opacity-90 disabled:opacity-30 transition-all flex items-center justify-center gap-2"
                    >
                      {postulando ? (
                        <>
                          <div className="w-5 h-5 border-2 border-white dark:border-slate-900 border-t-transparent rounded-full animate-spin"></div>
                          Analizando CV con IA...
                        </>
                      ) : (
                        <>Enviar Postulación</>
                      )}
                    </button>
                    <p className="text-center text-[10px] text-slate-400 font-bold uppercase flex items-center justify-center gap-2">
                      <ShieldCheck size={12} /> Procesamiento Determinista Seguro
                    </p>
                  </form>
                </>
              ) : (
                <div className="py-12 text-center space-y-6 animate-in zoom-in duration-500">
                  <div className="w-24 h-24 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-lg">
                    <CheckCircle2 size={48} />
                  </div>
                  <div className="space-y-2">
                    <h2 className="text-3xl font-black tracking-tighter text-emerald-600">¡Postulación Enviada!</h2>
                    <p className="text-slate-500 font-bold">Nuestra IA ya procesó tu perfil y el reclutador ha sido notificado.</p>
                  </div>
                  <div className="p-4 bg-slate-50 rounded-2xl flex items-center gap-3 text-left">
                    <Brain className="text-accent" size={24} />
                    <p className="text-[10px] font-bold text-slate-500 leading-tight">
                      Tu perfil fue evaluado automáticamente comparando tus habilidades con los requerimientos del puesto.
                    </p>
                  </div>
                </div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
