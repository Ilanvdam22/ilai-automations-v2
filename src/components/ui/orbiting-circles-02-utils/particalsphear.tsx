"use client";

import { useEffect, useRef } from "react";

/**
 * Roterende deeltjes-bol getekend op een 2D <canvas>.
 *
 * Bewust GEEN WebGL/Three.js: dat vereiste eerder een aparte
 * hardware-versnelling-instelling in Chrome om zichtbaar te worden.
 * Canvas 2D wordt door elke browser zonder extra instellingen
 * ondersteund, dus deze animatie is altijd zichtbaar.
 *
 * Performance: geen allocaties per frame (typed arrays worden hergebruikt),
 * en de animatie pauzeert volledig zodra de canvas buiten beeld is.
 */
const POINT_COUNT = 130;

export default function ParticleSphereAnimation() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    // Punten verdelen over een bol via een Fibonacci-spiraal, eenmalig berekend.
    const baseX = new Float32Array(POINT_COUNT);
    const baseY = new Float32Array(POINT_COUNT);
    const baseZ = new Float32Array(POINT_COUNT);
    const golden = Math.PI * (3 - Math.sqrt(5));
    for (let i = 0; i < POINT_COUNT; i++) {
      const y = 1 - (i / (POINT_COUNT - 1)) * 2;
      const radiusAtY = Math.sqrt(1 - y * y);
      const theta = golden * i;
      baseX[i] = Math.cos(theta) * radiusAtY;
      baseY[i] = y;
      baseZ[i] = Math.sin(theta) * radiusAtY;
    }

    // Herbruikte buffers voor geprojecteerde coördinaten (geen allocatie per frame).
    const projX = new Float32Array(POINT_COUNT);
    const projY = new Float32Array(POINT_COUNT);
    const projScale = new Float32Array(POINT_COUNT);
    const projDepth = new Float32Array(POINT_COUNT);
    const order = new Uint16Array(POINT_COUNT).map((_, i) => i);

    let width = 0;
    let height = 0;
    // DPR beperkt tot 1 houdt de canvas licht, ook op retina-schermen.
    const dpr = Math.min(window.devicePixelRatio || 1, 1);

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      width = rect.width;
      height = rect.height;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);

    let angle = 0;
    let frameId = 0;
    let running = false;

    const draw = () => {
      ctx.clearRect(0, 0, width, height);
      const cx = width / 2;
      const cy = height / 2;
      const radius = Math.min(width, height) / 2.3;

      const cosA = Math.cos(angle);
      const sinA = Math.sin(angle);
      const tilt = 0.35;
      const cosT = Math.cos(tilt);
      const sinT = Math.sin(tilt);

      for (let i = 0; i < POINT_COUNT; i++) {
        const x1 = baseX[i] * cosA - baseZ[i] * sinA;
        const z1 = baseX[i] * sinA + baseZ[i] * cosA;
        const y1 = baseY[i] * cosT - z1 * sinT;
        const z2 = baseY[i] * sinT + z1 * cosT;

        const perspective = 1.7 / (1.7 + z2);
        projX[i] = cx + x1 * radius * perspective;
        projY[i] = cy + y1 * radius * perspective;
        projScale[i] = perspective;
        projDepth[i] = z2;
      }

      // Achterste punten eerst tekenen (sort op de index-array, geen nieuwe allocatie).
      order.sort((a, b) => projDepth[a] - projDepth[b]);

      for (let k = 0; k < POINT_COUNT; k++) {
        const i = order[k];
        const dotSize = Math.max(0.6, 1.8 * projScale[i]);
        const opacity = 0.25 + 0.65 * ((projDepth[i] + 1) / 2);
        ctx.beginPath();
        ctx.arc(projX[i], projY[i], dotSize, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(0, 212, 255, ${opacity})`;
        ctx.fill();
      }
    };

    const loop = () => {
      angle += 0.0035;
      draw();
      frameId = requestAnimationFrame(loop);
    };

    const start = () => {
      if (running || prefersReducedMotion) {
        if (prefersReducedMotion) draw();
        return;
      }
      running = true;
      frameId = requestAnimationFrame(loop);
    };

    const stop = () => {
      running = false;
      cancelAnimationFrame(frameId);
    };

    // Pauzeer de animatie volledig zodra de canvas buiten het scherm scrollt.
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) start();
        else stop();
      },
      { rootMargin: "200px" }
    );
    io.observe(canvas);

    return () => {
      stop();
      ro.disconnect();
      io.disconnect();
    };
  }, []);

  return <canvas ref={canvasRef} className="h-full w-full" aria-hidden />;
}
