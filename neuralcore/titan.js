// --- NEURAL NETWORK ENGINE ---
const scene = new THREE.Scene();
scene.fog = new THREE.FogExp2(0x000000, 0.05);
const camera = new THREE.PerspectiveCamera(75, window.innerWidth/window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({antialias:true});
renderer.setSize(window.innerWidth, window.innerHeight);
document.getElementById('network').appendChild(renderer.domElement);

// Particles
const geometry = new THREE.BufferGeometry();
const count = 500;
const positions = new Float32Array(count * 3);

for(let i=0; i<count*3; i++) {
    positions[i] = (Math.random() - 0.5) * 20;
}
geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));

const material = new THREE.PointsMaterial({ size: 0.1, color: 0x00f3ff });
const particles = new THREE.Points(geometry, material);
scene.add(particles);

// Connections (Lines)
const lineMaterial = new THREE.LineBasicMaterial({ color: 0x00f3ff, transparent: true, opacity: 0.2 });
const linesGeometry = new THREE.BufferGeometry();
const lines = new THREE.LineSegments(linesGeometry, lineMaterial);
scene.add(lines);

camera.position.z = 10;

function animate() {
    requestAnimationFrame(animate);
    particles.rotation.y += 0.002;
    lines.rotation.y += 0.002;
    renderer.render(scene, camera);
}
animate();

// UI Logic
document.getElementById('deployBtn').onclick = () => document.getElementById('modal').style.display = 'flex';
document.getElementById('closeBtn').onclick = () => document.getElementById('modal').style.display = 'none';
