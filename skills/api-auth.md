# Skill: api-auth

Patrón de implementación para proteger rutas de API y autenticar peticiones utilizando tokens JWT en las cabeceras/cookies en Next.js.

## Contexto a Leer
- [src/lib/auth.ts](file:///c:/Users/guill/Desktop/MASTER_BIG_DATA_IA/IA/NebriMatch/src/lib/auth.ts)
- [src/app/api/auth/me/route.ts](file:///c:/Users/guill/Desktop/MASTER_BIG_DATA_IA/IA/NebriMatch/src/app/api/auth/me/route.ts)

## Pasos a Seguir
1. **Extracción del Token**: Extraer el token de las cookies de la petición entrante usando `req.cookies.get("token")?.value`.
2. **Validación del Token**: Validar el token contra la clave secreta con `verifyToken(token)`.
3. **Control de Acceso (401)**: Si el token no existe o no es válido, retornar inmediatamente un JSON con `{ error: "No autenticado" }` o `{ error: "Token inválido" }` y el código de estado HTTP `401`.
4. **Extracción de Identidad**: Obtener el identificador o email del usuario desde el payload del token y realizar la lógica de negocio requerida en el endpoint.
5. **Manejo de Errores General (500)**: Envolver todo en un bloque `try/catch` para devolver `{ error: "Error interno del servidor" }` con código `500` en caso de fallos inesperados.

## Reglas Específicas
- **HTTP Only Cookies**: Las credenciales de sesión se gestionan exclusivamente del lado del servidor usando cookies seguras con atributo `httpOnly`.
- **Validación del Payload**: No asumir que el payload del JWT contiene datos correctos sin antes verificar la estructura o, si es necesario, validar la existencia del usuario en la base de datos.
- **Mensajes de Error Seguros**: Evitar exponer trazas de errores internas (ej. de la base de datos) al cliente en las respuestas HTTP de error.
