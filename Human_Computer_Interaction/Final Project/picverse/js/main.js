// Main JavaScript file for Picverse website

// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    // Initialize all components
    initMobileMenu();
    initScrollEffects();
    setActiveNavigation();
});

// Mobile Menu Toggle
function initMobileMenu() {
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const nav = document.querySelector('nav');
    const authButtons = document.querySelector('.auth-buttons');

    if (mobileMenuBtn) {
        mobileMenuBtn.addEventListener('click', function() {
            nav.classList.toggle('active');
            authButtons.classList.toggle('active');
            
            // Change hamburger icon
            const icon = this.querySelector('span');
            if (nav.classList.contains('active')) {
                icon.innerHTML = '✕';
            } else {
                icon.innerHTML = '☰';
            }
        });
    }

    // Close mobile menu when clicking on nav links
    const navLinks = document.querySelectorAll('nav a');
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            nav.classList.remove('active');
            authButtons.classList.remove('active');
            const menuBtn = document.querySelector('.mobile-menu-btn span');
            if (menuBtn) {
                menuBtn.innerHTML = '☰';
            }
        });
    });
}

// Set active navigation based on current page
function setActiveNavigation() {
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    const navLinks = document.querySelectorAll('nav a');
    
    navLinks.forEach(link => {
        link.classList.remove('active');
        const href = link.getAttribute('href');
        
        if (href === currentPage || 
            (currentPage === '' && href === 'index.html') ||
            (currentPage === 'index.html' && href === 'index.html')) {
            link.classList.add('active');
        }
    });
}

// Scroll effects for animations
function initScrollEffects() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in');
            }
        });
    }, observerOptions);

    // Observe elements for animation
    const animateElements = document.querySelectorAll('.artwork-card, .tag-card, .forum-card, .user-card');
    animateElements.forEach(el => {
        observer.observe(el);
    });
}

// Utility function to show success message
function showSuccessMessage(title, message, buttonText = 'Continue') {
    const container = document.querySelector('.container');
    const successHTML = `
        <div class="success-message">
            <div class="success-icon">✓</div>
            <h2>${title}</h2>
            <p>${message}</p>
            <button class="btn btn-primary" onclick="hideSuccessMessage()">${buttonText}</button>
        </div>
    `;
    
    container.innerHTML = successHTML;
}

// Hide success message and reload page
function hideSuccessMessage() {
    location.reload();
}

// Smooth scrolling for anchor links
document.addEventListener('click', function(e) {
    if (e.target.matches('a[href^="#"]')) {
        e.preventDefault();
        const target = document.querySelector(e.target.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    }
});

// Add loading states to buttons
function addLoadingState(button, originalText) {
    button.disabled = true;
    button.innerHTML = 'Loading...';
    
    setTimeout(() => {
        button.disabled = false;
        button.innerHTML = originalText;
    }, 2000);
}

// Format numbers with commas
function formatNumber(num) {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

// Generate random placeholder data
function generatePlaceholderData() {
    const artists = ['Alex Thompson', 'Maya Patel', 'David Kim', 'Luna Martinez', 'Ryan Foster', 'Emma Wilson', 'Carlos Rodriguez', 'Aria Chen'];
    const titles = ['Neon Dreams', 'Forest Guardian', 'Cyberpunk City', 'Ocean Depths', 'Space Explorer', 'Sunset Dreams', 'Urban Jungle', 'Mystic Forest'];
    
    return {
        artist: artists[Math.floor(Math.random() * artists.length)],
        title: titles[Math.floor(Math.random() * titles.length)],
        likes: Math.floor(Math.random() * 500) + 50,
        views: Math.floor(Math.random() * 2000) + 100
    };
}