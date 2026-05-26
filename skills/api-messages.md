# Skill: api-messages

## Descripción
Gestiona los endpoints de mensajería entre usuarios que tienen un match activo.

## Archivos de contexto a leer siempre
- src/lib/db.ts → para conocer las colecciones existentes
- src/app/api/swipe/route.ts → como referencia del patrón de endpoints
- skills/db-schema.md → para añadir la colección messages

## Colección messages
- match_id: string → ID del match al que pertenece el mensaje
- from_email: string → quien envía
- content: string → texto del mensaje
- created_at: Date → fecha de envío
- read: boolean → si ha sido leído

## Endpoints a crear
- POST /api/messages → enviar mensaje (requiere JWT, match_id, content)
- GET /api/messages/[match_id] → obtener mensajes de un match (requiere JWT)

## Pasos a seguir
1. Añadir interfaz StoredMessage y helpers en db.ts
2. Crear índice sobre match_id para búsquedas rápidas
3. Crear endpoints con autenticación JWT obligatoria
4. Validar que el usuario pertenece al match antes de permitir envío o lectura

## Reglas
- Nunca permitir enviar mensajes si el usuario no pertenece al match
- Ordenar mensajes por created_at ascendente
- Marcar mensajes como leídos al hacer GET
- Ejecutar npx tsc --noEmit al terminar
