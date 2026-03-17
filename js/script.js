const header = document.getElementById('header');

// ============================================
// SMOOTH SCROLL PARA ENLACES ANCLA (scroll nativo)
// ============================================

document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const targetSelector = this.getAttribute('href');
        if (targetSelector && targetSelector !== '#') {
            const target = document.querySelector(targetSelector);
            if (target) {
                const headerHeight = header ? header.offsetHeight : 0;
                const top = target.getBoundingClientRect().top + window.scrollY - headerHeight;
                window.scrollTo({ top, behavior: 'smooth' });
            }
        }
    });
});

// ============================================
// MENÚ MÓVIL
// ============================================

const menuToggle = document.getElementById('menuToggle');
const navMenu = document.getElementById('navMenu');

if (menuToggle && navMenu) {
    menuToggle.addEventListener('click', () => {
        navMenu.classList.toggle('active');

        const spans = menuToggle.querySelectorAll('span');
        if (navMenu.classList.contains('active')) {
            spans[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
            spans[1].style.opacity = '0';
            spans[2].style.transform = 'rotate(-45deg) translate(7px, -6px)';
        } else {
            spans[0].style.transform = 'none';
            spans[1].style.opacity = '1';
            spans[2].style.transform = 'none';
        }
    });

    // Cerrar menú al hacer clic en un enlace
    const navLinks = navMenu.querySelectorAll('.header-link');
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            navMenu.classList.remove('active');
            const spans = menuToggle.querySelectorAll('span');
            spans[0].style.transform = 'none';
            spans[1].style.opacity = '1';
            spans[2].style.transform = 'none';
        });
    });
}

// ============================================
// CAMBIO DE COLOR EN HERO Y RELUME CON SCROLL
// ============================================
function handleHeroRelumeScroll() {
    const heroSection = document.querySelector('.hero');
    const relumeSection = document.querySelector('.relume-section');
    const servicesSection = document.querySelector('.services');

    if (!heroSection || !relumeSection || !servicesSection) return;

    const heroRect = heroSection.getBoundingClientRect();
    const servicesRect = servicesSection.getBoundingClientRect();
    const scrollY = window.scrollY || window.pageYOffset;
    const windowHeight = window.innerHeight;

    const heroBottom = scrollY + heroRect.top + heroRect.height;
    const servicesTop = scrollY + servicesRect.top;
    const offsetBeforeServices = windowHeight;
    const scrollEnd = servicesTop - offsetBeforeServices;
    const scrollStart = heroBottom;
    const scrollRange = scrollEnd - scrollStart;

    let scrollProgress = 0;

    if (scrollRange > 0) {
        scrollProgress = Math.max(0, Math.min(1, (scrollY - scrollStart) / scrollRange));
    } else {
        if (heroRect.bottom < 0 && servicesRect.top > offsetBeforeServices) {
            const currentRange = servicesRect.top - offsetBeforeServices - heroRect.bottom;
            if (currentRange > 0) {
                scrollProgress = Math.max(0, Math.min(1, (-heroRect.bottom) / currentRange));
            } else {
                scrollProgress = 1;
            }
        } else if (heroRect.bottom >= 0) {
            scrollProgress = 0;
        } else {
            scrollProgress = 1;
        }
    }

    const easedProgress = scrollProgress * scrollProgress * (3 - 2 * scrollProgress);

    const startColor = { r: 10, g: 10, b: 10 };
    const endColor = { r: 245, g: 245, b: 245 };

    const currentR = Math.round(startColor.r + (endColor.r - startColor.r) * easedProgress);
    const currentG = Math.round(startColor.g + (endColor.g - startColor.g) * easedProgress);
    const currentB = Math.round(startColor.b + (endColor.b - startColor.b) * easedProgress);

    relumeSection.style.backgroundColor = `rgb(${currentR}, ${currentG}, ${currentB})`;

    const relumeTitleTag = relumeSection.querySelector('.relume-tagline');
    const relumeText = relumeSection.querySelector('.relume-text');
    const relumeButtons = relumeSection.querySelectorAll('.btn');

    if (easedProgress > 0.5) {
        if (relumeTitleTag) relumeTitleTag.style.color = '#6b6b6b';
        if (relumeText) relumeText.style.color = '#0a0a0a';
        relumeButtons.forEach(btn => {
            if (btn.classList.contains('btn-normal-dark')) {
                btn.classList.replace('btn-normal-dark', 'btn-normal');
            } else if (btn.classList.contains('btn-outline-dark')) {
                btn.classList.replace('btn-outline-dark', 'btn-outline');
            } else if (btn.classList.contains('btn-link-dark')) {
                btn.classList.replace('btn-link-dark', 'btn-link');
            }
        });
    } else {
        if (relumeTitleTag) relumeTitleTag.style.color = '#9a9a9a';
        if (relumeText) relumeText.style.color = '#ffffff';
        relumeButtons.forEach(btn => {
            if (btn.classList.contains('btn-normal')) {
                btn.classList.replace('btn-normal', 'btn-normal-dark');
            } else if (btn.classList.contains('btn-outline')) {
                btn.classList.replace('btn-outline', 'btn-outline-dark');
            } else if (btn.classList.contains('btn-link')) {
                btn.classList.replace('btn-link', 'btn-link-dark');
            }
        });
    }
}

