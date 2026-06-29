import { useEffect, useRef } from 'react'
import { useCollageStore } from '../store'
import {
  generateGridLayout,
  generateMasonryLayout,
  generateVerticalStackLayout,
  generateHorizontalStackLayout,
  drawCollage,
} from '../lib/collageEngine'
import { getAspectRatioDimensions } from '../lib/utils'

export function CollageCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  const store = useCollageStore()

  useEffect(() => {
    const canvas = canvasRef.current
    const container = containerRef.current
    if (!canvas || !container) return

    // Set canvas size based on container and aspect ratio
    const containerWidth = container.clientWidth
    const containerHeight = container.clientHeight

    const { width, height } = getAspectRatioDimensions(
      containerWidth,
      containerHeight,
      store.aspectRatio
    )

    const dpr = window.devicePixelRatio || 1
    canvas.width = width * dpr
    canvas.height = height * dpr
    canvas.style.width = width + 'px'
    canvas.style.height = height + 'px'

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    ctx.scale(dpr, dpr)

    // Generate layout
    let layouts
    if (store.images.length === 0) {
      ctx.fillStyle = store.backgroundColor
      ctx.fillRect(0, 0, width, height)
      return
    }

    switch (store.layoutMode) {
      case 'grid':
        layouts = generateGridLayout(width, height, store.gridCols, store.gridRows, store.gap, store.images.length)
        break
      case 'masonry':
        layouts = generateMasonryLayout(width, height, store.gridCols, store.gap, store.images.length)
        break
      case 'vertical-stack':
        layouts = generateVerticalStackLayout(width, height, store.gap, store.images.length)
        break
      case 'horizontal-stack':
        layouts = generateHorizontalStackLayout(width, height, store.gap, store.images.length)
        break
      default:
        layouts = []
    }

    // Draw collage
    drawCollage(ctx, width, height, layouts, store.images, store.backgroundColor)
  }, [store])

  return (
    <div
      ref={containerRef}
      className="flex-1 flex items-center justify-center bg-gray-100 rounded-lg overflow-hidden"
    >
      <canvas
        ref={canvasRef}
        className="max-w-full max-h-full shadow-lg"
      />
    </div>
  )
}
