import { useControls } from 'leva'

export function Lighting() {
  const lighting = useControls('Lighting', {
    ambientIntensity: { value: 1.2, min: 0, max: 3, step: 0.1 },
    keyLightIntensity: { value: 2, min: 0, max: 5, step: 0.1 },
    fillColor: '#c4a0d0',
    fillIntensity: { value: 1.5, min: 0, max: 5, step: 0.1 },
    rimColor: '#f5c6d0',
    rimIntensity: { value: 1, min: 0, max: 5, step: 0.1 },
  })

  return (
    <>
      <ambientLight intensity={lighting.ambientIntensity} />
      <directionalLight position={[5, 5, 5]} intensity={lighting.keyLightIntensity} color="#ffffff" />
      <pointLight position={[-3, 2, 4]} intensity={lighting.fillIntensity} color={lighting.fillColor} />
      <pointLight position={[0, -3, 3]} intensity={lighting.rimIntensity} color={lighting.rimColor} />
    </>
  )
}
