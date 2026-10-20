import * as THREE from "three";
import { RoomEnvironment } from "three/examples/jsm/environments/RoomEnvironment.js";
import { HOLD, ROOM, STOPS, ZONES, type Vec3 } from "./zones";

/**
 * De 3D-sportschool: één compacte zaal van eigen geometrie (geen modellen,
 * geen zware textures). Scrollen stuurt de camera langs de vijf zones,
 * slepen laat je even rondkijken. Er wordt alleen gerenderd als er iets
 * verandert, zodat de pagina rustig blijft als je niets doet.
 */
export type GymFrame = {
  /** Schermpositie (px, t.o.v. het canvas) per zone, in dezelfde volgorde als ZONES */
  hotspots: { x: number; y: number; visible: boolean }[];
  /** Voor de plattegrond: positie en kijkrichting van de camera */
  cam: { x: number; z: number; yaw: number };
};

export type GymOptions = {
  reducedMotion: boolean;
  onFrame: (frame: GymFrame) => void;
  onReady: () => void;
  /** Het apparaat haalt het niet: toon de 2D-versie */
  onSlow: () => void;
};

export type Gym = {
  /** Scrollpositie in stops: 0 = ingang, 1 t/m 5 = de zones, 6 = overzicht */
  setStop: (s: number) => void;
  setActive: (on: boolean) => void;
  dispose: () => void;
};

// Kleuren: warm daglicht, natuurlijke materialen, één blauw accent zoals de rest van de site
const C = {
  sky: 0xd9e2ea,
  grass: 0x7f9160,
  paving: 0xb9b4aa,
  concrete: 0xd4d1cb,
  ceiling: 0x2b2c2f,
  black: 0x1b1c1f,
  steel: 0x2a2c30,
  chrome: 0xc9ccd1,
  rubber: 0x18191b,
  pad: 0x232428,
  white: 0xf1efea,
  oak: 0xb88a5c,
  walnut: 0x6e4a2f,
  sofa: 0x8a8f86,
  leaf: 0x4f6b3a,
  leafDark: 0x3d5530,
  pot: 0xe7e2d8,
  accent: 0x93c5fd,
  light: 0xfff4e0,
};

const clamp = (v: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, v));
const easeInOut = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);

