// ============================================
// MENÚ MÓVIL
// ============================================

const menuToggle = document.getElementById('menuToggle');
const navMenu = document.getElementById('navMenu');

if (menuToggle && navMenu) {
    menuToggle.addEventListener('click', () => {
        navMenu.classList.toggle('active');
        
        // Animación del botón hamburguesa
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
    const navLinks = navMenu.querySelectorAll('.nav-link');
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
// HEADER SCROLL EFFECT
// ============================================

const header = document.getElementById('header');
let lastScroll = 0;

// Header ya es sticky con fondo, no necesita cambios al scroll

// ============================================
// SMOOTH SCROLL PARA ENLACES ANCLA
// ============================================

document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        
        if (target) {
            const headerHeight = header ? header.offsetHeight : 0;
            const targetPosition = target.offsetTop - headerHeight;
            
            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
        }
    });
});

// ============================================
// CAMBIO DE COLOR EN HERO Y RELUME CON SCROLL
// Efecto continuo desde que el título del hero desaparece hasta que aparece servicios
// ============================================
function handleHeroRelumeScroll() {
    const heroSection = document.querySelector('.hero');
    const relumeSection = document.querySelector('.relume-section');
    const servicesSection = document.querySelector('.services');
    
    if (!heroSection || !relumeSection || !servicesSection) return;

    // Obtener posiciones absolutas en el documento
    const heroRect = heroSection.getBoundingClientRect();
    const servicesRect = servicesSection.getBoundingClientRect();
    const scrollY = window.scrollY || window.pageYOffset;
    const windowHeight = window.innerHeight;
    
    // Calcular posición absoluta del final del hero (cuando desaparece completamente)
    const heroBottom = scrollY + heroRect.top + heroRect.height;
    
    // Calcular posición absoluta del inicio de servicios
    // Queremos que la transición termine ANTES de que servicios sea visible
    const servicesTop = scrollY + servicesRect.top;
    const offsetBeforeServices = windowHeight; // Terminar la transición cuando servicios aún está 1 viewport completo abajo
    const scrollEnd = servicesTop - offsetBeforeServices;
    
    // Rango de scroll: desde que el hero desaparece hasta antes de que servicios aparezca
    const scrollStart = heroBottom; // Cuando el hero desaparece
    const scrollRange = scrollEnd - scrollStart;
    
    let scrollProgress = 0;
    
    if (scrollRange > 0) {
        // Calcular progreso basado en la posición actual del scroll
        scrollProgress = Math.max(0, Math.min(1, 
            (scrollY - scrollStart) / scrollRange
        ));
    } else {
        // Si el rango es negativo o cero, usar posición relativa del viewport
        if (heroRect.bottom < 0 && servicesRect.top > offsetBeforeServices) {
            // El hero ya desapareció y servicios aún no aparece
            const currentRange = servicesRect.top - offsetBeforeServices - heroRect.bottom;
            if (currentRange > 0) {
                scrollProgress = Math.max(0, Math.min(1, 
                    (-heroRect.bottom) / currentRange
                ));
            } else {
                scrollProgress = 1; // Ya terminó la transición
            }
        } else if (heroRect.bottom >= 0) {
            // El hero aún es visible
            scrollProgress = 0;
        } else {
            // Servicios ya está visible o muy cerca -> transición completa
            scrollProgress = 1;
        }
    }
    
    // Aplicar función easing ease-in-out para transición suave al inicio/final, rápida en el centro
    // Usando la función smoothstep: 3t² - 2t³
    const easedProgress = scrollProgress * scrollProgress * (3 - 2 * scrollProgress);

    // Interpolar entre negro profundo (#0a0a0a) y gris ultra claro (#f5f5f5)
    const startColor = { r: 10, g: 10, b: 10 }; // --black-deep
    const endColor = { r: 245, g: 245, b: 245 }; // --gray-ultra-light

    const currentR = Math.round(startColor.r + (endColor.r - startColor.r) * easedProgress);
    const currentG = Math.round(startColor.g + (endColor.g - startColor.g) * easedProgress);
    const currentB = Math.round(startColor.b + (endColor.b - startColor.b) * easedProgress);

    const backgroundColor = `rgb(${currentR}, ${currentG}, ${currentB})`;
    
    // Aplicar el mismo color de fondo a la sección relume
    relumeSection.style.backgroundColor = backgroundColor;

    // Cambiar color del texto en Sobre Nosotros
    const relumeTitleTag = relumeSection.querySelector('.relume-tagline');
    const relumeText = relumeSection.querySelector('.relume-text');
    
    // Botones en la sección relume
    const relumeButtons = relumeSection.querySelectorAll('.btn');
    
    if (easedProgress > 0.5) {
        // Fondo claro -> texto oscuro
        if (relumeTitleTag) relumeTitleTag.style.color = '#6b6b6b';
        if (relumeText) relumeText.style.color = '#0a0a0a';
        
        // Cambiar botones a versión normal (para fondos claros)
        relumeButtons.forEach(btn => {
            if (btn.classList.contains('btn-normal-dark')) {
                btn.classList.remove('btn-normal-dark');
                btn.classList.add('btn-normal');
            } else if (btn.classList.contains('btn-outline-dark')) {
                btn.classList.remove('btn-outline-dark');
                btn.classList.add('btn-outline');
            } else if (btn.classList.contains('btn-link-dark')) {
                btn.classList.remove('btn-link-dark');
                btn.classList.add('btn-link');
            }
        });
    } else {
        // Fondo oscuro -> texto claro
        if (relumeTitleTag) relumeTitleTag.style.color = '#9a9a9a';
        if (relumeText) relumeText.style.color = '#ffffff';
        
        // Cambiar botones a versión dark (para fondos oscuros)
        relumeButtons.forEach(btn => {
            if (btn.classList.contains('btn-normal')) {
                btn.classList.remove('btn-normal');
                btn.classList.add('btn-normal-dark');
            } else if (btn.classList.contains('btn-outline')) {
                btn.classList.remove('btn-outline');
                btn.classList.add('btn-outline-dark');
            } else if (btn.classList.contains('btn-link')) {
                btn.classList.remove('btn-link');
                btn.classList.add('btn-link-dark');
            }
        });
    }
}

