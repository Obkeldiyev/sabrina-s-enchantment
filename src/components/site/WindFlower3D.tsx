import * as React from "react";
import * as THREE from "three";
import { Canvas, useFrame, useThree } from "@react-three/fiber";

function Petal({ position, rotation, scale }: any) {
  return (
    <mesh position={position} rotation={rotation} scale={scale} castShadow>
      <coneGeometry args={[0.18, 0.6, 6]} />
      <meshStandardMaterial
        color="#f4ecd6"
        emissive="#ffaa55"
        emissiveIntensity={0.35}
        roughness={0.55}
        metalness={0.1}
        flatShading
      />
    </mesh>
  );
}

function PetalSphere() {
  const group = React.useRef<THREE.Group>(null);
  const inner = React.useRef<THREE.PointLight>(null);
  const petals = React.useMemo(() => {
    const N = 140;
    const phi = Math.PI * (3 - Math.sqrt(5));
    const arr: any[] = [];
    for (let i = 0; i < N; i++) {
      const y = 1 - (i / (N - 1)) * 2;
      const r = Math.sqrt(1 - y * y);
      const theta = phi * i;
      const x = Math.cos(theta) * r;
      const z = Math.sin(theta) * r;
      const v = new THREE.Vector3(x, y, z).multiplyScalar(1.2);
      const out = v.clone().normalize();
      const q = new THREE.Quaternion().setFromUnitVectors(
        new THREE.Vector3(0, 1, 0),
        out,
      );
      const e = new THREE.Euler().setFromQuaternion(q);
      arr.push({ pos: v.toArray(), rot: [e.x, e.y, e.z], scale: 1 + Math.random() * 0.25 });
    }
    return arr;
  }, []);

  useFrame((s) => {
    const t = s.clock.elapsedTime;
    if (group.current) {
      group.current.rotation.y = t * 0.25;
      group.current.position.y = 1.6 + Math.sin(t * 0.8) * 0.05;
      const breathe = 1 + Math.sin(t * 1.2) * 0.02;
      group.current.scale.setScalar(breathe);
    }
    if (inner.current) inner.current.intensity = 2.5 + Math.sin(t * 1.6) * 0.6;
  });

  return (
    <group ref={group} position={[0, 1.6, 0]}>
      <pointLight ref={inner} color="#ffcc88" intensity={3} distance={6} />
      <mesh>
        <sphereGeometry args={[0.85, 32, 32]} />
        <meshStandardMaterial
          color="#fff2d6"
          emissive="#ffb060"
          emissiveIntensity={0.6}
          roughness={0.4}
        />
      </mesh>
      {petals.map((p, i) => (
        <Petal key={i} position={p.pos} rotation={p.rot} scale={p.scale} />
      ))}
    </group>
  );
}

function Stem() {
  const points = React.useMemo(() => {
    const arr: THREE.Vector3[] = [];
    for (let i = 0; i <= 20; i++) {
      const t = i / 20;
      const r = 0.18 - t * 0.13 + (1 - t) * 0.02;
      arr.push(new THREE.Vector3(0, t * 1.6 - 0.4, 0));
      void r;
    }
    return arr;
  }, []);
  void points;
  return (
    <mesh position={[0, 0.4, 0]}>
      <cylinderGeometry args={[0.22, 0.05, 1.8, 24, 1, true]} />
      <meshStandardMaterial
        color="#efe6cc"
        roughness={0.65}
        metalness={0.05}
        side={THREE.DoubleSide}
      />
    </mesh>
  );
}

function Base() {
  return (
    <mesh position={[0, -0.55, 0]}>
      <cylinderGeometry args={[0.28, 0.42, 0.2, 32]} />
      <meshStandardMaterial color="#e6dcc0" roughness={0.7} />
    </mesh>
  );
}

function Scene() {
  const { camera } = useThree();
  const target = React.useRef({ x: 0, y: 0 });
  React.useEffect(() => {
    const move = (e: MouseEvent) => {
      target.current.x = (e.clientX / window.innerWidth - 0.5) * 0.8;
      target.current.y = (e.clientY / window.innerHeight - 0.5) * 0.4;
    };
    window.addEventListener("mousemove", move);
    return () => window.removeEventListener("mousemove", move);
  }, []);
  useFrame(() => {
    camera.position.x += (target.current.x * 1.2 - camera.position.x) * 0.05;
    camera.position.y += (1.4 - target.current.y - camera.position.y) * 0.05;
    camera.lookAt(0, 1.2, 0);
  });
  return (
    <>
      <ambientLight intensity={0.25} />
      <directionalLight position={[3, 5, 4]} intensity={0.8} />
      <directionalLight position={[-4, 2, -2]} intensity={0.3} color="#88aaff" />
      <Stem />
      <Base />
      <PetalSphere />
    </>
  );
}

export default function WindFlower3D({ className = "" }: { className?: string }) {
  const [supported, setSupported] = React.useState(true);
  React.useEffect(() => {
    try {
      const c = document.createElement("canvas");
      const gl = c.getContext("webgl2") || c.getContext("webgl");
      if (!gl) setSupported(false);
    } catch {
      setSupported(false);
    }
  }, []);
  if (!supported) {
    return (
      <img
        src="/windflower-product.png"
        alt="WindFlower"
        className={`drop-shadow-2xl ${className}`}
      />
    );
  }
  return (
    <div className={className}>
      <Canvas
        camera={{ position: [0, 1.4, 4.2], fov: 38 }}
        dpr={[1, 2]}
        gl={{ antialias: true, alpha: true }}
      >
        <Scene />
      </Canvas>
    </div>
  );
}
