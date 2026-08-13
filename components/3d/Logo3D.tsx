'use client'

import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import { Text3D, useMatcapTexture, useTexture } from '@react-three/drei'
import { Group, Vector3, MathUtils } from 'three'
import { useReducedMotion } from 'framer-motion'

interface Logo3DProps {
  position?: [number, number, number]
  scale?: number
  interactive?: boolean
}

export function Logo3D({ position = [0, 0, 0], scale = 0.6, interactive = true }: Logo3DProps) {
  const groupRef = useRef<Group>(null)
  const reduceMotion = useReducedMotion()
  const [goldMatcap, chromeMatcap, blackMatcap] = useMatcapTexture(
    ['https://assets.codepen.io/21725/gold.png', 'https://assets.codepen.io/21725/chrome.png', 'https://assets.codepen.io/21725/black-matte.png'],
    256
  )

  const letterData = useMemo(
    () => [
      { char: 'F', color: 'gold', yOffset: 0.2 },
      { char: 'R', color: 'gold', yOffset: 0.2 },
      { char: 'E', color: 'chrome', yOffset: 0.2 },
      { char: 'I', color: 'chrome', yOffset: 0.2 },
      { char: 'T', color: 'chrome', yOffset: 0.2 },
      { char: 'A', color: 'chrome', yOffset: 0.2 },
      { char: 'S', color: 'chrome', yOffset: 0.2 },
      { char: ' ', color: 'chrome', yOffset: 0.2 },
      { char: 'O', color: 'gold', yOffset: -0.3 },
      { char: 'U', color: 'gold', yOffset: -0.3 },
      { char: 'T', color: 'gold', yOffset: -0.3 },
      { char: 'L', color: 'gold', yOffset: -0.3 },
      { char: 'E', color: 'gold', yOffset: -0.3 },
      { char: 'T', color: 'gold', yOffset: -0.3 },
    ],
    []
  )

  const spacing = 0.55

  useFrame((state) => {
    if (reduceMotion || !groupRef.current || !interactive) return
    const t = state.clock.elapsedTime
    groupRef.current.rotation.y = Math.sin(t * 0.3) * 0.05
  })

  return (
    <group ref={groupRef} position={position} scale={scale} dispose={null}>
      {letterData.map((l, i) => {
        if (l.char === ' ') return null
        const x = (i - 6.5) * spacing
        const y = l.yOffset
        const isGold = l.color === 'gold'
        return (
          <Text3D
            key={i}
            position={[x, y, 0]}
            font="/fonts/Inter-Bold.json"
            size={0.5}
            height={0.1}
            bevelEnabled
            bevelSize={0.015}
            bevelDepth={0.03}
          >
            {l.char}
            <meshMatcapMaterial
              matcap={isGold ? goldMatcap : chromeMatcap}
              metalness={0.9}
              roughness={isGold ? 0.15 : 0.08}
              color={isGold ? '#d4af37' : '#c0c0c0'}
              emissive={isGold ? '#d4af37' : '#ffffff'}
              emissiveIntensity={0.15}
            />
          </Text3D>
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
