# Instrucciones de Escalabilidad para Agentes IA (Gatones y Mazmorras)

Este documento sirve como guía técnica y de comportamiento para añadir, modificar o eliminar personajes de la aplicación de manera ágil con simples prompts en lenguaje natural.

---

## 🛠️ Estructura del Modelo de Datos (Character)

Cada personaje se define como un objeto que cumple la interfaz de TypeScript `Character` dentro de `/src/data.ts`.

### Esquema de un Personaje:

```typescript
export interface Character {
  id: string;             // Identificador único (ej: 'gandalf')
  name: string;           // Nombre visible en la interfaz (ej: 'Miss William')
  subtitle: string;       // Título legendario o rol (ej: 'La Valiente Paladina')
  desc: string;           // Descripción narrativa (será mostrada con excelente formato)
  color: string;          // Color hexadecimal primario de su aura y detalles (ej: '#fbbc06')
  borderColor: string;    // Clase Tailwind CSS correspondiente (ej: 'border-[#fbbc06]')
  img: string;            // URL de fallback o imagen remota alternativa
  image: string;          // Ruta local a la imagen en el directorio /public/characters/
  category: string;       // Categoría (ej: 'Héroe', 'Villano', 'Aliado', 'Neutral', etc.)
  stats: {
    fuerza: number;       // Valor entre 0 y 100 de cada estadística
    agilidad: number;
    inteligencia: number;
    carisma: number;
    ritmo: number;
  };
  instrumentName: string; // Nombre de su instrumento o vibración rítmica
  notes: number[];        // Frecuencias en Hz para su arpegio (ej: [220, 261.63, 293.66, 329.63, 392.00])
}
```

---

## 🚀 Plantilla de Prompt para Añadir Personajes

Si deseas que un Agente IA añada nuevos personajes en el futuro, copia y adapta este prompt modelo:

> **PROMPT MODELO DE EJEMPLO:**
> 
> *"Añade un nuevo personaje en `/src/data.ts` que represente a un **mago misterioso llamado Mago Gris**, con el ID `mago_gris`. Su rol es `El Sabio Errante`, su categoría es `Héroe` y su descripción es `Un consejero legendario...`. Su color temático es el plateado `#94a3b8` (su clase de borde es `border-[#94a3b8]`). Ponle estadísticas equilibradas de fuerza 40, agilidad 60, inteligencia 98, carisma 90, ritmo 75. Su instrumento es 'Báculo del Viento Susurrante' con un arpegio elegante de notas en frecuencias mágicas elevadas `[329.63, 392.00, 440.00, 523.25, 659.25]`. La dirección de su imagen local es `/characters/mago_gris_card-Photoroom.png`."*

---

## 🎨 Personalización de Colores y Estilos

Cuando agregues nuevos elementos:
1. **Asignación de Color**: Elige un color hexadecimal (`color`) llamativo y con contraste.
2. **Clase de Borde**: Asegúrate de declarar el color en `borderColor` respetando la notación arbitraria de Tailwind (`border-[#HEXCOLOR]`).
3. **Fluidez automática**: Todo el sistema (barras de sonido inferiores, aura, destello, láseres interactivos al hacer clic, las animaciones de carga escalonadas en 3D y las partículas en suspensión) se adapta automáticamente al color definido en el objeto del personaje. No hace falta añadir código extra en los componentes.
