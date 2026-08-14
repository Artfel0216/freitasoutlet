'use client'

import { useRef, useMemo, useState } from 'react'
import { useFrame } from '@react-three/fiber'
import { useTexture } from '@react-three/drei'
import { Group, Vector3, type Texture } from 'three'
import { useReducedMotion } from 'framer-motion'

interface Shoe3DProps {
  imageUrl?: string
  autoRotate?: boolean
  explodeOnHover?: boolean
  position?: [number, number, number]
  scale?: number
}

type ShoeMaterials = Record<string, Record<string, unknown>>

function ShoePart({
  name,
  position: pos,
  args,
  geomType = 'box',
  matKey,
  scale: s,
  materials,
  onPointerEnter,
  onPointerLeave,
}: {
  name: string
  position: [number, number, number]
  args: number[]
  geomType?: 'box' | 'cylinder' | 'sphere' | 'torus' | 'cone'
  matKey?: 'upperMat' | 'soleMat' | 'accentMat'
  scale?: [number, number, number]
  materials: ShoeMaterials
  onPointerEnter: () => void
  onPointerLeave: () => void
}) {
  const geom = useMemo(() => {
    switch (geomType) {
      case 'cylinder':
        return <cylinderGeometry args={args as [number, number, number, number?]} />
      case 'sphere':
        return <sphereGeometry args={args as [number, number, number?]} />
      case 'torus':
        return <torusGeometry args={args as [number, number, number?, number?]} />
      case 'cone':
        return <coneGeometry args={args as [number, number, number?, number?]} />
      default:
        return <boxGeometry args={args as [number, number, number]} />
    }
  }, [geomType, args])

  const matColor = useMemo(() => {
    if (matKey === 'soleMat') return materials.soleMat
    if (matKey === 'accentMat') return materials.accentMat
    return materials.upperMat
  }, [matKey, materials])

  return (
    <mesh
      name={name}
      castShadow
      receiveShadow
      position={pos}
      scale={s}
      onPointerEnter={onPointerEnter}
      onPointerLeave={onPointerLeave}
    >
      {geom}
      <meshStandardMaterial {...(matColor as Record<string, unknown>)} />
    </mesh>
  )
}

export function Shoe3D({
  imageUrl,
  autoRotate = true,
  explodeOnHover = false,
  position = [0, -1.2, 0],
  scale = 2.4,
}: Shoe3DProps) {
  if (imageUrl) return <TexturedShoe imageUrl={imageUrl} autoRotate={autoRotate} explodeOnHover={explodeOnHover} position={position} scale={scale} />
  return <Shoe3DBase autoRotate={autoRotate} explodeOnHover={explodeOnHover} position={position} scale={scale} texture={null} />
}

function TexturedShoe({
  imageUrl,
  autoRotate = true,
  explodeOnHover = false,
  position = [0, -1.2, 0],
  scale = 2.4,
}: Shoe3DProps & { imageUrl: string }) {
  const texture = useTexture(imageUrl)
  return <Shoe3DBase autoRotate={autoRotate} explodeOnHover={explodeOnHover} position={position} scale={scale} texture={texture} />
}

