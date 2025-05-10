/**
 * Animations controller for the portfolio website
 */

import { 
    setupRevealAnimations, 
    setupStaggeredAnimations, 
    setupProgressBars,
    setupCursorFollower,
    setupFormValidation,
    setupParallax,
    setupTypedText
  } from './utils.js';
  
  // Initialize scroll based animations
  function initScrollAnimations() {
    // Set up reveal animations for elements
    setupRevealAnimations();
    
    // Set up staggered animations for lists and grids
    setupStaggeredAnimations();
    
    // Animate skill progress bars on scroll
    setupProgressBars();
  }
  
  // Initialize the floating icons in the hero section
  function initFloatingIcons() {
    const floatingIcons = document.querySelectorAll('.floating-icon');
    
    floatingIcons.forEach((icon, index) => {
      // Set initial positions
      const xPos = Math.random() * 100;
      const yPos = Math.random() * 100;
      
      icon.style.left = `${xPos}%`;
      icon.style.top = `${yPos}%`;
      
      // Add animation with delay
      setTimeout(() => {
        icon.style.opacity = '1';
        icon.classList.add('float');
        icon.classList.add(`float-delay-${index % 3 + 1}`);
      }, index * 300);
    });
  }
  
  // Initialize skills tab navigation
  function initSkillsTabs() {
    const categories = document.querySelectorAll('.skill-category');
    const grids = document.querySelectorAll('.skill-grid');
    
    categories.forEach(category => {
      category.addEventListener('click', () => {
        // Remove active class from all categories
        categories.forEach(c => c.classList.remove('active'));
        
        // Add active class to clicked category
        category.classList.add('active');
        
        // Hide all grids
        grids.forEach(grid => grid.classList.add('hidden'));
        
        // Show the selected grid
        const targetGrid = document.getElementById(`${category.dataset.category}-grid`);
        if (targetGrid) {
          targetGrid.classList.remove('hidden');
        }
      });
    });
  }
  
  // Initialize mobile navigation toggle
  function initMobileNav() {
    const navToggle = document.querySelector('.nav-toggle');
    const navLinks = document.querySelector('.nav-links');
    
    if (!navToggle || !navLinks) return;
    
    navToggle.addEventListener('click', () => {
      navToggle.classList.toggle('active');
      navLinks.classList.toggle('active');
    });
    
    // Close mobile menu when clicking a link
    const links = navLinks.querySelectorAll('.nav-link');
    links.forEach(link => {
      link.addEventListener('click', () => {
        navToggle.classList.remove('active');
        navLinks.classList.remove('active');
      });
    });
  }
  
  // Initialize smooth scrolling for navigation links
  function initSmoothScrolling() {
    const links = document.querySelectorAll('a[href^="#"]');
    
    links.forEach(link => {
      link.addEventListener('click', function(e) {
        e.preventDefault();
        
        const targetId = this.getAttribute('href');
        if (targetId === '#') return;
        
        const targetElement = document.querySelector(targetId);
        if (!targetElement) return;
        
        const navHeight = document.querySelector('.main-nav').offsetHeight;
        const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - navHeight;
        
        window.scrollTo({
          top: targetPosition,
          behavior: 'smooth'
        });
      });
    });
  }
  
  // Update active nav link based on scroll position
  function updateActiveNavLink() {
    const sections = document.querySelectorAll('section');
    const navLinks = document.querySelectorAll('.nav-link');
    
    window.addEventListener('scroll', () => {
      let current = '';
      const navHeight = document.querySelector('.main-nav').offsetHeight;
      
      sections.forEach(section => {
        const sectionTop = section.offsetTop - navHeight - 100;
        const sectionHeight = section.offsetHeight;
        
        if (window.pageYOffset >= sectionTop && window.pageYOffset < sectionTop + sectionHeight) {
          current = section.getAttribute('id');
        }
      });
      
      navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${current}`) {
          link.classList.add('active');
        }
      });
    });
  }
  
  // Initialize timeline animation
  function initTimelineAnimation() {
    const timelineItems = document.querySelectorAll('.timeline-item');
    
    function animateTimeline() {
      timelineItems.forEach((item, index) => {
        setTimeout(() => {
          item.classList.add('reveal-active');
        }, index * 300);
      });
    }
    
    // Animate timeline when about section is in view
    const aboutSection = document.querySelector('.about-section');
    if (aboutSection) {
      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            animateTimeline();
            observer.unobserve(entry.target);
          }
        });
      }, { threshold: 0.2 });
      
      observer.observe(aboutSection);
    }
  }
  
  // Sticky navigation on scroll
  function initStickyNav() {
    const nav = document.querySelector('.main-nav');
    const hero = document.querySelector('.hero-section');
    
    if (!nav || !hero) return;
    
    window.addEventListener('scroll', () => {
      if (window.scrollY > 50) {
        nav.style.background = 'rgba(0, 0, 0, 0.9)';
        nav.style.boxShadow = '0 5px 20px rgba(0, 0, 0, 0.1)';
      } else {
        nav.style.background = 'rgba(0, 0, 0, 0.5)';
        nav.style.boxShadow = 'none';
      }
    });
  }
  
  // Initialize all animations
  function initAnimations() {
    // Smooth scrolling
    initSmoothScrolling();
    
    // Scroll-based animations
    initScrollAnimations();
    
    // Floating icons animation
    initFloatingIcons();
    
    // Skills tabs
    initSkillsTabs();
    
    // Mobile navigation
    initMobileNav();
    
    // Active nav link
    updateActiveNavLink();
    
    // Timeline animation
    initTimelineAnimation();
    
    // Sticky navigation
    initStickyNav();
    
    // Cursor follower
    setupCursorFollower();
    
    // Form validation
    setupFormValidation();
    
    // Parallax effects
    setupParallax();
    
    // Typed text animation
    setupTypedText();
  }
  
  export { initAnimations };