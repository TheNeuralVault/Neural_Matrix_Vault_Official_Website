// /// NEURAL CORE: SYNAPTIC ENGINE ///
console.log("/// NEURAL CORE: ONLINE");

// --- 1. THE 3D BRAIN (THREE.JS) ---
const container = document.getElementById('neural-canvas');
if (container) {
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });

    renderer.setSize(window.innerWidth, window.innerHeight);
    container.appendChild(renderer.domElement);

    // Create the Neural Web (Points + Lines)
    const particleCount = 600; 
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);

    // Spherical Distribution
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

    // Wireframe Sphere (The Synapses)
    const wireGeo = new THREE.IcosahedronGeometry(8, 2);
    const wireMat = new THREE.MeshBasicMaterial({ color: 0x00f3ff, wireframe: true, transparent: true, opacity: 0.05 });
    const network = new THREE.Mesh(wireGeo, wireMat);
    scene.add(network);

    camera.position.z = 15;

    // Interaction Variables
    let mouseX = 0;
    let mouseY = 0;
    document.addEventListener('mousemove', (e) => {
        mouseX = (e.clientX - window.innerWidth / 2) * 0.001;
        mouseY = (e.clientY - window.innerHeight / 2) * 0.001;
    });

    // Animation Loop
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

    // Resize Handler
    window.addEventListener('resize', () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    });
}

// --- 2. TERMINAL TAB LOGIC ---
const tabStrategy = document.getElementById('tab-strategy');
const tabTechnical = document.getElementById('tab-technical');
const contentStrategy = document.getElementById('content-strategy');
const contentTechnical = document.getElementById('content-technical');

if (tabStrategy && tabTechnical) {
    tabStrategy.addEventListener('click', () => {
        tabStrategy.classList.add('active');
        tabTechnical.classList.remove('active');
        
        contentStrategy.style.display = 'block';
        contentTechnical.style.display = 'none';
        
        // GSAP Fade In
        if(window.gsap) {
            gsap.fromTo(contentStrategy, {opacity:0, y:10}, {opacity:1, y:0, duration:0.3});
        }
    });

    tabTechnical.addEventListener('click', () => {
        tabTechnical.classList.add('active');
        tabStrategy.classList.remove('active');
        
        contentTechnical.style.display = 'block';
        contentStrategy.style.display = 'none';
        
        if(window.gsap) {
            gsap.fromTo(contentTechnical, {opacity:0, y:10}, {opacity:1, y:0, duration:0.3});
        }
    });
}
