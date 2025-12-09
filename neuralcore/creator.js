// /// CREATOR: THE NEXUS ENGINE ///

class NexusEngine {
    constructor() {
        this.container = document.getElementById('gl-viewport');
        this.scene = new THREE.Scene();
        this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        this.camera.position.z = 600;
        this.camera.fov = 2 * Math.atan((window.innerHeight / 2) / 600) * (180 / Math.PI);

        this.renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.container.appendChild(this.renderer.domElement);

        this.images = [...document.querySelectorAll('.gl-image')];
        this.meshItems = [];
        
        this.setupScene();
        this.initScroll();
        this.animate();
        
        window.addEventListener('resize', () => this.resize());
    }

    setupScene() {
        // Create a plane for each image in the DOM
        this.images.forEach((img, i) => {
            const texture = new THREE.TextureLoader().load(img.src);
            const geometry = new THREE.PlaneGeometry(1, 1, 20, 20); // Segments for warping
            
            // CUSTOM SHADER: LIQUID SCROLL
            const material = new THREE.ShaderMaterial({
                uniforms: {
                    uTexture: { value: texture },
                    uOffset: { value: new THREE.Vector2(0, 0) },
                    uAlpha: { value: 1 }
                },
                vertexShader: `
                    uniform vec2 uOffset;
                    varying vec2 vUv;
                    void main() {
                        vUv = uv;
                        vec3 newPosition = position;
                        // WARP ALGORITHM: Bend based on scroll velocity
                        newPosition.y += sin(uv.x * 3.14) * uOffset.y * 0.5;
                        gl_Position = projectionMatrix * modelViewMatrix * vec4(newPosition, 1.0);
                    }
                `,
                fragmentShader: `
                    uniform sampler2D uTexture;
                    varying vec2 vUv;
                    void main() {
                        gl_FragColor = texture2D(uTexture, vUv);
                    }
                `
            });

            const mesh = new THREE.Mesh(geometry, material);
            this.scene.add(mesh);
            this.meshItems.push({ mesh, img });
        });
    }

    syncPositions() {
        // Sync WebGL meshes to DOM image positions
        this.meshItems.forEach(({ mesh, img }) => {
            const bounds = img.getBoundingClientRect();
            
            // Scale mesh to match image
            mesh.scale.set(bounds.width, bounds.height, 1);
            
            // Position mesh (Convert DOM coords to WebGL coords)
            mesh.position.x = bounds.left - window.innerWidth / 2 + bounds.width / 2;
            mesh.position.y = -bounds.top + window.innerHeight / 2 - bounds.height / 2;
        });
    }

    initScroll() {
        this.lenis = new Lenis({
            duration: 1.2,
            easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
            smooth: true
        });

        this.lenis.on('scroll', (e) => {
            // Pass scroll velocity to shader
            this.meshItems.forEach(({ mesh }) => {
                mesh.material.uniforms.uOffset.value.y = e.velocity * 0.05;
            });
        });
    }

    animate() {
        requestAnimationFrame(() => this.animate());
        this.lenis.raf(Date.now());
        this.syncPositions();
        this.renderer.render(this.scene, this.camera);
    }

    resize() {
        this.camera.aspect = window.innerWidth / window.innerHeight;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(window.innerWidth, window.innerHeight);
    }
}

// --- INITIALIZATION ---
window.onload = () => {
    new NexusEngine();
    
    // GSAP TEXT REVEALS
    gsap.registerPlugin(ScrollTrigger);
    
    const cards = document.querySelectorAll('.artifact-card');
    cards.forEach(card => {
        gsap.fromTo(card, 
            { opacity: 0, y: 100 },
            { 
                opacity: 1, y: 0, duration: 1, ease: "power3.out",
                scrollTrigger: { trigger: card, start: "top 80%" }
            }
        );
    });
};

// --- UI LOGIC ---
const modal = document.getElementById('modal');
const closeBtn = document.getElementById('closeModal');
// Attach to any button with 'nexus-btn' class that isn't a link
document.querySelectorAll('.nexus-btn').forEach(btn => {
    if(btn.getAttribute('href').startsWith('#')) return; // Ignore anchor links
    btn.addEventListener('click', (e) => {
        if(btn.tagName === 'BUTTON') { // Only open modal for buttons, not the stripe link
             e.preventDefault();
             modal.style.display = 'flex';
             gsap.fromTo(".modal-frame", {y: 50, opacity: 0}, {y: 0, opacity: 1, duration: 0.4});
        }
    });
});

closeBtn.onclick = () => {
    gsap.to(".modal-frame", {y: 50, opacity: 0, duration: 0.3, onComplete: () => modal.style.display = 'none'});
};
