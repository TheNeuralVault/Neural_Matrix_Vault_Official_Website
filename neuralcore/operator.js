// /// OPERATOR PROTOCOL: LIQUID CHROME ///

const container = document.getElementById('canvas-container');
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth/window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({antialias:true, alpha:true});

renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.outputEncoding = THREE.sRGBEncoding;
container.appendChild(renderer.domElement);

// --- LIGHTING (CINEMATIC) ---
const ambientLight = new THREE.AmbientLight(0x111111);
scene.add(ambientLight);

const light1 = new THREE.PointLight(0x00f3ff, 2, 50);
light1.position.set(10, 10, 10);
scene.add(light1);

const light2 = new THREE.PointLight(0xff0055, 2, 50);
light2.position.set(-10, -10, 10);
scene.add(light2);

const rectLight = new THREE.RectAreaLight(0xffffff, 5, 10, 10);
rectLight.position.set(0, 5, 5);
rectLight.lookAt(0, 0, 0);
scene.add(rectLight);

// --- THE ARTIFACT (LIQUID SPHERE) ---
// High segment count for smooth displacement
const geometry = new THREE.IcosahedronGeometry(2.5, 30); 

const material = new THREE.MeshPhysicalMaterial({
    color: 0x111111,
    metalness: 1.0,
    roughness: 0.1,
    clearcoat: 1.0,
    clearcoatRoughness: 0.1,
    reflectivity: 1.0
});

const sphere = new THREE.Mesh(geometry, material);
scene.add(sphere);

camera.position.z = 7;

// --- PHYSICS VARIABLES ---
let mouseX = 0;
let mouseY = 0;
const originalPositions = geometry.attributes.position.array.slice();

// --- INTERACTION ---
document.addEventListener('mousemove', (e) => {
    mouseX = (e.clientX / window.innerWidth) * 2 - 1;
    mouseY = -(e.clientY / window.innerHeight) * 2 + 1;
});

// --- RENDER LOOP ---
function animate() {
    requestAnimationFrame(animate);
    const time = Date.now() * 0.001;

    // 1. Rotation based on mouse
    sphere.rotation.y += 0.002;
    sphere.rotation.x += (mouseY * 0.2 - sphere.rotation.x) * 0.05;
    sphere.rotation.y += (mouseX * 0.2 - sphere.rotation.y) * 0.05;

    // 2. Vertex Displacement (Liquid Effect)
    const positions = geometry.attributes.position.array;
    
    for(let i = 0; i < positions.length; i += 3) {
        const x = originalPositions[i];
        const y = originalPositions[i+1];
        const z = originalPositions[i+2];

        // Noise-like wave function
        const wave1 = Math.sin(x * 2 + time * 1.5);
        const wave2 = Math.cos(y * 1.5 + time * 2);
        const wave3 = Math.sin(z * 2 + time);
        
        const displacement = (wave1 + wave2 + wave3) * 0.15;
        
        // Apply displacement along normal vector (simplified as scaling for sphere)
        const scale = 1 + displacement * 0.1;
        
        positions[i] = x * scale;
        positions[i+1] = y * scale;
        positions[i+2] = z * scale;
    }
    
    geometry.attributes.position.needsUpdate = true;
    geometry.computeVertexNormals(); // Critical for lighting updates

    renderer.render(scene, camera);
}
animate();

// --- RESIZE ---
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});

// --- UI LOGIC ---
const modal = document.getElementById('modal');
document.getElementById('deployBtn').onclick = () => {
    modal.style.display = 'flex';
    gsap.fromTo(".form-box", {scale:0.9, opacity:0}, {scale:1, opacity:1, duration:0.3});
};
document.getElementById('closeBtn').onclick = () => modal.style.display = 'none';
