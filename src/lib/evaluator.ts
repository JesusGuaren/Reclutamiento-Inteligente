/**
 * Motor de Evaluación de Candidatos (TesIS-AI)
 * Implementa la lógica de negocio requerida para la tesis universitaria.
 */

export interface Job {
  id: string;
  titulo: string;
  habilidades_requeridas: string[];
  experiencia_min: number;
  educacion_min: string;
  pesos: {
    habilidades: number;
    experiencia: number;
    educacion: number;
    extras: number;
  };
}

export interface Candidate {
  id: string;
  nombre: string;
  habilidades: string[];
  experiencia: number;
  educacion: string;
}

export interface EvaluationResult {
  score_total: number;
  detalle: {
    habilidades: number;
    experiencia: number;
    educacion: number;
    extras: number;
  };
  justificacion: string;
}

const EDUCACION_SCORES: Record<string, number> = {
  'Universitario': 100,
  'Técnico': 70,
  'Ninguno': 40,
};

export function evaluateCandidate(job: Job, candidate: Candidate): EvaluationResult {
  // 1. Habilidades (Skill Match)
  const matchingSkills = candidate.habilidades.filter(skill => 
    job.habilidades_requeridas.some(req => req.toLowerCase() === skill.toLowerCase())
  );
  const skill_score = (matchingSkills.length / job.habilidades_requeridas.length) * 100;

  // 2. Experiencia
  const experience_score = Math.min(candidate.experiencia / job.experiencia_min, 1) * 100;

  // 3. Educación
  const education_score = EDUCACION_SCORES[candidate.educacion] || 40;

  // 4. Extras (Simulado basado en habilidades adicionales no requeridas)
  const extraSkills = candidate.habilidades.length - matchingSkills.length;
  const extras_score = Math.min(extraSkills * 20, 100);

  // Score Final Ponderado
  const total = 
    (skill_score * job.pesos.habilidades) +
    (experience_score * job.pesos.experiencia) +
    (education_score * job.pesos.educacion) +
    (extras_score * job.pesos.extras);

  // Generar Justificación
  let justificacion = "";
  if (total >= 80) {
    justificacion = `Candidato excepcional. Posee el ${Math.round(skill_score)}% de las habilidades requeridas y supera los requisitos de experiencia.`;
  } else if (total >= 60) {
    justificacion = `Cumple con la mayoría de los requisitos fundamentales, aunque podría mejorar en áreas específicas.`;
  } else {
    justificacion = `El candidato no cumple con el perfil mínimo requerido para esta posición.`;
  }

  return {
    score_total: Math.round(total),
    detalle: {
      habilidades: Math.round(skill_score),
      experiencia: Math.round(experience_score),
      educacion: Math.round(education_score),
      extras: Math.round(extras_score),
    },
    justificacion
  };
}
