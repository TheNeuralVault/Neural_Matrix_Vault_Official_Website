// --- 1. INITIALIZE SYSTEM ---
console.log("%c SYSTEM ONLINE ", "background: #00f3ff; color: #000; font-weight: bold; padding: 5px;");
lucide.createIcons();

// --- 2. THE NERVOUS SYSTEM (Scroll & Cursor) ---
// Lenis: The spine of the site (smooth scroll)
const lenis = new Lenis({
    duration: 1.2,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    smooth: true
});
function raf(time) {
    lenis.raf(time);
    requestAnimationFrame(raf);
}
requestAnimationFrame(raf);

// Cursor Logic: The visual touch
const cursorMain = document.querySelector('.cursor-main');
const cursorFollower = document.querySelector('.cursor-follower');

document.addEventListener('mousemove', (e) => {
    // Direct link to nerves
    gsap.to(cursorMain, { x: e.clientX - 4, y: e.clientY - 4, duration: 0 });
    gsap.to(cursorFollower, { x: e.clientX - 20, y: e.clientY - 20, duration: 0.15 });
});

// Magnetic Elements
document.querySelectorAll('a, button, .glass-panel').forEach(el => {
    el.addEventListener('mouseenter', () => {
        gsap.to(cursorFollower, { scale: 2, borderColor: '#00f3ff', duration: 0.3 });
    });
    el.addEventListener('mouseleave', () => {
        gsap.to(cursorFollower, { scale: 1, borderColor: 'rgba(255,255,255,0.2)', duration: 0.3 });
    });
});

// --- 3. THE BRAIN (Three.js 3D Core) ---
const canvas = document.querySelector('#neuro-core');
const scene = new THREE.Scene();

// Camera (The Eye)
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.z = 5;

// Renderer (The Visualizer)
const renderer = new THREE.WebGLRenderer({ canvas: canvas, alpha: true, antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

// Geometry: The Neural Shape (Icosahedron)
const geometry = new THREE.IcosahedronGeometry(2, 1); // Size, Detail
const material = new THREE.MeshBasicMaterial({ 
    color: 0x00f3ff, 
    wireframe: true,
    transparent: true,
    opacity: 0.3
});
const core = new THREE.Mesh(geometry, material);
scene.add(core);

// Inner Core (The Soul)
const innerGeo = new THREE.IcosahedronGeometry(1, 0);
const innerMat = new THREE.MeshBasicMaterial({ color: 0xbc13fe, wireframe: true });
const innerCore = new THREE.Mesh(innerGeo, innerMat);
scene.add(innerCore);

// Particle Field (The Data)
const particlesGeo = new THREE.BufferGeometry();
const particlesCount = 700;
const posArray = new Float32Array(particlesCount * 3);

for(let i = 0; i < particlesCount * 3; i++) {
    // Spread particles across the screen
    posArray[i] = (Math.random() - 0.5) * 15;
}
particlesGeo.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
const particlesMat = new THREE.PointsMaterial({
    size: 0.02,
    color: 0xffffff,
    transparent: true,
    opacity: 0.5
});
const particlesMesh = new THREE.Points(particlesGeo, particlesMat);
scene.add(particlesMesh);

// --- 4. ORCHESTRATION (Animation Loop) ---
const clock = new THREE.Clock();

function animate() {
    const elapsedTime = clock.getElapsedTime();

    // Rotate the Core
    core.rotation.y = elapsedTime * 0.1;
    core.rotation.x = elapsedTime * 0.05;
    
    // Rotate Inner Core Faster
    innerCore.rotation.y = elapsedTime * -0.2;
    innerCore.rotation.x = elapsedTime * -0.1;

    // Pulse the Core (Breathing)
    const scale = 1 + Math.sin(elapsedTime) * 0.05;
    core.scale.set(scale, scale, scale);

    // Float Particles
    particlesMesh.rotation.y = elapsedTime * 0.05;

    renderer.render(scene, camera);
    requestAnimationFrame(animate);
}
animate();

// Handle Window Resize (Responsiveness)
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});

// --- 5. ANIMATION TRIGGERS (GSAP) ---
gsap.registerPlugin(ScrollTrigger);

// Hero Text Reveal
gsap.from(".line-1", {
    y: 100, opacity: 0, duration: 1.5, ease: "power4.out", delay: 0.2
});
gsap.from(".line-2", {
    y: 100, opacity: 0, duration: 1.5, ease: "power4.out", delay: 0.4
});

// Bento Grid Stagger
gsap.from(".cell", {
    scrollTrigger: {
        trigger: ".bento-grid",
        start: "top 80%",
    },
    y: 50,
    opacity: 0,
    duration: 1,
    stagger: 0.2,
    ease: "power3.out"
});
