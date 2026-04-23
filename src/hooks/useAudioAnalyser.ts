import { useRef, useCallback, useEffect } from 'react'
import { useAudioStore, audioBands } from '../stores/audioStore'
import { extractBands, smoothBands, type AudioBands } from '../lib/audioUtils'

export function useAudioAnalyser() {
  const ctxRef = useRef<AudioContext | null>(null)
  const analyserRef = useRef<AnalyserNode | null>(null)
  const sourceRef = useRef<MediaElementAudioSourceNode | null>(null)
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const rafRef = useRef<number>(0)
  const prevBands = useRef<AudioBands>({ bass: 0, mids: 0, highs: 0 })

  const { setPlaying, setPaused, setSource } = useAudioStore.getState()

  const tick = useCallback(() => {
    if (!analyserRef.current) return
    const dataArray = new Uint8Array(analyserRef.current.frequencyBinCount)
    analyserRef.current.getByteFrequencyData(dataArray)
    const raw = extractBands(dataArray)
    const smoothed = smoothBands(prevBands.current, raw, 0.75)
    prevBands.current = smoothed
    audioBands.bass = smoothed.bass
    audioBands.mids = smoothed.mids
    audioBands.highs = smoothed.highs
    rafRef.current = requestAnimationFrame(tick)
  }, [])

  function ensureContext() {
    if (!ctxRef.current) {
      ctxRef.current = new AudioContext()
    }
    if (!analyserRef.current) {
      analyserRef.current = ctxRef.current.createAnalyser()
      analyserRef.current.fftSize = 2048
      analyserRef.current.connect(ctxRef.current.destination)
    }
    return ctxRef.current
  }

  function cleanup() {
    if (audioRef.current) {
      audioRef.current.pause()
      if (audioRef.current.src.startsWith('blob:')) {
        URL.revokeObjectURL(audioRef.current.src)
      }
    }
    if (sourceRef.current) {
      sourceRef.current.disconnect()
      sourceRef.current = null
    }
    cancelAnimationFrame(rafRef.current)
  }

  function startAudio(audio: HTMLAudioElement) {
    const ctx = ensureContext()
    audioRef.current = audio

    const source = ctx.createMediaElementSource(audio)
    source.connect(analyserRef.current!)
    sourceRef.current = source

    audio.play().then(() => {
      setPlaying(true)
      setSource('file')
      tick()
    })

    audio.addEventListener('ended', () => {
      setPlaying(false)
      cancelAnimationFrame(rafRef.current)
      audioBands.bass = audioBands.mids = audioBands.highs = 0
    })
  }

  const connectFile = useCallback((file: File) => {
    cleanup()
    const audio = new Audio()
    audio.crossOrigin = 'anonymous'
    audio.src = URL.createObjectURL(file)
    startAudio(audio)
  }, [tick, setPlaying, setSource])

  const connectUrl = useCallback((url: string, loop = true) => {
    cleanup()
    const audio = new Audio()
    audio.crossOrigin = 'anonymous'
    audio.loop = loop
    audio.src = url
    startAudio(audio)
  }, [tick, setPlaying, setSource])

  const connectMic = useCallback(async () => {
    cleanup()
    const ctx = ensureContext()

    const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
    const micSource = ctx.createMediaStreamSource(stream)
    micSource.connect(analyserRef.current!)

    setPlaying(true)
    setSource('mic')
    tick()
  }, [tick, setPlaying, setSource])

  const togglePause = useCallback(() => {
    const audio = audioRef.current
    if (!audio) return
    if (audio.paused) {
      audio.play().then(() => {
        setPlaying(true)
        setPaused(false)
        tick()
      })
    } else {
      audio.pause()
      setPlaying(false)
      setPaused(true)
      cancelAnimationFrame(rafRef.current)
      audioBands.bass = audioBands.mids = audioBands.highs = 0
    }
  }, [tick, setPlaying, setPaused])

  useEffect(() => {
    return () => {
      cleanup()
    }
  }, [])

  return { connectFile, connectUrl, connectMic, togglePause, analyserRef }
}
