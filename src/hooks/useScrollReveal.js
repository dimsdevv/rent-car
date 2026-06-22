import { useEffect, useRef } from 'react'

export function useScrollReveal(options = {}) {
  const ref = useRef(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    const { threshold = 0.15, rootMargin = '0px 0px -60px 0px', once = true } = options

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('revealed')
            if (once) observer.unobserve(entry.target)
          }
        })
      },
      { threshold, rootMargin }
    )

    observer.observe(el)
    return () => observer.disconnect()
  }, [options.threshold, options.rootMargin, options.once])

  return ref
}

export function useStaggerReveal(options = {}) {
  const ref = useRef(null)

  useEffect(() => {
    const container = ref.current
    if (!container) return

    const children = container.querySelectorAll('[data-reveal]')
    if (!children.length) return

    const { rootMargin = '0px 0px -40px 0px' } = options

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const delay = entry.target.dataset.revealDelay || '0'
            entry.target.style.transitionDelay = `${delay}ms`
            entry.target.classList.add('revealed')
            observer.unobserve(entry.target)
          }
        })
      },
      { threshold: 0.1, rootMargin }
    )

    children.forEach((child) => observer.observe(child))
    return () => observer.disconnect()
  }, [])

  return ref
}
