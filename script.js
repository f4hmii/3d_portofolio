async function initializeKeyboard3D() {
const THREE = window.THREE;
if (!THREE) throw new Error("The 3D renderer could not be loaded.");

const technologies = [
  { name: "Supabase", mark: "SB", color: "#55d5a0", category: "BACKEND AS A SERVICE", level: "DIKUASAI", score: 85, description: "Membangun backend aplikasi dengan database, autentikasi, dan layanan Supabase." },
  { name: "MySQL", mark: "SQL", color: "#61a8d8", category: "RELATIONAL DATABASE", level: "DIKUASAI", score: 85, description: "Mengelola data relasional dan query untuk kebutuhan aplikasi." },
  { name: "React", mark: "react", color: "#67dff5", category: "FRONTEND LIBRARY", level: "DIKUASAI", score: 85, description: "Membangun antarmuka responsif dan interaktif dengan komponen." },
  { name: "Next.js", mark: "next", color: "#f1f0e9", category: "REACT FRAMEWORK", level: "DIKUASAI", score: 85, description: "Mengembangkan aplikasi web berbasis React dengan routing dan rendering modern." },
  { name: "TypeScript", mark: "ts", color: "#579bfa", category: "TYPED JAVASCRIPT", level: "DIKUASAI", score: 85, description: "Menulis JavaScript dengan tipe yang membantu menjaga kode tetap jelas." },
  { name: "JavaScript", mark: "JS", color: "#e8cd58", category: "PROGRAMMING LANGUAGE", level: "DIKUASAI", score: 85, description: "Mengembangkan interaksi dan logika aplikasi di web maupun server." },
  { name: "Tailwind CSS", mark: "TW", color: "#55d5d0", category: "CSS FRAMEWORK", level: "DIKUASAI", score: 85, description: "Membangun tampilan konsisten menggunakan utility classes." },
  { name: "Flutter", mark: "FL", color: "#69b9f5", category: "CROSS-PLATFORM UI", level: "DIKUASAI", score: 85, description: "Membangun aplikasi lintas platform dengan satu basis kode." },
  { name: "Dart", mark: "D", color: "#58b8cc", category: "PROGRAMMING LANGUAGE", level: "DIKUASAI", score: 85, description: "Mengembangkan aplikasi menggunakan bahasa Dart, termasuk untuk Flutter." },
  { name: "Laravel", mark: "L", color: "#f06c63", category: "PHP FRAMEWORK", level: "DIKUASAI", score: 85, description: "Membangun aplikasi backend dengan ekosistem Laravel." },
  { name: "Node.js", mark: "node", color: "#a8cf67", category: "JAVASCRIPT RUNTIME", level: "DIKUASAI", score: 85, description: "Menjalankan JavaScript di server untuk membangun layanan aplikasi." },
  { name: "Express.js", mark: "EX", color: "#d4d8cf", category: "NODE.JS FRAMEWORK", level: "DIKUASAI", score: 85, description: "Membuat API dan aplikasi web server dengan framework Express." },
  { name: "Cloudflare Pages", mark: "CF", color: "#f3a75a", category: "WEB HOSTING", level: "DIKUASAI", score: 85, description: "Mempublikasikan website dan aplikasi web melalui Cloudflare Pages." },
  { name: "Vercel", mark: "V", color: "#f1f0e9", category: "WEB HOSTING", level: "DIKUASAI", score: 85, description: "Mendeploy aplikasi web melalui platform Vercel." },
  { name: "Git", mark: "G", color: "#ee795e", category: "VERSION CONTROL", level: "DIKUASAI", score: 85, description: "Melacak perubahan kode dan mengelola riwayat pengembangan." },
  { name: "GitHub", mark: "GH", color: "#e7e8e0", category: "CODE COLLABORATION", level: "DIKUASAI", score: 85, description: "Menyimpan repository dan berkolaborasi pada proyek perangkat lunak." },
  { name: "Postman", mark: "PM", color: "#f18c55", category: "API DEVELOPMENT", level: "DIKUASAI", score: 85, description: "Menguji dan mengelola request API selama pengembangan." },
  { name: "Laragon", mark: "LA", color: "#7bbd8b", category: "LOCAL DEVELOPMENT", level: "DIKUASAI", score: 85, description: "Menyiapkan lingkungan pengembangan lokal untuk aplikasi web." },
];
const keycapColors = [
  "#f2efd9", "#f2efd9", "#f2efd9", "#f2efd9", "#f2efd9", "#f2efd9",
  "#f2efd9", "#f2efd9", "#f2efd9", "#f2efd9", "#f2efd9", "#f2efd9",
  "#f2efd9", "#f2efd9", "#f2efd9", "#f2efd9", "#f2efd9", "#f2efd9",
];

const canvas = document.querySelector("#keyboard-canvas");
const stage = document.querySelector("#keyboard-stage");
const showcase = stage.closest(".showcase");
const infoCard = document.querySelector("#tech-card");
let infoCardWidth = 260;
let infoCardHeight = 160;
new ResizeObserver(() => {
  infoCardWidth = infoCard.offsetWidth;
  infoCardHeight = infoCard.offsetHeight;
}).observe(infoCard);
const info = {
  number: document.querySelector("#tech-number"),
  icon: document.querySelector("#tech-icon"),
  name: document.querySelector("#tech-name"),
  category: document.querySelector("#tech-category"),
  description: document.querySelector("#tech-description"),
  level: document.querySelector("#tech-level"),
  fill: document.querySelector("#level-fill"),
};

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(35, 1, 0.1, 100);
camera.position.set(-2.5, 8.5, 5.8);
camera.lookAt(0, 0, 0);

const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
renderer.setPixelRatio(Math.min(Math.max(window.devicePixelRatio || 1, 1.5), 2));
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
renderer.outputColorSpace = THREE.SRGBColorSpace;
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1;

scene.add(new THREE.HemisphereLight(0xf1f5e9, 0x30352e, 1));
const keyLight = new THREE.DirectionalLight(0xfff8eb, 2.6);
keyLight.position.set(-5, 12, 8);
keyLight.castShadow = true;
keyLight.shadow.mapSize.set(2048, 2048);
keyLight.shadow.camera.left = -8;
keyLight.shadow.camera.right = 8;
keyLight.shadow.camera.top = 8;
keyLight.shadow.camera.bottom = -6;
keyLight.shadow.bias = -0.0003;
scene.add(keyLight);
const rimLight = new THREE.DirectionalLight(0xb9d1c7, 0.65);
rimLight.position.set(7, 8, -9);
scene.add(rimLight);

const floor = new THREE.Mesh(
  new THREE.PlaneGeometry(200, 200),
  new THREE.ShadowMaterial({ color: 0x000000, opacity: 0.4 }),
);
floor.rotation.x = -Math.PI / 2;
floor.position.y = -0.58;
floor.receiveShadow = true;
scene.add(floor);

const keyboard = new THREE.Group();
scene.add(keyboard);
// Move the case separately so the caps can land on a stationary board.
const board = new THREE.Group();
keyboard.add(board);
const motionPreference = window.matchMedia("(prefers-reduced-motion: reduce)");
const assembly = {
  active: !motionPreference.matches,
  elapsed: 0,
  boardDuration: 0.82,
  firstKeyDelay: 0.84,
  keyStagger: 0.11,
  fallDuration: 0.54,
  settleDuration: 0.16,
  lift: 6.2,
};
const screenUp = new THREE.Vector3();
const keyboardHomePosition = new THREE.Vector3(0, 0, 0);
const heroCameraPosition = new THREE.Vector3();
const workspaceCameraPosition = new THREE.Vector3();
const technologyCameraPosition = new THREE.Vector3();
const monitorZoomCameraPosition = new THREE.Vector3();
const monitorScreenCenter = new THREE.Vector3();
const heroCameraTarget = new THREE.Vector3();
const workspaceCameraTarget = new THREE.Vector3();
const technologyCameraTarget = new THREE.Vector3();
const cameraDirection = new THREE.Vector3(-2.5, 8.5, 5.8).normalize();
const technologyCameraDirection = new THREE.Vector3(0, 0.1, 1).normalize();
const animatedCameraTarget = new THREE.Vector3();
let boardTravel = 0;

function roundedShape(width, depth, radius) {
  const x = -width / 2;
  const z = -depth / 2;
  const shape = new THREE.Shape();
  shape.moveTo(x + radius, z);
  shape.lineTo(x + width - radius, z);
  shape.quadraticCurveTo(x + width, z, x + width, z + radius);
  shape.lineTo(x + width, z + depth - radius);
  shape.quadraticCurveTo(x + width, z + depth, x + width - radius, z + depth);
  shape.lineTo(x + radius, z + depth);
  shape.quadraticCurveTo(x, z + depth, x, z + depth - radius);
  shape.lineTo(x, z + radius);
  shape.quadraticCurveTo(x, z, x + radius, z);
  return shape;
}

function makeShell(width, depth, height, y, color, bevel = 0.08, opening = null) {
  const outline = roundedShape(width, depth, 0.28);
  if (opening) {
    outline.holes.push(new THREE.Path(roundedShape(opening[0], opening[1], 0.16).getPoints(8)));
  }
  const geometry = new THREE.ExtrudeGeometry(outline, {
    depth: height,
    bevelEnabled: true,
    bevelSegments: 3,
    bevelSize: bevel,
    bevelThickness: bevel,
    curveSegments: 8,
  });
  geometry.rotateX(-Math.PI / 2);
  const mesh = new THREE.Mesh(geometry, new THREE.MeshStandardMaterial({ color, roughness: 0.32, metalness: 0.32 }));
  mesh.position.y = y;
  mesh.castShadow = true;
  mesh.receiveShadow = true;
  board.add(mesh);
  return mesh;
}

// Multi-part case with a solid base below the recessed key sockets.
makeShell(6.55, 3.55, 0.22, -0.48, 0x827c99, 0.07);
makeShell(6.42, 3.42, 0.27, -0.28, 0xbab2cf, 0.07, [6.12, 3.1]);
makeShell(6.22, 3.22, 0.045, 0.005, 0x77728b, 0.02, [6.08, 3.06]);

const socketPlateShape = roundedShape(6.18, 3.2, 0.2);
const socketFloorY = -0.095;
const socketPlateSurfaceY = 0.173;
const seatedKeyY = 0.1;
// Leave clearance above the socket floor even when a key is pressed.
const keyPressTravel = 0.18;
const socketFloorMaterial = new THREE.MeshStandardMaterial({
  color: 0x655b76, roughness: 0.92, metalness: 0,
});

function addKeySocket(x, z, width, depth) {
  const outline = roundedShape(width + 0.008, depth + 0.008, 0.125);
  // The plate rotates from XY into XZ, so its path Y is the negative world Z.
  const holePoints = outline.getPoints(8).map((point) => new THREE.Vector2(point.x + x, point.y - z));
  socketPlateShape.holes.push(new THREE.Path(holePoints));

  const geometry = new THREE.ShapeGeometry(outline, 8);
  geometry.rotateX(-Math.PI / 2);
  const socketFloor = new THREE.Mesh(geometry, socketFloorMaterial);
  socketFloor.position.set(x, socketFloorY, z);
  socketFloor.receiveShadow = true;
  board.add(socketFloor);
}

function addSocketPlate() {
  // Actual openings and inset walls let the caps enter below the plate surface.
  const geometry = new THREE.ExtrudeGeometry(socketPlateShape, {
    depth: socketPlateSurfaceY - socketFloorY - 0.005,
    bevelEnabled: true,
    bevelSegments: 2,
    bevelSize: 0.003,
    bevelThickness: 0.003,
    curveSegments: 8,
    steps: 1,
  });
  geometry.rotateX(-Math.PI / 2);
  const plate = new THREE.Mesh(geometry, [
    new THREE.MeshStandardMaterial({ color: 0xd6cbe5, roughness: 0.45, metalness: 0.2 }),
    new THREE.MeshStandardMaterial({ color: 0x8c7d9e, roughness: 0.72, metalness: 0.08 }),
  ]);
  plate.position.y = socketFloorY + 0.005;
  plate.castShadow = true;
  plate.receiveShadow = true;
  board.add(plate);
}

const layout = [
  [["tech", 2, 0], ["tech", 2, 1], ["tech", 2, 2], ["tech", 2, 3], ["tech", 2, 4], ["tech", 2, 5]],
  [["tech", 2, 6], ["tech", 2, 7], ["tech", 2, 8], ["tech", 2, 9], ["tech", 2, 10], ["tech", 2, 11]],
  [["tech", 2, 12], ["tech", 2, 13], ["tech", 2, 14], ["tech", 2, 15], ["tech", 2, 16], ["tech", 2, 17]],
];

function roundedKeyGeometry(width, depth) {
  const geometry = new THREE.BufferGeometry();
  const cornerRadius = Math.min(0.115, depth * 0.14);
  const cornerSteps = 8;
  const topScale = 0.86;
  const loop = (scale) => {
    const w = width * scale, d = depth * scale, r = cornerRadius * scale;
    const corners = [
      [w / 2 - r, -d / 2 + r, -Math.PI / 2],
      [w / 2 - r, d / 2 - r, 0],
      [-w / 2 + r, d / 2 - r, Math.PI / 2],
      [-w / 2 + r, -d / 2 + r, Math.PI],
    ];
    return corners.flatMap(([cx, cz, start]) => Array.from({ length: cornerSteps + 1 }, (_, step) => {
      const angle = start + (Math.PI / 2) * (step / cornerSteps);
      return [cx + Math.cos(angle) * r, cz + Math.sin(angle) * r];
    }));
  };
  // A rounded foot, straight tapered walls, and a small bevel around the crown.
  const rings = [
    { y: 0, scale: 0.97 },
    { y: 0.03, scale: 1 },
    { y: 0.46, scale: 0.925 },
    { y: 0.51, scale: 0.91 },
    { y: 0.545, scale: 0.885 },
    { y: 0.56, scale: topScale },
  ];
  const positions = [];
  const uvs = [];
  rings.forEach(({ y, scale }) => loop(scale).forEach(([x, z]) => {
    positions.push(x, y, z);
    uvs.push(x / (width * topScale) + 0.5, 0.5 - z / (depth * topScale));
  }));
  const pointsPerRing = (cornerSteps + 1) * 4;
  const indices = [];
  for (let ring = 0; ring < rings.length - 1; ring++) {
    const lower = ring * pointsPerRing;
    const upper = (ring + 1) * pointsPerRing;
    for (let i = 0; i < pointsPerRing; i++) {
      const next = (i + 1) % pointsPerRing;
      const a = lower + i, b = lower + next, c = upper + next, d = upper + i;
      indices.push(a, d, c, a, c, b);
    }
  }
  const bottomCenter = positions.length / 3;
  positions.push(0, 0, 0);
  uvs.push(0.5, 0.5);
  for (let i = 0; i < pointsPerRing; i++) {
    const next = (i + 1) % pointsPerRing;
    indices.push(bottomCenter, i, next);
  }
  const sideIndexCount = indices.length;
  const topStart = (rings.length - 1) * pointsPerRing;
  // A shallow dish keeps the top continuous instead of forming a pointed depression.
  const dishStart = positions.length / 3;
  loop(0.57).forEach(([x, z]) => {
    positions.push(x, 0.555, z);
    uvs.push(x / (width * topScale) + 0.5, 0.5 - z / (depth * topScale));
  });
  positions.push(0, 0.552, 0);
  uvs.push(0.5, 0.5);
  const center = positions.length / 3 - 1;
  for (let i = 0; i < pointsPerRing; i++) {
    const next = (i + 1) % pointsPerRing;
    indices.push(topStart + i, dishStart + i, dishStart + next);
    indices.push(topStart + i, dishStart + next, topStart + next);
    indices.push(center, dishStart + next, dishStart + i);
  }
  geometry.setAttribute("position", new THREE.Float32BufferAttribute(positions, 3));
  geometry.setAttribute("uv", new THREE.Float32BufferAttribute(uvs, 2));
  geometry.setIndex(indices);
  geometry.addGroup(0, sideIndexCount, 1);
  geometry.addGroup(sideIndexCount, indices.length - sideIndexCount, 0);
  geometry.computeVertexNormals();
  geometry.computeBoundingSphere();
  return geometry;
}

const legendLoads = [];
function makeLegendTexture(label, techIndex) {
  const surface = document.createElement("canvas");
  surface.width = 256; surface.height = 256;
  const context = surface.getContext("2d");
  context.clearRect(0, 0, 256, 256);
  if (Number.isInteger(techIndex)) {
    context.fillStyle = keycapColors[techIndex];
    context.fillRect(0, 0, 256, 256);
    const texture = new THREE.CanvasTexture(surface);
    texture.colorSpace = THREE.SRGBColorSpace;
    texture.anisotropy = renderer.capabilities.getMaxAnisotropy();
    const logo = new Image();
    legendLoads.push(new Promise((resolve, reject) => {
      logo.onload = () => {
        try {
          const scale = Math.min(176 / logo.naturalWidth, 176 / logo.naturalHeight);
          const width = logo.naturalWidth * scale;
          const height = logo.naturalHeight * scale;
          context.drawImage(logo, (256 - width) / 2, (256 - height) / 2, width, height);
          texture.needsUpdate = true;
          resolve();
        } catch (error) {
          reject(error);
        }
      };
      logo.onerror = () => reject(new Error(`Could not load the ${technologies[techIndex].name} logo.`));
    }));
    logo.src = window.TechStackLogos.get(technologies[techIndex].name).src;
    return texture;
  }
  else if (label) {
    const modifiers = ["delete", "tab", "caps lock", "enter", "shift", "ctrl", "âŒ¥", "âŒ˜", "fn", ""];
    context.fillStyle = label === "Esc" ? "#fff7f0" : modifiers.includes(label) ? "#155c59" : ["â†‘", "â†", "â†“", "â†’"].includes(label) ? "#6b526d" : "#666a59";
    context.textAlign = "center"; context.textBaseline = "middle";
    const size = label.length > 4 ? 31 : label.length > 2 ? 37 : 54;
    context.font = `600 ${size}px Arial, sans-serif`;
    context.fillText(label, 128, 128);
  }
  const texture = new THREE.CanvasTexture(surface);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.anisotropy = renderer.capabilities.getMaxAnisotropy();
  return texture;
}

const logoKeys = [];
let selection = 0;
layout.forEach((row, rowIndex) => {
  const spacing = 0.04;
  const unit = 0.965;
  const total = row.reduce((sum, entry) => sum + entry[1] / 2 * unit, 0) + (row.length - 1) * spacing;
  let cursor = -total / 2;
  const z = rowIndex - 1;
  row.forEach(([label, halfUnits, techIndex]) => {
    const units = halfUnits / 2;
    const width = units * unit;
    const depth = 0.98;
    const isModifier = !Number.isInteger(techIndex) && ["delete", "tab", "caps lock", "enter", "shift", "ctrl", "fn", ""].includes(label);
    const isEscape = label === "Esc";
    const isArrow = ["â†‘", "â†", "â†“", "â†’"].includes(label);
    const isEmoji = ["ðŸ˜", "ðŸ˜†", "ðŸ˜Ž", "ðŸ™„"].includes(label);
    const topColor = Number.isInteger(techIndex) ? 0xffffff : isEscape ? 0xd66068 : isModifier ? 0x55c6bc : isArrow ? 0xd9bdd5 : isEmoji ? 0xf4e69d : 0xf2efd9;
    const sideColor = Number.isInteger(techIndex)
      ? new THREE.Color(keycapColors[techIndex]).multiplyScalar(0.92)
      : isEscape ? 0x9a3943 : isModifier ? 0x287f79 : isArrow ? 0x967991 : isEmoji ? 0xb6a757 : 0x827e68;
    const topMaterial = new THREE.MeshStandardMaterial({ color: topColor, map: makeLegendTexture(label, techIndex), roughness: 0.72, metalness: 0 });
    const sideMaterial = new THREE.MeshStandardMaterial({ color: sideColor, roughness: 0.82, metalness: 0 });
    const key = new THREE.Mesh(roundedKeyGeometry(width, depth), [topMaterial, sideMaterial]);
    key.position.set(cursor + units * unit / 2, seatedKeyY, z);
    addKeySocket(key.position.x, z, width, depth);
    key.castShadow = true;
    key.receiveShadow = true;
    key.userData.baseY = key.position.y;
    key.userData.techIndex = techIndex;
    key.userData.selected = false;
    keyboard.add(key);
    if (Number.isInteger(techIndex)) logoKeys.push(key);
    cursor += units * unit + spacing;
  });
});
addSocketPlate();

function addScrew(x, z) {
  const screw = new THREE.Mesh(new THREE.CylinderGeometry(0.045, 0.045, 0.025, 20), new THREE.MeshStandardMaterial({ color: 0x67716c, metalness: 0.8, roughness: 0.27 }));
  screw.position.set(x, 0.0725, z);
  screw.castShadow = true;
  board.add(screw);
}
addScrew(-3.1, -1.57); addScrew(3.1, -1.57); addScrew(-3.1, 1.57); addScrew(3.1, 1.57);

// Preserve the hero dimensions before applying the smaller desk scale.
const assembledBounds = new THREE.Box3().setFromObject(keyboard);
const keyboardBoundsCorners = [];
for (const x of [assembledBounds.min.x, assembledBounds.max.x]) {
  for (const y of [assembledBounds.min.y, assembledBounds.max.y]) {
    for (const z of [assembledBounds.min.z, assembledBounds.max.z]) {
      keyboardBoundsCorners.push(new THREE.Vector3(x, y, z));
    }
  }
}
const keyboardPoseCorner = new THREE.Vector3();
// The card's horizontal axis follows the keyboard, with its face tilted toward the viewer.
const infoCardAnchor = new THREE.Object3D();
infoCardAnchor.position.set(
  (assembledBounds.min.x + assembledBounds.max.x) / 2,
  assembledBounds.max.y + 0.6,
  assembledBounds.min.z + 0.35,
);
infoCardAnchor.rotation.x = -Math.atan2(cameraDirection.y, cameraDirection.z);
keyboard.add(infoCardAnchor);
const infoCardWorldWidth = (assembledBounds.max.x - assembledBounds.min.x) * 0.62;
const cardTopLeft = new THREE.Vector3();
const cardBottomLeft = new THREE.Vector3();
const cardBottomRight = new THREE.Vector3();

function updateInfoCardPose() {
  if (!infoCardWidth || !infoCardHeight) return;
  const width = canvas.clientWidth;
  const height = canvas.clientHeight;
  if (!width || !height) return;
  const worldWidth = infoCardWorldWidth * (window.innerWidth <= 680 ? 0.85 / 0.62 : 1);
  const worldHeight = worldWidth * infoCardHeight / infoCardWidth;
  infoCardAnchor.updateWorldMatrix(true, false);
  function projectCardPoint(point, x, y) {
    point.set(x, y, 0).applyMatrix4(infoCardAnchor.matrixWorld).project(camera);
    point.set((point.x + 1) * width / 2, (1 - point.y) * height / 2, point.z);
  }
  projectCardPoint(cardTopLeft, -worldWidth / 2, worldHeight);
  projectCardPoint(cardBottomLeft, -worldWidth / 2, 0);
  projectCardPoint(cardBottomRight, worldWidth / 2, 0);
  const a = (cardBottomRight.x - cardBottomLeft.x) / infoCardWidth;
  const b = (cardBottomRight.y - cardBottomLeft.y) / infoCardWidth;
  const c = (cardBottomLeft.x - cardTopLeft.x) / infoCardHeight;
  const d = (cardBottomLeft.y - cardTopLeft.y) / infoCardHeight;
  infoCard.style.setProperty("--tech-card-transform",
    `matrix(${a},${b},${c},${d},${cardTopLeft.x},${cardTopLeft.y})`);
  stage.classList.add("tech-card-tracked");
}

// The workstation is revealed as the keyboard travels into About.
const workspace = new THREE.Group();
workspace.scale.setScalar(0.001);
scene.add(workspace);
const deskTopY = 0.72;
const deskSurfaceY = deskTopY + 0.125 + 0.055 / 2;
const keyboardDeskScale = 0.55;
const keyboardDeskPosition = new THREE.Vector3(
  0, deskSurfaceY - assembledBounds.min.y * keyboardDeskScale + 0.01, -1.25,
);
const keyboardHoverHeight = 0.45;
const keyboardHoverPosition = keyboardDeskPosition.clone();
keyboardHoverPosition.y += keyboardHoverHeight;
const technologyKeyboardPosition = keyboardDeskPosition.clone();
technologyKeyboardPosition.z = 0.8;
const keyboardDeskTopY = keyboardDeskPosition.y + assembledBounds.max.y * keyboardDeskScale;
const deskMaterial = new THREE.MeshStandardMaterial({ color: 0x605a70, roughness: 0.58, metalness: 0.08 });
const deskEdgeMaterial = new THREE.MeshStandardMaterial({ color: 0x89819e, roughness: 0.48, metalness: 0.1 });
const charcoal = new THREE.MeshStandardMaterial({ color: 0x222720, roughness: 0.52, metalness: 0.28 });
const graphite = new THREE.MeshStandardMaterial({ color: 0x343b34, roughness: 0.5, metalness: 0.38 });
const monitorWhite = new THREE.MeshStandardMaterial({ color: 0xf5f7f6, roughness: 0.38, metalness: 0.08 });
const monitorTrim = new THREE.MeshStandardMaterial({ color: 0xd8dedb, roughness: 0.5, metalness: 0.12 });
const screenGlow = new THREE.MeshStandardMaterial({ color: 0x172b26, emissive: 0x1c624d, emissiveIntensity: 0.85, roughness: 0.3 });
const techScreenCanvas = document.createElement("canvas");
techScreenCanvas.width = 1024;
techScreenCanvas.height = 512;
const techScreenContext = techScreenCanvas.getContext("2d");
const techScreenTexture = new THREE.CanvasTexture(techScreenCanvas);
techScreenTexture.colorSpace = THREE.SRGBColorSpace;
techScreenTexture.anisotropy = Math.min(4, renderer.capabilities.getMaxAnisotropy());
screenGlow.map = techScreenTexture;
screenGlow.emissiveMap = techScreenTexture;
screenGlow.color.setHex(0xffffff);
screenGlow.emissive.setHex(0xffffff);
screenGlow.emissiveIntensity = 0.34;
screenGlow.needsUpdate = true;
const screenLogoImages = technologies.map(({ name }) => {
  const image = new Image();
  image.onload = () => drawTechnologyScreen(performance.now());
  image.src = window.TechStackLogos.get(name).src;
  return image;
});
const screenChipSize = 88;
const screenChipStep = 110;
const screenTrackWidth = screenLogoImages.length * screenChipStep;
let lastTechScreenFrame = -Infinity;
function drawTechnologyScreen(timestamp = 0) {
  const context = techScreenContext;
  const width = techScreenCanvas.width;
  context.clearRect(0, 0, width, techScreenCanvas.height);
  const background = context.createLinearGradient(0, 0, width, techScreenCanvas.height);
  background.addColorStop(0, "#0c1713");
  background.addColorStop(1, "#10251c");
  context.fillStyle = background;
  context.fillRect(0, 0, width, techScreenCanvas.height);
  context.strokeStyle = "rgba(195,238,154,.08)";
  context.lineWidth = 1;
  for (let x = 0; x < width; x += 40) {
    context.beginPath(); context.moveTo(x, 0); context.lineTo(x, 512); context.stroke();
  }
  context.fillStyle = "#b9ef83";
  context.font = "500 19px 'DM Mono', monospace";
  context.fillText("ZULFAHMI  /  TECHNOLOGY STACK", 56, 72);
  context.fillStyle = "#f0f5ea";
  context.font = "600 44px Manrope, sans-serif";
  context.fillText("Teknologi yang dikuasai", 56, 145);
  context.fillStyle = "#92a797";
  context.font = "20px 'DM Mono', monospace";
  context.fillText("TOOLS UNTUK MEMBANGUN IDE MENJADI NYATA", 56, 190);
  context.fillStyle = "#b9ef83";
  context.fillText("18 / 18  DIKUASAI", 56, 242);
  context.fillStyle = "rgba(185,239,131,.14)";
  context.fillRect(56, 267, width - 112, 1);
  context.save();
  context.beginPath(); context.rect(32, 294, width - 64, 150); context.clip();
  const offset = motionPreference.matches ? 0 : -((timestamp * 0.045) % screenTrackWidth);
  for (const start of [offset, offset + screenTrackWidth]) {
    let x = start;
    screenLogoImages.forEach((logo) => {
      if (x + screenChipSize > -20 && x < width + 20) {
        context.fillStyle = "#f2f2e9";
        context.beginPath(); context.roundRect(x, 314, screenChipSize, screenChipSize, 12);
        context.fill();
        if (logo.complete && logo.naturalWidth > 0) {
          const scale = Math.min(66 / logo.naturalWidth, 66 / logo.naturalHeight);
          const logoWidth = logo.naturalWidth * scale;
          const logoHeight = logo.naturalHeight * scale;
          context.drawImage(logo, x + (screenChipSize - logoWidth) / 2, 314 + (screenChipSize - logoHeight) / 2, logoWidth, logoHeight);
        }
      }
      x += screenChipStep;
    });
  }
  context.restore();
  context.fillStyle = "#738b78";
  context.font = "16px 'DM Mono', monospace";
  context.fillText("WEB  ·  BACKEND  ·  MOBILE  ·  DEPLOYMENT", 56, 465);
  techScreenTexture.needsUpdate = true;
}
drawTechnologyScreen();
const codeMint = new THREE.MeshStandardMaterial({ color: 0x8be6b2, emissive: 0x317c55, emissiveIntensity: 0.55, roughness: 0.55 });
const codeViolet = new THREE.MeshStandardMaterial({ color: 0xc1a9ee, emissive: 0x49347c, emissiveIntensity: 0.45, roughness: 0.55 });
// Small, tileable surface maps add pores and woven cloth without external assets.
function makeCharacterTexture(kind) {
  const surface = document.createElement("canvas");
  surface.width = surface.height = 256;
  const context = surface.getContext("2d");
  const pixels = context.createImageData(256, 256);
  let seed = kind === "skin" ? 1977 : 8311;
  for (let y = 0; y < 256; y += 1) {
    for (let x = 0; x < 256; x += 1) {
      seed = (Math.imul(seed, 1664525) + 1013904223) >>> 0;
      const noise = seed / 4294967296;
      const weave = (x % 4 < 2 ? 9 : -9) + (y % 4 < 2 ? 7 : -7);
      const value = kind === "skin" ? 177 + noise * 44 : 177 + weave + noise * 14;
      const index = (y * 256 + x) * 4;
      pixels.data[index] = pixels.data[index + 1] = pixels.data[index + 2] = value;
      pixels.data[index + 3] = 255;
    }
  }
  context.putImageData(pixels, 0, 0);
  const texture = new THREE.CanvasTexture(surface);
  texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(kind === "skin" ? 2 : 3, kind === "skin" ? 2 : 3);
  texture.anisotropy = Math.min(4, renderer.capabilities.getMaxAnisotropy());
  return texture;
}
const skinTexture = makeCharacterTexture("skin");
const fabricTexture = makeCharacterTexture("fabric");
const shirtMaterial = new THREE.MeshStandardMaterial({ color: 0x667d71, roughness: 0.92, bumpMap: fabricTexture, bumpScale: 0.008 });
const shirtLight = new THREE.MeshStandardMaterial({ color: 0x72897c, roughness: 0.94, bumpMap: fabricTexture, bumpScale: 0.008 });
const shirtSeam = new THREE.MeshStandardMaterial({ color: 0x4c6459, roughness: 0.96 });
const skinMaterial = new THREE.MeshPhysicalMaterial({
  color: 0xc99475, roughness: 0.62, metalness: 0,
  bumpMap: skinTexture, bumpScale: 0.003,
  clearcoat: 0.06, clearcoatRoughness: 0.85,
});
const skinWarm = skinMaterial.clone();
skinWarm.color.setHex(0xbd8064);
const lipsMaterial = new THREE.MeshStandardMaterial({ color: 0x99665b, roughness: 0.72 });
const nailsMaterial = new THREE.MeshStandardMaterial({ color: 0xd8ab91, roughness: 0.45 });
const pantsMaterial = new THREE.MeshStandardMaterial({ color: 0x303c43, roughness: 0.96, bumpMap: fabricTexture, bumpScale: 0.01 });
const hatMaterial = new THREE.MeshStandardMaterial({ color: 0x293d38, roughness: 0.9, bumpMap: fabricTexture, bumpScale: 0.008 });
const hairMaterial = new THREE.MeshStandardMaterial({ color: 0x29231f, roughness: 0.96, bumpMap: fabricTexture, bumpScale: 0.007 });
const eyeMaterial = new THREE.MeshStandardMaterial({ color: 0x171a19, roughness: 0.28 });
const eyeWhite = new THREE.MeshStandardMaterial({ color: 0xece4d9, roughness: 0.3 });
const irisMaterial = new THREE.MeshStandardMaterial({ color: 0x5b4430, roughness: 0.25 });
const shoeMaterial = new THREE.MeshStandardMaterial({ color: 0xe5e8df, roughness: 0.77, bumpMap: fabricTexture, bumpScale: 0.006 });
const typingHands = [];

function makeBox(parent, size, position, material, castShadow = true) {
  const mesh = new THREE.Mesh(new THREE.BoxGeometry(...size), material);
  mesh.position.set(...position);
  mesh.castShadow = castShadow;
  mesh.receiveShadow = true;
  parent.add(mesh);
  return mesh;
}

function makeSphere(parent, radius, position, material, scale = [1, 1, 1]) {
  const mesh = new THREE.Mesh(new THREE.SphereGeometry(radius, 16, 12), material);
  mesh.position.set(...position);
  mesh.scale.set(...scale);
  mesh.castShadow = true;
  parent.add(mesh);
  return mesh;
}

function makeCylinder(parent, radiusTop, radiusBottom, height, position, material, segments = 16) {
  const mesh = new THREE.Mesh(new THREE.CylinderGeometry(radiusTop, radiusBottom, height, segments), material);
  mesh.position.set(...position);
  mesh.castShadow = true;
  mesh.receiveShadow = true;
  parent.add(mesh);
  return mesh;
}

function makeLimb(parent, start, end, radiusStart, radiusEnd, material) {
  const from = new THREE.Vector3(...start);
  const to = new THREE.Vector3(...end);
  const direction = to.clone().sub(from);
  const mesh = new THREE.Mesh(
    new THREE.CylinderGeometry(radiusEnd, radiusStart, direction.length(), 12),
    material,
  );
  mesh.position.copy(from).add(to).multiplyScalar(0.5);
  mesh.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), direction.normalize());
  mesh.castShadow = true;
  mesh.receiveShadow = true;
  parent.add(mesh);
  return mesh;
}

