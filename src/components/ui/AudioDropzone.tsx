import { useState, useCallback, type DragEvent } from 'react'
import { useAudioAnalyser } from '../../hooks/useAudioAnalyser'
import { useAudioStore } from '../../stores/audioStore'

const DEMO_TRACK = '/samples/lofi.mp3'

const glass: React.CSSProperties = {
  width: 48,
  height: 48,
  borderRadius: '50%',
  border: 'none',
  cursor: 'pointer',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  background: 'rgba(255, 255, 255, 0.25)',
  backdropFilter: 'blur(12px)',
  WebkitBackdropFilter: 'blur(12px)',
  boxShadow:
    'inset 0 0 0 0.5px rgba(255,255,255,0.5), 0 4px 12px rgba(0,0,0,0.06)',
  transition: 'all 0.25s ease',
  color: 'rgba(0,0,0,0.35)',
}

const glassHover = {
  background: 'rgba(255, 255, 255, 0.4)',
  boxShadow:
    'inset 0 0 0 0.5px rgba(255,255,255,0.6), 0 6px 16px rgba(0,0,0,0.08)',
}

function GlassButton({
  onClick,
  children,
  label,
}: {
  onClick?: () => void
  children: React.ReactNode
  label: string
}) {
  const [hovered, setHovered] = useState(false)
  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      aria-label={label}
      style={hovered ? { ...glass, ...glassHover } : glass}
    >
      {children}
    </button>
  )
}

function PlayIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
      <path d="M5 3.5L14.5 9L5 14.5V3.5Z" fill="currentColor" />
    </svg>
  )
}

function PauseIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
      <rect x="4" y="3" width="3.5" height="12" rx="1" fill="currentColor" />
      <rect
        x="10.5"
        y="3"
        width="3.5"
        height="12"
        rx="1"
        fill="currentColor"
      />
    </svg>
  )
}

function UploadIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
      <path
        d="M9 3V12M9 3L5.5 6.5M9 3L12.5 6.5"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M3 13V14C3 14.5523 3.44772 15 4 15H14C14.5523 15 15 14.5523 15 14V13"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  )
}

function MicIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
      <rect x="7" y="2" width="4" height="9" rx="2" fill="currentColor" />
      <path
        d="M4.5 9C4.5 11.4853 6.51472 13.5 9 13.5C11.4853 13.5 13.5 11.4853 13.5 9"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <path
        d="M9 13.5V16"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  )
}

export function AudioDropzone() {
  const [dragging, setDragging] = useState(false)
  const { connectFile, connectUrl, connectMic, togglePause } =
    useAudioAnalyser()
  const isPlaying = useAudioStore((s) => s.isPlaying)
  const isPaused = useAudioStore((s) => s.isPaused)

  const onDragOver = useCallback((e: DragEvent) => {
    e.preventDefault()
    setDragging(true)
  }, [])

  const onDragLeave = useCallback(() => setDragging(false), [])

  const onDrop = useCallback(
    (e: DragEvent) => {
      e.preventDefault()
      setDragging(false)
      const file = e.dataTransfer.files[0]
      if (file && file.type.startsWith('audio/')) {
        connectFile(file)
      }
    },
    [connectFile],
  )

  const onFileSelect = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0]
      if (file) connectFile(file)
    },
    [connectFile],
  )

  const playDemo = useCallback(() => {
    connectUrl(DEMO_TRACK, true)
  }, [connectUrl])

  return (
    <>
      <div
        onDragOver={onDragOver}
        onDragLeave={onDragLeave}
        onDrop={onDrop}
        style={{
          position: 'fixed',
          inset: 0,
          zIndex: dragging ? 100 : -1,
          background: dragging ? 'rgba(240, 176, 200, 0.15)' : 'transparent',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          pointerEvents: dragging ? 'auto' : 'none',
          transition: 'background 0.2s',
        }}
      >
        {dragging && (
          <div
            style={{
              fontSize: '24px',
              color: '#e8a0b4',
              fontFamily: 'system-ui, sans-serif',
              fontWeight: 300,
              letterSpacing: '0.05em',
            }}
          >
            drop audio file
          </div>
        )}
      </div>

      <div
        onDragOver={onDragOver}
        style={{
          position: 'fixed',
          bottom: '32px',
          left: '50%',
          transform: 'translateX(-50%)',
          display: 'flex',
          gap: '10px',
          alignItems: 'center',
          zIndex: 10,
        }}
      >
        {isPlaying ? (
          <GlassButton onClick={togglePause} label="Pause">
            <PauseIcon />
          </GlassButton>
        ) : isPaused ? (
          <GlassButton onClick={togglePause} label="Resume">
            <PlayIcon />
          </GlassButton>
        ) : (
          <GlassButton onClick={playDemo} label="Play">
            <PlayIcon />
          </GlassButton>
        )}

        <label style={{ display: 'flex' }}>
          <GlassButton label="Upload audio">
            <UploadIcon />
          </GlassButton>
          <input
            type="file"
            accept="audio/*"
            onChange={onFileSelect}
            style={{ display: 'none' }}
          />
        </label>

        {!isPlaying && !isPaused && (
          <GlassButton onClick={connectMic} label="Microphone">
            <MicIcon />
          </GlassButton>
        )}
      </div>
    </>
  )
}
