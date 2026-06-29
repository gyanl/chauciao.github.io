import { create } from 'zustand'

export interface ImageLayer {
  id: string
  src: string
  effects: {
    blackAndWhite: boolean
    halftone: boolean
    halftonePattern: 'dots' | 'floyd' | 'bayer'
    circles: boolean
    circleCount: number
  }
}

export interface CollageState {
  images: ImageLayer[]
  layoutMode: 'grid' | 'masonry' | 'vertical-stack' | 'horizontal-stack'
  gridCols: number
  gridRows: number
  aspectRatio: '1:1' | '16:9' | '4:5'
  backgroundColor: string
  gap: number
  selectedImageId: string | null

  addImage: (src: string) => void
  removeImage: (id: string) => void
  updateImageEffect: (id: string, effect: keyof ImageLayer['effects'], value: any) => void
  setLayoutMode: (mode: CollageState['layoutMode']) => void
  setGridCols: (cols: number) => void
  setGridRows: (rows: number) => void
  setAspectRatio: (ratio: CollageState['aspectRatio']) => void
  setBackgroundColor: (color: string) => void
  setGap: (gap: number) => void
  selectImage: (id: string | null) => void
  clear: () => void
}

export const useCollageStore = create<CollageState>((set) => ({
  images: [],
  layoutMode: 'grid',
  gridCols: 3,
  gridRows: 3,
  aspectRatio: '1:1',
  backgroundColor: '#ffffff',
  gap: 8,
  selectedImageId: null,

  addImage: (src: string) => set((state) => ({
    images: [...state.images, {
      id: Date.now().toString(),
      src,
      effects: {
        blackAndWhite: false,
        halftone: false,
        halftonePattern: 'dots',
        circles: false,
        circleCount: 3,
      }
    }]
  })),

  removeImage: (id: string) => set((state) => ({
    images: state.images.filter(img => img.id !== id),
    selectedImageId: state.selectedImageId === id ? null : state.selectedImageId
  })),

  updateImageEffect: (id: string, effect: keyof ImageLayer['effects'], value: any) =>
    set((state) => ({
      images: state.images.map(img =>
        img.id === id
          ? { ...img, effects: { ...img.effects, [effect]: value } }
          : img
      )
    })),

  setLayoutMode: (mode) => set({ layoutMode: mode }),
  setGridCols: (cols) => set({ gridCols: cols }),
  setGridRows: (rows) => set({ gridRows: rows }),
  setAspectRatio: (ratio) => set({ aspectRatio: ratio }),
  setBackgroundColor: (color) => set({ backgroundColor: color }),
  setGap: (gap) => set({ gap }),
  selectImage: (id) => set({ selectedImageId: id }),
  clear: () => set({
    images: [],
    layoutMode: 'grid',
    gridCols: 3,
    gridRows: 3,
    aspectRatio: '1:1',
    backgroundColor: '#ffffff',
    gap: 8,
    selectedImageId: null,
  })
}))
