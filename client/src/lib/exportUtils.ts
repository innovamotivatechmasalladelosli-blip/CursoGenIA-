// Export Utilities for Course Content
// Handles PDF, Markdown, and Quiz exports

interface CourseData {
  overview: {
    title: string;
    description: string;
    level: string;
    targetAudience: string;
    objectives: string;
    estimatedDuration: string;
    prerequisites?: string;
    modules: Array<{ title: string; lessons: string[] }>;
  };
  content: {
    modules: Array<{
      title: string;
      lessons: string[];
      content: string;
    }>;
  };
  exercises: string;
  quizzes: Array<{
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
  }>;
}

/**
 * Export course content as Markdown
 */
export function exportAsMarkdown(courseData: CourseData): string {
  let markdown = '';

  // Header
  markdown += `# ${courseData.overview.title}\n\n`;
  markdown += `**Nivel:** ${courseData.overview.level}\n\n`;
  markdown += `**Audiencia Objetivo:** ${courseData.overview.targetAudience}\n\n`;
  markdown += `**Duración Estimada:** ${courseData.overview.estimatedDuration}\n\n`;

  if (courseData.overview.prerequisites) {
    markdown += `**Prerrequisitos:** ${courseData.overview.prerequisites}\n\n`;
  }

  // Description
  markdown += `## Descripción\n\n${courseData.overview.description}\n\n`;

  // Objectives
  markdown += `## Objetivos de Aprendizaje\n\n${courseData.overview.objectives}\n\n`;

  // Course Structure
  markdown += `## Estructura del Curso\n\n`;
  courseData.overview.modules.forEach((module, index) => {
    markdown += `### Módulo ${index + 1}: ${module.title}\n\n`;
    markdown += `**Lecciones:**\n`;
    module.lessons.forEach((lesson) => {
      markdown += `- ${lesson}\n`;
    });
    markdown += '\n';
  });

  // Detailed Content
  markdown += `## Contenido Detallado\n\n`;
  courseData.content.modules.forEach((module) => {
    markdown += `### ${module.title}\n\n${module.content}\n\n`;
  });

  // Exercises
  markdown += `## Ejercicios Prácticos\n\n${courseData.exercises}\n\n`;

  // Quizzes
  markdown += `## Cuestionarios\n\n`;
  courseData.quizzes.forEach((quiz, index) => {
    markdown += `### Quiz ${index + 1}: ${quiz.title}\n\n`;
    markdown += `**Descripción:** ${quiz.description}\n\n`;
    markdown += `**Dificultad:** ${quiz.difficulty}/5\n\n`;
    markdown += `**Tiempo Estimado:** ${quiz.estimatedTime}\n\n`;
    markdown += `**Preguntas:**\n\n`;

    quiz.questions.forEach((question, qIndex) => {
      markdown += `#### Pregunta ${qIndex + 1}\n\n`;
      markdown += `${question.question}\n\n`;
      markdown += `**Opciones:**\n`;
      question.options.forEach((option, oIndex) => {
        const isCorrect = oIndex === question.correct ? ' ✓' : '';
        markdown += `${String.fromCharCode(97 + oIndex)}) ${option}${isCorrect}\n`;
      });
      markdown += `\n**Explicación:** ${question.explanation}\n\n`;
    });
  });

  return markdown;
}

/**
 * Export course content as PDF (using a simple approach with text)
 */
