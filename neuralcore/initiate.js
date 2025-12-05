// --- WARP ENGINE (THREE.JS) ---
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth/window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({antialias:true, alpha:true});
renderer.setSize(window.innerWidth, window.innerHeight);
document.getElementById('canvas-container').appendChild(renderer.domElement);

// Procedural Grid
const geometry = new THREE.PlaneGeometry(100, 100, 40, 40);
const material = new THREE.MeshBasicMaterial({ color: 0x333333, wireframe: true });
const plane = new THREE.Mesh(geometry, material);
scene.add(plane);

camera.position.z = 10;
camera.rotation.x = 1;

let time = 0;
function animate() {
    requestAnimationFrame(animate);
    time += 0.01;
    
    const pos = geometry.attributes.position;
    for(let i=0; i<pos.count; i++){
        const x = pos.getX(i);
        const y = pos.getY(i);
        const z = Math.sin(x/2 + time) * Math.cos(y/2 + time) * 2;
        pos.setZ(i, z);
    }
    pos.needsUpdate = true;
    renderer.render(scene, camera);
}
animate();

// --- SCROLL PHYSICS (LENIS + GSAP) ---
const lenis = new Lenis();
function raf(time) { lenis.raf(time); requestAnimationFrame(raf); }
requestAnimationFrame(raf);

gsap.registerPlugin(ScrollTrigger);
gsap.utils.toArray('.big-text').forEach(text => {
    gsap.to(text, {
        opacity: 1, y: 0, duration: 1, scrollTrigger: { trigger: text, start: "top 80%" }
    });
});

// --- UI LOGIC ---
document.getElementById('deployBtn').onclick = () => document.getElementById('modal').style.display = 'flex';
document.getElementById('closeBtn').onclick = () => document.getElementById('modal').style.display = 'none';
