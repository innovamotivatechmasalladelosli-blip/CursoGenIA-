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
import { useEffect, useState } from 'react';
import { Loader2, Download, Copy, Share2, BookOpen, Zap, Target, FileText } from 'lucide-react';
import {
  generateCourseOverview,
  generateModuleContent,
  generateExercises,
  generateQuizzes,
} from '@/lib/aiService';
import {
  exportAsMarkdown,
  exportAsPDF,
  generateQRCode,
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
    try {
      toast.loading('Generando vista general del curso...');

      // Generate overview
      const overview = await generateCourseOverview({
        topic,
        level,
        modules,
        audience,
        objectives,
      });

      toast.loading('Generando contenido detallado...');

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

      toast.loading('Generando ejercicios prácticos...');

      // Generate exercises
      const exercisesContent = await generateExercises({
        courseTitle: overview.title,
        modules: overview.modules,
        level: overview.level,
      });

      toast.loading('Generando cuestionarios...');

      // Generate quizzes
      const quizzesContent = await generateQuizzes({
        courseTitle: overview.title,
        modules: overview.modules,
        level: overview.level,
      });

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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-white/80 bg-white/95 backdrop-blur-sm shadow-sm">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center">
              <BookOpen className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                InnovACurso+
              </h1>
              <p className="text-xs text-gray-500">Generador de Cursos con IA</p>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-12">
        {/* Hero Section */}
        <div className="mb-12 text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Crea cursos completos en minutos con IA
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Utiliza la inteligencia artificial avanzada para generar contenido educativo estructurado,
            detallado y personalizado para tus necesidades específicas.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-4 gap-4 mb-12">
          <Card className="border-0 shadow-sm hover:shadow-md transition-shadow">
            <CardHeader className="pb-3">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center mb-2">
                <Zap className="w-5 h-5 text-blue-600" />
              </div>
              <CardTitle className="text-base">Generación Rápida</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600">
                Reduce semanas de trabajo a solo minutos con la generación automática.
              </p>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-sm hover:shadow-md transition-shadow">
            <CardHeader className="pb-3">
              <div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center mb-2">
                <Target className="w-5 h-5 text-indigo-600" />
              </div>
              <CardTitle className="text-base">Personalizado</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600">
                Adapta cursos a diferentes niveles y audiencias específicas.
              </p>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-sm hover:shadow-md transition-shadow">
            <CardHeader className="pb-3">
              <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center mb-2">
                <FileText className="w-5 h-5 text-purple-600" />
              </div>
              <CardTitle className="text-base">Estructura Completa</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600">
                Módulos, lecciones, ejercicios y evaluaciones incluidas.
              </p>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-sm hover:shadow-md transition-shadow">
            <CardHeader className="pb-3">
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center mb-2">
                <Download className="w-5 h-5 text-green-600" />
              </div>
              <CardTitle className="text-base">Exportación Flexible</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600">
                Exporta en PDF, Markdown, HTML y más formatos.
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Main Generator Section */}
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Input Section */}
          <Card className="lg:col-span-1 border-0 shadow-lg">
            <CardHeader>
              <CardTitle>Configurar Curso</CardTitle>
              <CardDescription>Completa los detalles de tu curso</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="topic">Tema del Curso</Label>
                <Input
                  id="topic"
                  placeholder="Ej: Desarrollo web para principiantes"
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                  disabled={isLoading}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="level">Nivel</Label>
                <Select value={level} onValueChange={setLevel} disabled={isLoading}>
                  <SelectTrigger id="level">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="principiante">Principiante</SelectItem>
                    <SelectItem value="intermedio">Intermedio</SelectItem>
                    <SelectItem value="avanzado">Avanzado</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="modules">Número de Módulos</Label>
                <Input
                  id="modules"
                  type="number"
                  min="1"
                  max="10"
                  value={modules}
                  onChange={(e) => setModules(parseInt(e.target.value))}
                  disabled={isLoading}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="audience">Audiencia Objetivo</Label>
                <Input
                  id="audience"
                  placeholder="Ej: Estudiantes universitarios"
                  value={audience}
                  onChange={(e) => setAudience(e.target.value)}
                  disabled={isLoading}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="objectives">Objetivos de Aprendizaje</Label>
                <Textarea
                  id="objectives"
                  placeholder="Ej: Comprender los fundamentos de HTML, CSS y JavaScript"
                  value={objectives}
                  onChange={(e) => setObjectives(e.target.value)}
                  disabled={isLoading}
                  className="min-h-24"
                />
              </div>

              <Button
                onClick={handleGenerateCourse}
                disabled={isLoading}
                className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white h-11 font-semibold"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Generando...
                  </>
                ) : (
                  <>
                    <Zap className="w-4 h-4 mr-2" />
                    Generar Curso
                  </>
                )}
              </Button>
            </CardContent>
          </Card>

          {/* Output Section */}
          <Card className="lg:col-span-2 border-0 shadow-lg">
            <CardHeader>
              <CardTitle>Contenido Generado</CardTitle>
              <CardDescription>
                {courseData ? 'Tu curso está listo para explorar y exportar' : 'Genera un curso para ver el contenido aquí'}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {courseData ? (
                <div className="space-y-4">
                  <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                    <TabsList className="grid w-full grid-cols-4">
                      <TabsTrigger value="overview">General</TabsTrigger>
                      <TabsTrigger value="content">Contenido</TabsTrigger>
                      <TabsTrigger value="exercises">Ejercicios</TabsTrigger>
                      <TabsTrigger value="quizzes">Quizzes</TabsTrigger>
                    </TabsList>

                    <TabsContent value="overview" className="space-y-4 max-h-96 overflow-y-auto">
                      <div className="space-y-3">
                        <div>
                          <h3 className="font-semibold text-lg text-gray-900">{courseData.overview.title}</h3>
                          <p className="text-sm text-gray-600 mt-1">{courseData.overview.description}</p>
                        </div>

                        <div className="grid grid-cols-2 gap-3 text-sm">
                          <div className="bg-blue-50 p-3 rounded-lg">
                            <p className="text-gray-600">Nivel</p>
                            <p className="font-semibold text-gray-900">{courseData.overview.level}</p>
                          </div>
                          <div className="bg-indigo-50 p-3 rounded-lg">
                            <p className="text-gray-600">Duración</p>
                            <p className="font-semibold text-gray-900">{courseData.overview.estimatedDuration}</p>
                          </div>
                        </div>

                        <div>
                          <p className="font-semibold text-sm text-gray-900 mb-2">Módulos ({courseData.overview.modules.length})</p>
                          <div className="space-y-2">
                            {courseData.overview.modules.map((module, index) => (
                              <div key={index} className="bg-gray-50 p-3 rounded-lg">
                                <p className="font-medium text-gray-900">
                                  Módulo {index + 1}: {module.title}
                                </p>
                                <p className="text-xs text-gray-600 mt-1">
                                  {module.lessons.length} lecciones
                                </p>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </TabsContent>

                    <TabsContent value="content" className="space-y-4 max-h-96 overflow-y-auto">
                      {courseData.content.modules.map((module, index) => (
                        <div key={index} className="space-y-2">
                          <h4 className="font-semibold text-gray-900">{module.title}</h4>
                          <div className="text-sm text-gray-600 bg-gray-50 p-3 rounded-lg whitespace-pre-wrap line-clamp-4">
                            {module.content.substring(0, 300)}...
                          </div>
                        </div>
                      ))}
                    </TabsContent>

                    <TabsContent value="exercises" className="space-y-4 max-h-96 overflow-y-auto">
                      <div className="text-sm text-gray-600 bg-gray-50 p-3 rounded-lg whitespace-pre-wrap line-clamp-6">
                        {courseData.exercises.substring(0, 500)}...
                      </div>
                    </TabsContent>

                    <TabsContent value="quizzes" className="space-y-4 max-h-96 overflow-y-auto">
                      {courseData.quizzes.map((quiz, index) => (
                        <div key={index} className="bg-gray-50 p-3 rounded-lg">
                          <p className="font-semibold text-gray-900">{quiz.title}</p>
                          <p className="text-xs text-gray-600 mt-1">
                            Dificultad: {quiz.difficulty}/5 • {quiz.questions.length} preguntas • {quiz.estimatedTime}
                          </p>
                        </div>
                      ))}
                    </TabsContent>
                  </Tabs>

                  {/* Export Buttons */}
                  <div className="grid grid-cols-2 gap-2 pt-4 border-t">
                    <Button
                      onClick={handleExportMarkdown}
                      variant="outline"
                      className="text-sm"
                    >
                      <Download className="w-4 h-4 mr-2" />
                      Markdown
                    </Button>
                    <Button
                      onClick={handleExportPDF}
                      variant="outline"
                      className="text-sm"
                    >
                      <Download className="w-4 h-4 mr-2" />
                      PDF
                    </Button>
                    <Button
                      onClick={handleExportQuiz}
                      variant="outline"
                      className="text-sm"
                    >
                      <Share2 className="w-4 h-4 mr-2" />
                      Quiz HTML
                    </Button>
                    <Button
                      onClick={handleCopyContent}
                      variant="outline"
                      className="text-sm"
                    >
                      <Copy className="w-4 h-4 mr-2" />
                      Copiar
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center h-96 text-center">
                  <BookOpen className="w-16 h-16 text-gray-300 mb-4" />
                  <p className="text-gray-500 mb-2">Genera un curso para ver el contenido aquí</p>
                  <p className="text-sm text-gray-400">
                    Completa el formulario y haz clic en "Generar Curso"
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </main>

      {/* Footer */}
      <footer className="mt-20 border-t border-gray-200 bg-white">
        <div className="container mx-auto px-4 py-8 text-center text-sm text-gray-600">
          <p>© 2025 InnovACurso+ de InnovaMotivaTech. Todos los derechos reservados.</p>
          <p className="mt-2 text-xs">
            Este es un proyecto de demostración. La calidad del contenido generado puede variar.
          </p>
        </div>
      </footer>
    </div>
  );
}
