// --- SYSTEM START ---
console.log("%c/// NEURAL MATRIX VAULT: INITIALIZED", "color:#00f3ff; font-weight:bold;");
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

// --- 3. MATRIX RAIN ENGINE ---
const mCanvas = document.getElementById('matrix-rain');
const mCtx = mCanvas.getContext('2d');
let mWidth = mCanvas.width = window.innerWidth;
let mHeight = mCanvas.height = window.innerHeight;

const chars = "010101XYZA0101".split("");
const fontSize = 14;
const columns = mWidth / fontSize;
const drops = Array(Math.floor(columns)).fill(1);

function drawMatrix() {
    mCtx.fillStyle = "rgba(5, 5, 5, 0.05)";
    mCtx.fillRect(0, 0, mWidth, mHeight);
    mCtx.fillStyle = "#00f3ff";
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

// --- 4. 3D WEBGL GLOBE ---
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ canvas: document.getElementById('webgl-scene'), alpha: true });
renderer.setSize(window.innerWidth, window.innerHeight);

const geometry = new THREE.BufferGeometry();
const count = 2000;
const posArray = new Float32Array(count * 3);
for(let i = 0; i < count * 3; i++) {
    posArray[i] = (Math.random() - 0.5) * 10;
}
geometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
const material = new THREE.PointsMaterial({ size: 0.02, color: 0xbc13fe });
const particleMesh = new THREE.Points(geometry, material);
scene.add(particleMesh);
camera.position.z = 3;

let mouseX = 0;
let mouseY = 0;
document.addEventListener('mousemove', (event) => {
    mouseX = event.clientX / window.innerWidth - 0.5;
    mouseY = event.clientY / window.innerHeight - 0.5;
});

function animate3D() {
    requestAnimationFrame(animate3D);
    particleMesh.rotation.y += 0.001 + (mouseX * 0.05);
    particleMesh.rotation.x += 0.001 + (mouseY * 0.05);
    renderer.render(scene, camera);
}
animate3D();

// --- 5. ANIMATION TRIGGERS ---
gsap.registerPlugin(ScrollTrigger);
gsap.from(".cell", {
    scrollTrigger: { trigger: ".bento-grid", start: "top 80%" },
    y: 50, opacity: 0, duration: 1, stagger: 0.1, ease: "power3.out"
});
