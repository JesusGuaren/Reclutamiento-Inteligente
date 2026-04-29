"use client";

import { useState, useEffect, use } from 'react';
import { useRouter } from 'next/navigation';
import { ChevronLeft, Save, Trash2 } from 'lucide-react';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import { Job } from '@/types';

export default function EditJobPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [job, setJob] = useState<Partial<Job>>({
    titulo: "",
    descripcion: "",
    nivel: "Junior",
    experiencia_min: 0,
    educacion_min: "Universitario",
    habilidades_requeridas: []
  });

  useEffect(() => {
    fetchJob();
  }, [id]);

  async function fetchJob() {
    const { data, error } = await supabase.from('jobs').select('*').eq('id', id).single();
    if (data) setJob(data);
    setLoading(false);
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    const { error } = await supabase.from('jobs').update(job).eq('id', id);
    if (!error) router.push('/');
    setSaving(false);
  };

  const handleDelete = async () => {
    if (confirm("¿Estás seguro de eliminar esta oferta? Se borrarán también sus candidatos.")) {
      await supabase.from('jobs').delete().eq('id', id);
      router.push('/');
    }
  };

  if (loading) return <div className="p-20 text-center">Cargando datos...</div>;

  return (
    <div className="max-w-2xl mx-auto space-y-8 animate-in slide-in-from-bottom duration-500 pb-20">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/" className="p-2 rounded-full hover:bg-slate-100 transition-colors">
            <ChevronLeft size={24} />
          </Link>
          <h1 className="text-3xl font-bold">Editar Oferta</h1>
        </div>
        <button onClick={handleDelete} className="p-3 text-red-500 hover:bg-red-50 rounded-2xl transition-colors">
          <Trash2 size={24} />
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="bg-white dark:bg-slate-900 p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-400 uppercase">Título del Puesto</label>
            <input 
              required
              value={job.titulo}
              onChange={(e) => setJob({...job, titulo: e.target.value})}
              className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-transparent outline-none focus:ring-2 focus:ring-accent"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-400 uppercase">Descripción</label>
            <textarea 
              value={job.descripcion}
              onChange={(e) => setJob({...job, descripcion: e.target.value})}
              className="w-full h-32 px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-transparent outline-none focus:ring-2 focus:ring-accent resize-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-400 uppercase">Nivel</label>
              <select 
                value={job.nivel}
                onChange={(e) => setJob({...job, nivel: e.target.value as any})}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-transparent outline-none focus:ring-2 focus:ring-accent"
              >
                <option value="Junior">Junior</option>
                <option value="Semi-Senior">Semi-Senior</option>
                <option value="Senior">Senior</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-400 uppercase">Exp. Mínima</label>
              <input 
                type="number"
                value={job.experiencia_min}
                onChange={(e) => setJob({...job, experiencia_min: parseInt(e.target.value)})}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-transparent outline-none focus:ring-2 focus:ring-accent"
              />
            </div>
          </div>
        </div>

        <button 
          disabled={saving}
          type="submit"
          className="w-full py-4 rounded-2xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-bold text-lg hover:opacity-90 shadow-xl flex items-center justify-center gap-2"
        >
          <Save size={20} />
          {saving ? "Guardando..." : "Guardar Cambios"}
        </button>
      </form>
    </div>
  );
}