// Keep the left edge close to the lamp base, with the legs inset from each end.
const deskLeftX = -4.65;
const deskRightX = 5.9;
const deskWidth = deskRightX - deskLeftX;
const deskCenterX = (deskLeftX + deskRightX) / 2;
const deskLegXs = [deskLeftX + 0.65, deskRightX - 0.65];
const deskGroup = new THREE.Group();
workspace.add(deskGroup);
makeBox(deskGroup, [deskWidth, 0.2, 4.3], [deskCenterX, deskTopY, -0.3], deskMaterial);
makeBox(deskGroup, [deskWidth - 0.15, 0.055, 4.16], [deskCenterX, deskTopY + 0.125, -0.3], deskEdgeMaterial, false);
for (const x of deskLegXs) {
  for (const z of [-1.95, 1.35]) {
    makeBox(deskGroup, [0.2, 1.2, 0.2], [x, 0.02, z], graphite);
  }
}
makeBox(deskGroup, [deskLegXs[1] - deskLegXs[0] - 0.1, 0.18, 0.18], [deskCenterX, 0.17, -1.78], graphite);

const mouseBodyMaterial = new THREE.MeshStandardMaterial({ color: 0x15191f, roughness: 0.34, metalness: 0.34 });
const mouseTopMaterial = new THREE.MeshStandardMaterial({ color: 0x293039, roughness: 0.3, metalness: 0.24 });
const mouseButtonMaterial = new THREE.MeshStandardMaterial({ color: 0x20262d, roughness: 0.28, metalness: 0.2 });
const mouseWheelMaterial = new THREE.MeshStandardMaterial({ color: 0x090c11, roughness: 0.58, metalness: 0.08 });
const mouseRgbCyan = new THREE.MeshBasicMaterial({ color: 0x46eaff, toneMapped: false });
const mouseRgbPink = new THREE.MeshBasicMaterial({ color: 0xff4fbc, toneMapped: false });
const mouseRgbLime = new THREE.MeshBasicMaterial({ color: 0xc6ff6a, toneMapped: false });
const mouseMaterials = [
  mouseBodyMaterial, mouseTopMaterial, mouseButtonMaterial, mouseWheelMaterial,
  mouseRgbCyan, mouseRgbPink, mouseRgbLime,
];
const computerMouse = new THREE.Group();
computerMouse.position.set(2.45, deskSurfaceY + 0.055, 0.76);
const computerMouseHomePosition = computerMouse.position.clone();
deskGroup.add(computerMouse);
function makeMousePlate(points, depth, material, y = 0, bevel = false) {
  const shape = new THREE.Shape();
  shape.moveTo(points[0][0], points[0][1]);
  points.slice(1).forEach(([x, z]) => shape.lineTo(x, z));
  shape.closePath();
  const geometry = new THREE.ExtrudeGeometry(shape, {
    depth,
    bevelEnabled: bevel,
    bevelSegments: bevel ? 3 : 1,
    bevelSize: bevel ? 0.012 : 0,
    bevelThickness: bevel ? 0.012 : 0,
    curveSegments: 8,
  });
  geometry.rotateX(-Math.PI / 2);
  const plate = new THREE.Mesh(geometry, material);
  plate.position.y = y;
  plate.castShadow = true;
  plate.receiveShadow = true;
  computerMouse.add(plate);
  return plate;
}
const mouseOutline = [
  [0, 0.28], [0.1, 0.23], [0.16, 0.12], [0.18, -0.06],
  [0.15, -0.2], [0.09, -0.26], [0, -0.29], [-0.09, -0.26],
  [-0.15, -0.2], [-0.18, -0.06], [-0.16, 0.12], [-0.1, 0.23],
];
makeMousePlate(mouseOutline, 0.105, mouseBodyMaterial, 0, true);
makeMousePlate([
  [0, 0.236], [0.082, 0.199], [0.133, 0.105], [0.145, -0.045],
  [0.12, -0.177], [0.07, -0.222], [0, -0.247], [-0.07, -0.222],
  [-0.12, -0.177], [-0.145, -0.045], [-0.133, 0.105], [-0.082, 0.199],
], 0.009, mouseTopMaterial, 0.105);
makeMousePlate([[0, 0.232], [0.078, 0.198], [0.09, 0.055], [0.006, 0.045]],
  0.008, mouseButtonMaterial, 0.115);
