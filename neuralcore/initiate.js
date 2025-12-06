document.addEventListener('DOMContentLoaded', () => {
    console.log("/// INITIATE PROTOCOL STARTED");

    // --- 1. RENDER ENGINE (THREE.JS) ---
    try {
        const container = document.getElementById('gl-viewport');
        const scene = new THREE.Scene();
        scene.fog = new THREE.FogExp2(0x000000, 0.02);

        const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        camera.position.set(0, 5, 20);

        const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        container.appendChild(renderer.domElement);

        // Lights
        const ambient = new THREE.AmbientLight(0x404040);
        scene.add(ambient);
        const dirLight = new THREE.DirectionalLight(0xffffff, 1);
        dirLight.position.set(10, 20, 10);
        scene.add(dirLight);
        const accentLight = new THREE.PointLight(0x00f3ff, 2, 50);
        accentLight.position.set(0, 10, 0);
        scene.add(accentLight);

        // Monolith Field (InstancedMesh)
        const count = 800; // Reduced count for mobile performance
        const geometry = new THREE.BoxGeometry(1, 1, 1);
        const material = new THREE.MeshPhysicalMaterial({
            color: 0x111111,
            metalness: 0.8,
            roughness: 0.2,
            clearcoat: 1.0
        });

        const monoliths = new THREE.InstancedMesh(geometry, material, count);
        const dummy = new THREE.Object3D();
        
        for (let i = 0; i < count; i++) {
            const x = (Math.random() - 0.5) * 60;
            const z = (Math.random() - 0.5) * 60;
            const y = Math.random() * Math.random() * 10;
            
            dummy.position.set(x, y - 5, z);
            dummy.scale.set(0.5 + Math.random(), 1 + Math.random() * 5, 0.5 + Math.random());
            dummy.updateMatrix();
            monoliths.setMatrixAt(i, dummy.matrix);
        }
        scene.add(monoliths);

        // Animation Loop
        let time = 0;
        function animate() {
            requestAnimationFrame(animate);
            time += 0.002;
            monoliths.rotation.y = Math.sin(time * 0.5) * 0.05;
            renderer.render(scene, camera);
        }
        animate();

        // Resize
        window.addEventListener('resize', () => {
            camera.aspect = window.innerWidth / window.innerHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(window.innerWidth, window.innerHeight);
        });

    } catch (e) {
        console.error("WebGL Failed:", e);
    }

    // --- 2. SCROLL PHYSICS (LENIS + GSAP) ---
    try {
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

        // Scroll Triggers
        gsap.registerPlugin(ScrollTrigger);
        
        const chapters = document.querySelectorAll('.chapter');
        chapters.forEach(chapter => {
            // Force initial state
            gsap.set(chapter, { opacity: 0, y: 50 });
            
            gsap.to(chapter, {
                opacity: 1,
                y: 0,
                duration: 1.5,
                ease: "power4.out",
                scrollTrigger: {
                    trigger: chapter,
                    start: "top 75%",
                    toggleActions: "play none none reverse"
                }
            });
        });

    } catch (e) {
        console.error("Animation Engine Failed:", e);
        // Fallback: Make everything visible if JS fails
        document.querySelectorAll('.chapter').forEach(el => el.style.opacity = 1);
    }

    // --- 3. UI LOGIC ---
    const modal = document.getElementById('modal');
    const trigger = document.getElementById('deployTrigger');
    const close = document.getElementById('closeModal');

    if(trigger && modal && close) {
        trigger.onclick = () => {
            modal.style.display = 'flex';
            gsap.fromTo(".modal-frame", {y: 50, opacity: 0}, {y: 0, opacity: 1, duration: 0.4});
        };
        close.onclick = () => {
            gsap.to(".modal-frame", {y: 50, opacity: 0, duration: 0.3, onComplete: () => modal.style.display = 'none'});
        };
    }
});
