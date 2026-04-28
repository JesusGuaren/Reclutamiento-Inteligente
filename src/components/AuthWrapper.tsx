"use client";

import { useEffect, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import Navbar from '@/components/Navbar';

export default function AuthWrapper({ children }: { children: React.ReactNode }) {
  const [loading, setLoading] = useState(true);
  const [session, setSession] = useState<any>(null);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    // 1. Chequeo inicial
    const checkAuth = async () => {
      const { data: { session: initialSession } } = await supabase.auth.getSession();
      setSession(initialSession);
      
      const isPublicRoute = pathname === '/' || pathname === '/login';
      if (!initialSession && !isPublicRoute) {
        router.push('/');
      } else if (initialSession && isPublicRoute) {
        router.push('/dashboard');
      }
      setLoading(false);
    };

    checkAuth();

    // 2. Suscribirse a cambios
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, newSession) => {
      setSession(newSession);
      if (event === 'SIGNED_OUT') {
        router.push('/login');
      } else if (event === 'SIGNED_IN' && pathname === '/login') {
        router.push('/');
      }
    });

    return () => subscription.unsubscribe();
  }, [pathname, router]);

  const isAuthPage = pathname === '/login';

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-slate-50 dark:bg-slate-950">
        <div className="w-10 h-10 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <>
      {!isAuthPage && <Navbar />}
      <main className={!isAuthPage ? 'max-w-4xl mx-auto px-4 py-8 pb-32 md:pb-12 md:pt-24' : ''}>
        {children}
      </main>
    </>
  );
}
