import { Character } from './types';
import strike01 from './assets/images/strike_01.png';
import strike02 from './assets/images/strike_02.png';
import strike03 from './assets/images/strike_03.png';
import strike04 from './assets/images/strike_04.png';
import strike05 from './assets/images/strike_05.png';
import finalImage from './assets/images/final.png';

/**
 * =========================================================================
 * 🚀 GUÍA DE ESCALABILIDAD (Hanzo legends)
 * =========================================================================
 * Para añadir, editar o remover personajes con facilidad, consulta /AGENTS.md
 * en la raíz del proyecto. El sistema renderizará, animará y aplicará los
 * efectos 3D, carga de estadísticas y arpegios de sonido de forma 100% dinámica.
 * =========================================================================
 */
export const characters: Character[] = [
  {
    id: 'visual',
    name: 'Visual',
    title: 'P.P.C.Q.S.M',
    subtitle: "Pixel Perfet cuidao' que se mueve",
    description: [
      'Transforman ideas, wireframes y conversaciones caóticas en algo que la gente quiere mirar sin sufrir.',
      'No pidieron este trabajo, pero alguien tiene que impedir que un botón mida 40px en una pantalla y 44px en la siguiente.',
      'Son los guardianes del orden visual, los responsables de que la marca tenga sentido y los culpables de que ahora todos vean problemas de alineación en los menús de los restaurantes.',
    ],
    color: '#FF3975',
    borderColor: 'border-[#FF3975]',
    img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCR2Dwyh4mdXRHeZjE5eYejQDK_E3PvslhnFKEgFVK38AZidWfUsrOTTfVoRhCIrJTGhrxS-dDddJX2ouKtHcYU8F9qNqlsphDvbEmfbmcgYrA_tRdR4CADOXW0TVhn7oLNCegEBimO7RMNeqAEQoRVqLln_G5gdNzGNwuMZWrioRX-BlJnDp7KY3nFPSo1XjkdQYe8w0akcfSfx0TJIZZCxnsswRr4wEsoft1AiKGoXnbvuZgJAbw7WmxRxxfYs5-N',
    image: strike01,
    category: 'Departamento',
    attributes: [
      {
        name: 'Ojo biónico',
        value: 75,
        description: [
          'Detecta alineaciones rotas, márgenes sospechosos y botones con un píxel fuera de sitio a distancias consideradas imposibles por la ciencia moderna.',
        ],
      },
      {
        name: 'Cromaturgia avanzada',
        value: 80,
        description: [
          'Capaces de debatir durante media hora sobre dos colores que para el resto de la humanidad son exactamente iguales. Cuidado, recordarán exactamente qué azul se aprobó hace ocho meses y quién intentó cambiarlo.'
        ],
      },
      {
        name: 'Inteligencia',
        value: 90,
        description: [
          'Poder ancestral que impide dormir cuando algo está desplazado 3 píxeles a la derecha',
        ],
      },
      {
        name: 'Marca interiorizada',
        value: 85,
        description: [
          'Puede detectar una inconsistencia visual corporativa incluso con fiebre y tres cafés menos de lo recomendable',
        ],
      },
      {
        name: 'Magia de la Consistencia',
        value: 70,
        description: [
          'Logran que cien pantallas distintas parezcan parte del mismo producto y no de una colección de decisiones tomadas en días especialmente difíciles.',
        ],
      },
    ],
    instrumentName: 'Trompeta de Bronce Celestial',
    notes: [220, 261.63, 293.66, 329.63, 392.00],
  },
  {
    id: 'ux',
    name: 'Interacción',
    title: 'UX',
    subtitle: 'El Arma Secreta',
    description: [
      'No se ve, pero se siente. Sin ellos el resto del equipo lucha a ciegas. ',
      'Convierte el caos en flujo, el "no entiendo nada" en "ah, vale".',
      'Son silenciosos pero cambian el resultado del juego.',
    ],
    color: '#0066FF',
    borderColor: 'border-[#0066FF]',
    img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCRfx-AZ_q8dYvG2EkPHPSH3ZbNXrQERIvX9XlIptFwgP64tSMNxjIrjfaDqhGunHy3n2qKYHKstf2CxKnWaSQAdwCL7g8ux7oAlfumMb5SJckRTPGXkXsHQL__RENjAcBYqnJAqBBNfa32bAsdjoks-fy6nW411pSDAeLUbQZjUE_MwYtRbDBDszInFtZ4xtv1U80jdSMxMil798X8uCsjus37lblCf7wvGEJYd4B0OfLP-hgV3AlI6LNcIJg0E5xG',
    image: strike02,
    category: 'Departamento',
    attributes: [
      {
        name: 'Flow sense',
        value: 95,
        description: [
          'Detecta por dónde quiere ir el usuario… incluso cuando está más perdido que un pulpo en el garaje',
        ],
      },
      {
        name: 'Caza-clicks',
        value: 40,
        description: [
          'Ninjas de los pasos innecesarios y clics absurdos. Especialistas en hacer que lo importante no requiera un manual de instrucciones.',
        ],
      },
      {
        name: 'Modo Empatía',
        value: 45,
        description: [
          'Juegan a ser psicólogos. Se ponen en la piel del usuario, del negocio intentando que todos sobrevivan en el mismo barco.',
        ],
      },
      {
        name: 'Pócima de claridad',
        value: 70,
        description: [
          'Capaces de convertir un texto robótico en algo humano pero sin pasarse, no son poetas.',
        ],
      },
      {
        name: 'Speedrun',
        value: 85,
        description: [
          'Pasan de concepto a pantalla antes de que la conversación se enfríe, de pronto todo cobra sentido y empieza a funcionar.',
        ],
      },
    ],
    instrumentName: 'Contrabajo de Piedra Antigua',
    notes: [110, 130.81, 146.83, 164.81, 220],
  },
  {
    id: 'tech',
    name: 'Tech',
    title: 'Guardianes del Código',
    subtitle: 'Defensores del repositorio sagrado',
    description: [
      'Viven entre código, producto, diseño, negocio y realidad. A base de años, traducción simultánea  y esfuerzo de todos, se ha conseguido que en Hanzo se hable el mismo idioma.',
      'Por dentro siguen siendo frikis con lore, atajos de teclado y opiniones fuertes sobre frameworks; por fuera parecen gente normal. Incluso salen, hacen deporte y socializan… hasta que toca volver a la cueva, al teclado y a la paz del código bien formateado.',
    ],
    color: '#77F9AC',
    borderColor: 'border-[#77F9AC]',
    img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDoaAU9fJyTH4WeNvngMcw919hh3tH15O97qvmnGrhxIWaGVzM8mXk2lcY0g6vI8Q-mIwEpAI75LK2Hez_SfufBgUOaueKuRKCroHjbLbaw8BVmpSzXaBjz6afXTdpVrVT5QUM5HRS0GPLd87Vxdty_vm7KwkgXCVMt2V90TSJKquMHLruGFutpz_VVvrluJtZVmG2-kDszjxeVH_cLRu74zS5PPgsn7jgFjWurlP8G8CN_n9U95xqe4Tm2y1VOurUF',
    image: strike03,
    category: 'Departamento',
    attributes: [
      {
        name: 'Código Arcano',
        value: 55,
        description: [
          'Domina lenguajes extraños, bugs antiguos y dependencias con nombres imposibles.',
        ],
      },
      {
        name: 'Bug Hunter',
        value: 95,
        description: [
          'Rastrea errores invisibles hasta que confiesan.',
        ],
      },
      {
        name: 'Escalabilidad Mental',
        value: 70,
        description: [
          'Piensa no solo en que funcione hoy, sino en que no explote mañana.',
        ],
      },
      {
        name: 'Deploy Zen',
        value: 75,
        description: [
          'Mantiene la calma cuando todo el mundo mira la barra de progreso',
        ],
      },
      {
        name: 'API Whisperer',
        value: 90,
        description: [
          'Habla con servicios externos, integraciones y endpoints temperamentales.',
        ],
      },
    ],
    instrumentName: 'Flauta de Bambú Silvestre',
    notes: [440, 523.25, 587.33, 659.25, 783.99],
  },
  {
    id: 'management',
    name: 'Management',
    title: 'Los nómadas de las salas de reuniones',
    subtitle: 'Orquestadores del caos organizado',
    description: [
      'En búsqueda constante del "rincón silencioso" de la ofi, dominan el arte de encontrar una sala libre en tiempo récord y muestran una habilidad admirable para accionar el mute y unmute en llamadas multitudinarias.',
    ],
    color: '#5700FF',
    borderColor: 'border-[#5700FF]',
    img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBve4b6IiCD1iefGYMLbuXMoMT_UP0Wu7nUo-xrF9OGu5z7l7YrJtbwLK7z6HtBGEFT_Jn0z8I_Tk5PYl8v1XSBuWztAa0A42EaEEGNXv8Id6FJ4q9xxdbFSlsDd55D2y_QeujU1Q25gccytE7g7-4jgHZZK82xRnKvynNcmYQXYIHn6BMgRMeNpHEl24wkg89CN8zqAV51Lyw5T9O3EEj31MB2mHRYsvH7q1ZjwiC5qXa0RbcJc-h4NSHcSq2XeljT',
    image: strike04,
    category: 'Departamento',
    attributes: [
      {
        name: 'Visión 360',
        value: 90,
        description: [
          'Ve el mapa completo mientras todos miran su casilla.',
        ],
      },
      {
        name: 'Prioridad Legendaria',
        value: 80,
        description: [
          'Sabe distinguir lo urgente, lo importante y lo que solo hace ruido.',
        ],
      },
      {
        name: 'Diplomacia Pro',
        value: 98,
        description: [
          'Traduce necesidades, expectativas y tensiones sin que nadie pierda la vida.',
        ],
      },
      {
        name: 'Escudo Anti-Caos',
        value: 80,
        description: [
          'Absorbe cambios, bloqueos y dudas para que el equipo pueda avanzar.',
        ],
      },
      {
        name: 'Roadmap Foresight',
        value: 80,
        description: [
          'Mira más allá del sprint actual sin olvidar lo que hay que entregar hoy.',
        ],
      },
    ],
    instrumentName: 'Campanas de Plata Rúnica',
    notes: [523.25, 659.25, 783.99, 1046.50, 1174.66],
  },
  {
    id: 'operations',
    name: 'Operaciones',
    title: 'Operaciones (especiales)',
    subtitle: 'La versión corporate de James Bond',
    description: [
      'La versión corporate de James Bond. Si nos ves mucho, algo va mal.',
      'Somos terapeutas, traductores, malabaristas de agendas y recordatorios humanos no solicitados.',
    ],
    extra: [
      'Si te ponemos una daily a las 9:00, no es personal, también estamos atrapados en ella. Solo recuerda que, en algún momento entre el café y el primer bloqueo del día, ya hemos salvado tres crisis, renegociado dos deadlines y evitado una catástrofe. 🫠',
    ],
    color: '#14072B',
    borderColor: 'border-[#14072B]',
    img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBnYzI_9FfxkjoITesILqDvYfHvbuPuIGYmW_qyYzqQR93pyq9ay2lSm06me6Xo1_NQlyneWEQkXEum2tIHX_hghwErsBTjSr4tD1LoiY4dDIDPqG1i-vBUgJc64_tlDfa9nEbqLefAn6UWp-d6rZxMaVeHE1Fgk43jYeJXi9-hmJMZWIsIFm7H8nSyG7mHKzoDrCo4WN2ByqNJwkST8L9t1mnscDy1gCxywjej3vgCv4tRWpU3stFihZ-y1--9TkQr',
    image: strike05,
    category: 'Departamento',
    attributes: [
      {
        name: 'Premonición',
        value: 90,
        description: [
          'Podemos anticipar los riesgos y muchas cagadas antes de que ocurran. Aunque, como cualquier buen profesional del sector, de vez en cuando la mayor sorpresa nos la llevamos nosotros.',
        ],
      },
      {
        name: 'Sonrisa corporativa',
        value: 85,
        description: [
          'Parece natural, pero es en realidad una herramienta de supervivencia de alto rendimiento que activamos en días complicados con cliente.',
        ],
      },
      {
        name: 'Telepatía transversal',
        value: 95,
        description: [
          'Hablamos cliente, tech, diseño y urgencias con total fluidez. Transformamos “lo que pide” en “lo que se necesita”, y lo “urgente” en la verdadera unidad de medida: “es para ayer”.',
        ],
      },
      {
        name: 'Cronorregulación',
        value: 88,
        description: [
          'Visión de rayos X sobre el calendario. Detectamos al instante solapes, cuellos de botella y esa semana de julio en las que los dos desarrolladores del proyecto deciden, misteriosamente, coger vacaciones a la vez.',
        ],
      },
      {
        name: 'Motor Invisible',
        value: 92,
        description: [
          'Cuando todo funciona, probablemente Operaciones está detrás.',
        ],
      },
    ],
    instrumentName: 'Zumbador del Vacío Siniestro',
    notes: [55, 65.41, 73.42, 82.41, 110],
  },
];

export const finalCharacter: Character = {
  id: 'final',
  name: '',
  title: 'El Samurai de la Nube',
  subtitle: '',
  description: [
    'Nacido de la unión de Cloud y Hanzo para convertirse en el guardián absoluto, la fusión definitiva entre espada y tormenta.',
    'En él conviven dos fuerzas inseparables: la precisión samurái del detalle y la potencia disruptiva de la nube que escala sin límites.',
    'No trabaja dentro del sistema, lo atraviesa actuando simultáneamente en todos los niveles del tablero, estrategia, experiencia y ejecución.',
    'Dicen los veteranos que no es un personaje, es un late game event que aparece cuando el producto está en apuros, y aun así lo resuelve en un solo turno crítico.',
  ],
  color: '#64748b',
  borderColor: 'border-slate-400',
  img: '',
  image: finalImage,
  category: 'Leyenda',
  attributes: [],
  instrumentName: '',
  notes: [],
};
