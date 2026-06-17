export interface Character {
  id: string;
  name: string;
  subtitle: string;
  desc: string;
  color: string;
  borderColor: string;
  img: string;
  image: string;
  category: string;
  stats: {
    fuerza: number;
    agilidad: number;
    inteligencia: number;
    carisma: number;
    ritmo: number;
  };
  instrumentName: string;
  notes: number[]; // Midi numbers or frequencies
}

export interface PlaybackState {
  isPlaying: boolean;
  bpm: number;
  currentStep: number;
  activeTracks: Record<string, boolean>; // Mute state
}
