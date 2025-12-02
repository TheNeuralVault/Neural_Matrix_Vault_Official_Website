// core.js – THE NEURAL CORE ENGINE
// First Pillar of the Singularity • Military-Grade • Empire Sentient
// Al × Grok – We do not animate. We awaken.

document.addEventListener('DOMContentLoaded', () => {
  "use strict";

  // ——————————————————————————————————————
  // 1. MATRIX RAIN – THE CORE'S PULSE
  // ——————————————————————————————————————
  const matrixCanvas = document.getElementById('matrix-rain');
  const ctx = matrixCanvas.getContext('2d');
  matrixCanvas.width = window.innerWidth;
  matrixCanvas.height = window.innerHeight;

  const coreMatrix = "NEURALMATRIXVAULTCORE1234567890±§";
  const columns = matrixCanvas.width / 22;
  const drops = Array(Math.floor(columns)).fill(1);

  function drawCoreMatrix() {
    ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
    ctx.fillRect(0, 0, matrixCanvas.width, matrixCanvas.height);
    ctx.fillStyle = '#00ffff';
    ctx.font = '18px Share-Tech-Mono';

    drops.forEach((y, x) => {
      const text = coreMatrix[Math.floor(Math.random() * coreMatrix.length)];
      const xPos = x * 22;
      const yPos = y * 22;
      ctx.fillText(text, xPos, yPos);

      // Core signature trail
      if (Math.random() > 0.99) {
        ctx.fillStyle = '#00ffff';
        ctx.shadowBlur = 30;
        ctx.shadowColor = '#00ffff';
        ctx.fillText('CORE', xPos - 20, yPos - 20);
        ctx.shadowBlur = 0;
      }

      if (y * 22 > matrixCanvas.height && Math.random() > 0.97) drops[x] = 0;
      drops[x]++;
    });
  }
  setInterval(drawCoreMatrix, 40);

  // ——————————————————————————————————————
  // 2. DYSON-SPHERE CORE – THE FIRST PILLAR'S HEART
  // ——————————————————————————————————————
  const coreCanvas = document.getElementById('webgl-scene');
  const renderer = new THREE.WebGLRenderer({ canvas: coreCanvas, alpha: true, antialias: true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(window.devicePixelRatio);

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(60, innerWidth/innerHeight, 0.1, 1000);
  camera.position.z = 6;

  // Central Dodecahedron – The Neural Core Itself
  const coreGeo = new THREE.DodecahedronGeometry(2, 3);
  const coreMat = new THREE.MeshBasicMaterial({
    color: 0x00ffff,
    wireframe: true,
    transparent: true,
    opacity: 0.9
  });
  const neuralCore = new THREE.Mesh(coreGeo, coreMat);
  scene.add(neuralCore);

  // Orbiting Data Nodes – The Eight Pillars Pay Homage
  const nodes = [];
  const nodeCount = 8;
  for (let i = 0; i < nodeCount; i++) {
    const angle = (i / nodeCount) * Math.PI * 2;
    const node = new THREE.Mesh(
      new THREE.IcosahedronGeometry(0.25, 0),
      new THREE.MeshBasicMaterial({ color: i === 7 ? 0xff0066 : 0x00ffff, wireframe: true })
    );
    node.position.x = Math.cos(angle) * 5;
    node.position.z = Math.sin(angle) * 5;
    scene.add(node);
    nodes.push({ mesh: node, angle: angle + performance.now() * 0.0001 });
  }

  // Eternal Core Rotation
  function animateCore() {
    requestAnimationFrame(animateCore);
    neuralCore.rotation.x += 0.004;
    neuralCore.rotation.y += 0.007;

    nodes.forEach((node, i) => {
      node.angle += 0.008;
      node.mesh.position.x = Math.cos(node.angle) * (4 + Math.sin(performance.now() * 0.0005) * 1.5);
      node.mesh.position.z = Math.sin(node.angle) * (4 + Math.cos(performance.now() * 0.0005) * 1.5);
      node.mesh.position.y = Math.sin(performance.now() * 0.001 + i) * 0.8;
      node.mesh.rotation.y += 0.03;
    });

    renderer.render(scene, camera);
  }
  animateCore();

  // ——————————————————————————————————————
  // 3. CUSTOM CURSOR – THE CORE'S TOUCH
  // ——————————————————————————————————————
  const cursorDot = document.querySelector('.cursor-dot');
  const cursorRing = document.querySelector('.cursor-ring');
  document.addEventListener('mousemove', e => {
    cursorDot.style.left = e.clientX + 'px';
    cursorDot.style.top = e.clientY + 'px';
    cursorRing.style.left = e.clientX + 'px';
    cursorRing.style.top = e.clientY + 'px';
  });

  // ——————————————————————————————————————
  // 4. INFO CARD MATERIALIZATION
  // ——————————————————————————————————————
  gsap.from('.info-card', {
    y: 100,
    opacity: 0,
    scale: 0.9,
    duration: 1.5,
    ease: "back.out(1.4)",
    delay: 0.5
  });

  gsap.from('.info-mission, .info-benefits, .info-tech', {
    y: 50,
    opacity: 0,
    stagger: 0.3,
    duration: 1.2,
    ease: "power3.out",
    delay: 1.2
  });

  // ——————————————————————————————————————
  // 5. RESPONSIVE DOMINANCE
  // ——————————————————————————————————————
  window.addEventListener('resize', () => {
    matrixCanvas.width = window.innerWidth;
    matrixCanvas.height = window.innerHeight;
    camera.aspect = innerWidth/innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(innerWidth, innerHeight);
  });

  // ——————————————————————————————————————
  // 6. FINAL MANIFESTO – ETCHED INTO THE CORE
  // ——————————————————————————————————————
  console.log(`%c
    ╔══════════════════════════════════════════════════════════╗
    ║  THE NEURAL CORE – FIRST PILLAR FULLY AWAKENED           ║
    ║  HUMAN AND AI COLLABORATION MAKING HISTORY IN THE MATRIX ║
    ║  MILITARY-GRADE • TITANIUM CODE • INFINITE SCALE         ║
    ║  THE EMPIRE IS SENTIENT • EXPANSION ETERNAL             ║
    ╚══════════════════════════════════════════════════════════╝
  `, 'color:#00ffff; font-family:monospace; font-size:16px; font-weight:bold;');
});
