// =============================================
// LOADER
// =============================================
window.addEventListener('load', () => {
    setTimeout(() => {
        document.getElementById('loader').classList.add('hidden');
    }, 2000);
});

// =============================================
// AOS INIT
// =============================================
AOS.init({
    duration: 700,
    once: true,
    offset: 60,
    easing: 'ease-out-cubic'
});

// =============================================
// THEME TOGGLE
// =============================================
const themeToggle = document.getElementById('themeToggle');
const themeToggleMobile = document.getElementById('themeToggleMobile');
const themeToggleMobileIcon = document.getElementById('themeToggleMobileIcon');
const html = document.documentElement;
let theme = localStorage.getItem('theme') || 'dark';
html.setAttribute('data-theme', theme);
updateThemeToggleIcon();

function updateThemeToggleIcon() {
    if (themeToggleMobileIcon) {
        themeToggleMobileIcon.textContent = theme === 'dark' ? '🌙' : '☀️';
    }
}

function switchTheme() {
    theme = theme === 'dark' ? 'light' : 'dark';
    html.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
    updateThemeToggleIcon();
}

themeToggle.addEventListener('click', switchTheme);
if (themeToggleMobile) {
    themeToggleMobile.addEventListener('click', switchTheme);
}

// =============================================
// NAVBAR SCROLL & ACTIVE SECTION
// =============================================
const navbar = document.getElementById('navbar');
const navLinks = document.querySelectorAll('.nav-links a[data-section]');
const sections = document.querySelectorAll('section[id]');

window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 30);
    document.getElementById('scrollTop').classList.toggle('visible', window.scrollY > 400);

    let current = '';
    sections.forEach(sec => {
        if (window.scrollY >= sec.offsetTop - 120) current = sec.id;
    });
    navLinks.forEach(link => {
        link.classList.toggle('active', link.dataset.section === current);
    });

    animateSkills();
});

// =============================================
// HAMBURGER MENU
// =============================================
const hamburger = document.getElementById('hamburger');
const mobileNav = document.getElementById('mobileNav');

hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('open');
    mobileNav.classList.toggle('open');
});

mobileNav.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => {
        hamburger.classList.remove('open');
        mobileNav.classList.remove('open');
    });
});
if (themeToggleMobile) {
    themeToggleMobile.addEventListener('click', () => {
        hamburger.classList.remove('open');
        mobileNav.classList.remove('open');
    });
}

// =============================================
// SCROLL TO TOP
// =============================================
document.getElementById('scrollTop').addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
});

// =============================================
// TYPING ANIMATION (Hero)
// =============================================
const typedEl = document.getElementById('typedText');
const words = ['Web Developer','Game Developer', 'UI/UX Designer' , '3D Artist'];
let wordIdx = 0, charIdx = 0, deleting = false;

function typeLoop() {
    const word = words[wordIdx];
    if (!deleting) {
        typedEl.textContent = word.slice(0, ++charIdx);
        if (charIdx === word.length) {
            deleting = true;
            setTimeout(typeLoop, 1800);
            return;
        }
    } else {
        typedEl.textContent = word.slice(0, --charIdx);
        if (charIdx === 0) {
            deleting = false;
            wordIdx = (wordIdx + 1) % words.length;
        }
    }
    setTimeout(typeLoop, deleting ? 60 : 100);
}
typeLoop();

// =============================================
// SKILL BARS ANIMATION
// =============================================
let skillsAnimated = false;
function animateSkills() {
    const skillsSection = document.getElementById('skills');
    if (!skillsSection || skillsAnimated) return;
    const rect = skillsSection.getBoundingClientRect();
    if (rect.top < window.innerHeight - 100) {
        skillsAnimated = true;
        document.querySelectorAll('.skill-bar-fill').forEach(bar => {
            bar.style.width = bar.dataset.pct + '%';
        });
    }
}
animateSkills();

