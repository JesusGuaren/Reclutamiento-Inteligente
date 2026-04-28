"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Sparkles, ChevronLeft, FileUp, Upload, User, ClipboardList } from 'lucide-react';
import Link from 'next/link';
import { evaluateCandidate, Job } from '@/lib/evaluator';
import { supabase } from '@/lib/supabase';

export default function NewCandidatePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [extracting, setExtracting] = useState(false);
  const [nombre, setNombre] = useState("");
  const [cvText, setCvText] = useState("");
  const [jobs, setJobs] = useState<Job[]>([]);
  const [selectedJobId, setSelectedJobId] = useState("");
  
  // Datos extraídos
  const [extractedData, setExtractedData] = useState<any>(null);

  useEffect(() => {
    async function fetchJobs() {
      const { data } = await supabase.from('jobs').select('*').eq('estado', 'activa');
      if (data) {
        setJobs(data);
        if (data.length > 0) setSelectedJobId(data[0].id);
      }
    }
    fetchJobs();
  }, []);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setExtracting(true);
    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await fetch('/api/extract', {
        method: 'POST',
        body: formData,
      });
      const data = await res.json();
      
      if (data.structured) {
        setExtractedData(data.structured);
        setCvText(`DATOS EXTRAÍDOS DEL PDF:\n\n` + 
          `Habilidades: ${data.structured.skills.join(', ')}\n` +
          `Experiencia: ${data.structured.experience} años\n` +
          `Educación: ${data.structured.education.join(', ')}`);
        alert("¡PDF procesado exitosamente!");
      } else {
        alert("Error de extracción: " + (data.error || "Formato no soportado"));
      }
    } catch (err) {
      alert("Error de conexión con el servidor");
    } finally {
      setExtracting(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedJobId) return alert("Selecciona una oferta primero");
    
    setLoading(true);

    // Si tenemos datos extraídos, los usamos, si no, usamos el fallback
    const finalSkills = extractedData?.skills || [];
    const finalExp = extractedData?.experience || 0;
    const finalEdu = extractedData?.education?.[0] || "Ninguno";

    // 1. Guardar Candidato
    const { data: candData, error: candError } = await supabase
      .from('candidates')
      .insert([{ 
        nombre, 
        habilidades: finalSkills, 
        experiencia: finalExp, 
        educacion: finalEdu,
        cv_texto: cvText
      }])
      .select()
      .single();

    if (candError) {
      alert("Error al guardar candidato: " + candError.message);
      setLoading(false);
      return;
    }

    // 2. Evaluar
    const job = jobs.find(j => j.id === selectedJobId);
    if (job) {
      const evaluation = evaluateCandidate(job, {
        id: candData.id,
        nombre: candData.nombre,
        habilidades: candData.habilidades,
        experiencia: candData.experiencia,
        educacion: candData.educacion as any
      });

      // 3. Guardar Aplicación
      await supabase
        .from('applications')
        .insert([{
          job_id: job.id,
          candidate_id: candData.id,
          score: evaluation.score_total,
          detalle_score: evaluation.detalle,
          justificacion: evaluation.justificacion
        }]);
    }

    setLoading(false);
    router.push('/ranking');
  };

  return (
    <div className="max-w-2xl mx-auto space-y-8 animate-in slide-in-from-bottom duration-500 pb-20">
      <div className="flex items-center gap-4">
        <Link href="/" className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-900 transition-colors">
          <ChevronLeft size={24} />
        </Link>
        <h1 className="text-3xl font-bold">Nueva Evaluación</h1>
      </div>

      <div className="space-y-6">
        {/* Sección de Carga de PDF */}
        <div className="p-8 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-3xl text-white shadow-xl space-y-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-white/20 rounded-lg">
              <FileUp size={24} />
            </div>
            <div>
              <h2 className="font-bold text-xl">Auto-extracción con PDF</h2>
              <p className="text-blue-100 text-sm">Sube un CV para autocompletar la evaluación</p>
            </div>
          </div>
          
          <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-white/30 rounded-2xl cursor-pointer hover:bg-white/10 transition-colors">
            <div className="flex flex-col items-center justify-center pt-5 pb-6">
              <Upload className="mb-2" size={32} />
              <p className="text-sm font-medium">
                {extracting ? "Procesando documento..." : "Click para subir o arrastra un PDF"}
              </p>
            </div>
            <input type="file" className="hidden" accept=".pdf" onChange={handleFileUpload} disabled={extracting} />
          </label>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="bg-white dark:bg-slate-900 p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-400 uppercase flex items-center gap-2">
                <User size={16} /> Nombre del Candidato
              </label>
              <input 
                required
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
                placeholder="Ej: Juan Pérez"
                className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-transparent outline-none focus:ring-2 focus:ring-accent"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-400 uppercase flex items-center gap-2">
                <ClipboardList size={16} /> Oferta de Trabajo
              </label>
              <select 
                required
                value={selectedJobId}
                onChange={(e) => setSelectedJobId(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-transparent outline-none focus:ring-2 focus:ring-accent"
              >
                {jobs.length === 0 ? (
                  <option disabled>No hay ofertas activas</option>
                ) : (
                  jobs.map(job => (
                    <option key={job.id} value={job.id}>{job.titulo} ({job.nivel})</option>
                  ))
                )}
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-400 uppercase">Resumen / Notas</label>
              <textarea 
                value={cvText}
                onChange={(e) => setCvText(e.target.value)}
                placeholder="Detalles adicionales..."
                className="w-full h-32 px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-transparent outline-none focus:ring-2 focus:ring-accent resize-none text-sm font-mono"
              />
            </div>
          </div>

          <button 
            disabled={loading || extracting || jobs.length === 0}
            type="submit"
            className="w-full py-4 rounded-2xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-bold text-lg hover:opacity-90 disabled:opacity-50 transition-all shadow-xl flex items-center justify-center gap-2"
          >
            {loading ? "Guardando..." : (
              <>
                <Sparkles size={20} />
                Confirmar y Evaluar
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