makeMousePlate([[0, 0.232], [-0.078, 0.198], [-0.09, 0.055], [-0.006, 0.045]],
  0.008, mouseButtonMaterial, 0.115);
const mouseWheel = makeCylinder(computerMouse, 0.027, 0.027, 0.09,
  [0, 0.143, -0.04], mouseWheelMaterial, 16);
mouseWheel.rotation.z = Math.PI / 2;
function addMouseRgb(points, material) {
  const curve = new THREE.CatmullRomCurve3(points.map(([x, y, z]) => new THREE.Vector3(x, y, z)));
  const strip = new THREE.Mesh(new THREE.TubeGeometry(curve, 24, 0.012, 8, false), material);
  strip.castShadow = false;
  computerMouse.add(strip);
}
addMouseRgb([[-0.145, 0.046, 0.18], [-0.17, 0.046, 0.08], [-0.17, 0.046, -0.08], [-0.12, 0.046, -0.2]], mouseRgbCyan);
addMouseRgb([[0.145, 0.046, 0.18], [0.17, 0.046, 0.08], [0.17, 0.046, -0.08], [0.12, 0.046, -0.2]], mouseRgbPink);
addMouseRgb([[-0.08, 0.04, 0.225], [0, 0.04, 0.255], [0.08, 0.04, 0.225]], mouseRgbLime);
// RGB light tucked under the shell, with a soft three-color reflection on the desk.
addMouseRgb([[-0.12, -0.017, -0.2], [-0.165, -0.017, -0.07], [-0.155, -0.017, 0.12], [-0.09, -0.017, 0.23]], mouseRgbCyan);
addMouseRgb([[0.12, -0.017, -0.2], [0.165, -0.017, -0.07], [0.155, -0.017, 0.12], [0.09, -0.017, 0.23]], mouseRgbPink);
addMouseRgb([[-0.09, -0.017, 0.23], [0, -0.017, 0.265], [0.09, -0.017, 0.23]], mouseRgbLime);
const mouseGlowCanvas = document.createElement("canvas");
mouseGlowCanvas.width = mouseGlowCanvas.height = 256;
const mouseGlowContext = mouseGlowCanvas.getContext("2d");
mouseGlowContext.globalCompositeOperation = "lighter";
[
  [74, 126, "70, 234, 255"],
  [182, 126, "255, 79, 188"],
  [128, 170, "198, 255, 106"],
].forEach(([x, y, color]) => {
  const gradient = mouseGlowContext.createRadialGradient(x, y, 6, x, y, 105);
  gradient.addColorStop(0, `rgba(${color}, 0.5)`);
  gradient.addColorStop(0.45, `rgba(${color}, 0.18)`);
  gradient.addColorStop(1, `rgba(${color}, 0)`);
  mouseGlowContext.fillStyle = gradient;
  mouseGlowContext.fillRect(0, 0, 256, 256);
});
const mouseGlowTexture = new THREE.CanvasTexture(mouseGlowCanvas);
mouseGlowTexture.colorSpace = THREE.SRGBColorSpace;
const mouseGlowMaterial = new THREE.MeshBasicMaterial({
  map: mouseGlowTexture, transparent: true, opacity: 0,
  blending: THREE.AdditiveBlending, depthWrite: false, toneMapped: false,
});
const mouseGlow = new THREE.Mesh(new THREE.PlaneGeometry(0.95, 1.05), mouseGlowMaterial);
mouseGlow.rotation.x = -Math.PI / 2;
mouseGlow.position.set(computerMouseHomePosition.x, deskSurfaceY + 0.006, computerMouseHomePosition.z);
mouseGlow.renderOrder = 1;
deskGroup.add(mouseGlow);

