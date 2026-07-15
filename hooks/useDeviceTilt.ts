'use client'
import { useCallback, useEffect, useMemo, useState } from 'react'

export interface Tilt {
  x: number // -1..1, left/right
  y: number // -1..1, front/back
}

interface DeviceOrientationEventWithPermission {
  requestPermission?: () => Promise<'granted' | 'denied'>
}

function hasPermissionAPI(): boolean {
  if (typeof window === 'undefined' || typeof window.DeviceOrientationEvent === 'undefined') return false
  const DOE = window.DeviceOrientationEvent as unknown as DeviceOrientationEventWithPermission
  return typeof DOE.requestPermission === 'function'
}

/** Gyroscope-driven parallax — a lightweight "3D feel" without a WebGL cost for the
 * ongoing reading experience. Handles iOS's explicit permission requirement. */
export function useDeviceTilt(enabled = true) {
  const [tilt, setTilt] = useState<Tilt>({ x: 0, y: 0 })
  const [granted, setGranted] = useState(false)
  const requiresPermission = useMemo(() => hasPermissionAPI(), [])
  const needsPermission = enabled && requiresPermission && !granted

  useEffect(() => {
    if (!enabled || typeof window === 'undefined' || typeof window.DeviceOrientationEvent === 'undefined') return
    if (requiresPermission && !granted) return
    const handler = (e: DeviceOrientationEvent) => {
      const beta = e.beta ?? 0
      const gamma = e.gamma ?? 0
      setTilt({
        x: Math.max(-1, Math.min(1, gamma / 30)),
        y: Math.max(-1, Math.min(1, (beta - 45) / 30)),
      })
    }
    window.addEventListener('deviceorientation', handler)
    return () => window.removeEventListener('deviceorientation', handler)
  }, [enabled, granted, requiresPermission])

  const requestPermission = useCallback(async () => {
    const DOE = window.DeviceOrientationEvent as unknown as DeviceOrientationEventWithPermission
    if (typeof DOE.requestPermission !== 'function') return
    try {
      const result = await DOE.requestPermission()
      if (result === 'granted') setGranted(true)
    } catch {
      // ignore — falls back to no tilt
    }
  }, [])

  return { tilt, needsPermission, requestPermission }
}
