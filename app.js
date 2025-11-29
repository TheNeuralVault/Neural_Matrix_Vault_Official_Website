/* NEURAL VAULT // INTERACTION ENGINE */

document.addEventListener('DOMContentLoaded', () => {
    
    // 1. SMOOTH SCROLL FOR THE "ACCESS" BUTTON
    const vaultBtn = document.querySelector('.btn-main');
    
    if(vaultBtn) {
        vaultBtn.addEventListener('click', (e) => {
            e.preventDefault();
            const gridSection = document.querySelector('.grid-section');
            if(gridSection) {
                gridSection.scrollIntoView({ behavior: 'smooth' });
            }
        });
    }

    // 2. THE OBSERVER (Reveals cards when you scroll to them)
    const observerOptions = {
        threshold: 0.1, // Trigger when 10% of the card is visible
        rootMargin: "0px"
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Add the class that forces opacity: 1
                entry.target.classList.add('visible');
                // Stop watching once revealed
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Tell the observer to watch all cards
    const cards = document.querySelectorAll('.card');
    cards.forEach((card, index) => {
        // Add a slight delay for each card (staggered effect)
        card.style.transitionDelay = `${index * 100}ms`; 
        observer.observe(card);
    });

    // 3. CONSOLE SIGNATURE
    console.log("%c SYSTEM ONLINE %c NEURAL VAULT V2.0 ", 
        "background: #00f3ff; color: #000; font-weight: bold; padding: 4px;",
        "background: #000; color: #fff; padding: 4px;");
});