// ============================================
// PARALLAX PARA IMAGEN Y TEXTO DEL HERO
// Efecto sutil y elegante con movimiento lento y ligera escala
// ============================================
function handleHeroParallax() {
    const heroImage = document.querySelector('.hero-bg-image');
    const heroTextOverlay = document.querySelector('.hero-text-overlay');
    const heroSection = document.querySelector('.hero');
    
    if (!heroImage || !heroSection) return;
    
    const scrollY = window.scrollY || window.pageYOffset;
    const heroRect = heroSection.getBoundingClientRect();
    const windowHeight = window.innerHeight;
    
    // Solo aplicar parallax cuando el hero está visible en viewport
    if (heroRect.bottom > 0 && heroRect.top < windowHeight) {
        // Calcular el progreso del scroll dentro de la sección hero
        const heroTop = heroRect.top;
        const heroHeight = heroRect.height;
        
        // Calcular progreso basado en la posición del hero en el viewport
        // Cuando heroTop = windowHeight, el hero está justo entrando (progreso = 0)
        // Cuando heroTop = -heroHeight, el hero sale completamente (progreso = 1)
        const scrollRange = heroHeight + windowHeight;
        const scrollProgress = Math.max(0, Math.min(1, 
            (windowHeight - heroTop) / scrollRange
        ));
        
        // Easing suave (smoothstep)
        const easedProgress = scrollProgress * scrollProgress * (3 - 2 * scrollProgress);
        
        // Parallax: la imagen se mueve más lento que el scroll (hacia abajo)
        // La imagen se desplaza hacia abajo más lento que el scroll normal
        const parallaxSpeed = 0.4; // 40% de la velocidad del scroll
        const parallaxOffset = scrollY * parallaxSpeed;
        
        // Escala sutil: la imagen crece ligeramente al hacer scroll
        const scaleStart = 1.0;
        const scaleEnd = 1.1; // 10% de aumento
        const scale = scaleStart + (scaleEnd - scaleStart) * easedProgress;
        
        // Aplicar transformaciones a la imagen (positivo para mover hacia abajo)
        heroImage.style.transform = `translateY(${parallaxOffset}px) scale(${scale})`;
        
        // Efecto parallax para el texto: se mueve hacia abajo
        if (heroTextOverlay) {
            // El texto se mueve más rápido que la imagen para crear profundidad
            const textParallaxSpeed = 0.6; // 60% de la velocidad del scroll
            const textParallaxOffset = scrollY * textParallaxSpeed;
            
            // Aplicar transformaciones al texto (solo movimiento, sin cambio de opacidad)
            heroTextOverlay.style.transform = `translateY(${textParallaxOffset}px)`;
        }
    } else {
        // Resetear cuando el hero no es visible
        heroImage.style.transform = 'translateY(0) scale(1)';
        if (heroTextOverlay) {
            heroTextOverlay.style.transform = 'translateY(0)';
        }
    }
}

// Ejecutar en scroll con throttling para mejor performance
let ticking = false;
function onScroll() {
    if (!ticking) {
        window.requestAnimationFrame(() => {
            handleHeroRelumeScroll();
            handleHeroParallax();
            ticking = false;
        });
        ticking = true;
    }
}