// The screen faces the character (-Z), with the keyboard between him and the monitor.
const monitor = new THREE.Group();
monitor.position.set(0, deskSurfaceY, 0.55);
monitor.scale.set(1.65, 1.45, 1);
monitor.rotation.y = Math.PI;
workspace.add(monitor);
const monitorCurveRadius = 3.8;

function monitorCurveDepth(x) {
  return monitorCurveRadius - Math.sqrt(monitorCurveRadius ** 2 - x ** 2);
}

function makeCurvedMonitorPanel(size, position, material, castShadow = true) {
  const segments = Math.max(2, Math.ceil(size[0] * 6) * 2);
  const geometry = new THREE.BoxGeometry(...size, segments, 1, 1);
  const vertices = geometry.getAttribute("position");
  for (let i = 0; i < vertices.count; i += 1) {
    const x = vertices.getX(i) + position[0];
    vertices.setZ(i, vertices.getZ(i) + monitorCurveDepth(x));
  }
  geometry.computeVertexNormals();
  geometry.computeBoundingBox();
  geometry.computeBoundingSphere();
  const panel = new THREE.Mesh(geometry, material);
  panel.position.set(...position);
  panel.castShadow = castShadow;
  panel.receiveShadow = true;
  monitor.add(panel);
  return panel;
}

// Bend all panel details along the same arc; the edges wrap toward the character.
const monitorShell = makeCurvedMonitorPanel([3.7, 2.0, 0.22], [0, 1.85, 0.12], monitorWhite);
const monitorDisplay = makeCurvedMonitorPanel([3.43, 1.74, 0.035], [0, 1.85, 0.265], screenGlow, false);
makeBox(monitor, [0.14, 1.02, 0.18], [0, 0.69, 0], monitorWhite);
makeBox(monitor, [1.55, 0.12, 0.78], [0, 0.06, 0], monitorWhite);
const monitorCodeDetails = [];
for (let i = 0; i < 7; i += 1) {
  const y = 2.48 - i * 0.22;
  monitorCodeDetails.push(makeCurvedMonitorPanel(
    [0.1, 0.055, 0.025], [-1.48, y, 0.29], i % 2 ? codeViolet : codeMint, false,
  ));
  monitorCodeDetails.push(makeCurvedMonitorPanel(
    [0.72 + (i % 3) * 0.18, 0.045, 0.025], [-0.92 + (i % 2) * 0.2, y, 0.29],
    i % 2 ? codeMint : codeViolet, false,
  ));
}
monitorCodeDetails.push(makeCurvedMonitorPanel([0.46, 0.12, 0.025], [1.28, 1.16, 0.29], codeMint, false));
// Rear cover and vents remain visible from the front-of-desk camera.
makeCurvedMonitorPanel([2.65, 0.35, 0.028], [0, 1.85, -0.006], monitorTrim, false);
for (let i = 0; i < 7; i += 1) {
  makeCurvedMonitorPanel([0.06, 0.22, 0.012], [-0.6 + i * 0.2, 1.43, -0.012], monitorTrim, false);
}

// An articulated desk lamp reaches from the left side to the monitor's center.
const deskLamp = new THREE.Group();
deskLamp.position.set(-3.8, deskSurfaceY, monitor.position.z);
workspace.add(deskLamp);
const lampMetal = new THREE.MeshStandardMaterial({ color: 0x87948e, roughness: 0.3, metalness: 0.75 });
// Keep the LED bright independently of the scene's ambient illumination.
const lampGlow = new THREE.MeshBasicMaterial({ color: 0x8bd0ff, toneMapped: false });
const monitorTopY = monitor.position.y
  + (monitorShell.position.y + monitorShell.geometry.parameters.height / 2) * monitor.scale.y;
const lampHeadPosition = new THREE.Vector3(
  monitor.position.x - deskLamp.position.x,
  monitorTopY + 0.55 - deskLamp.position.y,
  -0.12,
);
const lampBarHeight = 0.17;
const lampBarBevel = 0.015;
const lampBarTopY = lampHeadPosition.y + lampBarHeight / 2 + lampBarBevel;
const lampMountHeight = 0.055;
const lampBaseJoint = [0, 0.28, 0];
// Both ends of the upper arm sit above the entire bar, including the lower rail.
const lampElbow = [-0.28, lampHeadPosition.y + 0.56, 0];
const lampHeadJoint = [lampHeadPosition.x, lampHeadPosition.y + 0.44, lampHeadPosition.z];
makeCylinder(deskLamp, 0.48, 0.54, 0.14, [0, 0.08, 0], monitorWhite, 32);
makeCylinder(deskLamp, 0.39, 0.43, 0.025, [0, 0.165, 0], monitorTrim, 32);
makeCylinder(deskLamp, 0.12, 0.14, 0.16, [0, 0.23, 0], lampMetal, 24);

// Paired arms and round hinges give the lamp a clear elbow silhouette.
for (const offset of [-0.085, 0.085]) {
  makeLimb(deskLamp,
    [lampBaseJoint[0], lampBaseJoint[1], offset],
    [lampElbow[0], lampElbow[1], offset], 0.055, 0.05, monitorWhite);
  makeLimb(deskLamp,
    [lampElbow[0], lampElbow[1] + offset, lampElbow[2]],
    [lampHeadJoint[0], lampHeadJoint[1] + offset, lampHeadJoint[2]], 0.05, 0.045, monitorWhite);
}
for (const joint of [lampBaseJoint, lampElbow, lampHeadJoint]) {
  const hinge = makeCylinder(deskLamp, 0.14, 0.14, 0.25, joint, lampMetal, 24);
  hinge.rotation.x = Math.PI / 2;
  const bolt = makeCylinder(deskLamp, 0.062, 0.062, 0.027,
    [joint[0], joint[1], joint[2] + 0.14], charcoal, 16);
  bolt.rotation.x = Math.PI / 2;
}
const springPoints = [];
for (let step = 0; step <= 80; step += 1) {
  const progress = step / 80;
  const y = 0.65 + progress * 0.8;
  const angle = progress * Math.PI * 2 * 10;
  springPoints.push(new THREE.Vector3(
    lampElbow[0] * y / lampElbow[1] - 0.1 + Math.cos(angle) * 0.05,
    y, 0.14 + Math.sin(angle) * 0.05,
  ));
}
const lampSpring = new THREE.Mesh(
  new THREE.TubeGeometry(new THREE.CatmullRomCurve3(springPoints), 160, 0.012, 6, false), lampMetal,
);
deskLamp.add(lampSpring);
// The neck connects the bottom of the hinge to a mounting pad on the housing.
const lampMountTopY = lampBarTopY + lampMountHeight;
makeBox(deskLamp, [0.24, lampMountHeight, 0.2],
  [lampHeadPosition.x, lampBarTopY + lampMountHeight / 2, lampHeadPosition.z], lampMetal);
makeLimb(deskLamp,
  [lampHeadJoint[0], lampHeadJoint[1] - 0.14, lampHeadJoint[2]],
  [lampHeadPosition.x, lampMountTopY, lampHeadPosition.z], 0.055, 0.065, lampMetal);
