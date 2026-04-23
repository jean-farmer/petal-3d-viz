import { EffectComposer, N8AO } from '@react-three/postprocessing'

export function PostProcessing() {
  return (
    <EffectComposer disableNormalPass multisampling={0}>
      <N8AO color="#d4899e" aoRadius={2} intensity={1.2} />
    </EffectComposer>
  )
}
