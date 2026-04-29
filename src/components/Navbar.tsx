"use client";

import Link from 'next/link';
import { Briefcase, UserPlus, Home, BarChart3, LogIn, LogOut, User, ArrowRightLeft, Award, Calendar } from 'lucide-react';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';

export default function Navbar() {
  const [user, setUser] = useState<any>(null);
  const router = useRouter();

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/login');
  };

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 glass md:top-0 md:bottom-auto border-t md:border-b md:border-t-0 p-4">
      <div className="max-w-4xl mx-auto flex justify-around items-center">
        <Link href="/dashboard" className="flex flex-col items-center gap-1 text-slate-500 hover:text-accent transition-colors">
          <Home size={20} />
          <span className="text-xs font-medium">Inicio</span>
        </Link>
        <Link href="/jobs/new" className="flex flex-col items-center gap-1 text-slate-500 hover:text-accent transition-colors">
          <Briefcase size={20} />
          <span className="text-xs font-medium">Ofertas</span>
        </Link>
        <Link href="/candidates/new" className="flex flex-col items-center gap-1 text-slate-500 hover:text-accent transition-colors">
          <UserPlus size={20} />
          <span className="text-xs font-medium">Evaluar</span>
        </Link>
        <Link href="/pipeline" className="flex flex-col items-center gap-1 text-slate-500 hover:text-accent transition-colors">
          <ArrowRightLeft size={20} />
          <span className="text-xs font-medium">Pipeline</span>
        </Link>
        <Link href="/talent" className="flex flex-col items-center gap-1 text-slate-500 hover:text-accent transition-colors">
          <Award size={20} />
          <span className="text-xs font-medium">Talentos</span>
        </Link>
        <Link href="/agenda" className="flex flex-col items-center gap-1 text-slate-500 hover:text-accent transition-colors">
          <Calendar size={20} />
          <span className="text-xs font-medium">Agenda</span>
        </Link>
        <Link href="/ranking" className="flex flex-col items-center gap-1 text-slate-500 hover:text-accent transition-colors">
          <BarChart3 size={20} />
          <span className="text-xs font-medium">Selección</span>
        </Link>
        {user ? (
          <Link href="/profile" className="flex flex-col items-center gap-1 text-slate-500 hover:text-accent transition-colors">
            <User size={20} />
            <span className="text-xs font-medium">Perfil</span>
          </Link>
        ) : (
          <Link href="/login" className="flex flex-col items-center gap-1 text-slate-500 hover:text-accent transition-colors">
            <LogIn size={20} />
            <span className="text-xs font-medium">Entrar</span>
          </Link>
        )}
      </div>
    </nav>
  );
}
