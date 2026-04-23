export function Title() {
  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        pointerEvents: 'none',
        zIndex: 0,
      }}
    >
      <h1
        style={{
          fontFamily: "'Inter', 'Helvetica Neue', Arial, sans-serif",
          fontSize: 'clamp(140px, 20vw, 320px)',
          fontWeight: 900,
          letterSpacing: '-0.04em',
          lineHeight: 0.85,
          margin: 0,
          padding: '0 20px',
          textTransform: 'uppercase',
          color: 'rgba(195, 200, 215, 0.45)',
          userSelect: 'none',
        }}
      >
        Petal
      </h1>
    </div>
  )
}
