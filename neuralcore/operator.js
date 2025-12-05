// --- LIQUID CHROME ENGINE ---
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth/window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({antialias:true});
renderer.setSize(window.innerWidth, window.innerHeight);
document.getElementById('canvas').appendChild(renderer.domElement);

// Lighting
const light1 = new THREE.PointLight(0x00f3ff, 2, 50); light1.position.set(10, 10, 10); scene.add(light1);
const light2 = new THREE.PointLight(0xff0055, 2, 50); light2.position.set(-10, -10, 10); scene.add(light2);

// Liquid Sphere
const geometry = new THREE.IcosahedronGeometry(2.5, 6); 
const material = new THREE.MeshPhysicalMaterial({
    color: 0x111111, metalness: 1, roughness: 0, clearcoat: 1, clearcoatRoughness: 0.1
});
const sphere = new THREE.Mesh(geometry, material);
scene.add(sphere);
camera.position.z = 6;

let mouseX = 0, mouseY = 0;
document.addEventListener('mousemove', (e) => {
    mouseX = (e.clientX / window.innerWidth) * 2 - 1;
    mouseY = -(e.clientY / window.innerHeight) * 2 + 1;
});

function animate() {
    requestAnimationFrame(animate);
    sphere.rotation.y += 0.005;
    sphere.rotation.x += (mouseY * 0.5 - sphere.rotation.x) * 0.05;
    sphere.rotation.y += (mouseX * 0.5 - sphere.rotation.y) * 0.05;
    renderer.render(scene, camera);
}
animate();

// UI Logic
document.getElementById('deployBtn').onclick = () => document.getElementById('modal').style.display = 'flex';
document.getElementById('closeBtn').onclick = () => document.getElementById('modal').style.display = 'none';
