import { Job, Candidate, evaluateCandidate } from './evaluator';

export const TEST_JOB: Job = {
  id: 'job-1',
  titulo: 'Ingeniero de Software Senior',
  habilidades_requeridas: ['React', 'Node.js', 'PostgreSQL', 'TypeScript'],
  experiencia_min: 5,
  educacion_min: 'Universitario',
  pesos: {
    habilidades: 0.4,
    experiencia: 0.3,
    educacion: 0.2,
    extras: 0.1
  }
};

export const TEST_CASES: Candidate[] = [
  {
    id: 'c-1',
    nombre: 'Candidato Perfecto',
    habilidades: ['React', 'Node.js', 'PostgreSQL', 'TypeScript', 'AWS', 'Docker'],
    experiencia: 8,
    educacion: 'Universitario'
  },
  {
    id: 'c-2',
    nombre: 'Candidato Parcial',
    habilidades: ['React', 'JavaScript'],
    experiencia: 3,
    educacion: 'Técnico'
  },
  {
    id: 'c-3',
    nombre: 'Sin Experiencia',
    habilidades: ['Python', 'SQL'],
    experiencia: 0,
    educacion: 'Ninguno'
  },
  {
    id: 'c-4',
    nombre: 'Sobrecalificado',
    habilidades: ['React', 'Node.js', 'PostgreSQL', 'TypeScript', 'Python', 'Go', 'Kubernetes'],
    experiencia: 15,
    educacion: 'Universitario'
  }
];

export function runTests() {
  return TEST_CASES.map(candidate => ({
    candidate,
    result: evaluateCandidate(TEST_JOB, candidate)
  }));
}
