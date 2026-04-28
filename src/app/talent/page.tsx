"use client";

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { Candidate } from '@/types';
import { 
  Search, 
  User, 
  Mail, 
  Building2, 
  Award,
  Filter,
  ArrowUpRight
} from 'lucide-react';
import Link from 'next/link';

export default function TalentPoolPage() {
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedSkill, setSelectedSkill] = useState("");

  useEffect(() => {
    fetchCandidates();
  }, []);

  async function fetchCandidates() {
    setLoading(true);
    const { data } = await supabase
      .from('candidates')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (data) setCandidates(data);
    setLoading(false);
  }

  // Obtener todas las habilidades únicas para el filtro
  const allSkills = Array.from(new Set(candidates.flatMap(c => c.habilidades))).sort();

  const filteredCandidates = candidates.filter(c => {
    const name = c.nombre?.toLowerCase() || "";
    const email = c.email?.toLowerCase() || "";
    const search = searchTerm.toLowerCase();
    
    const matchesSearch = name.includes(search) || email.includes(search);
    const matchesSkill = selectedSkill === "" || (c.habilidades || []).some(s => s === selectedSkill);
    return matchesSearch && matchesSkill;
  });

  if (loading) return <div className="p-20 text-center animate-pulse text-slate-400">Buscando en la base de datos de talentos...</div>;

  return (
    <div className="space-y-10 animate-in fade-in duration-700 pb-20">
      <header className="space-y-2">
        <h1 className="text-4xl font-black tracking-tighter">Talent Pool</h1>
        <p className="text-slate-500 text-lg">Busca y filtra entre todos los candidatos evaluados por tu organización.</p>
      </header>

      {/* Search & Filters */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
          <input 
            type="text"
            placeholder="Buscar por nombre o email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-12 pr-4 py-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 outline-none focus:ring-2 focus:ring-accent shadow-sm"
          />
        </div>
        <div className="relative md:w-64">
          <Filter className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <select 
            value={selectedSkill}
            onChange={(e) => setSelectedSkill(e.target.value)}
            className="w-full pl-10 pr-4 py-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 outline-none focus:ring-2 focus:ring-accent shadow-sm appearance-none cursor-pointer font-bold text-sm"
          >
            <option value="">Todas las habilidades</option>
            {allSkills.map(skill => (
              <option key={skill} value={skill}>{skill}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Results Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCandidates.map(candidate => (
          <div key={candidate.id} className="group p-6 bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-200 dark:border-slate-800 hover:shadow-2xl hover:border-accent transition-all flex flex-col justify-between">
            <div>
              <div className="flex justify-between items-start mb-6">
                <div className="w-16 h-16 rounded-2xl bg-slate-50 dark:bg-slate-800 flex items-center justify-center border border-slate-100 dark:border-slate-700 shadow-sm overflow-hidden">
                  <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${candidate.id}`} alt="avatar" />
                </div>
                <div className="p-2 bg-accent/10 text-accent rounded-xl opacity-0 group-hover:opacity-100 transition-opacity">
                  <Award size={20} />
                </div>
              </div>
              
              <h3 className="text-xl font-black mb-1 group-hover:text-accent transition-colors">{candidate.nombre}</h3>
              <div className="space-y-2 mb-6">
                <div className="flex items-center gap-2 text-slate-500 text-xs">
                  <Mail size={14} /> {candidate.email}
                </div>
                {candidate.experiencia && (
                  <div className="flex items-center gap-2 text-slate-500 text-xs">
                    <Building2 size={14} /> {candidate.experiencia[0]?.cargo} en {candidate.experiencia[0]?.empresa}
                  </div>
                )}
              </div>

              <div className="flex flex-wrap gap-1.5">
                {candidate.habilidades.slice(0, 6).map(skill => (
                  <span key={skill} className="text-[10px] px-2 py-1 bg-slate-100 dark:bg-slate-800 rounded-lg font-bold text-slate-500 dark:text-slate-400">
                    {skill}
                  </span>
                ))}
                {candidate.habilidades.length > 6 && (
                  <span className="text-[10px] px-2 py-1 bg-slate-50 dark:bg-slate-800 rounded-lg font-bold text-slate-400">
                    +{candidate.habilidades.length - 6}
                  </span>
                )}
              </div>
            </div>

            <div className="mt-8 pt-6 border-t border-slate-50 dark:border-slate-800 flex justify-between items-center">
              <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest">Base de Datos TesIS-AI</span>
              <Link 
                href={`/ranking?search=${candidate.nombre}`} 
                className="flex items-center gap-1 text-xs font-black text-accent hover:underline"
              >
                Ver Ranking <ArrowUpRight size={14} />
              </Link>
            </div>
          </div>
        ))}
      </div>

      {filteredCandidates.length === 0 && (
        <div className="py-20 text-center border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-[3rem]">
          <p className="text-slate-400 font-bold">No se encontraron candidatos con esos criterios.</p>
        </div>
      )}
    </div>
  );
}
