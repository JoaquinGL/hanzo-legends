# Hanzo Legends

Presentación interactiva de los departamentos de **Hanzo**. Cada departamento se muestra como una tarjeta con animaciones 3D, estadísticas y sonido, pensada para conocer el equipo y su rol dentro de la compañía de forma visual y memorable.

## Requisitos

- Node.js 22+ (usa `nvm use` si tienes [nvm](https://github.com/nvm-sh/nvm))

## Desarrollo local

1. Instala dependencias:

   ```bash
   npm install
   ```

2. Arranca el servidor de desarrollo:

   ```bash
   npm run dev
   ```

   La app estará disponible en [http://localhost:3000](http://localhost:3000).

## Scripts

| Comando | Descripción |
|---|---|
| `npm run dev` | Servidor de desarrollo con Vite |
| `npm run build` | Build de producción en `dist/` |
| `npm run preview` | Previsualiza el build de producción |
| `npm run lint` | Comprueba tipos con TypeScript |
| `npm run clean` | Elimina la carpeta `dist/` |

## Añadir departamentos

Los departamentos se definen en `src/data.ts`. Consulta [AGENTS.md](AGENTS.md) para la guía de cómo añadir, editar o eliminar tarjetas: el sistema aplica automáticamente colores, animaciones 3D, estadísticas y arpegios de sonido a cada entrada.
