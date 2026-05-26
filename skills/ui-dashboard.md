# Skill: ui-dashboard

Guía para estructurar y estilizar la pantalla principal de deslizado (Swipe Deck) respetando la estética premium, oscura y animada de la plataforma.

## Contexto a Leer
- [src/app/dashboard/page.tsx](file:///c:/Users/guill/Desktop/MASTER_BIG_DATA_IA/IA/NebriMatch/src/app/dashboard/page.tsx)
- [src/components/Navbar.tsx](file:///c:/Users/guill/Desktop/MASTER_BIG_DATA_IA/IA/NebriMatch/src/components/Navbar.tsx)

## Pasos a Seguir
1. **Layout y Fondo**:
   - Usar el color de fondo oscuro `#050505` a pantalla completa.
   - Posicionar dos luces de fondo difuminadas (`blur-[150px]`) con los colores de la marca: azul (`#0052FF/10`) a la izquierda y violeta (`#8B5CF6/10`) a la derecha.
2. **Estructura de Tarjeta Centrada**:
   - Encapsular la experiencia de deslizado en un contenedor con un ancho máximo de `420px`.
   - Centrar el contenedor tanto horizontal como verticalmente en el viewport.
3. **Estilo Glassmorphic**:
   - Las tarjetas de perfil y modales deben aplicar el estilo `glass-card`, con bordes sutiles semi-transparentes (`border-white/10`), fondo translúcido (`bg-[#09090b]/90`), desenfoque de fondo (`backdrop-blur-3xl`) y sombras profundas.
   - Cada tarjeta debe contar con una línea de acento superior con un degradado dinámico e interactivo según el nombre del perfil expuesto.
4. **Animaciones Fluidas**:
   - Usar `framer-motion` para animar la entrada de perfiles nuevos (`initial`, `animate`) y las salidas hacia la izquierda (descarte) o derecha (conexión) aplicando rotación y traslación suaves.
5. **Overlay de Celebración**:
   - Al producirse un match, se debe desplegar un overlay a pantalla completa (`fixed inset-0`) con fondo translúcido súper oscuro (`bg-black/90`), efecto blur y animaciones de rebote (`animate-bounce`) y escala para la tarjeta de felicitación del match.

## Reglas Específicas
- **Mobile First**: Todo el contenido y las tarjetas deben escalar correctamente en dispositivos móviles reduciendo márgenes sin que se corte ningún elemento o botón de control.
- **Micro-interacciones**: Los botones de acción rápida ("Pasar" y "Conectar") deben reaccionar al estado `hover` trasladando ligeramente sus iconos internos para simular dirección.
- **Fallbacks Robustos**: Si la API externa tarda en responder o no hay datos, mostrar siempre un indicador de carga (`Loader2` animado) o usar los datos locales de respaldo (`MOCK_PROFILES`).
