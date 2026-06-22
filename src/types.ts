export interface LegendaryAttribute {
  name: string;
  value: number;
  description: string[];
}

export interface Character {
  id: string;
  name: string;
  title: string;
  subtitle: string;
  description: string[];
  extra?: string[];
  color: string;
  borderColor: string;
  img: string;
  image: string;
  category: string;
  attributes: LegendaryAttribute[];
  instrumentName: string;
  notes: number[];
}

export interface PlaybackState {
  isPlaying: boolean;
  bpm: number;
  currentStep: number;
  activeTracks: Record<string, boolean>;
}
