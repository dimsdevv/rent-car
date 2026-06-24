import { useState, useEffect, useRef, useCallback } from 'react'

/**
 * useCountUp - Animates a number from 0 to target when the element enters viewport.
 * Uses IntersectionObserver + requestAnimationFrame for performance.
 * Respects prefers-reduced-motion by showing the final value instantly.
 *
 * @param {number} target - The final number to count up to
 * @param {object} options
 * @param {number} options.duration - Animation duration in ms (default: 1800)
 * @param {number} options.decimals - Decimal places (default: 0)
 * @param {number} options.threshold - IntersectionObserver threshold (default: 0.3)
 */
export function useCountUp(target, { duration = 1800, decimals = 0, threshold = 0.3 } = {}) {
  const [value, setValue] = useState(0)
  const ref = useRef(null)
  const hasAnimated = useRef(false)

  const easeOutQuart = useCallback((t) => 1 - Math.pow(1 - t, 4), [])

  useEffect(() => {
    const el = ref.current
    if (!el) return

    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    if (prefersReduced) {
      setValue(target)
      return
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !hasAnimated.current) {
            hasAnimated.current = true
            observer.unobserve(el)

            let startTime = null
            const step = (timestamp) => {
              if (!startTime) startTime = timestamp
              const elapsed = timestamp - startTime
              const progress = Math.min(elapsed / duration, 1)
              const easedProgress = easeOutQuart(progress)
              const currentValue = easedProgress * target

              setValue(Number(currentValue.toFixed(decimals)))

              if (progress < 1) {
                requestAnimationFrame(step)
              }
            }

            requestAnimationFrame(step)
          }
        })
      },
      { threshold }
    )

    observer.observe(el)
    return () => observer.disconnect()
  }, [target, duration, decimals, threshold, easeOutQuart])

  const displayValue = decimals > 0
    ? value.toLocaleString('id-ID', { minimumFractionDigits: decimals, maximumFractionDigits: decimals })
    : value.toLocaleString('id-ID')

  return { ref, displayValue }
}
