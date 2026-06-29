import { CollageCanvas } from './components/CollageCanvas'
import { Controls } from './components/Controls'

export default function App() {
  return (
    <div className="flex h-screen w-screen gap-6 p-6 bg-gray-50">
      <CollageCanvas />
      <Controls />
    </div>
  )
}
