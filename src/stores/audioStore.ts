import { create } from 'zustand'

interface AudioStore {
  bass: number
  mids: number
  highs: number
  isPlaying: boolean
  isPaused: boolean
  source: 'file' | 'mic' | null
  setBands: (bass: number, mids: number, highs: number) => void
  setPlaying: (playing: boolean) => void
  setPaused: (paused: boolean) => void
  setSource: (source: 'file' | 'mic' | null) => void
}

export const useAudioStore = create<AudioStore>((set) => ({
  bass: 0,
  mids: 0,
  highs: 0,
  isPlaying: false,
  isPaused: false,
  source: null,
  setBands: (bass, mids, highs) => set({ bass, mids, highs }),
  setPlaying: (isPlaying) => set({ isPlaying }),
  setPaused: (isPaused) => set({ isPaused }),
  setSource: (source) => set({ source }),
}))
