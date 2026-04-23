import { useRef } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import { Physics, RigidBody, BallCollider, CuboidCollider } from '@react-three/rapier'
import { useControls } from 'leva'
import { useAudioStore } from '../../stores/audioStore'
import * as THREE from 'three'

const sphereGeometry = new THREE.SphereGeometry(1, 64, 64)
const orbMaterial = new THREE.MeshPhysicalMaterial({
  color: '#f0b5c4',
  roughness: 0.7,
  metalness: 0,
  clearcoat: 0.15,
  clearcoatRoughness: 0.6,
  envMapIntensity: 0.15,
})

const sizes = [0.17, 0.17, 0.17, 0.22, 0.22, 0.22, 0.27, 0.27, 0.34, 0.44]

function randomSpread(range: number) {
  return (Math.random() - 0.5) * range
}

const orbData = [...Array(50)].map(() => ({
  scale: sizes[Math.floor(Math.random() * sizes.length)],
}))

function Orb({ scale }: { scale: number }) {
  const api = useRef<any>(null)
  const vec = useRef(new THREE.Vector3())

  useFrame((_, delta) => {
    if (!api.current) return
    const d = Math.min(0.1, delta)
    const pos = api.current.translation()

    // Gentle gravity toward center
    vec.current.set(pos.x, pos.y, pos.z)
    vec.current.normalize().multiplyScalar(-d * scale * 4)
    api.current.applyImpulse(vec.current, true)
  })

  return (
    <RigidBody
      ref={api}
      linearDamping={2}
      angularDamping={1}
      friction={0.2}
      restitution={0.3}
      position={[randomSpread(8), randomSpread(8), randomSpread(3)]}
      colliders={false}
    >
      <BallCollider args={[scale]} />
      <mesh
        castShadow
        receiveShadow
        scale={scale}
        geometry={sphereGeometry}
        material={orbMaterial}
      />
    </RigidBody>
  )
}

function Pointer() {
  const ref = useRef<any>(null)
  const vec = useRef(new THREE.Vector3())
  const { viewport } = useThree()

  useFrame(({ pointer }) => {
    if (!ref.current) return
    vec.current.lerp(
      {
        x: (pointer.x * viewport.width) / 2,
        y: (pointer.y * viewport.height) / 2,
        z: 0,
      } as THREE.Vector3,
      0.2,
    )
    ref.current.setNextKinematicTranslation(vec.current)
  })

  return (
    <RigidBody
      position={[100, 100, 100]}
      type="kinematicPosition"
      colliders={false}
      ref={ref}
    >
      <BallCollider args={[1.5]} />
    </RigidBody>
  )
}

function Walls() {
  const { viewport } = useThree()
  const w = viewport.width / 2
  const h = viewport.height / 2
  const thick = 0.5
  const depth = 5

  return (
    <>
      {/* Left */}
      <RigidBody type="fixed" position={[-w - thick, 0, 0]} colliders={false}>
        <CuboidCollider args={[thick, h + 2, depth]} />
      </RigidBody>
      {/* Right */}
      <RigidBody type="fixed" position={[w + thick, 0, 0]} colliders={false}>
        <CuboidCollider args={[thick, h + 2, depth]} />
      </RigidBody>
      {/* Top */}
      <RigidBody type="fixed" position={[0, h + thick, 0]} colliders={false}>
        <CuboidCollider args={[w + 2, thick, depth]} />
      </RigidBody>
      {/* Bottom */}
      <RigidBody type="fixed" position={[0, -h - thick, 0]} colliders={false}>
        <CuboidCollider args={[w + 2, thick, depth]} />
      </RigidBody>
      {/* Front */}
      <RigidBody type="fixed" position={[0, 0, depth]} colliders={false}>
        <CuboidCollider args={[w + 2, h + 2, thick]} />
      </RigidBody>
      {/* Back */}
      <RigidBody type="fixed" position={[0, 0, -depth]} colliders={false}>
        <CuboidCollider args={[w + 2, h + 2, thick]} />
      </RigidBody>
    </>
  )
}

export function OrbSwarm() {
  return (
    <Physics gravity={[0, 0, 0]}>
      <Pointer />
      <Walls />
      {orbData.map((props, i) => (
        <Orb key={i} {...props} />
      ))}
    </Physics>
  )
}
