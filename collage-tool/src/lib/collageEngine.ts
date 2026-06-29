import { ImageLayer } from '../store'

export interface LayoutCell {
  x: number
  y: number
  width: number
  height: number
  imageIndex: number | null
}

export function generateGridLayout(
  containerWidth: number,
  containerHeight: number,
  cols: number,
  rows: number,
  gap: number,
  imageCount: number
): LayoutCell[] {
  const cellWidth = (containerWidth - (cols - 1) * gap) / cols
  const cellHeight = (containerHeight - (rows - 1) * gap) / rows
  const cells: LayoutCell[] = []
  let imageIndex = 0

  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      cells.push({
        x: c * (cellWidth + gap),
        y: r * (cellHeight + gap),
        width: cellWidth,
        height: cellHeight,
        imageIndex: imageIndex < imageCount ? imageIndex : null
      })
      imageIndex = (imageIndex + 1) % imageCount
    }
  }
  return cells
}

export function generateMasonryLayout(
  containerWidth: number,
  containerHeight: number,
  cols: number,
  gap: number,
  imageCount: number
): LayoutCell[] {
  const cellWidth = (containerWidth - (cols - 1) * gap) / cols
  const cells: LayoutCell[] = []
  const colHeights = Array(cols).fill(0)

  for (let i = 0; i < imageCount; i++) {
    const shortestColIdx = colHeights.indexOf(Math.min(...colHeights))
    const x = shortestColIdx * (cellWidth + gap)
    const y = colHeights[shortestColIdx]
    const height = cellWidth * 0.8 + Math.random() * cellWidth * 0.4

    cells.push({
      x,
      y,
      width: cellWidth,
      height,
      imageIndex: i
    })

    colHeights[shortestColIdx] += height + gap
  }
  return cells
}

export function generateVerticalStackLayout(
  containerWidth: number,
  containerHeight: number,
  gap: number,
  imageCount: number
): LayoutCell[] {
  const cellHeight = (containerHeight - (imageCount - 1) * gap) / imageCount
  return Array.from({ length: imageCount }, (_, i) => ({
    x: 0,
    y: i * (cellHeight + gap),
    width: containerWidth,
    height: cellHeight,
    imageIndex: i
  }))
}

export function generateHorizontalStackLayout(
  containerWidth: number,
  containerHeight: number,
  gap: number,
  imageCount: number
): LayoutCell[] {
  const cellWidth = (containerWidth - (imageCount - 1) * gap) / imageCount
  return Array.from({ length: imageCount }, (_, i) => ({
    x: i * (cellWidth + gap),
    y: 0,
    width: cellWidth,
    height: containerHeight,
    imageIndex: i
  }))
}

export function applyBlackAndWhiteFilter(ctx: CanvasRenderingContext2D, x: number, y: number, width: number, height: number) {
  const imageData = ctx.getImageData(x, y, width, height)
  const data = imageData.data

  for (let i = 0; i < data.length; i += 4) {
    const gray = data[i] * 0.299 + data[i + 1] * 0.587 + data[i + 2] * 0.114
    data[i] = gray
    data[i + 1] = gray
    data[i + 2] = gray
  }

  ctx.putImageData(imageData, x, y)
}