// ============================================
// PARALLAX PARA IMAGEN Y TEXTO DEL HERO
// ============================================
function handleHeroParallax() {
    const heroImage = document.querySelector('.hero-bg-image');
    const heroTextOverlay = document.querySelector('.hero-text-overlay');
    const heroSection = document.querySelector('.hero');

    if (!heroImage || !heroSection) return;

    const scrollY = window.scrollY || window.pageYOffset;
    const heroRect = heroSection.getBoundingClientRect();
    const windowHeight = window.innerHeight;

    if (heroRect.bottom > 0 && heroRect.top < windowHeight) {
        const scrollRange = heroRect.height + windowHeight;
        const scrollProgress = Math.max(0, Math.min(1, (windowHeight - heroRect.top) / scrollRange));
        const easedProgress = scrollProgress * scrollProgress * (3 - 2 * scrollProgress);

        const parallaxOffset = scrollY * 0.4;
        const scale = 1.0 + 0.1 * easedProgress;

        heroImage.style.transform = `translateY(${parallaxOffset}px) scale(${scale})`;

        if (heroTextOverlay) {
            heroTextOverlay.style.transform = `translateY(${scrollY * 0.6}px)`;
        }
    } else {
        heroImage.style.transform = 'translateY(0) scale(1)';
        if (heroTextOverlay) {
            heroTextOverlay.style.transform = 'translateY(0)';
        }
    }
}

window.addEventListener('scroll', () => {
    handleHeroRelumeScroll();
    handleHeroParallax();
}, { passive: true });

window.addEventListener('load', () => {
    handleHeroRelumeScroll();
    handleHeroParallax();
});

window.addEventListener('resize', () => {
    handleHeroRelumeScroll();
    handleHeroParallax();
});

// ============================================
// FORMULARIO DE CONTACTO
// ============================================

const contactForm = document.getElementById('contactForm');

