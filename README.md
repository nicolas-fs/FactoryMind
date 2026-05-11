# 🏭 FactoryMind MVP

Agente RAG para Pymes industriales que permite:
- Subir documentos PDF/TXT y vectorizarlos con pgvector.
- Consultar procedimientos, manuales y stocks en lenguaje natural.
- Respuestas precisas con GPT-4o-mini, citando fuentes.

## Tecnologías
- Frontend: Next.js 14, TypeScript, Tailwind CSS
- Backend: FastAPI, LangChain, OpenAI, pgvector
- Base de datos: PostgreSQL + extensión pgvector

# 🧠 FactoryMind — Agente RAG para Pymes Industriales

FactoryMind es un asistente conversacional con IA que se entrena con los documentos internos de tu empresa (PDFs, TXT) y responde preguntas en español, citando la fuente y con un score de confianza.

## ✨ Funcionalidades
- Carga de documentos con generación de embeddings
- Recuperación semántica con pgvector
- Reranking con cross‑encoder
- Score de confianza por respuesta
- Agente multi‑paso (puede consultar stock, estado de pedidos)
- Diseño responsive con Tailwind CSS

## 🛠 Stack
- Frontend: Next.js 14, Tailwind
- Backend: FastAPI, Python
- BD: PostgreSQL + pgvector
- IA: OpenAI gpt-4o‑mini
- Infra: Docker Compose

## ⚡ Inicio rápido
```bash
git clone https://github.com/nicolas-fs/FactoryMind.git
cd FactoryMind
cp .env.example .env
docker-compose up -d --build

## Instalación rápida

### 1. Clonar el repositorio
```bash
git clone https://github.com/tuusuario/factorymind.git
cd factorymind

README.md
markdown
# 🧠 FactoryMind

**Agente RAG inteligente para PyMEs industriales.**  
Subí tus manuales, procedimientos y documentos internos. Preguntale lo que necesités y obtené respuestas precisas, con fuentes verificables y acciones automatizadas.

---

