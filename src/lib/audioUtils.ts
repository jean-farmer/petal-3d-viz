export interface AudioBands {
  bass: number
  mids: number
  highs: number
}

export function extractBands(dataArray: Uint8Array): AudioBands {
  const bass = average(dataArray, 0, 10)
  const mids = average(dataArray, 10, 100)
  const highs = average(dataArray, 100, 512)
  return { bass, mids, highs }
}

function average(arr: Uint8Array, start: number, end: number): number {
  const slice = arr.slice(start, Math.min(end, arr.length))
  if (slice.length === 0) return 0
  let sum = 0
  for (let i = 0; i < slice.length; i++) sum += slice[i]
  return sum / slice.length / 255
}

export function smoothBands(
  prev: AudioBands,
  next: AudioBands,
  factor = 0.8,
): AudioBands {
  return {
    bass: prev.bass * factor + next.bass * (1 - factor),
    mids: prev.mids * factor + next.mids * (1 - factor),
    highs: prev.highs * factor + next.highs * (1 - factor),
  }
}
