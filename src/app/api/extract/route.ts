import { NextRequest, NextResponse } from 'next/server';
import { extractText } from 'unpdf';

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json({ error: 'No se subió ningún archivo' }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const uint8Array = new Uint8Array(bytes);

    // Extraer texto usando unpdf
    const result = await extractText(uint8Array);
    
    // Unpdf puede devolver el texto directamente o en un objeto { text: string }
    const rawText = typeof result === 'string' ? result : (result && typeof result === 'object' && 'text' in result ? (result as any).text : "");
    
    const text = String(rawText || "");
    
    if (!text || text.trim().length === 0) {
      throw new Error("El PDF parece estar vacío o no contiene texto legible.");
    }

    // Lógica de Estructuración
    const structured = {
      nombre: file.name.replace('.pdf', ''),
      experience: 0,
      skills: [] as string[],
      education: [] as string[],
      extras: [] as string[]
    };

    // 1. Educación (Más flexible)
    const eduText = text.toLowerCase();
    if (eduText.includes('universit') || eduText.includes('ingenier') || eduText.includes('licenciatura') || eduText.includes('grado') || eduText.includes('magister') || eduText.includes('doctorado')) {
      structured.education.push('Universitario');
    } else if (eduText.includes('técnico') || eduText.includes('tecnico') || eduText.includes('profesional') || eduText.includes('diplomado')) {
      structured.education.push('Técnico');
    }

    // 2. Experiencia (Búsqueda de años o rangos de fechas)
    const expMatch = text.match(/(\d+)\s*(años|years|experiencia|primavera|verano)/i);
    const dateRangeMatch = text.match(/(19|20)\d{2}\s*[-–]\s*(20\d{2}|actualidad|presente)/gi);
    
    if (expMatch) {
      structured.experience = parseInt(expMatch[1]);
    } else if (dateRangeMatch) {
      // Si hay rangos de fechas, estimamos al menos 1 año por cada rango encontrado
      structured.experience = dateRangeMatch.length;
    } else if (eduText.includes('senior') || eduText.includes('especialista')) {
      structured.experience = 5; // Estimación base para perfiles senior
    }

    // 3. Habilidades (Diccionario masivo)
    const skillsDict = [
      'React', 'Node.js', 'Python', 'SQL', 'TypeScript', 'JavaScript', 
      'AWS', 'Docker', 'Java', 'Spring', 'Angular', 'Vue', 'PHP', 'Laravel', 
      'C#', '.NET', 'Flutter', 'Swift', 'Kotlin', 'Go', 'Kubernetes', 'Tailwind', 'Git',
      'Backend', 'Frontend', 'Fullstack', 'Cloud', 'Azure', 'GCP', 'NoSQL', 'MongoDB',
      'PostgreSQL', 'MySQL', 'Redis', 'Docker', 'Jenkins', 'CI/CD', 'API', 'REST',
      'GraphQL', 'Scrum', 'Agile', 'Jira', 'Linux', 'Bases de datos', 'Arquitectura'
    ];
    
    structured.skills = skillsDict.filter(skill => 
      text.toLowerCase().includes(skill.toLowerCase())
    );

    return NextResponse.json({ structured });
  } catch (error: any) {
    console.error('Error en extracción:', error);
    return NextResponse.json({ error: error.message || 'Error al procesar el CV' }, { status: 500 });
  }
}
