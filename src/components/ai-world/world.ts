import * as THREE from "three";
import { RoundedBoxGeometry } from "three/examples/jsm/geometries/RoundedBoxGeometry.js";
import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer.js";
import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass.js";
import { UnrealBloomPass } from "three/examples/jsm/postprocessing/UnrealBloomPass.js";
import { ShaderPass } from "three/examples/jsm/postprocessing/ShaderPass.js";
import { OutputPass } from "three/examples/jsm/postprocessing/OutputPass.js";

/**
 * Eén ronde, zachtblauwe robot (in de stijl van Baymax) in het zwart, zonder
 * knoppen of details erop. Scroll en de camera zoomt dichtbij op een onderdeel
 * en trekt dan weer terug, van pilaar naar pilaar. De tekst van elke pilaar
 * staat met een dun lijntje vast aan dat onderdeel. De ogen zijn echt hol: aan
 * het begin vlieg je uit het hoofd naar buiten, aan het eind door het oog het
 * hoofd in en er aan de achterkant weer uit, de tunnel in.
 */
export type FrameInfo = {
  /** Schermpositie (px) van het aanhaakpunt per sectie, of null als het niet bestaat. */
  anchors: ({ x: number; y: number } | null)[];
  /** Activatie per sectie, 0 tot 1. */
  acts: number[];
  width: number;
  height: number;
};
export type WorldOptions = {
  reducedMotion: boolean;
  /** Aantal secties op de pagina (1 sectie = 1 scherm). */
  stationCount: number;
  /** Verlaag automatisch de kwaliteit als het apparaat het niet trekt. */
  adaptive?: boolean;
  onReady?: () => void;
  onFrame?: (info: FrameInfo) => void;
};
export type World = {
  setProgress: (p: number) => void;
  /** Start de openingsvlucht (na de intro-loader). */
  reveal: () => void;
  dispose: () => void;
};

const BLUE = 0x93c5fd; // zachtblauw, de enige accentkleur
const ICE = 0xdbeafe;
const ROBOT = 0x4d87e6; // de kleur van de hele robot, een helder zachtblauw

// Per sectie: azimut rond de robot, hoogtehoek, afstand, kijkhoogte en waar de
// robot op het scherm staat (+ rechts). De laatste keyframe is vlak voor het oog.
const KEYFRAMES = [
  { th: 0.5, ph: 0.1, r: 5.6, ty: 2.4, ox: 0.22, roll: 0 }, //        0 start: de hele robot
  { th: 0.2, ph: 0.02, r: 1.9, ty: 3.6, ox: 0.2, roll: 0.05 }, //       1 agents: vlak voor het gezicht
  { th: 0.9, ph: 0.0, r: 2.8, ty: 1.9, ox: -0.2, roll: -0.06 }, //      2 CRM: dicht langs de buik
  { th: 3.1, ph: 0.45, r: 3.2, ty: 2.0, ox: 0.2, roll: 0.04 }, //       3 automatisering: hoog achter de robot
  { th: 4.2, ph: 1.3, r: 5.0, ty: 3.0, ox: -0.2, roll: 0.12 }, //       4 outreach: bijna recht van boven
  { th: 5.5, ph: 0.05, r: 7.0, ty: 2.4, ox: 0.2, roll: -0.03 }, //      5 compleet: ver weg, alles in beeld
  { th: 6.283, ph: 0.02, r: 2.6, ty: 3.65, ox: 0.2, roll: 0 }, //       6 contact: voor het oog, daarna erdoorheen
] as const;

// Armpose per sectie: schouder voor/achter en naar buiten
const POSES = [
  { rx: 0, rz: 0.1 },
  { rx: -0.15, rz: 0.1 },
  { rx: -0.05, rz: 0.1 },
  { rx: -0.5, rz: 0.05 },
  { rx: -0.05, rz: 0.2 },
  { rx: 0, rz: 0.75 },
  { rx: 0, rz: 0.1 },
] as const;

