import { NextRequest, NextResponse } from 'next/server';
import pdf from 'pdf-parse/lib/pdf-parse.js'; // Usamos el entry point directo para evitar problemas de resolución

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json({ error: 'No se subió ningún archivo' }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Extraer texto con opciones para evitar errores de fuentes
    const data = await pdf(buffer).catch((err: any) => {
      throw new Error("Fallo al parsear el PDF: " + err.message);
    });
    
    const text = data.text;

    // Lógica de Estructuración
    const structured = {
      education: [] as string[],
      experience: 0,
      skills: [] as string[],
      extras: [] as string[]
    };

    // 1. Educación
    if (text.toLowerCase().includes('universit') || text.toLowerCase().includes('ingenier') || text.toLowerCase().includes('bachiller')) {
      structured.education.push('Universitario');
    } else if (text.toLowerCase().includes('técnico') || text.toLowerCase().includes('tecnico')) {
      structured.education.push('Técnico');
    }

    // 2. Experiencia
    const expMatch = text.match(/(\d+)\s*(años|years|experiencia)/i);
    if (expMatch) {
      structured.experience = parseInt(expMatch[1]);
    }

    // 3. Habilidades
    const skillsDict = [
      'React', 'Node.js', 'Python', 'SQL', 'TypeScript', 'JavaScript', 
      'AWS', 'Docker', 'Java', 'Spring', 'Angular', 'Vue', 'PHP', 'Laravel', 
      'C#', '.NET', 'Flutter', 'Swift', 'Kotlin', 'Go', 'Kubernetes', 'Tailwind', 'Git'
    ];
    
    structured.skills = skillsDict.filter(skill => 
      text.toLowerCase().includes(skill.toLowerCase())
    );

    return NextResponse.json({ structured });

  } catch (error: any) {
    console.error('❌ Error en el Pipeline de PDF:', error);
    return NextResponse.json({ error: error.message || 'Error interno del servidor' }, { status: 500 });
  }
}
