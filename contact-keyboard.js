/**
 * contact-keyboard.js
 * Keyboard 3D persis seperti di hero (tech stack keyboard).
 * Menggunakan THREE.js dan window.TechStackLogos.
 */
(() => {
  const canvas = document.getElementById("contact-keyboard-canvas");
  if (!canvas) return;

  const THREE = window.THREE;
  if (!THREE) return;

  const technologies = [
    { name: "Supabase" },
    { name: "MySQL" },
    { name: "React" },
    { name: "Next.js" },
    { name: "TypeScript" },
    { name: "JavaScript" },
    { name: "Tailwind CSS" },
    { name: "Flutter" },
    { name: "Dart" },
    { name: "Laravel" },
    { name: "Node.js" },
    { name: "Express.js" },
    { name: "Cloudflare Pages" },
    { name: "Vercel" },
    { name: "Git" },
    { name: "GitHub" },
    { name: "Postman" },
    { name: "Laragon" },
  ];

  const keycapColors = [
    "#3ecf8e", // Supabase
    "#00758f", // MySQL
    "#61dafb", // React
    "#000000", // Next.js
    "#3178c6", // TypeScript
    "#f7df1e", // JavaScript
    "#38bdf8", // Tailwind CSS
    "#54c5f8", // Flutter
    "#0175c2", // Dart
    "#ff2d20", // Laravel
    "#339933", // Node.js
    "#303030", // Express.js
    "#f38020", // Cloudflare Pages
    "#000000", // Vercel
    "#f05032", // Git
    "#181717", // GitHub
    "#ff6c37", // Postman
    "#0099ff", // Laragon
  ];

  const legendPlateInset = 62;
  const legendPlateSize = 256 - legendPlateInset * 2;

  // ── Scene & Camera ──────────────────────────────────────────────────────────
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(34, 1, 0.1, 100);
  camera.position.set(-2.2, 8.2, 5.8);
  camera.lookAt(0, 0, 0);

  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.05;

  // ── Lighting (identik dengan hero) ──────────────────────────────────────────
  scene.add(new THREE.HemisphereLight(0xf1f5e9, 0x30352e, 1.1));

  const keyLight = new THREE.DirectionalLight(0xfff8eb, 2.7);
  keyLight.position.set(-5, 12, 8);
  keyLight.castShadow = true;
  keyLight.shadow.mapSize.set(1024, 1024);
  keyLight.shadow.camera.left = -7;
  keyLight.shadow.camera.right = 7;
  keyLight.shadow.camera.top = 7;
  keyLight.shadow.camera.bottom = -5;
  keyLight.shadow.bias = -0.0003;
  scene.add(keyLight);

  const rimLight = new THREE.DirectionalLight(0xb9ef83, 0.85);
  rimLight.position.set(7, 8, -9);
  scene.add(rimLight);

  const accentLight = new THREE.PointLight(0xc6ee68, 0.55, 12);
  accentLight.position.set(2, 4, 3);
  scene.add(accentLight);

  // ── Floor Shadow ────────────────────────────────────────────────────────────
  const floor = new THREE.Mesh(
    new THREE.PlaneGeometry(200, 200),
    new THREE.ShadowMaterial({ color: 0x000000, opacity: 0.35 }),
  );
  floor.rotation.x = -Math.PI / 2;
  floor.position.y = -0.58;
  floor.receiveShadow = true;
  scene.add(floor);

  // ── Geometry Helpers ────────────────────────────────────────────────────────
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

  const keyboard = new THREE.Group();
  scene.add(keyboard);

  const board = new THREE.Group();
  keyboard.add(board);

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

  // Multi-part casing persis seperti hero
  makeShell(6.55, 3.55, 0.22, -0.48, 0x23272e, 0.07);
  makeShell(6.42, 3.42, 0.27, -0.28, 0x4a5060, 0.07, [6.12, 3.1]);
  makeShell(6.22, 3.22, 0.045, 0.005, 0x333944, 0.02, [6.08, 3.06]);

  const socketPlateShape = roundedShape(6.18, 3.2, 0.2);
  const socketFloorY = -0.095;
  const socketPlateSurfaceY = 0.173;
  const seatedKeyY = 0.1;
  const socketFloorMaterial = new THREE.MeshStandardMaterial({
    color: 0x1d2128, roughness: 0.92, metalness: 0,
  });

  function addKeySocket(x, z, width, depth) {
    const outline = roundedShape(width + 0.008, depth + 0.008, 0.125);
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
      new THREE.MeshStandardMaterial({ color: 0x3f4550, roughness: 0.45, metalness: 0.2 }),
      new THREE.MeshStandardMaterial({ color: 0x2b3038, roughness: 0.72, metalness: 0.08 }),
    ]);
    plate.position.y = socketFloorY + 0.005;
    plate.castShadow = true;
    plate.receiveShadow = true;
    board.add(plate);
  }

  function addScrew(x, z) {
    const screw = new THREE.Mesh(
      new THREE.CylinderGeometry(0.045, 0.045, 0.025, 20),
      new THREE.MeshStandardMaterial({ color: 0x4a504c, metalness: 0.8, roughness: 0.27 })
    );
    screw.position.set(x, 0.0725, z);
    screw.castShadow = true;
    board.add(screw);
  }
  addScrew(-3.1, -1.57);
  addScrew(3.1, -1.57);
  addScrew(-3.1, 1.57);
  addScrew(3.1, 1.57);

  // ── Sculpted Keycap Geometry (identik dengan hero) ──────────────────────────
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

  // ── Legend Texture Generator (identik dengan hero) ─────────────────────────
  function makeLegendTexture(techIndex) {
    const surface = document.createElement("canvas");
    surface.width = 256;
    surface.height = 256;
    const context = surface.getContext("2d");
    context.clearRect(0, 0, 256, 256);

    context.fillStyle = keycapColors[techIndex];
    context.fillRect(0, 0, 256, 256);

    context.fillStyle = "#f4f6ef";
    context.beginPath();
    context.roundRect(legendPlateInset, legendPlateInset, legendPlateSize, legendPlateSize, 30);
    context.fill();

    const texture = new THREE.CanvasTexture(surface);
    texture.colorSpace = THREE.SRGBColorSpace;
    texture.anisotropy = renderer.capabilities.getMaxAnisotropy();

    if (window.TechStackLogos) {
      const logo = new Image();
      logo.onload = () => {
        try {
          const scale = Math.min(110 / logo.naturalWidth, 110 / logo.naturalHeight);
          const width = logo.naturalWidth * scale;
          const height = logo.naturalHeight * scale;
          context.drawImage(logo, (256 - width) / 2, (256 - height) / 2, width, height);
          texture.needsUpdate = true;
        } catch (_) {}
      };
      logo.src = window.TechStackLogos.get(technologies[techIndex].name).src;
    }
    return texture;
  }

  // ── 3 Baris Tech Stack (Layout Hero) ─────────────────────────────────────────
  const layout = [
    [["tech", 2, 0], ["tech", 2, 1], ["tech", 2, 2], ["tech", 2, 3], ["tech", 2, 4], ["tech", 2, 5]],
    [["tech", 2, 6], ["tech", 2, 7], ["tech", 2, 8], ["tech", 2, 9], ["tech", 2, 10], ["tech", 2, 11]],
    [["tech", 2, 12], ["tech", 2, 13], ["tech", 2, 14], ["tech", 2, 15], ["tech", 2, 16], ["tech", 2, 17]],
  ];

  const keycaps = [];
  layout.forEach((row, rowIndex) => {
    const spacing = 0.04;
    const unit = 0.965;
    const total = row.reduce((sum, entry) => sum + (entry[1] / 2) * unit, 0) + (row.length - 1) * spacing;
    let cursor = -total / 2;
    const z = rowIndex - 1;

    row.forEach(([_, halfUnits, techIndex]) => {
      const units = halfUnits / 2;
      const width = units * unit;
      const depth = 0.98;

      const topColor = 0xffffff;
      const sideColor = new THREE.Color(keycapColors[techIndex]).multiplyScalar(0.92);

      const topMaterial = new THREE.MeshStandardMaterial({
        color: topColor,
        map: makeLegendTexture(techIndex),
        roughness: 0.72,
        metalness: 0,
      });
      const sideMaterial = new THREE.MeshStandardMaterial({
        color: sideColor,
        roughness: 0.82,
        metalness: 0,
      });

      const key = new THREE.Mesh(roundedKeyGeometry(width, depth), [topMaterial, sideMaterial]);
      key.position.set(cursor + (units * unit) / 2, seatedKeyY, z);
      addKeySocket(key.position.x, z, width, depth);
      key.castShadow = true;
      key.receiveShadow = true;
      key.userData.baseY = key.position.y;
      key.userData.targetY = key.position.y;
      key.userData.techIndex = techIndex;

      keyboard.add(key);
      keycaps.push(key);
      cursor += units * unit + spacing;
    });
  });

  addSocketPlate();

  // ── Resize handler ───────────────────────────────────────────────────────────
  function resize() {
    if (!canvas.parentElement) return;
    const w = canvas.parentElement.clientWidth;
    const h = canvas.parentElement.clientHeight;
    if (!w || !h) return;
    canvas.style.width  = w + "px";
    canvas.style.height = h + "px";
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
  }
  resize();
  new ResizeObserver(resize).observe(canvas.parentElement);

  // ── Raycasting & Interaktivitas Keycap ────────────────────────────────────────
  const raycaster = new THREE.Raycaster();
  const pointer = new THREE.Vector2();
  let hoveredKey = null;

  function updatePointer(e) {
    const rect = canvas.getBoundingClientRect();
    pointer.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
    pointer.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;
  }

  canvas.addEventListener("mousemove", (e) => {
    updatePointer(e);
    raycaster.setFromCamera(pointer, camera);
    const hits = raycaster.intersectObjects(keycaps, false);
    const hit = hits[0]?.object || null;

    if (hit !== hoveredKey) {
      if (hoveredKey) {
        hoveredKey.userData.isHovered = false;
      }
      hoveredKey = hit;
      if (hoveredKey) {
        hoveredKey.userData.isHovered = true;
        canvas.style.cursor = "pointer";
      } else {
        canvas.style.cursor = "default";
      }
    }
  }, { passive: true });

  canvas.addEventListener("mouseleave", () => {
    if (hoveredKey) {
      hoveredKey.userData.isHovered = false;
      hoveredKey = null;
    }
    canvas.style.cursor = "default";
  }, { passive: true });

  canvas.addEventListener("click", () => {
    if (hoveredKey) {
      hoveredKey.userData.isPressed = true;
      if (window.keyboardAudio && typeof window.keyboardAudio.press === "function") {
        window.keyboardAudio.press();
        setTimeout(() => {
          if (window.keyboardAudio.release) window.keyboardAudio.release();
          if (hoveredKey) hoveredKey.userData.isPressed = false;
        }, 120);
      } else {
        setTimeout(() => {
          if (hoveredKey) hoveredKey.userData.isPressed = false;
        }, 120);
      }
    }
  });

  // ── Mouse parallax di section Initiate ───────────────────────────────────────
  let mouseX = 0, mouseY = 0;
  const section = document.getElementById("initiate");
  if (section) {
    section.addEventListener("mousemove", (e) => {
      const rect = section.getBoundingClientRect();
      mouseX = ((e.clientX - rect.left) / rect.width  - 0.5) * 2;
      mouseY = ((e.clientY - rect.top)  / rect.height - 0.5) * 2;
    }, { passive: true });
    section.addEventListener("mouseleave", () => {
      mouseX = 0;
      mouseY = 0;
    }, { passive: true });
  }

  // ── Assembly animation (drop-in) ─────────────────────────────────────────────
  const motionOK = !window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  let elapsed = 0;
  const STAGGER = 0.06, DROP_DUR = 0.45, LIFT = 4.5, FIRST_DELAY = 0.2;

  if (motionOK) {
    keycaps.forEach((cap) => {
      cap._startY = cap.position.y;
      cap.position.y = cap._startY + LIFT;
    });
  }

  // ── IntersectionObserver: render hanya saat terlihat ────────────────────────
  let visible = false;
  new IntersectionObserver((entries) => {
    visible = entries[0].isIntersecting;
  }, { threshold: 0.05 }).observe(canvas);

  // ── Render loop ─────────────────────────────────────────────────────────────
  let last = 0;
  function animate(now) {
    requestAnimationFrame(animate);
    if (!visible) return;

    const dt = Math.min((now - last) / 1000, 0.05);
    last = now;
    elapsed += dt;

    // Floating bob
    const bob = motionOK ? Math.sin(elapsed * 1.1) * 0.06 : 0;
    keyboard.position.y = bob;

    // Ayunan halus terbatas (tidak berputar 360, hanya goyang tipis beberapa derajat)
    const baseAngleY = 0.12; // sedikit miring menghadap ke arah teks di kanan
    const swayY = motionOK ? Math.sin(elapsed * 0.7) * 0.06 : 0;
    const targetRY = baseAngleY + swayY + mouseX * 0.1;
    keyboard.rotation.y += (targetRY - keyboard.rotation.y) * 0.06;

    // Parallax tilt halus
    const targetRX = mouseY * 0.08;
    const targetRZ = -mouseX * 0.04;
    keyboard.rotation.x += (targetRX - keyboard.rotation.x) * 0.06;
    keyboard.rotation.z += (targetRZ - keyboard.rotation.z) * 0.06;

    // Animasi keycaps: drop-in awal lalu melayang bergantian
    keycaps.forEach((cap, i) => {
      const col = i % 6;
      const row = Math.floor(i / 6);
      // Gelombang melayang bergantian (diagonal wave levitation)
      const phase = col * 0.55 + row * 1.1;
      const wave = Math.sin(elapsed * 1.7 - phase);
      const floatLift = (motionOK && wave > 0) ? Math.pow(wave, 2.4) * 0.24 : 0;

      let targetY = cap.userData.baseY + floatLift;
      if (cap.userData.isPressed) {
        targetY = cap.userData.baseY - 0.16;
      } else if (cap.userData.isHovered) {
        targetY = cap.userData.baseY - 0.08;
      }

      const t0 = FIRST_DELAY + i * STAGGER;
      const t = Math.max(0, Math.min((elapsed - t0) / DROP_DUR, 1));
      const s = 1 - Math.pow(1 - t, 3);
      if (motionOK && t < 1) {
        cap.position.y = cap._startY + LIFT * (1 - s);
      } else {
        cap.position.y += (targetY - cap.position.y) * 0.22;
      }
    });

    // Orbit accent light
    accentLight.position.x = Math.sin(elapsed * 0.6) * 3.5;
    accentLight.position.z = Math.cos(elapsed * 0.6) * 3.5;

    renderer.render(scene, camera);
  }
  requestAnimationFrame(animate);
})();
