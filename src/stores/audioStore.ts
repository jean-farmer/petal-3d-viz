import { create } from 'zustand'

export const audioBands = { bass: 0, mids: 0, highs: 0 }

interface AudioStore {
  isPlaying: boolean
  isPaused: boolean
  source: 'file' | 'mic' | null
  setPlaying: (playing: boolean) => void
  setPaused: (isPaused: boolean) => void
  setSource: (source: 'file' | 'mic' | null) => void
}

export const useAudioStore = create<AudioStore>((set) => ({
  isPlaying: false,
  isPaused: false,
  source: null,
  setPlaying: (isPlaying) => set({ isPlaying }),
  setPaused: (isPaused) => set({ isPaused }),
  setSource: (source) => set({ source }),
}))
