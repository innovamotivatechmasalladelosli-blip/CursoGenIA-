import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import { useState } from 'react';
import { Loader2, Download, Copy, Share2, BookOpen, Zap, Target, FileText, CheckCircle2 } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import {
  generateCourseOverview,
  generateModuleContent,
  generateExercises,
  generateQuizzes,
} from '@/lib/aiService';
import {
  exportAsMarkdown,
  exportAsPDF,
  exportQuizAsHTML,
  downloadFile,
  copyToClipboard,
} from '@/lib/exportUtils';

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

export default function Home() {
  const [topic, setTopic] = useState('');
  const [level, setLevel] = useState('principiante');
  const [modules, setModules] = useState(3);
  const [audience, setAudience] = useState('');
  const [objectives, setObjectives] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [courseData, setCourseData] = useState<CourseData | null>(null);
  const [activeTab, setActiveTab] = useState('overview');

  const handleGenerateCourse = async () => {
    if (!topic.trim()) {
      toast.error('Por favor ingresa el tema del curso');
      return;
    }
    if (!audience.trim()) {
      toast.error('Por favor especifica la audiencia objetivo');
      return;
    }
    if (!objectives.trim()) {
      toast.error('Por favor define los objetivos de aprendizaje');
      return;
    }

    setIsLoading(true);
    setCourseData(null);
    
    try {
      toast.info('Iniciando generación del curso...');

      // Generate overview
      const overview = await generateCourseOverview({
        topic,
        level,
        modules,
        audience,
        objectives,
      });

      toast.info('Generando contenido de los módulos...');

      // Generate module content
      const moduleContents = await Promise.all(
        overview.modules.map((module) =>
          generateModuleContent({
            courseTitle: overview.title,
            moduleTitle: module.title,
            lessons: module.lessons,
            level: overview.level,
          })
        )
      );

      const contentModules = overview.modules.map((module, index) => ({
        title: module.title,
        lessons: module.lessons,
        content: moduleContents[index],
      }));

      toast.info('Generando ejercicios y evaluaciones...');

      // Generate exercises and quizzes in parallel
      const [exercisesContent, quizzesContent] = await Promise.all([
        generateExercises({
          courseTitle: overview.title,
          modules: overview.modules,
          level: overview.level,
        }),
        generateQuizzes({
          courseTitle: overview.title,
          modules: overview.modules,
          level: overview.level,
        })
      ]);

      const newCourseData: CourseData = {
        overview,
        content: { modules: contentModules },
        exercises: exercisesContent,
        quizzes: quizzesContent,
      };

      setCourseData(newCourseData);
      toast.success('¡Curso generado con éxito!');
    } catch (error) {
      console.error('Error:', error);
      toast.error(error instanceof Error ? error.message : 'Error al generar el curso');
    } finally {
      setIsLoading(false);
    }
  };

  const handleExportMarkdown = async () => {
    if (!courseData) return;
    try {
      const markdown = exportAsMarkdown(courseData);
      downloadFile(markdown, `${courseData.overview.title.replace(/\s+/g, '_')}.md`, 'text/markdown');
      toast.success('Markdown exportado correctamente');
    } catch (error) {
      toast.error('Error al exportar Markdown');
    }
  };

  const handleExportPDF = async () => {
    if (!courseData) return;
    try {
      await exportAsPDF(courseData);
      toast.success('PDF exportado correctamente');
    } catch (error) {
      toast.error('Error al exportar PDF');
    }
  };

  const handleExportQuiz = async () => {
    if (!courseData) return;
    try {
      const quizHTML = exportQuizAsHTML(courseData.quizzes, courseData.overview.title);
      downloadFile(quizHTML, `Quiz_${courseData.overview.title.replace(/\s+/g, '_')}.html`, 'text/html');
      toast.success('Quiz exportado correctamente');
    } catch (error) {
      toast.error('Error al exportar Quiz');
    }
  };

  const handleCopyContent = async () => {
    if (!courseData) return;
    try {
      const markdown = exportAsMarkdown(courseData);
      await copyToClipboard(markdown);
      toast.success('Contenido copiado al portapapeles');
    } catch (error) {
      toast.error('Error al copiar al portapapeles');
    }
  };

  return (
    <div className="min-h-screen bg-[#0f172a] text-slate-200 font-inter">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-slate-800 bg-[#0f172a]/80 backdrop-blur-md shadow-xl">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-purple-600 to-cyan-500 rounded-xl flex items-center justify-center shadow-lg shadow-purple-500/20">
              <BookOpen className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">
                InnovACurso+
              </h1>
              <p className="text-xs text-slate-400 font-medium tracking-wider uppercase">AI Course Generator</p>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-12">
        {/* Hero Section */}
        <div className="mb-16 text-center">
          <h2 className="text-4xl md:text-6xl font-extrabold text-white mb-6 tracking-tight">
            Crea cursos con <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-cyan-400">Inteligencia Artificial</span>
          </h2>
          <p className="text-lg text-slate-400 max-w-3xl mx-auto leading-relaxed">
            Genera contenido educativo estructurado, detallado y personalizado en segundos. 
            Potenciado por Gemini 1.5 Flash para resultados precisos y rápidos.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {[
            { icon: Zap, title: "Generación Rápida", desc: "Reduce semanas de trabajo a solo minutos.", color: "text-purple-400", bg: "bg-purple-400/10" },
            { icon: Target, title: "Personalizado", desc: "Adaptado a diferentes niveles y audiencias.", color: "text-cyan-400", bg: "bg-cyan-400/10" },
            { icon: FileText, title: "Estructura Completa", desc: "Módulos, lecciones y evaluaciones.", color: "text-indigo-400", bg: "bg-indigo-400/10" },
            { icon: Download, title: "Exportación", desc: "PDF, Markdown y HTML interactivo.", color: "text-emerald-400", bg: "bg-emerald-400/10" }
          ].map((f, i) => (
            <Card key={i} className="bg-slate-900/50 border-slate-800 hover:border-slate-700 transition-all hover:-translate-y-1">
              <CardHeader className="pb-3">
                <div className={`w-12 h-12 ${f.bg} rounded-xl flex items-center justify-center mb-4`}>
                  <f.icon className={`w-6 h-6 ${f.color}`} />
                </div>
                <CardTitle className="text-lg text-white">{f.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-slate-400 leading-relaxed">{f.desc}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Main Generator Section */}
        <div className="grid lg:grid-cols-12 gap-8">
          {/* Input Section */}
          <Card className="lg:col-span-4 bg-slate-900 border-slate-800 shadow-2xl h-fit sticky top-24">
            <CardHeader>
              <CardTitle className="text-white">Configurar Curso</CardTitle>
              <CardDescription className="text-slate-400">Define los parámetros de tu contenido</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="topic" className="text-slate-300">Tema del Curso</Label>
                <Input
                  id="topic"
                  placeholder="Ej: Desarrollo web con React"
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                  disabled={isLoading}
                  className="bg-slate-800 border-slate-700 text-white focus:ring-purple-500 focus:border-purple-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="level" className="text-slate-300">Nivel</Label>
                  <Select value={level} onValueChange={setLevel} disabled={isLoading}>
                    <SelectTrigger id="level" className="bg-slate-800 border-slate-700 text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-slate-800 border-slate-700 text-white">
                      <SelectItem value="principiante">Principiante</SelectItem>
                      <SelectItem value="intermedio">Intermedio</SelectItem>
                      <SelectItem value="avanzado">Avanzado</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="modules" className="text-slate-300">Módulos</Label>
                  <Input
                    id="modules"
                    type="number"
                    min="1"
                    max="10"
                    value={modules}
                    onChange={(e) => setModules(parseInt(e.target.value))}
                    disabled={isLoading}
                    className="bg-slate-800 border-slate-700 text-white"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="audience" className="text-slate-300">Audiencia Objetivo</Label>
                <Input
                  id="audience"
                  placeholder="Ej: Estudiantes de programación"
                  value={audience}
                  onChange={(e) => setAudience(e.target.value)}
                  disabled={isLoading}
                  className="bg-slate-800 border-slate-700 text-white"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="objectives" className="text-slate-300">Objetivos</Label>
                <Textarea
                  id="objectives"
                  placeholder="Ej: Aprender hooks, componentes y estado..."
                  value={objectives}
                  onChange={(e) => setObjectives(e.target.value)}
                  disabled={isLoading}
                  className="bg-slate-800 border-slate-700 text-white min-h-[100px] resize-none"
                />
              </div>

              <Button
                onClick={handleGenerateCourse}
                disabled={isLoading}
                className="w-full bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-700 hover:to-cyan-700 text-white h-12 font-bold rounded-xl shadow-lg shadow-purple-500/20 transition-all active:scale-95"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                    Generando...
                  </>
                ) : (
                  <>
                    <Zap className="w-5 h-5 mr-2" />
                    Generar Curso
                  </>
                )}
              </Button>
            </CardContent>
          </Card>

          {/* Output Section */}
          <Card className="lg:col-span-8 bg-slate-900 border-slate-800 shadow-2xl min-h-[600px] flex flex-col">
            <CardHeader className="border-b border-slate-800">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-white">Contenido Generado</CardTitle>
                  <CardDescription className="text-slate-400">
                    {courseData ? 'Tu curso está listo para explorar' : 'Los resultados aparecerán aquí'}
                  </CardDescription>
                </div>
                {courseData && (
                  <div className="flex gap-2">
                    <Button onClick={handleCopyContent} variant="outline" size="sm" className="border-slate-700 text-slate-300 hover:bg-slate-800">
                      <Copy className="w-4 h-4" />
                    </Button>
                  </div>
                )}
              </div>
            </CardHeader>
            <CardContent className="flex-1 p-0 overflow-hidden flex flex-col">
              {courseData ? (
                <div className="flex flex-col h-full">
                  <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full flex flex-col h-full">
                    <TabsList className="bg-slate-800/50 p-1 m-4 rounded-xl border border-slate-700/50">
                      <TabsTrigger value="overview" className="rounded-lg data-[state=active]:bg-purple-600 data-[state=active]:text-white">General</TabsTrigger>
                      <TabsTrigger value="content" className="rounded-lg data-[state=active]:bg-purple-600 data-[state=active]:text-white">Contenido</TabsTrigger>
                      <TabsTrigger value="exercises" className="rounded-lg data-[state=active]:bg-purple-600 data-[state=active]:text-white">Ejercicios</TabsTrigger>
                      <TabsTrigger value="quizzes" className="rounded-lg data-[state=active]:bg-purple-600 data-[state=active]:text-white">Quizzes</TabsTrigger>
                    </TabsList>

                    <div className="flex-1 overflow-y-auto px-6 pb-6 custom-scrollbar">
                      <TabsContent value="overview" className="mt-0 space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
                        <div className="space-y-4">
                          <h3 className="text-3xl font-bold text-white">{courseData.overview.title}</h3>
                          <p className="text-slate-400 leading-relaxed text-lg">{courseData.overview.description}</p>
                          
                          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                            <div className="bg-slate-800/50 p-4 rounded-2xl border border-slate-700/50">
                              <p className="text-xs text-slate-500 uppercase font-bold tracking-wider mb-1">Nivel</p>
                              <p className="text-purple-400 font-semibold">{courseData.overview.level}</p>
                            </div>
                            <div className="bg-slate-800/50 p-4 rounded-2xl border border-slate-700/50">
                              <p className="text-xs text-slate-500 uppercase font-bold tracking-wider mb-1">Duración</p>
                              <p className="text-cyan-400 font-semibold">{courseData.overview.estimatedDuration}</p>
                            </div>
                            <div className="bg-slate-800/50 p-4 rounded-2xl border border-slate-700/50">
                              <p className="text-xs text-slate-500 uppercase font-bold tracking-wider mb-1">Módulos</p>
                              <p className="text-indigo-400 font-semibold">{courseData.overview.modules.length}</p>
                            </div>
                          </div>

                          <div className="space-y-4 pt-4">
                            <h4 className="text-xl font-bold text-white flex items-center gap-2">
                              <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                              Estructura del Curso
                            </h4>
                            <div className="grid gap-3">
                              {courseData.overview.modules.map((module, index) => (
                                <div key={index} className="bg-slate-800/30 p-4 rounded-xl border border-slate-700/30 hover:border-purple-500/30 transition-colors">
                                  <p className="font-bold text-slate-200">Módulo {index + 1}: {module.title}</p>
                                  <ul className="mt-2 space-y-1">
                                    {module.lessons.map((lesson, lIdx) => (
                                      <li key={lIdx} className="text-sm text-slate-400 flex items-center gap-2">
                                        <div className="w-1 h-1 bg-slate-600 rounded-full" />
                                        {lesson}
                                      </li>
                                    ))}
                                  </ul>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      </TabsContent>

                      <TabsContent value="content" className="mt-0 space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-300">
                        {courseData.content.modules.map((module, index) => (
                          <div key={index} className="space-y-4">
                            <div className="flex items-center gap-4">
                              <div className="w-8 h-8 bg-purple-600 rounded-lg flex items-center justify-center text-white font-bold text-sm">
                                {index + 1}
                              </div>
                              <h4 className="text-2xl font-bold text-white">{module.title}</h4>
                            </div>
                            <div className="prose prose-invert prose-slate max-w-none bg-slate-800/20 p-6 rounded-2xl border border-slate-700/30">
                              <ReactMarkdown remarkPlugins={[remarkGfm]}>
                                {module.content}
                              </ReactMarkdown>
                            </div>
                          </div>
                        ))}
                      </TabsContent>

                      <TabsContent value="exercises" className="mt-0 animate-in fade-in slide-in-from-bottom-2 duration-300">
                        <div className="prose prose-invert prose-slate max-w-none bg-slate-800/20 p-6 rounded-2xl border border-slate-700/30">
                          <ReactMarkdown remarkPlugins={[remarkGfm]}>
                            {courseData.exercises}
                          </ReactMarkdown>
                        </div>
                      </TabsContent>

                      <TabsContent value="quizzes" className="mt-0 space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
                        {courseData.quizzes.map((quiz, index) => (
                          <div key={index} className="bg-slate-800/40 p-6 rounded-2xl border border-slate-700/50 space-y-4">
                            <div className="flex justify-between items-start">
                              <div>
                                <h4 className="text-xl font-bold text-white">{quiz.title}</h4>
                                <p className="text-slate-400 text-sm mt-1">{quiz.description}</p>
                              </div>
                              <div className="bg-purple-600/20 text-purple-400 px-3 py-1 rounded-full text-xs font-bold border border-purple-500/20">
                                Dificultad: {quiz.difficulty}/5
                              </div>
                            </div>
                            <div className="grid gap-4 mt-4">
                              {quiz.questions.map((q, qIdx) => (
                                <div key={qIdx} className="bg-slate-900/50 p-4 rounded-xl border border-slate-800">
                                  <p className="text-slate-200 font-medium mb-3">{qIdx + 1}. {q.question}</p>
                                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                    {q.options.map((opt, oIdx) => (
                                      <div key={oIdx} className={`p-3 rounded-lg text-sm border ${oIdx === q.correct ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400' : 'bg-slate-800 border-slate-700 text-slate-400'}`}>
                                        {opt}
                                      </div>
                                    ))}
                                  </div>
                                  <p className="mt-3 text-xs text-slate-500 italic">
                                    <span className="font-bold text-slate-400">Explicación:</span> {q.explanation}
                                  </p>
                                </div>
                              ))}
                            </div>
                          </div>
                        ))}
                      </TabsContent>
                    </div>

                    {/* Export Footer */}
                    <div className="p-4 border-t border-slate-800 bg-slate-900/80 backdrop-blur-sm grid grid-cols-2 sm:grid-cols-4 gap-3">
                      <Button onClick={handleExportMarkdown} variant="outline" className="border-slate-700 text-slate-300 hover:bg-slate-800 hover:text-white">
                        <Download className="w-4 h-4 mr-2" /> Markdown
                      </Button>
                      <Button onClick={handleExportPDF} variant="outline" className="border-slate-700 text-slate-300 hover:bg-slate-800 hover:text-white">
                        <Download className="w-4 h-4 mr-2" /> PDF
                      </Button>
                      <Button onClick={handleExportQuiz} variant="outline" className="border-slate-700 text-slate-300 hover:bg-slate-800 hover:text-white">
                        <Share2 className="w-4 h-4 mr-2" /> Quiz HTML
                      </Button>
                      <Button onClick={handleCopyContent} variant="outline" className="border-slate-700 text-slate-300 hover:bg-slate-800 hover:text-white">
                        <Copy className="w-4 h-4 mr-2" /> Copiar Todo
                      </Button>
                    </div>
                  </Tabs>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center h-full min-h-[400px] text-center p-8">
                  <div className="w-20 h-20 bg-slate-800 rounded-full flex items-center justify-center mb-6 animate-pulse">
                    <BookOpen className="w-10 h-10 text-slate-600" />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2">Listo para comenzar</h3>
                  <p className="text-slate-400 max-w-xs mx-auto">
                    Completa el formulario de la izquierda y haz clic en "Generar Curso" para ver la magia.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </main>

      {/* Footer */}
      <footer className="mt-20 border-t border-slate-800 bg-slate-900/50">
        <div className="container mx-auto px-4 py-12 text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            <div className="w-6 h-6 bg-gradient-to-br from-purple-600 to-cyan-500 rounded flex items-center justify-center">
              <BookOpen className="w-4 h-4 text-white" />
            </div>
            <span className="font-bold text-white">InnovACurso+</span>
          </div>
          <p className="text-slate-500 text-sm">© 2026 InnovaMotivaTech. Todos los derechos reservados.</p>
          <p className="mt-2 text-xs text-slate-600">
            Desarrollado con Inteligencia Artificial para potenciar el aprendizaje continuo.
          </p>
        </div>
      </footer>

      <style dangerouslySetInnerHTML={{ __html: `
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #334155;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #475569;
        }
        .font-inter { font-family: 'Inter', sans-serif; }
      `}} />
    </div>
  );
}
