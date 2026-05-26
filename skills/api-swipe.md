# Skill: api-swipe

Lógica para registrar interacciones entre usuarios (swipes) y detectar de manera inmediata coincidencias mutuas (matches) en tiempo real.

## Contexto a Leer
- [src/app/api/swipe/route.ts](file:///c:/Users/guill/Desktop/MASTER_BIG_DATA_IA/IA/NebriMatch/src/app/api/swipe/route.ts)
- [src/lib/db.ts](file:///c:/Users/guill/Desktop/MASTER_BIG_DATA_IA/IA/NebriMatch/src/lib/db.ts) (métodos `createSwipe`, `findSwipe` y `createMatch`)

## Pasos a Seguir
1. **Autenticación**: Validar el usuario actual mediante el token de sesión.
2. **Validación del Body**: Validar los parámetros recibidos (`to_email` y `action`). La acción debe restringirse estrictamente a `"like"` o `"pass"`.
3. **Registro de la Interacción**: Guardar el swipe en base de datos.
   - Es necesario prevenir problemas de duplicados debido a múltiples clics rápidos manejando el error de clave duplicada del índice único `{ from_email, to_email }`.
4. **Verificación de Match Mutuo**:
   - Si la acción realizada es un `"like"`, buscar en la base de datos si existe una interacción previa de la otra persona hacia el usuario actual (`to_email` hacia `from_email`) que también sea un `"like"`.
5. **Creación del Registro de Match**:
   - Si existe el like mutuo, insertar un documento en la colección de `matches` con el estado `"matched"`.
   - Controlar conflictos de clave duplicada sobre `{ user1_email, user2_email }`.
6. **Respuesta**: Devolver al frontend si la operación fue exitosa y si se ha producido un match mutuo (`{ success: true, matched: true }`).

## Reglas Específicas
- **Idempotencia**: Si el usuario intenta realizar un swipe que ya existe, la API debe ignorar el error del índice único de MongoDB y responder de manera exitosa para no romper la experiencia en el frontend.
- **Detección Bidireccional**: Para prevenir duplicados en la colección de matches, los correos deben compararse de forma consistente en el orden en que se crearon los likes o aplicando un índice compuesto ordenado.
