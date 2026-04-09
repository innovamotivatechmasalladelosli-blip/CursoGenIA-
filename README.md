# InnovACurso+ - Generador de Cursos con IA

**Generador de cursos completos en minutos utilizando inteligencia artificial avanzada (Google Gemini)**

![InnovACurso+](https://img.shields.io/badge/InnovACurso+-Generador%20de%20Cursos%20con%20IA-blue)
![License](https://img.shields.io/badge/license-MIT-green)
![Status](https://img.shields.io/badge/status-Active-brightgreen)

## 🚀 Características Principales

- **Generación Automática de Cursos**: Crea cursos completos en minutos con contenido estructurado y de calidad
- **Personalización Flexible**: Adapta cursos a diferentes niveles (principiante, intermedio, avanzado) y audiencias
- **Contenido Estructurado**: Módulos, lecciones, ejercicios prácticos y cuestionarios interactivos
- **Múltiples Formatos de Exportación**:
  - Markdown (.md)
  - PDF (HTML)
  - HTML interactivo para quizzes
  - Copiar al portapapeles
- **Cuestionarios Gamificados**: Quizzes interactivos con retroalimentación inmediata
- **Interfaz Moderna**: Diseño responsivo y amigable con usuario
- **Integración con Google Gemini API**: Utiliza la última tecnología de IA para generar contenido

## 📋 Requisitos Previos

- Node.js 18+ 
- npm o pnpm
- Clave de API de Google Gemini (incluida en el proyecto)

## 🛠️ Instalación

### 1. Clonar el Repositorio

```bash
git clone https://github.com/innovamotivatechmasalladelosli-blip/CursoGenIA-.git
cd CursoGenIA-
```

### 2. Instalar Dependencias

```bash
pnpm install
# o
npm install
```

### 3. Iniciar el Servidor de Desarrollo

```bash
pnpm dev
# o
npm run dev
```

La aplicación estará disponible en `http://localhost:3000`

## 📖 Uso

### Generar un Curso

1. **Completa el formulario** con los siguientes campos:
   - **Tema del Curso**: El tema principal (ej: "Desarrollo web para principiantes")
   - **Nivel**: Selecciona entre Principiante, Intermedio o Avanzado
   - **Número de Módulos**: Entre 1 y 10 módulos
   - **Audiencia Objetivo**: A quién va dirigido el curso
   - **Objetivos de Aprendizaje**: Qué deben aprender los estudiantes

2. **Haz clic en "Generar Curso"** y espera a que se genere el contenido

3. **Explora el contenido** en las diferentes pestañas:
   - **General**: Vista general del curso
   - **Contenido**: Contenido detallado de cada módulo
   - **Ejercicios**: Ejercicios prácticos
   - **Quizzes**: Cuestionarios interactivos

### Exportar el Contenido

Una vez generado el curso, puedes:

- **Descargar como Markdown**: Perfecto para documentación
- **Descargar como PDF**: Para impresión o distribución
- **Descargar Quiz HTML**: Cuestionarios interactivos independientes
- **Copiar Contenido**: Copia el contenido completo al portapapeles

## 🏗️ Estructura del Proyecto

```
CursoGenIA-App/
├── client/
│   ├── public/              # Archivos estáticos
│   ├── src/
│   │   ├── components/      # Componentes React reutilizables
│   │   ├── contexts/        # Contextos de React
│   │   ├── hooks/           # Hooks personalizados
│   │   ├── lib/
│   │   │   ├── aiService.ts # Integración con Google Gemini API
│   │   │   └── exportUtils.ts # Utilidades de exportación
│   │   ├── pages/
│   │   │   └── Home.tsx     # Página principal
│   │   ├── App.tsx          # Componente raíz
│   │   ├── main.tsx         # Punto de entrada
│   │   └── index.css        # Estilos globales
│   └── index.html           # HTML principal
├── server/                  # Servidor Express (placeholder)
├── package.json             # Dependencias del proyecto
└── README.md               # Este archivo
```

## 🔧 Configuración

### API de Google Gemini

La clave de API ya está incluida en `client/src/lib/aiService.ts`. Si necesitas cambiarla:

```typescript
const GEMINI_API_KEY = 'tu-clave-aqui';
const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent';
```

## 📚 Funcionalidades Detalladas

### 1. Generación de Vista General

Crea un resumen completo del curso incluyendo:
- Título atractivo
- Descripción detallada
- Estructura de módulos
- Duración estimada
- Prerrequisitos

### 2. Generación de Contenido Detallado

Para cada módulo genera:
- Explicaciones teóricas claras
- Ejemplos prácticos
- Código de ejemplo (cuando es relevante)
- Puntos clave a recordar

### 3. Generación de Ejercicios

Crea ejercicios prácticos que:
- Refuerzan conceptos aprendidos
- Incluyen instrucciones paso a paso
- Tienen criterios de evaluación
- Progresan en dificultad

### 4. Generación de Cuestionarios

Crea quizzes interactivos con:
- Preguntas de opción múltiple
- Diferentes niveles de dificultad
- Explicaciones para cada respuesta
- Tiempo estimado de completación

## 🎨 Tecnologías Utilizadas

- **Frontend**: React 19 + TypeScript
- **Estilos**: Tailwind CSS 4
- **Componentes UI**: shadcn/ui
- **Enrutamiento**: Wouter
- **IA**: Google Gemini API
- **Build Tool**: Vite
- **Notificaciones**: Sonner

## 📝 Ejemplos de Uso

### Ejemplo 1: Curso de Python para Principiantes

```
Tema: Python para Principiantes
Nivel: Principiante
Módulos: 4
Audiencia: Estudiantes sin experiencia en programación
Objetivos: Aprender sintaxis básica, variables, funciones y estructuras de control
```

### Ejemplo 2: Curso Avanzado de React

```
Tema: React Avanzado: Hooks y Context API
Nivel: Avanzado
Módulos: 5
Audiencia: Desarrolladores con experiencia en React
Objetivos: Dominar hooks personalizados, Context API, y patrones avanzados
```

## 🚀 Despliegue

### Compilar para Producción

```bash
pnpm build
# o
npm run build
```

### Iniciar en Producción

```bash
pnpm start
# o
npm start
```

## 🤝 Contribuciones

Las contribuciones son bienvenidas. Por favor:

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📄 Licencia

Este proyecto está bajo la Licencia MIT. Ver el archivo `LICENSE` para más detalles.

## 👥 Autores

- **InnovaMotivaTech** - Equipo de desarrollo
- Módulo InnovA+

## 📞 Soporte

Para reportar problemas o sugerencias, por favor abre un issue en el repositorio de GitHub.

## 🙏 Agradecimientos

- Google por la API de Gemini
- La comunidad de React y TypeScript
- shadcn/ui por los componentes UI
- Tailwind CSS por el framework de estilos

## 📊 Estadísticas del Proyecto

- **Lenguaje Principal**: TypeScript
- **Líneas de Código**: ~2000+
- **Componentes**: 15+
- **Funciones de Exportación**: 5
- **Modelos de IA Soportados**: Google Gemini Pro

## 🔮 Roadmap Futuro

- [ ] Soporte para más modelos de IA
- [ ] Generación de imágenes para cursos
- [ ] Integración con plataformas LMS
- [ ] Sistema de análisis de estudiantes
- [ ] Generación de certificados
- [ ] Modo colaborativo para múltiples autores
- [ ] Integración con sistemas de pago

## ⚠️ Disclaimer

Este es un proyecto de demostración. La calidad del contenido generado puede variar según los parámetros de entrada. Se recomienda revisar y editar el contenido generado antes de usarlo en producción.

---

**Hecho con ❤️ por InnovaMotivaTech**