// A slim horizontal LED bar, centered above the screen.
const lampBarWidth = monitorShell.geometry.parameters.width * monitor.scale.x * 0.64;
const lampBarGeometry = new THREE.ExtrudeGeometry(roundedShape(lampBarWidth, 0.36, 0.085), {
  depth: lampBarHeight, bevelEnabled: true, bevelSize: lampBarBevel,
  bevelThickness: lampBarBevel, bevelSegments: 3, curveSegments: 12,
});
lampBarGeometry.rotateX(-Math.PI / 2);
lampBarGeometry.translate(0, -lampBarHeight / 2, 0);
const lampBar = new THREE.Mesh(lampBarGeometry, monitorWhite);
lampBar.position.copy(lampHeadPosition);
lampBar.castShadow = lampBar.receiveShadow = true;
deskLamp.add(lampBar);
makeBox(deskLamp, [lampBarWidth - 0.2, 0.025, 0.285],
  [lampHeadPosition.x, lampHeadPosition.y - 0.094, lampHeadPosition.z], monitorTrim);
const lampDiffuser = makeBox(deskLamp, [lampBarWidth - 0.26, 0.016, 0.24],
  [lampHeadPosition.x, lampHeadPosition.y - 0.114, lampHeadPosition.z], lampGlow, false);
lampDiffuser.castShadow = lampDiffuser.receiveShadow = false;
// This exposed front strip remains visible from the elevated camera.
const lampFrontStrip = makeBox(deskLamp, [lampBarWidth - 0.26, 0.065, 0.018],
  [lampHeadPosition.x, lampHeadPosition.y - 0.032, lampHeadPosition.z + 0.206], lampGlow, false);
lampFrontStrip.receiveShadow = false;
// Keep the halo on the bar's X axis so its glow follows the bar in perspective.
const lampHaloCanvas = document.createElement("canvas");
lampHaloCanvas.width = 128;
lampHaloCanvas.height = 64;
const lampHaloContext = lampHaloCanvas.getContext("2d");
lampHaloContext.scale(2, 1);
const lampHaloGradient = lampHaloContext.createRadialGradient(32, 32, 0, 32, 32, 32);
lampHaloGradient.addColorStop(0, "rgba(255, 255, 255, 0.95)");
lampHaloGradient.addColorStop(0.35, "rgba(255, 255, 255, 0.5)");
lampHaloGradient.addColorStop(0.75, "rgba(255, 255, 255, 0.12)");
lampHaloGradient.addColorStop(1, "rgba(255, 255, 255, 0)");
lampHaloContext.fillStyle = lampHaloGradient;
lampHaloContext.fillRect(0, 0, 64, 64);
const lampHalo = new THREE.Mesh(
  new THREE.PlaneGeometry(lampBarWidth + 0.8, 0.7),
  new THREE.MeshBasicMaterial({
    map: new THREE.CanvasTexture(lampHaloCanvas), color: 0x78baff,
    transparent: true, opacity: 0.85, blending: THREE.AdditiveBlending,
    depthWrite: false, side: THREE.DoubleSide, toneMapped: false,
  }),
);
lampHalo.position.set(lampHeadPosition.x, lampHeadPosition.y - 0.032, lampHeadPosition.z + 0.235);
lampHalo.renderOrder = 2;
deskLamp.add(lampHalo);
makeBox(deskLamp, [0.14, 0.018, 0.1],
  [lampHeadPosition.x + lampBarWidth / 2 - 0.3, lampHeadPosition.y + 0.108, lampHeadPosition.z], charcoal);

// Distribute parallel downward lights along the LED instead of one angled spot.
const deskLampLights = [-0.36, 0, 0.36].map((offset) => {
  const light = new THREE.SpotLight(0x79b6ff, 0, 10, Math.PI / 8, 0.95, 2);
  light.position.set(
    lampHeadPosition.x + offset * (lampBarWidth - 0.26),
    lampHeadPosition.y - 0.15,
    lampHeadPosition.z,
  );
  const target = new THREE.Object3D();
  target.position.set(light.position.x, 0.02, light.position.z);
  deskLamp.add(light, target);
  light.target = target;
  return light;
});

// White gaming tower: open chassis, glass windows, and visible RGB components.
const gamingPC = new THREE.Group();
gamingPC.position.set(4.55, deskSurfaceY, -1.1);
workspace.add(gamingPC);
const gamingFanRotors = [];
const rgbColors = [0x42d9ff, 0x8261ff, 0xff55c4, 0xff9c58, 0xe3fb71, 0x56efae];
const rgbMaterials = rgbColors.map((color) => new THREE.MeshStandardMaterial({
  color, emissive: color, emissiveIntensity: 1.25,
  roughness: 0.3, metalness: 0.08, toneMapped: false,
}));
const pcInterior = new THREE.MeshStandardMaterial({ color: 0x121923, roughness: 0.58, metalness: 0.22 });
const pcMetal = new THREE.MeshStandardMaterial({ color: 0x637386, roughness: 0.34, metalness: 0.7 });
const pcGlass = new THREE.MeshStandardMaterial({
  color: 0xb5d4eb, transparent: true, opacity: 0.13,
  roughness: 0.12, metalness: 0.12, depthWrite: false, side: THREE.DoubleSide,
});

function makeGamingCap(position, ventilated = false) {
  const width = 2.05, depth = 2.4, height = 0.18, cut = 0.16;
  const outline = new THREE.Shape();
  outline.moveTo(-width / 2 + cut, -depth / 2);
  outline.lineTo(width / 2 - cut, -depth / 2);
  outline.lineTo(width / 2, -depth / 2 + cut);
  outline.lineTo(width / 2, depth / 2 - cut);
  outline.lineTo(width / 2 - cut, depth / 2);
  outline.lineTo(-width / 2 + cut, depth / 2);
  outline.lineTo(-width / 2, depth / 2 - cut);
  outline.lineTo(-width / 2, -depth / 2 + cut);
  outline.closePath();
  if (ventilated) {
    for (const z of [-0.55, 0.45]) {
      const opening = new THREE.Path();
      opening.absarc(0, -z, 0.43, 0, Math.PI * 2, true);
      outline.holes.push(opening);
    }
  }
  const geometry = new THREE.ExtrudeGeometry(outline, {
    depth: height, bevelEnabled: true, bevelSegments: 2,
    bevelSize: 0.02, bevelThickness: 0.02, steps: 1,
  });
  geometry.rotateX(-Math.PI / 2);
  geometry.translate(0, -height / 2, 0);
  const cap = new THREE.Mesh(geometry, monitorWhite);
  cap.position.set(...position);
  cap.castShadow = true;
  cap.receiveShadow = true;
  gamingPC.add(cap);
}

// Chamfered top and base, slim corner rails, and a dark motherboard tray.
makeGamingCap([0, 0.2, 0]);
makeGamingCap([0, 3.72, 0], true);
for (const x of [-0.88, 0.88]) {
  for (const z of [-1.1, 1.1]) {
    makeBox(gamingPC, [0.12, 3.36, 0.12], [x, 1.96, z], monitorWhite);
  }
}
for (const x of [-0.7, 0.7]) {
  for (const z of [-0.82, 0.82]) {
    makeBox(gamingPC, [0.28, 0.1, 0.34], [x, 0.05, z], pcInterior);
  }
}
makeBox(gamingPC, [1.74, 3.32, 0.06], [0, 1.95, -1.1], pcInterior);
makeBox(gamingPC, [0.08, 3.3, 2.07], [0.88, 1.96, 0], monitorWhite);
makeBox(gamingPC, [0.075, 2.66, 1.8], [0.57, 2.18, -0.13], pcInterior);

function makeGamingFan(radius, position, rotation = [0, 0, 0]) {
  const fan = new THREE.Group();
  fan.position.set(...position);
  fan.rotation.set(...rotation);
  gamingPC.add(fan);

  const housing = new THREE.Mesh(new THREE.TorusGeometry(radius + 0.035, 0.035, 8, 32), pcInterior);
  fan.add(housing);
  const sectorAngle = Math.PI * 2 / rgbMaterials.length;
  rgbMaterials.forEach((material, index) => {
    const ring = new THREE.Mesh(new THREE.TorusGeometry(radius, 0.036, 8, 10, sectorAngle - 0.025), material);
    ring.rotation.z = index * sectorAngle;
    ring.position.z = 0.045;
    fan.add(ring);
  });

  const halo = new THREE.Mesh(new THREE.TorusGeometry(radius, 0.075, 8, 32), new THREE.MeshBasicMaterial({
    color: rgbColors[gamingFanRotors.length % rgbColors.length],
    transparent: true, opacity: 0.16, blending: THREE.AdditiveBlending, depthWrite: false,
  }));
  halo.position.z = 0.035;
  halo.renderOrder = 2;
  fan.add(halo);

  const rotor = new THREE.Group();
  const bladeShape = new THREE.Shape();
  bladeShape.moveTo(radius * 0.2, -radius * 0.06);
  bladeShape.lineTo(radius * 0.83, -radius * 0.27);
  bladeShape.quadraticCurveTo(radius * 0.98, 0, radius * 0.66, radius * 0.3);
  bladeShape.lineTo(radius * 0.18, radius * 0.1);
  bladeShape.closePath();
  const bladeGeometry = new THREE.ExtrudeGeometry(bladeShape, { depth: 0.025, bevelEnabled: false, curveSegments: 4 });
  for (let blade = 0; blade < 7; blade += 1) {
    const mesh = new THREE.Mesh(bladeGeometry, pcMetal);
    mesh.rotation.z = blade * Math.PI * 2 / 7;
    rotor.add(mesh);
  }
  fan.add(rotor);
  gamingFanRotors.push(rotor);
  makeSphere(fan, radius * 0.21, [0, 0, 0.065], monitorTrim, [1, 1, 0.45]);
  makeSphere(fan, radius * 0.065, [0, 0, 0.105], rgbMaterials[0], [1, 1, 0.35]);
}

// Three rainbow intake fans and two upward-facing radiator fans.
for (const y of [0.85, 1.96, 3.07]) makeGamingFan(0.48, [0, y, 1.105]);
makeBox(gamingPC, [1.55, 0.1, 1.96], [0, 3.41, -0.04], pcInterior);
for (const z of [-0.55, 0.45]) makeGamingFan(0.37, [0, 3.5, z], [-Math.PI / 2, 0, 0]);

// GPU, RGB RAM, CPU cooler, and coolant tubes are visible through the side glass.
makeBox(gamingPC, [1.45, 0.24, 1.6], [-0.03, 1.17, -0.16], pcMetal);
makeBox(gamingPC, [1.4, 0.12, 1.53], [-0.03, 1.32, -0.16], pcInterior);
for (const z of [-0.55, 0.22]) makeGamingFan(0.23, [-0.79, 1.18, z], [0, -Math.PI / 2, 0]);
rgbMaterials.forEach((material, index) => {
  makeBox(gamingPC, [0.035, 0.04, 0.21], [-0.77, 1.4, -0.79 + index * 0.24], material, false);
  makeBox(gamingPC, [0.032, 0.42, 0.025], [-0.78, 0.56 + index * 0.48, 1.195], material, false);
});
for (let slot = 0; slot < 3; slot += 1) {
  const z = -0.04 + slot * 0.22;
  makeBox(gamingPC, [0.1, 0.95, 0.12], [0.41, 2.38, z], monitorWhite);
  makeBox(gamingPC, [0.025, 0.82, 0.065], [0.345, 2.42, z], rgbMaterials[slot * 2], false);
}
makeBox(gamingPC, [0.31, 0.54, 0.6], [0.28, 2.43, -0.54], monitorWhite);
const coolerRing = new THREE.Mesh(new THREE.TorusGeometry(0.2, 0.03, 8, 24), rgbMaterials[0]);
coolerRing.rotation.y = -Math.PI / 2;
coolerRing.position.set(0.11, 2.43, -0.54);
gamingPC.add(coolerRing);
for (const offset of [-0.09, 0.09]) {
  const curve = new THREE.CatmullRomCurve3([
    new THREE.Vector3(0.27, 2.67, -0.54 + offset),
    new THREE.Vector3(0.07, 2.93, -0.7 + offset),
    new THREE.Vector3(-0.17, 3.16, -0.79 + offset),
    new THREE.Vector3(-0.3, 3.39, -0.79 + offset),
  ]);
  const tube = new THREE.Mesh(new THREE.TubeGeometry(curve, 20, 0.033, 8, false), pcInterior);
  tube.castShadow = true;
  gamingPC.add(tube);
}

