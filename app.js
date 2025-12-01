// --- INITIALIZATION SEQUENCE ---
console.log("%c/// NEURAL MATRIX VAULT: GOD MODE ENGAGED", "background:#000; color:#00f3ff; font-size:12px; padding:5px; border:1px solid #00f3ff;");
try { lucide.createIcons(); } catch(e) {}

// --- 1. PERFORMANCE OPTIMIZER (Battery Saver) ---
let isVisible = true;
document.addEventListener("visibilitychange", () => { isVisible = !document.hidden; });

// --- 2. THE LIQUID ENGINE (Custom GLSL Shader Background) ---
// This creates the "Liquid Metal" background effect using WebGL
// Note: This runs only on Desktop to save mobile battery
if (window.innerWidth > 768) {
    try {
        const canvas = document.getElementById('liquid-engine');
        const gl = canvas.getContext('webgl');
        
        if (gl) {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
            
            // Vertex Shader (Geometry)
            const vsSource = `
                attribute vec2 position;
                void main() { gl_Position = vec4(position, 0.0, 1.0); }
            `;
            
            // Fragment Shader (The Liquid Math)
            const fsSource = `
                precision mediump float;
                uniform float time;
                uniform vec2 resolution;
                void main() {
                    vec2 uv = gl_FragCoord.xy / resolution.xy;
                    float color = 0.0;
                    color += sin(uv.x * 10.0 + time) * 0.1;
                    color += sin(uv.y * 10.0 + time) * 0.1;
                    color += sin((uv.x + uv.y) * 10.0 + time) * 0.1;
                    gl_FragColor = vec4(vec3(color * 0.1, color * 0.2, color * 0.3), 1.0);
                }
            `;
            
            // Compile Shaders
            const vs = gl.createShader(gl.VERTEX_SHADER);
            gl.shaderSource(vs, vsSource); gl.compileShader(vs);
            const fs = gl.createShader(gl.FRAGMENT_SHADER);
            gl.shaderSource(fs, fsSource); gl.compileShader(fs);
            
            const program = gl.createProgram();
            gl.attachShader(program, vs); gl.attachShader(program, fs);
            gl.linkProgram(program);
            gl.useProgram(program);
            
            const triangleVertices = new Float32Array([-1, -1, 1, -1, -1, 1, -1, 1, 1, -1, 1, 1]);
            const positionAttributeLocation = gl.getAttribLocation(program, 'position');
            const positionBuffer = gl.createBuffer();
            gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
            gl.bufferData(gl.ARRAY_BUFFER, triangleVertices, gl.STATIC_DRAW);
            gl.enableVertexAttribArray(positionAttributeLocation);
            gl.vertexAttribPointer(positionAttributeLocation, 2, gl.FLOAT, false, 0, 0);
            
            const timeLocation = gl.getUniformLocation(program, 'time');
            const resolutionLocation = gl.getUniformLocation(program, 'resolution');
            gl.uniform2f(resolutionLocation, canvas.width, canvas.height);
            
            function renderShader(now) {
                if (isVisible) {
                    gl.uniform1f(timeLocation, now * 0.001);
                    gl.drawArrays(gl.TRIANGLES, 0, 6);
                }
                requestAnimationFrame(renderShader);
            }
            requestAnimationFrame(renderShader);
        }
    } catch(e) { console.log("Liquid Engine Offline"); }
}

