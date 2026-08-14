'use client'

import { Logo3D } from '@/components/3d/Logo3D'
import { Canvas } from '@react-three/fiber'

export function Logo3DCanvas() {
  return (
    <div className="h-10 w-48">
      <Canvas camera={{ position: [0, 0, 6], fov: 45 }} gl={{ antialias: true, alpha: true }}>
        <ambientLight intensity={0.8} />
        <pointLight position={[5, 5, 5]} intensity={0.8} color="#d4af37" />
        <pointLight position={[-3, -2, -2]} intensity={0.4} color="#ffffff" />
        <Logo3D scale={0.5} interactive={false} />
      </Canvas>
    </div>
  )
}