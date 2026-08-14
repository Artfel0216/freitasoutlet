'use client'

import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import { Text } from '@react-three/drei'
import { Group, MeshStandardMaterial } from 'three'
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

  const goldMat = useMemo(() => {
    return new MeshStandardMaterial({ color: '#d4af37', metalness: 0.85, roughness: 0.15 })
  }, [])

  const chromeMat = useMemo(() => {
    return new MeshStandardMaterial({ color: '#c0c0c0', metalness: 0.8, roughness: 0.2 })
  }, [])

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
        const mat = i < 7 ? goldMat : chromeMat
        const color = i < 7 ? '#d4af37' : '#c0c0c0'

        return (
          <Text
            key={`${i}-${char}`}
            font="/fonts/Inter-Bold.ttf"
            position={[x, y, 0]}
            color={color}
            material={mat}
            anchorX="center"
            anchorY="middle"
            fontSize={0.5}
          >
            {char}
          </Text>
        )
      })}

      <pointLight
        position={[0, 0.5, 1]}
        intensity={0.6}
        color="#d4af37"
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
