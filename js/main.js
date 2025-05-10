/**
 * Main JavaScript file for portfolio website
 * 
 * This file initializes all components and functionality
 */

// Import modules
import { setupHeroScene, setupProjectPreview, setupFormBackground } from './three-scene.js';
import { setupProjects } from './projects.js';
import { initAnimations } from './animations.js';

// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', () => {
  // Initialize Three.js scenes
  setupHeroScene();
  window.projectPreviewHandler = setupProjectPreview();
  setupFormBackground();
  
  // Initialize projects
  setupProjects();
  
  // Initialize animations
  initAnimations();
  
  // Add classes to trigger initial animations
  setTimeout(() => {
    document.querySelectorAll('.reveal-bottom, .reveal-left, .reveal-right, .reveal-fade').forEach(el => {
      el.classList.add('reveal-active');
    });
  }, 500);
  
  console.log('Portfolio initialized successfully');
});

// Handle page load event
window.addEventListener('load', () => {
  // Hide loader if it exists
  const loader = document.querySelector('.page-loader');
  if (loader) {
    loader.style.opacity = '0';
    setTimeout(() => {
      loader.style.display = 'none';
    }, 500);
  }
});

// Handle navigation based on URL hash
function handleUrlHash() {
  const hash = window.location.hash;
  if (hash) {
    setTimeout(() => {
      const element = document.querySelector(hash);
      if (element) {
        const navHeight = document.querySelector('.main-nav').offsetHeight;
        const elementPosition = element.getBoundingClientRect().top + window.pageYOffset - navHeight;
        
        window.scrollTo({
          top: elementPosition,
          behavior: 'smooth'
        });
      }
    }, 100);
  }
}

// Call on initial load
handleUrlHash();

// Also call when hash changes
window.addEventListener('hashchange', handleUrlHash);

// Add intersection observers for animation triggers
function setupIntersectionObservers() {
  const sections = document.querySelectorAll('section');
  
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('section-visible');
        
        // Find elements to animate within the section
        const animatedElements = entry.target.querySelectorAll('.reveal-bottom, .reveal-left, .reveal-right, .reveal-fade');
        animatedElements.forEach((el, index) => {
          setTimeout(() => {
            el.classList.add('reveal-active');
          }, 100 * index);
        });
      }
    });
  }, { threshold: 0.1 });
  
  sections.forEach(section => {
    observer.observe(section);
  });
}

setupIntersectionObservers();

// Form submission handler
const contactForm = document.getElementById('contact-form');
if (contactForm) {
  contactForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    // Get form data
    const formData = new FormData(contactForm);
    const formDataObj = Object.fromEntries(formData.entries());
    
    // In a real application, you would send this data to a server
    console.log('Form submitted:', formDataObj);
    
    // Show success message (for demo purposes)
    const submitBtn = contactForm.querySelector('.submit-btn');
    const originalText = submitBtn.innerHTML;
    
    submitBtn.innerHTML = '<div class="loading-spinner"></div>';
    
    setTimeout(() => {
      contactForm.reset();
      submitBtn.innerHTML = originalText;
      alert('Message sent successfully! (Demo only)');
    }, 1500);
  });
}

// Export functionality for potential use by other modules
export {
  handleUrlHash,
  setupIntersectionObservers
};