// Glass is drawn after the interior, keeping the components visible.
const pcFrontGlass = makeBox(gamingPC, [1.72, 3.36, 0.025], [0, 1.96, 1.215], pcGlass, false);
const pcSideGlass = makeBox(gamingPC, [0.025, 3.34, 2.08], [-0.98, 1.96, 0], pcGlass, false);
pcFrontGlass.renderOrder = 3;
pcSideGlass.renderOrder = 3;
makeCylinder(gamingPC, 0.085, 0.085, 0.022, [0.58, 3.835, 0.76], rgbMaterials[0]);
for (const x of [-0.22, 0.1]) makeBox(gamingPC, [0.18, 0.022, 0.075], [x, 3.825, 0.8], pcInterior, false);

// Smooth anatomical surfaces, with shared geometry for the small body details.
const humanOvalGeometry = new THREE.SphereGeometry(1, 32, 24);
function makeHumanOval(parent, position, scale, material) {
  const mesh = new THREE.Mesh(humanOvalGeometry, material);
  mesh.position.set(...position);
  mesh.scale.set(...scale);
  mesh.castShadow = mesh.receiveShadow = true;
  parent.add(mesh);
  return mesh;
}

function makeHumanSegment(parent, start, end, radiusStart, radiusEnd, material) {
  const from = new THREE.Vector3(...start);
  const to = new THREE.Vector3(...end);
  const direction = to.clone().sub(from);
  const length = direction.length();
  const profile = [
    [0, -0.5], [radiusStart * 0.72, -0.46], [radiusStart, -0.32],
    [(radiusStart + radiusEnd) * 0.51, 0], [radiusEnd, 0.32],
    [radiusEnd * 0.72, 0.46], [0, 0.5],
  ].map(([radius, y]) => new THREE.Vector2(radius, y * length));
  const mesh = new THREE.Mesh(new THREE.LatheGeometry(profile, 24), material);
  mesh.position.copy(from).add(to).multiplyScalar(0.5);
  mesh.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), direction.normalize());
  mesh.castShadow = mesh.receiveShadow = true;
  parent.add(mesh);
  return mesh;
}

function makeHumanContour(parent, points, radius, material) {
  const curve = new THREE.CatmullRomCurve3(points.map((point) => new THREE.Vector3(...point)));
  const mesh = new THREE.Mesh(new THREE.TubeGeometry(curve, Math.max(8, points.length * 4), radius, 8, false), material);
  mesh.castShadow = mesh.receiveShadow = true;
  parent.add(mesh);
  return mesh;
}

function makeHumanTorso(parent, profiles, material) {
  const sides = 32;
  const positions = [], uvs = [], indices = [];
  profiles.forEach(([y, width, depth, z], row) => {
    for (let side = 0; side <= sides; side += 1) {
      const angle = side / sides * Math.PI * 2;
      positions.push(Math.sin(angle) * width, y, z + Math.cos(angle) * depth);
      uvs.push(side / sides, row / (profiles.length - 1));
      if (row < profiles.length - 1 && side < sides) {
        const a = row * (sides + 1) + side, b = a + 1, c = a + sides + 1, d = c + 1;
        indices.push(a, b, c, b, d, c);
      }
    }
  });
  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute("position", new THREE.Float32BufferAttribute(positions, 3));
  geometry.setAttribute("uv", new THREE.Float32BufferAttribute(uvs, 2));
  geometry.setIndex(indices);
  geometry.computeVertexNormals();
  // Share the seam normals so the back of the shirt has no lighting discontinuity.
  const normals = geometry.getAttribute("normal");
  for (let row = 0; row < profiles.length; row += 1) {
    const first = row * (sides + 1), last = first + sides;
    const normal = new THREE.Vector3().fromBufferAttribute(normals, first)
      .add(new THREE.Vector3().fromBufferAttribute(normals, last)).normalize();
    normals.setXYZ(first, normal.x, normal.y, normal.z);
    normals.setXYZ(last, normal.x, normal.y, normal.z);
  }
  const mesh = new THREE.Mesh(geometry, material);
  mesh.castShadow = mesh.receiveShadow = true;
  parent.add(mesh);
  return mesh;
}

// A seated man in a fabric cap, leaning naturally toward the keyboard.
const characterScale = 1.5;
const characterFloorY = -0.58;
const characterSeatZ = -3.42;
const characterGroup = new THREE.Group();
characterGroup.scale.setScalar(characterScale);
// Enlarge around the seated position while keeping the feet at floor level.
characterGroup.position.set(
  0, characterFloorY * (1 - characterScale),
  0.5 + characterSeatZ * (1 - characterScale),
);
workspace.add(characterGroup);
makeHumanOval(characterGroup, [0, 0.12, -3.66], [0.7, 0.13, 0.58], charcoal);
makeHumanOval(characterGroup, [0, 1.2, -4.18], [0.68, 1.01, 0.14], graphite);
makeCylinder(characterGroup, 0.09, 0.09, 0.65, [0, -0.23, -3.66], graphite);
for (let i = 0; i < 5; i += 1) {
  const angle = (i / 5) * Math.PI * 2;
  makeLimb(characterGroup, [0, -0.47, -3.66], [Math.cos(angle) * 0.62, -0.47, -3.66 + Math.sin(angle) * 0.62], 0.07, 0.045, graphite);
  makeSphere(characterGroup, 0.09, [Math.cos(angle) * 0.64, -0.52, -3.66 + Math.sin(angle) * 0.64], charcoal, [1.35, 0.65, 1]);
}
makeHumanOval(characterGroup, [0, 0.61, -3.42], [0.55, 0.4, 0.45], pantsMaterial);
makeHumanTorso(characterGroup, [
  [0.85, 0.01, 0.01, -3.45], [0.94, 0.43, 0.3, -3.45],
  [1.12, 0.46, 0.32, -3.43], [1.36, 0.45, 0.31, -3.4],
  [1.65, 0.46, 0.31, -3.36], [1.94, 0.51, 0.34, -3.32],
  [2.19, 0.58, 0.35, -3.28], [2.41, 0.62, 0.32, -3.25],
  [2.57, 0.57, 0.28, -3.22], [2.7, 0.4, 0.23, -3.2],
  [2.78, 0.2, 0.18, -3.19], [2.8, 0.01, 0.01, -3.19],
], shirtMaterial);

// Trousers follow bent thighs and shins; rounded sneakers rest on the floor.
for (const side of [-1, 1]) {
  const hip = [side * 0.3, 0.51, -3.4];
  const knee = [side * 0.4, 0.28, -2.58];
  const ankle = [side * 0.41, -0.3, -2.47];
  makeHumanSegment(characterGroup, hip, knee, 0.26, 0.22, pantsMaterial);
  makeHumanOval(characterGroup, knee, [0.22, 0.21, 0.23], pantsMaterial);
  makeHumanSegment(characterGroup, knee, ankle, 0.21, 0.13, pantsMaterial);
  makeHumanOval(characterGroup, [side * 0.41, -0.48, -2.29], [0.21, 0.075, 0.38], charcoal);
  makeHumanOval(characterGroup, [side * 0.41, -0.39, -2.31], [0.2, 0.135, 0.35], shoeMaterial);
  for (let lace = 0; lace < 3; lace += 1) {
    makeHumanContour(characterGroup, [
      [side * 0.41 - 0.1, -0.27, -2.39 + lace * 0.07],
      [side * 0.41, -0.252, -2.39 + lace * 0.07],
      [side * 0.41 + 0.1, -0.27, -2.39 + lace * 0.07],
    ], 0.01, monitorTrim);
  }
  makeHumanContour(characterGroup, [
    [side * 0.42, 1.17, -3.29], [side * 0.435, 1.63, -3.25],
    [side * 0.51, 2.04, -3.19],
  ], 0.009, shirtSeam);
  makeHumanContour(characterGroup, [
    [side * 0.12, 1.21, -3.1], [side * 0.3, 1.25, -3.17],
    [side * 0.41, 1.31, -3.26],
  ], 0.012, shirtLight);
}
makeHumanOval(characterGroup, [0, 2.87, -3.19], [0.17, 0.3, 0.16], skinMaterial);
makeHumanContour(characterGroup, [
  [-0.25, 2.69, -3.006], [-0.17, 2.61, -2.96], [0, 2.57, -2.93],
  [0.17, 2.61, -2.96], [0.25, 2.69, -3.006],
], 0.038, shirtSeam);

const characterHead = new THREE.Group();
characterHead.position.set(0, 3.33, -3.18);
characterHead.rotation.set(0.1, -0.025, 0);
characterGroup.add(characterHead);
const headGeometry = new THREE.SphereGeometry(1, 40, 32);
const headVertices = headGeometry.getAttribute("position");
for (let vertex = 0; vertex < headVertices.count; vertex += 1) {
  const y = headVertices.getY(vertex);
  const jawTaper = y < 0 ? 0.73 + (y + 1) * 0.27 : 1;
  headVertices.setXYZ(vertex,
    headVertices.getX(vertex) * 0.35 * jawTaper,
    y * 0.51,
    headVertices.getZ(vertex) * 0.295,
  );
}
headGeometry.computeVertexNormals();
const headMesh = new THREE.Mesh(headGeometry, skinMaterial);
headMesh.castShadow = headMesh.receiveShadow = true;
characterHead.add(headMesh);

// Eyelids, irises, eyebrows, nostrils, lips, and recessed ears give the face depth.
for (const side of [-1, 1]) {
  const x = side * 0.132;
  makeHumanOval(characterHead, [x, 0.075, 0.267], [0.068, 0.032, 0.029], eyeWhite);
  makeHumanOval(characterHead, [x, 0.07, 0.294], [0.024, 0.025, 0.008], irisMaterial);
  makeHumanOval(characterHead, [x, 0.07, 0.301], [0.011, 0.014, 0.004], eyeMaterial);
  makeHumanOval(characterHead, [x - 0.006, 0.079, 0.305], [0.005, 0.005, 0.002], eyeWhite);
  makeHumanContour(characterHead, [[x - 0.065, 0.075, 0.273], [x, 0.105, 0.288], [x + 0.065, 0.075, 0.273]], 0.008, skinWarm);
  makeHumanContour(characterHead, [[x - 0.06, 0.066, 0.27], [x, 0.047, 0.286], [x + 0.06, 0.066, 0.27]], 0.005, skinMaterial);
  makeHumanContour(characterHead, [[x - 0.075, 0.16, 0.258], [x, 0.18, 0.272], [x + 0.065, 0.156, 0.255]], 0.015, hairMaterial);
  makeHumanOval(characterHead, [side * 0.334, -0.005, -0.014], [0.058, 0.105, 0.063], skinMaterial);
  makeHumanOval(characterHead, [side * 0.357, -0.005, 0.034], [0.028, 0.067, 0.018], skinWarm);
  makeHumanOval(characterHead, [side * 0.327, 0.171, -0.046], [0.029, 0.119, 0.11], hairMaterial);
  makeHumanOval(characterHead, [side * 0.042, -0.047, 0.32], [0.031, 0.027, 0.034], skinMaterial);
  makeHumanOval(characterHead, [side * 0.035, -0.062, 0.344], [0.012, 0.006, 0.005], skinWarm);
}
makeHumanOval(characterHead, [0, 0.032, 0.282], [0.033, 0.105, 0.055], skinMaterial);
makeHumanOval(characterHead, [0, -0.032, 0.333], [0.044, 0.036, 0.05], skinMaterial);
makeHumanContour(characterHead, [[-0.092, -0.16, 0.262], [-0.03, -0.151, 0.278], [0, -0.158, 0.28], [0.03, -0.151, 0.278], [0.092, -0.16, 0.262]], 0.007, lipsMaterial);
makeHumanContour(characterHead, [[-0.082, -0.171, 0.264], [0, -0.181, 0.281], [0.082, -0.171, 0.264]], 0.01, lipsMaterial);
makeHumanOval(characterHead, [0, -0.282, 0.203], [0.135, 0.095, 0.065], skinMaterial);