// Het hoofd is een afgeronde doos met twee grote ovale oogkassen en een ronde
// opening achter. Maten in de lokale ruimte van het hoofd.
const HEAD_Y = 3.62;
const HEAD_W = 1.5;
const HEAD_H = 1.16;
const HEAD_D = 1.1;
const EYE_X = 0.34; // afstand van het midden tot elk oog
const EYE_Y = 0.06;
const EYE_A = 0.19; // halve breedte van de ovale oogkas
const EYE_B = 0.26; // halve hoogte
const BACK_R = 0.36; // straal van de opening achter
const EYE_WX = EYE_X;
const EYE_WY = EYE_Y;
// Het laatste stuk (door het oog) duurt zoveel keer een gewoon stuk, zodat je het kunt volgen
const DIVE_LENGTH = 2.2;

const clamp01 = (x: number) => Math.min(1, Math.max(0, x));
const smooth = (x: number) => x * x * (3 - 2 * x);

function glowTexture() {
  const c = document.createElement("canvas");
  c.width = c.height = 128;
  const g = c.getContext("2d")!;
  const grd = g.createRadialGradient(64, 64, 0, 64, 64, 64);
  grd.addColorStop(0, "rgba(255,255,255,1)");
  grd.addColorStop(0.22, "rgba(255,255,255,0.3)");
  grd.addColorStop(1, "rgba(255,255,255,0)");
  g.fillStyle = grd;
  g.fillRect(0, 0, 128, 128);
  return new THREE.CanvasTexture(c);
}

const glowMat = (color: number, opacity = 1) =>
  new THREE.MeshBasicMaterial({ color, transparent: opacity < 1, opacity, toneMapped: false });
const ring = (radius: number, tube: number, color: number, opacity = 1, segs = 96) =>
  new THREE.Mesh(new THREE.TorusGeometry(radius, tube, 8, segs), glowMat(color, opacity));

