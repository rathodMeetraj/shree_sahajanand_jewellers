const modelViewer = document.getElementById('spinning-ring');
let lastMarqueeScrollY = window.scrollY;

window.addEventListener('scroll', () => {
    // Calculate how far down the user has scrolled as a percentage (0 to 1)
    const scrollTop = window.scrollY || document.documentElement.scrollTop;
    const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
    const scrollProgress = scrollHeight > 0 ? (scrollTop / scrollHeight) : 0;

    // Map scroll progress to a 360 degree rotation (or multiple turns, e.g., 720 for 2 turns)
    // We'll do 720 degrees so it spins a couple of times as you scroll down
    const rotationDegrees = scrollProgress * 720;

    // Adjust the horizontal camera orbit angle (theta)
    if (modelViewer) {
        // The format is "theta phi radius", we keep phi at 75deg and radius at auto
        modelViewer.cameraOrbit = `${rotationDegrees}deg 75deg auto`;
    }

    // Setup for Smooth JS Driven Marquee
    // Let's implement a completely JS driven smooth scroller instead of CSS animation direction
});

// Advanced smooth marquee using RequestAnimationFrame
const marqueeTrack = document.querySelector('.marquee-track');
let currentScrollPos = 0;
let marqueeScrollPos = 0;
let lastScrollPos = window.scrollY;
let speed = 2; // Default auto-scroll speed
let marqueeDirection = -1; // -1 for left (default), 1 for right

function animateMarquee() {
    if (!marqueeTrack) return;
    
    // Check if hovered
    const isHovered = marqueeTrack.matches(':hover') || marqueeTrack.parentElement.matches(':hover');
    
    if (!isHovered) {
        // Calculate scroll delta
        const scrollTop = window.scrollY;
        const deltaY = scrollTop - lastScrollPos;
        
        // Determine target direction based on scroll
        if (deltaY > 0) {
            marqueeDirection = 1; // Scroll down, reverse direction
        } else if (deltaY < 0) {
            marqueeDirection = -1; // Scroll up, normal direction
        }
        
        // Apply base speed + scroll acceleration
        // The faster you scroll, the faster the marquee moves
        const scrollAcceleration = deltaY * 0.2; // Adjust multiplier for sensitivity
        
        marqueeScrollPos += (speed * marqueeDirection) + scrollAcceleration;
        
        // Loop the marquee text smoothly (assuming typical 50% duplication track width setup)
        // Adjust the numeric bound based on track actual width vs container width if necessary
        // In this specific setup with repeated items, resetting offset at a sweet spot keeps it infinite
        
        // Let's use a percentage based translation
        // Assuming the track content is at least 200% width
        // For standard infinite effect, we reset transform when it crosses certain bounds
        const trackWidth = marqueeTrack.scrollWidth / 2;
        
        if (marqueeScrollPos <= -trackWidth) {
            marqueeScrollPos += trackWidth; 
        } else if (marqueeScrollPos >= 0) {
            marqueeScrollPos -= trackWidth;
        }

        marqueeTrack.style.transform = `translateX(${marqueeScrollPos}px)`;
        lastScrollPos = scrollTop;
    }
    
    requestAnimationFrame(animateMarquee);
}

// Start smooth loop
if (marqueeTrack) {
    // Disable CSS animation since we are driving this smoothly via JS
    marqueeTrack.style.animation = 'none';
    requestAnimationFrame(animateMarquee);
}

const texts = document.querySelectorAll(".process-text");

const observer = new IntersectionObserver((entries)=>{
    entries.forEach(entry=>{
        if(entry.isIntersecting){
            entry.target.style.opacity = "1";
            entry.target.style.transform = "translateY(0)";
        }
    });
},{threshold:0.3});

texts.forEach(text=>{
    observer.observe(text);
});