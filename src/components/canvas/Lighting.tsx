export function Lighting() {
  return (
    <>
      <ambientLight intensity={2.2} />
      <directionalLight position={[0, 2, 8]} intensity={0.5} color="#fff5f7" />
      <directionalLight position={[-3, -1, 6]} intensity={0.3} color="#fde8ed" />
    </>
  )
}
