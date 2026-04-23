# Petal

An interactive 3D audio-reactive visualization built with React Three Fiber. Soft pastel orbs float in a physics simulation, gently responding to music and mouse interaction.

![Petal demo](assets/demo.gif?v=2)

## Features

- **Physics-driven orbs** — 65 soft-body spheres simulated with Rapier, constrained to the viewport
- **Audio reactivity** — orbs pulse and scatter in response to bass frequencies via Web Audio FFT analysis
- **Mouse interaction** — push orbs around with your cursor to reveal the title underneath
- **Frosted glass UI** — minimal icon-only controls with backdrop blur
- **Drag-and-drop audio** — play the built-in track, upload your own, or connect a microphone

## Tech Stack

- [React Three Fiber](https://r3f.docs.pmnd.rs/) — declarative Three.js
- [@react-three/rapier](https://github.com/pmndrs/react-three-rapier) — rigid body physics
- [@react-three/postprocessing](https://github.com/pmndrs/react-postprocessing) — N8AO ambient occlusion
- [@react-three/drei](https://github.com/pmndrs/drei) — environment maps and helpers
- [Web Audio API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Audio_API) — FFT frequency analysis
- [Zustand](https://github.com/pmndrs/zustand) — audio state management
- [Leva](https://github.com/pmndrs/leva) — debug controls

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) and click play.

## License

MIT
