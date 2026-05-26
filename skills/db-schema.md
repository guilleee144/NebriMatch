# Skill: db-schema

Patrón de diseño para modelar y estructurar colecciones en MongoDB Atlas utilizando TypeScript y tipado estricto.

## Contexto a Leer
- [src/lib/db.ts](file:///c:/Users/guill/Desktop/MASTER_BIG_DATA_IA/IA/NebriMatch/src/lib/db.ts)
- [src/lib/mongodb.ts](file:///c:/Users/guill/Desktop/MASTER_BIG_DATA_IA/IA/NebriMatch/src/lib/mongodb.ts)

## Pasos a Seguir
1. **Definir la Interfaz de TypeScript**: Cada colección debe tener una interfaz que comience con el prefijo `Stored` (ej. `StoredUser`, `StoredSwipe`). Esta interfaz modela la estructura exacta de los documentos tal y como se guardan en la base de datos.
2. **Crear Helper para Obtener la Colección**: Implementar una función asíncrona exportada con el nombre `get[Colección]Collection()` que use `clientPromise` para acceder a la base de datos y tipar la colección con la interfaz creada.
3. **Definir los Helpers CRUD Básicos**: Crear las funciones necesarias para interactuar con la colección (inserciones, búsquedas por claves únicas, etc.) asegurando el tipado correcto de los parámetros y del valor de retorno.
4. **Agregar Lógica de Índices en la Migración**: Asegurar que cualquier índice requerido por el esquema (especialmente índices únicos o compuestos) esté registrado dentro del proceso de migración de la base de datos.

## Reglas Específicas
- **Tipado Estricto**: Nunca utilizar `any` en los helpers o en la interfaz. Usar tipos nativos y opcionales cuando corresponda (ej. `number | null`).
- **Nombres Descriptivos**: Los helpers CRUD deben ser claros, como `createSwipe` o `findSwipe`.
- **Gestión de Colecciones**: Siempre usar colecciones tipadas (`db.collection<StoredInterface>("name")`) para prevenir inconsistencias de tipos durante las consultas.
- **Campos Obligatorios**: Todo documento de interacción o registro debe contener una fecha de creación (`created_at: Date` o `createdAt: string`).
