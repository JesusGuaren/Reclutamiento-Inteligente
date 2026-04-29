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
  fortalezas: string[];
  debilidades: string[];
}

const EDUCACION_SCORES: Record<string, number> = {
  'Universitario': 100,
  'Técnico': 70,
  'Ninguno': 40,
};

export function evaluateCandidate(job: Job, candidate: Candidate): EvaluationResult {
  const fortalezas: string[] = [];
  const debilidades: string[] = [];

  // 1. Habilidades (Skill Match)
  const matchingSkills = candidate.habilidades.filter(skill => 
    job.habilidades_requeridas.some(req => req.toLowerCase() === skill.toLowerCase())
  );
  
  const missingSkills = job.habilidades_requeridas.filter(req =>
    !candidate.habilidades.some(skill => skill.toLowerCase() === req.toLowerCase())
  );

  const totalSkills = job.habilidades_requeridas.length || 1; // Evitar división por cero
  const skill_score = (matchingSkills.length / totalSkills) * 100;

  if (skill_score >= 70) {
    fortalezas.push(`Sólido dominio técnico (${Math.round(skill_score)}% de habilidades clave)`);
  } else if (skill_score < 40) {
    debilidades.push(`Brecha técnica significativa en: ${missingSkills.slice(0, 2).join(", ")}`);
  } else {
    debilidades.push(`Falta profundizar en algunas habilidades requeridas.`);
  }

  // 2. Experiencia (Lógica estricta)
  let experience_score = 0;
  if (job.experiencia_min > 0) {
    experience_score = Math.min(candidate.experiencia / job.experiencia_min, 1) * 100;
  } else {
    // Si el puesto pide 0 años, cualquier experiencia es un 100% de cumplimiento
    experience_score = 100;
  }

  // Si el candidato NO tiene experiencia, la barra DEBE ser 0, a menos que el puesto pida 0.
  if (candidate.experiencia === 0 && job.experiencia_min > 0) {
    experience_score = 0;
  }

  if (candidate.experiencia >= job.experiencia_min && job.experiencia_min > 0) {
    fortalezas.push(`Trayectoria adecuada con ${candidate.experiencia} años de experiencia`);
  } else if (candidate.experiencia === 0 && job.experiencia_min === 0) {
    fortalezas.push(`Perfil ideal para nivel inicial (Sin experiencia requerida)`);
  } else if (candidate.experiencia > 0) {
    fortalezas.push(`Cuenta con ${candidate.experiencia} años de experiencia previa`);
  } else {
    debilidades.push(`Perfil sin experiencia previa comprobable en el área.`);
  }

  // 3. Educación
  const education_score = EDUCACION_SCORES[candidate.educacion] || 40;
  const min_edu_score = EDUCACION_SCORES[job.educacion_min] || 40;

  if (education_score >= min_edu_score) {
    fortalezas.push(`Formación académica alineada: ${candidate.educacion}`);
  } else {
    debilidades.push(`Nivel académico (${candidate.educacion}) por debajo de la preferencia (${job.educacion_min})`);
  }

  // 4. Extras
  const extraSkills = candidate.habilidades.length - matchingSkills.length;
  const extras_score = Math.min(extraSkills * 20, 100);
  if (extraSkills > 0) {
    fortalezas.push(`Aporta ${extraSkills} habilidades complementarias valiosas`);
  }

  // Score Final Ponderado con fallbacks de seguridad
  const pesos = job.pesos || { habilidades: 0.4, experiencia: 0.3, educacion: 0.2, extras: 0.1 };
  const total = 
    (skill_score * (pesos.habilidades || 0.4)) +
    (experience_score * (pesos.experiencia || 0.3)) +
    (education_score * (pesos.educacion || 0.2)) +
    (extras_score * (pesos.extras || 0.1));

  // Generar Justificación
  let justificacion = "";
  if (total >= 75) {
    justificacion = `Perfil altamente compatible con la cultura y necesidades técnicas.`;
  } else if (total >= 50) {
    justificacion = `Candidato con potencial. Requiere capacitación en puntos específicos.`;
  } else {
    justificacion = `Afinidad baja. Se recomienda buscar perfiles con mayor especialización.`;
  }

  return {
    score_total: Math.round(total),
    detalle: {
      habilidades: Math.round(skill_score),
      experiencia: Math.round(experience_score),
      educacion: Math.round(education_score),
      extras: Math.round(extras_score),
    },
    justificacion,
    fortalezas,
    debilidades
  };
}
