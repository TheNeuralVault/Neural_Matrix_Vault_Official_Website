// /// NEURAL CORE: 3D PARTICLE SYSTEM ///
console.log("/// NEURAL CORE: ONLINE");

const container = document.getElementById('neural-canvas');
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });

renderer.setSize(window.innerWidth, window.innerHeight);
container.appendChild(renderer.domElement);

// GEOMETRY
const particlesGeometry = new THREE.BufferGeometry();
const particlesCount = 1200;
const posArray = new Float32Array(particlesCount * 3);

for(let i = 0; i < particlesCount * 3; i++) {
    // Create a sphere distribution
    posArray[i] = (Math.random() - 0.5) * 15;
}

particlesGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));

// MATERIAL
const particlesMaterial = new THREE.PointsMaterial({
    size: 0.03,
    color: 0x00f3ff, // CYAN
    transparent: true,
    opacity: 0.8,
});

// MESH
const particlesMesh = new THREE.Points(particlesGeometry, particlesMaterial);
scene.add(particlesMesh);

camera.position.z = 5;

// ANIMATION LOOP
function animate() {
    requestAnimationFrame(animate);
    
    // Rotation logic
    particlesMesh.rotation.y += 0.002;
    particlesMesh.rotation.x += 0.001;
    
    // Wave effect
    particlesMesh.position.y = Math.sin(Date.now() * 0.0005) * 0.2;

    renderer.render(scene, camera);
}
animate();

// RESIZE HANDLER
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});
