// /// CORPORATE: PROCEDURAL INSTANCING ENGINE ///

const container = document.getElementById('citadel-viewport');
const scene = new THREE.Scene();
scene.fog = new THREE.FogExp2(0x000000, 0.015); // Volumetric Fog

const camera = new THREE.PerspectiveCamera(45, window.innerWidth/window.innerHeight, 1, 2000);
camera.position.set(0, 50, 200);

const renderer = new THREE.WebGLRenderer({antialias:true});
renderer.setSize(window.innerWidth, window.innerHeight);
container.appendChild(renderer.domElement);

// ALGORITHMIC CITY GENERATION
const geometry = new THREE.BoxGeometry(1, 1, 1);
geometry.translate(0, 0.5, 0); // Pivot at bottom

const material = new THREE.MeshPhongMaterial({ 
    color: 0xffffff, 
    flatShading: true,
    shininess: 100 
});

const count = 4000; // High complexity
const mesh = new THREE.InstancedMesh(geometry, material, count);
const dummy = new THREE.Object3D();

for(let i=0; i<count; i++) {
    // Gaussian Distribution
    const angle = Math.random() * Math.PI * 2;
    const radius = Math.sqrt(Math.random()) * 300;
    const x = Math.cos(angle) * radius;
    const z = Math.sin(angle) * radius;
    
    // Height algorithm based on center proximity
    const dist = Math.sqrt(x*x + z*z);
    const height = (Math.random() * Math.random() * 80) + (300 / (dist + 10)) * 5;
    
    dummy.position.set(x, 0, z);
    dummy.scale.set(2 + Math.random()*4, height, 2 + Math.random()*4);
    dummy.updateMatrix();
    mesh.setMatrixAt(i, dummy.matrix);
}

scene.add(mesh);

// LIGHTING
const ambient = new THREE.AmbientLight(0x222222);
scene.add(ambient);
const dirLight = new THREE.DirectionalLight(0xffffff, 1);
dirLight.position.set(100, 100, 50);
scene.add(dirLight);
const blueLight = new THREE.PointLight(0x00f3ff, 2, 200);
blueLight.position.set(0, 50, 0);
scene.add(blueLight);

// ORBIT LOGIC
function animate() {
    requestAnimationFrame(animate);
    
    const time = Date.now() * 0.0001;
    camera.position.x = Math.sin(time) * 200;
    camera.position.z = Math.cos(time) * 200;
    camera.lookAt(0, 20, 0);
    
    renderer.render(scene, camera);
}
animate();

window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});

const lenis = new Lenis();
function raf(time) { lenis.raf(time); requestAnimationFrame(raf); }
requestAnimationFrame(raf);

// 1. STAT COUNTER ANIMATION
const stats = document.querySelectorAll('.num');
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if(entry.isIntersecting) {
            const target = +entry.target.getAttribute('data-val');
            gsap.to(entry.target, {
                innerHTML: target,
                duration: 2,
                snap: { innerHTML: 1 },
                ease: "power2.out"
            });
            observer.unobserve(entry.target);
        }
    });
});
stats.forEach(stat => observer.observe(stat));

// 2. ACCORDION LOGIC
const items = document.querySelectorAll('.acc-item');
items.forEach(item => {
    item.addEventListener('click', () => {
        // Close others
        items.forEach(i => {
            if(i !== item) i.classList.remove('active');
        });
        // Toggle current
        item.classList.toggle('active');
    });
});
