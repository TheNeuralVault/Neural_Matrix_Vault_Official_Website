// /// CREATOR: THE NEXUS ENGINE ///

class NexusEngine {
    constructor() {
        this.container = document.getElementById('gl-viewport');
        if (!this.container) return;

        this.scene = new THREE.Scene();
        this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        this.camera.position.z = 600;
        
        // Calculate FOV to match DOM pixels
        this.camera.fov = 2 * Math.atan((window.innerHeight / 2) / 600) * (180 / Math.PI);

        this.renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        this.container.appendChild(this.renderer.domElement);

        this.images = [...document.querySelectorAll('.gl-image')];
        this.meshItems = [];
        
        this.setupScene();
        this.initScroll();
        this.animate();
        
        window.addEventListener('resize', () => this.resize());
    }

    setupScene() {
        const loader = new THREE.TextureLoader();

        this.images.forEach((img) => {
            // Load texture with CORS safety
            const texture = loader.load(img.src);
            const geometry = new THREE.PlaneGeometry(1, 1, 20, 20); 
            
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
                        // WARP: Bend Y based on X sine wave
                        newPosition.y += sin(uv.x * 3.14) * uOffset.y * 1.0;
                        gl_Position = projectionMatrix * modelViewMatrix * vec4(newPosition, 1.0);
                    }
                `,
                fragmentShader: `
                    uniform sampler2D uTexture;
                    varying vec2 vUv;
                    void main() {
                        gl_FragColor = texture2D(uTexture, vUv);
                    }
                `,
                transparent: true
            });

            const mesh = new THREE.Mesh(geometry, material);
            this.scene.add(mesh);
            this.meshItems.push({ mesh, img });
        });
    }

    syncPositions() {
        this.meshItems.forEach(({ mesh, img }) => {
            const bounds = img.getBoundingClientRect();
            
            // 1. Update Scale
            mesh.scale.set(bounds.width, bounds.height, 1);
            
            // 2. Update Position (Center of screen is 0,0)
            mesh.position.x = bounds.left - window.innerWidth / 2 + bounds.width / 2;
            mesh.position.y = -bounds.top + window.innerHeight / 2 - bounds.height / 2;
        });
    }

    initScroll() {
        this.lenis = new Lenis({
            duration: 1.2,
            smooth: true
        });

        this.lenis.on('scroll', (e) => {
            // Send velocity to shader
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
        this.camera.fov = 2 * Math.atan((window.innerHeight / 2) / 600) * (180 / Math.PI);
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(window.innerWidth, window.innerHeight);
    }
}

// --- BOOT ---
window.onload = () => {
    new NexusEngine();
};
