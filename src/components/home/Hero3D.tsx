'use client'

import { Canvas } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'
import { Shoe3D } from '@/components/3d/Shoe3D'
import { AnimatedRings } from '@/components/3d/AnimatedRings'

export function Hero3D() {
  return (
    <Canvas
      camera={{ position: [0, 0, 4.5], fov: 35 }}
      className="h-full w-full"
      gl={{ antialias: true, alpha: true }}
      dpr={[1, 2]}
    >
      <color attach="background" args={['#ffffff']} />
      <ambientLight intensity={0.8} />
      <directionalLight position={[5, 10, 5]} intensity={1.2} />
      <pointLight position={[-3, -3, -3]} intensity={0.3} color="#ffffff" />

      <Shoe3D autoRotate={true} explodeOnHover={true} scale={2.8} />
      <AnimatedRings count={3} radius={1.8} colors={['gold', 'silver', 'electric']} />

      <OrbitControls
        enablePan={false}
        enableZoom={true}
        enableRotate={true}
        autoRotate={false}
        autoRotateSpeed={0.5}
      />
    </Canvas>
  )
}