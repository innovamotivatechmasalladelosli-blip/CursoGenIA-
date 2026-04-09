/* @tweakable prompt template for course generation */
const promptTemplate = `Genera contenido detallado para un curso sobre "{courseTitle}".
 
Descripción del curso: {coursePrompt}
 
Esta es la página {pageNumber} de {totalPages} páginas totales del curso.
 
Por favor, proporciona contenido estructurado y educativo que incluya:
- Conceptos clave
- Explicaciones detalladas
- Ejemplos prácticos
- Ejercicios cuando sea apropiado
 
El contenido debe ser coherente y progresivo, adaptado al nivel y objetivos del curso.`;

export default {
    promptTemplate,
    /* @tweakable maximum number of pages per course */
    maxPages: 10,
    /* @tweakable minimum number of pages per course */
    minPages: 3,
    /* @tweakable maximum questions per quiz */
    maxQuestionsPerQuiz: 8,
    /* @tweakable minimum questions per quiz */
    minQuestionsPerQuiz: 5,
    /* @tweakable default quiz difficulty (1-5) */
    defaultQuizDifficulty: 3,
    /* @tweakable quiz time limit in minutes */
    defaultQuizTimeLimit: 10
};