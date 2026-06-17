"use client";
import { useRef, useEffect } from "react";
import * as THREE from "three";

const VERTEX_SHADER = `
  uniform float time;
  uniform float mouseInfluence;
  uniform vec3 pointLightPos;
  varying vec3 vNormal;
  varying vec3 vPosition;

  void main() {
    vNormal = normal;
    vPosition = position;

    vec3 p = normalize(position);

    float w1 = sin(p.x * 3.0  + time * 0.70) * 0.090;
    float w2 = sin(p.y * 2.5  + time * 1.00) * 0.075;
    float w3 = sin(p.z * 3.5  + time * 0.55) * 0.055;
    float w4 = sin((p.x + p.y) * 2.2 + time * 0.85) * 0.045;
    float w5 = sin((p.y + p.z) * 2.8 + time * 1.20) * 0.035;

    float baseWave = w1 + w2 + w3 + w4 + w5;

    float facing = max(0.0, dot(p, normalize(pointLightPos)));
    float mouseWave = mouseInfluence * facing
                      * sin(facing * 6.0 - time * 2.5) * 0.20;

    float displacement = baseWave + mouseWave;
    vec3 newPosition = position + normal * displacement;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(newPosition, 1.0);
  }
`;

const FRAGMENT_SHADER = `
  uniform vec3 color;
  uniform vec3 pointLightPos;
  varying vec3 vNormal;
  varying vec3 vPosition;

  void main() {
    vec3 normal = normalize(vNormal);
    vec3 lightDir = normalize(pointLightPos - vPosition);
    float diffuse = max(dot(normal, lightDir), 0.0);
    float fresnel = 1.0 - dot(normal, vec3(0.0, 0.0, 1.0));
    fresnel = pow(fresnel, 2.0);
    vec3 finalColor = color * diffuse + color * fresnel * 0.5;
    gl_FragColor = vec4(finalColor, 1.0);
  }
`;

const W = 480;
const CENTER = new THREE.Vector3(0, 0, 4);

export default function MatterOrbLight() {
  const mountRef = useRef<HTMLDivElement>(null);
  const mouseRef = useRef({ x: 0, y: 0 });
  const targetInfluenceRef = useRef(0);
  const currentInfluenceRef = useRef(0);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const el = mountRef.current;
    if (!el) return;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, 1, 0.1, 1000);
    camera.position.set(0, 0, 2.5);
    camera.lookAt(new THREE.Vector3(0, 0, 0));

    const renderer = new THREE.WebGLRenderer({ antialias: false, alpha: true });
    renderer.setSize(W, W);
    renderer.setPixelRatio(1);
    el.appendChild(renderer.domElement);

    const geometry = new THREE.IcosahedronGeometry(1, 12);
    const material = new THREE.ShaderMaterial({
      uniforms: {
        time: { value: 0 },
        mouseInfluence: { value: 0 },
        pointLightPos: { value: CENTER.clone() },
        color: { value: new THREE.Color("#00d4ff") },
      },
      vertexShader: VERTEX_SHADER,
      fragmentShader: FRAGMENT_SHADER,
      wireframe: true,
    });

    const mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);

    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current = { x: e.clientX, y: e.clientY };
    };
    window.addEventListener("mousemove", handleMouseMove);

    let timeoutId: ReturnType<typeof setTimeout>;
    const startTime = Date.now();

    const animate = () => {
      const elapsed = (Date.now() - startTime) / 1000;
      material.uniforms.time.value = elapsed * 0.3;

      const rect = el.getBoundingClientRect();
      const lx = ((mouseRef.current.x - rect.left) / W) * 4 - 2;
      const ly = -((mouseRef.current.y - rect.top) / W) * 4 + 2;
      material.uniforms.pointLightPos.value.lerp(
        new THREE.Vector3(lx, ly, 4),
        0.12
      );

      const cx = rect.left + W / 2;
      const cy = rect.top + W / 2;
      const dx = (mouseRef.current.x - cx) / (W / 2);
      const dy = (mouseRef.current.y - cy) / (W / 2);
      targetInfluenceRef.current = Math.max(0, 1 - Math.sqrt(dx * dx + dy * dy) * 0.85);
      currentInfluenceRef.current += (targetInfluenceRef.current - currentInfluenceRef.current) * 0.1;
      material.uniforms.mouseInfluence.value = currentInfluenceRef.current;

      mesh.rotation.y += 0.003;
      mesh.rotation.x += 0.001;
      renderer.render(scene, camera);
      timeoutId = setTimeout(animate, 50);
    };
    animate();

    return () => {
      clearTimeout(timeoutId);
      window.removeEventListener("mousemove", handleMouseMove);
      if (el.contains(renderer.domElement)) el.removeChild(renderer.domElement);
      geometry.dispose();
      material.dispose();
      renderer.dispose();
    };
  }, []);

  return (
    <div ref={mountRef} className="pointer-events-none" style={{ width: W, height: W }} />
  );
}
