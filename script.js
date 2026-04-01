
// --- 1. Custom Cursor ---
const cursorDot = document.getElementById('cursor-dot');
const cursorRing = document.getElementById('cursor-ring');

if (window.matchMedia("(pointer: fine)").matches) {
    document.addEventListener('mousemove', (e) => {
        cursorDot.style.left = `${e.clientX}px`;
        cursorDot.style.top = `${e.clientY}px`;

        setTimeout(() => {
            cursorRing.style.left = `${e.clientX}px`;
            cursorRing.style.top = `${e.clientY}px`;
        }, 80);
    });

    const interactiveElements = document.querySelectorAll('a, button, .card, input, .menu-toggle, .close-btn, .cinematic-image-container');
    interactiveElements.forEach(el => {
        el.addEventListener('mouseenter', () => cursorRing.classList.add('active'));
        el.addEventListener('mouseleave', () => cursorRing.classList.remove('active'));
    });
} else {
    cursorDot.style.display = 'none';
    cursorRing.style.display = 'none';
}

window.addEventListener('scroll', () => {
    const scrollY = window.scrollY;
    document.querySelectorAll('section').forEach((sec, i) => {
        sec.style.transform = `translateZ(${scrollY * 0.02}px)`;
    });
});


// --- 2. Mobile Menu Logic ---
const menuBtn = document.getElementById('mobile-menu-btn');
const sidebar = document.getElementById('sidebar');

function toggleMenu() {
    sidebar.classList.toggle('active');
    if (sidebar.classList.contains('active')) {
        document.body.style.overflow = 'hidden';
    } else {
        document.body.style.overflow = 'auto';
    }
}

function closeMenu() {
    sidebar.classList.remove('active');
    document.body.style.overflow = 'auto';
}

menuBtn.addEventListener('click', toggleMenu);

// --- 3. Scroll Reveal ---
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
        }
    });
}, { threshold: 0.1 });

document.querySelectorAll('.reveal-text').forEach((el) => observer.observe(el));

// Observe flip cards for scroll animation
document.querySelectorAll('.flip-card').forEach((el) => observer.observe(el));

// Observe project cards for zig-zag animation
document.querySelectorAll('.project-card').forEach((el) => observer.observe(el));

// --- 4. Cosmic Background (Fixed Logic) ---
const canvas = document.getElementById('cosmos');
const ctx = canvas.getContext('2d');

let width, height;
let particles = [];
let density = 8000;
const connectionDist = 100;
let mouse = { x: null, y: null };

window.addEventListener('mousemove', e => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
});

function resize() {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
    const area = width * height;
    const count = Math.floor(area / density);
    initParticles(count);
}

class Particle {
    constructor() {
        this.x = Math.random() * width;
        this.y = Math.random() * height;
        this.vx = (Math.random() - 0.5) * 0.3;
        this.vy = (Math.random() - 0.5) * 0.3;
        this.size = Math.random() * 2;
        // Slightly varied white/blue star colors
        this.baseColor = `rgba(${200 + Math.random() * 55}, ${200 + Math.random() * 55}, 255, ${Math.random() * 0.5 + 0.1})`;
    }

    update() {
        this.x += this.vx;
        this.y += this.vy;

        if (mouse.x != null) {
            let dx = mouse.x - this.x;
            let dy = mouse.y - this.y;
            let distance = Math.sqrt(dx * dx + dy * dy);
            const forceDistance = 150;

            if (distance < forceDistance) {
                const forceDirectionX = dx / distance;
                const forceDirectionY = dy / distance;
                const force = (forceDistance - distance) / forceDistance;
                this.x -= forceDirectionX * force * 1;
                this.y -= forceDirectionY * force * 1;
            }
        }

        if (this.x < 0) this.x = width;
        if (this.x > width) this.x = 0;
        if (this.y < 0) this.y = height;
        if (this.y > height) this.y = 0;
    }

    draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fillStyle = this.baseColor;
        ctx.fill();
    }
}

function initParticles(count) {
    particles = [];
    const safeCount = Math.max(count, 50);
    for (let i = 0; i < safeCount; i++) {
        particles.push(new Particle());
    }
}

function animate() {
    ctx.clearRect(0, 0, width, height);
    particles.forEach(p => {
        p.update();
        p.draw();
    });

    ctx.strokeStyle = 'rgba(255, 255, 255, 0.04)';
    ctx.lineWidth = 1;

    for (let a = 0; a < particles.length; a++) {
        for (let b = a; b < particles.length; b++) {
            let dx = particles[a].x - particles[b].x;
            let dy = particles[a].y - particles[b].y;
            let distance = Math.sqrt(dx * dx + dy * dy);

            if (distance < connectionDist) {
                ctx.beginPath();
                ctx.moveTo(particles[a].x, particles[a].y);
                ctx.lineTo(particles[b].x, particles[b].y);
                ctx.stroke();
            }
        }
    }
    requestAnimationFrame(animate);
}

resize();
animate();
window.addEventListener('resize', resize);

// --- 5. Contact Form WhatsApp Integration ---
// --- 5. Contact Form Logic (Email & WhatsApp) ---
const contactForm = document.getElementById('contactForm');
const modeBtns = document.querySelectorAll('.mode-btn');
const submitBtn = document.getElementById('submitBtn');

let currentMode = 'email'; // Default

// 1. Handle Mode Switching
modeBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        modeBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        currentMode = btn.getAttribute('data-mode');

        if (currentMode === 'email') {
            submitBtn.textContent = "TRANSMIT VIA EMAIL";
        } else {
            submitBtn.textContent = "TRANSMIT VIA WHATSAPP";
        }
    });
});

// 2. Handle Form Submission
contactForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const name = document.getElementById('contactName').value.trim();
    const message = document.getElementById('contactMessage').value.trim();
    const recipient = "revicatech@gmail.com";

    if (currentMode === 'whatsapp') {
        // --- WhatsApp Logic ---
        let whatsappMessage = `*New Signal from Website*%0A%0A`;
        whatsappMessage += `*Name:* ${encodeURIComponent(name)}%0A`;
        whatsappMessage += `*Message:* ${encodeURIComponent(message)}`;

        window.open(`https://wa.me/934067735?text=${whatsappMessage}`, '_blank');

    } else {
        // --- Direct Gmail Logic ---
        const subject = encodeURIComponent(`Project Inquiry from ${name}`);
        const bodyText = encodeURIComponent(
            `Name: ${name}\n\n` +
            `Message:\n${message}`
        );

        const gmailUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=${recipient}&su=${subject}&body=${bodyText}`;

        window.open(gmailUrl, '_blank');
    }

    // Reset form after delay
    setTimeout(() => {
        contactForm.reset();
    }, 1000);
});