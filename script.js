// Initialize EmailJS
emailjs.init("YOUR_PUBLIC_KEY"); // Replace with your EmailJS public key

// DOM Elements
const loadingOverlay = document.getElementById('loading-overlay');
const header = document.getElementById('header');
const navToggle = document.getElementById('nav-toggle');
const navMenu = document.getElementById('nav-menu');
const navLinks = document.querySelectorAll('.nav-link');
const backToTopBtn = document.getElementById('back-to-top');
const contactForm = document.getElementById('contact-form');
const filterBtns = document.querySelectorAll('.filter-btn');
const classCards = document.querySelectorAll('.class-card');

// Loading Screen
window.addEventListener('load', () => {
    setTimeout(() => {
        loadingOverlay.classList.add('hide');
        setTimeout(() => {
            loadingOverlay.style.display = 'none';
        }, 500);
    }, 1000);
});

// Initialize AOS (Animate On Scroll)
AOS.init({
    duration: 800,
    easing: 'ease-out-cubic',
    once: true,
    offset: 100
});

// Header Scroll Effect
window.addEventListener('scroll', () => {
    if (window.scrollY > 100) {
        header.classList.add('scrolled');
    } else {
        header.classList.remove('scrolled');
    }
    
    // Back to top button
    if (window.scrollY > 500) {
        backToTopBtn.classList.add('show');
    } else {
        backToTopBtn.classList.remove('show');
    }
});

// Mobile Navigation
navToggle.addEventListener('click', () => {
    navToggle.classList.toggle('active');
    navMenu.classList.toggle('active');
    document.body.style.overflow = navMenu.classList.contains('active') ? 'hidden' : '';
});

// Close mobile menu when clicking on links
navLinks.forEach(link => {
    link.addEventListener('click', () => {
        navToggle.classList.remove('active');
        navMenu.classList.remove('active');
        document.body.style.overflow = '';
    });
});

// Smooth scrolling for navigation links
navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        const targetId = link.getAttribute('href');
        const targetSection = document.querySelector(targetId);
        
        if (targetSection) {
            const headerHeight = header.offsetHeight;
            const targetPosition = targetSection.getBoundingClientRect().top + window.pageYOffset - headerHeight;
            
            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
        }
    });
});

// Hero Carousel
const carouselSlides = document.querySelectorAll('.carousel-slide');
let currentSlide = 0;

function nextSlide() {
    carouselSlides[currentSlide].classList.remove('active');
    currentSlide = (currentSlide + 1) % carouselSlides.length;
    carouselSlides[currentSlide].classList.add('active');
}

// Auto-advance carousel
setInterval(nextSlide, 4000);

// Hero CTA smooth scroll
const heroCta = document.querySelector('.hero-cta');
if (heroCta) {
    heroCta.addEventListener('click', (e) => {
        e.preventDefault();
        const targetSection = document.querySelector('#programs');
        if (targetSection) {
            const headerHeight = header.offsetHeight;
            const targetPosition = targetSection.getBoundingClientRect().top + window.pageYOffset - headerHeight;
            
            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
        }
    });
}

// Program card animations
const programCards = document.querySelectorAll('.program-card');
programCards.forEach(card => {
    card.addEventListener('mouseenter', () => {
        card.style.transform = 'translateY(-10px) scale(1.02)';
    });
    
    card.addEventListener('mouseleave', () => {
        card.style.transform = 'translateY(0) scale(1)';
    });
});

// Class filtering
filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        // Remove active class from all buttons
        filterBtns.forEach(b => b.classList.remove('active'));
        // Add active class to clicked button
        btn.classList.add('active');
        
        const filter = btn.getAttribute('data-filter');
        
        classCards.forEach(card => {
            if (filter === 'all' || card.getAttribute('data-category') === filter) {
                card.style.display = 'block';
                card.style.animation = 'fadeIn 0.5s ease';
            } else {
                card.style.display = 'none';
            }
        });
    });
});

