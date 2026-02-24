// Services Carousel Slider
let currentSlidePosition = 0;
const cardsPerView = 3;

function slideServices(direction) {
    const servicesGrid = document.getElementById('servicesGrid');
    const serviceCards = document.querySelectorAll('.service-card');
    const totalCards = serviceCards.length;
    const cardWidth = serviceCards[0].offsetWidth + 32; // 32 is the gap

    currentSlidePosition += direction;

    // Prevent sliding beyond available cards - adjusted to show all 15 cards
    if (currentSlidePosition < 0) {
        currentSlidePosition = 0;
    } else if (currentSlidePosition > totalCards - cardsPerView) {
        currentSlidePosition = totalCards - cardsPerView;
    }

    const offset = currentSlidePosition * cardWidth;
    servicesGrid.style.transform = `translateX(-${offset}px)`;
}

// Mobile Menu Toggle
const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('.nav-menu');

if (hamburger) {
    hamburger.addEventListener('click', () => {
        navMenu.classList.toggle('active');
    });

    // Close menu when clicking on a link
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', () => {
            navMenu.classList.remove('active');
        });
    });

    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
        if (!e.target.closest('.nav-container')) {
            navMenu.classList.remove('active');
        }
    });
}

// Smooth scroll function
function scrollToSection(id) {
    const section = document.getElementById(id);
    if (section) {
        section.scrollIntoView({ behavior: 'smooth' });
    }
}

// Form Submission Handler
const contactForm = document.getElementById('contactForm');
if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        // Get form values
        const formData = {
            name: document.getElementById('name').value,
            email: document.getElementById('email').value,
            phone: document.getElementById('phone').value,
            subject: document.getElementById('subject').value,
            service: document.getElementById('service').value,
            message: document.getElementById('message').value
        };

        // Validate form
        if (!formData.name || !formData.email || !formData.subject || !formData.message) {
            showNotification('Please fill in all required fields', 'error');
            return;
        }

        // Validate email
        if (!isValidEmail(formData.email)) {
            showNotification('Please enter a valid email address', 'error');
            return;
        }

        // Simulate form submission (in production, this would send to a backend)
        const submitButton = contactForm.querySelector('.submit-button');
        const originalText = submitButton.textContent;
        submitButton.textContent = 'Sending...';
        submitButton.disabled = true;

        // Simulate API call
        setTimeout(() => {
            // Store form data in localStorage for demonstration
            const submissions = JSON.parse(localStorage.getItem('formSubmissions') || '[]');
            submissions.push({
                ...formData,
                timestamp: new Date().toLocaleString()
            });
            localStorage.setItem('formSubmissions', JSON.stringify(submissions));

            showNotification('Contract inquiry sent successfully! We\'ll contact you soon.', 'success');
            contactForm.reset();
            submitButton.textContent = originalText;
            submitButton.disabled = false;

            // Log the submission
            console.log('Form submitted:', formData);
        }, 1500);
    });
}

// Email validation
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Notification system
function showNotification(message, type = 'success') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 1rem 1.5rem;
        background-color: ${type === 'success' ? '#4caf50' : '#f44336'};
        color: white;
        border-radius: 5px;
        z-index: 2000;
        animation: slideInRight 0.3s ease;
        font-weight: 500;
        max-width: 300px;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    `;

    document.body.appendChild(notification);

    // Remove notification after 5 seconds
    setTimeout(() => {
        notification.style.animation = 'slideOutRight 0.3s ease';
        setTimeout(() => {
            notification.remove();
        }, 300);
    }, 5000);
}

// Add slide animations to CSS
const style = document.createElement('style');
style.textContent = `
    @keyframes slideInRight {
        from {
            opacity: 0;
            transform: translateX(100px);
        }
        to {
            opacity: 1;
            transform: translateX(0);
        }
    }

    @keyframes slideOutRight {
        from {
            opacity: 1;
            transform: translateX(0);
        }
        to {
            opacity: 0;
            transform: translateX(100px);
        }
    }
`;
document.head.appendChild(style);

// Intersection Observer for scroll animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -100px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Observe service and portfolio cards
document.querySelectorAll('.service-card, .portfolio-item').forEach(card => {
    card.style.opacity = '0';
    card.style.transform = 'translateY(20px)';
    card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    observer.observe(card);
});

// Add active link highlighting
const navLinks = document.querySelectorAll('.nav-link');
const sections = document.querySelectorAll('section');

window.addEventListener('scroll', () => {
    let current = '';
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        if (pageYOffset >= sectionTop - 200) {
            current = section.getAttribute('id');
        }
    });

    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href').slice(1) === current) {
            link.classList.add('active');
        }
    });
});

// Add active link styles
const styleSheet = document.createElement('style');
styleSheet.textContent = `
    .nav-link.active {
        border-bottom: 2px solid var(--primary-color);
        padding-bottom: 0.5rem;
    }
`;
document.head.appendChild(styleSheet);

// Print form submissions (for demonstration)
window.printFormSubmissions = function() {
    const submissions = JSON.parse(localStorage.getItem('formSubmissions') || '[]');
    if (submissions.length === 0) {
        console.log('No form submissions yet');
        return;
    }
    console.table(submissions);
};

// Initialize AOS-like animations on page load
window.addEventListener('load', () => {
    document.querySelectorAll('.service-card, .portfolio-item').forEach((card, index) => {
        card.style.animationDelay = `${index * 0.1}s`;
    });
});

// Form field character counter
const messageField = document.getElementById('message');
if (messageField) {
    messageField.addEventListener('input', function() {
        const maxChars = 5000;
        const charCount = this.value.length;
        if (charCount > maxChars) {
            this.value = this.value.substring(0, maxChars);
        }
    });
}

// Prevent form submission with Enter on non-textarea fields
document.querySelectorAll('.contact-form input[type="text"], .contact-form input[type="email"], .contact-form input[type="tel"]').forEach(input => {
    input.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
        }
    });
});

console.log('NTech Engineering website loaded successfully!');
