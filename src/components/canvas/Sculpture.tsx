import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import { Float } from '@react-three/drei'
import { useControls } from 'leva'
import { useAudioStore } from '../../stores/audioStore'
import * as THREE from 'three'
import vertexShader from '../../shaders/displacement.vert?raw'
import fragmentShader from '../../shaders/shimmer.frag?raw'

export function Sculpture() {
  const meshRef = useRef<THREE.Mesh>(null)

  const geometry = useControls('Geometry', {
    detail: { value: 64, min: 1, max: 128, step: 1 },
    scale: { value: 1.5, min: 0.5, max: 3, step: 0.1 },
  })

  const shader = useControls('Shader', {
    color1: '#f5c6d0',
    color2: '#f9dde5',
    color3: '#ffffff',
    noiseScale: { value: 1.5, min: 0.1, max: 5, step: 0.1 },
    displacementStrength: { value: 0.3, min: 0, max: 1, step: 0.01 },
    fresnelPower: { value: 2.5, min: 0.5, max: 6, step: 0.1 },
    fresnelIntensity: { value: 0.8, min: 0, max: 3, step: 0.1 },
  })

  const animation = useControls('Animation', {
    rotationSpeed: { value: 0.3, min: 0, max: 2, step: 0.01 },
    floatSpeed: { value: 1.5, min: 0, max: 5, step: 0.1 },
    floatIntensity: { value: 1, min: 0, max: 3, step: 0.1 },
    rotationIntensity: { value: 0.5, min: 0, max: 2, step: 0.1 },
  })

  const audio = useControls('Audio Mapping', {
    bassPulse: { value: 0.15, min: 0, max: 0.5, step: 0.01 },
  })

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uBass: { value: 0 },
      uMids: { value: 0 },
      uHighs: { value: 0 },
      uNoiseScale: { value: shader.noiseScale },
      uDisplacementStrength: { value: shader.displacementStrength },
      uColor1: { value: new THREE.Color(shader.color1) },
      uColor2: { value: new THREE.Color(shader.color2) },
      uColor3: { value: new THREE.Color(shader.color3) },
      uFresnelPower: { value: shader.fresnelPower },
      uFresnelIntensity: { value: shader.fresnelIntensity },
    }),
    [],
  )

  useFrame(({ clock }) => {
    if (!meshRef.current) return
    const mat = meshRef.current.material as THREE.ShaderMaterial

    meshRef.current.rotation.y = clock.elapsedTime * animation.rotationSpeed
    meshRef.current.rotation.x = Math.sin(clock.elapsedTime * 0.2) * 0.1

    const { bass, mids, highs } = useAudioStore.getState()

    mat.uniforms.uTime.value = clock.elapsedTime
    mat.uniforms.uBass.value = bass
    mat.uniforms.uMids.value = mids
    mat.uniforms.uHighs.value = highs
    mat.uniforms.uNoiseScale.value = shader.noiseScale
    mat.uniforms.uDisplacementStrength.value = shader.displacementStrength
    mat.uniforms.uColor1.value.set(shader.color1)
    mat.uniforms.uColor2.value.set(shader.color2)
    mat.uniforms.uColor3.value.set(shader.color3)
    mat.uniforms.uFresnelPower.value = shader.fresnelPower
    mat.uniforms.uFresnelIntensity.value = shader.fresnelIntensity

    const pulse = 1 + bass * audio.bassPulse
    meshRef.current.scale.setScalar(pulse)
  })

  return (
    <Float
      speed={animation.floatSpeed}
      rotationIntensity={animation.rotationIntensity}
      floatIntensity={animation.floatIntensity}
    >
      <mesh ref={meshRef}>
        <icosahedronGeometry args={[geometry.scale, geometry.detail]} />
        <shaderMaterial
          vertexShader={vertexShader}
          fragmentShader={fragmentShader}
          uniforms={uniforms}
        />
      </mesh>
    </Float>
  )
}
