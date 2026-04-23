import { Canvas } from '@react-three/fiber'
import { Environment } from '@react-three/drei'
import { OrbSwarm } from './OrbSwarm'
import { Lighting } from './Lighting'
import { PostProcessing } from './PostProcessing'

export function Scene() {
  return (
    <Canvas
      camera={{ position: [0, 0, 8], fov: 50 }}
      gl={{ antialias: true }}
      orthographic={false}
    >
      <color attach="background" args={['#e4e8f0']} />
      <Lighting />
      <Environment preset="apartment" background={false} environmentIntensity={0.15} />
      <OrbSwarm />
      <PostProcessing />
    </Canvas>
  )
}
