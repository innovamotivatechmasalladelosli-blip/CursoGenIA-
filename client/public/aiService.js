import config from './config.js';

export class AIService {
    constructor() {
        // Using websim.chat.completions for real AI generation
    }
    
    async generateCourseOverview({ topic, level, modules, audience, objectives }) {
        const prompt = `Genera una vista general completa para un curso sobre "${topic}".
        
Detalles del curso:
- Nivel: ${level}
- Número de módulos: ${modules}
- Audiencia objetivo: ${audience}
- Objetivos de aprendizaje: ${objectives}

Proporciona:
1. Un título atractivo para el curso
2. Una descripción detallada
3. Lista de módulos con sus respectivas lecciones
4. Duración estimada
5. Prerrequisitos (si aplican)

Responde en formato JSON con la siguiente estructura:
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
      "lessons": ["string", "string", ...]
    }
  ]
}`;

        try {
            const completion = await websim.chat.completions.create({
                messages: [
                    {
                        role: "system",
                        content: "Eres un experto en diseño curricular. Genera contenido educativo estructurado y de alta calidad. Responde únicamente con JSON válido, sin texto adicional."
                    },
                    { role: "user", content: prompt }
                ],
                json: true
            });
            
            return JSON.parse(completion.content);
        } catch (error) {
            console.error("Error generating course overview:", error);
            throw new Error("Error al generar la vista general del curso");
        }
    }
    
    async generateModuleContent({ courseTitle, moduleTitle, lessons, level }) {
        const prompt = `Genera contenido detallado para el módulo "${moduleTitle}" del curso "${courseTitle}".

Nivel del curso: ${level}
Lecciones a cubrir: ${lessons.join(', ')}

Para cada lección, proporciona:
- Explicación teórica clara y completa
- Ejemplos prácticos
- Código de ejemplo cuando sea relevante
- Puntos clave a recordar

El contenido debe ser educativo, bien estructurado y apropiado para el nivel ${level}.`;

        try {
            const completion = await websim.chat.completions.create({
                messages: [
                    {
                        role: "system",
                        content: "Eres un instructor experto que crea contenido educativo detallado. Utiliza markdown para dar formato al contenido. Incluye ejemplos prácticos y explicaciones claras."
                    },
                    { role: "user", content: prompt }
                ]
            });
            
            return completion.content;
        } catch (error) {
            console.error("Error generating module content:", error);
            throw new Error("Error al generar el contenido del módulo");
        }
    }
    
    async generateExercises({ courseTitle, modules, level }) {
        const modulesList = modules.map(m => m.title).join(', ');
        const prompt = `Genera ejercicios prácticos para el curso "${courseTitle}".

Módulos del curso: ${modulesList}
Nivel: ${level}

Crea 3-5 ejercicios que:
- Refuercen los conceptos aprendidos
- Sean apropiados para el nivel ${level}
- Incluyan instrucciones paso a paso
- Tengan objetivos de aprendizaje claros
- Progresionen en dificultad

Cada ejercicio debe incluir:
- Título descriptivo
- Descripción del objetivo
- Pasos detallados a seguir
- Criterios de evaluación (opcional)`;

        try {
            const completion = await websim.chat.completions.create({
                messages: [
                    {
                        role: "system",
                        content: "Eres un diseñador de actividades educativas. Crea ejercicios prácticos que refuercen el aprendizaje y sean engaging para los estudiantes."
                    },
                    { role: "user", content: prompt }
                ]
            });
            
            return completion.content;
        } catch (error) {
            console.error("Error generating exercises:", error);
            throw new Error("Error al generar los ejercicios");
        }
    }
    
    async generateQuizzes({ courseTitle, modules, level }) {
        const modulesList = modules.map(m => m.title).join(', ');
        const prompt = `Genera cuestionarios interactivos gamificados para el curso "${courseTitle}".

Módulos del curso: ${modulesList}
Nivel: ${level}

Crea 2-3 cuestionarios diferentes con las siguientes características:
- Cada quiz debe tener 5-8 preguntas
- Preguntas de opción múltiple (4 opciones cada una)
- Diferentes niveles de dificultad
- Explicaciones para las respuestas correctas
- Tiempo estimado de completación
- Temas variados cubriendo todos los módulos

Responde en formato JSON con la siguiente estructura:
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
            const completion = await websim.chat.completions.create({
                messages: [
                    {
                        role: "system", 
                        content: "Eres un experto en gamificación educativa. Crea cuestionarios interactivos y atractivos que motiven a los estudiantes. Responde únicamente con JSON válido."
                    },
                    { role: "user", content: prompt }
                ],
                json: true
            });
            
            return JSON.parse(completion.content);
        } catch (error) {
            console.error("Error generating quizzes:", error);
            throw new Error("Error al generar los cuestionarios");
        }
    }
}