function Shoe3DBase({
  autoRotate = true,
  explodeOnHover = false,
  position = [0, -1.2, 0],
  scale = 2.4,
  texture,
}: Shoe3DProps & { texture: Texture | null }) {
  const groupRef = useRef<Group>(null)
  const [hovered, setHovered] = useState(false)
  const [isExploded, setIsExploded] = useState(false)
  const reduceMotion = useReducedMotion()

  const materials = useMemo<ShoeMaterials>(() => {
    const textureProps = texture ? { map: texture } : {}
    return {
      upperMat: {
        metalness: 0.85,
        roughness: 0.08,
        ...textureProps,
      },
      soleMat: {
        color: '#1a1a1a',
        metalness: 0.7,
        roughness: 0.25,
      },
      accentMat: {
        color: '#0a0a0a',
        metalness: 0.9,
        roughness: 0.1,
        emissive: '#0a0a0a',
        emissiveIntensity: 0.3,
      },
    }
  }, [texture])

  const elapsedRef = useRef(0)

  useFrame((_, delta) => {
    if (reduceMotion) return

    elapsedRef.current += delta
    const t = elapsedRef.current

    if (groupRef.current) {
      if (autoRotate && !hovered) {
        groupRef.current.rotation.y += delta * 0.25
      }

      if (isExploded) {
        groupRef.current.children.forEach((child) => {
          const target = child.userData.targetPos as [number, number, number] | undefined
          if (target) {
            child.position.lerp(
              new Vector3(target[0] * 4, target[1] * 4, target[2] * 4 + Math.sin(t * 2) * 0.1),
              0.1
            )
          }
        })
      } else {
        groupRef.current.children.forEach((child) => {
          const rest = child.userData.restPos as [number, number, number] | undefined
          if (rest) {
            child.position.lerp(new Vector3(rest[0], rest[1], rest[2]), 0.15)
          }
        })
      }
    }
  })

  const handlePointerEnter = () => {
    setHovered(true)
    if (explodeOnHover) setIsExploded(true)
  }

  const handlePointerLeave = () => {
    setHovered(false)
    if (explodeOnHover) setIsExploded(false)
  }

  return (
    <group ref={groupRef} position={position} scale={scale} dispose={null}>
      <ShoePart
        name="sole"
        geomType="box"
        args={[0.9, 0.25, 0.35]}
        matKey="soleMat"
        position={[0, -0.5, 0]}
        materials={materials}
        onPointerEnter={handlePointerEnter}
        onPointerLeave={handlePointerLeave}
      />
      <ShoePart
        name="midsole"
        geomType="box"
        args={[0.85, 0.18, 0.3]}
        matKey="soleMat"
        position={[0, -0.28, 0]}
        materials={materials}
        onPointerEnter={handlePointerEnter}
        onPointerLeave={handlePointerLeave}
      />
      <ShoePart
        name="upper"
        geomType="box"
        args={[0.75, 0.85, 0.32]}
        matKey="upperMat"
        position={[0, 0.15, 0]}
        materials={materials}
        onPointerEnter={handlePointerEnter}
        onPointerLeave={handlePointerLeave}
      />
      <ShoePart
        name="tongue"
        geomType="box"
        args={[0.45, 0.35, 0.1]}
        matKey="upperMat"
        position={[0, 0.55, 0.28]}
        materials={materials}
        onPointerEnter={handlePointerEnter}
        onPointerLeave={handlePointerLeave}
      />
      <ShoePart
        name="eyeletL1"
        geomType="torus"
        args={[0.04, 0.012, 8, 20]}
        matKey="accentMat"
        position={[-0.12, 0.5, 0.26]}
        materials={materials}
        onPointerEnter={handlePointerEnter}
        onPointerLeave={handlePointerLeave}
      />
      <ShoePart
        name="eyeletL2"
        geomType="torus"
        args={[0.04, 0.012, 8, 20]}
        matKey="accentMat"
        position={[-0.1, 0.35, 0.26]}
        materials={materials}
        onPointerEnter={handlePointerEnter}
        onPointerLeave={handlePointerLeave}
      />
      <ShoePart
        name="eyeletL3"
        geomType="torus"
        args={[0.04, 0.012, 8, 20]}
        matKey="accentMat"
        position={[-0.08, 0.2, 0.26]}
        materials={materials}
        onPointerEnter={handlePointerEnter}
        onPointerLeave={handlePointerLeave}
      />
      <ShoePart
        name="eyeletR1"
        geomType="torus"
        args={[0.04, 0.012, 8, 20]}
        matKey="accentMat"
        position={[0.12, 0.5, 0.26]}
        materials={materials}
        onPointerEnter={handlePointerEnter}
        onPointerLeave={handlePointerLeave}
      />
      <ShoePart
        name="eyeletR2"
        geomType="torus"
        args={[0.04, 0.012, 8, 20]}
        matKey="accentMat"
        position={[0.1, 0.35, 0.26]}
        materials={materials}
        onPointerEnter={handlePointerEnter}
        onPointerLeave={handlePointerLeave}
      />
      <ShoePart
        name="eyeletR3"
        geomType="torus"
        args={[0.04, 0.012, 8, 20]}
        matKey="accentMat"
        position={[0.08, 0.2, 0.26]}
        materials={materials}
        onPointerEnter={handlePointerEnter}
        onPointerLeave={handlePointerLeave}
      />
      <ShoePart
        name="heel"
        geomType="box"
        args={[0.6, 0.25, 0.12]}
        matKey="upperMat"
        position={[0, -0.05, -0.18]}
        materials={materials}
        onPointerEnter={handlePointerEnter}
        onPointerLeave={handlePointerLeave}
      />
      <ShoePart
        name="accentStripe"
        geomType="torus"
        args={[0.42, 0.03, 8, 30, Math.PI, Math.PI]}
        matKey="accentMat"
        position={[0, 0.4, 0.285]}
        materials={materials}
        onPointerEnter={handlePointerEnter}
        onPointerLeave={handlePointerLeave}
      />
    </group>
  )
}
