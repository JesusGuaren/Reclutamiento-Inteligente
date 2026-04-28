-- ACTUALIZACIÓN PARA FASE A: AUTH Y ROLES

-- 1. Crear tabla de perfiles para manejar roles
CREATE TABLE profiles (
  id UUID REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
  full_name TEXT,
  rol TEXT DEFAULT 'reclutador' CHECK (rol IN ('reclutador', 'administrador')),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Modificar tabla de ofertas (jobs)
ALTER TABLE jobs ADD COLUMN user_id UUID REFERENCES auth.users(id) DEFAULT auth.uid();
ALTER TABLE jobs ADD COLUMN descripcion TEXT;
ALTER TABLE jobs ADD COLUMN nivel TEXT CHECK (nivel IN ('Junior', 'Semi-Senior', 'Senior')) DEFAULT 'Junior';
ALTER TABLE jobs ADD COLUMN estado TEXT CHECK (estado IN ('activa', 'pausada', 'cerrada')) DEFAULT 'activa';

-- 3. Modificar tabla de candidatos
ALTER TABLE candidates ADD COLUMN user_id UUID REFERENCES auth.users(id) DEFAULT auth.uid();

-- 4. Actualizar Políticas RLS (Seguridad por usuario)
-- Borramos las anteriores que permitían todo a todos
DROP POLICY "Permitir todo a todos" ON jobs;
DROP POLICY "Permitir todo a todos" ON candidates;
DROP POLICY "Permitir todo a todos" ON applications;

-- Nuevas políticas: Solo puedes ver/editar lo que tú creaste
CREATE POLICY "Usuarios ven sus propios jobs" ON jobs FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Usuarios ven sus propios candidatos" ON candidates FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Usuarios ven sus propias aplicaciones" ON applications FOR ALL 
  USING (EXISTS (SELECT 1 FROM jobs WHERE jobs.id = applications.job_id AND jobs.user_id = auth.uid()));

-- Trigger para crear perfil automáticamente al registrarse
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, rol)
  VALUES (new.id, new.raw_user_meta_data->>'full_name', 'reclutador');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();