// --- 3. THE SINGULARITY ARTIFACT (Generative 3D Hero) ---
(function initSingularity() {
    const container = document.getElementById('singularity-vessel');
    if (!container) return;

    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x050505, 0.03); // Void Fog

    const camera = new THREE.PerspectiveCamera(50, container.clientWidth / container.clientHeight, 0.1, 100);
    camera.position.z = 6;

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true, powerPreference: "high-performance" });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);

    // CORE: OBSIDIAN
    const coreGeo = new THREE.IcosahedronGeometry(1.5, 1);
    const coreMat = new THREE.MeshPhongMaterial({
        color: 0x000000, emissive: 0x050505, specular: 0xffffff, shininess: 100, flatShading: true
    });
    const core = new THREE.Mesh(coreGeo, coreMat);
    scene.add(core);

    // CAGE: GOLD WIRE
    const wireGeo = new THREE.IcosahedronGeometry(1.6, 1);
    const wireMat = new THREE.MeshBasicMaterial({ color: 0xffaa00, wireframe: true, transparent: true, opacity: 0.3 });
    const cage = new THREE.Mesh(wireGeo, wireMat);
    scene.add(cage);

    // VORTEX PARTICLES
    const particleCount = 1000;
    const streamGeo = new THREE.BufferGeometry();
    const positions = [];
    const colors = [];
    const colorA = new THREE.Color(0x00f3ff);
    const colorB = new THREE.Color(0xffaa00);

    for (let i = 0; i < particleCount; i++) {
        const t = Math.random() * Math.PI * 2;
        const r = 2.5 + Math.random() * 2;
        const x = Math.cos(t) * r;
        const y = (Math.random() - 0.5) * 2;
        const z = Math.sin(t) * r;
        positions.push(x, y, z);
        
        const c = Math.random() > 0.5 ? colorA : colorB;
        colors.push(c.r, c.g, c.b);
    }
    streamGeo.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
    streamGeo.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));
    const streamMat = new THREE.PointsMaterial({ size: 0.04, vertexColors: true, transparent: true, opacity: 0.8 });
    const stream = new THREE.Points(streamGeo, streamMat);
    scene.add(stream);

    // DYNAMIC LIGHTS
    const l1 = new THREE.PointLight(0x00f3ff, 2, 10); l1.position.set(3, 2, 3); scene.add(l1);
    const l2 = new THREE.PointLight(0xffaa00, 2, 10); l2.position.set(-3, -2, 3); scene.add(l2);

    function animate() {
        if (isVisible) {
            core.rotation.y += 0.004; core.rotation.x -= 0.002;
            cage.rotation.y += 0.004; cage.rotation.x -= 0.002;
            stream.rotation.y -= 0.005; stream.rotation.z += 0.001;
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

// --- 4. CHROMATIC MATRIX (The Rain) ---
const mCanvas = document.getElementById('matrix-rain');
if (mCanvas) {
    const mCtx = mCanvas.getContext('2d');
    let mWidth = window.innerWidth; let mHeight = window.innerHeight;
    mCanvas.width = mWidth; mCanvas.height = mHeight;

    const chars = "01XYZA".split("");
    const fontSize = 14;
    const columns = mWidth / fontSize;
    const drops = Array(Math.floor(columns)).fill(1);
    
    // The Divine Spectrum
    const palette = [{r:0,g:243,b:255}, {r:10,g:255,b:10}, {r:255,g:215,b:0}, {r:255,g:255,b:255}, {r:255,g:0,b:0}];
    let time = 0;

    function drawMatrix() {
        if (!isVisible) { requestAnimationFrame(drawMatrix); return; }
        
        mCtx.fillStyle = "rgba(5, 5, 5, 0.05)";
        mCtx.fillRect(0, 0, mWidth, mHeight);
        
        time += 0.002;
        const colorIdx = Math.floor(time) % palette.length;
        const c = palette[colorIdx];
        mCtx.fillStyle = `rgb(${c.r},${c.g},${c.b})`;
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

// --- 5. LOGIC & SCROLL ---
try {
    const lenis = new Lenis({ duration: 1.2, smooth: true });
    function raf(time) { lenis.raf(time); requestAnimationFrame(raf); }
    requestAnimationFrame(raf);
    
    // Desktop Cursor
    if (window.innerWidth > 768) {
        const dot = document.querySelector('.cursor-dot');
        const circ = document.querySelector('.cursor-circle');
        document.addEventListener('mousemove', (e) => {
            gsap.to(dot, { x: e.clientX, y: e.clientY, duration: 0 });
            gsap.to(circ, { x: e.clientX - 20, y: e.clientY - 20, duration: 0.15 });
        });
    }
    
    gsap.registerPlugin(ScrollTrigger);
    gsap.from(".cell", {
        scrollTrigger: { trigger: ".bento-grid", start: "top 85%" },
        y: 40, opacity: 0, duration: 0.8, stagger: 0.1, ease: "power3.out"
    });
} catch(e) {}