export function createWorld(canvas: HTMLCanvasElement, opts: WorldOptions): World {
  const { reducedMotion, stationCount, adaptive = true, onReady, onFrame } = opts;
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, powerPreference: "high-performance" });
  const isSmall = Math.min(window.innerWidth, window.innerHeight) < 700;
  let pixelRatio = Math.min(window.devicePixelRatio || 1, isSmall ? 1.5 : 1.75);
  renderer.setPixelRatio(pixelRatio);
  // Zwart: de compositor codeert de clearkleur dubbel, dus alles behalve zwart wordt grijs
  renderer.setClearColor(0x000000, 1);

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(56, 1, 0.04, 300);

  // Nabewerking: zachte bloom, rustig vignet, een heel fijn korreltje
  const composer = new EffectComposer(renderer);
  composer.addPass(new RenderPass(scene, camera));
  const bloom = new UnrealBloomPass(new THREE.Vector2(256, 256), 0.28, 0.5, 0.62);
  composer.addPass(bloom);
  const finish = new ShaderPass({
    uniforms: {
      tDiffuse: { value: null },
      uTime: { value: 0 },
      uAberr: { value: 0.001 },
      uBlur: { value: 0 },
      uRes: { value: new THREE.Vector2(1, 1) },
    },
    vertexShader: `varying vec2 vUv; void main(){ vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0); }`,
    fragmentShader: `
      uniform sampler2D tDiffuse; uniform float uTime; uniform float uAberr; uniform float uBlur; uniform vec2 uRes; varying vec2 vUv;
      float rand(vec2 co){ return fract(sin(dot(co, vec2(12.9898, 78.233))) * 43758.5453); }
      void main(){
        vec2 c = vUv - 0.5;
        float d = length(c);
        vec2 off = c * uAberr * (0.4 + d);
        vec3 col = vec3(
          texture2D(tDiffuse, vUv + off).r,
          texture2D(tDiffuse, vUv).g,
          texture2D(tDiffuse, vUv - off).b
        );
        if (uBlur > 0.0005) {
          vec3 acc = col;
          for (int i = 1; i <= 6; i++) {
            float k = float(i) / 6.0;
            acc += texture2D(tDiffuse, vUv - c * uBlur * k * (0.6 + d)).rgb;
          }
          col = acc / 7.0;
        }
        col *= mix(1.0, 0.6, smoothstep(0.45, 0.95, d));
        col += (rand(floor(vUv * uRes) + fract(uTime) * 61.0) - 0.5) * 0.01;
        gl_FragColor = vec4(max(col, 0.0), 1.0);
      }`,
  });
  composer.addPass(new OutputPass());
  composer.addPass(finish);

  const glowTex = glowTexture();
  const glow = (color: number, size: number, opacity = 0.7) => {
    const s = new THREE.Sprite(
      new THREE.SpriteMaterial({
        map: glowTex,
        color,
        transparent: true,
        opacity: opacity * 0.35,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
        fog: false,
        toneMapped: false,
      }),
    );
    s.scale.setScalar(size);
    return s;
  };

  // Licht: zacht en koel
  scene.add(new THREE.AmbientLight(0x7d96c4, 1.5));
  const key = new THREE.DirectionalLight(0xf2f7ff, 2.1);
  key.position.set(-4, 7, 7);
  const rim = new THREE.DirectionalLight(0xa9c4ff, 0.9);
  rim.position.set(-7, 5, -6);
  const back = new THREE.PointLight(0x9cc4ff, 5, 10, 1.6);
  back.position.set(0, 3.2, -3.6);
  scene.add(key, rim, back);

  // Een reuzenwoord half achter de robot, zoals een productnaam achter een product.
  // Het staat altijd achter de robot gezien vanuit de camera en wisselt per sectie.
  const ghostLabels = ["ILAI", "AGENTS", "CRM", "FLOWS", "OUTREACH", "ALLES", ""];
  const cssFont = getComputedStyle(document.body).getPropertyValue("--font-heading").trim();
  const fontFamily = `${cssFont ? `${cssFont}, ` : ""}Helvetica, Arial, sans-serif`;
  const GW = 2048;
  const GH = 640;
  const drawGhost = (cv: HTMLCanvasElement, text: string) => {
    const ctx = cv.getContext("2d")!;
    ctx.clearRect(0, 0, GW, GH);
    let size = 560;
    ctx.font = `700 ${size}px ${fontFamily}`;
    const w = ctx.measureText(text).width;
    if (w > GW - 120) size = Math.floor((size * (GW - 120)) / w);
    ctx.font = `700 ${size}px ${fontFamily}`;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    const grd = ctx.createLinearGradient(0, GH * 0.12, 0, GH * 0.88);
    grd.addColorStop(0, "rgba(255,255,255,1)");
    grd.addColorStop(1, "rgba(255,255,255,0.05)");
    ctx.fillStyle = grd;
    ctx.fillText(text, GW / 2, GH / 2 + size * 0.04);
  };
  // Het woord is alleen zichtbaar aan de kant van de robot, nooit onder de tekst
  const ghostMask = { uMask: { value: new THREE.Vector2(0, 99999) }, uSoft: { value: 80 } };
  const ghosts = ghostLabels.map((text) => {
    if (!text) return null;
    const cv = document.createElement("canvas");
    cv.width = GW;
    cv.height = GH;
    drawGhost(cv, text);
    const tex = new THREE.CanvasTexture(cv);
    tex.colorSpace = THREE.SRGBColorSpace;
    const gmat = new THREE.MeshBasicMaterial({ map: tex, transparent: true, opacity: 0, depthWrite: false, toneMapped: false, fog: false });
    gmat.onBeforeCompile = (sh) => {
      sh.uniforms.uMask = ghostMask.uMask;
      sh.uniforms.uSoft = ghostMask.uSoft;
      sh.fragmentShader = sh.fragmentShader
        .replace("#include <common>", "#include <common>\nuniform vec2 uMask; uniform float uSoft;")
        .replace(
          "#include <dithering_fragment>",
          "#include <dithering_fragment>\n  gl_FragColor.a *= smoothstep(uMask.x - uSoft, uMask.x + uSoft, gl_FragCoord.x) * (1.0 - smoothstep(uMask.y - uSoft, uMask.y + uSoft, gl_FragCoord.x));",
        );
    };
    const mesh = new THREE.Mesh(new THREE.PlaneGeometry(1, GH / GW), gmat);
    scene.add(mesh);
    return { mesh, cv, tex, text };
  });
  // Het lettertype is misschien nog niet geladen: teken dan opnieuw zodra het er is
  document.fonts?.ready.then(() => {
    ghosts.forEach((g) => {
      if (!g) return;
      drawGhost(g.cv, g.text);
      g.tex.needsUpdate = true;
    });
  });
  // Zachte gloed achter de robot
  const aura = glow(BLUE, 9, 1);
  scene.add(aura);

  // ---------------------------------------------------------------------
  // De robot: één helderblauw materiaal, zwevende delen, niets erop
  // ---------------------------------------------------------------------
  const makeShell = () =>
    new THREE.MeshPhysicalMaterial({
      color: ROBOT,
      roughness: 0.42,
      metalness: 0,
      clearcoat: 0.55,
      clearcoatRoughness: 0.32,
      emissive: 0x16305f,
      emissiveIntensity: 0.16,
    });
  const shell = makeShell();

  // Het hoofd is een gesloten schaal met echte gaten: twee grote ovale oogkassen en
  // een ronde opening achter. De binnenkant is donker, zodat de ogen zwart lijken.
  const headMat = makeShell();
  headMat.side = THREE.DoubleSide;
  headMat.onBeforeCompile = (sh) => {
    sh.vertexShader = sh.vertexShader
      .replace("#include <common>", "#include <common>\nvarying vec3 vLocal;")
      .replace("#include <begin_vertex>", "#include <begin_vertex>\nvLocal = position;");
    sh.fragmentShader = sh.fragmentShader
      .replace("#include <common>", "#include <common>\nvarying vec3 vLocal;")
      .replace(
        "void main() {",
        `void main() {
        if (vLocal.z > 0.3) {
          vec2 e = vec2((abs(vLocal.x) - ${EYE_X.toFixed(3)}) / ${EYE_A.toFixed(3)}, (vLocal.y - ${EYE_Y.toFixed(3)}) / ${EYE_B.toFixed(3)});
          if (dot(e, e) < 1.0) discard;
        }
        if (vLocal.z < -0.3 && length(vLocal.xy) < ${BACK_R.toFixed(3)}) discard;`,
      )
      .replace("#include <dithering_fragment>", "#include <dithering_fragment>\n  if (!gl_FrontFacing) gl_FragColor.rgb *= 0.07;");
  };

  const robot = new THREE.Group();
  const HOVER = 0.32;
  robot.position.y = HOVER;
  scene.add(robot);
  const body = new THREE.Group();
  robot.add(body);

  // Lijf: een hoge ronde koepel, zwevend, zonder pootjes
  const BODY_Y0 = 0.55;
  const profile: THREE.Vector2[] = [new THREE.Vector2(0, 0)];
  const rBottom = 0.74;
  const rCorner = 0.24;
  for (let i = 0; i <= 8; i++) {
    const ang = -Math.PI / 2 + (i / 8) * (Math.PI / 2);
    profile.push(new THREE.Vector2(rBottom - rCorner + Math.cos(ang) * rCorner, rCorner + Math.sin(ang) * rCorner));
  }
  profile.push(new THREE.Vector2(0.64, 1.35));
  for (let i = 1; i <= 18; i++) {
    const ang = (i / 18) * (Math.PI / 2);
    profile.push(new THREE.Vector2(Math.cos(ang) * 0.64, 1.35 + Math.sin(ang) * 0.85));
  }
  const bodyMat = makeShell();
  bodyMat.side = THREE.DoubleSide;
  const torso = new THREE.Mesh(new THREE.LatheGeometry(profile, 80), bodyMat);
  torso.scale.z = 0.8;
  torso.position.y = BODY_Y0;
  body.add(torso);
  // Eén klein donker puntje op de buik, zoals in het ontwerp
  const dot = new THREE.Mesh(new THREE.SphereGeometry(0.035, 16, 12), new THREE.MeshBasicMaterial({ color: 0x0a0a12 }));
  dot.position.set(0, BODY_Y0 + 0.95, 0.5);
  body.add(dot);

  // Nekje, hoofd en oortjes
  const neck = new THREE.Mesh(new RoundedBoxGeometry(0.42, 0.3, 0.36, 5, 0.1), shell);
  neck.position.y = HEAD_Y - HEAD_H / 2 - 0.1;
  body.add(neck);

  const head = new THREE.Group();
  head.position.y = HEAD_Y;
  body.add(head);
  head.add(new THREE.Mesh(new RoundedBoxGeometry(HEAD_W, HEAD_H, HEAD_D, 10, 0.44), headMat));
  for (const sx of [-1, 1]) {
    const ear = new THREE.Mesh(new THREE.CapsuleGeometry(0.09, 0.24, 8, 16), shell);
    ear.position.set(sx * (HEAD_W / 2 + 0.1), 0.02, 0);
    head.add(ear);
    // Lichte rand rond de oogkas, een tint lichter van dezelfde blauw
    const rim = new THREE.Mesh(new THREE.TorusGeometry(1, 0.06, 10, 64), glowMat(0xa9c8ff, 0.95));
    rim.scale.set(EYE_A + 0.012, EYE_B + 0.012, 1);
    rim.position.set(sx * EYE_X, EYE_Y, HEAD_D / 2 + 0.003);
    head.add(rim);
  }
  // Heel zwak licht in het hoofd, net genoeg om de binnenwand te laten aflopen
  const innerLight = new THREE.PointLight(0x9cc4ff, 1, 2.5, 1.6);
  innerLight.position.set(0, 0, -0.1);
  head.add(innerLight);
  const innerGlow = glow(BLUE, 1.0, 1);
  innerGlow.position.set(0, 0, -0.2);
  head.add(innerGlow);

  // Losse armen met bolhanden, ze zweven naast het lijf
  type Arm = { shoulder: THREE.Group; sx: number };
  const arms: Arm[] = [-1, 1].map((sx) => {
    const shoulder = new THREE.Group();
    shoulder.position.set(sx * 1.08, 2.5, 0);
    const limb = new THREE.Mesh(new THREE.CapsuleGeometry(0.17, 0.78, 10, 24), shell);
    limb.position.y = -0.52;
    shoulder.add(limb);
    const hand = new THREE.Mesh(new THREE.SphereGeometry(0.25, 32, 24), shell);
    hand.position.y = -1.2;
    shoulder.add(hand);
    body.add(shoulder);
    return { shoulder, sx };
  });

  const hoverGlow = glow(BLUE, 5, 1);
  hoverGlow.position.set(0, 0.05, 0);
  scene.add(hoverGlow);

  // Aanhaakpunten waar de tekst van elke pilaar aan vastzit (onzichtbaar, alleen voor het lijntje)
  const anchor = (parent: THREE.Object3D, x: number, y: number, z: number) => {
    const o = new THREE.Object3D();
    o.position.set(x, y, z);
    parent.add(o);
    return o;
  };
  const anchors: (THREE.Object3D | null)[] = [
    null, // 0 start: geen tekst op de robot
    anchor(head, 0, -0.34, HEAD_D / 2), //   1 agents: onder de ogen
    anchor(body, 0.3, BODY_Y0 + 1.0, 0.46), // 2 CRM: de buik
    anchor(body, 0, BODY_Y0 + 1.1, -0.5), //  3 automatisering: de rug
    anchor(head, 0, HEAD_H / 2, 0), //        4 outreach: de kruin
    anchor(body, 1.25, 2.55, 0), //           5 compleet: de arm
    null, // 6 contact: door het oog
  ];
  // Het midden van het linkeroog: hier vlieg je doorheen
  const eyeAnchor = anchor(head, -EYE_X, EYE_Y, HEAD_D / 2);

  // De tunnel achter het hoofd, waar je na het oog doorheen vliegt
  const tunnelGroup = new THREE.Group();
  scene.add(tunnelGroup);
  const tunnelY = HOVER + HEAD_Y + EYE_WY;
  const tunnel = [-3, -6.5, -10, -13.5, -17].map((z, i) => {
    const m = ring(1.0 - i * 0.12, 0.014, i % 2 ? ICE : BLUE, 0);
    m.position.set(-EYE_WX, tunnelY, z);
    (m.material as THREE.MeshBasicMaterial).transparent = true;
    tunnelGroup.add(m);
    return m;
  });
  const tunnelGlow = glow(BLUE, 12, 0.9);
  tunnelGlow.position.set(-EYE_WX, tunnelY, -21);
  tunnelGroup.add(tunnelGlow);

  // ---------------------------------------------------------------------
  // Camera, scroll en animatie
  // ---------------------------------------------------------------------
  const N = Math.min(stationCount, KEYFRAMES.length);
  const target = new THREE.Vector3();
  const orbitPos = new THREE.Vector3();
  const eyeW = new THREE.Vector3();
  const fwd = new THREE.Vector3();
  const pathPos = new THREE.Vector3();
  const pathLook = new THREE.Vector3();
  const exitPos = new THREE.Vector3();
  const exitLook = new THREE.Vector3();
  const headQ = new THREE.Quaternion();
  const proj = new THREE.Vector3();
  const centre = new THREE.Vector3();
  const toC = new THREE.Vector3();
  const gp = new THREE.Vector3();
  let width = 1;
  let height = 1;

  function resize() {
    const parent = canvas.parentElement;
    width = parent?.clientWidth || window.innerWidth;
    height = parent?.clientHeight || window.innerHeight;
    renderer.setSize(width, height, false);
    composer.setPixelRatio(pixelRatio);
    composer.setSize(width, height);
    bloom.resolution.set(width / 2, height / 2);
    finish.uniforms.uRes.value.set(width * pixelRatio, height * pixelRatio);
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
  }
  resize();
  window.addEventListener("resize", resize);

  const pointer = { x: 0, y: 0, tx: 0, ty: 0 };
  const onPointer = (e: PointerEvent) => {
    pointer.tx = (e.clientX / window.innerWidth - 0.5) * 2;
    pointer.ty = (e.clientY / window.innerHeight - 0.5) * 2;
  };
  if (!reducedMotion) window.addEventListener("pointermove", onPointer, { passive: true });

  let targetP = 0;
  let sIdx = 0; // vloeiende sectie-index (0 tot N-1)
  let t = 0;
  let last = performance.now();
  let raf = 0;
  let ready = false;
  let revealAt = -1; // tijdstip waarop de openingsvlucht begon
  let eyeLevel = 0;
  let perfFrames = 0;
  let perfTime = 0;
  let perfChecks = 0;
  const act = (i: number) => clamp01(1 - Math.abs(sIdx - i));
  const INTRO = 3.6; // seconden voor de vlucht uit het hoofd
  const FRONT = 2.6; // afstand vóór het oog waar de duik begint
  const THROUGH = -4.9; // waar de camera eindigt (achter het hoofd, in de tunnel)

  function frame(now: number) {
    const dt = Math.min(0.05, Math.max(0, (now - last) / 1000));
    last = now;
    if (!reducedMotion) t += dt;

    const prev = sIdx;
    // Het laatste stuk (door het oog) krijgt meer scrolllengte, zodat je het rustig kunt volgen
    const uScroll = targetP * (N - 2 + DIVE_LENGTH);
    const targetIdx = uScroll <= N - 2 ? uScroll : N - 2 + (uScroll - (N - 2)) / DIVE_LENGTH;
    sIdx += (targetIdx - sIdx) * (reducedMotion ? 1 : 1 - Math.exp(-5 * dt));
    const vel = (sIdx - prev) / Math.max(dt, 1e-3) / Math.max(1, N - 1);

    // Camera: tussen twee keyframes met een zachte ease rond de robot draaien.
    // Halverwege elk stuk trekt de camera even terug, bij elke pilaar zoomt hij weer in.
    // In het laatste stuk draait de camera eerst voor het oog en duikt er dan doorheen.
    const i0 = Math.min(N - 2, Math.max(0, Math.floor(sIdx)));
    const inLast = i0 === N - 2;
    const fe = smooth(clamp01(sIdx - i0));
    const fo = inLast ? smooth(clamp01(fe / 0.55)) : fe;
    const diveT = inLast ? clamp01((fe - 0.5) / 0.5) : 0;
    const k0 = KEYFRAMES[i0];
    const k1 = KEYFRAMES[i0 + 1];
    const lerp = (a: number, b: number) => a + (b - a) * fo;
    const aspect = camera.aspect;
    const narrow = aspect < 1.25 ? 1 + (1.25 - aspect) * 0.8 : 1;
    const intro = revealAt < 0 ? 0 : clamp01((t - revealAt) / INTRO);

    const th = lerp(k0.th, k1.th) + (reducedMotion ? 0 : Math.sin(t * 0.25) * 0.02);
    const ph = lerp(k0.ph, k1.ph);
    const pull = 1 + 0.3 * Math.sin(Math.PI * fo) * (inLast ? 0.5 : 1);
    const r = lerp(k0.r, k1.r) * narrow * pull;
    target.set(0, lerp(k0.ty, k1.ty) + HOVER * 0.5, 0);
    orbitPos.set(
      target.x + r * Math.sin(th) * Math.cos(ph),
      target.y + r * Math.sin(ph),
      target.z + r * Math.cos(th) * Math.cos(ph),
    );

    // Door het oog: een rechte lijn door de oogkas, door het holle hoofd, de achteropening uit
    eyeAnchor.getWorldPosition(eyeW);
    head.getWorldQuaternion(headQ);
    fwd.set(0, 0, 1).applyQuaternion(headQ);
    const dive = smooth(diveT);
    const dist = FRONT + (THROUGH - FRONT) * dive;
    pathPos.copy(eyeW).addScaledVector(fwd, dist);
    pathLook.copy(pathPos).addScaledVector(fwd, -6);
    const blendIn = smooth(clamp01(diveT * 5));
    orbitPos.lerp(pathPos, blendIn);
    target.lerp(pathLook, blendIn);

    // Openingsvlucht: vanuit het hoofd door het oog naar buiten, dan een bocht naar het startbeeld
    if (intro < 1) {
      const s1 = smooth(clamp01(intro * 2));
      const s2 = smooth(clamp01(intro * 2 - 1));
      exitPos.copy(eyeW).addScaledVector(fwd, -0.9 + 3.6 * s1);
      exitLook.copy(exitPos).addScaledVector(fwd, 6);
      if (s2 > 0) {
        exitPos.lerp(orbitPos, s2);
        exitLook.lerp(target, s2);
      }
      orbitPos.copy(exitPos);
      target.copy(exitLook);
    }
    const flying = Math.max(blendIn, 1 - intro);

    pointer.x += (pointer.tx - pointer.x) * 0.05;
    pointer.y += (pointer.ty - pointer.y) * 0.05;
    camera.position.copy(orbitPos);
    camera.position.x += pointer.x * 0.12 * (1 - flying);
    camera.position.y += -pointer.y * 0.08 * (1 - flying);
    camera.lookAt(target);
    camera.rotateZ(lerp(k0.roll, k1.roll) * (1 - flying));

    // Robot op het scherm: naast de tekst, of in de bovenhelft op mobiel
    const ox = lerp(k0.ox, k1.ox);
    if (aspect < 1) camera.setViewOffset(width, height, 0, height * 0.22, width, height);
    else camera.setViewOffset(width, height, -ox * width, 0, width, height);
    const fov = 56 + Math.min(10, Math.abs(vel) * 60) + flying * 6;
    camera.fov += (fov - camera.fov) * 0.12;
    camera.updateProjectionMatrix();

    finish.uniforms.uTime.value = t;
    finish.uniforms.uBlur.value = Math.min(0.05, Math.abs(vel) * 0.25);
    finish.uniforms.uAberr.value = 0.001 + Math.min(0.008, Math.abs(vel) * 0.3) + flying * 0.0015;

    // Activatie per sectie (driehoekig, telt samen op tot 1)
    const a = Array.from({ length: 7 }, (_, i) => (i < N ? act(i) : 0));

    // Robot: ademen, zweven, hoofd draait zacht mee met de muis, de binnenkant gloeit op
    const breathe = reducedMotion ? 0 : Math.sin(t * 1.6);
    robot.position.y = HOVER + (reducedMotion ? 0 : Math.sin(t * 1.1) * 0.05);
    body.scale.set(1 + breathe * 0.004, 1 + breathe * 0.008, 1 + breathe * 0.004);
    hoverGlow.material.opacity = 0.1;
    eyeLevel += ((revealAt < 0 ? 0.4 : 1) - eyeLevel) * 0.05;
    innerLight.intensity = 0.5 + eyeLevel * 0.7;
    innerGlow.material.opacity = 0.015 + eyeLevel * 0.02;
    const facing = Math.max(0, Math.cos(th)) * (1 - flying);
    head.rotation.y += (pointer.x * 0.4 * facing - head.rotation.y) * 0.08;
    head.rotation.x += (pointer.y * 0.2 * facing - head.rotation.x) * 0.08;

    // Armpose: gewogen mix van de poses per sectie
    let rx = 0;
    let rz = 0;
    for (let i = 0; i < N; i++) {
      rx += POSES[i].rx * a[i];
      rz += POSES[i].rz * a[i];
    }
    arms.forEach(({ shoulder, sx }) => {
      shoulder.rotation.x = rx + (reducedMotion ? 0 : Math.sin(t * 1.1 + sx) * 0.03);
      shoulder.rotation.z = (rz + 0.1) * sx;
    });

    // De tunnel verschijnt alleen bij het laatste stuk
    tunnelGroup.visible = a[6] > 0.01;
    tunnel.forEach((m, i) => {
      (m.material as THREE.MeshBasicMaterial).opacity = smooth(clamp01(a[6] * 1.4 - i * 0.04)) * 0.9;
      m.rotation.z = reducedMotion ? 0 : t * (i % 2 ? 0.2 : -0.15);
    });

    // Reuzenwoord en gloed achter de robot, altijd gezien vanuit de camera
    centre.set(0, HOVER + 2.4, 0);
    toC.copy(centre).sub(camera.position).normalize();
    gp.copy(centre).addScaledVector(toC, 4);
    const D = camera.position.distanceTo(gp);
    const wWorld = 2 * D * Math.tan((camera.fov * Math.PI) / 360) * camera.aspect * (camera.aspect >= 1 ? 0.95 : 1.0);
    // Zichtbaar gebied: alleen de helft van het scherm waar de robot staat (op mobiel alles)
    const pr = renderer.getPixelRatio();
    if (aspect >= 1) {
      const lb = width * 0.5 * clamp01(ox / 0.1);
      const rb = width - width * 0.5 * clamp01(-ox / 0.1);
      ghostMask.uMask.value.set(lb * pr, rb * pr);
    } else ghostMask.uMask.value.set(0, width * pr);
    ghostMask.uSoft.value = 70 * pr;
    const hide = 1 - Math.max(blendIn, 1 - intro);
    ghosts.forEach((g, i) => {
      if (!g) return;
      g.mesh.position.copy(gp);
      g.mesh.lookAt(camera.position);
      g.mesh.scale.set(wWorld, wWorld, 1);
      (g.mesh.material as THREE.MeshBasicMaterial).opacity = 0.085 * smooth(a[i] ?? 0) * hide;
    });
    aura.position.copy(gp);
    aura.material.opacity = 0.05 * hide;

    composer.render(dt);
    if (!ready) {
      ready = true;
      onReady?.();
    }

    // Schermposities van de aanhaakpunten, voor de tekst op de robot
    if (onFrame) {
      const list = anchors.map((o) => {
        if (!o) return null;
        o.getWorldPosition(proj);
        proj.project(camera);
        if (proj.z > 1) return null;
        return { x: (proj.x * 0.5 + 0.5) * width, y: (-proj.y * 0.5 + 0.5) * height };
      });
      onFrame({ anchors: list, acts: a, width, height });
    }

    // Trekt het apparaat het niet? Eerst minder pixels, daarna zonder bloom.
    if (adaptive && perfChecks < 6) {
      perfFrames++;
      perfTime += dt;
      if (perfFrames === 90) {
        const avg = perfTime / perfFrames;
        perfChecks++;
        if (avg > 1 / 40) {
          if (pixelRatio > 1) {
            pixelRatio = Math.max(1, pixelRatio - 0.25);
            renderer.setPixelRatio(pixelRatio);
            resize();
          } else if (bloom.enabled) {
            bloom.enabled = false;
          }
        }
        perfFrames = 0;
        perfTime = 0;
      }
    }
    raf = requestAnimationFrame(frame);
  }
  raf = requestAnimationFrame(frame);

  return {
    setProgress(p: number) {
      targetP = clamp01(p);
    },
    reveal() {
      if (revealAt < 0) revealAt = t;
    },
    dispose() {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
      window.removeEventListener("pointermove", onPointer);
      scene.traverse((o) => {
        const m = o as THREE.Mesh;
        m.geometry?.dispose?.();
        const mat = m.material as THREE.Material | THREE.Material[] | undefined;
        if (Array.isArray(mat)) mat.forEach((x) => x.dispose());
        else mat?.dispose?.();
      });
      glowTex.dispose();
      composer.dispose();
      renderer.dispose();
      renderer.forceContextLoss();
    },
  };
}
