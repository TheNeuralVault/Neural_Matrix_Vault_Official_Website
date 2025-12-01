// --- SYSTEM START ---
console.log("%c/// NEURAL MATRIX VAULT: SYSTEM ONLINE", "color:#00f3ff; font-weight:bold; font-size:14px;");
console.log("%c/// CREED: Others sell domains. We create impenetrable fortresses that last forever.", "background:#000; color:#ffaa00; padding:5px; border:1px solid #ffaa00;");
try { lucide.createIcons(); } catch(e) {}

// --- 1. VISIBILITY API (Battery Saver) ---
let isPageVisible = true;
document.addEventListener("visibilitychange", () => { isPageVisible = !document.hidden; });

// --- 2. CHROMATIC MATRIX RAIN ---
const mCanvas = document.getElementById('matrix-rain');
if (mCanvas) {
    const mCtx = mCanvas.getContext('2d');
    let mWidth = window.innerWidth;
    let mHeight = window.innerHeight;
    mCanvas.width = mWidth; mCanvas.height = mHeight;

    const chars = "010101XYZA0101".split("");
    const fontSize = 14;
    const columns = mWidth / fontSize;
    const drops = Array(Math.floor(columns)).fill(1);

    const palette = [
        { r: 0, g: 243, b: 255 }, { r: 10, g: 255, b: 10 }, { r: 255, g: 215, b: 0 },
        { r: 255, g: 255, b: 255 }, { r: 128, g: 128, b: 128 }, { r: 255, g: 0, b: 0 }
    ];
    let time = 0;

    function drawMatrix() {
        if (!isPageVisible) { requestAnimationFrame(drawMatrix); return; }
        mCtx.fillStyle = "rgba(5, 5, 5, 0.05)";
        mCtx.fillRect(0, 0, mWidth, mHeight);

        time += 0.005;
        const index = Math.floor(time) % palette.length;
        const nextIndex = (index + 1) % palette.length;
        const factor = time - Math.floor(time);
        
        const r = Math.round(palette[index].r + (palette[nextIndex].r - palette[index].r) * factor);
        const g = Math.round(palette[index].g + (palette[nextIndex].g - palette[index].g) * factor);
        const b = Math.round(palette[index].b + (palette[nextIndex].b - palette[index].b) * factor);
        
        mCtx.fillStyle = `rgb(${r},${g},${b})`;
        mCtx.font = fontSize + "px monospace";

        for (let i = 0; i < drops.length; i++) {
            const text = chars[Math.floor(Math.random() * chars.length)];
            mCtx.fillText(text, i * fontSize, drops[i] * fontSize);
            if (drops[i] * fontSize > mHeight && Math.random() > 0.975) drops[i] = 0;
            drops[i]++;
        }
        requestAnimationFrame(drawMatrix);
    }
    drawMatrix();
}

// --- 3. THE SINGULARITY ARTIFACT (HERO OBJECT) ---
(function initSingularity() {
    const container = document.getElementById('singularity-vessel');
    if (!container) return;

    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x050505, 0.05);

    const camera = new THREE.PerspectiveCamera(50, container.clientWidth / container.clientHeight, 0.1, 100);
    camera.position.z = 6;

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);

    // CORE (Obsidian)
    const coreGeo = new THREE.IcosahedronGeometry(1.5, 0);
    const coreMat = new THREE.MeshPhongMaterial({
        color: 0x000000, emissive: 0x111111, specular: 0xffffff, shininess: 90, flatShading: true
    });
    const core = new THREE.Mesh(coreGeo, coreMat);
    scene.add(core);

    // CAGE (Gold)
    const wireGeo = new THREE.IcosahedronGeometry(1.55, 0);
    const wireMat = new THREE.MeshBasicMaterial({ color: 0xffaa00, wireframe: true, transparent: true, opacity: 0.4 });
    const cage = new THREE.Mesh(wireGeo, wireMat);
    scene.add(cage);

    // SWARM
    const particleCount = 800;
    const streamGeo = new THREE.BufferGeometry();
    const positions = [];
    const colors = [];
    const colorBlue = new THREE.Color(0x00f3ff);
    const colorGold = new THREE.Color(0xffaa00);

    for (let i = 0; i < particleCount; i++) {
        const angle = Math.random() * Math.PI * 2;
        const radius = 2.2 + Math.random() * 1.5;
        const x = Math.cos(angle) * radius;
        const y = (Math.random() - 0.5) * 3; 
        const z = Math.sin(angle) * radius;
        positions.push(x, y, z);
        const color = Math.random() > 0.5 ? colorBlue : colorGold;
        colors.push(color.r, color.g, color.b);
    }
    streamGeo.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
    streamGeo.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));
    const streamMat = new THREE.PointsMaterial({ size: 0.04, vertexColors: true, transparent: true, opacity: 0.8 });
    const stream = new THREE.Points(streamGeo, streamMat);
    scene.add(stream);

    // LIGHTS
    const light1 = new THREE.PointLight(0x00f3ff, 2, 10); light1.position.set(3, 3, 3); scene.add(light1);
    const light2 = new THREE.PointLight(0xffaa00, 2, 15); light2.position.set(-3, -3, 3); scene.add(light2);

    function animate() {
        if (isPageVisible) {
            core.rotation.y += 0.005; core.rotation.x -= 0.002;
            cage.rotation.y += 0.005; cage.rotation.x -= 0.002;
            stream.rotation.y -= 0.005;
            renderer.render(scene, camera);
        }
        requestAnimationFrame(animate);
    }
    animate();

    window.addEventListener('resize', () => {
        camera.aspect = container.clientWidth / container.clientHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(container.clientWidth, container.clientHeight);
    });
})();

// --- 4. BACKGROUND DYSON SPHERE ---
if (window.innerWidth > 768) {
    try {
        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        const renderer = new THREE.WebGLRenderer({ canvas: document.getElementById('webgl-scene'), alpha: true });
        renderer.setSize(window.innerWidth, window.innerHeight);

        const geometry = new THREE.BufferGeometry();
        const count = 3000;
        const posArray = new Float32Array(count * 3);
        for(let i = 0; i < count * 3; i++) { posArray[i] = (Math.random() - 0.5) * 20; }
        geometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
        const material = new THREE.PointsMaterial({ size: 0.03, color: 0xbc13fe });
        const particleMesh = new THREE.Points(geometry, material);
        scene.add(particleMesh);
        camera.position.z = 5;

        function animateBg() {
            if (isPageVisible) {
                particleMesh.rotation.y += 0.001;
                renderer.render(scene, camera);
            }
            requestAnimationFrame(animateBg);
        }
        animateBg();
    } catch(e){}
}

// --- 5. CURSOR ---
if (window.innerWidth > 768) {
    const cursorDot = document.querySelector('.cursor-dot');
    const cursorCircle = document.querySelector('.cursor-circle');
    document.addEventListener('mousemove', (e) => {
        gsap.to(cursorDot, { x: e.clientX, y: e.clientY, duration: 0 });
        gsap.to(cursorCircle, { x: e.clientX - 20, y: e.clientY - 20, duration: 0.15 });
    });
}

// --- 6. ANIMATIONS ---
gsap.registerPlugin(ScrollTrigger);
gsap.from(".cell", {
    scrollTrigger: { trigger: ".bento-grid", start: "top 85%" },
    y: 30, duration: 0.8, stagger: 0.1, ease: "power2.out"
});