export async function exportAsPDF(courseData: CourseData): Promise<void> {
  try {
    // Create a simple HTML representation for PDF
    const htmlContent = `
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>${courseData.overview.title}</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            line-height: 1.6;
            color: #333;
            margin: 20px;
        }
        h1 { color: #4CAF50; margin-top: 30px; page-break-after: avoid; }
        h2 { color: #2196F3; margin-top: 20px; page-break-after: avoid; }
        h3 { color: #666; margin-top: 15px; page-break-after: avoid; }
        .metadata { background: #f5f5f5; padding: 10px; border-left: 4px solid #4CAF50; margin: 10px 0; }
        .module { page-break-inside: avoid; margin-bottom: 20px; }
        .quiz { page-break-inside: avoid; margin-bottom: 20px; border: 1px solid #ddd; padding: 10px; }
        .question { margin-left: 20px; margin-bottom: 10px; }
        ul { margin-left: 20px; }
        code { background: #f0f0f0; padding: 2px 5px; border-radius: 3px; }
        pre { background: #f0f0f0; padding: 10px; border-radius: 3px; overflow-x: auto; }
    </style>
</head>
<body>
    <h1>${courseData.overview.title}</h1>
    
    <div class="metadata">
        <p><strong>Nivel:</strong> ${courseData.overview.level}</p>
        <p><strong>Audiencia Objetivo:</strong> ${courseData.overview.targetAudience}</p>
        <p><strong>Duración Estimada:</strong> ${courseData.overview.estimatedDuration}</p>
        ${courseData.overview.prerequisites ? `<p><strong>Prerrequisitos:</strong> ${courseData.overview.prerequisites}</p>` : ''}
    </div>

    <h2>Descripción</h2>
    <p>${courseData.overview.description}</p>

    <h2>Objetivos de Aprendizaje</h2>
    <p>${courseData.overview.objectives}</p>

    <h2>Estructura del Curso</h2>
    ${courseData.overview.modules
      .map(
        (module, index) => `
    <div class="module">
        <h3>Módulo ${index + 1}: ${module.title}</h3>
        <p><strong>Lecciones:</strong></p>
        <ul>
            ${module.lessons.map((lesson) => `<li>${lesson}</li>`).join('')}
        </ul>
    </div>
    `
      )
      .join('')}

    <h2>Contenido Detallado</h2>
    ${courseData.content.modules
      .map(
        (module) => `
    <div class="module">
        <h3>${module.title}</h3>
        <div>${module.content}</div>
    </div>
    `
      )
      .join('')}

    <h2>Ejercicios Prácticos</h2>
    <div>${courseData.exercises}</div>

    <h2>Cuestionarios</h2>
    ${courseData.quizzes
      .map(
        (quiz, index) => `
    <div class="quiz">
        <h3>Quiz ${index + 1}: ${quiz.title}</h3>
        <p><strong>Descripción:</strong> ${quiz.description}</p>
        <p><strong>Dificultad:</strong> ${quiz.difficulty}/5</p>
        <p><strong>Tiempo Estimado:</strong> ${quiz.estimatedTime}</p>
        <h4>Preguntas:</h4>
        ${quiz.questions
          .map(
            (question, qIndex) => `
        <div class="question">
            <p><strong>Pregunta ${qIndex + 1}:</strong> ${question.question}</p>
            <ul>
                ${question.options
                  .map(
                    (option, oIndex) => `
                <li>${String.fromCharCode(97 + oIndex)}) ${option}${oIndex === question.correct ? ' ✓' : ''}</li>
                `
                  )
                  .join('')}
            </ul>
            <p><strong>Explicación:</strong> ${question.explanation}</p>
        </div>
        `
          )
          .join('')}
    </div>
    `
      )
      .join('')}

    <p style="margin-top: 40px; text-align: center; color: #999; font-size: 12px;">
        Generado por InnovACurso+ - Generador de Cursos con IA
    </p>
</body>
</html>
    `;

    // Create a blob and download
    const blob = new Blob([htmlContent], { type: 'text/html' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${courseData.overview.title.replace(/\s+/g, '_')}.html`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  } catch (error) {
    console.error('Error exporting PDF:', error);
    throw new Error('Error al exportar el PDF');
  }
}

/**
 * Generate QR code for quiz
 */
export async function generateQRCode(
  quizData: CourseData['quizzes'],
  courseTitle: string
): Promise<string> {
  try {
    // Encode quiz data as base64
    const quizJSON = JSON.stringify({
      title: courseTitle,
      quizzes: quizData,
      generatedAt: new Date().toISOString(),
    });

    const encodedData = btoa(quizJSON);

    // Use QR code API
    const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(encodedData)}`;

    return qrUrl;
  } catch (error) {
    console.error('Error generating QR code:', error);
    throw new Error('Error al generar el código QR');
  }
}

/**
 * Export quiz as interactive HTML
 */
export function exportQuizAsHTML(quizData: CourseData['quizzes'], courseTitle: string): string {
  const quizHTML = `
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Quiz - ${courseTitle}</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        body {
            font-family: 'Poppins', sans-serif;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            min-height: 100vh;
            display: flex;
            justify-content: center;
            align-items: center;
            padding: 20px;
        }
        .container {
            background: white;
            border-radius: 10px;
            box-shadow: 0 10px 40px rgba(0, 0, 0, 0.2);
            max-width: 800px;
            width: 100%;
            padding: 40px;
        }
        .header {
            text-align: center;
            margin-bottom: 30px;
        }
        .header h1 {
            color: #333;
            margin-bottom: 10px;
        }
        .header p {
            color: #666;
            font-size: 14px;
        }
        .quiz-selector {
            margin-bottom: 30px;
        }
        .quiz-selector label {
            display: block;
            margin-bottom: 10px;
            font-weight: 600;
            color: #333;
        }
        .quiz-selector select {
            width: 100%;
            padding: 10px;
            border: 2px solid #ddd;
            border-radius: 5px;
            font-size: 16px;
            cursor: pointer;
        }
        .quiz-content {
            display: none;
        }
        .quiz-content.active {
            display: block;
        }
        .quiz-info {
            background: #f5f5f5;
            padding: 15px;
            border-radius: 5px;
            margin-bottom: 20px;
            display: flex;
            justify-content: space-between;
            flex-wrap: wrap;
        }
        .quiz-info span {
            font-size: 14px;
            color: #666;
            margin-right: 20px;
        }
        .question-block {
            margin-bottom: 30px;
            padding-bottom: 20px;
            border-bottom: 1px solid #eee;
        }
        .question-block:last-child {
            border-bottom: none;
        }
        .question-text {
            font-weight: 600;
            color: #333;
            margin-bottom: 15px;
            font-size: 16px;
        }
        .options {
            margin-left: 20px;
        }
        .option {
            display: flex;
            align-items: center;
            margin-bottom: 10px;
            cursor: pointer;
        }
        .option input[type="radio"] {
            margin-right: 10px;
            cursor: pointer;
        }
        .option label {
            cursor: pointer;
            flex: 1;
        }
        .explanation {
            background: #e8f5e9;
            padding: 10px;
            border-left: 4px solid #4CAF50;
            margin-top: 10px;
            font-size: 14px;
            color: #333;
            display: none;
        }
        .explanation.show {
            display: block;
        }
        .button-group {
            display: flex;
            gap: 10px;
            justify-content: center;
            margin-top: 30px;
        }
        .btn {
            padding: 12px 30px;
            border: none;
            border-radius: 5px;
            font-size: 16px;
            font-weight: 600;
            cursor: pointer;
            transition: all 0.3s ease;
        }
        .btn-primary {
            background: #4CAF50;
            color: white;
        }
        .btn-primary:hover {
            background: #45a049;
        }
        .btn-secondary {
            background: #2196F3;
            color: white;
        }
        .btn-secondary:hover {
            background: #0b7dda;
        }
        .result {
            display: none;
            text-align: center;
            padding: 20px;
            background: #f5f5f5;
            border-radius: 5px;
        }
        .result.show {
            display: block;
        }
        .result h2 {
            color: #333;
            margin-bottom: 10px;
        }
        .result p {
            color: #666;
            font-size: 18px;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>🎯 Quiz - ${courseTitle}</h1>
            <p>Prueba tus conocimientos con estos cuestionarios interactivos</p>
        </div>

        <div class="quiz-selector">
            <label for="quiz-select">Selecciona un Quiz:</label>
            <select id="quiz-select">
                ${quizData
                  .map(
                    (quiz, index) => `
                <option value="${index}">
                    ${quiz.title} (Dificultad: ${quiz.difficulty}/5 - ${quiz.estimatedTime})
                </option>
                `
                  )
                  .join('')}
            </select>
        </div>

        ${quizData
          .map(
            (quiz, quizIndex) => `
        <div class="quiz-content" id="quiz-${quizIndex}">
            <div class="quiz-info">
                <span><strong>Descripción:</strong> ${quiz.description}</span>
                <span><strong>Dificultad:</strong> ${quiz.difficulty}/5</span>
                <span><strong>Tiempo:</strong> ${quiz.estimatedTime}</span>
            </div>

            <form id="quiz-form-${quizIndex}">
                ${quiz.questions
                  .map(
                    (question, qIndex) => `
                <div class="question-block">
                    <div class="question-text">
                        ${qIndex + 1}. ${question.question}
                    </div>
                    <div class="options">
                        ${question.options
                          .map(
                            (option, oIndex) => `
                        <div class="option">
                            <input type="radio" id="q${quizIndex}_${qIndex}_${oIndex}" 
                                   name="question_${qIndex}" value="${oIndex}">
                            <label for="q${quizIndex}_${qIndex}_${oIndex}">${option}</label>
                        </div>
                        `
                          )
                          .join('')}
                    </div>
                    <div class="explanation" id="exp-${quizIndex}-${qIndex}">
                        <strong>Explicación:</strong> ${question.explanation}
                    </div>
                </div>
                `
                  )
                  .join('')}
            </form>

            <div class="button-group">
                <button class="btn btn-primary" onclick="submitQuiz(${quizIndex})">
                    Enviar Respuestas
                </button>
                <button class="btn btn-secondary" onclick="resetQuiz(${quizIndex})">
                    Reiniciar
                </button>
            </div>

            <div class="result" id="result-${quizIndex}">
                <h2 id="result-title-${quizIndex}"></h2>
                <p id="result-score-${quizIndex}"></p>
            </div>
        </div>
        `
          )
          .join('')}
    </div>

    <script>
        const quizData = ${JSON.stringify(quizData)};

        document.getElementById('quiz-select').addEventListener('change', function(e) {
            document.querySelectorAll('.quiz-content').forEach(el => el.classList.remove('active'));
            document.getElementById('quiz-' + e.target.value).classList.add('active');
        });

        document.getElementById('quiz-0').classList.add('active');

        function submitQuiz(quizIndex) {
            const quiz = quizData[quizIndex];
            const form = document.getElementById('quiz-form-' + quizIndex);
            let correct = 0;
            let answered = 0;

            quiz.questions.forEach((question, qIndex) => {
                const selected = form.querySelector('input[name="question_' + qIndex + '"]:checked');
                if (selected) {
                    answered++;
                    const selectedValue = parseInt(selected.value);
                    if (selectedValue === question.correct) {
                        correct++;
                    }
                    // Show explanation
                    document.getElementById('exp-' + quizIndex + '-' + qIndex).classList.add('show');
                }
            });

            const percentage = answered > 0 ? Math.round((correct / quiz.questions.length) * 100) : 0;
            const resultDiv = document.getElementById('result-' + quizIndex);
            const resultTitle = document.getElementById('result-title-' + quizIndex);
            const resultScore = document.getElementById('result-score-' + quizIndex);

            if (percentage >= 80) {
                resultTitle.textContent = '¡Excelente! 🎉';
                resultTitle.style.color = '#4CAF50';
            } else if (percentage >= 60) {
                resultTitle.textContent = '¡Buen trabajo! 👍';
                resultTitle.style.color = '#2196F3';
            } else {
                resultTitle.textContent = 'Sigue practicando 💪';
                resultTitle.style.color = '#FF9800';
            }

            resultScore.textContent = \`Obtuviste \${correct} de \${quiz.questions.length} respuestas correctas (\${percentage}%)\`;
            resultDiv.classList.add('show');
        }

        function resetQuiz(quizIndex) {
            const form = document.getElementById('quiz-form-' + quizIndex);
            form.reset();
            document.querySelectorAll('#quiz-' + quizIndex + ' .explanation').forEach(el => {
                el.classList.remove('show');
            });
            document.getElementById('result-' + quizIndex).classList.remove('show');
        }
    </script>
</body>
</html>
  `;

  return quizHTML;
}

/**
 * Download content as file
 */
export function downloadFile(content: string, filename: string, mimeType: string = 'text/plain'): void {
  const blob = new Blob([content], { type: mimeType });
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  window.URL.revokeObjectURL(url);
}

/**
 * Copy content to clipboard
 */
export async function copyToClipboard(content: string): Promise<void> {
  try {
    await navigator.clipboard.writeText(content);
  } catch (error) {
    console.error('Error copying to clipboard:', error);
    throw new Error('Error al copiar al portapapeles');
  }
}
