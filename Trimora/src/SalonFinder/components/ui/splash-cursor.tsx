"use client"

import { useEffect, useRef } from "react"

/**
 * SplashCursor (ezsnippet-style)
 * - Emits a burst of small colored particles on mousemove/click
 * - Particles fly out with physics then fade out
 * - Uses a simple element pool for performance
 */
export function SplashCursor() {
  const rafRef = useRef<number | null>(null)
  const poolRef = useRef<HTMLDivElement[]>([])
  const activeRef = useRef<{
    el: HTMLDivElement
    x: number
    y: number
    vx: number
    vy: number
    life: number
    maxLife: number
  }[]>([])

  useEffect(() => {
    const colors = [
      "#6366F1", // indigo-500
      "#8B5CF6", // violet-500
      "#EC4899", // pink-500
      "#22D3EE", // cyan-400
      "#F59E0B", // amber-500
    ]

    const spawn = (x: number, y: number, strong = false) => {
      const count = strong ? 14 : 8
      for (let i = 0; i < count; i++) {
        const el = poolRef.current.pop() || document.createElement("div")
        if (!el.parentElement) document.body.appendChild(el)

        const size = 4 + Math.random() * 4
        el.style.position = "fixed"
        el.style.left = `${x}px`
        el.style.top = `${y}px`
        el.style.width = `${size}px`
        el.style.height = `${size}px`
        el.style.borderRadius = "9999px"
        el.style.background = colors[(Math.random() * colors.length) | 0]
        el.style.pointerEvents = "none"
        el.style.zIndex = "9999"
        el.style.transform = "translate(-50%, -50%)"
        el.style.opacity = "1"
        el.style.willChange = "transform, opacity"

        const angle = Math.random() * Math.PI * 2
        const speed = (strong ? 3.5 : 2) + Math.random() * (strong ? 2 : 1.5)
        const gravity = 0.08
        activeRef.current.push({
          el,
          x,
          y,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed - (strong ? 1.2 : 0.6),
          life: 0,
          maxLife: 700 + Math.random() * 450,
        })

        // store gravity on element dataset for slight variation
        ;(el as any)._g = gravity + Math.random() * 0.06
      }
    }

    const onClick = (e: MouseEvent) => spawn(e.clientX, e.clientY, true)

    let last = performance.now()
    const tick = () => {
      const now = performance.now()
      const dt = Math.min(32, now - last)
      last = now

      for (let i = activeRef.current.length - 1; i >= 0; i--) {
        const p = activeRef.current[i]
        p.life += dt
        if (p.life >= p.maxLife) {
          // recycle
          p.el.style.opacity = "0"
          p.el.remove()
          poolRef.current.push(p.el)
          activeRef.current.splice(i, 1)
          continue
        }

        // physics
        p.vy += (p.el as any)._g
        p.x += p.vx
        p.y += p.vy

        const t = p.life / p.maxLife
        const scale = 1 + t * 0.5
        const opacity = 1 - t
        p.el.style.transform = `translate(-50%, -50%) translate(${p.x}px, ${p.y}px) scale(${scale})`
        p.el.style.opacity = opacity.toString()
      }

      rafRef.current = requestAnimationFrame(tick)
    }

    window.addEventListener("click", onClick)
    rafRef.current = requestAnimationFrame(tick)

    return () => {
      window.removeEventListener("click", onClick)
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
      // cleanup elements
      activeRef.current.forEach((p) => p.el.remove())
      poolRef.current.forEach((el) => el.remove())
      activeRef.current = { current: [] } as any // force GC
      poolRef.current = []
    }
  }, [])

  return null
}

export default SplashCursor
