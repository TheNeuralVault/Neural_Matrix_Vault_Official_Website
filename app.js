// --- SYSTEM START ---
console.log("%c/// NEURAL MATRIX VAULT: SYSTEM UPGRADE IN PROGRESS", "color:#ffaa00; font-weight:bold;");
lucide.createIcons();

// --- 1. SMOOTH SCROLL ---
const lenis = new Lenis({ duration: 1.2, smooth: true });
function raf(time) { lenis.raf(time); requestAnimationFrame(raf); }
requestAnimationFrame(raf);

// --- 2. CURSOR PHYSICS ---
const cursorDot = document.querySelector('.cursor-dot');
const cursorCircle = document.querySelector('.cursor-circle');

document.addEventListener('mousemove', (e) => {
    gsap.to(cursorDot, { x: e.clientX, y: e.clientY, duration: 0 });
    gsap.to(cursorCircle, { x: e.clientX - 20, y: e.clientY - 20, duration: 0.15 });
});

// --- 3. CHROMATIC MATRIX RAIN ENGINE ---
const mCanvas = document.getElementById('matrix-rain');
const mCtx = mCanvas.getContext('2d');
let mWidth = mCanvas.width = window.innerWidth;
let mHeight = mCanvas.height = window.innerHeight;

const chars = "010101XYZA0101".split("");
const fontSize = 14;
const columns = mWidth / fontSize;
const drops = Array(Math.floor(columns)).fill(1);

const palette = [
    { r: 0, g: 243, b: 255 },   // Neon Blue
    { r: 10, g: 255, b: 10 },   // Matrix Green
    { r: 255, g: 215, b: 0 },   // Gold
    { r: 255, g: 255, b: 255 }, // White
    { r: 128, g: 128, b: 128 }, // Grey
    { r: 255, g: 0, b: 0 }      // Red
];

let time = 0;

function drawMatrix() {
    mCtx.fillStyle = "rgba(5, 5, 5, 0.05)";
    mCtx.fillRect(0, 0, mWidth, mHeight);

    time += 0.005;
    const index = Math.floor(time) % palette.length;
    const nextIndex = (index + 1) % palette.length;
    const factor = time - Math.floor(time);
    
    const r = Math.round(palette[index].r + (palette[nextIndex].r - palette[index].r) * factor);
    const g = Math.round(palette[index].g + (palette[nextIndex].g - palette[index].g) * factor);
    const b = Math.round(palette[index].b + (palette[nextIndex].b - palette[index].b) * factor);
    
    mCtx.fillStyle = `rgb(${r},${g},${b})`;
    mCtx.font = fontSize + "px monospace";

    for (let i = 0; i < drops.length; i++) {
        const text = chars[Math.floor(Math.random() * chars.length)];
        mCtx.fillText(text, i * fontSize, drops[i] * fontSize);
        if (drops[i] * fontSize > mHeight && Math.random() > 0.975) drops[i] = 0;
        drops[i]++;
    }
    requestAnimationFrame(drawMatrix);
}
drawMatrix();

// --- 4. MASSIVE 3D DYSON SPHERE (THE EMPIRE) ---
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ canvas: document.getElementById('webgl-scene'), alpha: true });
renderer.setSize(window.innerWidth, window.innerHeight);

// IMPERIAL SCALE: Increased count to 6000 and Spread to 25
const geometry = new THREE.BufferGeometry();
const count = 6000;
const posArray = new Float32Array(count * 3);
for(let i = 0; i < count * 3; i++) {
    posArray[i] = (Math.random() - 0.5) * 25; // Massive Spread
}
geometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));

// Particle Material
const material = new THREE.PointsMaterial({ size: 0.03, color: 0xbc13fe });
const particleMesh = new THREE.Points(geometry, material);
scene.add(particleMesh);

// Camera is inside the swarm
camera.position.z = 5;

let mouseX = 0;
let mouseY = 0;
document.addEventListener('mousemove', (event) => {
    mouseX = event.clientX / window.innerWidth - 0.5;
    mouseY = event.clientY / window.innerHeight - 0.5;
});

function animate3D() {
    requestAnimationFrame(animate3D);
    // Majestic Slow Rotation
    particleMesh.rotation.y += 0.0005 + (mouseX * 0.02);
    particleMesh.rotation.x += 0.0005 + (mouseY * 0.02);
    renderer.render(scene, camera);
}
animate3D();

window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
    mWidth = mCanvas.width = window.innerWidth;
    mHeight = mCanvas.height = window.innerHeight;
});

// --- 5. ANIMATION TRIGGERS ---
gsap.registerPlugin(ScrollTrigger);
gsap.from(".cell", {
    scrollTrigger: { trigger: ".bento-grid", start: "top 80%" },
    y: 50, opacity: 0, duration: 1, stagger: 0.1, ease: "power3.out"
});
