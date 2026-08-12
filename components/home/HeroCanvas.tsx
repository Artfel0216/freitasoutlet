'use client'

import { useEffect, useRef } from 'react'

interface Particle {
  x: number
  y: number
  size: number
  vx: number
  vy: number
  baseAlpha: number
  flicker: number
}

export function HeroCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let raf = 0
    let width = 0
    let height = 0
    const dpr = Math.min(window.devicePixelRatio || 1, 2)
    let particles: Particle[] = []
    const mouse = { x: 0, y: 0 }
    const light = { x: 0, y: 0 }
    let running = false
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    const resize = () => {
      width = canvas.clientWidth
      height = canvas.clientHeight
      canvas.width = Math.floor(width * dpr)
      canvas.height = Math.floor(height * dpr)
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      const count = Math.min(110, Math.floor((width * height) / 16000))
      particles = Array.from({ length: count }, () => ({
        x: Math.random() * width,
        y: Math.random() * height,
        size: 0.5 + Math.random() * 1.6,
        vx: (Math.random() - 0.5) * 0.12,
        vy: -0.05 - Math.random() * 0.16,
        baseAlpha: 0.12 + Math.random() * 0.45,
        flicker: 0.4 + Math.random() * 1.4,
      }))
    }

    const drawGrid = () => {
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.04)'
      ctx.lineWidth = 1
      const gap = 64
      ctx.beginPath()
      for (let x = 0.5; x <= width; x += gap) {
        ctx.moveTo(x, 0)
        ctx.lineTo(x, height)
      }
      for (let y = 0.5; y <= height; y += gap) {
        ctx.moveTo(0, y)
        ctx.lineTo(width, y)
      }
      ctx.stroke()
    }

    const drawSpotlight = () => {
      const radius = Math.min(width, height) * 0.6
      const g = ctx.createRadialGradient(light.x, light.y, 0, light.x, light.y, radius)
      g.addColorStop(0, 'rgba(255, 255, 255, 0.12)')
      g.addColorStop(0.35, 'rgba(255, 255, 255, 0.04)')
      g.addColorStop(1, 'rgba(255, 255, 255, 0)')
      ctx.fillStyle = g
      ctx.fillRect(0, 0, width, height)
    }

    const drawVignette = () => {
      const radius = Math.min(width, height) * 0.95
      const g = ctx.createRadialGradient(light.x, light.y, radius * 0.2, light.x, light.y, radius)
      g.addColorStop(0, 'rgba(0, 0, 0, 0)')
      g.addColorStop(1, 'rgba(0, 0, 0, 0.5)')
      ctx.fillStyle = g
      ctx.fillRect(0, 0, width, height)
    }

    const drawParticles = (t: number) => {
      const lightRadius = Math.min(width, height) * 0.45
      for (const p of particles) {
        const distToLight = Math.hypot(p.x - light.x, p.y - light.y)
        const glow = Math.max(0, 1 - distToLight / lightRadius)
        const alpha = Math.min(1, p.baseAlpha + glow * 0.35)
        ctx.globalAlpha = alpha
        ctx.fillStyle = '#ffffff'
        ctx.beginPath()
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2)
        ctx.fill()
        if (!reduceMotion && Math.sin(t * 0.001 * p.flicker + p.x * 0.1) > 0.985) {
          ctx.globalAlpha = alpha * 0.5
          ctx.beginPath()
          ctx.arc(p.x, p.y, p.size * 3, 0, Math.PI * 2)
          ctx.fill()
        }
      }
      ctx.globalAlpha = 1
    }

    const frame = (t: number) => {
      ctx.clearRect(0, 0, width, height)
      ctx.fillStyle = '#000000'
      ctx.fillRect(0, 0, width, height)
      drawGrid()
      light.x += (mouse.x - light.x) * 0.05
      light.y += (mouse.y - light.y) * 0.05
      drawSpotlight()
      for (const p of particles) {
        p.x += p.vx
        p.y += p.vy
        if (p.y < -4) {
          p.y = height + 4
          p.x = Math.random() * width
        }
        if (p.x < -4) p.x = width + 4
        if (p.x > width + 4) p.x = -4
      }
      drawParticles(t)
      drawVignette()
      raf = requestAnimationFrame(frame)
    }

    const onMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect()
      mouse.x = e.clientX - rect.left
      mouse.y = e.clientY - rect.top
    }

    const onVisibility = () => {
      if (document.hidden) {
        cancelAnimationFrame(raf)
      } else if (running) {
        cancelAnimationFrame(raf)
        raf = requestAnimationFrame(frame)
      }
    }

    resize()
    mouse.x = width / 2
    mouse.y = height / 2
    light.x = width / 2
    light.y = height / 2

    if (reduceMotion) {
      ctx.fillStyle = '#000000'
      ctx.fillRect(0, 0, width, height)
      drawGrid()
      drawSpotlight()
      drawParticles(0)
      drawVignette()
    } else {
      running = true
      raf = requestAnimationFrame(frame)
    }

    window.addEventListener('resize', resize)
    window.addEventListener('mousemove', onMouseMove, { passive: true })
    document.addEventListener('visibilitychange', onVisibility)

    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('resize', resize)
      window.removeEventListener('mousemove', onMouseMove)
      document.removeEventListener('visibilitychange', onVisibility)
    }
  }, [])

  return <canvas ref={canvasRef} className="absolute inset-0 h-full w-full" aria-hidden="true" />
}
