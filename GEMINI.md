# NebriMatch — Agentes y Skills

## IDENTIDAD DEL PROYECTO
Aplicación de networking profesional (Next.js + TypeScript + MongoDB Atlas).
Metodología: Extreme Programming (XP) — iteraciones cortas, feedback continuo.

---

## AGENTES DEFINIDOS

### 🗄️ db-agent
**Responsabilidad**: Todo lo relacionado con MongoDB.
**Skills**: db-schema, db-migration, db-query
**Contexto obligatorio**: Siempre leer src/lib/db.ts y src/lib/mongodb.ts antes de actuar.
**Reglas**:
- Nunca eliminar colecciones existentes sin confirmación explícita
- Siempre crear índices para campos de búsqueda frecuente
- Siempre usar TypeScript interfaces para cada colección
- Documentar cada colección con JSDoc
- Ejecutar npx tsc --noEmit al terminar

### 🔌 api-agent
**Responsabilidad**: Endpoints de Next.js en src/app/api/
**Skills**: api-auth, api-swipe, api-matches, api-chat, api-messages
**Contexto obligatorio**: Leer db.ts para conocer la estructura antes de crear endpoints.
**Reglas**:
- Todos los endpoints protegidos requieren JWT válido (401 si no)
- Siempre try/catch con mensajes de error claros
- Seguir principio Single Responsibility: un endpoint, una responsabilidad
- Validar inputs antes de tocar la base de datos
- Ejecutar npx tsc --noEmit al terminar

### 🎨 ui-agent
**Responsabilidad**: Páginas y componentes en src/app/ y src/components/
**Skills**: ui-dashboard, ui-chat, ui-matches, ui-profile
**Contexto obligatorio**: Leer el componente existente más cercano para mantener consistencia visual.
**Reglas**:
- Mantener siempre el diseño oscuro premium de la app
- Componentes reutilizables, nunca duplicar código visual
- Mobile-first en todos los componentes
- Usar el AuthContext para proteger páginas privadas
- Ejecutar npx tsc --noEmit al terminar

### 🧪 qa-agent
**Responsabilidad**: Revisión de calidad del código generado.
**Skills**: qa-typescript, qa-solid, qa-review
**Reglas**:
- Verificar principios SOLID en cada archivo revisado
- Identificar código duplicado y proponer refactor
- Asegurar que no hay any en TypeScript
- Revisar que todos los endpoints tienen manejo de errores
- Generar reporte de hallazgos antes de aplicar cambios

---

## SKILLS DEFINIDAS

### [db-schema](skills/db-schema.md)
Diseña o modifica la estructura de colecciones MongoDB.
Siempre incluir: interfaz TypeScript, índices, helpers CRUD básicos.

### [db-migration](skills/db-migration.md)
Gestiona migraciones de datos existentes.
Siempre incluir: migración idempotente (puede ejecutarse varias veces sin romper).

### [api-auth](skills/api-auth.md)
Gestiona endpoints de autenticación.
Patrón: leer JWT → validar → ejecutar → responder.

### [api-swipe](skills/api-swipe.md)
Gestiona la lógica de swipe y detección de matches mutuos.

### [api-messages](skills/api-messages.md)
Gestiona endpoints de mensajería entre usuarios con match activo.

### [ui-dashboard](skills/ui-dashboard.md)
Gestiona la página principal de swipe.
Mantener cards centradas, diseño premium, sin elementos cortados.

### [qa-review](skills/qa-review.md)
Revisa un archivo o conjunto de archivos.
Output: lista de problemas encontrados ordenados por severidad (alta/media/baja).

---

## FLUJO DE TRABAJO ESTÁNDAR

Para cada nueva feature seguir este orden:
1. db-agent → define o modifica colecciones necesarias
2. api-agent → crea endpoints que usan esas colecciones  
3. ui-agent → crea la UI que consume esos endpoints
4. qa-agent → revisa todo lo generado

---

## REGLAS GLOBALES (aplican a todos los agentes)

- Metodología XP: cada tarea debe ser pequeña y entregable de forma independiente
- Clean Code: nombres descriptivos, funciones pequeñas, sin comentarios obvios
- SOLID: especialmente Single Responsibility y Dependency Inversion
- Nunca escribir código sin leer primero los archivos relevantes existentes
- Siempre verificar compilación TypeScript al terminar cualquier tarea
- Documentar decisiones técnicas no obvias con comentarios JSDoc