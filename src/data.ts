import { Character } from './types';

/**
 * =========================================================================
 * 🚀 GUÍA DE ESCALABILIDAD (GATONES Y MAZMORRAS)
 * =========================================================================
 * Para añadir, editar o remover personajes con facilidad, consulta /AGENTS.md
 * en la raíz del proyecto. El sistema renderizará, animará y aplicará los
 * efectos 3D, carga de estadísticas y arpegios de sonido de forma 100% dinámica.
 * =========================================================================
 */
export const characters: Character[] = [
  {
    id: 'william',
    name: 'Miss William',
    subtitle: 'La Valiente Paladina',
    desc: 'La valiente líder de los héroes de Gatones y Mazmorras. Noble, protectora y decidida, siempre se enfrenta al peligro con su espada brillante y un corazón lleno de coraje.',
    color: '#fbbc06',
    borderColor: 'border-[#fbbc06]',
    img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCR2Dwyh4mdXRHeZjE5eYejQDK_E3PvslhnFKEgFVK38AZidWfUsrOTTfVoRhCIrJTGhrxS-dDddJX2ouKtHcYU8F9qNqlsphDvbEmfbmcgYrA_tRdR4CADOXW0TVhn7oLNCegEBimO7RMNeqAEQoRVqLln_G5gdNzGNwuMZWrioRX-BlJnDp7KY3nFPSo1XjkdQYe8w0akcfSfx0TJIZZCxnsswRr4wEsoft1AiKGoXnbvuZgJAbw7WmxRxxfYs5-N',
    image: '/characters/william_card-Photoroom.png',
    category: 'Héroe',
    stats: {
      fuerza: 85,
      agilidad: 60,
      inteligencia: 50,
      carisma: 95,
      ritmo: 75
    },
    instrumentName: 'Trompeta de Bronce Celestial',
    notes: [220, 261.63, 293.66, 329.63, 392.00]
  },
  {
    id: 'gimlice',
    name: 'Gimlice',
    subtitle: 'El Defensor de las Minas',
    desc: 'El guardián de piedra del grupo. Fuerte, leal y resistente, protege a sus amigos con su hacha y su legendario Escudo Rúnico.',
    color: '#765700',
    borderColor: 'border-[#765700]',
    img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCRfx-AZ_q8dYvG2EkPHPSH3ZbNXrQERIvX9XlIptFwgP64tSMNxjIrjfaDqhGunHy3n2qKYHKstf2CxKnWaSQAdwCL7g8ux7oAlfumMb5SJckRTPGXkXsHQL__RENjAcBYqnJAqBBNfa32bAsdjoks-fy6nW411pSDAeLUbQZjUE_MwYtRbDBDszInFtZ4xtv1U80jdSMxMil798X8uCsjus37lblCf7wvGEJYd4B0OfLP-hgV3AlI6LNcIJg0E5xG',
    image: '/characters/gimlice_cad-Photoroom.png',
    category: 'Héroe',
    stats: {
      fuerza: 95,
      agilidad: 40,
      inteligencia: 45,
      carisma: 70,
      ritmo: 85
    },
    instrumentName: 'Contrabajo de Piedra Antigua',
    notes: [110, 130.81, 146.83, 164.81, 220]
  },
  {
    id: 'robin',
    name: 'Robin Mouse',
    subtitle: 'El Arquero del Bosque',
    desc: 'Explorador incansable y maestro del Arco Alado. Ágil, optimista y aventurero, encuentra el camino incluso en las mazmorras más oscuras.',
    color: '#34a853',
    borderColor: 'border-[#34a853]',
    img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDoaAU9fJyTH4WeNvngMcw919hh3tH15O97qvmnGrhxIWaGVzM8mXk2lcY0g6vI8Q-mIwEpAI75LK2Hez_SfufBgUOaueKuRKCroHjbLbaw8BVmpSzXaBjz6afXTdpVrVT5QUM5HRS0GPLd87Vxdty_vm7KwkgXCVMt2V90TSJKquMHLruGFutpz_VVvrluJtZVmG2-kDszjxeVH_cLRu74zS5PPgsn7jgFjWurlP8G8CN_n9U95xqe4Tm2y1VOurUF',
    image: '/characters/robin_card-Photoroom.png',
    category: 'Héroe',
    stats: {
      fuerza: 55,
      agilidad: 95,
      inteligencia: 70,
      carisma: 75,
      ritmo: 90
    },
    instrumentName: 'Flauta de Bambú Silvestre',
    notes: [440, 523.25, 587.33, 659.25, 783.99]
  },
  {
    id: 'herminice',
    name: 'Herminice',
    subtitle: 'La Maestra de Runas',
    desc: 'Sabia maga autodidacta y estudiosa de los antiguos secretos. Su poderosa magia luminosa y su ingenio son clave para superar cualquier desafío.',
    color: '#0058bd',
    borderColor: 'border-[#0058bd]',
    img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBve4b6IiCD1iefGYMLbuXMoMT_UP0Wu7nUo-xrF9OGu5z7l7YrJtbwLK7z6HtBGEFT_Jn0z8I_Tk5PYl8v1XSBuWztAa0A42EaEEGNXv8Id6FJ4q9xxdbFSlsDd55D2y_QeujU1Q25gccytE7g7-4jgHZZK82xRnKvynNcmYQXYIHn6BMgRMeNpHEl24wkg89CN8zqAV51Lyw5T9O3EEj31MB2mHRYsvH7q1ZjwiC5qXa0RbcJc-h4NSHcSq2XeljT',
    image: '/characters/Heminice_card-Photoroom.png',
    category: 'Héroe',
    stats: {
      fuerza: 40,
      agilidad: 70,
      inteligencia: 98,
      carisma: 80,
      ritmo: 80
    },
    instrumentName: 'Campanas de Plata Rúnica',
    notes: [523.25, 659.25, 783.99, 1046.50, 1174.66]
  },
  {
    id: 'misifu',
    name: 'Misifu',
    subtitle: 'El Hechicero Tenebroso',
    desc: 'El gran hechicero oscuro y enemigo de los héroes. Astuto, poderoso y temido, controla portales mágicos y dirige un ejército de gatos desde las sombras.',
    color: '#2e3038',
    borderColor: 'border-[#2e3038]',
    img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBnYzI_9FfxkjoITesILqDvYfHvbuPuIGYmW_qyYzqQR93pyq9ay2lSm06me6Xo1_NQlyneWEQkXEum2tIHX_hghwErsBTjSr4tD1LoiY4dDIDPqG1i-vBUgJc64_tlDfa9nEbqLefAn6UWp-d6rZxMaVeHE1Fgk43jYeJXi9-hmJMZWIsIFm7H8nSyG7mHKzoDrCo4WN2ByqNJwkST8L9t1mnscDy1gCxywjej3vgCv4tRWpU3stFihZ-y1--9TkQr',
    image: '/characters/misifu_card-Photoroom.png',
    category: 'Villano',
    stats: {
      fuerza: 50,
      agilidad: 65,
      inteligencia: 96,
      carisma: 85,
      ritmo: 70
    },
    instrumentName: 'Zumbador del Vacío Siniestro',
    notes: [55, 65.41, 73.42, 82.41, 110]
  },
  {
    id: 'bigotitos',
    name: 'Bigotitos',
    subtitle: 'El Hechicero Blanco',
    desc: 'Reservado, observador y sorprendentemente ingenioso. Siempre parece saber más de lo que dice, y su calma en los momentos difíciles lo convierte en una presencia tan misteriosa como valiosa.',
    color: '#9395a1', // Enhanced light grey for better visual contrast than plain white
    borderColor: 'border-[#9395a1]',
    img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBR0FV5dcislgIEbyZtml9rNgX7AqCxAYbgux9B-RbhEAy2ZmQkAtK7ahi5HzPXFP6HXxfVgBiGFS5TF30Ko_6VdOvIlIsXNYmIhIdoUkMgONA899CexFRkjdcYkaUHbyFxzOsVZa7_xHHr9dElZ1RgdHsjccxuMAZsEqaWA3oDE0T7ljUeninT8ASEs_bdRRLLLMb2MSn0U0PsQy9TxXGYfuRBRemNHBv7ifD3_pyN4YYvFF9GDGXNhwNgr0vBsYcy',
    image: '/characters/bigotitos_card-Photoroom.png',
    category: 'Villano',
    stats: {
      fuerza: 45,
      agilidad: 75,
      inteligencia: 92,
      carisma: 88,
      ritmo: 82
    },
    instrumentName: 'Órgano de Catedral de Marfil',
    notes: [164.81, 196.00, 220.00, 329.63, 392.00]
  },
  {
    id: 'tigri',
    name: 'Tigri',
    subtitle: 'La Guerrera de Misifu',
    desc: 'Una gata naranja de espíritu indomable y fuerza extraordinaria. Tan firme como el acero y tan feroz como una tormenta, afronta cada desafío con determinación, valentía y una voluntad imposible de quebrar.',
    color: '#ff9800',
    borderColor: 'border-[#ff9800]',
    img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuA0TOD_hKLvO5_6tRVLUCm6cbR5b9U4c11soHZexlqqysi4cL9avTSk8DFvlgKwNzn42BmYmwpT_UZfKudUVV1JM6VaN7Bk2mHmVPH0bWRmefdaeIzhqtuFko4JqCKkOZYWWzIIQnHdN384fs30wv9CuQguJw2hArqwi-czQtJuIiiPCO_dDg1dUigmjp4Z_7GIsb6Tbj76VO6gQhA0b_V7IkyTzzQRGuj5ssMMd82ce0zWcPKnU7Z5K5k4tVGO8mpr',
    image: '/characters/tigri_card-Photoroom.png',
    category: 'Villano',
    stats: {
      fuerza: 80,
      agilidad: 98,
      inteligencia: 60,
      carisma: 65,
      ritmo: 95
    },
    instrumentName: 'Drums Tribales del Volcán',
    notes: [80, 100, 120, 150, 250]
  }
];
