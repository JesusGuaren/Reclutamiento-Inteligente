"use client";

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';
import { User, Building2, ShieldCheck, Mail, LogOut, ChevronLeft, Edit2, Save } from 'lucide-react';
import Link from 'next/link';
import { Profile } from '@/types';

export default function ProfilePage() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [email, setEmail] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({ full_name: '', empresa: '' });
  const router = useRouter();

  useEffect(() => {
    fetchProfile();
  }, [router]);

  async function fetchProfile() {
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session) {
      router.push('/login');
      return;
    }

    setEmail(session.user.email || null);

    const { data } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', session.user.id)
      .single();

    if (data) {
      setProfile(data);
      setEditData({ full_name: data.full_name || '', empresa: data.empresa || '' });
    }
    setLoading(false);
  }

  const handleSave = async () => {
    setLoading(true);
    const { data: { session } } = await supabase.auth.getSession();
    if (session) {
      const { error } = await supabase
        .from('profiles')
        .update({
          full_name: editData.full_name,
          empresa: editData.empresa
        })
        .eq('id', session.user.id);
      
      if (!error) {
        setProfile({ ...profile, full_name: editData.full_name, empresa: editData.empresa } as Profile);
        setIsEditing(false);
        router.refresh(); // Limpia la caché de Next.js
        alert("¡Perfil actualizado con éxito!");
      } else {
        alert("Error al guardar: " + error.message);
      }
    }
    setLoading(false);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/');
  };

  if (loading && !isEditing) return <div className="flex items-center justify-center h-96">Cargando perfil...</div>;

  return (
    <div className="max-w-xl mx-auto space-y-8 animate-in slide-in-from-bottom duration-500 pb-20">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/" className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
            <ChevronLeft size={24} />
          </Link>
          <h1 className="text-3xl font-black">Mi Perfil</h1>
        </div>
        {!isEditing && (
          <button 
            onClick={() => setIsEditing(true)}
            className="flex items-center gap-2 px-4 py-2 bg-slate-100 dark:bg-slate-800 rounded-xl text-sm font-bold hover:bg-slate-200 transition-all"
          >
            <Edit2 size={16} /> Editar
          </button>
        )}
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xl overflow-hidden">
        <div className="h-32 bg-gradient-to-r from-emerald-500 to-teal-600"></div>
        <div className="px-8 pb-8">
          <div className="relative -top-12 flex items-end gap-6">
            <div className="w-24 h-24 rounded-3xl bg-white dark:bg-slate-950 p-1 shadow-lg">
              <div className="w-full h-full rounded-2xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-400">
                <User size={48} />
              </div>
            </div>
            <div className="pb-2">
              {isEditing ? (
                <input 
                  value={editData.full_name}
                  onChange={(e) => setEditData({...editData, full_name: e.target.value})}
                  className="text-2xl font-black bg-slate-50 dark:bg-slate-800 border-b-2 border-emerald-500 outline-none"
                  placeholder="Tu nombre..."
                />
              ) : (
                <h2 className="text-2xl font-black">{profile?.full_name || "Sin nombre"}</h2>
              )}
              <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest mt-1 ${
                profile?.rol === 'administrador' ? 'bg-purple-100 text-purple-600' : 'bg-blue-100 text-blue-600'
              }`}>
                <ShieldCheck size={12} /> {profile?.rol || 'reclutador'}
              </span>
            </div>
          </div>

          <div className="space-y-6 -mt-4">
            <div className="flex items-center gap-4 p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-100 dark:border-slate-800">
              <div className="p-2 bg-white dark:bg-slate-800 rounded-xl shadow-sm text-slate-500">
                <Mail size={20} />
              </div>
              <div className="flex-1">
                <p className="text-[10px] font-bold text-slate-400 uppercase">Correo Electrónico</p>
                <p className="font-semibold">{email}</p>
              </div>
            </div>

            <div className="flex items-center gap-4 p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-100 dark:border-slate-800">
              <div className="p-2 bg-white dark:bg-slate-800 rounded-xl shadow-sm text-slate-500">
                <Building2 size={20} />
              </div>
              <div className="flex-1">
                <p className="text-[10px] font-bold text-slate-400 uppercase">Empresa / Organización</p>
                {isEditing ? (
                  <input 
                    value={editData.empresa}
                    onChange={(e) => setEditData({...editData, empresa: e.target.value})}
                    className="w-full bg-transparent border-b border-emerald-500 outline-none font-semibold"
                    placeholder="Nombre de empresa..."
                  />
                ) : (
                  <p className="font-semibold">{profile?.empresa || "No especificada"}</p>
                )}
              </div>
            </div>
          </div>

          {isEditing ? (
            <button 
              onClick={handleSave}
              className="w-full mt-8 py-4 flex items-center justify-center gap-2 bg-emerald-600 text-white font-bold rounded-2xl hover:bg-emerald-700 transition-all shadow-lg"
            >
              <Save size={20} /> Guardar Cambios
            </button>
          ) : (
            <button 
              onClick={handleLogout}
              className="w-full mt-8 py-4 flex items-center justify-center gap-2 bg-red-50 text-red-600 font-bold rounded-2xl hover:bg-red-100 transition-all border border-red-100"
            >
              <LogOut size={20} /> Cerrar Sesión
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