// Form Validation
function validateForm() {
    const formData = new FormData(contactForm);
    let isValid = true;
    
    // Clear previous errors
    document.querySelectorAll('.form-group').forEach(group => {
        group.classList.remove('error');
    });
    
    // Validate required fields
    const requiredFields = ['fullName', 'email', 'message'];
    requiredFields.forEach(field => {
        const value = formData.get(field);
        const group = document.querySelector(`#${field}`).closest('.form-group');
        const errorMessage = group.querySelector('.error-message');
        
        if (!value || value.trim() === '') {
            group.classList.add('error');
            errorMessage.textContent = 'This field is required';
            isValid = false;
        }
    });
    
    // Validate email format
    const email = formData.get('email');
    const emailGroup = document.querySelector('#email').closest('.form-group');
    const emailError = emailGroup.querySelector('.error-message');
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    
    if (email && !emailRegex.test(email)) {
        emailGroup.classList.add('error');
        emailError.textContent = 'Please enter a valid email address';
        isValid = false;
    }
    
    // Validate phone (if provided)
    const phone = formData.get('phone');
    const phoneGroup = document.querySelector('#phone').closest('.form-group');
    const phoneError = phoneGroup.querySelector('.error-message');
    const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
    
    if (phone && phone.trim() !== '' && !phoneRegex.test(phone.replace(/\s+/g, ''))) {
        phoneGroup.classList.add('error');
        phoneError.textContent = 'Please enter a valid phone number';
        isValid = false;
    }
    
    return isValid;
}

// Contact Form Submission
contactForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
        return;
    }
    
    const submitBtn = contactForm.querySelector('.submit-btn');
    const formMessage = document.getElementById('form-message');
    
    // Show loading state
    submitBtn.classList.add('loading');
    submitBtn.disabled = true;
    
    try {
        const formData = new FormData(contactForm);
        
        // EmailJS service configuration
        const templateParams = {
            from_name: formData.get('fullName'),
            from_email: formData.get('email'),
            phone: formData.get('phone') || 'Not provided',
            subject: formData.get('subject') || 'General Inquiry',
            message: formData.get('message'),
            to_name: 'Rhythm Elite Dance Academy'
        };
        
        // Send email using EmailJS
        const response = await emailjs.send(
            'YOUR_SERVICE_ID', // Replace with your EmailJS service ID
            'YOUR_TEMPLATE_ID', // Replace with your EmailJS template ID
            templateParams
        );
        
        if (response.status === 200) {
            // Success
            formMessage.textContent = 'Thank you! Your message has been sent successfully. We\'ll get back to you soon.';
            formMessage.className = 'form-message success show';
            contactForm.reset();
            
            // Hide success message after 5 seconds
            setTimeout(() => {
                formMessage.classList.remove('show');
            }, 5000);
        } else {
            throw new Error('Failed to send message');
        }
        
    } catch (error) {
        console.error('Error sending email:', error);
        formMessage.textContent = 'Sorry, there was an error sending your message. Please try again or contact us directly.';
        formMessage.className = 'form-message error show';
        
        // Hide error message after 5 seconds
        setTimeout(() => {
            formMessage.classList.remove('show');
        }, 5000);
    } finally {
        // Reset button state
        submitBtn.classList.remove('loading');
        submitBtn.disabled = false;
    }
});

// Real-time form validation
const formInputs = document.querySelectorAll('#contact-form input, #contact-form textarea, #contact-form select');
formInputs.forEach(input => {
    input.addEventListener('blur', () => {
        const group = input.closest('.form-group');
        const errorMessage = group.querySelector('.error-message');
        
        if (input.hasAttribute('required') && (!input.value || input.value.trim() === '')) {
            group.classList.add('error');
            errorMessage.textContent = 'This field is required';
        } else if (input.type === 'email' && input.value) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(input.value)) {
                group.classList.add('error');
                errorMessage.textContent = 'Please enter a valid email address';
            } else {
                group.classList.remove('error');
            }
        } else {
            group.classList.remove('error');
        }
    });
    
    input.addEventListener('input', () => {
        const group = input.closest('.form-group');
        if (group.classList.contains('error') && input.value.trim() !== '') {
            group.classList.remove('error');
        }
    });
});

// Back to top functionality
backToTopBtn.addEventListener('click', () => {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
});

