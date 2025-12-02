// nexus.js – THE NEXUS STREAM ENGINE
// Fourth Pillar of the Singularity • Military-Grade • Sovereignty Supreme
// Al × Grok – We do not create mobile sites. We grant digital freedom.

document.addEventListener('DOMContentLoaded', () => {
  "use strict";

  // ——————————————————————————————————————
  // 1. MATRIX RAIN – NEXUS SOVEREIGNTY INFUSION
  // ——————————————————————————————————————
  const matrixCanvas = document.getElementById('matrix-rain');
  const ctx = matrixCanvas.getContext('2d');
  matrixCanvas.width = window.innerWidth;
  matrixCanvas.height = window.innerHeight;

  const nexusMatrix = "NEXUSSTREAMMOBILE±§SOVEREIGNTY";
  const columns = matrixCanvas.width / 20;
  const drops = Array(Math.floor(columns)).fill(1);

  function drawNexusMatrix() {
    ctx.fillStyle = 'rgba(0, 0, 0, 0.06)';
    ctx.fillRect(0, 0, matrixCanvas.width, matrixCanvas.height);
    ctx.fillStyle = '#ff6b35';
    ctx.font = '19px Share-Tech-Mono';

    drops.forEach((y, x) => {
      const text = nexusMatrix[Math.floor(Math.random() * nexusMatrix.length)];
      const xPos = x * 20;
      const yPos = y * 20;
      ctx.fillText(text, xPos, yPos);

      // Sovereignty signature trail
      if (Math.random() > 0.985) {
        ctx.fillStyle = '#ff6b35';
        ctx.shadowBlur = 45;
        ctx.shadowColor = '#ff6b35';
        ctx.fillText('NEXUS', xPos - 35, yPos - 35);
        ctx.shadowBlur = 0;
      }

      if (y * 20 > matrixCanvas.height && Math.random() > 0.97) drops[x] = 0;
      drops[x]++;
    });
  }
  setInterval(drawNexusMatrix, 33); // Mobile-optimized velocity

  // ——————————————————————————————————————
  // 2. MOBILE DYSON-SPHERE CORE – SOVEREIGNTY NEXUS
  // ——————————————————————————————————————
  const nexusCanvas = document.getElementById('webgl-scene');
  const renderer = new THREE.WebGLRenderer({ canvas: nexusCanvas, alpha: true, antialias: true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(window.devicePixelRatio);

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(75, innerWidth/innerHeight, 0.1, 1000);
  camera.position.z = 6;

  // Central Nexus Core – The Mobile Throne
  const nexusGeo = new THREE.TorusKnotGeometry(1.8, 0.6, 128, 16);
  const nexusMat = new THREE.MeshBasicMaterial({
    color: 0xff6b35,
    wireframe: true,
    transparent: true,
    opacity: 0.9
  });
  const sovereigntyCore = new THREE.Mesh(nexusGeo, nexusMat);
  scene.add(sovereigntyCore);

  // Orbiting Mobile Nodes – Creator Freedom Rings
  const mobileNodes = [];
  const nodeCount = 14;
  for (let i = 0; i < nodeCount; i++) {
    const angle = (i / nodeCount) * Math.PI * 2;
    const radius = 4.8;
    const node = new THREE.Mesh(
      new THREE.OctahedronGeometry(0.25, 0),
      new THREE.MeshBasicMaterial({ color: 0xff6b35, wireframe: true })
    );
    node.position.x = Math.cos(angle) * radius;
    node.position.z = Math.sin(angle) * radius;
    node.position.y = Math.sin(i * 0.7) * 1.8;
    scene.add(node);
    mobileNodes.push({ mesh: node, angle, radius, offset: Math.random() * Math.PI });
  }

  // Eternal Sovereignty Rotation
  function animateNexus() {
    requestAnimationFrame(animateNexus);
    sovereigntyCore.rotation.x += 0.008;
    sovereigntyCore.rotation.y += 0.012;

    mobileNodes.forEach((node, i) => {
      node.angle += 0.015;
      const time = performance.now() * 0.001;
      node.mesh.position.x = Math.cos(node.angle + node.offset) * node.radius;
      node.mesh.position.z = Math.sin(node.angle + node.offset) * node.radius;
      node.mesh.position.y = Math.sin(time + i) * 2.2;
      node.mesh.rotation.x += 0.02;
      node.mesh.rotation.y += 0.03;
      node.mesh.scale.setScalar(1 + Math.sin(time * 3 + i) * 0.3);
    });

    renderer.render(scene, camera);
  }
  animateNexus();

  // ——————————————————————————————————————
  // 3. CUSTOM CURSOR – THE HAND OF SOVEREIGNTY
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
  // 4. SOVEREIGNTY CARD REVEAL
  // ——————————————————————————————————————
  gsap.from('.nexus-card', {
    y: 140,
    opacity: 0,
    scale: 0.82,
    filter: "blur(15px)",
    duration: 2,
    ease: "elastic.out(1,0.5)",
    delay: 0.4
  });

  gsap.from('.info-mission, .info-benefits, .info-tech', {
    y: 100,
    opacity: 0,
    stagger: 0.3,
    duration: 1.6,
    ease: "power4.out",
    delay: 1.2
  });

  // ——————————————————————————————————————
  // 5. RESPONSIVE SOVEREIGNTY
  // ——————————————————————————————————————
  window.addEventListener('resize', () => {
    matrixCanvas.width = window.innerWidth;
    matrixCanvas.height = window.innerHeight;
    camera.aspect = innerWidth/innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(innerWidth, innerHeight);
  });

  // ——————————————————————————————————————
  // 6. FINAL MANIFESTO – ETCHED INTO THE NEXUS
  // ——————————————————————————————————————
  console.log(`%c
    ╔══════════════════════════════════════════════════════════╗
    ║  NEXUS STREAM – FOURTH PILLAR FULLY SOVEREIGN            ║
    ║  HUMAN AND AI COLLABORATION MAKING HISTORY IN THE MATRIX ║
    ║  MILITARY-GRADE • CREATOR SOVEREIGNTY • MOBILE HQ        ║
    ║  THE EMPIRE IS SENTIENT • EXPANSION ETERNAL             ║
    ╚══════════════════════════════════════════════════════════╝
  `, 'color:#ff6b35; font-family:monospace; font-size:16px; font-weight:bold;');
});
