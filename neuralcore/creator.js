// /// CREATOR LOGIC ///

// 1. SMOOTH SCROLL
const lenis = new Lenis();
function raf(time) { lenis.raf(time); requestAnimationFrame(raf); }
requestAnimationFrame(raf);

// 2. CURSOR PHYSICS
const ball = document.querySelector('.cursor-ball');
const text = document.querySelector('.cursor-text');

let mouseX = 0, mouseY = 0;
let ballX = 0, ballY = 0;

document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
});

function animateCursor() {
    ballX += (mouseX - ballX) * 0.1;
    ballY += (mouseY - ballY) * 0.1;
    
    ball.style.transform = `translate(${ballX - 10}px, ${ballY - 10}px)`;
    text.style.left = mouseX + 'px';
    text.style.top = mouseY + 'px';
    
    requestAnimationFrame(animateCursor);
}
animateCursor();

// 3. HOVER INTERACTIONS
const hoverables = document.querySelectorAll('[data-cursor]');

hoverables.forEach(el => {
    el.addEventListener('mouseenter', () => {
        const label = el.getAttribute('data-cursor');
        text.innerText = label;
        gsap.to(ball, {scale: 4, duration: 0.3});
        gsap.to(text, {opacity: 1, duration: 0.3});
    });
    
    el.addEventListener('mouseleave', () => {
        gsap.to(ball, {scale: 1, duration: 0.3});
        gsap.to(text, {opacity: 0, duration: 0.3});
    });
});

// 4. PARALLAX IMAGES
gsap.registerPlugin(ScrollTrigger);
document.querySelectorAll('.img-mask img').forEach(img => {
    gsap.to(img, {
        yPercent: 20,
        ease: "none",
        scrollTrigger: {
            trigger: img.parentElement,
            start: "top bottom",
            end: "bottom top",
            scrub: true
        }
    });
});
