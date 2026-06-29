# Collage Tool

A modern web-based collage generator built with React, Canvas, and Tailwind CSS.

## Features

- 🖼️ **Multiple Layout Modes**: Grid, Masonry, Vertical Stack, Horizontal Stack
- 🎨 **Per-Image Effects**: 
  - Black & White conversion
  - Halftone dithering (Dots, Floyd-Steinberg, Bayer)
  - Geometric circle overlays
- 📐 **Flexible Aspect Ratios**: 1:1 Square, 16:9 Landscape, 4:5 Portrait
- 🎯 **Automatic Layout Generation**: Add images and they automatically fill the layout
- 💾 **WebP Export**: Download your collage as a modern WebP file
- 📱 **Responsive Design**: Works on desktop and tablet

## Setup

### Prerequisites
- Node.js 16+ and npm

### Installation

```bash
cd collage-tool
npm install
```

### Development

```bash
npm run dev
```

Open http://localhost:5173 in your browser.

### Build for Production

```bash
npm run build
```

This generates optimized files in the `dist/` folder.

## Usage

1. **Add Images**: Click "Add Images" to upload single or multiple images
2. **Select Layout**: Choose your preferred layout template
3. **Customize**: Adjust grid size, aspect ratio, gap, and background color
4. **Apply Effects**: Select an image and apply B&W, halftone, or circle overlays
5. **Export**: Click "Export WebP" to download your collage

## Deployment

### To GitHub Pages

1. Build the project:
   ```bash
   npm run build
   ```

2. Copy the `dist` folder to your GitHub Pages location or use a deployment script

3. Access at: `yourdomain.com/collage-tool/`

## Architecture

- **React 18**: UI framework
- **Canvas API**: High-performance rendering
- **Zustand**: Lightweight state management
- **Tailwind CSS**: Utility-first styling
- **Vite**: Fast build tool
- **TypeScript**: Type-safe development

## License

MIT
