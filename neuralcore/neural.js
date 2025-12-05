// /// NEURAL CORE: SYNAPTIC ENGINE ///
console.log("/// NEURAL CORE: ONLINE");

const container = document.getElementById('neural-canvas');
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });

renderer.setSize(window.innerWidth, window.innerHeight);
container.appendChild(renderer.domElement);

// --- CREATE THE BRAIN (POINTS + LINES) ---
const particleCount = 600; // Optimized for mobile
const geometry = new THREE.BufferGeometry();
const positions = new Float32Array(particleCount * 3);

// Create a spherical distribution
for(let i = 0; i < particleCount * 3; i+=3) {
    const r = 8;
    const theta = Math.random() * Math.PI * 2;
    const phi = Math.acos(2 * Math.random() - 1);
    
    positions[i] = r * Math.sin(phi) * Math.cos(theta);
    positions[i+1] = r * Math.sin(phi) * Math.sin(theta);
    positions[i+2] = r * Math.cos(phi);
}

geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));

// Materials
const pMaterial = new THREE.PointsMaterial({ size: 0.05, color: 0x00f3ff, transparent: true, opacity: 0.8 });
const particles = new THREE.Points(geometry, pMaterial);
scene.add(particles);

// Lines (The Synapses)
// Note: Full line mesh is heavy. We use a wireframe sphere for the structure to save performance while looking complex.
const wireGeo = new THREE.IcosahedronGeometry(8, 2);
const wireMat = new THREE.MeshBasicMaterial({ color: 0x00f3ff, wireframe: true, transparent: true, opacity: 0.05 });
const network = new THREE.Mesh(wireGeo, wireMat);
scene.add(network);

camera.position.z = 15;

// --- INTERACTION ---
let mouseX = 0;
let mouseY = 0;
document.addEventListener('mousemove', (e) => {
    mouseX = (e.clientX - window.innerWidth / 2) * 0.001;
    mouseY = (e.clientY - window.innerHeight / 2) * 0.001;
});

// --- ANIMATION LOOP ---
function animate() {
    requestAnimationFrame(animate);
    
    // Rotate based on mouse + auto rotation
    particles.rotation.y += 0.002 + mouseX * 0.1;
    particles.rotation.x += mouseY * 0.1;
    
    network.rotation.y += 0.002 + mouseX * 0.1;
    network.rotation.x += mouseY * 0.1;
    
    // Pulse effect
    const time = Date.now() * 0.001;
    network.scale.setScalar(1 + Math.sin(time) * 0.02);

    renderer.render(scene, camera);
}
animate();

// --- RESIZE ---
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});

// --- TERMINAL LOGIC ---
window.switchTab = function(type, btn) {
    // Reset buttons
    document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
    btn.classList.add('active');
    
    // Hide all content
    document.getElementById('content-plain').style.display = 'none';
    document.getElementById('content-tech').style.display = 'none';
    
    // Show selected
    const content = document.getElementById('content-' + type);
    content.style.display = 'block';
    
    // GSAP Fade In
    gsap.fromTo(content, {opacity: 0, y: 10}, {opacity: 1, y: 0, duration: 0.3});
};
