import { useEffect, useRef } from 'react'

export function GlassCursor() {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    let x = -100
    let y = -100
    let cx = -100
    let cy = -100
    let raf: number

    const onMove = (e: MouseEvent) => {
      x = e.clientX
      y = e.clientY
    }

    const onLeave = () => {
      x = -100
      y = -100
    }

    const loop = () => {
      cx += (x - cx) * 0.15
      cy += (y - cy) * 0.15
      el.style.transform = `translate(${cx - 20}px, ${cy - 20}px)`
      raf = requestAnimationFrame(loop)
    }

    window.addEventListener('mousemove', onMove)
    document.addEventListener('mouseleave', onLeave)
    raf = requestAnimationFrame(loop)

    return () => {
      window.removeEventListener('mousemove', onMove)
      document.removeEventListener('mouseleave', onLeave)
      cancelAnimationFrame(raf)
    }
  }, [])

  return (
    <div
      ref={ref}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: 40,
        height: 40,
        borderRadius: '50%',
        background: 'rgba(255, 255, 255, 0.2)',
        backdropFilter: 'blur(8px)',
        WebkitBackdropFilter: 'blur(8px)',
        boxShadow:
          'inset 0 0 0 0.5px rgba(255,255,255,0.45), 0 2px 8px rgba(0,0,0,0.04)',
        pointerEvents: 'none',
        zIndex: 50,
        willChange: 'transform',
      }}
    />
  )
}
