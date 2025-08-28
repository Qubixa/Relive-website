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
    
    // Update active nav link based on scroll position
    updateActiveNavLink();
});

// Mobile Navigation
// Mobile Navigation Toggle
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

// Dropdown functionality for both desktop and mobile
const dropdowns = document.querySelectorAll('.dropdown');

dropdowns.forEach(dropdown => {
    const dropdownLink = dropdown.querySelector('.nav-link');
    const dropdownContent = dropdown.querySelector('.dropdown-content');
    const chevron = dropdownLink.querySelector('i');
    
    // Toggle dropdown on click (for mobile)
    dropdownLink.addEventListener('click', (e) => {
        if (window.innerWidth <= 968) {
            e.preventDefault();
            dropdown.classList.toggle('active');
            
            // Rotate chevron icon
            if (chevron) {
                if (dropdown.classList.contains('active')) {
                    chevron.style.transform = 'rotate(180deg)';
                } else {
                    chevron.style.transform = 'rotate(0deg)';
                }
            }
        }
    });
    
    // Show dropdown on hover (for desktop)
    dropdown.addEventListener('mouseenter', () => {
        if (window.innerWidth > 968) {
            dropdown.classList.add('active');
            if (chevron) {
                chevron.style.transform = 'rotate(180deg)';
            }
        }
    });
    
    // Hide dropdown when mouse leaves (for desktop)
    dropdown.addEventListener('mouseleave', () => {
        if (window.innerWidth > 968) {
            dropdown.classList.remove('active');
            if (chevron) {
                chevron.style.transform = 'rotate(0deg)';
            }
        }
    });
});

// Close dropdowns when clicking outside
document.addEventListener('click', (e) => {
    if (!e.target.closest('.dropdown')) {
        dropdowns.forEach(dropdown => {
            dropdown.classList.remove('active');
            const chevron = dropdown.querySelector('i');
            if (chevron) {
                chevron.style.transform = 'rotate(0deg)';
            }
        });
    }
});

// Update dropdown behavior on window resize
window.addEventListener('resize', () => {
    // Close all dropdowns on resize
    dropdowns.forEach(dropdown => {
        dropdown.classList.remove('active');
        const chevron = dropdown.querySelector('i');
        if (chevron) {
            chevron.style.transform = 'rotate(0deg)';
        }
    });
    
    // Close mobile menu if resizing to desktop
    if (window.innerWidth > 968) {
        navToggle.classList.remove('active');
        navMenu.classList.remove('active');
        document.body.style.overflow = '';
    }
});
// Update active nav link based on scroll position
function updateActiveNavLink() {
    const scrollPosition = window.scrollY;
    
    document.querySelectorAll('section').forEach(section => {
        const sectionTop = section.offsetTop - 100;
        const sectionBottom = sectionTop + section.offsetHeight;
        const sectionId = section.getAttribute('id');
        
        if (scrollPosition >= sectionTop && scrollPosition < sectionBottom) {
            document.querySelectorAll('.nav-link').forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('href') === `#${sectionId}` || 
                    link.getAttribute('href').includes(sectionId)) {
                    link.classList.add('active');
                }
            });
        }
    });
}

// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        
        const targetId = this.getAttribute('href');
        if (targetId === '#') return;
        
        const targetElement = document.querySelector(targetId);
        if (targetElement) {
            const headerHeight = header.offsetHeight;
            const targetPosition = targetElement.getAttribute('id') === 'home' ? 
                0 : targetElement.offsetTop - headerHeight;
            
            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
            
            // Update URL without reload
            if (history.pushState) {
                history.pushState(null, null, targetId);
            } else {
                location.hash = targetId;
            }
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

// Video Player Functionality
const energyVideo = document.getElementById('energy-video');
const playButton = document.getElementById('play-button');
const playPauseBtn = document.getElementById('play-pause-btn');
const progressBar = document.getElementById('progress-bar');
const muteBtn = document.getElementById('mute-btn');
const fullscreenBtn = document.getElementById('fullscreen-btn');

// Play button click handler
playButton.addEventListener('click', () => {
    energyVideo.play();
    playButton.style.display = 'none';
    document.querySelector('.video-controls').style.opacity = '1';
});

// Play/Pause button
playPauseBtn.addEventListener('click', () => {
    if (energyVideo.paused) {
        energyVideo.play();
        playPauseBtn.innerHTML = '<i class="fas fa-pause"></i>';
    } else {
        energyVideo.pause();
        playPauseBtn.innerHTML = '<i class="fas fa-play"></i>';
    }
});

// Progress bar update
energyVideo.addEventListener('timeupdate', () => {
    const progress = (energyVideo.currentTime / energyVideo.duration) * 100;
    progressBar.value = progress;
});

// Progress bar seek
progressBar.addEventListener('input', () => {
    const seekTime = (progressBar.value / 100) * energyVideo.duration;
    energyVideo.currentTime = seekTime;
});

// Mute button
muteBtn.addEventListener('click', () => {
    energyVideo.muted = !energyVideo.muted;
    muteBtn.innerHTML = energyVideo.muted ? 
        '<i class="fas fa-volume-mute"></i>' : '<i class="fas fa-volume-up"></i>';
});

// Fullscreen button
fullscreenBtn.addEventListener('click', () => {
    if (!document.fullscreenElement) {
        document.querySelector('.video-container').requestFullscreen().catch(err => {
            console.error(`Error attempting to enable fullscreen: ${err.message}`);
        });
    } else {
        document.exitFullscreen();
    }
});

// Video ended event
energyVideo.addEventListener('ended', () => {
    playPauseBtn.innerHTML = '<i class="fas fa-play"></i>';
    playButton.style.display = 'flex';
});

// Testimonial Slider
const testimonialSlides = document.querySelectorAll('.testimonial-slide');
const testimonialDots = document.querySelectorAll('.dot');
const prevBtn = document.querySelector('.testimonial-prev');
const nextBtn = document.querySelector('.testimonial-next');
let currentTestimonial = 0;

function showTestimonial(index) {
    testimonialSlides.forEach(slide => slide.classList.remove('active'));
    testimonialDots.forEach(dot => dot.classList.remove('active'));
    
    testimonialSlides[index].classList.add('active');
    testimonialDots[index].classList.add('active');
    currentTestimonial = index;
}

function nextTestimonial() {
    let nextIndex = (currentTestimonial + 1) % testimonialSlides.length;
    showTestimonial(nextIndex);
}

function prevTestimonial() {
    let prevIndex = (currentTestimonial - 1 + testimonialSlides.length) % testimonialSlides.length;
    showTestimonial(prevIndex);
}

// Auto-advance testimonials
let testimonialInterval = setInterval(nextTestimonial, 5000);

// Pause auto-advance on hover
document.querySelector('.testimonial-slider').addEventListener('mouseenter', () => {
    clearInterval(testimonialInterval);
});

document.querySelector('.testimonial-slider').addEventListener('mouseleave', () => {
    testimonialInterval = setInterval(nextTestimonial, 5000);
});

// Navigation buttons
nextBtn.addEventListener('click', () => {
    clearInterval(testimonialInterval);
    nextTestimonial();
    testimonialInterval = setInterval(nextTestimonial, 5000);
});

prevBtn.addEventListener('click', () => {
    clearInterval(testimonialInterval);
    prevTestimonial();
    testimonialInterval = setInterval(nextTestimonial, 5000);
});

// Dot navigation
testimonialDots.forEach((dot, index) => {
    dot.addEventListener('click', () => {
        clearInterval(testimonialInterval);
        showTestimonial(index);
        testimonialInterval = setInterval(nextTestimonial, 5000);
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
            to_name: 'Relive Dance & Fitness'
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

// Initialize active nav link based on current URL
function initializeActiveNavLink() {
    const currentPath = window.location.pathname.split('/').pop() || 'index.html';
    const currentHash = window.location.hash;
    
    // Remove active class from all links
    navLinks.forEach(link => link.classList.remove('active'));
    
    // Set active class based on current page
    if (currentHash) {
        const targetLink = document.querySelector(`.nav-link[href="${currentHash}"]`);
        if (targetLink) targetLink.classList.add('active');
    } else {
        const targetLink = document.querySelector(`.nav-link[href="${currentPath}"]`);
        if (targetLink) {
            targetLink.classList.add('active');
        } else {
            // Default to home if no match
            document.querySelector('.nav-link[href="index.html"]').classList.add('active');
        }
    }
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
    initializeActiveNavLink();
    updateActiveNavLink();
    
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
});

// Preload critical images for better performance
function preloadImages() {
    const criticalImages = [
        './public/1st image.jpg',
        './public/2nd image.jpg',
        './public/3rd.jpg',
        './public/4th.jpg',
        './public/video.mp4'
    ];
    
    criticalImages.forEach(src => {
        const img = new Image();
        img.src = src;
    });
}

// Initialize preloading after page load
window.addEventListener('load', preloadImages);



