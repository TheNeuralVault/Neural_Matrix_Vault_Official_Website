// /// INITIATE: PRISM ENGINE ///

// CONFIGURATION
const ASSETS = {
    creator: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=2564&auto=format&fit=crop', // Abstract Dark
    corporate: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=2670&auto=format&fit=crop', // Skyscraper
    retail: 'https://images.unsplash.com/photo-1555529669-e69e7aa0ba9a?q=80&w=2670&auto=format&fit=crop' // Neon Shop
};

const TEXT = {
    creator: {
        label: "THE VISIONARY",
        title: "DEFINING<br>AESTHETICS.",
        sub: "High-fidelity portfolio architecture for photographers, designers, and artists. Dark mode native."
    },
    corporate: {
        label: "GLOBAL TRUST",
        title: "STRUCTURE<br>& SCALE.",
        sub: "Clean, serif-based typography for law firms, consultancies, and agencies. White space dominance."
    },
    retail: {
        label: "HYPER COMMERCE",
        title: "AGGRESSIVE<br>VELOCITY.",
        sub: "High-conversion layout for product drops and e-commerce. Speed focused."
    }
};

// --- 1. WEBGL SHADER ENGINE ---
class PrismScene {
    constructor() {
        this.container = document.getElementById('gl-container');
        this.scene = new THREE.Scene();
        this.camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
        this.renderer = new THREE.WebGLRenderer({ alpha: true });
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.container.appendChild(this.renderer.domElement);
        
        this.textures = {};
        this.currentMode = 'creator';
        this.material = null;
        
        this.loadTextures();
        this.initMesh();
        this.animate();
        window.addEventListener('resize', () => this.resize());
    }

    loadTextures() {
        const loader = new THREE.TextureLoader();
        for (const [key, url] of Object.entries(ASSETS)) {
            this.textures[key] = loader.load(url);
        }
    }

    initMesh() {
        const geometry = new THREE.PlaneGeometry(2, 2);
        
        // LIQUID WARP SHADER
        this.material = new THREE.ShaderMaterial({
            uniforms: {
                uTime: { value: 0 },
                uTexture1: { value: this.textures.creator }, // Start with Creator
                uTexture2: { value: this.textures.corporate },
                uDisp: { value: 0 }, // 0 = Tex1, 1 = Tex2
                uRes: { value: new THREE.Vector2(window.innerWidth, window.innerHeight) }
            },
            vertexShader: `
                varying vec2 vUv;
                void main() {
                    vUv = uv;
                    gl_Position = vec4(position, 1.0);
                }
            `,
            fragmentShader: `
                uniform float uTime;
                uniform sampler2D uTexture1;
                uniform sampler2D uTexture2;
                uniform float uDisp;
                uniform vec2 uRes;
                varying vec2 vUv;

                // COVER FIT LOGIC
                vec2 cover(vec2 uv, vec2 res) {
                    vec2 s = vec2(1.0); // Texture aspect (assuming square for simplicity or handled by loader)
                    return uv; 
                }

                void main() {
                    vec2 uv = vUv;
                    
                    // LIQUID DISTORTION
                    float noise = sin(uv.y * 10.0 + uTime) * 0.02;
                    float disp = uDisp;
                    
                    // Mix textures based on displacement
                    vec4 t1 = texture2D(uTexture1, uv + noise * disp);
                    vec4 t2 = texture2D(uTexture2, uv + noise * (1.0 - disp));
                    
                    gl_FragColor = mix(t1, t2, disp);
                    
                    // Darken for text readability
                    gl_FragColor.rgb *= 0.4; 
                }
            `
        });

        const mesh = new THREE.Mesh(geometry, this.material);
        this.scene.add(mesh);
    }

    switchTexture(newMode) {
        if(newMode === this.currentMode) return;
        
        // Set Texture 2 to the new mode
        this.material.uniforms.uTexture2.value = this.textures[newMode];
        
        // Animate uDisp from 0 to 1
        gsap.to(this.material.uniforms.uDisp, {
            value: 1,
            duration: 1.2,
            ease: "power2.inOut",
            onComplete: () => {
                // Swap textures and reset uDisp
                this.material.uniforms.uTexture1.value = this.textures[newMode];
                this.material.uniforms.uDisp.value = 0;
                this.currentMode = newMode;
            }
        });
    }

    animate() {
        requestAnimationFrame(() => this.animate());
        this.material.uniforms.uTime.value += 0.05;
        this.renderer.render(this.scene, this.camera);
    }

    resize() {
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.material.uniforms.uRes.value.set(window.innerWidth, window.innerHeight);
    }
}

// --- 2. UI CONTROLLER ---
const prism = new PrismScene();
const btns = document.querySelectorAll('.mode-btn');
const title = document.getElementById('main-title');
const sub = document.getElementById('sub-text');
const label = document.getElementById('label-text');
const formStyle = document.getElementById('form-style');

btns.forEach(btn => {
    btn.addEventListener('click', () => {
        // Update Buttons
        btns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        const mode = btn.getAttribute('data-mode');
        const data = TEXT[mode];

        // 1. Trigger WebGL Transition
        prism.switchTexture(mode);

        // 2. Trigger Text Animation (Out -> Change -> In)
        const tl = gsap.timeline();
        
        tl.to([title, sub, label], {
            y: -50,
            opacity: 0,
            duration: 0.4,
            stagger: 0.1,
            ease: "power2.in"
        })
        .call(() => {
            // Update Content
            title.innerHTML = data.title;
            sub.innerHTML = data.sub;
            label.innerHTML = data.label;
            formStyle.value = mode.toUpperCase();
            
            // Update Body Class for Fonts/Colors
            document.body.className = `mode-${mode}`;
        })
        .to([title, sub, label], {
            y: 0,
            opacity: 1,
            duration: 0.8,
            stagger: 0.1,
            ease: "power2.out"
        });
    });
});

// --- 3. MODAL LOGIC ---
const modal = document.getElementById('modal');
const trigger = document.getElementById('deployTrigger');
const close = document.getElementById('closeModal');

trigger.onclick = () => {
    modal.style.display = 'flex';
    gsap.fromTo(".modal-frame", {y: 50, opacity: 0}, {y: 0, opacity: 1, duration: 0.4});
};
close.onclick = () => {
    gsap.to(".modal-frame", {y: 50, opacity: 0, duration: 0.3, onComplete: () => modal.style.display = 'none'});
};
