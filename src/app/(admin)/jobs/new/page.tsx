"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ChevronLeft, Save, Plus, X, AlignLeft, BarChart } from 'lucide-react';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';

export default function NewJobPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [skills, setSkills] = useState<string[]>([]);
  const [skillInput, setSkillInput] = useState("");
  const [titulo, setTitulo] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [nivel, setNivel] = useState("Junior");
  const [expMin, setExpMin] = useState(0);
  const [eduMin, setEduMin] = useState("Universitario");
  const [pesos, setPesos] = useState({
    habilidades: 40,
    experiencia: 30,
    educacion: 20,
    extras: 10
  });

  const addSkill = () => {
    if (skillInput && !skills.includes(skillInput)) {
      setSkills([...skills, skillInput]);
      setSkillInput("");
    }
  };

  const removeSkill = (index: number) => {
    setSkills(skills.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    const { error } = await supabase
      .from('jobs')
      .insert([
        { 
          titulo, 
          descripcion,
          nivel,
          habilidades_requeridas: skills, 
          experiencia_min: expMin, 
          educacion_min: eduMin,
          estado: 'activa',
          pesos: {
            habilidades: pesos.habilidades / 100,
            experiencia: pesos.experiencia / 100,
            educacion: pesos.educacion / 100,
            extras: pesos.extras / 100
          }
        }
      ]);

    setLoading(false);
    if (error) {
      alert("Error al guardar: " + error.message);
    } else {
      router.push('/');
      router.refresh();
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-8 animate-in slide-in-from-bottom duration-500 pb-20">
      <div className="flex items-center gap-4">
        <Link href="/" className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-900 transition-colors">
          <ChevronLeft size={24} />
        </Link>
        <h1 className="text-3xl font-bold">Nueva Oferta Laboral</h1>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-6 bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-2">
              <BarChart size={16} /> Título del Puesto
            </label>
            <input 
              required
              value={titulo}
              onChange={(e) => setTitulo(e.target.value)}
              placeholder="Ej: Desarrollador Fullstack"
              className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-transparent focus:ring-2 focus:ring-accent outline-none transition-all"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-2">
              <AlignLeft size={16} /> Descripción (Opcional)
            </label>
            <textarea 
              value={descripcion}
              onChange={(e) => setDescripcion(e.target.value)}
              placeholder="Describe brevemente las responsabilidades..."
              className="w-full h-32 px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-transparent focus:ring-2 focus:ring-accent outline-none transition-all resize-none"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Nivel del Puesto</label>
              <select 
                value={nivel}
                onChange={(e) => setNivel(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-transparent focus:ring-2 focus:ring-accent outline-none transition-all"
              >
                <option value="Junior">Junior</option>
                <option value="Semi-Senior">Semi-Senior</option>
                <option value="Senior">Senior</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Educación Mínima</label>
              <select 
                value={eduMin}
                onChange={(e) => setEduMin(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-transparent focus:ring-2 focus:ring-accent outline-none transition-all"
              >
                <option value="Universitario">Universitario</option>
                <option value="Técnico">Técnico</option>
                <option value="Ninguno">Ninguno</option>
              </select>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Años de Experiencia Mínima</label>
            <input 
              required
              type="number"
              min="0"
              value={expMin}
              onChange={(e) => setExpMin(parseInt(e.target.value) || 0)}
              className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-transparent focus:ring-2 focus:ring-accent outline-none transition-all"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Habilidades Requeridas</label>
            <div className="flex gap-2">
              <input 
                value={skillInput}
                onChange={(e) => setSkillInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addSkill())}
                placeholder="Ej: React (Enter para añadir)"
                className="flex-1 px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-transparent focus:ring-2 focus:ring-accent outline-none transition-all"
              />
              <button 
                type="button"
                onClick={addSkill}
                className="p-3 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 transition-colors"
              >
                <Plus size={20} />
              </button>
            </div>
            <div className="flex flex-wrap gap-2 mt-3">
              {skills.map((skill, index) => (
                <span key={index} className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 text-sm font-medium">
                  {skill}
                  <button type="button" onClick={() => removeSkill(index)} className="hover:text-red-500">
                    <X size={14} />
                  </button>
                </span>
              ))}
            </div>
          </div>

          <div className="space-y-4 pt-4 border-t border-slate-100 dark:border-slate-800">
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400">Pesos de Evaluación (%)</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[
                { id: 'habilidades', label: 'Habilidades', color: 'bg-blue-500' },
                { id: 'experiencia', label: 'Experiencia', color: 'bg-emerald-500' },
                { id: 'educacion', label: 'Educación', color: 'bg-amber-500' },
                { id: 'extras', label: 'Extras/Otros', color: 'bg-purple-500' },
              ].map((item) => (
                <div key={item.id} className="space-y-2">
                  <div className="flex justify-between text-xs font-bold">
                    <span>{item.label}</span>
                    <span>{pesos[item.id as keyof typeof pesos]}%</span>
                  </div>
                  <input 
                    type="range"
                    min="0"
                    max="100"
                    value={pesos[item.id as keyof typeof pesos]}
                    onChange={(e) => setPesos({ ...pesos, [item.id]: parseInt(e.target.value) })}
                    className={`w-full h-1.5 rounded-lg appearance-none cursor-pointer bg-slate-200 dark:bg-slate-800 accent-slate-900 dark:accent-slate-100`}
                  />
                </div>
              ))}
            </div>
            <p className="text-[10px] text-slate-400 italic">
              * El sistema normalizará los pesos automáticamente si no suman 100%.
            </p>
          </div>
        </div>

        <button 
          disabled={loading}
          type="submit"
          className="w-full py-4 rounded-2xl bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 font-bold text-lg hover:opacity-90 disabled:opacity-50 transition-all shadow-xl"
        >
          {loading ? "Guardando..." : "Publicar Oferta"}
        </button>
      </form>
    </div>
  );
}