if (contactForm) {
    contactForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const inputs = contactForm.querySelectorAll('input[required], textarea[required]');
        let isValid = true;

        inputs.forEach(input => {
            if (!validateField(input)) isValid = false;
        });

        if (!isValid) {
            showNotification('Por favor, completa todos los campos obligatorios correctamente.', 'error');
            return;
        }

        const formData = new FormData(contactForm);
        const submitButton = contactForm.querySelector('button[type="submit"]');
        const originalButtonText = submitButton.textContent;

        submitButton.disabled = true;
        submitButton.textContent = 'ENVIANDO...';
        submitButton.style.opacity = '0.7';

        try {
            if (!formData.has('form-name')) {
                formData.append('form-name', 'contacto');
            }

            const response = await fetch('/', {
                method: 'POST',
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                body: new URLSearchParams(formData).toString()
            });

            const responseText = await response.text();

            if (response.ok && (responseText.includes('success') || responseText.includes('Thank you') || responseText === '')) {
                showNotification('¡Mensaje enviado con éxito! Nos pondremos en contacto contigo pronto.', 'success');
                contactForm.reset();
            } else {
                throw new Error('Error en la respuesta del servidor');
            }
        } catch (error) {
            showNotification('Hubo un error al enviar el mensaje. Por favor, inténtalo de nuevo o contáctanos por teléfono.', 'error');
            console.error('Error al enviar formulario:', error);
        } finally {
            submitButton.disabled = false;
            submitButton.textContent = originalButtonText;
            submitButton.style.opacity = '1';
        }
    });
}

// ============================================
// NOTIFICACIONES
// ============================================

function showNotification(message, type = 'success') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;

    const bgColor = type === 'success' ? '#457B9D' : '#d83030';

    Object.assign(notification.style, {
        position: 'fixed',
        top: '20px',
        right: '20px',
        padding: '16px 24px',
        backgroundColor: bgColor,
        color: 'white',
        borderRadius: '4px',
        boxShadow: '0 8px 24px rgba(29, 53, 87, 0.25)',
        zIndex: '10000',
        maxWidth: '400px',
        animation: 'slideInRight 0.3s ease',
        fontWeight: '600',
        fontSize: '0.95rem',
        textTransform: 'uppercase',
        letterSpacing: '0.05em',
        fontFamily: 'DM Mono, monospace'
    });

    if (!document.getElementById('notification-styles')) {
        const style = document.createElement('style');
        style.id = 'notification-styles';
        style.textContent = `
            @keyframes slideInRight {
                from { transform: translateX(100%); opacity: 0; }
                to { transform: translateX(0); opacity: 1; }
            }
            @keyframes slideOutRight {
                from { transform: translateX(0); opacity: 1; }
                to { transform: translateX(100%); opacity: 0; }
            }
        `;
        document.head.appendChild(style);
    }

    document.body.appendChild(notification);

    setTimeout(() => {
        notification.style.animation = 'slideOutRight 0.3s ease';
        setTimeout(() => {
            if (notification.parentNode) notification.parentNode.removeChild(notification);
        }, 300);
    }, 5000);
}

// ============================================
// ANIMACIONES AL SCROLL (Intersection Observer)
// ============================================

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('.service-card, .gallery-item').forEach((el, index) => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = `opacity 0.6s ease ${index * 0.1}s, transform 0.6s ease ${index * 0.1}s`;
        observer.observe(el);
    });
});

// ============================================
// CURSOR PERSONALIZADO CON HOVER
// ============================================
(function() {
    const cursor = document.createElement('div');
    cursor.className = 'custom-cursor';
    document.body.appendChild(cursor);

    let cursorX = 0, cursorY = 0, currentX = 0, currentY = 0;

    document.addEventListener('mousemove', (e) => {
        cursorX = e.clientX;
        cursorY = e.clientY;
    });

    function animateCursor() {
        currentX += (cursorX - currentX) * 0.2;
        currentY += (cursorY - currentY) * 0.2;
        cursor.style.left = currentX + 'px';
        cursor.style.top = currentY + 'px';
        requestAnimationFrame(animateCursor);
    }

    animateCursor();

    function updateInteractiveElements() {
        document.querySelectorAll('a, button, input, textarea, select, [href], [role="button"]').forEach(el => {
            el.addEventListener('mouseenter', () => cursor.classList.add('cursor-hover'));
            el.addEventListener('mouseleave', () => cursor.classList.remove('cursor-hover'));
        });
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', updateInteractiveElements);
    } else {
        updateInteractiveElements();
    }
})();

