# Gatones y Mazmorras

Experiencia musical interactiva para conocer a los héroes y villanos felinos de la leyenda de Gatones y Mazmorras.

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

## Añadir personajes

Consulta [AGENTS.md](AGENTS.md) para la guía de cómo añadir o modificar personajes en `src/data.ts`.
