-- Esquema de Base de Datos para Sistema de Reclutamiento AI

-- Tabla de Ofertas Laborales
CREATE TABLE jobs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  titulo TEXT NOT NULL,
  habilidades_requeridas TEXT[] NOT NULL,
  experiencia_min INTEGER NOT NULL,
  educacion_min TEXT NOT NULL, -- 'Universitario', 'Técnico', 'Ninguno'
  pesos JSONB DEFAULT '{"habilidades": 0.4, "experiencia": 0.3, "educacion": 0.2, "extras": 0.1}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabla de Candidatos
CREATE TABLE candidates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nombre TEXT NOT NULL,
  habilidades TEXT[] NOT NULL,
  experiencia INTEGER NOT NULL, -- Años
  educacion TEXT NOT NULL,
  cv_texto TEXT, -- Resumen del CV para trazabilidad
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabla de Aplicaciones / Evaluaciones
CREATE TABLE applications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  job_id UUID REFERENCES jobs(id) ON DELETE CASCADE,
  candidate_id UUID REFERENCES candidates(id) ON DELETE CASCADE,
  score FLOAT NOT NULL,
  detalle_score JSONB NOT NULL, -- { habilidades: X, experiencia: Y, educacion: Z, extras: W }
  justificacion TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Habilitar RLS (Seguridad)
ALTER TABLE jobs ENABLE ROW LEVEL SECURITY;
ALTER TABLE candidates ENABLE ROW LEVEL SECURITY;
ALTER TABLE applications ENABLE ROW LEVEL SECURITY;

-- Políticas simples (Lectura y escritura para todos en esta fase de desarrollo)
CREATE POLICY "Permitir todo a todos" ON jobs FOR ALL USING (true);
CREATE POLICY "Permitir todo a todos" ON candidates FOR ALL USING (true);
CREATE POLICY "Permitir todo a todos" ON applications FOR ALL USING (true);