export function applyHalftoneEffect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  width: number,
  height: number,
  pattern: 'dots' | 'floyd' | 'bayer' = 'dots',
  pixelSize: number = 4
) {
  const imageData = ctx.getImageData(x, y, width, height)
  const data = imageData.data

  // Convert to grayscale first
  const brightness = new Float32Array(width * height)
  for (let i = 0; i < data.length; i += 4) {
    const idx = i / 4
    brightness[idx] = (data[i] * 0.299 + data[i + 1] * 0.587 + data[i + 2] * 0.114) / 255
  }

  // Clear the area
  ctx.fillStyle = '#ffffff'
  ctx.fillRect(x, y, width, height)
  ctx.fillStyle = '#000000'

  if (pattern === 'dots') {
    // Halftone dots
    for (let py = 0; py < height; py += pixelSize) {
      for (let px = 0; px < width; px += pixelSize) {
        const idx = Math.floor((py / height) * brightness.length) + Math.floor((px / width) * width)
        const bv = brightness[Math.min(idx, brightness.length - 1)] || 0
        const radius = (1 - bv) * (pixelSize / 2)
        if (radius > 0.5) {
          ctx.beginPath()
          ctx.arc(x + px, y + py, radius, 0, Math.PI * 2)
          ctx.fill()
        }
      }
    }
  } else if (pattern === 'bayer') {
    // Bayer ordered dithering
    const bayerMatrix = [
      [0, 8, 2, 10],
      [12, 4, 14, 6],
      [3, 11, 1, 9],
      [15, 7, 13, 5]
    ]

    for (let py = 0; py < height; py += pixelSize) {
      for (let px = 0; px < width; px += pixelSize) {
        const idx = Math.floor((py / height) * brightness.length) + Math.floor((px / width) * width)
        const bv = brightness[Math.min(idx, brightness.length - 1)] || 0
        const threshold = (bayerMatrix[px % 4][py % 4] + 0.5) / 16
        if (bv > threshold) {
          ctx.fillRect(x + px, y + py, pixelSize, pixelSize)
        }
      }
    }
  }
}

export function drawCircleOverlay(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  width: number,
  height: number,
  circleCount: number
) {
  ctx.strokeStyle = 'rgba(0, 0, 0, 0.3)'
  ctx.lineWidth = 2

  const centerX = x + width / 2
  const centerY = y + height / 2
  const maxRadius = Math.max(width, height) / 2

  for (let i = 1; i <= circleCount; i++) {
    const radius = (i / circleCount) * maxRadius
    ctx.beginPath()
    ctx.arc(centerX, centerY, radius, 0, Math.PI * 2)
    ctx.stroke()
  }
}

export async function drawCollage(
  ctx: CanvasRenderingContext2D,
  containerWidth: number,
  containerHeight: number,
  layouts: LayoutCell[],
  images: ImageLayer[],
  backgroundColor: string
) {
  // Fill background
  ctx.fillStyle = backgroundColor
  ctx.fillRect(0, 0, containerWidth, containerHeight)

  // Draw each cell
  for (const cell of layouts) {
    if (cell.imageIndex !== null && cell.imageIndex < images.length) {
      const image = images[cell.imageIndex]
      await drawImageCell(ctx, image, cell.x, cell.y, cell.width, cell.height)
    }
  }
}

async function drawImageCell(
  ctx: CanvasRenderingContext2D,
  image: ImageLayer,
  x: number,
  y: number,
  width: number,
  height: number
) {
  return new Promise<void>((resolve) => {
    const img = new Image()
    img.crossOrigin = 'anonymous'
    img.onload = () => {
      ctx.save()
      ctx.beginPath()
      ctx.rect(x, y, width, height)
      ctx.clip()

      // Draw image with cover fit
      const imgAspect = img.width / img.height
      const cellAspect = width / height
      let drawWidth = width
      let drawHeight = height
      let drawX = x
      let drawY = y

      if (imgAspect > cellAspect) {
        drawWidth = height * imgAspect
        drawX = x - (drawWidth - width) / 2
      } else {
        drawHeight = width / imgAspect
        drawY = y - (drawHeight - height) / 2
      }

      ctx.drawImage(img, drawX, drawY, drawWidth, drawHeight)

      // Apply effects
      if (image.effects.blackAndWhite) {
        applyBlackAndWhiteFilter(ctx, x, y, width, height)
      }

      if (image.effects.halftone) {
        applyHalftoneEffect(ctx, x, y, width, height, image.effects.halftonePattern, 3)
      }

      if (image.effects.circles) {
        drawCircleOverlay(ctx, x, y, width, height, image.effects.circleCount)
      }

      ctx.restore()
      resolve()
    }
    img.onerror = () => resolve()
    img.src = image.src
  })
}