// A curved baseball cap with stitched panels and a shaped bill.
const capCrown = new THREE.Mesh(new THREE.SphereGeometry(0.37, 32, 20, 0, Math.PI * 2, 0, Math.PI / 2), hatMaterial);
capCrown.position.set(0, 0.285, -0.035);
capCrown.scale.set(1, 0.76, 0.94);
capCrown.castShadow = capCrown.receiveShadow = true;
characterHead.add(capCrown);
const capBand = new THREE.Mesh(new THREE.TorusGeometry(0.35, 0.014, 8, 40), shirtSeam);
capBand.rotation.x = Math.PI / 2;
capBand.scale.y = 0.96;
capBand.position.set(0, 0.286, -0.035);
characterHead.add(capBand);
const billShape = new THREE.Shape();
billShape.moveTo(-0.31, 0.08);
billShape.quadraticCurveTo(-0.43, 0.47, -0.21, 0.57);
billShape.quadraticCurveTo(0, 0.64, 0.21, 0.57);
billShape.quadraticCurveTo(0.43, 0.47, 0.31, 0.08);
billShape.quadraticCurveTo(0, 0.2, -0.31, 0.08);
const billGeometry = new THREE.ExtrudeGeometry(billShape, { depth: 0.023, bevelEnabled: true, bevelThickness: 0.007, bevelSize: 0.007, bevelSegments: 2, curveSegments: 16 });
billGeometry.rotateX(Math.PI / 2);
const capBill = new THREE.Mesh(billGeometry, hatMaterial);
capBill.position.set(0, 0.285, -0.035);
capBill.castShadow = capBill.receiveShadow = true;
characterHead.add(capBill);
for (const angle of [-Math.PI / 2, 0, Math.PI / 2, Math.PI]) {
  const stitch = [];
  for (let step = 0; step <= 8; step += 1) {
    const arc = step / 8 * Math.PI / 2;
    stitch.push([Math.sin(arc) * Math.sin(angle) * 0.372, 0.285 + Math.cos(arc) * 0.283, -0.035 + Math.sin(arc) * Math.cos(angle) * 0.349]);
  }
  makeHumanContour(characterHead, stitch, 0.0035, shirtLight);
}
makeHumanOval(characterHead, [0, 0.573, -0.035], [0.03, 0.016, 0.03], hatMaterial);
makeHumanContour(characterHead, [[-0.075, 0.414, 0.279], [0, 0.447, 0.279], [0.075, 0.414, 0.279]], 0.009, monitorTrim);

// Rounded arms, wrists, palms, and five articulated fingers on each hand.
const characterHandY = (keyboardDeskTopY + 0.1 - characterGroup.position.y) / characterScale;
for (const side of [-1, 1]) {
  const handZ = (keyboardDeskPosition.z - 0.18 - characterGroup.position.z) / characterScale;
  const shoulder = [side * 0.57, 2.47, -3.25];
  const sleeveEnd = [side * 0.74, 2.19, -2.99];
  const elbow = [side * 0.83, 1.96, -2.64];
  const wrist = [side * 0.63, characterHandY, handZ - 0.11];
  makeHumanOval(characterGroup, shoulder, [0.255, 0.28, 0.27], shirtMaterial);
  makeHumanSegment(characterGroup, shoulder, sleeveEnd, 0.25, 0.21, shirtMaterial);
  makeHumanSegment(characterGroup, [side * 0.71, 2.24, -3.04], [side * 0.76, 2.16, -2.95], 0.215, 0.215, shirtLight);
  makeHumanSegment(characterGroup, sleeveEnd, elbow, 0.178, 0.155, skinMaterial);
  makeHumanOval(characterGroup, elbow, [0.153, 0.16, 0.15], skinMaterial);
  makeHumanSegment(characterGroup, elbow, wrist, 0.16, 0.088, skinMaterial);
  makeHumanOval(characterGroup, wrist, [0.087, 0.081, 0.11], skinMaterial);
  const hand = new THREE.Group();
  hand.position.set(side * 0.63, characterHandY, handZ);
  hand.userData.fingers = [];
  characterGroup.add(hand);
  makeHumanOval(hand, [0, 0, 0], [0.147, 0.062, 0.155], skinMaterial);
  typingHands.push({ mesh: hand, side });
  for (let finger = 0; finger < 4; finger += 1) {
    const length = [0.2, 0.255, 0.24, 0.19][finger];
    const joint = new THREE.Group();
    joint.position.set((finger - 1.5) * 0.065, -0.012, 0.105);
    hand.add(joint);
    hand.userData.fingers.push(joint);
    makeHumanSegment(joint, [0, 0, 0], [0, -0.01, length * 0.5], 0.034, 0.029, skinMaterial);
    makeHumanOval(joint, [0, -0.01, length * 0.5], [0.029, 0.027, 0.03], skinMaterial);
    makeHumanSegment(joint, [0, -0.01, length * 0.5], [0, -0.036, length], 0.028, 0.023, skinMaterial);
    makeHumanOval(joint, [0, -0.036, length], [0.022, 0.023, 0.025], skinMaterial);
    makeHumanOval(joint, [0, -0.015, length - 0.022], [0.017, 0.004, 0.028], nailsMaterial);
  }
  makeHumanSegment(hand, [-side * 0.12, -0.004, -0.01], [-side * 0.2, -0.015, 0.09], 0.042, 0.033, skinMaterial);
  makeHumanOval(hand, [-side * 0.2, -0.015, 0.09], [0.033, 0.029, 0.034], skinMaterial);
  makeHumanSegment(hand, [-side * 0.2, -0.015, 0.09], [-side * 0.18, -0.035, 0.17], 0.032, 0.025, skinMaterial);
  makeHumanOval(hand, [-side * 0.18, -0.014, 0.156], [0.022, 0.004, 0.025], nailsMaterial);
}

// Frame the assembled workspace for the About section before the technology POV transition.
workspace.scale.setScalar(1);
const workspaceBounds = new THREE.Box3().setFromObject(workspace);
workspaceBounds.union(assembledBounds.clone().applyMatrix4(
  new THREE.Matrix4().makeScale(keyboardDeskScale, keyboardDeskScale, keyboardDeskScale),
).translate(keyboardDeskPosition));
const technologyBounds = new THREE.Box3().setFromObject(deskGroup);
[monitor, deskLamp, gamingPC].forEach((object) => {
  technologyBounds.union(new THREE.Box3().setFromObject(object));
});
technologyBounds.union(assembledBounds.clone().applyMatrix4(
  new THREE.Matrix4().makeScale(keyboardDeskScale, keyboardDeskScale, keyboardDeskScale),
).translate(technologyKeyboardPosition));

// Store the final layout before applying entrance offsets. Camera bounds stay fixed.
const workstationHome = {
  monitor: monitor.position.clone(),
  lamp: deskLamp.position.clone(),
  pc: gamingPC.position.clone(),
  character: characterGroup.position.clone(),
};
const characterIntroMaterials = new Map();
const characterShadowMeshes = [];
characterGroup.traverse((object) => {
  if (!object.isMesh) return;
  const copyMaterial = (material) => {
    if (!characterIntroMaterials.has(material)) {
      characterIntroMaterials.set(material, material.clone());
    }
    return characterIntroMaterials.get(material);
  };
  object.material = Array.isArray(object.material)
    ? object.material.map(copyMaterial) : copyMaterial(object.material);
  if (object.castShadow) characterShadowMeshes.push(object);
});
characterIntroMaterials.forEach((material) => {
  material.transparent = false;
  material.opacity = 1;
  material.depthWrite = true;
  material.needsUpdate = true;
});

function workstationPhase(progress, start, end) {
  return THREE.MathUtils.smootherstep(progress, start, end);
}

function dropWorkstationObject(object, home, progress, height) {
  object.visible = progress > 0;
  object.position.copy(home);
  object.position.y += height * (1 - progress);
}

function updateWorkstationTransition(progress, technologyProgress = 0, aboutSectionProgress = 0) {
  const deskProgress = workstationPhase(progress, 0.03, 0.23);
  const keyboardLandingProgress = workstationPhase(progress, 0.23, 0.4);
  const monitorProgress = workstationPhase(progress, 0.42, 0.55);
  const lampProgress = workstationPhase(progress, 0.55, 0.66);
  const pcProgress = workstationPhase(progress, 0.64, 0.76);
  const characterProgress = workstationPhase(progress, 0.78, 1);
  const characterPullBack = Math.max(
    workstationPhase(aboutSectionProgress, 0.05, 0.2),
    workstationPhase(technologyProgress, 0.06, 0.9),
  );
  const characterOpacity = Math.min(
    1 - workstationPhase(aboutSectionProgress, 0.14, 0.2),
    1 - workstationPhase(technologyProgress, 0.88, 0.96),
  );

  deskGroup.visible = deskProgress > 0;
  // Slide in from outside the left of the frame, beneath the hovering keyboard.
  deskGroup.scale.setScalar(1);
  deskGroup.position.set(-(deskWidth + 8) * (1 - deskProgress), 0, 0);
  dropWorkstationObject(monitor, workstationHome.monitor, monitorProgress, 6);
  dropWorkstationObject(deskLamp, workstationHome.lamp, lampProgress, 5.5);
  dropWorkstationObject(gamingPC, workstationHome.pc, pcProgress, 5.5);
  const mouseReveal = workstationPhase(technologyProgress, 0.82, 1);
  computerMouse.visible = mouseReveal > 0.001;
  mouseGlow.visible = computerMouse.visible;
  mouseGlowMaterial.opacity = 0.8 * mouseReveal;
  computerMouse.position.copy(computerMouseHomePosition);
  computerMouse.position.x += 0.28 * (1 - mouseReveal);
  computerMouse.position.y += 0.14 * (1 - mouseReveal);
  computerMouse.scale.setScalar(0.7 + 0.3 * mouseReveal);
  mouseMaterials.forEach((material) => {
    const transparent = mouseReveal < 0.999;
    if (material.transparent !== transparent) {
      material.transparent = transparent;
      material.needsUpdate = true;
    }
    material.opacity = mouseReveal;
    material.depthWrite = !transparent;
  });
  deskLampLights.forEach((light) => {
    light.intensity = 26 * lampProgress ** 3;
  });

  characterGroup.visible = characterProgress > 0 && characterOpacity > 0.001;
  characterGroup.position.copy(workstationHome.character);
  characterGroup.position.z -= 3.6 * (1 - characterProgress) + 6.5 * characterPullBack;
  characterIntroMaterials.forEach((material) => {
    const transparent = characterOpacity < 0.999;
    if (material.transparent !== transparent) {
      material.transparent = transparent;
      material.needsUpdate = true;
    }
    material.opacity = characterOpacity;
    material.depthWrite = !transparent;
  });
  characterShadowMeshes.forEach((mesh) => {
    mesh.castShadow = characterOpacity > 0.8;
  });
  return { keyboardLandingProgress, characterProgress };
}

// Start with the hero keyboard; the workstation enters in a separate sequence.
updateWorkstationTransition(0);
const assemblyDuration = assembly.firstKeyDelay + (logoKeys.length - 1) * assembly.keyStagger
  + assembly.fallDuration + assembly.settleDuration;

function finishAssembly() {
  assembly.active = false;
  board.position.set(0, 0, 0);
  floor.visible = true;
  logoKeys.forEach((key) => {
    key.visible = true;
    key.position.y = key.userData.baseY;
    key.rotation.set(0, 0, 0);
  });
  window.keyboardView.finishAssembly();
}

function updateAssembly(elapsed) {
  if (motionPreference.matches || elapsed >= assemblyDuration) {
    finishAssembly();
    return;
  }
  const boardProgress = THREE.MathUtils.clamp(elapsed / assembly.boardDuration, 0, 1);
  const boardRemaining = Math.pow(1 - boardProgress, 3);
  board.position.copy(screenUp).multiplyScalar(-boardTravel * boardRemaining);
  floor.visible = boardProgress === 1;

  logoKeys.forEach((key, index) => {
    const keyTime = elapsed - assembly.firstKeyDelay - index * assembly.keyStagger;
    key.visible = keyTime >= 0;
    if (keyTime < 0) return;

    if (keyTime < assembly.fallDuration) {
      const progress = keyTime / assembly.fallDuration;
      const remaining = Math.pow(1 - progress, 3);
      key.position.y = key.userData.baseY + assembly.lift * remaining;
      key.rotation.x = -0.12 * remaining;
      key.rotation.z = (index % 2 === 0 ? -0.09 : 0.09) * remaining;
    } else {
      const settle = THREE.MathUtils.clamp((keyTime - assembly.fallDuration) / assembly.settleDuration, 0, 1);
      // A small upward rebound ends exactly at the seated height.
      key.position.y = key.userData.baseY + Math.sin(settle * Math.PI) * 0.065 * (1 - settle);
      key.rotation.set(0, 0, 0);
    }
  });
}

