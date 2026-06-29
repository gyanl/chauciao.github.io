import { useRef } from 'react'
import { useCollageStore } from '../store'
import { fileToDataURL, canvasToWebP, downloadBlob } from '../lib/utils'
import { Trash2, Plus, Download, Settings2, Image } from 'lucide-react'

export function Controls() {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const store = useCollageStore()

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.currentTarget.files
    if (!files) return

    for (const file of files) {
      const dataUrl = await fileToDataURL(file)
      store.addImage(dataUrl)
    }
  }

  const handleExport = async () => {
    const canvas = document.querySelector('canvas')
    if (!canvas) return

    const blob = await canvasToWebP(canvas, 0.95)
    if (blob) {
      downloadBlob(blob, `collage-${Date.now()}.webp`)
    }
  }

  const selectedImage = store.images.find(img => img.id === store.selectedImageId)

  return (
    <div className="w-80 bg-white shadow-lg rounded-lg overflow-hidden flex flex-col">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-4">
        <h2 className="text-white font-bold text-lg flex items-center gap-2">
          <Settings2 size={20} />
          Collage Tool
        </h2>
      </div>

      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        {/* Upload Section */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-3">Images</label>
          <input
            ref={fileInputRef}
            type="file"
            multiple
            accept="image/*"
            onChange={handleFileSelect}
            className="hidden"
          />
          <button
            onClick={() => fileInputRef.current?.click()}
            className="w-full bg-blue-50 hover:bg-blue-100 border-2 border-dashed border-blue-300 rounded-lg py-8 transition flex flex-col items-center gap-2 text-blue-600"
          >
            <Plus size={24} />
            <span className="text-sm font-medium">Add Images</span>
          </button>
          {store.images.length > 0 && (
            <p className="text-xs text-gray-500 mt-2">{store.images.length} image(s) added</p>
          )}
        </div>

        {/* Image List */}
        {store.images.length > 0 && (
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Images</label>
            <div className="space-y-2">
              {store.images.map((img, idx) => (
                <div
                  key={img.id}
                  onClick={() => store.selectImage(img.id)}
                  className={`p-3 rounded-lg cursor-pointer border-2 transition flex items-center justify-between ${
                    store.selectedImageId === img.id
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 bg-gray-50 hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-center gap-2 flex-1 min-w-0">
                    <Image size={16} className="text-gray-400 flex-shrink-0" />
                    <span className="text-sm font-medium truncate">Image {idx + 1}</span>
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      store.removeImage(img.id)
                    }}
                    className="text-gray-400 hover:text-red-600 transition flex-shrink-0"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Layout Section */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-3">Layout</label>
          <div className="grid grid-cols-2 gap-2">
            {(['grid', 'masonry', 'vertical-stack', 'horizontal-stack'] as const).map((mode) => (
              <button
                key={mode}
                onClick={() => store.setLayoutMode(mode)}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition ${
                  store.layoutMode === mode
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {mode === 'grid' && 'Grid'}
                {mode === 'masonry' && 'Masonry'}
                {mode === 'vertical-stack' && 'V. Stack'}
                {mode === 'horizontal-stack' && 'H. Stack'}
              </button>
            ))}
          </div>
        </div>

        {/* Grid Settings */}
        {(store.layoutMode === 'grid' || store.layoutMode === 'masonry') && (
          <div className="space-y-3">
            <div>
              <label className="text-sm font-medium text-gray-700 mb-2 block">
                Columns: {store.gridCols}
              </label>
              <input
                type="range"
                min="1"
                max="6"
                value={store.gridCols}
                onChange={(e) => store.setGridCols(Number(e.target.value))}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
              />
            </div>
            {store.layoutMode === 'grid' && (
              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">
                  Rows: {store.gridRows}
                </label>
                <input
                  type="range"
                  min="1"
                  max="6"
                  value={store.gridRows}
                  onChange={(e) => store.setGridRows(Number(e.target.value))}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                />
              </div>
            )}
          </div>
        )}

        {/* Aspect Ratio */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-3">Aspect Ratio</label>
          <div className="grid grid-cols-3 gap-2">
            {(['1:1', '16:9', '4:5'] as const).map((ratio) => (
              <button
                key={ratio}
                onClick={() => store.setAspectRatio(ratio)}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition ${
                  store.aspectRatio === ratio
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {ratio}
              </button>
            ))}
          </div>
        </div>

        {/* Gap */}
        <div>
          <label className="text-sm font-medium text-gray-700 mb-2 block">Gap: {store.gap}px</label>
          <input
            type="range"
            min="0"
            max="32"
            value={store.gap}
            onChange={(e) => store.setGap(Number(e.target.value))}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
          />
        </div>

        {/* Background Color */}
        <div>
          <label className="text-sm font-medium text-gray-700 mb-2 block">Background</label>
          <div className="flex gap-2">
            <input
              type="color"
              value={store.backgroundColor}
              onChange={(e) => store.setBackgroundColor(e.target.value)}
              className="w-12 h-10 rounded-lg cursor-pointer border border-gray-300"
            />
            <input
              type="text"
              value={store.backgroundColor}
              onChange={(e) => store.setBackgroundColor(e.target.value)}
              className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm"
            />
          </div>
        </div>

        {/* Image Effects */}
        {selectedImage && (
          <div className="pt-4 border-t">
            <h3 className="text-sm font-semibold text-gray-700 mb-3">Image Effects</h3>
            <div className="space-y-3">
              {/* Black and White */}
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={selectedImage.effects.blackAndWhite}
                  onChange={(e) =>
                    store.updateImageEffect(selectedImage.id, 'blackAndWhite', e.target.checked)
                  }
                  className="w-4 h-4 rounded border-gray-300"
                />
                <span className="text-sm font-medium text-gray-700">Black & White</span>
              </label>

              {/* Halftone */}
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={selectedImage.effects.halftone}
                  onChange={(e) =>
                    store.updateImageEffect(selectedImage.id, 'halftone', e.target.checked)
                  }
                  className="w-4 h-4 rounded border-gray-300"
                />
                <span className="text-sm font-medium text-gray-700">Halftone Dither</span>
              </label>

              {selectedImage.effects.halftone && (
                <div className="ml-7">
                  <select
                    value={selectedImage.effects.halftonePattern}
                    onChange={(e) =>
                      store.updateImageEffect(
                        selectedImage.id,
                        'halftonePattern',
                        e.target.value as any
                      )
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                  >
                    <option value="dots">Halftone Dots</option>
                    <option value="floyd">Floyd-Steinberg</option>
                    <option value="bayer">Bayer Matrix</option>
                  </select>
                </div>
              )}

              {/* Circles */}
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={selectedImage.effects.circles}
                  onChange={(e) =>
                    store.updateImageEffect(selectedImage.id, 'circles', e.target.checked)
                  }
                  className="w-4 h-4 rounded border-gray-300"
                />
                <span className="text-sm font-medium text-gray-700">Circle Overlay</span>
              </label>

              {selectedImage.effects.circles && (
                <div className="ml-7">
                  <label className="text-sm font-medium text-gray-700 mb-2 block">
                    Circles: {selectedImage.effects.circleCount}
                  </label>
                  <input
                    type="range"
                    min="1"
                    max="10"
                    value={selectedImage.effects.circleCount}
                    onChange={(e) =>
                      store.updateImageEffect(selectedImage.id, 'circleCount', Number(e.target.value))
                    }
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                  />
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="border-t bg-gray-50 px-6 py-4 space-y-2">
        <button
          onClick={handleExport}
          disabled={store.images.length === 0}
          className="w-full bg-green-600 hover:bg-green-700 disabled:bg-gray-300 text-white font-semibold py-2 rounded-lg transition flex items-center justify-center gap-2"
        >
          <Download size={18} />
          Export WebP
        </button>
        <button
          onClick={store.clear}
          className="w-full bg-gray-200 hover:bg-gray-300 text-gray-700 font-medium py-2 rounded-lg transition"
        >
          Clear All
        </button>
      </div>
    </div>
  )
}
