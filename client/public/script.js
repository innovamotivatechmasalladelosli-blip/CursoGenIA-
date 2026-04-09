import { marked } from 'marked';
import DOMPurify from 'dompurify';
import { AIService } from './aiService.js';

/* @tweakable PDF export configuration */
const PDF_CONFIG = {
    format: 'a4',
    orientation: 'portrait',
    unit: 'mm',
    /* @tweakable PDF page margins in mm */
    margins: {
        top: 20,
        right: 20,
        bottom: 20,
        left: 20
    },
    /* @tweakable PDF font settings */
    fonts: {
        title: { size: 18, weight: 'bold' },
        subtitle: { size: 14, weight: 'bold' },
        body: { size: 11, weight: 'normal' },
        caption: { size: 9, weight: 'normal' }
    },
    /* @tweakable PDF colors */
    colors: {
        primary: '#4CAF50',
        text: '#333333',
        accent: '#666666'
    }
};

/* @tweakable PDF line spacing multiplier */
const PDF_LINE_SPACING = 1.4;

/* @tweakable PDF section spacing in mm */
const PDF_SECTION_SPACING = 8;

/* @tweakable maximum lines per PDF page */
const PDF_MAX_LINES_PER_PAGE = 35;

/* @tweakable QR code size in pixels */
const QR_CODE_SIZE = 256;

/* @tweakable QR code error correction level (L, M, Q, H) */
const QR_ERROR_CORRECTION = 'M';

/* @tweakable QR code service URL for hosting quizzes */
const QR_SERVICE_URL = 'https://quiz.innovacurso.com/';

/* @tweakable QR code data encoding method */
const QR_ENCODING_METHOD = 'base64';

/* @tweakable base URL for sharing quizzes */
const QUIZ_SHARE_BASE_URL = 'https://quiz-share.example.com/';

/* @tweakable gaming emojis for quiz download button */
const QUIZ_DOWNLOAD_EMOJIS = ['🎮', '🧠', '🎯', '⚡'];

/* @tweakable QR code API service URL */
const QR_API_SERVICE = 'https://api.qrserver.com/v1/create-qr-code/';

/* @tweakable QR code image format and quality */
const QR_FORMAT = 'png';
const QR_QUALITY = 'high';

/* @tweakable main brand name */
const BRAND_NAME = 'InnovACurso+';
/* @tweakable full brand line for credits and legal */
const BRAND_FULL = 'InnovACurso+ de InnovaMotivaTech del módulo InnovA+';

/* @tweakable open the standalone quiz in a new tab instead of direct download */
const OPEN_QUIZ_IN_NEW_WINDOW = true;
/* @tweakable also auto-download the quiz file after opening the new tab */
const QUIZ_AUTO_DOWNLOAD = false;
/* @tweakable open the generated QR image in a new tab for preview */
const OPEN_QR_IN_NEW_WINDOW = true;

/* @tweakable ensure single initialization to avoid double event triggers */
const ENSURE_SINGLE_INIT = true;
let appInitialized = false;

/* @tweakable enable/disable proxying of external requests */
const PROXY_ENABLED = true;
/* @tweakable proxy relay endpoint (must allow GET ?url=<encoded>) */
const PROXY_URL = 'https://your-secure-proxy.example.com/proxy';

document.addEventListener('DOMLoaded', function() {
    initApp();
});

document.addEventListener('DOMContentLoaded', function() {
    initApp();
});

