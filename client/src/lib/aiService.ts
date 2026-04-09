// AI Service - Google Gemini Integration
// This service handles all AI-powered course generation using Google's Gemini API

const GEMINI_API_KEY = 'AIzaSyDpBV1C7AJqB7BcE8vtAa-3Gd6hhpoZR9g';
const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent';

interface CourseOverviewParams {
  topic: string;
  level: string;
  modules: number;
  audience: string;
  objectives: string;
}

interface ModuleContentParams {
  courseTitle: string;
  moduleTitle: string;
  lessons: string[];
  level: string;
}

interface ExercisesParams {
  courseTitle: string;
  modules: Array<{ title: string; lessons: string[] }>;
  level: string;
}

interface QuizzesParams {
  courseTitle: string;
  modules: Array<{ title: string; lessons: string[] }>;
  level: string;
}

async function callGeminiAPI(prompt: string, isJSON: boolean = false): Promise<string> {
  try {
    const response = await fetch(`${GEMINI_API_URL}?key=${GEMINI_API_KEY}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              {
                text: prompt,
              },
            ],
          },
        ],
        generationConfig: {
          temperature: 0.7,
          topK: 40,
          topP: 0.95,
          maxOutputTokens: 8192,
          responseMimeType: isJSON ? "application/json" : "text/plain",
        },
        safetySettings: [
          {
            category: 'HARM_CATEGORY_HARASSMENT',
            threshold: 'BLOCK_NONE',
          },
          {
            category: 'HARM_CATEGORY_HATE_SPEECH',
            threshold: 'BLOCK_NONE',
          },
          {
            category: 'HARM_CATEGORY_SEXUALLY_EXPLICIT',
            threshold: 'BLOCK_NONE',
          },
          {
            category: 'HARM_CATEGORY_DANGEROUS_CONTENT',
            threshold: 'BLOCK_NONE',
          },
        ],
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`API Error: ${errorData.error?.message || response.statusText}`);
    }

    const data = await response.json();
    const content = data.candidates?.[0]?.content?.parts?.[0]?.text || '';

    if (!content) {
      throw new Error('No content received from API');
    }

    return content;
  } catch (error) {
    console.error('Gemini API Error:', error);
    throw error;
  }
}

export async function generateCourseOverview(
  params: CourseOverviewParams
): Promise<{
  title: string;
  description: string;
  level: string;
  targetAudience: string;
  objectives: string;
  estimatedDuration: string;
  prerequisites: string;
  modules: Array<{ title: string; lessons: string[] }>;
}> {
  const prompt = `Genera una vista general completa para un curso sobre "${params.topic}".

Detalles del curso:
- Nivel: ${params.level}
- Número de módulos: ${params.modules}
- Audiencia objetivo: ${params.audience}
- Objetivos de aprendizaje: ${params.objectives}

Proporciona:
1. Un título atractivo para el curso
2. Una descripción detallada
3. Lista de módulos con sus respectivas lecciones
4. Duración estimada
5. Prerrequisitos (si aplican)

Responde ÚNICAMENTE en formato JSON con la siguiente estructura:
{
  "title": "string",
  "description": "string",
  "level": "string",
  "targetAudience": "string",
  "objectives": "string",
  "estimatedDuration": "string",
  "prerequisites": "string",
  "modules": [
    {
      "title": "string",
      "lessons": ["string", "string"]
    }
  ]
}`;

  try {
    const content = await callGeminiAPI(prompt, true);
    return JSON.parse(content);
  } catch (error) {
    console.error('Error generating course overview:', error);
    throw new Error('Error al generar la vista general del curso');
  }
}

export async function generateModuleContent(
  params: ModuleContentParams
): Promise<string> {
  const prompt = `Genera contenido detallado para el módulo "${params.moduleTitle}" del curso "${params.courseTitle}".

Nivel del curso: ${params.level}
Lecciones a cubrir: ${params.lessons.join(', ')}

Para cada lección, proporciona:
- Explicación teórica clara y completa
- Ejemplos prácticos
- Código de ejemplo cuando sea relevante
- Puntos clave a recordar

El contenido debe ser educativo, bien estructurado y apropiado para el nivel ${params.level}. Usa markdown para dar formato al contenido.`;

  try {
    return await callGeminiAPI(prompt);
  } catch (error) {
    console.error('Error generating module content:', error);
    throw new Error('Error al generar el contenido del módulo');
  }
}

export async function generateExercises(params: ExercisesParams): Promise<string> {
  const modulesList = params.modules.map((m) => m.title).join(', ');
  const prompt = `Genera ejercicios prácticos para el curso "${params.courseTitle}".

Módulos del curso: ${modulesList}
Nivel: ${params.level}

Crea 3-5 ejercicios que:
- Refuercen los conceptos aprendidos
- Sean apropiados para el nivel ${params.level}
- Incluyan instrucciones paso a paso
- Tengan objetivos de aprendizaje claros
- Progresionen en dificultad

Cada ejercicio debe incluir:
- Título descriptivo
- Descripción del objetivo
- Pasos detallados a seguir
- Criterios de evaluación (opcional)

Usa markdown para dar formato al contenido.`;

  try {
    return await callGeminiAPI(prompt);
  } catch (error) {
    console.error('Error generating exercises:', error);
    throw new Error('Error al generar los ejercicios');
  }
}

export async function generateQuizzes(
  params: QuizzesParams
): Promise<
  Array<{
    title: string;
    description: string;
    difficulty: number;
    estimatedTime: string;
    questions: Array<{
      question: string;
      options: string[];
      correct: number;
      explanation: string;
    }>;
  }>
> {
  const modulesList = params.modules.map((m) => m.title).join(', ');
  const prompt = `Genera cuestionarios interactivos gamificados para el curso "${params.courseTitle}".

Módulos del curso: ${modulesList}
Nivel: ${params.level}

Crea 2-3 cuestionarios diferentes con las siguientes características:
- Cada quiz debe tener 5-8 preguntas
- Preguntas de opción múltiple (4 opciones cada una)
- Diferentes niveles de dificultad
- Explicaciones para las respuestas correctas
- Tiempo estimado de completación
- Temas variados cubriendo todos los módulos

Responde ÚNICAMENTE en formato JSON con la siguiente estructura:
[
  {
    "title": "string",
    "description": "string",
    "difficulty": number (1-5),
    "estimatedTime": "string",
    "questions": [
      {
        "question": "string",
        "options": ["string", "string", "string", "string"],
        "correct": number (0-3),
        "explanation": "string"
      }
    ]
  }
]`;

  try {
    const content = await callGeminiAPI(prompt, true);
    return JSON.parse(content);
  } catch (error) {
    console.error('Error generating quizzes:', error);
    throw new Error('Error al generar los cuestionarios');
  }
}
