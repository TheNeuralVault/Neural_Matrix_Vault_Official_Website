// /// NEURAL MATRIX VAULT: SYSTEM INITIALIZATION ///
console.log("%c/// GOD MODE ENGAGED: SYSTEM OPTIMAL", "color:#00f3ff; background:#000; padding:5px; border:1px solid #00f3ff;");

// 1. THE GOD ENGINE (MATRIX RAIN)
const canvas = document.getElementById('matrix-rain');
if (canvas) {
    const ctx = canvas.getContext('2d');
    
    // Resize Logic
    let width = canvas.width = window.innerWidth;
    let height = canvas.height = window.innerHeight;
    
    const chars = "01XYZAMNBVC";
    const fontSize = 14;
    const columns = width / fontSize;
    const drops = Array(Math.floor(columns)).fill(1);

    function draw() {
        // Semi-transparent black to create trail effect
        ctx.fillStyle = 'rgba(5, 5, 5, 0.05)';
        ctx.fillRect(0, 0, width, height);
        
        ctx.fillStyle = '#00f3ff'; // Neon Blue Text
        ctx.font = fontSize + 'px monospace';
        
        for (let i = 0; i < drops.length; i++) {
            const text = chars[Math.floor(Math.random() * chars.length)];
            ctx.fillText(text, i * fontSize, drops[i] * fontSize);
            
            // Random reset to top
            if (drops[i] * fontSize > height && Math.random() > 0.985) {
                drops[i] = 0;
            }
            drops[i]++;
        }
        requestAnimationFrame(draw);
    }

    // Battery Saver: Only run if window is active
    let isVisible = true;
    document.addEventListener("visibilitychange", () => { isVisible = !document.hidden; });
    
    function loop() {
        if(isVisible) draw();
        else requestAnimationFrame(loop);
    }
    loop();

    window.addEventListener('resize', () => {
        width = canvas.width = window.innerWidth;
        height = canvas.height = window.innerHeight;
    });
}