![FactoryMind Dashboard](https://via.placeholder.com/1200x600?text=FactoryMind+Dashboard)

---

## ✨ Características principales

- 📄 **Carga de documentos** – PDF y TXT. Troceo automático y generación de embeddings.
- 🔍 **RAG con reranking** – Recuperación semántica (pgvector) + cross‑encoder que reordena los chunks más relevantes.
- 📊 **Score de confianza** – Cada respuesta muestra un porcentaje de similitud semántica.
- 🤖 **Agente multi‑paso** – Si la consulta requiere una acción (stock, pedidos), el agente la ejecuta e integra el resultado.
- 💬 **Chat con memoria** – Historial de los últimos 6 mensajes. Respuestas en español, con fuentes citadas.
- 🎨 **Interfaz profesional** – Next.js + Tailwind CSS, diseño responsive, modo claro listo.
- 🐳 **Despliegue con Docker** – Cuatro servicios orquestados: base de datos, reranker, backend y frontend.
- 🧪 **Modo mock** – Activá `MOCK_MODE=true` para probar sin API Key de OpenAI.

---

## 🏗️ Arquitectura
Usuario → Frontend (Next.js) → Backend (FastAPI) → PostgreSQL + pgvector
↓
Reranker (Cross‑Encoder)
↓
OpenAI (gpt‑4o‑mini)

text

1. **Frontend** – Next.js 14 con Tailwind CSS.
2. **Backend** – FastAPI que orquesta la recuperación de documentos, el reranking y la ejecución de acciones.
3. **Base de datos** – PostgreSQL con extensión `pgvector` para búsqueda semántica.
4. **Reranker** – Microservicio con `cross‑encoder/ms‑marco‑MiniLM‑L‑6‑v2` que reordena los chunks por relevancia real.
5. **LLM** – OpenAI `gpt‑4o‑mini` para generación de respuestas (mock disponible para desarrollo).

---

## 🛠️ Stack tecnológico

| Área       | Tecnología                                          |
|------------|-----------------------------------------------------|
| Frontend   | Next.js 14, React, Tailwind CSS, TypeScript         |
| Backend    | Python 3.11, FastAPI, LangChain, OpenAI API         |
| Base datos | PostgreSQL 16 + pgvector                             |
| Reranker   | FastAPI, sentence‑transformers                      |
| Infra      | Docker, Docker Compose                              |
| CI/CD      | GitHub Actions (pendiente)                          |

---

## 📋 Requisitos previos

- [Docker](https://www.docker.com/) y Docker Compose.
- (Opcional) Node.js 18+ y Python 3.11 para desarrollo local.
- API Key de OpenAI (solo para producción; desarrollo usa `MOCK_MODE=true`).

---

## 🚀 Instalación y uso

```bash
# 1. Clonar el repositorio
git clone https://github.com/nicolas-fs/FactoryMind.git
cd FactoryMind

# 2. Configurar variables de entorno
cp .env.example .env
# Editar .env con tu API Key y configuración

# 3. Levantar los servicios
docker compose up -d --build
La aplicación estará disponible en:

Servicio	URL
Frontend	http://localhost:3000
Backend API	http://localhost:8000
Reranker	http://localhost:8001
⚙️ Variables de entorno principales (.env)
text
OPENAI_API_KEY=sk-...
DATABASE_URL=postgresql://factorymind:factorymind123@db:5432/factorymind
MOCK_MODE=true                # Cambiar a false en producción
RERANK_ENABLED=true           # Activar reranking
RERANKER_URL=http://reranker:8001
ACTIONS_ENABLED=true          # Activar agente multi‑paso
📁 Estructura del proyecto
text
factorymind/
├── backend/
│   ├── main.py               # Endpoints /upload, /chat, /health
│   ├── actions.py            # Acciones ejecutables por el agente
│   ├── requirements.txt      # Dependencias Python
│   └── Dockerfile
├── frontend/
│   ├── app/                  # Layout, páginas, estilos
│   ├── components/           # ChatWindow, Navbar, etc.
│   ├── tailwind.config.ts    # Configuración de Tailwind
│   ├── tsconfig.json         # Configuración de TypeScript
│   └── Dockerfile
├── services/
│   └── reranker/
│       ├── main.py           # Microservicio de reranking
│       ├── requirements.txt
│       └── Dockerfile
├── docker-compose.yml        # Orquestación de los 4 servicios
├── init_db.sql               # Esquema de la base de datos
└── .env.example              # Plantilla de variables de entorno
🔌 Endpoints de la API
GET /health
Estado del backend.

json
{ "status": "healthy", "service": "FactoryMind RAG Agent" }
POST /upload
Subir un documento (PDF o TXT).

bash
curl -X POST -F "file=@manual.pdf" http://localhost:8000/upload
POST /chat
Enviar una pregunta al agente.

bash
curl -X POST http://localhost:8000/chat \
  -H "Content-Type: application/json" \
  -d '{"question":"¿Cuál es el procedimiento de devolución?"}'
Respuesta:

json
{
  "answer": "El procedimiento de devolución requiere...",
  "source": "manual_calidad.pdf",
  "confidence": 94
}
👥 Equipo
Desarrollado por Soluciones Digitales Studio — un equipo de 14 especialistas que combina ingeniería de software, inteligencia artificial y estrategia de negocio.

CEO & Full‑Stack Developer – Nicolás FS

Applied AI Engineer – Iker Alonso

Tech Lead – Héctor

DevOps – Andrés

Diseñador Gráfico – Luca

UX/UI Designer – Valeria

Copywriter – Sofía

Community Manager – Martina

QA Engineer – Javier

Project Manager – Elena

Business Developer – Camila

Sales Executive Lead – Mateo Rivas

CFO – Gabriela

Data Analyst – Adriana

Legal & Compliance – Ricardo

Meta Ads Strategist – Valentina Ríos

📄 Licencia
MIT © 2026 Soluciones Digitales Studio

text

---

`[Copy] Sofía:`  
El README está listo. Lo escribí en español, con emojis donde suma y sin tecnicismos innecesarios. Cualquier ajuste lo hago en segundos.

`[CM] Martina:`  
CEO, en cuanto hagas el push con este README, publico el post de LinkedIn y etiqueto el repo oficial. ¿Procedemos?
