# Skill: db-migration

Patrón para diseñar y ejecutar migraciones de datos e índices de base de datos de manera segura, idempotente y tolerante a fallos.

## Contexto a Leer
- [src/lib/db.ts](file:///c:/Users/guill/Desktop/MASTER_BIG_DATA_IA/IA/NebriMatch/src/lib/db.ts) (función `ensureMigrated`)

## Pasos a Seguir
1. **Ejecución Automática**: La función de migración (`ensureMigrated`) debe autoejecutarse cuando se importa el archivo de base de datos en la aplicación.
2. **Idempotencia**: Diseñar la lógica de manera que el script pueda ejecutarse ilimitadas veces sin duplicar registros ni corromper los esquemas existentes.
3. **Manejo Seguro de Índices**:
   - Al crear un índice único o compuesto, siempre usar un bloque `try/catch` para intentar eliminar la versión anterior del índice (`dropIndex`) antes de recrearlo. Esto evita que la aplicación falle si las propiedades del índice (como `unique`) cambian.
4. **Carga e Inicialización de Datos por Defecto**:
   - Comprobar la presencia de datos anteriores antes de insertar registros de semillas (`seed`) o migraciones de JSON locales.
   - Crear perfiles por defecto vinculados en colecciones secundarias (ej. crear registro en `user_data` cuando se detecta un nuevo registro en `users`).

## Reglas Específicas
- **Tolerancia a Conflictos de Índices**: Usar nombres explícitos de índices en el driver de MongoDB para poder eliminarlos de forma predecible. Ejemplo: `try { await collection.dropIndex("index_name"); } catch {}`.
- **Manejo de Excepciones**: Envolver todo el proceso dentro de un bloque `try/catch` general para que fallos de conexión o migración no tumben por completo el inicio de la aplicación web, registrando los errores claramente en consola.
- **Sin Pérdida de Datos**: Nunca eliminar colecciones completas dentro de un flujo automatizado de migración sin confirmación del administrador.
