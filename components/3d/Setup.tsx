'use client'

import { Canvas } from '@react-three/fiber'
import { Environment, ContactShadows, Stats } from '@react-three/drei'
import { Bloom, EffectComposer, ChromaticAberration } from '@react-three/postprocessing'
import { useReducedMotion } from 'framer-motion'
import { type ReactNode, Suspense } from 'react'

interface SceneSetupProps {
  children: ReactNode
  cameraPosition?: [number, number, number]
  enableEnvironment?: boolean
  enableShadows?: boolean
  enablePostprocessing?: boolean
  className?: string
}

export function SceneSetup({
  children,
  cameraPosition = [0, 0, 5],
  enableEnvironment = true,
  enableShadows = true,
  enablePostprocessing = true,
  className = '',
}: SceneSetupProps) {
  const reduceMotion = useReducedMotion()

  return (
    <Canvas
      camera={{ position: cameraPosition, fov: 45 }}
      className={className}
      dpr={[1, 2]}
      gl={{ antialias: true, alpha: true, stencil: false }}
    >
      <color attach="background" args={['#ffffff']} />
      <ambientLight intensity={0.8} />
      <directionalLight
        position={[5, 10, 5]}
        intensity={1.5}
        castShadow
        shadow-mapSize={[1024, 1024]}
      />
      <pointLight position={[-5, -5, -5]} intensity={0.4} color="#d4af37" />

      {enableEnvironment && <Environment preset="apartment" />}

      {enableShadows && !reduceMotion && (
        <ContactShadows
          position={[0, -0.01, 0]}
          opacity={0.4}
          scale={10}
          blur={2}
          far={5}
        />
      )}

      <Suspense fallback={null}>{children}</Suspense>

      {!reduceMotion && enablePostprocessing && (
        <EffectComposer>
          <Bloom
            intensity={0.5}
            width={300}
            height={300}
            kernelSize={2}
            luminanceThreshold={0.2}
            luminanceSmoothing={0.9}
          />
          <ChromaticAberration
            offset={[0.0002, 0.0002]}
          />
        </EffectComposer>
      )}

      {process.env.NODE_ENV === 'development' && <Stats />}
    </Canvas>
  )
}