window.addEventListener('scroll', onScroll, { passive: true });
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
        
        const formData = new FormData(contactForm);
        const submitButton = contactForm.querySelector('button[type="submit"]');
        const originalButtonText = submitButton.textContent;
        
        // Deshabilitar botón y mostrar estado de carga
        submitButton.disabled = true;
        submitButton.textContent = 'ENVIANDO...';
        submitButton.style.opacity = '0.7';
        
        try {
            // Enviar formulario a Netlify Forms usando URLSearchParams (según documentación oficial)
            const response = await fetch('/', {
                method: 'POST',
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                body: new URLSearchParams(formData).toString()
            });
            
            if (response.ok) {
                // Mostrar mensaje de éxito
                showNotification('¡Mensaje enviado con éxito! Nos pondremos en contacto contigo pronto.', 'success');
                
                // Resetear formulario
                contactForm.reset();
            } else {
                throw new Error('Error en la respuesta del servidor');
            }
            
        } catch (error) {
            // Mostrar mensaje de error
            showNotification('Hubo un error al enviar el mensaje. Por favor, inténtalo de nuevo o contáctanos por teléfono.', 'error');
            console.error('Error al enviar formulario:', error);
        } finally {
            // Restaurar botón
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
    // Crear elemento de notificación
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    
    // Estilos inline para la notificación
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
    
    // Agregar animación CSS si no existe
    if (!document.getElementById('notification-styles')) {
        const style = document.createElement('style');
        style.id = 'notification-styles';
        style.textContent = `
            @keyframes slideInRight {
                from {
                    transform: translateX(100%);
                    opacity: 0;
                }
                to {
                    transform: translateX(0);
                    opacity: 1;
                }
            }
            @keyframes slideOutRight {
                from {
                    transform: translateX(0);
                    opacity: 1;
                }
                to {
                    transform: translateX(100%);
                    opacity: 0;
                }
            }
        `;
        document.head.appendChild(style);
    }
    
    document.body.appendChild(notification);
    
    // Remover notificación después de 5 segundos
    setTimeout(() => {
        notification.style.animation = 'slideOutRight 0.3s ease';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    }, 5000);
}

// ============================================
// ANIMACIONES AL SCROLL (Intersection Observer)
// ============================================

const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Observar elementos para animación
document.addEventListener('DOMContentLoaded', () => {
    const animateElements = document.querySelectorAll('.service-card, .gallery-item');
    
    animateElements.forEach((el, index) => {
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
    // Crear cursor personalizado
    const cursor = document.createElement('div');
    cursor.className = 'custom-cursor';
    document.body.appendChild(cursor);
    
    // Seguir el mouse con suavizado
    let cursorX = 0;
    let cursorY = 0;
    let currentX = 0;
    let currentY = 0;
    
    document.addEventListener('mousemove', (e) => {
        cursorX = e.clientX;
        cursorY = e.clientY;
    });
    
    function animateCursor() {
        // Suavizado del cursor (lerp)
        currentX += (cursorX - currentX) * 0.2;
        currentY += (cursorY - currentY) * 0.2;
        
        cursor.style.left = currentX + 'px';
        cursor.style.top = currentY + 'px';
        
        requestAnimationFrame(animateCursor);
    }
    
    animateCursor();
    
    // Detectar elementos interactivos para hover
    function updateInteractiveElements() {
        const interactiveElements = document.querySelectorAll('a, button, input, textarea, select, [href], [role="button"]');
        
        interactiveElements.forEach(el => {
            el.addEventListener('mouseenter', () => {
                cursor.classList.add('cursor-hover');
            });
            
            el.addEventListener('mouseleave', () => {
                cursor.classList.remove('cursor-hover');
            });
        });
    }
    
    // Ejecutar cuando el DOM esté listo
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
    const inputs = contactForm.querySelectorAll('input, textarea');
    
    inputs.forEach(input => {
        input.addEventListener('blur', () => {
            validateField(input);
        });
        
        input.addEventListener('input', () => {
            if (input.classList.contains('error')) {
                validateField(input);
            }
        });
    });
}

function validateField(field) {
    const value = field.value.trim();
    let isValid = true;
    let errorMessage = '';
    
    // Remover mensajes de error previos
    const existingError = field.parentElement.querySelector('.error-message');
    if (existingError) {
        existingError.remove();
    }
    field.classList.remove('error');
    
    // Validar campo requerido
    if (field.hasAttribute('required') && !value) {
        isValid = false;
        errorMessage = 'Este campo es obligatorio';
    }
    
    // Validar email
    if (field.type === 'email' && value) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value)) {
            isValid = false;
            errorMessage = 'Por favor, introduce un email válido';
        }
    }
    
    // Mostrar error si existe
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