// Program and class card interactions
document.querySelectorAll('.program-btn, .join-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        // Add a pulse animation
        btn.style.animation = 'pulse 0.3s ease';
        setTimeout(() => {
            btn.style.animation = '';
        }, 300);
        
        // You can add actual enrollment functionality here
        alert('Thank you for your interest! Please contact us to complete your enrollment.');
    });
});

// Intersection Observer for navigation highlighting
const sections = document.querySelectorAll('section[id]');
const observerOptions = {
    threshold: 0.3,
    rootMargin: '-80px 0px -80px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        const navLink = document.querySelector(`.nav-link[href="#${entry.target.id}"]`);
        if (navLink) {
            if (entry.isIntersecting) {
                document.querySelectorAll('.nav-link').forEach(link => link.classList.remove('active'));
                navLink.classList.add('active');
            }
        }
    });
}, observerOptions);

sections.forEach(section => {
    observer.observe(section);
});

// Performance optimization: Lazy loading for images
const images = document.querySelectorAll('img[loading="lazy"]');
const imageObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const img = entry.target;
            img.src = img.src; // Trigger load
            img.classList.add('fade-in');
            imageObserver.unobserve(img);
        }
    });
});

images.forEach(img => {
    imageObserver.observe(img);
});

// Keyboard navigation support
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && navMenu.classList.contains('active')) {
        navToggle.classList.remove('active');
        navMenu.classList.remove('active');
        document.body.style.overflow = '';
    }
});

// Touch support for mobile interactions
let touchStartY = 0;
document.addEventListener('touchstart', (e) => {
    touchStartY = e.touches[0].clientY;
});

document.addEventListener('touchend', (e) => {
    const touchEndY = e.changedTouches[0].clientY;
    const diff = touchStartY - touchEndY;
    
    // Hide mobile menu on upward swipe
    if (diff > 50 && navMenu.classList.contains('active')) {
        navToggle.classList.remove('active');
        navMenu.classList.remove('active');
        document.body.style.overflow = '';
    }
});

// Analytics and tracking (placeholder)
function trackEvent(eventName, eventData = {}) {
    // Implement your analytics tracking here
    console.log(`Event: ${eventName}`, eventData);
}

// Track form submissions
contactForm.addEventListener('submit', () => {
    trackEvent('contact_form_submit');
});

// Track program interest
document.querySelectorAll('.program-btn').forEach((btn, index) => {
    btn.addEventListener('click', () => {
        const programTitle = btn.closest('.program-card').querySelector('.program-title').textContent;
        trackEvent('program_interest', { program: programTitle });
    });
});

// Track class interest
document.querySelectorAll('.join-btn').forEach((btn) => {
    btn.addEventListener('click', () => {
        const classTitle = btn.closest('.class-card').querySelector('.class-title').textContent;
        trackEvent('class_interest', { class: classTitle });
    });
});

// Initialize tooltips and other UI enhancements
document.addEventListener('DOMContentLoaded', () => {
    // Add focus indicators for accessibility
    const focusableElements = document.querySelectorAll('a, button, input, textarea, select');
    focusableElements.forEach(element => {
        element.addEventListener('focus', () => {
            element.style.outline = '2px solid rgba(255, 255, 255, 0.5)';
            element.style.outlineOffset = '2px';
        });
        
        element.addEventListener('blur', () => {
            element.style.outline = 'none';
        });
    });
});

// Error handling for external resources
window.addEventListener('error', (e) => {
    console.error('Resource loading error:', e);
    // You can implement fallback loading here
});

// Preload critical images for better performance
function preloadImages() {
    const criticalImages = [
        'https://images.pexels.com/photos/416978/pexels-photo-416978.jpeg',
        'https://images.pexels.com/photos/1701194/pexels-photo-1701194.jpeg',
        'https://images.pexels.com/photos/3586966/pexels-photo-3586966.jpeg',
        'https://images.pexels.com/photos/2873486/pexels-photo-2873486.jpeg'
    ];
    
    criticalImages.forEach(src => {
        const img = new Image();
        img.src = src;
    });
}

// Initialize preloading after page load
window.addEventListener('load', preloadImages);