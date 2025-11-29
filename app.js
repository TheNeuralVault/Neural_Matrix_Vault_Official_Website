// --- 1. INITIALIZATION ---
console.log("%c SYSTEM ONLINE ", "background: #00f3ff; color: #000; font-weight: bold; padding: 5px;");
lucide.createIcons();

// --- 2. SMOOTH SCROLL (Lenis) ---
const lenis = new Lenis({
    duration: 1.2,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    smooth: true
});
function raf(time) {
    lenis.raf(time);
    requestAnimationFrame(raf);
}
requestAnimationFrame(raf);

// --- 3. CURSOR PHYSICS ---
const cursorMain = document.querySelector('.cursor-main');
const cursorFollower = document.querySelector('.cursor-follower');

document.addEventListener('mousemove', (e) => {
    gsap.to(cursorMain, { x: e.clientX - 4, y: e.clientY - 4, duration: 0 });
    gsap.to(cursorFollower, { x: e.clientX - 20, y: e.clientY - 20, duration: 0.15 });
});

// Magnetic Elements
document.querySelectorAll('a, button, .glass-panel').forEach(el => {
    el.addEventListener('mouseenter', () => {
        gsap.to(cursorFollower, { scale: 2, borderColor: '#00f3ff', duration: 0.3 });
    });
    el.addEventListener('mouseleave', () => {
        gsap.to(cursorFollower, { scale: 1, borderColor: 'rgba(255,255,255,0.2)', duration: 0.3 });
    });
});

// --- 4. 3D CORE ENGINE (Three.js) ---
const canvas = document.querySelector('#neuro-core');
if(canvas) {
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 5;

    const renderer = new THREE.WebGLRenderer({ canvas: canvas, alpha: true, antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    // The Geometric Brain
    const geometry = new THREE.IcosahedronGeometry(2, 1);
    const material = new THREE.MeshBasicMaterial({ color: 0x00f3ff, wireframe: true, transparent: true, opacity: 0.3 });
    const core = new THREE.Mesh(geometry, material);
    scene.add(core);

    const innerGeo = new THREE.IcosahedronGeometry(1, 0);
    const innerMat = new THREE.MeshBasicMaterial({ color: 0x7000ff, wireframe: true });
    const innerCore = new THREE.Mesh(innerGeo, innerMat);
    scene.add(innerCore);

    function animate() {
        requestAnimationFrame(animate);
        core.rotation.y += 0.002;
        core.rotation.x += 0.001;
        innerCore.rotation.y -= 0.004;
        renderer.render(scene, camera);
    }
    animate();
    
    window.addEventListener('resize', () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    });
}

// --- 5. FORMSPREE INTELLIGENCE ---
const form = document.getElementById("neural-form");

async function handleSubmit(event) {
    event.preventDefault(); // Stop page reload
    
    const status = document.getElementById("status-text");
    const btn = form.querySelector("button");
    const data = new FormData(event.target);
    
    // Loading State
    const originalText = btn.innerText;
    btn.innerText = "ENCRYPTING...";
    btn.style.opacity = "0.7";
    
    try {
        const response = await fetch(event.target.action, {
            method: form.method,
            body: data,
            headers: { 'Accept': 'application/json' }
        });
        
        if (response.ok) {
            status.innerHTML = ">> TRANSMISSION SUCCESSFUL. AGENT ALERTED.";
            status.style.color = "#00f3ff";
            form.reset();
            btn.innerText = "SENT";
            gsap.to(form, { borderColor: "#00f3ff", duration: 0.5 });
        } else {
            const data = await response.json();
            if (Object.hasOwn(data, 'errors')) {
                status.innerHTML = data["errors"].map(error => error["message"]).join(", ");
            } else {
                status.innerHTML = ">> ERR: NETWORK_FAILURE";
            }
            status.style.color = "red";
            btn.innerText = "RETRY";
        }
    } catch (error) {
        status.innerHTML = ">> ERR: SYSTEM_OFFLINE";
        status.style.color = "red";
        btn.innerText = "RETRY";
    }
}

if(form) {
    form.addEventListener("submit", handleSubmit);
}

// --- 6. ANIMATION TRIGGERS ---
gsap.registerPlugin(ScrollTrigger);

gsap.from(".cell", {
    scrollTrigger: {
        trigger: ".bento-grid",
        start: "top 85%",
    },
    y: 50,
    opacity: 0,
    duration: 1,
    stagger: 0.1,
    ease: "power3.out"
});
