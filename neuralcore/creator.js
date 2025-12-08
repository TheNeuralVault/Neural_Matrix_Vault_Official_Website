// /// CREATOR: LIQUID VORTEX ENGINE ///

const container = document.getElementById('gl');
const content = document.querySelector('.gallery');
const images = [...document.querySelectorAll('img')];

// --- 1. SETUP ---
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 100, 2000);
const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });

camera.position.z = 600;
camera.fov = 2 * Math.atan((window.innerHeight / 2) / 600) * (180 / Math.PI);
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
container.appendChild(renderer.domElement);

// --- 2. THE SHADER (LIQUID PHYSICS) ---
const vertexShader = `
uniform float uTime;
uniform float uSpeed;
varying vec2 vUv;

void main() {
    vUv = uv;
    vec3 pos = position;
    
    // LIQUID CURVE ALGORITHM
    // Bends the image based on scroll velocity
    float curve = 0.002 * uSpeed;
    pos.y = pos.y + (sin(uv.x * 3.14159) * uSpeed * 2.0);
    pos.z = pos.z + (sin(uv.x * 3.14159) * abs(uSpeed) * 0.5);

    gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
}
`;

const fragmentShader = `
uniform sampler2D uTexture;
uniform float uSpeed;
varying vec2 vUv;

void main() {
    // CHROMATIC ABERRATION (RGB SPLIT)
    // Shifts color channels based on speed
    float shift = uSpeed * 0.005;
    
    float r = texture2D(uTexture, vUv + vec2(shift, 0.0)).r;
    float g = texture2D(uTexture, vUv).g;
    float b = texture2D(uTexture, vUv - vec2(shift, 0.0)).b;
    
    gl_FragColor = vec4(r, g, b, 1.0);
}
`;

// --- 3. CREATE MESHES ---
const meshes = [];

// Wait for images to load
imagesLoaded(document.querySelectorAll('img'), () => {
    images.forEach((img, i) => {
        const bounds = img.getBoundingClientRect();
        const geometry = new THREE.PlaneGeometry(bounds.width, bounds.height, 16, 16);
        const texture = new THREE.TextureLoader().load(img.src);
        texture.needsUpdate = true;

        const material = new THREE.ShaderMaterial({
            uniforms: {
                uTime: { value: 0 },
                uSpeed: { value: 0 },
                uTexture: { value: texture }
            },
            vertexShader,
            fragmentShader,
            // wireframe: true // Uncomment to see the mesh structure
        });

        const mesh = new THREE.Mesh(geometry, material);
        scene.add(mesh);
        meshes.push({ mesh, img, bounds });
    });
    
    // Show titles after load
    document.querySelectorAll('.title').forEach(t => t.style.opacity = 1);
});

// --- 4. SCROLL SYNC LOOP ---
const lenis = new Lenis();
let currentScroll = 0;
let targetScroll = 0;

function animate() {
    // Smooth Scroll Sync
    targetScroll = window.scrollY;
    currentScroll += (targetScroll - currentScroll) * 0.1;
    
    const velocity = targetScroll - currentScroll;

    meshes.forEach(({ mesh, img }) => {
        const bounds = img.getBoundingClientRect();
        
        // Sync WebGL position to DOM position
        mesh.position.y = (window.innerHeight / 2) - bounds.top - (bounds.height / 2);
        mesh.position.x = (bounds.left - window.innerWidth / 2) + (bounds.width / 2);
        
        // Pass velocity to shader
        mesh.material.uniforms.uSpeed.value = velocity;
    });

    renderer.render(scene, camera);
    lenis.raf(Date.now());
    requestAnimationFrame(animate);
}
animate();

// --- 5. RESIZE HANDLER ---
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.fov = 2 * Math.atan((window.innerHeight / 2) / 600) * (180 / Math.PI);
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});
