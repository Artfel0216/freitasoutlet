'use client'

import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import { Html } from '@react-three/drei'
import { Group } from 'three'
import { useReducedMotion } from 'framer-motion'

interface Logo3DProps {
  position?: [number, number, number]
  scale?: number
  interactive?: boolean
}

export function Logo3D({ position = [0, 0, 0], scale = 0.6, interactive = true }: Logo3DProps) {
  const groupRef = useRef<Group>(null)
  const elapsedRef = useRef(0)
  const reduceMotion = useReducedMotion()

  const letters = 'FREITAS OUTLET'.split('')

  useFrame((_, delta) => {
    if (reduceMotion || !groupRef.current || !interactive) return
    elapsedRef.current += delta
    const t = elapsedRef.current
    groupRef.current.rotation.y = Math.sin(t * 0.3) * 0.05
  })

  return (
    <group ref={groupRef} position={position} scale={scale} dispose={null}>
      {letters.map((char, i) => {
        if (char === ' ') return null
        const x = (i - 7) * 0.55
        const y = i < 7 ? 0.2 : -0.3
        const color = i < 7 ? '#0a0a0a' : '#c0c0c0'

        return (
          <Html
            key={`${i}-${char}`}
            position={[x, y, 0]}
            center
            transform
            style={{ pointerEvents: 'none' }}
          >
            <span
              style={{
                display: 'inline-block',
                fontSize: '46px',
                lineHeight: 1,
                fontWeight: 900,
                letterSpacing: '0.02em',
                color,
                fontFamily: 'var(--font-heading, inherit)',
                textShadow: '0 0 18px rgba(192, 192, 192, 0.25)',
                userSelect: 'none',
                whiteSpace: 'nowrap',
              }}
            >
              {char}
            </span>
          </Html>
        )
      })}

      <pointLight
        position={[0, 0.5, 1]}
        intensity={0.6}
        color="#ffffff"
        decay={2}
        distance={3}
      />
      <pointLight
        position={[0, -0.3, -1]}
        intensity={0.4}
        color="#ffffff"
        decay={2}
        distance={3}
      />
    </group>
  )
}