function initApp() {
    if (ENSURE_SINGLE_INIT && appInitialized) return;
    appInitialized = true;
    
    // Elements
    const generateBtn = document.getElementById('generate-btn');
    const tabBtns = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');
    const loader = document.getElementById('loader');
    const exportPdfBtn = document.getElementById('export-pdf');
    const exportMdBtn = document.getElementById('export-md');
    const exportQuizBtn = document.getElementById('export-quiz');
    const copyContentBtn = document.getElementById('copy-content');
    const notification = document.getElementById('notification');
    
    // Initialize AI service
    const aiService = new AIService();
    
    // Store generated course data
    let currentCourseData = null;
    
    // Animation for brain nodes
    const pulseCircles = document.querySelectorAll('.pulse');
    pulseCircles.forEach((circle, index) => {
        circle.style.setProperty('--i', index);
    });

    // Tab functionality
    tabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const tabId = btn.getAttribute('data-tab');
            
            // Remove active class from all buttons and content
            tabBtns.forEach(b => b.classList.remove('active'));
            tabContents.forEach(c => c.classList.remove('active'));
            
            // Add active class to clicked button and corresponding content
            btn.classList.add('active');
            document.getElementById(`${tabId}-content`).classList.add('active');
        });
    });

    // Generate course
    generateBtn.addEventListener('click', () => generateCourse(aiService));

    // Export buttons
    exportPdfBtn.addEventListener('click', exportPDF);
    exportMdBtn.addEventListener('click', exportMarkdown);
    exportQuizBtn.addEventListener('click', exportQuizGame);
    copyContentBtn.addEventListener('click', copyContent);

    // Sample course data for demonstration
    const sampleCourseData = {
        overview: {
            title: "Desarrollo Web Profesional",
            level: "Intermedio",
            targetAudience: "Desarrolladores principiantes que desean mejorar sus habilidades",
            objectives: "Dominar HTML5, CSS3 y JavaScript moderno para crear aplicaciones web interactivas y responsivas",
            modules: [
                {
                    title: "Fundamentos de HTML5 Avanzado",
                    lessons: ["Semántica HTML5", "Accesibilidad web", "Formularios avanzados", "Multimedia y APIs nativas"]
                },
                {
                    title: "CSS3 Moderno y Diseño Responsivo",
                    lessons: ["Flexbox y Grid", "Animaciones y transiciones", "Variables CSS", "Media queries avanzadas"]
                },
                {
                    title: "JavaScript Moderno",
                    lessons: ["ES6+ características", "Manipulación del DOM", "Promesas y Async/Await", "APIs web modernas"]
                }
            ]
        },
        content: {
            modules: [
                {
                    title: "Fundamentos de HTML5 Avanzado",
                    lessons: [
                        {
                            title: "Semántica HTML5",
                            content: "La semántica HTML5 se refiere al significado de las etiquetas y elementos en un documento HTML. Usar elementos semánticos adecuados mejora la accesibilidad, SEO y mantenimiento del código.\n\n### Elementos semánticos principales\n\n- `<header>`: Representa una introducción o grupo de elementos de navegación.\n- `<nav>`: Sección para enlaces de navegación principales.\n- `<main>`: Contenido principal del documento.\n- `<article>`: Contenido independiente que podría distribuirse por separado.\n- `<section>`: Agrupación temática de contenido.\n- `<aside>`: Contenido relacionado indirectamente con el contenido principal.\n- `<footer>`: Pie de página para el documento o sección."
                        },
                        {
                            title: "Accesibilidad web",
                            content: "La accesibilidad web permite que personas con discapacidades puedan percibir, entender, navegar e interactuar con la web. Las pautas de WCAG (Web Content Accessibility Guidelines) establecen estándares para crear contenido web accesible.\n\n### Prácticas básicas de accesibilidad\n\n1. Usar texto alternativo para imágenes (`alt`).\n2. Asegurar suficiente contraste de color.\n3. Etiquetar correctamente formularios.\n4. Implementar navegación por teclado.\n5. Utilizar ARIA (Accessible Rich Internet Applications) cuando sea necesario."
                        }
                    ]
                }
            ]
        },
        exercises: [
            {
                title: "Estructura semántica de una página web",
                description: "Convierte una estructura de divs en una estructura semántica HTML5.",
                steps: [
                    "Identifica las diferentes secciones de la página (encabezado, navegación, contenido principal, barra lateral, pie de página).",
                    "Reemplaza los divs genéricos por elementos semánticos adecuados.",
                    "Asegúrate de anidar correctamente los elementos.",
                    "Valida tu código HTML con el validador W3C."
                ]
            },
            {
                title: "Creación de un formulario accesible",
                description: "Diseña un formulario de contacto que cumpla con los estándares de accesibilidad.",
                steps: [
                    "Crea un formulario con campos para nombre, email, asunto y mensaje.",
                    "Usa etiquetas label correctamente asociadas con los campos.",
                    "Implementa validación de formulario y mensajes de error accesibles.",
                    "Asegúrate de que el formulario sea navegable por teclado.",
                    "Prueba el formulario con un lector de pantalla."
                ]
            }
        ]
    };

    async function generateCourse(aiService) {
        const topic = document.getElementById('topic').value.trim();
        const level = document.getElementById('level').value;
        const modules = parseInt(document.getElementById('modules').value);
        const audience = document.getElementById('audience').value.trim();
        const objectives = document.getElementById('objectives').value.trim();
        
        // Validate inputs
        if (!topic) {
            showNotification('Por favor, ingresa el tema del curso');
            return;
        }
        
        if (!audience) {
            showNotification('Por favor, especifica la audiencia objetivo');
            return;
        }
        
        if (!objectives) {
            showNotification('Por favor, define los objetivos de aprendizaje');
            return;
        }
        
        // Show loader
        loader.classList.add('visible');
        generateBtn.disabled = true;
        
        try {
            showNotification('Generando vista general del curso...');
            
            // Generate course overview
            const courseOverview = await aiService.generateCourseOverview({
                topic,
                level,
                modules,
                audience,
                objectives
            });
            
            showNotification('Generando contenido detallado...');
            
            // Generate detailed content for each module
            const detailedModules = [];
            for (const module of courseOverview.modules) {
                const moduleContent = await aiService.generateModuleContent({
                    courseTitle: courseOverview.title,
                    moduleTitle: module.title,
                    lessons: module.lessons,
                    level: courseOverview.level
                });
                
                detailedModules.push({
                    title: module.title,
                    lessons: module.lessons,
                    content: moduleContent
                });
            }
            
            showNotification('Generando ejercicios prácticos...');
            
            // Generate exercises
            const exercisesContent = await aiService.generateExercises({
                courseTitle: courseOverview.title,
                modules: courseOverview.modules,
                level: courseOverview.level
            });
            
            showNotification('Generando cuestionarios interactivos...');
            
            // Generate quizzes
            const quizzesContent = await aiService.generateQuizzes({
                courseTitle: courseOverview.title,
                modules: courseOverview.modules,
                level: courseOverview.level
            });
            
            // Structure the complete course data
            currentCourseData = {
                overview: courseOverview,
                content: {
                    modules: detailedModules
                },
                exercises: exercisesContent,
                quizzes: quizzesContent
            };
            
            // Display the generated course
            displayCourseData(currentCourseData);
            
            // Enable export buttons
            exportPdfBtn.disabled = false;
            exportMdBtn.disabled = false;
            exportQuizBtn.disabled = false;
            copyContentBtn.disabled = false;
            
            showNotification('¡Curso generado con éxito!');
            
        } catch (error) {
            console.error('Error generating course:', error);
            showNotification('Error al generar el curso: ' + error.message);
        } finally {
            // Hide loader and re-enable button
            loader.classList.remove('visible');
            generateBtn.disabled = false;
        }
    }

    function displayCourseData(data) {
        // Overview tab
        const overviewContent = document.getElementById('overview-content');
        
        let overviewHTML = `
            <div class="course-overview">
                <h3>${data.overview.title}</h3>
                <div class="course-info">
                    <p><strong>Nivel:</strong> ${data.overview.level}</p>
                    <p><strong>Audiencia objetivo:</strong> ${data.overview.targetAudience}</p>
                    <p><strong>Duración estimada:</strong> ${data.overview.estimatedDuration || 'No especificada'}</p>
                    <p><strong>Objetivos de aprendizaje:</strong> ${data.overview.objectives}</p>
                    ${data.overview.prerequisites ? `<p><strong>Prerrequisitos:</strong> ${data.overview.prerequisites}</p>` : ''}
                </div>
                
                <div class="course-description">
                    <h4>Descripción del curso</h4>
                    <p>${data.overview.description}</p>
                </div>
                
                <h4>Estructura del curso</h4>
                <ul class="module-list">
        `;
        
        data.overview.modules.forEach((module, index) => {
            overviewHTML += `
                <li class="module-item">
                    <div class="module-title">
                        <span>Módulo ${index + 1}: ${module.title}</span>
                        <span class="lesson-count">${module.lessons.length} lecciones</span>
                    </div>
                    <ul class="lesson-list">
            `;
            
            module.lessons.forEach(lesson => {
                overviewHTML += `<li>${lesson}</li>`;
            });
            
            overviewHTML += `
                    </ul>
                </li>
            `;
        });
        
        overviewHTML += `
                </ul>
            </div>
        `;
        
        overviewContent.innerHTML = DOMPurify.sanitize(overviewHTML);
        
        // Content tab
        const contentContent = document.getElementById('content-content');
        let contentHTML = `<div class="course-content">`;
        
        data.content.modules.forEach((module, moduleIndex) => {
            contentHTML += `
                <h3>Módulo ${moduleIndex + 1}: ${module.title}</h3>
                <div class="lesson-content">
                    ${marked(module.content)}
                </div>
            `;
        });
        
        contentHTML += `</div>`;
        contentContent.innerHTML = DOMPurify.sanitize(contentHTML);
        
        // Exercises tab
        const exercisesContent = document.getElementById('exercises-content');
        const exercisesHTML = `
            <div class="exercises-content">
                ${marked(data.exercises)}
            </div>
        `;
        exercisesContent.innerHTML = DOMPurify.sanitize(exercisesHTML);
        
        // Quizzes tab
        const quizzesContent = document.getElementById('quizzes-content');
        displayQuizzes(data.quizzes, quizzesContent);
    }

    function displayQuizzes(quizzesData, container) {
        let quizzesHTML = '';
        
        quizzesData.forEach((quiz, index) => {
            const difficultyStars = '★'.repeat(quiz.difficulty || 3);
            quizzesHTML += `
                <div class="quiz-container" style="animation-delay: ${index * 0.1}s">
                    <div class="quiz-header">
                        <div class="quiz-icon">🧠</div>
                        <h3 class="quiz-title">${quiz.title}</h3>
                    </div>
                    <p class="quiz-description">${quiz.description}</p>
                    
                    <div class="quiz-game" id="quiz-${index}">
                        <div class="quiz-progress">
                            <div class="quiz-progress-bar" style="width: 0%"></div>
                        </div>
                        
                        <div class="quiz-questions-container">
                            ${quiz.questions.map((question, qIndex) => `
                                <div class="quiz-question" data-question="${qIndex}" style="display: ${qIndex === 0 ? 'block' : 'none'}">
                                    <div class="question-text">${question.question}</div>
                                    <div class="quiz-options">
                                        ${question.options.map((option, oIndex) => `
                                            <div class="quiz-option" data-option="${oIndex}">
                                                ${option}
                                            </div>
                                        `).join('')}
                                    </div>
                                    <div class="quiz-feedback" style="display: none;"></div>
                                </div>
                            `).join('')}
                        </div>
                        
                        <div class="quiz-score" style="display: none;">
                            <div class="score-display">0/${quiz.questions.length}</div>
                            <p>¡Puntuación obtenida!</p>
                        </div>
                    </div>
                    
                    <div class="quiz-stats">
                        <div class="quiz-difficulty">
                            <span>Dificultad: </span>
                            ${Array.from({length: 5}, (_, i) => `
                                <svg class="difficulty-star" viewBox="0 0 24 24">
                                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" fill="${i < (quiz.difficulty || 3) ? '#ffd700' : '#ddd'}"/>
                            `).join('')}
                        </div>
                        <div class="quiz-timer">⏱️ ${quiz.estimatedTime || '5-10'} min</div>
                    </div>
                </div>
            `;
        });
        
        container.innerHTML = DOMPurify.sanitize(quizzesHTML);
        
        // Initialize quiz functionality
        initializeQuizzes(quizzesData);
    }

    function initializeQuizzes(quizzesData) {
        quizzesData.forEach((quiz, quizIndex) => {
            const quizElement = document.getElementById(`quiz-${quizIndex}`);
            const questions = quizElement.querySelectorAll('.quiz-question');
            const progressBar = quizElement.querySelector('.quiz-progress-bar');
            const scoreElement = quizElement.querySelector('.quiz-score');
            const scoreDisplay = scoreElement.querySelector('.score-display');
            
            let currentQuestion = 0;
            let score = 0;
            
            questions.forEach((questionElement) => {
                const options = questionElement.querySelectorAll('.quiz-option');
                const feedback = questionElement.querySelector('.quiz-feedback');
                const questionIndex = parseInt(questionElement.dataset.question);
                const correctAnswer = quiz.questions[questionIndex]?.correct || 0;
                
                options.forEach((option, optionIndex) => {
                    option.addEventListener('click', () => {
                        // Remove previous selections
                        options.forEach(opt => opt.classList.remove('correct', 'incorrect'));
                        
                        // Show correct answer
                        if (optionIndex === correctAnswer) {
                            option.classList.add('correct');
                            score++;
                            feedback.innerHTML = `
                                <div class="feedback-correct">
                                    ✅ ¡Correcto! ${quiz.questions[questionIndex]?.explanation || 'Bien hecho.'}
                                </div>
                            `;
                        } else {
                            option.classList.add('incorrect');
                            options[correctAnswer].classList.add('correct');
                            feedback.innerHTML = `
                                <div class="feedback-incorrect">
                                    ❌ Incorrecto. ${quiz.questions[questionIndex]?.explanation || 'La respuesta correcta está marcada.'}
                                </div>
                            `;
                        }
                        
                        feedback.style.display = 'block';
                        
                        // Disable all options
                        options.forEach(opt => opt.style.pointerEvents = 'none');
                        
                        // Move to next question after delay
                        setTimeout(() => {
                            currentQuestion++;
                            const progress = (currentQuestion / quiz.questions.length) * 100;
                            progressBar.style.width = progress + '%';
                            
                            if (currentQuestion < quiz.questions.length) {
                                questionElement.style.display = 'none';
                                questions[currentQuestion].style.display = 'block';
                            } else {
                                // Show final score
                                questionElement.style.display = 'none';
                                scoreDisplay.textContent = score + '/' + quiz.questions.length;
                                scoreElement.style.display = 'block';
                            }
                        }, 2000);
                    });
                });
            });
        });
    }

    function exportPDF() {
        if (!currentCourseData) {
            showNotification('No hay contenido para exportar a PDF');
            return;
        }
        
        try {
            showNotification('Generando PDF...');
            
            // Create a simplified PDF using window.print and CSS
            const printContent = generatePrintableHTML(currentCourseData);
            
            // Create a new window for printing
            const printWindow = window.open('', '_blank');
            printWindow.document.write(printContent);
            printWindow.document.close();
            
            // Trigger print dialog
            printWindow.focus();
            setTimeout(() => {
                printWindow.print();
                printWindow.close();
            }, 1000);
            
            showNotification('¡PDF listo para imprimir/guardar!');
            
        } catch (error) {
            console.error('Error exporting PDF:', error);
            showNotification('Error al exportar PDF: ' + error.message);
        }
    }

    /* @tweakable PDF print styles and layout */
    function generatePrintableHTML(courseData) {
        return `<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="Content-Security-Policy" content="default-src 'none'; style-src 'unsafe-inline'; img-src data: blob:; frame-ancestors 'none'; base-uri 'none'">
    <meta name="referrer" content="no-referrer">
    <title>${courseData.overview.title} - Curso Completo</title>
    <style>
        @media print {
            @page {
                margin: ${PDF_CONFIG.margins.top}mm ${PDF_CONFIG.margins.right}mm ${PDF_CONFIG.margins.bottom}mm ${PDF_CONFIG.margins.left}mm;
                size: A4;
            }
            body { margin: 0; }
        }
        
        body {
            font-family: 'Arial', sans-serif;
            line-height: 1.6;
            color: ${PDF_CONFIG.colors.text};
            font-size: ${PDF_CONFIG.fonts.body.size}pt;
        }
        
        .header {
            background: ${PDF_CONFIG.colors.primary};
            color: white;
            padding: 20px;
            text-align: center;
            margin-bottom: 30px;
        }
        
        .course-title {
            font-size: ${PDF_CONFIG.fonts.title.size}pt;
            font-weight: ${PDF_CONFIG.fonts.title.weight};
            margin: 0;
        }
        
        .section-title {
            font-size: ${PDF_CONFIG.fonts.subtitle.size}pt;
            font-weight: ${PDF_CONFIG.fonts.subtitle.weight};
            color: ${PDF_CONFIG.colors.primary};
            margin: 25px 0 15px;
            border-bottom: 2px solid ${PDF_CONFIG.colors.primary};
            padding-bottom: 5px;
        }
        
        .course-info {
            background: #f8f9fa;
            padding: 15px;
            border-radius: 5px;
            margin: 20px 0;
        }
        
        .module-section {
            margin: 20px 0;
            page-break-inside: avoid;
        }
        
        .module-title {
            font-size: ${PDF_CONFIG.fonts.subtitle.size}pt;
            font-weight: ${PDF_CONFIG.fonts.subtitle.weight};
            color: ${PDF_CONFIG.colors.primary};
            margin: 20px 0 10px;
        }
        
        .lesson-list {
            padding-left: 20px;
        }
        
        .lesson-list li {
            margin: 5px 0;
        }
        
        .content-section {
            margin: 15px 0;
            text-align: justify;
        }
        
        .footer {
            position: fixed;
            bottom: 0;
            width: 100%;
            text-align: center;
            font-size: ${PDF_CONFIG.fonts.caption.size}pt;
            color: ${PDF_CONFIG.colors.accent};
            border-top: 1px solid #eee;
            padding-top: 10px;
        }
        
        h1, h2, h3, h4 {
            page-break-after: avoid;
        }
        
        .page-break {
            page-break-before: always;
        }
    </style>
</head>
<body>
    <div class="header">
        <h1 class="course-title">⚡ ${courseData.overview.title}</h1>
        <p>Generado por ${BRAND_FULL}</p>
    </div>
    
    <div class="section-title">INFORMACIÓN GENERAL</div>
    <div class="course-info">
        <p><strong>Nivel:</strong> ${courseData.overview.level}</p>
        <p><strong>Audiencia:</strong> ${courseData.overview.targetAudience}</p>
        <p><strong>Duración:</strong> ${courseData.overview.estimatedDuration || 'No especificada'}</p>
        <p><strong>Módulos:</strong> ${courseData.overview.modules.length}</p>
    </div>
    
    <div class="section-title">DESCRIPCIÓN</div>
    <div class="content-section">
        <p>${courseData.overview.description}</p>
    </div>
    
    <div class="section-title">OBJETIVOS DE APRENDIZAJE</div>
    <div class="content-section">
        <p>${courseData.overview.objectives}</p>
    </div>
    
    ${courseData.overview.prerequisites ? `
    <div class="section-title">PRERREQUISITOS</div>
    <div class="content-section">
        <p>${courseData.overview.prerequisites}</p>
    </div>
    ` : ''}
    
    <div class="section-title">ESTRUCTURA DEL CURSO</div>
    ${courseData.overview.modules.map((module, index) => `
        <div class="module-section">
            <div class="module-title">Módulo ${index + 1}: ${module.title}</div>
            <ul class="lesson-list">
                ${module.lessons.map(lesson => `<li>${lesson}</li>`).join('')}
            </ul>
        </div>
    `).join('')}
    
    <div class="page-break"></div>
    <div class="section-title">CONTENIDO DETALLADO</div>
    ${courseData.content.modules.map((module, index) => `
        <div class="module-section">
            <div class="module-title">Módulo ${index + 1}: ${module.title}</div>
            <div class="content-section">
                ${module.content.replace(/#{1,6}\s*/g, '').replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>').replace(/\*(.*?)\*/g, '<em>$1</em>').replace(/\n/g, '<br>')}
            </div>
        </div>
    `).join('')}
    
    ${courseData.exercises ? `
    <div class="page-break"></div>
    <div class="section-title">EJERCICIOS PRÁCTICOS</div>
    <div class="content-section">
        ${courseData.exercises.replace(/#{1,6}\s*/g, '').replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>').replace(/\*(.*?)\*/g, '<em>$1</em>').replace(/\n/g, '<br>')}
    </div>
    ` : ''}
    
    <div class="footer">
        <p>Generado por ${BRAND_FULL} el ${new Date().toLocaleDateString('es-ES')} | © 2025 ${BRAND_FULL}</p>
    </div>
</body>
</html>`;
    }
    
    function exportMarkdown() {
        showNotification('Exportando a Markdown... Función de demostración');
    }
    
    function copyContent() {
        const activeTab = document.querySelector('.tab-content.active');
        const textToCopy = activeTab.textContent;
        
        navigator.clipboard.writeText(textToCopy)
            .then(() => {
                showNotification('Contenido copiado al portapapeles');
            })
            .catch(err => {
                showNotification('Error al copiar: ' + err);
            });
    }
    
    function exportQuizGame() {
        if (!currentCourseData || !currentCourseData.quizzes) {
            showNotification('No hay cuestionarios para exportar');
            return;
        }
        
        // Generate and download standalone quiz HTML file
        const quizHTML = generateStandaloneQuizHTML(currentCourseData);
        if (OPEN_QUIZ_IN_NEW_WINDOW) {
            openHtmlInNewWindow(quizHTML);
            if (!QUIZ_AUTO_DOWNLOAD) {
                // skip download when set to not auto-download
            } else {
                const blob = new Blob([quizHTML], { type: 'text/html' });
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a'); a.href = url;
                a.download = `${currentCourseData.overview.title.replace(/\s+/g, '_')}_Quiz_Game.html`;
                document.body.appendChild(a); a.click(); document.body.removeChild(a); URL.revokeObjectURL(url);
            }
        } else {
            const blob = new Blob([quizHTML], { type: 'text/html' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a'); a.href = url;
            a.download = `${currentCourseData.overview.title.replace(/\s+/g, '_')}_Quiz_Game.html`;
            document.body.appendChild(a); a.click(); document.body.removeChild(a); URL.revokeObjectURL(url);
        }
        
        // Generate and download functional QR code
        generateAndDownloadQR(currentCourseData);
        
        showNotification('¡Quiz interactivo y código QR descargados exitosamente!', 'qr-success');
    }

    function openHtmlInNewWindow(htmlString) {
        /* @tweakable window name for the quiz preview tab */
        const windowName = 'quiz_preview';
        const w = window.open('', windowName, 'noopener,noreferrer');
        if (w) { w.opener = null; w.document.open(); w.document.write(htmlString); w.document.close(); }
    }

    function generateAndDownloadQR(courseData) {
        try {
            // Create a shareable data URL for the quiz
            const quizData = {
                title: courseData.overview.title,
                quizzes: courseData.quizzes,
                timestamp: Date.now(),
                version: 'v15'
            };
            
            // Create a simple encoded URL that can be hosted
            const encodedTitle = encodeURIComponent(courseData.overview.title.replace(/\s+/g, '_'));
            
            /* @tweakable quiz hosting service URL for QR codes */
            const baseUrl = 'https://innovacurso-quiz.netlify.app/';
            const shareUrl = `${baseUrl}?title=${encodedTitle}&data=${btoa(JSON.stringify(quizData))}`;
            
            /* @tweakable QR code size for Google Charts API */
            const qrSize = 400;
            /* @tweakable QR code error correction level (L, M, Q, H) */
            const errorCorrection = 'M';
            /* @tweakable QR code character encoding */
            const encoding = 'UTF-8';
            
            const qrCodeUrl = `https://chart.googleapis.com/chart?chs=${qrSize}x${qrSize}&cht=qr&chl=${encodeURIComponent(shareUrl)}&choe=${encoding}&chld=${errorCorrection}`;
            const finalQrUrl = PROXY_ENABLED ? `${PROXY_URL}?url=${encodeURIComponent(qrCodeUrl)}` : qrCodeUrl;
            
            // Show loading notification
            showNotification('Generando código QR...', 'qr-loading');
            
            // Create image element to load QR code
            const img = new Image();
            img.crossOrigin = 'anonymous';
            
            img.onload = function() {
                try {
                    // Create enhanced canvas with branding
                    const canvas = document.createElement('canvas');
                    const ctx = canvas.getContext('2d');
                    
                    /* @tweakable QR code canvas dimensions */
                    const canvasWidth = 500;
                    const canvasHeight = 600;
                    const qrDisplaySize = 350;
                    
                    canvas.width = canvasWidth;
                    canvas.height = canvasHeight;
                    
                    // Background gradient
                    const gradient = ctx.createLinearGradient(0, 0, 0, canvasHeight);
                    gradient.addColorStop(0, '#f8f9fa');
                    gradient.addColorStop(1, '#e9ecef');
                    ctx.fillStyle = gradient;
                    ctx.fillRect(0, 0, canvasWidth, canvasHeight);
                    
                    // Header section
                    ctx.fillStyle = '#4CAF50';
                    ctx.fillRect(0, 0, canvasWidth, 80);
                    
                    // Gaming emojis in header
                    ctx.font = '24px Arial';
                    const emojis = '🎮 🧠 🎯 ⚡';
                    const emojiWidth = ctx.measureText(emojis).width;
                    ctx.fillText(emojis, (canvasWidth - emojiWidth) / 2, 30);
                    
                    // Title
                    ctx.fillStyle = '#ffffff';
                    ctx.font = 'bold 22px Arial';
                    ctx.textAlign = 'center';
                    ctx.fillText('Quiz Interactivo', canvasWidth / 2, 60);
                    
                    // Course title
                    ctx.fillStyle = '#333333';
                    ctx.font = '18px Arial';
                    const truncatedTitle = courseData.overview.title.length > 35 
                        ? courseData.overview.title.substring(0, 32) + '...' 
                        : courseData.overview.title;
                    ctx.fillText(truncatedTitle, canvasWidth / 2, 110);
                    
                    // QR code with border
                    const qrX = (canvasWidth - qrDisplaySize) / 2;
                    const qrY = 140;
                    
                    // QR code shadow
                    ctx.fillStyle = 'rgba(0, 0, 0, 0.1)';
                    ctx.fillRect(qrX + 5, qrY + 5, qrDisplaySize, qrDisplaySize);
                    
                    // QR code border
                    ctx.fillStyle = '#ffffff';
                    ctx.fillRect(qrX - 10, qrY - 10, qrDisplaySize + 20, qrDisplaySize + 20);
                    
                    // Draw QR code
                    ctx.drawImage(img, qrX, qrY, qrDisplaySize, qrDisplaySize);
                    
                    // Instructions
                    ctx.fillStyle = '#666666';
                    ctx.font = '16px Arial';
                    ctx.fillText('Escanea el código QR con tu móvil', canvasWidth / 2, 520);
                    ctx.font = '14px Arial';
                    ctx.fillText('para acceder al quiz interactivo', canvasWidth / 2, 545);
                    
                    // Branding footer
                    ctx.fillStyle = '#4CAF50';
                    ctx.font = 'bold 16px Arial';
                    ctx.fillText('⚡ ' + BRAND_NAME, canvasWidth / 2, 580);
                    
                    // Download the QR code
                    if (OPEN_QR_IN_NEW_WINDOW) {
                        try { const dataURL = canvas.toDataURL('image/png', 1.0); window.open(dataURL, '_blank'); } catch(e) {}
                    }
                    const filename = `${courseData.overview.title.replace(/\s+/g, '_')}_QR_Quiz.png`;
                    downloadCanvas(canvas, filename);
                    
                    showNotification('¡Código QR generado y descargado exitosamente!', 'qr-success');
                    
                } catch (canvasError) {
                    console.error('Error creating QR canvas:', canvasError);
                    showNotification('Error al crear el código QR: ' + canvasError.message);
                }
            };
            
            img.onerror = function() {
                console.error('Failed to load QR code from Google Charts API');
                
                // Fallback: create a simple QR code placeholder
                createFallbackQR(courseData, shareUrl);
            };
            
            // Set timeout for loading
            setTimeout(() => {
                if (!img.complete) {
                    img.onerror();
                }
            }, 10000);
            
            img.src = finalQrUrl;
            
        } catch (error) {
            console.error('Error generating QR code:', error);
            showNotification('Error al generar el código QR: ' + error.message);
        }
    }

    /* @tweakable fallback QR code creation when API fails */
    function createFallbackQR(courseData, shareUrl) {
        try {
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');
            
            const canvasWidth = 500;
            const canvasHeight = 600;
            
            canvas.width = canvasWidth;
            canvas.height = canvasHeight;
            
            // Background
            ctx.fillStyle = '#f8f9fa';
            ctx.fillRect(0, 0, canvasWidth, canvasHeight);
            
            // Header
            ctx.fillStyle = '#4CAF50';
            ctx.fillRect(0, 0, canvasWidth, 80);
            
            ctx.fillStyle = '#ffffff';
            ctx.font = 'bold 22px Arial';
            ctx.textAlign = 'center';
            ctx.fillText('Quiz Interactivo', canvasWidth / 2, 40);
            ctx.font = '16px Arial';
            ctx.fillText('Código QR no disponible', canvasWidth / 2, 60);
            
            // Course info
            ctx.fillStyle = '#333333';
            ctx.font = '18px Arial';
            ctx.fillText(courseData.overview.title, canvasWidth / 2, 120);
            
            // Placeholder QR area
            ctx.fillStyle = '#e9ecef';
            ctx.fillRect(75, 150, 350, 350);
            ctx.strokeStyle = '#dee2e6';
            ctx.lineWidth = 2;
            ctx.strokeRect(75, 150, 350, 350);
            
            // QR placeholder text
            ctx.fillStyle = '#666666';
            ctx.font = '16px Arial';
            ctx.fillText('QR Code', canvasWidth / 2, 300);
            ctx.font = '14px Arial';
            ctx.fillText('Servicio temporalmente no disponible', canvasWidth / 2, 320);
            
            // Share URL
            ctx.font = '12px Arial';
            ctx.fillText('URL del quiz:', canvasWidth / 2, 360);
            
            // Split long URL into multiple lines
            const maxWidth = 400;
            const words = shareUrl.split('');
            let line = '';
            let y = 380;
            
            for (let i = 0; i < words.length; i++) {
                const testLine = line + words[i];
                const metrics = ctx.measureText(testLine);
                const testWidth = metrics.width;
                
                if (testWidth > maxWidth && i > 0) {
                    ctx.fillText(line, canvasWidth / 2, y);
                    line = words[i];
                    y += 15;
                } else {
                    line = testLine;
                }
            }
            ctx.fillText(line, canvasWidth / 2, y);
            
            // Footer
            ctx.fillStyle = '#4CAF50';
            ctx.font = 'bold 16px Arial';
            ctx.fillText('⚡ ' + BRAND_NAME, canvasWidth / 2, 580);
            
            const filename = `${courseData.overview.title.replace(/\s+/g, '_')}_QR_Fallback.png`;
            if (OPEN_QR_IN_NEW_WINDOW) {
                try { const dataURL = canvas.toDataURL('image/png', 1.0); window.open(dataURL, '_blank'); } catch(e) {}
            }
            downloadCanvas(canvas, filename);
            
            showNotification('Código QR de respaldo generado. Puede copiar la URL manualmente.', 'qr-fallback');
            
        } catch (fallbackError) {
            console.error('Fallback QR creation failed:', fallbackError);
            showNotification('Error al crear código QR de respaldo: ' + fallbackError.message);
        }
    }

    function downloadCanvas(canvas, filename) {
        try {
            // Create download link
            const link = document.createElement('a');
            link.download = filename;
            
            // Convert canvas to blob for better browser support
            canvas.toBlob(function(blob) {
                if (blob) {
                    const url = URL.createObjectURL(blob);
                    link.href = url;
                    
                    // Trigger download
                    document.body.appendChild(link);
                    link.click();
                    document.body.removeChild(link);
                    
                    // Clean up
                    setTimeout(() => URL.revokeObjectURL(url), 100);
                } else {
                    throw new Error('No se pudo generar la imagen');
                }
            }, 'image/png', 1.0);
            
        } catch (error) {
            console.error('Error downloading canvas:', error);
            
            // Fallback to data URL method
            try {
                const dataURL = canvas.toDataURL('image/png', 1.0);
                const link = document.createElement('a');
                link.download = filename;
                link.href = dataURL;
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
            } catch (fallbackError) {
                console.error('Fallback download failed:', fallbackError);
                showNotification('Error al descargar el archivo: ' + fallbackError.message);
            }
        }
    }

    function generateStandaloneQuizHTML(courseData) {
        /* @tweakable quiz theme colors */
        const primaryColor = '#4CAF50';
        const secondaryColor = '#667eea';
        const accentColor = '#764ba2';
        
        return `<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="Content-Security-Policy" content="default-src 'none'; script-src 'self' 'unsafe-inline'; style-src 'unsafe-inline'; img-src 'self' data: blob:; connect-src 'none'; frame-ancestors 'none'; base-uri 'none'; form-action 'none'">
    <meta name="referrer" content="no-referrer">
    <meta name="permissions-policy" content="geolocation=(), microphone=(), camera=()">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Quiz: ${courseData.overview.title} - ${BRAND_NAME}</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            background: linear-gradient(135deg, ${secondaryColor} 0%, ${accentColor} 100%);
            margin: 0;
            padding: 20px;
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
        }
        .quiz-app {
            max-width: 900px;
            width: 100%;
            background: white;
            border-radius: 20px;
            padding: 40px;
            box-shadow: 0 20px 60px rgba(0,0,0,0.15);
            animation: slideUp 0.8s cubic-bezier(0.175, 0.885, 0.32, 1.275);
            position: relative;
            overflow: hidden;
        }
        @keyframes slideUp {
            from { opacity: 0; transform: translateY(50px) scale(0.95); }
            to { opacity: 1; transform: translateY(0) scale(1); }
        }
        .quiz-app::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            height: 5px;
            background: linear-gradient(90deg, ${primaryColor}, ${secondaryColor}, ${accentColor});
        }
        .quiz-header {
            text-align: center;
            margin-bottom: 40px;
            position: relative;
        }
        .quiz-title {
            font-size: 2.2rem;
            color: #333;
            margin-bottom: 10px;
            font-weight: 700;
        }
        .quiz-subtitle {
            color: #666;
            font-size: 1.1rem;
            margin-bottom: 15px;
        }
        .branding {
            color: ${primaryColor};
            font-size: 1rem;
            font-weight: 600;
            display: inline-flex;
            align-items: center;
            gap: 5px;
        }
        .quiz-progress {
            width: 100%;
            height: 12px;
            background: #e9ecef;
            border-radius: 6px;
            margin-bottom: 30px;
            overflow: hidden;
            position: relative;
        }
        .quiz-progress-bar {
            height: 100%;
            background: linear-gradient(90deg, ${primaryColor}, #45a049);
            border-radius: 6px;
            transition: width 0.6s cubic-bezier(0.175, 0.885, 0.32, 1.275);
            width: 0%;
            position: relative;
        }
        .quiz-progress-bar::after {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.3), transparent);
            animation: shimmer 2s infinite;
        }
        @keyframes shimmer {
            0% { transform: translateX(-100%); }
            100% { transform: translateX(100%); }
        }
        .quiz-question {
            background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
            padding: 30px;
            border-radius: 15px;
            margin-bottom: 20px;
            display: none;
            position: relative;
            border-left: 5px solid ${primaryColor};
        }
        .quiz-question.active { 
            display: block; 
            animation: questionSlide 0.6s cubic-bezier(0.175, 0.885, 0.32, 1.275);
        }
        @keyframes questionSlide {
            from { opacity: 0; transform: translateX(30px); }
            to { opacity: 1; transform: translateX(0); }
        }
        .question-number {
            color: ${primaryColor};
            font-weight: 600;
            font-size: 0.9rem;
            margin-bottom: 10px;
        }
        .question-text {
            font-size: 1.3rem;
            font-weight: 600;
            margin-bottom: 25px;
            color: #333;
            line-height: 1.5;
        }
        .quiz-options {
            display: grid;
            gap: 15px;
        }
        .quiz-option {
            background: white;
            border: 3px solid #dee2e6;
            border-radius: 12px;
            padding: 18px 20px;
            cursor: pointer;
            transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
            position: relative;
            overflow: hidden;
            font-weight: 500;
        }
        .quiz-option::before {
            content: '';
            position: absolute;
            top: 0;
            left: -100%;
            width: 100%;
            height: 100%;
            background: linear-gradient(90deg, transparent, rgba(76, 175, 80, 0.1), transparent);
            transition: left 0.5s;
        }
        .quiz-option:hover::before {
            left: 100%;
        }
        .quiz-option:hover {
            border-color: ${primaryColor};
            background: linear-gradient(45deg, #f0f8f0, #e8f5e8);
            transform: translateY(-3px) scale(1.02);
            box-shadow: 0 8px 25px rgba(76, 175, 80, 0.2);
        }
        .quiz-option.correct {
            background: linear-gradient(45deg, #d4edda, #c3e6cb);
            border-color: #28a745;
            color: #155724;
            animation: correctPulse 0.6s ease-out;
        }
        .quiz-option.incorrect {
            background: linear-gradient(45deg, #f8d7da, #f5c6cb);
            border-color: #dc3545;
            color: #721c24;
            animation: incorrectShake 0.6s ease-out;
        }
        @keyframes correctPulse {
            0% { transform: scale(1); }
            50% { transform: scale(1.05); }
            100% { transform: scale(1); }
        }
        @keyframes incorrectShake {
            0%, 100% { transform: translateX(0); }
            25% { transform: translateX(-5px); }
            75% { transform: translateX(5px); }
        }
        .quiz-feedback {
            margin-top: 20px;
            padding: 20px;
            border-radius: 10px;
            display: none;
            animation: feedbackSlide 0.5s ease-out;
        }
        @keyframes feedbackSlide {
            from { opacity: 0; transform: translateY(10px); }
            to { opacity: 1; transform: translateY(0); }
        }
        .feedback-correct {
            background: linear-gradient(135deg, #d4edda, #c3e6cb);
            border-left: 5px solid #28a745;
            color: #155724;
        }
        .feedback-incorrect {
            background: linear-gradient(135deg, #f8d7da, #f5c6cb);
            border-left: 5px solid #dc3545;
            color: #721c24;
        }
        .quiz-score {
            text-align: center;
            padding: 40px;
            background: linear-gradient(135deg, ${secondaryColor} 0%, ${accentColor} 100%);
            color: white;
            border-radius: 15px;
            display: none;
            animation: scoreReveal 0.8s cubic-bezier(0.175, 0.885, 0.32, 1.275);
            position: relative;
            overflow: hidden;
        }
        @keyframes scoreReveal {
            0% { transform: scale(0.5) rotate(-5deg); opacity: 0; }
            50% { transform: scale(1.1) rotate(2deg); opacity: 1; }
            100% { transform: scale(1) rotate(0deg); opacity: 1; }
        }
        .score-icon {
            font-size: 4rem;
            margin-bottom: 20px;
            animation: bounce 2s infinite;
        }
        @keyframes bounce {
            0%, 20%, 50%, 80%, 100% { transform: translateY(0); }
            40% { transform: translateY(-10px); }
            60% { transform: translateY(-5px); }
        }
        .score-display {
            font-size: 3.5rem;
            font-weight: bold;
            margin-bottom: 15px;
            text-shadow: 2px 2px 4px rgba(0,0,0,0.3);
        }
        .score-message {
            font-size: 1.2rem;
            margin-bottom: 30px;
            opacity: 0.9;
        }
        .restart-btn {
            background: ${primaryColor};
            color: white;
            border: none;
            padding: 15px 30px;
            border-radius: 10px;
            cursor: pointer;
            font-size: 1.1rem;
            font-weight: 600;
            transition: all 0.3s ease;
            position: relative;
            overflow: hidden;
        }
        .restart-btn::before {
            content: '';
            position: absolute;
            top: 0;
            left: -100%;
            width: 100%;
            height: 100%;
            background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
            transition: left 0.5s;
        }
        .restart-btn:hover::before {
            left: 100%;
        }
        .restart-btn:hover {
            background: #45a049;
            transform: translateY(-2px) scale(1.05);
            box-shadow: 0 8px 25px rgba(76, 175, 80, 0.4);
        }
        .footer-info {
            text-align: center;
            margin-top: 30px;
            padding-top: 20px;
            border-top: 2px solid #eee;
            color: #666;
            font-size: 0.9rem;
        }
        .stats-container {
            display: flex;
            justify-content: space-around;
            margin: 20px 0;
            background: rgba(255, 255, 255, 0.1);
            border-radius: 10px;
            padding: 15px;
        }
        .stat-item {
            text-align: center;
        }
        .stat-value {
            font-size: 1.5rem;
            font-weight: bold;
            display: block;
        }
        .stat-label {
            font-size: 0.9rem;
            opacity: 0.8;
        }
        /* Mobile responsive */
        @media (max-width: 768px) {
            .quiz-app { padding: 20px; margin: 10px; }
            .quiz-title { font-size: 1.8rem; }
            .question-text { font-size: 1.1rem; }
            .quiz-option { padding: 15px; }
            .score-display { font-size: 2.5rem; }
        }
    </style>
</head>
<body>
    <div class="quiz-app">
        <div class="quiz-header">
            <h1 class="quiz-title">🧠 Quiz Interactivo</h1>
            <p class="quiz-subtitle">${courseData.overview.title}</p>
            <div class="branding">
                <span>⚡</span> ${BRAND_FULL}
            </div>
        </div>
        
        <div class="quiz-progress">
            <div class="quiz-progress-bar" id="progressBar"></div>
        </div>
        
        <div id="questionsContainer">
            ${courseData.quizzes.flatMap((quiz, quizIndex) => 
                quiz.questions.map((question, questionIndex) => {
                    const globalIndex = questionIndex + (quizIndex * quiz.questions.length);
                    return `
                        <div class="quiz-question" data-question="${globalIndex}">
                            <div class="question-number">Pregunta ${globalIndex + 1} de ${courseData.quizzes.reduce((total, q) => total + q.questions.length, 0)}</div>
                            <div class="question-text">${question.question}</div>
                            <div class="quiz-options">
                                ${question.options.map((option, optionIndex) => `
                                    <div class="quiz-option" data-option="${optionIndex}">
                                        <span style="color: ${primaryColor}; font-weight: bold; margin-right: 10px;">${String.fromCharCode(65 + optionIndex)})</span>
                                        ${option}
                                    </div>
                                `).join('')}
                            </div>
                            <div class="quiz-feedback"></div>
                        </div>
                    `;
                })
            ).join('')}
        </div>
        
        <div class="quiz-score" id="finalScore">
            <div class="score-icon" id="scoreIcon">🎉</div>
            <div class="score-display" id="scoreDisplay">0/0</div>
            <div class="score-message" id="scoreMessage">¡Quiz completado!</div>
            <div class="stats-container">
                <div class="stat-item">
                    <span class="stat-value" id="correctCount">0</span>
                    <span class="stat-label">Correctas</span>
                </div>
                <div class="stat-item">
                    <span class="stat-value" id="accuracyPercent">0%</span>
                    <span class="stat-label">Precisión</span>
                </div>
                <div class="stat-item">
                    <span class="stat-value" id="timeSpent">0s</span>
                    <span class="stat-label">Tiempo</span>
                </div>
            </div>
            <button class="restart-btn" onclick="restartQuiz()">🔄 Reiniciar Quiz</button>
        </div>
        
        <div class="footer-info">
            <p><strong>Curso:</strong> ${courseData.overview.title}</p>
            <p>Generado el ${new Date().toLocaleDateString('es-ES')} por <strong>${BRAND_FULL}</strong></p>
            <p style="margin-top: 10px; font-size: 0.8rem; opacity: 0.7;">
                © 2025 ${BRAND_FULL} - Tecnología educativa avanzada
            </p>
        </div>
    </div>

    <script>
        const allQuizzes = ${JSON.stringify(courseData.quizzes)};
        const allQuestions = allQuizzes.flatMap((quiz, quizIndex) => 
            quiz.questions.map(q => ({...q, quizIndex}))
        );
        
        let currentQuestion = 0;
        let score = 0;
        let startTime = Date.now();
        const totalQuestions = allQuestions.length;
        
        function initQuiz() {
            if (totalQuestions === 0) {
                document.getElementById('questionsContainer').innerHTML = 
                    '<div style="text-align: center; padding: 40px;"><h3>No hay preguntas disponibles</h3><p>El quiz no contiene preguntas válidas.</p></div>';
                return;
            }
            
            startTime = Date.now();
            updateScoreDisplay();
            showQuestion(0);
            initQuestionHandlers();
        }
        
        function initQuestionHandlers() {
            const questions = document.querySelectorAll('.quiz-question');
            questions.forEach((questionElement, questionIndex) => {
                const options = questionElement.querySelectorAll('.quiz-option');
                const feedback = questionElement.querySelector('.quiz-feedback');
                const correctAnswer = allQuestions[questionIndex]?.correct || 0;
                
                options.forEach((option, optionIndex) => {
                    option.addEventListener('click', () => handleAnswerClick(
                        option, options, feedback, optionIndex, correctAnswer, questionIndex
                    ));
                });
            });
        }
        
        function handleAnswerClick(clickedOption, allOptions, feedback, selectedIndex, correctIndex, questionIndex) {
            if (clickedOption.classList.contains('correct') || clickedOption.classList.contains('incorrect')) {
                return; // Already answered
            }
            
            // Disable all options
            allOptions.forEach(opt => opt.style.pointerEvents = 'none');
            
            const isCorrect = selectedIndex === correctIndex;
            const questionData = allQuestions[questionIndex];
            
            if (isCorrect) {
                clickedOption.classList.add('correct');
                score++;
                feedback.innerHTML = \`
                    <div class="feedback-correct">
                        ✅ <strong>¡Excelente!</strong> \${questionData?.explanation || 'Respuesta correcta.'}
                    </div>
                \`;
            } else {
                clickedOption.classList.add('incorrect');
                allOptions[correctIndex].classList.add('correct');
                feedback.innerHTML = \`
                    <div class="feedback-incorrect">
                        ❌ <strong>Incorrecto.</strong> \${questionData?.explanation || 'La respuesta correcta está marcada en verde.'}
                    </div>
                \`;
            }
            
            feedback.style.display = 'block';
            
            // Auto-advance after delay
            setTimeout(() => {
                currentQuestion++;
                updateProgress();
                
                if (currentQuestion < totalQuestions) {
                    showQuestion(currentQuestion);
                } else {
                    showFinalScore();
                }
            }, 2800);
        }
        
        function showQuestion(index) {
            const questions = document.querySelectorAll('.quiz-question');
            questions.forEach((q, i) => {
                q.classList.toggle('active', i === index);
            });
        }
        
        function updateProgress() {
            const progress = (currentQuestion / totalQuestions) * 100;
            document.getElementById('progressBar').style.width = progress + '%';
        }
        
        function updateScoreDisplay() {
            document.getElementById('scoreDisplay').textContent = score + '/' + totalQuestions;
        }
        
        function showFinalScore() {
            const timeTaken = Math.round((Date.now() - startTime) / 1000);
            const accuracy = Math.round((score / totalQuestions) * 100);
            
            document.getElementById('questionsContainer').style.display = 'none';
            document.getElementById('scoreDisplay').textContent = score + '/' + totalQuestions;
            document.getElementById('correctCount').textContent = score;
            document.getElementById('accuracyPercent').textContent = accuracy + '%';
            document.getElementById('timeSpent').textContent = timeTaken + 's';
            
            // Update message and icon based on performance
            const scoreIcon = document.getElementById('scoreIcon');
            const scoreMessage = document.getElementById('scoreMessage');
            
            if (accuracy >= 90) {
                scoreIcon.textContent = '🏆';
                scoreMessage.textContent = '¡Excelente trabajo! Dominas el tema.';
            } else if (accuracy >= 70) {
                scoreIcon.textContent = '⭐';
                scoreMessage.textContent = '¡Bien hecho! Buen desempeño.';
            } else if (accuracy >= 50) {
                scoreIcon.textContent = '👍';
                scoreMessage.textContent = 'Bien, pero puedes mejorar.';
            } else {
                scoreIcon.textContent = '📚';
                scoreMessage.textContent = 'Te recomendamos repasar el material.';
            }
            
            document.getElementById('finalScore').style.display = 'block';
        }
        
        function restartQuiz() {
            currentQuestion = 0;
            score = 0;
            startTime = Date.now();
            
            document.getElementById('progressBar').style.width = '0%';
            document.getElementById('finalScore').style.display = 'none';
            document.getElementById('questionsContainer').style.display = 'block';
            
            // Reset all questions
            const questions = document.querySelectorAll('.quiz-question');
            questions.forEach(q => {
                const options = q.querySelectorAll('.quiz-option');
                options.forEach(opt => {
                    opt.classList.remove('correct', 'incorrect');
                    opt.style.pointerEvents = 'auto';
                });
                q.querySelector('.quiz-feedback').style.display = 'none';
            });
            
            updateScoreDisplay();
            showQuestion(0);
        }
        
        // Initialize quiz when page loads
        document.addEventListener('DOMContentLoaded', initQuiz);
        
        // Prevent right-click context menu on quiz content
        document.addEventListener('contextmenu', function(e) {
            if (e.target.closest('.quiz-app')) {
                e.preventDefault();
            }
        });
    </script>
</body>
</html>`;
    }

    function showNotification(message, type = '') {
        const notificationElement = document.getElementById('notification');
        notificationElement.querySelector('p').textContent = message;
        notificationElement.className = 'notification show';
        
        if (type) {
            notificationElement.classList.add(type);
        }
        
        setTimeout(() => {
            notificationElement.className = 'notification';
        }, 4000);
    }
}