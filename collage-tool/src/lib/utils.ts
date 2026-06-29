export function cn(...classes: (string | undefined | null | false)[]): string {
  return classes.filter(Boolean).join(' ')
}

export async function canvasToWebP(canvas: HTMLCanvasElement, quality: number = 0.9): Promise<Blob | null> {
  return new Promise((resolve) => {
    canvas.toBlob((blob) => {
      resolve(blob)
    }, 'image/webp', quality)
  })
}

export function downloadBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = filename
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}

export async function fileToDataURL(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(reader.result as string)
    reader.onerror = reject
    reader.readAsDataURL(file)
  })
}

export function getAspectRatioDimensions(
  containerWidth: number,
  containerHeight: number,
  ratio: '1:1' | '16:9' | '4:5'
): { width: number; height: number } {
  const ratios: Record<string, number> = {
    '1:1': 1,
    '16:9': 16 / 9,
    '4:5': 4 / 5
  }

  const targetRatio = ratios[ratio]
  const containerRatio = containerWidth / containerHeight

  if (containerRatio > targetRatio) {
    return {
      width: containerHeight * targetRatio,
      height: containerHeight
    }
  } else {
    return {
      width: containerWidth,
      height: containerWidth / targetRatio
    }
  }
}
