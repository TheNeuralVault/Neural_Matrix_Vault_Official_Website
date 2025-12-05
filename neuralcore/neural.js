/**
 * NEURAL CORE: INITIATE PROTOCOL
 * ARCHITECT: MAGNUS OPUS
 * RENDER ENGINE: THREE.JS + INSTANCED MESHING
 */

class InitiateEngine {
    constructor() {
        this.container = document.getElementById('gl-viewport');
        this.scene = null;
        this.camera = null;
        this.renderer = null;
        this.monoliths = null;
        this.time = 0;
        
        // Configuration
        this.config = {
            count: 1500,
            color: 0x111111,
            highlight: 0x00f3ff,
            fogDensity: 0.02
        };

        this.init();
        this.createMonolithField();
        this.initLights();
        this.animate();
        this.handleResize();
    }

    init() {
        // Scene Setup
        this.scene = new THREE.Scene();
        this.scene.fog = new THREE.FogExp2(0x000000, this.config.fogDensity);

        // Camera Setup
        this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        this.camera.position.set(0, 5, 20);

        // Renderer Setup
        this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        this.container.appendChild(this.renderer.domElement);
    }

    initLights() {
        // Cinematic Lighting
        const ambient = new THREE.AmbientLight(0x404040);
        this.scene.add(ambient);

        const dirLight = new THREE.DirectionalLight(0xffffff, 1);
        dirLight.position.set(10, 20, 10);
        this.scene.add(dirLight);

        const accentLight = new THREE.PointLight(this.config.highlight, 2, 50);
        accentLight.position.set(0, 10, 0);
        this.scene.add(accentLight);
    }

    createMonolithField() {
        // Algorithmic Geometry: InstancedMesh for O(1) Draw Calls
        const geometry = new THREE.BoxGeometry(1, 1, 1);
        const material = new THREE.MeshPhysicalMaterial({
            color: this.config.color,
            metalness: 0.8,
            roughness: 0.2,
            clearcoat: 1.0
        });

        this.monoliths = new THREE.InstancedMesh(geometry, material, this.config.count);
        
        const dummy = new THREE.Object3D();
        const width = 60;
        const depth = 60;

        for (let i = 0; i < this.config.count; i++) {
            // Procedural Distribution
            const x = (Math.random() - 0.5) * width;
            const z = (Math.random() - 0.5) * depth;
            const y = Math.random() * Math.random() * 10; // Bias towards bottom

            // Scale variation based on Perlin-like noise logic (simplified)
            const scaleY = Math.random() * 5 + 1;
            const scaleXZ = Math.random() * 0.5 + 0.5;

            dummy.position.set(x, y - 5, z);
            dummy.scale.set(scaleXZ, scaleY, scaleXZ);
            dummy.updateMatrix();
            
            this.monoliths.setMatrixAt(i, dummy.matrix);
        }

        this.scene.add(this.monoliths);
    }

    animate() {
        requestAnimationFrame(this.animate.bind(this));
        this.time += 0.002;

        // Subtle World Rotation (Quaternion-like smoothness)
        this.monoliths.rotation.y = Math.sin(this.time * 0.5) * 0.05;

        this.renderer.render(this.scene, this.camera);
    }

    handleResize() {
        window.addEventListener('resize', () => {
            this.camera.aspect = window.innerWidth / window.innerHeight;
            this.camera.updateProjectionMatrix();
            this.renderer.setSize(window.innerWidth, window.innerHeight);
        });
    }

    updateCamera(scrollProgress) {
        // Cinematic Camera Move based on Scroll
        // Uses linear interpolation for smooth tracking
        const yPos = 5 + scrollProgress * 10;
        const zPos = 20 - scrollProgress * 10;
        
        gsap.to(this.camera.position, {
            y: yPos,
            z: zPos,
            duration: 1,
            ease: "power2.out"
        });
        
        this.camera.lookAt(0, 0, 0);
    }
}

// --- INITIALIZATION ---
const engine = new InitiateEngine();

// --- SCROLL PHYSICS (LENIS) ---
const lenis = new Lenis({
    duration: 1.5,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    smooth: true
});

function raf(time) {
    lenis.raf(time);
    requestAnimationFrame(raf);
}
requestAnimationFrame(raf);

// --- SCROLL TRIGGERS ---
gsap.registerPlugin(ScrollTrigger);

// Link Scroll to 3D Engine
lenis.on('scroll', (e) => {
    const progress = e.scroll / (document.body.scrollHeight - window.innerHeight);
    engine.updateCamera(progress);
});

// Text Reveals
const chapters = document.querySelectorAll('.chapter');
chapters.forEach(chapter => {
    gsap.to(chapter, {
        opacity: 1,
        y: 0,
        duration: 1.5,
        ease: "power4.out",
        scrollTrigger: {
            trigger: chapter,
            start: "top 70%",
            end: "bottom 30%",
            toggleActions: "play reverse play reverse"
        }
    });
});

// --- UI LOGIC ---
const modal = document.getElementById('modal');
const trigger = document.getElementById('deployTrigger');
const close = document.getElementById('closeModal');

trigger.onclick = () => {
    modal.style.display = 'flex';
    gsap.fromTo(".modal-frame", {y: 50, opacity: 0}, {y: 0, opacity: 1, duration: 0.4, ease: "back.out(1.7)"});
};

close.onclick = () => {
    gsap.to(".modal-frame", {y: 50, opacity: 0, duration: 0.3, onComplete: () => modal.style.display = 'none'});
};
