import { EffectComposer, Bloom, Vignette } from '@react-three/postprocessing'

export function PostProcessing() {
  return (
    <EffectComposer multisampling={0}>
      <Bloom
        intensity={0.6}
        luminanceThreshold={0.6}
        luminanceSmoothing={0.4}
        mipmapBlur
      />
      <Vignette darkness={0.4} offset={0.3} />
    </EffectComposer>
  )
}
