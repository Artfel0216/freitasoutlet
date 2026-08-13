'use client'

import { useRef, useMemo, useState } from 'react'
import { useFrame } from '@react-three/fiber'
import { useGL, useTexture, Html } from '@react-three/drei'
import { Group, Vector3 } from 'three'
import { useReducedMotion } from 'framer-motion'
import { motion } from 'framer-motion'

interface Shoe3DProps {
  imageUrl?: string
  autoRotate?: boolean
  explodeOnHover?: boolean
  modelPath?: string
  position?: [number, number, number]
  scale?: number
}

export function Shoe3D({
  imageUrl,
  autoRotate = true,
  explodeOnHover = false,
  modelPath,
  position = [0, -1.2, 0],
  scale = 2.4,
}: Shoe3DProps) {
  const groupRef = useRef<Group>(null)
  const [hovered, setHovered] = useState(false)
  const [isExploded, setIsExploded] = useState(false)
  const reduceMotion = useReducedMotion()

  const texture = imageUrl ? useTexture(imageUrl) : null

  const materials = useMemo(() => {
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
        color: '#d4af37',
        metalness: 0.9,
        roughness: 0.1,
        emissive: '#d4af37',
        emissiveIntensity: 0.3,
      },
    }
  }, [texture])

  const explodedPositions = useMemo(() => {
    const result: Record<string, [number, number, number]> = {}
    result.sole = [0, -0.5, 0]
    result.midsole = [0, 0.1, -0.2]
    result.upper = [0, 0.6, 0.2]
    result.tongue = [0, 0.9, 0.15]
    result.eyelets = [0, 0.5, 0.3]
    result.laces = [0, 0.45, 0.25]
    return result
  }, [])

  const restPositions = useMemo(() => {
    const result: Record<string, [number, number, number]> = {}
    result.sole = [0, -0.5, 0]
    result.midsole = [0, 0.05, 0]
    result.upper = [0, 0.55, 0]
    result.tongue = [0, 0.85, 0.1]
    result.eyes = [0, 0.5, 0.25]
    result.laces = [0, 0.42, 0.2]
    return result
  }, [])

  useFrame((state, delta) => {
    if (reduceMotion) return

    const t = state.clock.elapsedTime

    if (groupRef.current) {
      if (autoRotate && !hovered) {
        groupRef.current.rotation.y += delta * 0.25
      }

      if (isExploded) {
        const parts = groupRef.current.children
        parts.forEach((child, i) => {
          const target = child.userData.targetPos
          if (target) {
            child.position.lerp(
              new Vector3(target[0] * 4, target[1] * 4, target[2] * 4 + Math.sin(t * 2) * 0.1),
              0.1
            )
          }
        })
      } else {
        groupRef.current.children.forEach((child) => {
          const rest = child.userData.restPos
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

  const ShoePart = ({
    name,
    position: pos,
    args,
    geomType = 'box',
    mat = 'upperMat',
    scale: s,
  }: {
    name: string
    position: [number, number, number]
    args: any[]
    geomType?: 'box' | 'cylinder' | 'sphere' | 'torus' | 'cone'
    mat?: 'upperMat' | 'soleMat' | 'accentMat'
    scale?: [number, number, number]
  }) => {
    const geom = useMemo(() => {
      const common: any = { key: name }
      switch (geomType) {
        case 'cylinder':
          return <cylinderGeometry args={args as [any]} />
        case 'sphere':
          return <sphereGeometry args={args as [any]} />
        case 'torus':
          return <torusGeometry args={args as [any]} />
        case 'cone':
          return <coneGeometry args={args as [any]} />
        default:
          return <boxGeometry args={args as [any]} />
      }
    }, [geomType, args, name])

    const matColor = useMemo(() => {
      if (mat === 'soleMat') return materials.soleMat
      if (mat === 'accentMat') return materials.accentMat
      return materials.upperMat
    }, [mat])

    return (
      <mesh
        name={name}
        castShadow
        receiveShadow
        position={pos}
        scale={s}
        onPointerEnter={handlePointerEnter}
        onPointerLeave={handlePointerLeave}
      >
        {geom}
        <meshStandardMaterial {...matColor} />
      </mesh>
    )
  }

  return (
    <group ref={groupRef} position={position} scale={scale} dispose={null}>
      <ShoePart
        name="sole"
        geomType="box"
        args={[0.9, 0.25, 0.35]}
        mat="soleMat"
        position={[0, -0.5, 0]}
      />
      <ShoePart
        name="midsole"
        geomType="box"
        args={[0.85, 0.18, 0.3]}
        mat="soleMat"
        position={[0, -0.28, 0]}
      />
      <ShoePart
        name="upper"
        geomType="box"
        args={[0.75, 0.85, 0.32]}
        mat="upperMat"
        position={[0, 0.15, 0]}
      />
      <ShoePart
        name="tongue"
        geomType="box"
        args={[0.45, 0.35, 0.1]}
        mat="upperMat"
        position={[0, 0.55, 0.28]}
      />
      <ShoePart
        name="eyeletL1"
        geomType="torus"
        args={[0.04, 0.012, 8, 20]}
        mat="accentMat"
        position={[-0.12, 0.5, 0.26]}
      />
      <ShoePart
        name="eyeletL2"
        geomType="torus"
        args={[0.04, 0.012, 8, 20]}
        mat="accentMat"
        position={[-0.1, 0.35, 0.26]}
      />
      <ShoePart
        name="eyeletL3"
        geomType="torus"
        args={[0.04, 0.012, 8, 20]}
        mat="accentMat"
        position={[-0.08, 0.2, 0.26]}
      />
      <ShoePart
        name="eyeletR1"
        geomType="torus"
        args={[0.04, 0.012, 8, 20]}
        mat="accentMat"
        position={[0.12, 0.5, 0.26]}
      />
      <ShoePart
        name="eyeletR2"
        geomType="torus"
        args={[0.04, 0.012, 8, 20]}
        mat="accentMat"
        position={[0.1, 0.35, 0.26]}
      />
      <ShoePart
        name="eyeletR3"
        geomType="torus"
        args={[0.04, 0.012, 8, 20]}
        mat="accentMat"
        position={[0.08, 0.2, 0.26]}
      />
      <ShoePart
        name="heel"
        geomType="box"
        args={[0.6, 0.25, 0.12]}
        mat="upperMat"
        position={[0, -0.05, -0.18]}
      />
      <ShoePart
        name="accentStripe"
        geomType="torus"
        args={[0.42, 0.03, 8, 30, Math.PI, Math.PI]}
        mat="accentMat"
        position={[0, 0.4, 0.285]}
      />
    </group>
  )
}
