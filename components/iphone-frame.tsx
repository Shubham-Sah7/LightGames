'use client'

import { useEffect, useRef } from 'react'

const DEVICE_W = 393
const DEVICE_H = 852

export function IPhoneFrame({ children }: { children: React.ReactNode }) {
  const scalerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const updateScale = () => {
      const margin = 64
      const scaleH = (window.innerHeight - margin) / DEVICE_H
      const scaleW = (window.innerWidth - margin) / DEVICE_W
      const scale = Math.min(1, scaleH, scaleW)
      if (scalerRef.current) {
        scalerRef.current.style.transform = `scale(${scale})`
      }
    }
    updateScale()
    const observer = new ResizeObserver(updateScale)
    observer.observe(document.documentElement)
    return () => observer.disconnect()
  }, [])

  return (
    <div
      className="fixed inset-0 flex items-center justify-center"
      style={{ background: 'linear-gradient(160deg, #CFCFD1 0%, #C2C9C6 50%, #B8CBBE 100%)' }}
    >
      <div
        ref={scalerRef}
        style={{ transformOrigin: 'center center', willChange: 'transform' }}
      >
        <div
          style={{
            width: `${DEVICE_W}px`,
            height: `${DEVICE_H}px`,
            borderRadius: '24px',
            background: '#fff',
            border: '1px solid #E5E7EB',
            boxShadow: '0 8px 40px rgba(0,0,0,0.07), 0 2px 8px rgba(0,0,0,0.04)',
            overflow: 'hidden',
            position: 'relative',
          }}
        >
          {/* Dynamic Island */}
          <div
            style={{
              position: 'absolute',
              top: '12px',
              left: '50%',
              transform: 'translateX(-50%)',
              width: '120px',
              height: '34px',
              background: '#111',
              borderRadius: '999px',
              zIndex: 100,
              pointerEvents: 'none',
            }}
          />
          {children}
        </div>
      </div>
    </div>
  )
}
