import { Scene } from './components/canvas/Scene'
import { AudioDropzone } from './components/ui/AudioDropzone'
import { GlassCursor } from './components/ui/GlassCursor'
import { Title } from './components/ui/Title'

function App() {
  return (
    <>
      <Scene />
      <Title />
      <AudioDropzone />
      <GlassCursor />
    </>
  )
}

export default App