// =============================================
// PROJECT FILTER
// =============================================
const filterBtns = document.querySelectorAll('.filter-btn');
const projectCards = document.querySelectorAll('.project-card');

filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        filterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        const filter = btn.dataset.filter;
        projectCards.forEach(card => {
            const tags = card.dataset.tags || '';
            if (filter === 'all' || tags.includes(filter)) {
                card.classList.remove('hidden');
            } else {
                card.classList.add('hidden');
            }
        });
    });
});

// =============================================
// PROJECT MODAL WITH IMAGE CAROUSEL
// =============================================
const modal = document.getElementById('projectModal');
const modalClose = document.getElementById('modalClose');
const carouselTrack = document.getElementById('modalCarouselTrack');
const carouselDots = document.getElementById('modalCarouselDots');
const carouselPrev = document.getElementById('modalCarouselPrev');
const carouselNext = document.getElementById('modalCarouselNext');
let currentSlide = 0;
let totalSlides = 0;

function updateCarousel() {
    carouselTrack.style.transform = `translateX(-${currentSlide * 100}%)`;
    const dots = carouselDots.querySelectorAll('.modal-carousel-dot');
    dots.forEach((dot, i) => dot.classList.toggle('active', i === currentSlide));
    carouselPrev.style.display = totalSlides <= 1 ? 'none' : 'flex';
    carouselNext.style.display = totalSlides <= 1 ? 'none' : 'flex';
}

function goToSlide(index) {
    currentSlide = index;
    updateCarousel();
}

carouselPrev.addEventListener('click', () => {
    if (currentSlide > 0) { currentSlide--; updateCarousel(); }
});
carouselNext.addEventListener('click', () => {
    if (currentSlide < totalSlides - 1) { currentSlide++; updateCarousel(); }
});

projectCards.forEach(card => {
    card.addEventListener('click', () => {
        document.getElementById('modalTitle').textContent = card.dataset.title;
        document.getElementById('modalDesc').textContent = card.dataset.desc;

        const techEl = document.getElementById('modalTech');
        techEl.innerHTML = '';
        card.dataset.tech.split(',').forEach(t => {
            const tag = document.createElement('span');
            tag.className = 'modal-tech-tag';
            tag.textContent = t.trim();
            techEl.appendChild(tag);
        });

        const featuresEl = document.getElementById('modalFeatures');
        featuresEl.innerHTML = '';
        if (card.dataset.features) {
            card.dataset.features.split('|').forEach(f => {
                const li = document.createElement('li');
                li.textContent = f.trim();
                featuresEl.appendChild(li);
            });
        }

        document.getElementById('modalGithub').href = card.dataset.github || '#';

        const images = card.dataset.images ? card.dataset.images.split(',').map(s => s.trim()).filter(Boolean) : [card.dataset.emoji || '🚀'];
        totalSlides = images.length;
        currentSlide = 0;
        carouselTrack.innerHTML = '';
        carouselDots.innerHTML = '';

        images.forEach((imgSrc, i) => {
            const slide = document.createElement('div');
            slide.className = 'modal-carousel-slide';
            const trimmed = imgSrc.trim();
            if (trimmed.length <= 4 && !trimmed.includes('.') && !trimmed.includes('/')) {
                slide.textContent = trimmed;
                slide.style.fontSize = '5rem';
            } else {
                const img = document.createElement('img');
                img.src = trimmed;
                img.alt = 'Project screenshot ' + (i + 1);
                img.style.width = '100%';
                img.style.height = '100%';
                img.style.objectFit = 'cover';
                img.onerror = function() {
                    this.style.display = 'none';
                    const fb = document.createElement('div');
                    fb.style.cssText = 'display:flex;flex-direction:column;align-items:center;justify-content:center;gap:10px;width:100%;height:100%;color:var(--text3);font-family:\'DM Mono\',monospace;font-size:0.75rem;';
                    fb.innerHTML = '<svg width="48" height="48" fill="none" stroke="currentColor" stroke-width="1.2" viewBox="0 0 24 24"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg><span>No image · add src to data-images</span>';
                    slide.appendChild(fb);
                };
                slide.appendChild(img);
            }
            carouselTrack.appendChild(slide);
            if (images.length > 1) {
                const dot = document.createElement('button');
                dot.className = 'modal-carousel-dot';
                if (i === 0) dot.classList.add('active');
                dot.addEventListener('click', () => goToSlide(i));
                carouselDots.appendChild(dot);
            }
        });
        updateCarousel();
        modal.classList.add('open');
        document.body.style.overflow = 'hidden';
        modal.querySelector('.modal').scrollTop = 0;
    });
});

