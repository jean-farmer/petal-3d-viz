import { useState, useCallback, type DragEvent } from 'react'
import { useAudioAnalyser } from '../../hooks/useAudioAnalyser'
import { useAudioStore } from '../../stores/audioStore'

const DEMO_TRACK = '/samples/lofi.mp3'

const pill: React.CSSProperties = {
  padding: '8px 20px',
  border: '1px solid #ddd',
  borderRadius: '24px',
  cursor: 'pointer',
  background: 'white',
  fontFamily: 'system-ui, sans-serif',
  fontSize: '14px',
  color: '#999',
  transition: 'all 0.2s',
}

const pillPrimary: React.CSSProperties = {
  ...pill,
  background: '#f0b0c8',
  border: '1px solid #e8a0b4',
  color: '#fff',
  fontSize: '16px',
  padding: '10px 28px',
}

export function AudioDropzone() {
  const [dragging, setDragging] = useState(false)
  const { connectFile, connectUrl, connectMic, togglePause } = useAudioAnalyser()
  const isPlaying = useAudioStore((s) => s.isPlaying)
  const isPaused = useAudioStore((s) => s.isPaused)
  const source = useAudioStore((s) => s.source)

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
      {/* Drag overlay */}
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

      {/* Controls */}
      <div
        onDragOver={onDragOver}
        style={{
          position: 'fixed',
          bottom: '32px',
          left: '50%',
          transform: 'translateX(-50%)',
          display: 'flex',
          gap: '12px',
          alignItems: 'center',
          fontFamily: 'system-ui, sans-serif',
          fontSize: '14px',
          color: '#999',
          zIndex: 10,
        }}
      >
        {isPlaying ? (
          <>
            <button onClick={togglePause} style={pill}>
              pause
            </button>
            <label style={pill}>
              upload
              <input
                type="file"
                accept="audio/*"
                onChange={onFileSelect}
                style={{ display: 'none' }}
              />
            </label>
            <span style={{ fontSize: '12px', color: '#ccc' }}>
              {source === 'mic' ? 'listening' : 'playing'}
            </span>
          </>
        ) : isPaused ? (
          <>
            <button onClick={togglePause} style={pillPrimary}>
              resume
            </button>
            <label style={pill}>
              upload
              <input
                type="file"
                accept="audio/*"
                onChange={onFileSelect}
                style={{ display: 'none' }}
              />
            </label>
            <button onClick={connectMic} style={pill}>
              mic
            </button>
          </>
        ) : (
          <>
            <button onClick={playDemo} style={pillPrimary}>
              play
            </button>
            <label style={pill}>
              upload
              <input
                type="file"
                accept="audio/*"
                onChange={onFileSelect}
                style={{ display: 'none' }}
              />
            </label>
            <button onClick={connectMic} style={pill}>
              mic
            </button>
          </>
        )}
      </div>
    </>
  )
}
