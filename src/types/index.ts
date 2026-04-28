export interface Job {
  id: string;
  user_id?: string;
  titulo: string;
  descripcion?: string;
  habilidades_requeridas: string[];
  experiencia_min: number;
  educacion_min: 'Universitario' | 'Técnico' | 'Ninguno';
  nivel: 'Junior' | 'Semi-Senior' | 'Senior';
  estado: 'activa' | 'pausada' | 'cerrada';
  pesos: {
    habilidades: number;
    experiencia: number;
    educacion: number;
    extras: number;
  };
  created_at?: string;
}

export interface Candidate {
  id: string;
  user_id?: string;
  nombre: string;
  habilidades: string[];
  experiencia: number;
  educacion: 'Universitario' | 'Técnico' | 'Ninguno';
  cv_texto?: string;
  created_at?: string;
}

export interface Application {
  id: string;
  job_id: string;
  candidate_id: string;
  score: number;
  detalle_score: {
    habilidades: number;
    experiencia: number;
    educacion: number;
    extras: number;
  };
  justificacion: string;
  candidate?: Candidate;
  job?: Job;
  created_at?: string;
}

export interface Profile {
  id: string;
  full_name: string;
  empresa?: string;
  rol: 'reclutador' | 'administrador';
  updated_at?: string;
}