// ============================================
// VALIDACIÓN DE FORMULARIO EN TIEMPO REAL
// ============================================

if (contactForm) {
    contactForm.querySelectorAll('input, textarea').forEach(input => {
        input.addEventListener('blur', () => validateField(input));
        input.addEventListener('input', () => {
            if (input.classList.contains('error')) validateField(input);
        });
    });
}

function validateField(field) {
    const value = field.value.trim();
    let isValid = true;
    let errorMessage = '';

    const existingError = field.parentElement.querySelector('.error-message');
    if (existingError) existingError.remove();
    field.classList.remove('error');

    if (field.hasAttribute('required') && !value) {
        isValid = false;
        errorMessage = 'Este campo es obligatorio';
    }

    if (field.type === 'email' && value) {
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
            isValid = false;
            errorMessage = 'Por favor, introduce un email válido';
        }
    }

    if (!isValid) {
        field.classList.add('error');
        const errorElement = document.createElement('span');
        errorElement.className = 'error-message';
        errorElement.textContent = errorMessage;
        errorElement.style.cssText = 'color: #d83030; font-size: 0.875rem; margin-top: 0.25rem; display: block; font-weight: 500;';
        field.parentElement.appendChild(errorElement);
        field.style.borderColor = '#d83030';
    } else {
        field.style.borderColor = '';
    }

    return isValid;
}

// ============================================
// CARRUSEL FLOTA DE CAMIONES
// ============================================
(function() {
    const carousel = document.getElementById('fleetCarousel');
    const track = document.getElementById('fleetCarouselTrack');
    const prevBtn = document.getElementById('fleetCarouselPrev');
    const nextBtn = document.getElementById('fleetCarouselNext');
    const dotsContainer = document.getElementById('fleetCarouselDots');

    if (!carousel || !track || !prevBtn || !nextBtn || !dotsContainer) return;

    const slides = track.querySelectorAll('.fleet-carousel-slide');
    const totalSlides = slides.length;
    let currentIndex = 0;
    let isTransitioning = false;

    function createDots() {
        for (let i = 0; i < totalSlides; i++) {
            const dot = document.createElement('button');
            dot.className = 'fleet-carousel-dot';
            if (i === 0) dot.classList.add('active');
            dot.setAttribute('aria-label', `Ir a imagen ${i + 1}`);
            dot.addEventListener('click', () => goToSlide(i));
            dotsContainer.appendChild(dot);
        }
    }

    function updateCarousel() {
        if (isTransitioning) return;
        isTransitioning = true;
        track.style.transform = `translateX(${-currentIndex * 100}%)`;
        dotsContainer.querySelectorAll('.fleet-carousel-dot').forEach((dot, index) => {
            dot.classList.toggle('active', index === currentIndex);
        });
        setTimeout(() => { isTransitioning = false; }, 500);
    }

    function goToSlide(index) {
        if (index < 0 || index >= totalSlides || isTransitioning) return;
        currentIndex = index;
        updateCarousel();
    }

    function nextSlide() {
        goToSlide(currentIndex < totalSlides - 1 ? currentIndex + 1 : 0);
    }

    function prevSlide() {
        goToSlide(currentIndex > 0 ? currentIndex - 1 : totalSlides - 1);
    }

    nextBtn.addEventListener('click', nextSlide);
    prevBtn.addEventListener('click', prevSlide);

    let touchStartX = 0;
    track.addEventListener('touchstart', (e) => {
        touchStartX = e.changedTouches[0].screenX;
    }, { passive: true });
    track.addEventListener('touchend', (e) => {
        const diff = touchStartX - e.changedTouches[0].screenX;
        if (Math.abs(diff) > 50) {
            diff > 0 ? nextSlide() : prevSlide();
        }
    }, { passive: true });

    createDots();
    updateCarousel();
})();