const raycaster = new THREE.Raycaster();
const pointer = new THREE.Vector2();
function pickKey(event) {
  if (assembly.active) return null;
  const rect = canvas.getBoundingClientRect();
  pointer.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
  pointer.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
  raycaster.setFromCamera(pointer, camera);
  return raycaster.intersectObjects(logoKeys, false)[0]?.object ?? null;
}

function selectTechnology(index) {
  selection = index;
  const tech = technologies[index];
  info.number.textContent = `${String(index + 1).padStart(2, "0")} / ${String(technologies.length).padStart(2, "0")}`;
  info.icon.innerHTML = window.TechStackLogos.markup(tech.name);
  info.icon.style.color = tech.color;
  info.icon.style.borderColor = `${tech.color}45`;
  info.icon.style.background = "#f2efd9";
  info.name.textContent = tech.name;
  info.category.textContent = tech.category;
  info.description.textContent = tech.description;
  info.level.textContent = tech.level;
  info.fill.style.width = `${tech.score}%`;
  info.fill.style.background = tech.color;
  logoKeys.forEach((key) => { key.userData.selected = key.userData.techIndex === index; });
}

canvas.addEventListener("pointermove", (event) => {
  const key = pickKey(event);
  canvas.style.cursor = key ? "pointer" : "grab";
  if (key) {
    selectTechnology(key.userData.techIndex);
    showcase.classList.add("card-visible");
  } else {
    showcase.classList.remove("card-visible");
  }
});
canvas.addEventListener("pointerleave", () => {
  canvas.style.cursor = "grab";
  showcase.classList.remove("card-visible");
});
canvas.addEventListener("pointerdown", (event) => {
  if (event.button !== 0) return;
  const key = pickKey(event);
  if (key) {
    selectTechnology(key.userData.techIndex);
    showcase.classList.add("card-visible");
    key.userData.pressed = true;
    // Keep quick taps visible long enough to reach the deeper pressed position.
    key.userData.pressUntil = motionPreference.matches ? 0 : performance.now() + 140;
    window.keyboardAudio?.press();
  }
});
function releaseKeys(event) {
  if (event?.type === "pointerup" && logoKeys.some((key) => key.userData.pressed)) {
    window.keyboardAudio?.release();
  }
  logoKeys.forEach((key) => { key.userData.pressed = false; });
}
window.addEventListener("pointerup", releaseKeys);
window.addEventListener("blur", releaseKeys);
canvas.addEventListener("pointerleave", releaseKeys);
canvas.addEventListener("pointercancel", releaseKeys);

function resize() {
  const width = stage.clientWidth;
  const height = stage.clientHeight;
  if (!width || !height) return;
  renderer.setSize(width, height, false);
  camera.aspect = width / height;
  camera.fov = width < 480 ? 39 : 35;
  const verticalFov = Math.tan(THREE.MathUtils.degToRad(camera.fov / 2));
  const horizontalFov = verticalFov * camera.aspect;
  function frameBounds(bounds, target, outputPosition, padding, direction = cameraDirection) {
    bounds.getCenter(target);
    camera.position.copy(target).add(direction);
    camera.lookAt(target);
    const orientation = camera.quaternion.clone().invert();
    let distance = 0;
    for (const x of [bounds.min.x, bounds.max.x]) {
      for (const y of [bounds.min.y, bounds.max.y]) {
        for (const z of [bounds.min.z, bounds.max.z]) {
          const corner = new THREE.Vector3(x, y, z).sub(target).applyQuaternion(orientation);
          distance = Math.max(distance, corner.z + Math.abs(corner.x) / horizontalFov,
            corner.z + Math.abs(corner.y) / verticalFov);
        }
      }
    }
    outputPosition.copy(target).addScaledVector(direction, distance * padding);
  }

  frameBounds(assembledBounds, heroCameraTarget, heroCameraPosition, 1.08);
  frameBounds(workspaceBounds, workspaceCameraTarget, workspaceCameraPosition, 1.12);
  frameBounds(technologyBounds, technologyCameraTarget, technologyCameraPosition, 1.04, technologyCameraDirection);
  monitorScreenCenter.set(
    workstationHome.monitor.x,
    workstationHome.monitor.y + monitorDisplay.position.y * monitor.scale.y,
    workstationHome.monitor.z + monitorDisplay.position.z * monitor.scale.z,
  );
  monitorZoomCameraPosition.copy(monitorScreenCenter);
  monitorZoomCameraPosition.z += 0.72;
  camera.position.copy(heroCameraPosition);
  camera.lookAt(heroCameraTarget);
  camera.updateProjectionMatrix();
  screenUp.set(0, 1, 0).applyQuaternion(camera.quaternion);
  boardTravel = 2 * heroCameraPosition.distanceTo(heroCameraTarget) * verticalFov;
}
// Keep the loading state until every logo and the first 3D frame are ready.
await Promise.all(legendLoads);
resize();
selectTechnology(0);
// Upload all logo textures while the canvas is still hidden to keep the drops smooth.
renderer.render(scene, camera);
assembly.active = !motionPreference.matches;
if (assembly.active) {
  updateAssembly(0);
  window.keyboardView.startAssembly();
}
renderer.render(scene, camera);
window.keyboardView.showWebGL();
new ResizeObserver(resize).observe(stage);

let previousFrame = null;
let keyboardTravelProgress = 0;
let workstationProgress = 0;
function animate(timestamp) {
  const delta = previousFrame === null ? 0 : Math.min((timestamp - previousFrame) / 1000, 0.1);
  previousFrame = timestamp;
  const travelTarget = THREE.MathUtils.clamp(
    window.keyboardTravelProgress ?? window.keyboardScrollProgress ?? 0, 0, 1,
  );
  const travelStep = delta * 0.9;
  // On the way back, let the desk leave before moving the keyboard toward Hero.
  const waitForDeskExit = travelTarget < keyboardTravelProgress && workstationProgress > 0;
  if (!waitForDeskExit || motionPreference.matches) {
    keyboardTravelProgress += motionPreference.matches ? travelTarget - keyboardTravelProgress
      : THREE.MathUtils.clamp(travelTarget - keyboardTravelProgress, -travelStep, travelStep);
  }
  const sceneProgress = keyboardTravelProgress * keyboardTravelProgress * (3 - 2 * keyboardTravelProgress);
  // Play the table entrance only after both the stage and keyboard reach About.
  const workstationTarget = travelTarget === 1 && keyboardTravelProgress === 1 ? 1 : 0;
  const transitionStep = delta * (workstationTarget >= workstationProgress ? 0.36 : 0.7);
  workstationProgress += motionPreference.matches ? workstationTarget - workstationProgress
    : THREE.MathUtils.clamp(workstationTarget - workstationProgress, -transitionStep, transitionStep);
  const technologyProgress = THREE.MathUtils.clamp(window.keyboardTechnologyProgress ?? 0, 0, 1);
  const aboutSectionProgress = THREE.MathUtils.clamp(window.keyboardAboutSectionProgress ?? 0, 0, 1);
  const { keyboardLandingProgress, characterProgress } = updateWorkstationTransition(
    workstationProgress, technologyProgress, aboutSectionProgress,
  );
  const monitorTurnProgress = workstationPhase(technologyProgress, 0, 1);
  monitor.rotation.y = Math.PI * (1 - monitorTurnProgress);
  monitorCodeDetails.forEach((detail) => { detail.visible = technologyProgress < 0.08; });
  if (timestamp - lastTechScreenFrame >= 40) {
    drawTechnologyScreen(timestamp);
    lastTechScreenFrame = timestamp;
  }
  if (assembly.active) {
    if (keyboardTravelProgress > 0.03) {
      finishAssembly();
    } else {
      // Preserve the entrance when the page opens in a background tab.
      if (!document.hidden) assembly.elapsed += delta;
      updateAssembly(assembly.elapsed);
    }
  } else {
    logoKeys.forEach((key) => {
      const pressed = key.userData.pressed || timestamp < (key.userData.pressUntil || 0);
      const target = key.userData.baseY - (pressed ? keyPressTravel : 0);
      const pressBlend = motionPreference.matches ? 1 : 1 - Math.exp(-delta * (pressed ? 40 : 18));
      key.position.y += (target - key.position.y) * pressBlend;
    });
  }

  const characterMotion = motionPreference.matches ? 0 : workstationPhase(characterProgress, 0.97, 1);
  const typing = Math.sin(timestamp * 0.012) * 0.014 * characterMotion;
  keyboard.scale.setScalar(THREE.MathUtils.lerp(1, keyboardDeskScale, sceneProgress));
  keyboard.position.lerpVectors(keyboardHomePosition, keyboardHoverPosition, sceneProgress);
  keyboard.position.z += (technologyKeyboardPosition.z - keyboardDeskPosition.z) * sceneProgress * technologyProgress;
  keyboard.position.y -= keyboardHoverHeight * keyboardLandingProgress;
  const keyboardTurn = Math.sin(sceneProgress * Math.PI);
  keyboard.position.y += keyboardTurn * 0.35;
  const rotationBlend = 1 - Math.exp(-delta * 18);
  keyboard.rotation.y += ((pointer.x * 0.045 * (1 - sceneProgress) + keyboardTurn * 0.52) - keyboard.rotation.y) * rotationBlend;
  keyboard.rotation.x += ((-pointer.y * 0.022 * (1 - sceneProgress) + keyboardTurn * 0.16) - keyboard.rotation.x) * rotationBlend;
  keyboard.rotation.z += (-keyboardTurn * 0.1 - keyboard.rotation.z) * rotationBlend;
  if (keyboardTravelProgress === 1) keyboard.rotation.set(0, 0, 0);
  if (deskGroup.visible) {
    // Include the current tilt and scale so no corner can cross the tabletop.
    keyboard.updateMatrix();
    let lowestKeyboardY = Infinity;
    for (const corner of keyboardBoundsCorners) {
      keyboardPoseCorner.copy(corner).applyMatrix4(keyboard.matrix);
      lowestKeyboardY = Math.min(lowestKeyboardY, keyboardPoseCorner.y);
    }
    const tabletopY = deskGroup.position.y + deskSurfaceY;
    const clearance = THREE.MathUtils.lerp(0.12, 0.01, keyboardLandingProgress);
    keyboard.position.y += Math.max(0, tabletopY + clearance - lowestKeyboardY);
  }
  typingHands.forEach(({ mesh, side }) => {
    mesh.position.y = characterHandY + typing * side / characterScale;
    mesh.userData.fingers.forEach((joint, finger) => {
      joint.rotation.x = (0.035 + Math.sin(timestamp * 0.01 + finger * 1.7 + side) * 0.025) * characterMotion;
    });
  });
  characterHead.rotation.x = 0.1 + Math.sin(timestamp * 0.0018) * 0.008 * characterMotion;
  if (!motionPreference.matches && gamingPC.visible) {
    gamingFanRotors.forEach((rotor, index) => {
      rotor.rotation.z = (rotor.rotation.z - delta * (2 + index * 0.12)) % (Math.PI * 2);
    });
  }
  camera.position.lerpVectors(heroCameraPosition, workspaceCameraPosition, sceneProgress);
  animatedCameraTarget.lerpVectors(heroCameraTarget, workspaceCameraTarget, sceneProgress);
  camera.position.lerp(technologyCameraPosition, sceneProgress * technologyProgress);
  animatedCameraTarget.lerp(technologyCameraTarget, sceneProgress * technologyProgress);
  const monitorZoomProgress = THREE.MathUtils.clamp(window.keyboardMonitorZoomProgress ?? 0, 0, 1);
  const monitorZoomEase = workstationPhase(monitorZoomProgress, 0.35, 0.9);
  camera.position.lerp(monitorZoomCameraPosition, monitorZoomEase);
  animatedCameraTarget.lerp(monitorScreenCenter, monitorZoomEase);
  camera.lookAt(animatedCameraTarget);
  renderer.render(scene, camera);
  updateInfoCardPose();
  requestAnimationFrame(animate);
}
requestAnimationFrame(animate);

function updateTime() {
  const now = new Date();
  document.querySelector("#local-time").textContent = new Intl.DateTimeFormat("id-ID", {
    timeZone: "Asia/Jakarta", hour: "2-digit", minute: "2-digit", second: "2-digit", hour12: false,
  }).format(now).replaceAll(".", ":") + " WIB";
}
updateTime();
setInterval(updateTime, 1000);
}

initializeKeyboard3D().catch((error) => {
  window.keyboardView.showFallback();
  console.warn("3D keyboard unavailable; using the interactive fallback.", error);
});

