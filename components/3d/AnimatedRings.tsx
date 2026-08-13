'use client'

import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import { Ring, TorusKnot, Sphere } from '@react-three/drei'
import { Group, Color } from 'three'
import { useReducedMotion } from 'framer-motion'
import { gsap } from 'three/examples/jsm/AnimationClip.js'

type NeonColor = 'gold' | 'silver' | 'electric' | 'pink' | 'blue'

interface AnimatedRingsProps {
  count?: number
  radius?: number
  colors?: NeonColor[]
  autoPlay?: boolean
  interactive?: boolean
}

const neonColors: Record<NeonColor, [number, number, number]> = {
  gold: [0.831, 0.69, 0.2],
  silver: [0.753, 0.753, 0.753],
  electric: [0.14, 0.6, 1],
  pink: [1, 0.25, 0.75],
  blue: [0.2, 0.5, 1],
}

export function AnimatedRings({
  count = 3,
  radius = 2.2,
  colors = ['gold', 'silver', 'electric'],
  autoPlay = true,
  interactive = true,
}: AnimatedRingsProps) {
  const groupRef = useRef<Group>(null)
  const reduceMotion = useReducedMotion()

  const rings = useMemo(
    () =>
      Array.from({ length: count }, (_, i) => {
        const colorKey = colors[i % colors.length]
        return {
          id: i,
          radius: radius + i * 0.25,
          color: neonColors[colorKey],
          colorKey,
          speed: 0.15 + i * 0.08,
          offset: (i * Math.PI * 2) / count,
        }
      }),
    [count, radius, colors]
  )

  useFrame((state) => {
    if (reduceMotion || !groupRef.current) return
    const t = state.clock.elapsedTime

    groupRef.current.children.forEach((ring, i) => {
      const cfg = rings[i]
      if (!cfg) return

      ring.rotation.z = t * cfg.speed + cfg.offset
      ring.rotation.x = Math.sin(t * 0.3 + cfg.offset) * 0.1

      const pulse = 0.8 + Math.sin(t * 2 + cfg.offset) * 0.2
      const mat = ring.children[0] as any
      if (mat?.material) {
        const emissive = cfg.color.map((c) => c * pulse) as [number, number, number]
        mat.material.emissive?.setRGB(emissive[0], emissive[1], emissive[2])
      }
    })
  })

  return (
    <group ref={groupRef} dispose={null}>
      {rings.map((ring) => (
        <Ring
          key={ring.id}
          args={[ring.radius, ring.radius + 0.03, 64, 8, undefined, undefined, 0, Math.PI * 2]}
          position={[0, 0, 0]}
        >
          <meshBasicMaterial
            color={new Color(...ring.color)}
            emissive={new Color(...ring.color)}
            emissiveIntensity={0.5}
            toneMapped={false}
            side={2}
          />
        </Ring>
      ))}

      {Array.from({ length: 24 }).map((_, i) => {
        const angle = (i / 24) * Math.PI * 2
        const r = radius + Math.sin(angle * 2) * 0.05
        const x = Math.cos(angle) * r
        const z = Math.sin(angle) * r
        return (
          <Sphere
            key={`sparkle-${i}`}
            args={[0.015, 8, 8]}
            position={[x, 0, z]}
          >
            <meshBasicMaterial
              color={new Color(...neonColors[rings[i % rings.length]?.colorKey || 'gold'])}
              emissive={new Color(...neonColors[rings[i % rings.length]?.colorKey || 'gold'])}
              emissiveIntensity={0.8}
              toneMapped={false}
            />
          </Sphere>
        )
      })}
    </group>
  )
}