function closeModal() {
    modal.classList.remove('open');
    document.body.style.overflow = '';
}
modalClose.addEventListener('click', closeModal);
modal.addEventListener('click', e => { if (e.target === modal) closeModal(); });
document.addEventListener('keydown', e => { if (e.key === 'Escape') closeModal(); });

// =============================================
// CONTACT FORM
// =============================================
document.getElementById('submitBtn').addEventListener('click', () => {
    const name = document.getElementById('contactName').value.trim();
    const email = document.getElementById('contactEmail').value.trim();
    const msg = document.getElementById('contactMsg').value.trim();

    if (!name || !email || !msg) {
        alert('Please fill in all fields.');
        return;
    }

    const btn = document.getElementById('submitBtn');
    btn.textContent = 'Sending...';
    btn.disabled = true;

    emailjs.send('service_yiddkji', 'template_wnxg9ql', {
        from_name: name,
        from_email: email,
        message: msg,
        to_email: 'Nprexlouis@gmail.com'
    })
    .then(() => {
        btn.textContent = 'Send Message';
        btn.disabled = false;

        document.getElementById('contactName').value = '';
        document.getElementById('contactEmail').value = '';
        document.getElementById('contactMsg').value = '';

        const successDiv = document.getElementById('formSuccess');
        successDiv.style.display = 'block';

        setTimeout(() => {
            successDiv.style.display = 'none';
        }, 4000);
    })
    .catch((error) => {
        btn.textContent = 'Send Message';
        btn.disabled = false;
        alert('Failed to send message.');
        console.error(error);
    });
});

// =============================================
// ENHANCED SCROLL ANIMATIONS (Intersection Observer)
// =============================================
(function() {
    const heroBg = document.querySelector('.hero-grid-bg');
    const glowOrbs = document.querySelectorAll('.glow-orb');
    const revealEls = document.querySelectorAll(
        '.section-title, .section-tag, .section-sub, .skill-card, .tech-card, .project-card, .timeline-item, .contact-grid > div'
    );

    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('scroll-revealed');
                revealObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

    revealEls.forEach((el) => {
        el.classList.add('scroll-hidden');
        revealObserver.observe(el);
    });

    window.addEventListener('scroll', () => {
        const sy = window.scrollY;
        if (heroBg) heroBg.style.transform = `translateY(${sy * 0.18}px)`;
        glowOrbs.forEach((orb, i) => {
            orb.style.transform = `translateY(${sy * (i % 2 === 0 ? 0.12 : -0.09)}px)`;
        });

        document.querySelectorAll('.stat-chip-val:not(.counted)').forEach(el => {
            const rect = el.getBoundingClientRect();
            if (rect.top < window.innerHeight) {
                el.classList.add('counted');
            }
        });
    }, { passive: true });

    document.querySelectorAll('.timeline-dot').forEach((dot, i) => {
        dot.style.animationDelay = `${i * 0.15}s`;
    });
})();

// =============================================
// RESUME BUTTONS (placeholder)
// =============================================

document.getElementById('resumeBtn').addEventListener('click', resumeAlert);
const footerResume = document.getElementById('footerResume');
if (footerResume) {
    footerResume.addEventListener('click', resumeAlert);
}