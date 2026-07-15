'use client'
import { useEffect, useMemo, useRef } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { playSealCrack, playWhoosh } from '@/lib/prototype-sound'

interface WebGLEnvelopeProps {
  accentFrom: string
  accentTo: string
  /** Fires once the open animation finishes. */
  onComplete: () => void
}

/**
 * The one WebGL moment in the whole reveal — a real envelope tearing open in 3D
 * space, flap lifting, the letter sliding out. ~2.5s, then it hands off and the
 * canvas unmounts; nothing about the reading experience afterward pays this cost.
 * Built from primitives (box + hinged plane + cylinder) — no external model files,
 * so this stays a genuinely small bundle addition.
 */
export function WebGLEnvelope({ accentFrom, accentTo, onComplete }: WebGLEnvelopeProps) {
  useEffect(() => {
    playSealCrack()
    const t = setTimeout(playWhoosh, 250)
    return () => clearTimeout(t)
  }, [])

  return (
    <div className="fixed inset-0 bg-[#120E0A]">
      <Canvas camera={{ position: [0, 0.4, 3.4], fov: 42 }} dpr={[1, 2]}>
        <ambientLight intensity={0.75} />
        <directionalLight position={[2, 3, 2]} intensity={1.2} />
        <directionalLight position={[-2, -1, 1]} intensity={0.3} />
        <EnvelopeScene accentFrom={accentFrom} accentTo={accentTo} onComplete={onComplete} />
      </Canvas>
    </div>
  )
}

function EnvelopeScene({ accentFrom, accentTo, onComplete }: WebGLEnvelopeProps) {
  const groupRef = useRef<THREE.Group>(null)
  const flapRef = useRef<THREE.Mesh>(null)
  const sealRef = useRef<THREE.Mesh>(null)
  const paperRef = useRef<THREE.Mesh>(null)
  const progress = useRef(0)
  const doneRef = useRef(false)

  const flapGeometry = useMemo(() => {
    const g = new THREE.PlaneGeometry(1.8, 0.95)
    g.translate(0, -0.475, 0) // pivot at the top edge
    return g
  }, [])

  useFrame((_, delta) => {
    if (doneRef.current) return
    progress.current = Math.min(1, progress.current + delta / 2.3)
    const p = progress.current

    if (flapRef.current) flapRef.current.rotation.x = -p * Math.PI * 0.95
    if (sealRef.current) {
      const sealP = Math.min(1, p / 0.25)
      sealRef.current.scale.setScalar(Math.max(0, 1 - sealP))
    }
    if (paperRef.current) {
      const paperP = Math.max(0, (p - 0.32) / 0.68)
      const eased = 1 - Math.pow(1 - paperP, 3)
      paperRef.current.position.y = -0.1 + eased * 1.05
      paperRef.current.position.z = 0.03 + eased * 0.55
      paperRef.current.scale.setScalar(0.92 + eased * 0.12)
      const mat = paperRef.current.material as THREE.MeshStandardMaterial
      mat.opacity = 0.55 + eased * 0.45
    }
    if (groupRef.current) {
      groupRef.current.rotation.y = Math.sin(p * Math.PI) * 0.18
      groupRef.current.position.z = p * 0.3
    }

    if (p >= 1 && !doneRef.current) {
      doneRef.current = true
      setTimeout(onComplete, 320)
    }
  })

  return (
    <group ref={groupRef}>
      <mesh position={[0, 0, -0.05]}>
        <boxGeometry args={[1.85, 1.25, 0.04]} />
        <meshStandardMaterial color="#FFFFFF" roughness={0.85} />
      </mesh>

      <mesh ref={paperRef} position={[0, -0.1, 0.03]}>
        <planeGeometry args={[1.55, 1.95]} />
        <meshStandardMaterial color="#FBF6EC" roughness={0.92} side={THREE.DoubleSide} transparent opacity={0.55} />
      </mesh>

      <mesh ref={flapRef} position={[0, 0.625, 0.03]} geometry={flapGeometry}>
        <meshStandardMaterial color="#F5EFE4" roughness={0.85} side={THREE.DoubleSide} />
      </mesh>

      <mesh ref={sealRef} position={[0, 0.08, 0.09]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.16, 0.16, 0.05, 28]} />
        <meshStandardMaterial color={accentFrom} emissive={accentTo} emissiveIntensity={0.15} roughness={0.4} />
      </mesh>
    </group>
  )
}
