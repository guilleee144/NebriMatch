# Skill: qa-review

Normas de calidad y auditoría de código para asegurar la robustez, mantenibilidad y el cumplimiento estricto de las directrices del proyecto.

## Contexto a Leer
- Todos los archivos modificados durante una iteración (ej. endpoints, componentes de UI, esquemas y helpers).

## Pasos a Seguir
1. **Verificación de TypeScript Estricto**:
   - Asegurarse de que no existe ninguna ocurrencia del tipo `any` en los archivos creados o editados. Todos los objetos, funciones y retornos de API deben tener tipos definidos de forma explícita.
   - Tratar de forma segura los valores nulos (`null`) o indefinidos (`undefined`) en la UI (ej. opcionales `{currentProfile.edad ? ... : ""}`).
2. **Revisión de Principios SOLID**:
   - **Responsabilidad Única (SRP)**: Un endpoint o componente debe resolver únicamente su problema (ej. la API de swipe solo maneja swipes y matches; la página de matches solo se encarga del renderizado de coincidencias).
   - **Abstracción de Base de Datos**: Los endpoints no deben instanciar conexiones directas ni manipular la base de datos de manera cruda si existen funciones helper exportadas en `src/lib/db.ts` para esa responsabilidad.
3. **Manejo Correcto de Excepciones**:
   - Todo endpoint de API y script en segundo plano debe contar con una estructura `try/catch` para capturar errores, evitando caídas inesperadas e informando debidamente en los logs con formatos comprensibles.
4. **Validación de Compilación en Desarrollo**:
   - Siempre ejecutar `npx tsc --noEmit` después de realizar cambios para detectar errores de tipos en tiempo de compilación.

## Reglas Específicas
- **Tipos de Librerías Externas**: Asegurar que las dependencias externas (como `bcryptjs`, `framer-motion` o `lucide-react`) estén importadas correctamente con sus tipos asociados o manejadas a través de envolturas seguras.
- **Formateo**: Mantener la estética premium y limpia de la base de código eliminando trazas de depuración de consola en producción (`console.log` innecesarios) y comentarios obvios o redundantes.
- **Seguridad**: Proteger siempre las vistas o recursos privados en el frontend y backend mediante verificación previa del token de sesión.