/** Vaste willekeur, zodat de zaal er elke keer hetzelfde uitziet */
function rng(seed: number) {
  let a = seed;
  return () => {
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function canvasTexture(w: number, h: number, draw: (g: CanvasRenderingContext2D) => void) {
  const c = document.createElement("canvas");
  c.width = w;
  c.height = h;
  draw(c.getContext("2d")!);
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  t.anisotropy = 8;
  return t;
}

function tiled(t: THREE.Texture, rx: number, ry: number) {
  t.wrapS = t.wrapT = THREE.RepeatWrapping;
  t.repeat.set(rx, ry);
  return t;
}

function roundRect(g: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number) {
  g.beginPath();
  g.moveTo(x + r, y);
  g.arcTo(x + w, y, x + w, y + h, r);
  g.arcTo(x + w, y + h, x, y + h, r);
  g.arcTo(x, y + h, x, y, r);
  g.arcTo(x, y, x + w, y, r);
  g.closePath();
}

const FONT = "Helvetica, Arial, sans-serif";

export function createGym(canvas: HTMLCanvasElement, opts: GymOptions): Gym {
  const { reducedMotion, onFrame, onReady, onSlow } = opts;
  const isSmall = Math.min(window.innerWidth, window.innerHeight) < 700;

  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, powerPreference: "high-performance" });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, isSmall ? 1.5 : 2));
  renderer.toneMapping = THREE.AgXToneMapping;
  renderer.toneMappingExposure = 1.15;
  renderer.setClearColor(C.sky, 1);
  // Schaduwen één keer berekenen: de zaal staat stil, dus dat is genoeg
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  renderer.shadowMap.autoUpdate = false;
  renderer.shadowMap.needsUpdate = true;

  const scene = new THREE.Scene();
  scene.background = new THREE.Color(C.sky);
  scene.fog = new THREE.Fog(C.sky, 28, 70);
  const camera = new THREE.PerspectiveCamera(isSmall ? 70 : 60, 1, 0.05, 120);

  // Zachte omgevingsreflecties (geen externe bestanden nodig)
  const pmrem = new THREE.PMREMGenerator(renderer);
  const envTex = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
  scene.environment = envTex;
  scene.environmentIntensity = 0.55;
  pmrem.dispose();

  // Licht: zon door de ramen (met schaduw) en een warme vulling
  scene.add(new THREE.HemisphereLight(0xf3efe6, 0x5a5650, 0.7));
  const sun = new THREE.DirectionalLight(0xfff1dc, 3.2);
  sun.position.set(9, 13, 10);
  sun.target.position.set(0, 0, -1);
  sun.castShadow = true;
  const sm = isSmall ? 1024 : 2048;
  sun.shadow.mapSize.set(sm, sm);
  Object.assign(sun.shadow.camera, { left: -12, right: 12, top: 12, bottom: -12, near: 1, far: 45 });
  sun.shadow.bias = -0.0004;
  sun.shadow.normalBias = 0.03;
  sun.shadow.radius = 4;
  scene.add(sun, sun.target);

  // Gedeelde geometrie en materialen
  const unitBox = new THREE.BoxGeometry(1, 1, 1);
  const unitCyl = new THREE.CylinderGeometry(1, 1, 1, 24);
  const unitSphere = new THREE.SphereGeometry(1, 24, 16);
  const mats = new Map<string, THREE.MeshStandardMaterial>();
  const std = (color: number, rough = 0.7, metal = 0) => {
    const key = `${color}-${rough}-${metal}`;
    let m = mats.get(key);
    if (!m) {
      m = new THREE.MeshStandardMaterial({ color, roughness: rough, metalness: metal });
      mats.set(key, m);
    }
    return m;
  };
  const mapped = (map: THREE.Texture, rough = 0.7, metal = 0) => new THREE.MeshStandardMaterial({ map, roughness: rough, metalness: metal });
  const glowMat = (color: number) => new THREE.MeshBasicMaterial({ color, toneMapped: false });
  const noCast = new Set<THREE.Object3D>();

  const box = (w: number, h: number, d: number, mat: number | THREE.Material, x: number, y: number, z: number, parent: THREE.Object3D = scene) => {
    const m = new THREE.Mesh(unitBox, typeof mat === "number" ? std(mat) : mat);
    m.scale.set(w, h, d);
    m.position.set(x, y, z);
    parent.add(m);
    return m;
  };
  const cyl = (r: number, h: number, mat: number | THREE.Material, x: number, y: number, z: number, parent: THREE.Object3D = scene) => {
    const m = new THREE.Mesh(unitCyl, typeof mat === "number" ? std(mat) : mat);
    m.scale.set(r, h, r);
    m.position.set(x, y, z);
    parent.add(m);
    return m;
  };
  const plane = (w: number, d: number, mat: THREE.Material, x: number, y: number, z: number) => {
    const m = new THREE.Mesh(new THREE.PlaneGeometry(w, d), mat);
    m.rotation.x = -Math.PI / 2;
    m.position.set(x, y, z);
    scene.add(m);
    return m;
  };

  // Zachte contactschaduw onder objecten (bovenop de zonschaduw, voor diepte)
  const shadowTex = canvasTexture(128, 128, (g) => {
    const grd = g.createRadialGradient(64, 64, 8, 64, 64, 64);
    grd.addColorStop(0, "rgba(0,0,0,0.45)");
    grd.addColorStop(1, "rgba(0,0,0,0)");
    g.fillStyle = grd;
    g.fillRect(0, 0, 128, 128);
  });
  const shadowMat = new THREE.MeshBasicMaterial({ map: shadowTex, transparent: true, depthWrite: false });
  const shadow = (w: number, d: number, x: number, z: number) => {
    const m = plane(w, d, shadowMat, x, 0.008, z);
    noCast.add(m);
  };

  // ---------------------------------------------------------------- textures (getekend, geen bestanden)
  const R = rng(7);
  const speckle = (g: CanvasRenderingContext2D, w: number, h: number, n: number, colors: string[], size = 1.5) => {
    for (let i = 0; i < n; i++) {
      g.fillStyle = colors[Math.floor(R() * colors.length)];
      g.fillRect(R() * w, R() * h, size, size);
    }
  };
  // Eikenhouten planken
  const oakTex = canvasTexture(512, 512, (g) => {
    const rows = 8;
    const ph = 512 / rows;
    for (let r = 0; r < rows; r++) {
      let x = -R() * 300;
      while (x < 512) {
        const len = 220 + R() * 200;
        const l = 52 + R() * 10;
        g.fillStyle = `hsl(30, 38%, ${l}%)`;
        g.fillRect(x, r * ph, len, ph);
        // Nerf
        for (let k = 0; k < 7; k++) {
          g.strokeStyle = `hsla(28, 40%, ${l - 12}%, ${0.15 + R() * 0.2})`;
          g.lineWidth = 1 + R() * 1.5;
          g.beginPath();
          const yy = r * ph + 4 + R() * (ph - 8);
          g.moveTo(x, yy);
          g.bezierCurveTo(x + len * 0.3, yy + (R() - 0.5) * 8, x + len * 0.7, yy + (R() - 0.5) * 8, x + len, yy);
          g.stroke();
        }
        g.fillStyle = "rgba(60,35,15,0.55)";
        g.fillRect(x, r * ph, 2, ph);
        x += len;
      }
      g.fillStyle = "rgba(60,35,15,0.45)";
      g.fillRect(0, r * ph, 512, 2);
    }
  });
  // Licht gepolijst beton
  const concreteTex = canvasTexture(512, 512, (g) => {
    g.fillStyle = "#cfccc6";
    g.fillRect(0, 0, 512, 512);
    for (let i = 0; i < 40; i++) {
      const grd = g.createRadialGradient(R() * 512, R() * 512, 0, R() * 512, R() * 512, 60 + R() * 120);
      grd.addColorStop(0, `rgba(${R() > 0.5 ? "255,255,255" : "120,115,105"},0.08)`);
      grd.addColorStop(1, "rgba(0,0,0,0)");
      g.fillStyle = grd;
      g.fillRect(0, 0, 512, 512);
    }
    speckle(g, 512, 512, 5000, ["rgba(90,85,80,0.25)", "rgba(255,255,255,0.35)"]);
  });
  // Rubber sportvloer met tegels
  const rubberTex = canvasTexture(256, 256, (g) => {
    g.fillStyle = "#1d1e20";
    g.fillRect(0, 0, 256, 256);
    speckle(g, 256, 256, 2600, ["#2f3236", "#3a3e44", "#4a5a74", "#262728"], 1.6);
    g.strokeStyle = "rgba(0,0,0,0.7)";
    g.lineWidth = 3;
    g.strokeRect(0, 0, 256, 256);
  });
  // Houten lamellen (balie en wand)
  const slatTex = canvasTexture(256, 256, (g) => {
    for (let i = 0; i < 8; i++) {
      const l = 40 + R() * 8;
      g.fillStyle = `hsl(28, 40%, ${l}%)`;
      g.fillRect(i * 32, 0, 24, 256);
      g.fillStyle = "#1a1410";
      g.fillRect(i * 32 + 24, 0, 8, 256);
      for (let k = 0; k < 5; k++) {
        g.fillStyle = `hsla(28, 40%, ${l - 10}%, 0.25)`;
        g.fillRect(i * 32 + R() * 22, 0, 1.2, 256);
      }
    }
  });
  // Stof van de bank
  const fabricTex = canvasTexture(128, 128, (g) => {
    g.fillStyle = "#8a8f86";
    g.fillRect(0, 0, 128, 128);
    speckle(g, 128, 128, 1800, ["rgba(0,0,0,0.12)", "rgba(255,255,255,0.12)"], 1);
  });

  // ---------------------------------------------------------------- buiten
  const W = ROOM.maxX - ROOM.minX;
  const D = ROOM.maxZ - ROOM.minZ;
  plane(160, 160, std(C.grass, 0.95), 0, -0.03, 0);
  plane(W + 6, D + 6, std(C.paving, 0.92), 0, -0.015, 0.8);
  // Bomen rondom (laag-poly, zoals een maquette)
  const treeSpots: [number, number, number][] = [
    [-12, 9, 1.1], [-6, 11, 0.9], [5, 10.5, 1.2], [12, 8, 1], [14, -2, 1.3], [12, -10, 1.1], [-13, -6, 1.2], [-3, -11, 1], [6, -12, 0.9], [-14, 3, 1],
  ];
  const trunkMesh = new THREE.InstancedMesh(unitCyl, std(0x5b4636, 0.9), treeSpots.length);
  const crownGeo = new THREE.IcosahedronGeometry(1, 1);
  const crownMesh = new THREE.InstancedMesh(crownGeo, std(C.leaf, 0.85), treeSpots.length * 2);
  const tmp = new THREE.Object3D();
  treeSpots.forEach(([x, z, s], i) => {
    tmp.rotation.set(0, 0, 0);
    tmp.position.set(x, 1.1 * s, z);
    tmp.scale.set(0.14 * s, 2.2 * s, 0.14 * s);
    tmp.updateMatrix();
    trunkMesh.setMatrixAt(i, tmp.matrix);
    tmp.position.set(x, 2.9 * s, z);
    tmp.scale.setScalar(1.3 * s);
    tmp.rotation.set(R(), R(), R());
    tmp.updateMatrix();
    crownMesh.setMatrixAt(i * 2, tmp.matrix);
    tmp.position.set(x + 0.4 * s, 3.7 * s, z - 0.2 * s);
    tmp.scale.setScalar(0.9 * s);
    tmp.updateMatrix();
    crownMesh.setMatrixAt(i * 2 + 1, tmp.matrix);
  });
  scene.add(trunkMesh, crownMesh);

  // ---------------------------------------------------------------- de zaal
  // Vloeren: beton als basis, hout bij de receptie en het kantoor, rubber op de trainingsvloer
  plane(W, D, mapped(tiled(concreteTex, 3, 2.25), 0.55), 0, 0, 0);
  plane(6.2, 4.6, mapped(tiled(oakTex.clone(), 2.2, 1.6), 0.45), -4.9, 0.004, 3.7);
  plane(3.6, 3.4, mapped(tiled(oakTex, 1.3, 1.2), 0.45), -6.2, 0.004, -4.3);
  plane(9.4, 6.2, mapped(tiled(rubberTex, 9.4, 6.2), 0.9), 1.8, 0.004, -2.9);

  // Plafond met zichtbare installaties (verborgen in het bovenaanzicht)
  const ceilingGroup = new THREE.Group();
  scene.add(ceilingGroup);
  const ceiling = new THREE.Mesh(new THREE.PlaneGeometry(W, D), std(C.ceiling, 0.95));
  ceiling.rotation.x = Math.PI / 2;
  ceiling.position.y = ROOM.height;
  ceilingGroup.add(ceiling);
  for (const z of [-3.2, 1.6]) {
    const duct = cyl(0.22, W - 0.4, std(0xa7abb1, 0.35, 0.8), 0, ROOM.height - 0.35, z, ceilingGroup);
    duct.rotation.z = Math.PI / 2;
  }
  // Lijnlampen boven de trainingsvloer, aan dunne kabels
  const lightMat = glowMat(C.light);
  for (const x of [-0.6, 1.8, 4.2]) {
    for (const z of [-4.2, -1.8]) {
      box(1.8, 0.05, 0.12, std(C.black, 0.5), x, 3.2, z, ceilingGroup);
      box(1.74, 0.012, 0.08, lightMat, x, 3.17, z, ceilingGroup);
      for (const dx of [-0.8, 0.8]) box(0.006, 0.8, 0.006, C.black, x + dx, 3.6, z, ceilingGroup);
    }
  }

  // Wanden
  const concreteWall = mapped(tiled(concreteTex.clone(), 4, 1), 0.85);
  box(W, ROOM.height, 0.2, concreteWall, 0, ROOM.height / 2, ROOM.minZ - 0.1); // achter
  box(0.2, ROOM.height, D, concreteWall, ROOM.minX - 0.1, ROOM.height / 2, 0); // links
  // Lamellenwand achter de receptie
  box(0.06, 2.9, 4.4, mapped(tiled(slatTex.clone(), 4, 1), 0.6), ROOM.minX + 0.03, 1.45, 3.7);
  // Rechts: grote ramen met daglicht
  const glass = new THREE.MeshStandardMaterial({ color: 0xcfe0ea, transparent: true, opacity: 0.12, roughness: 0.05, metalness: 0.1, depthWrite: false });
  const rx = ROOM.maxX + 0.1;
  box(0.2, 0.9, D, concreteWall, rx, 0.45, 0);
  box(0.2, 1.1, D, concreteWall, rx, 3.45, 0);
  for (const z of [-6, -2.8, 0.4, 3.2, 6]) box(0.2, 2.0, z === -6 || z === 6 ? 0.4 : 0.6, concreteWall, rx, 1.9, z);
  noCast.add(box(0.04, 2.0, D, glass, rx, 1.9, 0));
  for (const z of [-4.4, -1.2, 1.8, 4.6]) box(0.08, 0.06, 2.6, C.black, rx - 0.08, 0.92, z); // vensterbank
  // Voorgevel: glas met zwarte stijlen en een deur
  noCast.add(box(W, ROOM.height, 0.04, glass, 0, ROOM.height / 2, ROOM.maxZ + 0.05));
  for (const x of [-8, -5.3, -2.6, -1, 1, 2.6, 5.3, 8]) box(0.07, ROOM.height, 0.1, C.black, x, ROOM.height / 2, ROOM.maxZ + 0.05);
  box(W, 0.08, 0.1, C.black, 0, 2.6, ROOM.maxZ + 0.05);
  box(W, 0.1, 0.1, C.black, 0, 0.05, ROOM.maxZ + 0.05);
  box(W, 0.12, 0.12, C.black, 0, ROOM.height - 0.06, ROOM.maxZ + 0.05);
  // Deurgrepen
  for (const x of [-0.12, 0.12]) box(0.025, 0.9, 0.04, std(C.chrome, 0.25, 1), x, 1.1, ROOM.maxZ + 0.1);
  // Plafondrand rondom, zodat het bovenaanzicht een nette maquette is
  box(W + 0.4, 0.06, 0.4, C.white, 0, ROOM.height + 0.03, ROOM.minZ - 0.1);
  box(0.4, 0.06, D + 0.4, C.white, ROOM.minX - 0.1, ROOM.height + 0.03, 0);
  box(0.4, 0.06, D + 0.4, C.white, ROOM.maxX + 0.1, ROOM.height + 0.03, 0);

  // Achterwand: donker vlak met een tekst en een spiegelwand
  box(4.2, ROOM.height, 0.04, std(0x232427, 0.9), -5.6, ROOM.height / 2, ROOM.minZ + 0.02);
  const wallText = canvasTexture(1024, 256, (g) => {
    g.font = `800 130px ${FONT}`;
    g.textBaseline = "middle";
    const move = "MOVE ";
    const total = g.measureText(move + "BETTER").width;
    const x0 = (1024 - total) / 2;
    g.fillStyle = "#e9e6df";
    g.fillText(move, x0, 128);
    g.fillStyle = "#93c5fd";
    g.fillText("BETTER", x0 + g.measureText(move).width, 128);
  });
  const wt = new THREE.Mesh(new THREE.PlaneGeometry(3.4, 0.85), new THREE.MeshStandardMaterial({ map: wallText, transparent: true, roughness: 0.8 }));
  wt.position.set(-5.6, 3.05, ROOM.minZ + 0.05);
  scene.add(wt);
  noCast.add(wt);
  const mirror = new THREE.MeshStandardMaterial({ color: 0xdfe6ec, roughness: 0.03, metalness: 1 });
  box(5.8, 2.1, 0.03, mirror, 1.7, 1.3, ROOM.minZ + 0.03);
  box(5.9, 0.05, 0.05, C.black, 1.7, 2.37, ROOM.minZ + 0.04);
  box(5.9, 0.05, 0.05, C.black, 1.7, 0.23, ROOM.minZ + 0.04);
  // Blauwe accentlijn, zoals op de site
  const accent = glowMat(C.accent);
  box(5.8, 0.02, 0.02, accent, 1.7, 2.62, ROOM.minZ + 0.02);

  // Planten
  const plant = (x: number, z: number, s = 1) => {
    cyl(0.22 * s, 0.5 * s, std(C.pot, 0.6), x, 0.25 * s, z);
    cyl(0.2 * s, 0.02, std(0x3b2b20, 1), x, 0.5 * s, z);
    for (let i = 0; i < 6; i++) {
      const leaf = new THREE.Mesh(crownGeo, std(i % 2 ? C.leaf : C.leafDark, 0.8));
      const a = (i / 6) * Math.PI * 2;
      leaf.position.set(x + Math.cos(a) * 0.18 * s, (0.75 + (i % 3) * 0.22) * s, z + Math.sin(a) * 0.18 * s);
      leaf.scale.set(0.22 * s, 0.32 * s, 0.22 * s);
      leaf.rotation.set(R(), R(), R());
      scene.add(leaf);
    }
    shadow(0.9 * s, 0.9 * s, x, z);
  };

  // ---------------------------------------------------------------- receptie (zone 1 en 2)
  const slat = mapped(tiled(slatTex, 3, 1), 0.6);
  const quartz = std(0xeeece6, 0.25);
  box(3.0, 1.06, 0.6, slat, -4.4, 0.53, 3.0);
  box(0.6, 1.06, 1.8, slat, -6.2, 0.53, 3.6);
  box(3.25, 0.06, 0.8, quartz, -4.4, 1.09, 3.02);
  box(0.8, 0.06, 1.95, quartz, -6.2, 1.09, 3.6);
  box(2.95, 0.02, 0.02, accent, -4.4, 0.06, 3.31);
  shadow(4.2, 2.2, -4.9, 3.2);
  // Hanglampen boven de balie
  for (const x of [-5.4, -4.4, -3.4]) {
    box(0.006, 1.2, 0.006, C.black, x, 3.4, 3.0);
    const shade = cyl(0.16, 0.22, std(C.black, 0.4, 0.4), x, 2.72, 3.0);
    shade.scale.set(0.16, 0.22, 0.16);
    const bulb = new THREE.Mesh(unitSphere, glowMat(C.light));
    bulb.scale.setScalar(0.06);
    bulb.position.set(x, 2.6, 3.0);
    scene.add(bulb);
    noCast.add(bulb);
  }
  // Laptop op de balie
  box(0.34, 0.015, 0.24, std(0xb9bcc2, 0.3, 0.8), -3.5, 1.13, 2.95);
  const lid = box(0.34, 0.22, 0.012, std(0xb9bcc2, 0.3, 0.8), -3.5, 1.24, 3.07);
  lid.rotation.x = -0.25;
  // Krukken voor de balie
  for (const x of [-3.2, -5.4]) {
    cyl(0.2, 0.05, std(C.walnut, 0.6), x, 0.72, 2.3);
    cyl(0.025, 0.7, std(C.black, 0.4, 0.6), x, 0.36, 2.3);
    cyl(0.18, 0.02, std(C.black, 0.4, 0.6), x, 0.01, 2.3);
  }
  // Bord "Welkom" op de lamellenwand (verlicht)
  const signTex = canvasTexture(512, 128, (g) => {
    g.fillStyle = "#93c5fd";
    g.font = `700 76px ${FONT}`;
    g.textAlign = "center";
    g.textBaseline = "middle";
    g.fillText("WELKOM", 256, 68);
  });
  const sign = new THREE.Mesh(new THREE.PlaneGeometry(1.8, 0.45), new THREE.MeshBasicMaterial({ map: signTex, transparent: true, toneMapped: false }));
  sign.rotation.y = Math.PI / 2;
  sign.position.set(ROOM.minX + 0.08, 2.1, 3.6);
  scene.add(sign);
  noCast.add(sign);
  plant(-7.4, 5.4, 1.2);
  plant(-2.4, 2.4, 0.9);

  // Telefoon op de balie met een chat op het scherm
  const phoneTex = canvasTexture(256, 512, (g) => {
    g.fillStyle = "#0b0d12";
    g.fillRect(0, 0, 256, 512);
    g.fillStyle = "#151922";
    g.fillRect(0, 0, 256, 64);
    g.fillStyle = "#ffffff";
    g.font = `600 22px ${FONT}`;
    g.fillText("Sportschool", 20, 40);
    const bubble = (y: number, text: string[], mine: boolean) => {
      const w = 190;
      const h = 22 + text.length * 26;
      const x = mine ? 256 - w - 14 : 14;
      g.fillStyle = mine ? "#93c5fd" : "#232836";
      roundRect(g, x, y, w, h, 14);
      g.fill();
      g.fillStyle = mine ? "#05060a" : "#ffffff";
      g.font = `500 19px ${FONT}`;
      text.forEach((t, i) => g.fillText(t, x + 14, y + 32 + i * 26));
    };
    bubble(90, ["Hoi! Kan ik een", "proefles doen?"], false);
    bubble(180, ["Zeker! Dinsdag 18:00", "of donderdag 19:30?"], true);
    bubble(285, ["Donderdag graag"], false);
    bubble(350, ["Staat erin. Je krijgt", "een herinnering."], true);
  });
  const phone = new THREE.Group();
  phone.position.set(-5.25, 1.25, 3.1);
  phone.rotation.x = -0.28;
  scene.add(phone);
  box(0.1, 0.2, 0.012, 0x0a0b0e, 0, 0, 0, phone);
  const phoneScreen = new THREE.Mesh(new THREE.PlaneGeometry(0.09, 0.18), new THREE.MeshBasicMaterial({ map: phoneTex, toneMapped: false }));
  phoneScreen.position.z = 0.007;
  phone.add(phoneScreen);
  box(0.06, 0.08, 0.05, C.black, -5.25, 1.15, 3.06);

  // Zithoek bij de ingang
  const fabric = mapped(tiled(fabricTex, 2, 1), 0.95);
  box(2.2, 0.42, 0.9, fabric, 2.9, 0.3, 5.35);
  box(2.2, 0.5, 0.2, fabric, 2.9, 0.7, 5.75);
  for (const s of [-1, 1]) box(0.2, 0.62, 0.9, fabric, 2.9 + s * 1.1, 0.4, 5.35);
  for (const x of [2.4, 3.4]) box(0.4, 0.12, 0.3, std(0xa9ada3, 0.95), x, 0.57, 5.3);
  box(1.0, 0.04, 0.55, std(C.walnut, 0.4), 2.9, 0.42, 4.4);
  for (const [dx, dz] of [[-0.45, -0.22], [0.45, -0.22], [-0.45, 0.22], [0.45, 0.22]]) box(0.03, 0.4, 0.03, C.black, 2.9 + dx, 0.2, 4.4 + dz);
  plane(2.8, 1.9, std(0xcfc6b5, 1), 2.9, 0.006, 4.8);
  shadow(2.8, 1.6, 2.9, 5.2);
  plant(6.9, 5.4, 1.4);

  // ---------------------------------------------------------------- kantoorhoek (zone 3)
  const office = new THREE.Group();
  office.position.set(-6.3, 0, -4.4);
  scene.add(office);
  box(1.7, 0.04, 0.8, std(C.oak, 0.45), 0, 0.75, 0, office);
  for (const x of [-0.8, 0.8]) {
    box(0.04, 0.73, 0.7, std(C.black, 0.4, 0.5), x, 0.365, 0, office);
  }
  box(0.06, 0.3, 0.06, C.black, 0, 0.92, -0.22, office);
  box(0.95, 0.56, 0.04, 0x0a0b0e, 0, 1.25, -0.24, office);
  const crmTex = canvasTexture(512, 300, (g) => {
    g.fillStyle = "#0b0d12";
    g.fillRect(0, 0, 512, 300);
    g.fillStyle = "#ffffff";
    g.font = `600 20px ${FONT}`;
    g.fillText("Klanten per fase", 20, 34);
    const cols = ["Nieuw", "Proefles", "Lid"];
    cols.forEach((c, i) => {
      const x = 20 + i * 162;
      g.fillStyle = "#151922";
      g.fillRect(x, 52, 150, 230);
      g.fillStyle = "#93c5fd";
      g.font = `600 16px ${FONT}`;
      g.fillText(c, x + 12, 76);
      for (let k = 0; k < 3 - (i === 1 ? 1 : 0); k++) {
        g.fillStyle = i === 1 && k === 0 ? "#93c5fd" : "#232836";
        g.fillRect(x + 10, 92 + k * 52, 130, 40);
      }
    });
  });
  const monitor = new THREE.Mesh(new THREE.PlaneGeometry(0.88, 0.5), new THREE.MeshBasicMaterial({ map: crmTex, toneMapped: false }));
  monitor.position.set(0, 1.25, -0.215);
  office.add(monitor);
  box(0.45, 0.015, 0.15, std(0x2d2f33, 0.6), 0, 0.775, 0.1, office);
  box(0.07, 0.01, 0.1, std(0x2d2f33, 0.6), 0.36, 0.775, 0.1, office);
  // Koffiemok en notitieblok
  cyl(0.04, 0.09, std(C.white, 0.4), -0.6, 0.815, 0.12, office);
  box(0.2, 0.01, 0.28, std(0xf6f3ea, 0.9), 0.55, 0.775, 0.05, office);
  // Bureaustoel
  box(0.5, 0.08, 0.5, std(C.pad, 0.8), 0, 0.5, 0.75, office);
  box(0.5, 0.62, 0.06, std(C.pad, 0.8), 0, 0.86, 1.0, office);
  cyl(0.03, 0.42, std(C.chrome, 0.3, 1), 0, 0.24, 0.75, office);
  cyl(0.3, 0.03, std(C.black, 0.5), 0, 0.03, 0.75, office);
  shadow(2.4, 2.0, -6.3, -4.1);
  // Wandkast met ordners
  box(0.36, 1.9, 1.6, std(C.white, 0.6), ROOM.minX + 0.2, 0.95, -4.2);
  for (const y of [0.55, 1.15, 1.75]) box(0.34, 0.03, 1.5, std(0xe2dfd8, 0.6), ROOM.minX + 0.22, y - 0.25, -4.2);
  const binders = new THREE.InstancedMesh(unitBox, std(0xffffff, 0.7), 18);
  const binderColors = [0x2f3a4a, 0x93c5fd, 0xe9e6df, 0x3f4b3a];
  for (let i = 0; i < 18; i++) {
    const shelf = Math.floor(i / 6);
    tmp.rotation.set(0, 0, 0);
    tmp.position.set(ROOM.minX + 0.24, 0.45 + shelf * 0.6, -4.8 + (i % 6) * 0.2 + shelf * 0.05);
    tmp.scale.set(0.26, 0.32, 0.07);
    tmp.updateMatrix();
    binders.setMatrixAt(i, tmp.matrix);
    binders.setColorAt(i, new THREE.Color(binderColors[(i * 7) % 4]));
  }
  scene.add(binders);
  plant(-4.9, -5.5, 0.9);
  // Glazen wand met zwarte stalen kozijnen
  noCast.add(box(3.4, 2.4, 0.03, glass, -6.3, 1.2, -2.6));
  box(3.4, 0.05, 0.06, C.black, -6.3, 2.42, -2.6);
  box(3.4, 0.05, 0.06, C.black, -6.3, 0.02, -2.6);
  for (const x of [-7.95, -6.85, -5.75, -4.6]) box(0.05, 2.4, 0.06, C.black, x, 1.2, -2.6);

  // ---------------------------------------------------------------- tablet bij de ingang (zone 4)
  const kiosk = new THREE.Group();
  kiosk.position.set(4.8, 0, 4.0);
  scene.add(kiosk);
  cyl(0.25, 0.03, std(C.black, 0.4, 0.4), 0, 0.015, 0, kiosk);
  cyl(0.03, 1.2, std(C.chrome, 0.25, 1), 0, 0.62, 0, kiosk);
  const tablet = new THREE.Group();
  tablet.position.y = 1.3;
  tablet.rotation.set(-0.5, -0.65, 0, "YXZ");
  kiosk.add(tablet);
  box(0.44, 0.31, 0.02, 0x0a0b0e, 0, 0, 0, tablet);
  const inboxTex = canvasTexture(512, 360, (g) => {
    g.fillStyle = "#0b0d12";
    g.fillRect(0, 0, 512, 360);
    g.fillStyle = "#ffffff";
    g.font = `600 22px ${FONT}`;
    g.fillText("Inbox", 22, 40);
    const rows: [string, string][] = [
      ["Aanvraag proefles", "Antwoord klaar"],
      ["Vraag over lidmaatschap", "Antwoord klaar"],
      ["Hoe vond je de les?", "Verstuurd"],
      ["Factuur leverancier", "Gesorteerd"],
    ];
    rows.forEach(([a, b], i) => {
      const y = 64 + i * 70;
      g.fillStyle = "#151922";
      g.fillRect(16, y, 480, 58);
      g.fillStyle = "#ffffff";
      g.font = `500 19px ${FONT}`;
      g.fillText(a, 32, y + 36);
      g.fillStyle = "#93c5fd";
      g.font = `600 16px ${FONT}`;
      g.textAlign = "right";
      g.fillText(b, 480, y + 36);
      g.textAlign = "left";
    });
  });
  const tabletScreen = new THREE.Mesh(new THREE.PlaneGeometry(0.41, 0.28), new THREE.MeshBasicMaterial({ map: inboxTex, toneMapped: false }));
  tabletScreen.position.z = 0.011;
  tablet.add(tabletScreen);
  shadow(0.9, 0.9, 4.8, 4.0);
  // Lockers met houten fronten langs de rechterwand
  const lockerWood = std(C.oak, 0.55);
  const lockers = new THREE.InstancedMesh(unitBox, lockerWood, 14);
  const knobs = new THREE.InstancedMesh(unitBox, std(C.black, 0.4, 0.6), 14);
  for (let i = 0; i < 14; i++) {
    const col = Math.floor(i / 2);
    const row = i % 2;
    tmp.rotation.set(0, 0, 0);
    tmp.position.set(ROOM.maxX - 0.48, 0.5 + row * 0.95, -0.9 + col * 0.46);
    tmp.scale.set(0.5, 0.92, 0.44);
    tmp.updateMatrix();
    lockers.setMatrixAt(i, tmp.matrix);
    tmp.position.set(ROOM.maxX - 0.73, 0.75 + row * 0.95, -0.9 + col * 0.46 + 0.14);
    tmp.scale.set(0.02, 0.12, 0.02);
    tmp.updateMatrix();
    knobs.setMatrixAt(i, tmp.matrix);
  }
  scene.add(lockers, knobs);
  box(0.5, 0.06, 3.3, std(C.black, 0.6), ROOM.maxX - 0.48, 1.97, 0.48);
  // Bankje voor de lockers
  box(0.4, 0.05, 2.4, std(C.oak, 0.5), ROOM.maxX - 1.2, 0.45, 0.5);
  for (const z of [-0.5, 1.5]) box(0.36, 0.43, 0.04, C.black, ROOM.maxX - 1.2, 0.215, z);
  shadow(1.6, 4.0, ROOM.maxX - 0.8, 0.5);

  // ---------------------------------------------------------------- trainingsvloer (zone 5)
  const steel = std(C.steel, 0.45, 0.6);
  const chrome = std(C.chrome, 0.2, 1);
  const padMat = std(C.pad, 0.75);
  const plates: { m: THREE.Matrix4; color: number }[] = [];
  const bumper = [0x1a1b1d, 0x1a1b1d, 0x7a2e2b, 0x2e4a72];
  const addPlate = (x: number, y: number, z: number, r: number, t: number, color: number, axis: "x" | "z" = "x") => {
    tmp.position.set(x, y, z);
    tmp.rotation.set(axis === "x" ? 0 : Math.PI / 2, 0, axis === "x" ? Math.PI / 2 : 0);
    tmp.scale.set(r, t, r);
    tmp.updateMatrix();
    plates.push({ m: tmp.matrix.clone(), color });
  };
  // Twee power racks met een halterstang
  [0.5, 3.0].forEach((cx, ci) => {
    const cz = -4.6;
    for (const [dx, dz] of [[-0.6, -0.45], [0.6, -0.45], [-0.6, 0.45], [0.6, 0.45]]) box(0.08, 2.3, 0.08, steel, cx + dx, 1.15, cz + dz);
    for (const dz of [-0.45, 0.45]) box(1.28, 0.08, 0.08, steel, cx, 2.28, cz + dz);
    for (const dx of [-0.6, 0.6]) box(0.08, 0.08, 0.98, steel, cx + dx, 2.28, cz);
    // Haken en veiligheidsarmen
    for (const dx of [-0.6, 0.6]) {
      box(0.05, 0.05, 0.16, steel, cx + dx, 1.38, cz + 0.55);
      box(0.05, 0.05, 0.9, steel, cx + dx, 0.75, cz + 0.1);
    }
    const bar = cyl(0.016, 2.2, chrome, cx, 1.43, cz + 0.55);
    bar.rotation.z = Math.PI / 2;
    const plateCol = bumper[ci === 0 ? 2 : 3];
    for (const side of [-1, 1]) {
      addPlate(cx + side * 0.86, 1.43, cz + 0.55, 0.225, 0.05, plateCol);
      addPlate(cx + side * 0.92, 1.43, cz + 0.55, 0.225, 0.05, bumper[0]);
      cyl(0.03, 0.06, chrome, cx + side * 0.98, 1.43, cz + 0.55).rotation.z = Math.PI / 2;
    }
    shadow(1.9, 1.6, cx, cz);
    // Bankje voor het rack
    box(0.3, 0.08, 1.2, padMat, cx, 0.45, -3.2);
    box(0.06, 0.38, 0.06, steel, cx, 0.2, -3.65);
    box(0.06, 0.38, 0.06, steel, cx, 0.2, -2.75);
    box(0.5, 0.04, 0.08, steel, cx, 0.02, -3.65);
    box(0.5, 0.04, 0.08, steel, cx, 0.02, -2.75);
    shadow(0.9, 1.6, cx, -3.2);
  });
  // Schijvenboom
  box(0.5, 0.04, 0.5, steel, 4.4, 0.02, -5.5);
  box(0.06, 1.2, 0.06, steel, 4.4, 0.6, -5.5);
  [0.35, 0.7, 1.05].forEach((y, i) => {
    cyl(0.02, 0.4, chrome, 4.4, y, -5.3).rotation.x = Math.PI / 2;
    for (let k = 0; k < 3 - i; k++) addPlate(4.4, y, -5.18 - k * 0.05, 0.22 - i * 0.03, 0.04, bumper[(k + i) % 4], "z");
  });
  shadow(0.8, 0.8, 4.4, -5.4);

  // Dumbbellrek met twee lagen
  const rackX = 5.6;
  box(0.6, 0.05, 3.2, steel, rackX, 0.55, -2.6);
  box(0.6, 0.05, 3.2, steel, rackX, 0.95, -2.6);
  for (const z of [-4.15, -1.05]) box(0.6, 0.95, 0.08, steel, rackX, 0.475, z);
  const handles = new THREE.InstancedMesh(unitCyl, chrome, 12);
  const heads = new THREE.InstancedMesh(new THREE.CylinderGeometry(1, 1, 1, 6), std(C.rubber, 0.7), 24);
  for (let i = 0; i < 12; i++) {
    const tier = i < 6 ? 0.64 : 1.04;
    const z = -3.9 + (i % 6) * 0.52;
    tmp.rotation.set(0, 0, Math.PI / 2);
    tmp.position.set(rackX, tier, z);
    tmp.scale.set(0.018, 0.32, 0.018);
    tmp.updateMatrix();
    handles.setMatrixAt(i, tmp.matrix);
    for (const s of [-1, 1]) {
      const r = 0.05 + (i % 6) * 0.007;
      tmp.position.set(rackX + s * 0.17, tier, z);
      tmp.scale.set(r, 0.09, r);
      tmp.updateMatrix();
      heads.setMatrixAt(i * 2 + (s > 0 ? 1 : 0), tmp.matrix);
    }
  }
  scene.add(handles, heads);
  shadow(1.2, 3.8, rackX, -2.6);

  // Loopbanden langs de achterwand
  for (const x of [-3.4, -2.2, -1.0]) {
    box(0.82, 0.2, 1.9, std(C.black, 0.5), x, 0.1, -4.9);
    box(0.6, 0.012, 1.7, std(0x111214, 0.95), x, 0.205, -4.85);
    for (const s of [-1, 1]) {
      const post = box(0.06, 1.2, 0.08, std(0x3a3d42, 0.4, 0.6), x + s * 0.36, 0.7, -5.65);
      post.rotation.x = -0.12;
      box(0.05, 0.05, 0.5, std(0x3a3d42, 0.4, 0.6), x + s * 0.36, 1.12, -5.45);
    }
    const consoleGroup = new THREE.Group();
    consoleGroup.position.set(x, 1.32, -5.62);
    consoleGroup.rotation.x = 0.55;
    scene.add(consoleGroup);
    box(0.78, 0.32, 0.06, std(C.black, 0.4), 0, 0, 0, consoleGroup);
    box(0.36, 0.16, 0.01, accent, 0, 0.03, 0.035, consoleGroup);
    shadow(1.1, 2.3, x, -4.9);
  }
  // Roeier
  box(0.12, 0.08, 2.2, std(0x3a3d42, 0.4, 0.6), -2.1, 0.32, -1.6);
  box(0.36, 0.06, 0.3, padMat, -2.1, 0.4, -1.3);
  const fly = cyl(0.26, 0.2, std(C.black, 0.5), -2.1, 0.38, -2.75);
  fly.rotation.z = Math.PI / 2;
  for (const z of [-2.65, -0.6]) box(0.4, 0.3, 0.06, std(C.black, 0.5), -2.1, 0.15, z);
  shadow(0.8, 2.6, -2.1, -1.7);

  // Kettlebells en medicijnballen
  const bells = new THREE.InstancedMesh(unitSphere, std(C.rubber, 0.55, 0.3), 6);
  const bellHandles = new THREE.InstancedMesh(new THREE.TorusGeometry(1, 0.22, 10, 24), std(C.rubber, 0.55, 0.3), 6);
  for (let i = 0; i < 6; i++) {
    const r = 0.09 + i * 0.01;
    tmp.rotation.set(0, 0, 0);
    tmp.position.set(1.0 + i * 0.5, r, -0.8);
    tmp.scale.setScalar(r);
    tmp.updateMatrix();
    bells.setMatrixAt(i, tmp.matrix);
    tmp.position.set(1.0 + i * 0.5, r * 2.05, -0.8);
    tmp.scale.setScalar(r * 0.6);
    tmp.updateMatrix();
    bellHandles.setMatrixAt(i, tmp.matrix);
  }
  scene.add(bells, bellHandles);
  shadow(3.4, 0.7, 2.25, -0.8);
  [-0.4, -0.05, 0.3].forEach((x, i) => {
    const ball = new THREE.Mesh(unitSphere, std(i === 1 ? 0x2e4a72 : 0x2a2b2e, 0.85));
    ball.scale.setScalar(0.17);
    ball.position.set(x, 0.17, -0.5);
    scene.add(ball);
  });
  // Houten plyo boxes
  const plyo = std(0xc9a273, 0.7);
  box(0.75, 0.6, 0.6, plyo, 5.0, 0.3, 0.0);
  box(0.6, 0.45, 0.5, plyo, 5.0, 0.825, 0.0);
  box(0.6, 0.5, 0.5, plyo, 4.1, 0.25, -0.2).rotation.y = 0.3;
  shadow(1.6, 1.0, 4.6, -0.1);

  const plateMesh = new THREE.InstancedMesh(unitCyl, std(0xffffff, 0.75), plates.length);
  plates.forEach((p, i) => {
    plateMesh.setMatrixAt(i, p.m);
    plateMesh.setColorAt(i, new THREE.Color(p.color));
  });
  scene.add(plateMesh);

  // Schaduwen: alles werpt en ontvangt, behalve glas, licht en de contactschaduwen
  ceiling.castShadow = false;
  scene.traverse((o) => {
    const m = o as THREE.Mesh;
    if (!m.isMesh) return;
    const basic = (m.material as THREE.Material).type === "MeshBasicMaterial";
    m.castShadow = !noCast.has(m) && !basic && !ceilingGroup.children.includes(m);
    m.receiveShadow = !basic;
  });
  ceiling.receiveShadow = false;

  // ---------------------------------------------------------------- camera en besturing
  // Of er opnieuw getekend moet worden (alleen renderen als er iets verandert)
  let dirty = true;
  const v3 = (a: Vec3) => new THREE.Vector3(a[0], a[1], a[2]);
  const stopPos = STOPS.map((v) => v3(v.pos));
  const stopLook = STOPS.map((v) => v3(v.look));
  const last = STOPS.length - 1;

  // Waar de camera hoort te zijn bij scrollpositie s: stilstaan rond elke stop,
  // daartussen een rustige vlucht met een kleine boog omhoog
  const targetPos = new THREE.Vector3();
  const targetLook = new THREE.Vector3();
  let stop = 0;
  const pathAt = (sIn: number) => {
    const sv = clamp(sIn, 0, last);
    const seg = Math.min(last - 1, Math.floor(sv));
    const f = sv - seg;
    let k = clamp((f - HOLD) / (1 - 2 * HOLD), 0, 1);
    if (reducedMotion) k = f < 0.5 ? 0 : 1;
    const e = easeInOut(k);
    targetPos.lerpVectors(stopPos[seg], stopPos[seg + 1], e);
    targetLook.lerpVectors(stopLook[seg], stopLook[seg + 1], e);
    const lift = Math.sin(Math.PI * e) * 0.7;
    targetPos.y += lift;
    targetLook.y += lift * 0.4;
  };
  pathAt(0);

  const pos = targetPos.clone();
  const look = targetLook.clone();
  // Openingsbeweging (ook gebruikt om te meten of het apparaat het trekt)
  const introFrom = new THREE.Vector3(0, 2.6, 7.6);
  let intro = reducedMotion ? 1 : 0;
  if (!reducedMotion) pos.copy(introFrom);

  // Slepen om rond te kijken, bovenop de scrollrichting (op touch alleen links/rechts)
  let yawOff = 0;
  let pitchOff = 0;
  let yaw = 0;
  let pitch = 0;
  let drag: { x: number; y: number; touch: boolean } | null = null;
  const onDown = (e: PointerEvent) => {
    drag = { x: e.clientX, y: e.clientY, touch: e.pointerType === "touch" };
  };
  const onMove = (e: PointerEvent) => {
    if (!drag) return;
    const dx = e.clientX - drag.x;
    const dy = e.clientY - drag.y;
    drag.x = e.clientX;
    drag.y = e.clientY;
    yawOff = clamp(yawOff + dx * (drag.touch ? 0.006 : 0.004), -2.6, 2.6);
    if (!drag.touch) pitchOff = clamp(pitchOff - dy * 0.003, -0.6, 0.5);
    dirty = true;
    kick();
  };
  const onUp = () => {
    drag = null;
  };
  canvas.addEventListener("pointerdown", onDown);
  window.addEventListener("pointermove", onMove);
  window.addEventListener("pointerup", onUp);
  window.addEventListener("pointercancel", onUp);

  // ---------------------------------------------------------------- render-lus
  let width = 1;
  let height = 1;
  const resize = () => {
    const parent = canvas.parentElement;
    width = parent?.clientWidth || window.innerWidth;
    height = parent?.clientHeight || window.innerHeight;
    renderer.setSize(width, height, false);
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
    dirty = true;
    kick();
  };
  const ro = new ResizeObserver(resize);
  if (canvas.parentElement) ro.observe(canvas.parentElement);

  let active = true;
  let raf = 0;
  let lastT = performance.now();
  let ready = false;
  let introFrames = 0;
  let introTime = 0;
  let slowReported = false;
  const proj = new THREE.Vector3();
  const camSpace = new THREE.Vector3();
  const dir = new THREE.Vector3();
  const hotspotVecs = ZONES.map((z) => v3(z.hotspot));

  const step = (now: number) => {
    raf = 0;
    if (!active) return;
    const dt = Math.min(0.05, Math.max(0, (now - lastT) / 1000));
    lastT = now;

    pathAt(stop);
    let moving = false;
    if (intro < 1) {
      intro = Math.min(1, intro + dt / 2.4);
      const e = easeInOut(intro);
      pos.lerpVectors(introFrom, targetPos, e);
      look.copy(targetLook);
      introFrames++;
      introTime += dt;
      moving = true;
    } else if (reducedMotion) {
      moving = pos.distanceToSquared(targetPos) > 0 || look.distanceToSquared(targetLook) > 0;
      pos.copy(targetPos);
      look.copy(targetLook);
    } else {
      // Zacht volgen: voelt als glijden, ook bij schokkerig scrollen
      const a = 1 - Math.exp(-dt * 4.5);
      pos.lerp(targetPos, a);
      look.lerp(targetLook, a);
      moving = pos.distanceToSquared(targetPos) > 1e-6 || look.distanceToSquared(targetLook) > 1e-6;
      // Na het scrollen draait de blik vanzelf terug naar de route
      if (moving && !drag) {
        const d = Math.exp(-dt * 2.5);
        yawOff *= d;
        pitchOff *= d;
      }
    }

    if (dirty || moving) {
      dirty = false;
      const dx = look.x - pos.x;
      const dy = look.y - pos.y;
      const dz = look.z - pos.z;
      yaw = Math.atan2(dx, -dz) + yawOff;
      pitch = clamp(Math.atan2(dy, Math.hypot(dx, dz)) + pitchOff, -1.2, 0.9);
      camera.position.copy(pos);
      // Bovenaanzicht als maquette: plafond weg zodra de camera erdoorheen gaat
      ceilingGroup.visible = pos.y < ROOM.height - 0.3;
      dir.set(Math.sin(yaw) * Math.cos(pitch), Math.sin(pitch), -Math.cos(yaw) * Math.cos(pitch));
      camera.lookAt(proj.copy(pos).add(dir));
      renderer.render(scene, camera);

      const hotspots = hotspotVecs.map((v) => {
        camSpace.copy(v).applyMatrix4(camera.matrixWorldInverse);
        proj.copy(v).project(camera);
        const x = (proj.x * 0.5 + 0.5) * width;
        const y = (-proj.y * 0.5 + 0.5) * height;
        const visible = camSpace.z < -0.2 && x > -40 && x < width + 40 && y > -40 && y < height + 40;
        return { x, y, visible };
      });
      onFrame({ hotspots, cam: { x: pos.x, z: pos.z, yaw } });

      if (!ready) {
        ready = true;
        onReady();
      }
    }

    // Na de openingsvlucht: was het gemiddeld trager dan ~20 fps, dan naar de 2D-versie
    if (!slowReported && intro >= 1 && introFrames > 10) {
      slowReported = true;
      if (introTime / introFrames > 1 / 20) onSlow();
    }

    if (moving || dirty) raf = requestAnimationFrame(step);
  };
  function kick() {
    if (active && !raf) {
      lastT = performance.now();
      raf = requestAnimationFrame(step);
    }
  }
  resize();
  kick();

  const onVisibility = () => {
    active = document.visibilityState === "visible";
    if (active) {
      dirty = true;
      kick();
    }
  };
  document.addEventListener("visibilitychange", onVisibility);

  return {
    setStop(sv) {
      if (sv === stop) return;
      stop = sv;
      kick();
    },
    setActive(on) {
      active = on && document.visibilityState === "visible";
      if (active) {
        dirty = true;
        kick();
      } else if (raf) {
        cancelAnimationFrame(raf);
        raf = 0;
      }
    },
    dispose() {
      active = false;
      if (raf) cancelAnimationFrame(raf);
      ro.disconnect();
      canvas.removeEventListener("pointerdown", onDown);
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerup", onUp);
      window.removeEventListener("pointercancel", onUp);
      document.removeEventListener("visibilitychange", onVisibility);
      scene.traverse((o) => {
        const m = o as THREE.Mesh;
        if (m.geometry) m.geometry.dispose();
        const mat = m.material as THREE.Material | THREE.Material[] | undefined;
        const list = Array.isArray(mat) ? mat : mat ? [mat] : [];
        list.forEach((x) => {
          const map = (x as THREE.MeshBasicMaterial).map;
          if (map) map.dispose();
          x.dispose();
        });
      });
      envTex.dispose();
      renderer.dispose();
      renderer.forceContextLoss();
    },
  };
}
