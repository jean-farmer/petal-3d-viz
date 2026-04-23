import { Canvas } from '@react-three/fiber'
import { OrbitControls, Environment } from '@react-three/drei'
import { Sculpture } from './Sculpture'
import { Lighting } from './Lighting'
import { PostProcessing } from './PostProcessing'

export function Scene() {
  return (
    <Canvas
      camera={{ position: [0, 0, 5], fov: 50 }}
      gl={{ antialias: true }}
    >
      <color attach="background" args={['#f0eded']} />
      <Lighting />
      <Environment preset="city" />
      <Sculpture />
      <OrbitControls enableZoom={false} enablePan={false} />
      <PostProcessing />
    </Canvas>
  )
}
