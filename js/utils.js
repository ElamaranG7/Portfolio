function debounce(func, wait = 20, immediate = true) {
    let timeout;
    return function() {
      const context = this, args = arguments;
      const later = function() {
        timeout = null;
        if (!immediate) func.apply(context, args);
      };
      const callNow = immediate && !timeout;
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
      if (callNow) func.apply(context, args);
    };
  }
  
  function lerp(start, end, t) {
    return start * (1 - t) + end * t;
  }
  
  function isInViewport(element, offset = 0) {
    if (!element) return false;
    const rect = element.getBoundingClientRect();
    return (
      rect.top <= (window.innerHeight || document.documentElement.clientHeight) - offset &&
      rect.bottom >= 0 + offset
    );
  }
  
  function getRandomNumber(min, max) {
    return Math.random() * (max - min) + min;
  }
  
  function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }
  
  function clamp(value, min, max) {
    return Math.min(Math.max(value, min), max);
  }
  
  function mapRange(value, inputMin, inputMax, outputMin, outputMax) {
    return outputMin + ((outputMax - outputMin) * (value - inputMin)) / (inputMax - inputMin);
  }
  
  function hexToRgb(hex) {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16)
    } : null;
  }
  
  function formatDate(date) {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(date).toLocaleDateString(undefined, options);
  }
  
  function setupRevealAnimations() {
    const revealElements = document.querySelectorAll('.reveal-bottom, .reveal-left, .reveal-right, .reveal-fade');
    
    const revealElementsOnScroll = () => {
      revealElements.forEach(element => {
        if (isInViewport(element, 150)) {
          element.classList.add('reveal-active');
        }
      });
    };
    
    revealElementsOnScroll();
    
    window.addEventListener('scroll', debounce(revealElementsOnScroll));
  }
  
  function setupStaggeredAnimations() {
    const staggerContainers = document.querySelectorAll('[data-stagger-container]');
    
    staggerContainers.forEach(container => {
      const items = container.querySelectorAll('.staggered-item');
      const delay = container.dataset.staggerDelay || 0.1; 
      
      const animateItems = () => {
        if (isInViewport(container, 150)) {
          items.forEach((item, index) => {
            item.style.transitionDelay = `${index * delay}s`;
            item.style.opacity = '1';
            item.style.transform = 'translateY(0)';
          });
        }
      };
      
      animateItems();
      
      window.addEventListener('scroll', debounce(animateItems));
    });
  }
  
  function setupProgressBars() {
    const progressBars = document.querySelectorAll('.skill-progress');
    
    const animateProgressBars = () => {
      progressBars.forEach(bar => {
        const parent = bar.closest('.skill-card');
        if (isInViewport(parent, 150)) {
          const level = parent.dataset.level || 0;
          bar.style.width = `${level}%`;
        }
      });
    };
    
    animateProgressBars();
    
    window.addEventListener('scroll', debounce(animateProgressBars));
  }
  
  function setupCursorFollower() {
    const cursor = document.querySelector('.cursor-follower');
    if (!cursor) return;
    
    let cursorX = 0, cursorY = 0;
    let mouseX = 0, mouseY = 0;
    
    window.addEventListener('mousemove', (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      
      cursor.style.opacity = '1';
    });
    
    window.addEventListener('mouseout', () => {
      cursor.style.opacity = '0';
    });
    
    const links = document.querySelectorAll('a, button, .project-card');
    
    links.forEach(link => {
      link.addEventListener('mouseenter', () => {
        cursor.style.width = '60px';
        cursor.style.height = '60px';
        cursor.style.borderColor = 'var(--accent-color)';
      });
      
      link.addEventListener('mouseleave', () => {
        cursor.style.width = '40px';
        cursor.style.height = '40px';
        cursor.style.borderColor = 'var(--primary-color)';
      });
    });
    
    function updateCursor() {
      cursorX = lerp(cursorX, mouseX, 0.1);
      cursorY = lerp(cursorY, mouseY, 0.1);
      
      if (cursor) {
        cursor.style.transform = `translate(${cursorX}px, ${cursorY}px)`;
      }
      
      requestAnimationFrame(updateCursor);
    }
    
    updateCursor();
  }
  
  function setupFormValidation() {
    const form = document.getElementById('contact-form');
    if (!form) return;
    
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      
      let isValid = true;
      const inputs = form.querySelectorAll('input, textarea');
      
      inputs.forEach(input => {
        if (input.required && !input.value.trim()) {
          isValid = false;
          input.classList.add('error');
        } else {
          input.classList.remove('error');
        }
      });
      
      if (isValid) {
        const submitBtn = form.querySelector('.submit-btn');
        const originalText = submitBtn.innerHTML;
        
        submitBtn.innerHTML = '<div class="loading-spinner"></div>';
        
        setTimeout(() => {
          form.reset();
          submitBtn.innerHTML = originalText;
          alert('Message sent successfully!');
        }, 1500);
      }
    });
  }
  
  function setupParallax() {
    const parallaxElements = document.querySelectorAll('.parallax');
    
    window.addEventListener('mousemove', (e) => {
      const mouseX = e.clientX / window.innerWidth;
      const mouseY = e.clientY / window.innerHeight;
      
      parallaxElements.forEach(element => {
        const speed = element.dataset.speed || 1;
        const x = (mouseX - 0.5) * speed * 50;
        const y = (mouseY - 0.5) * speed * 50;
        
        element.style.transform = `translate(${x}px, ${y}px)`;
      });
    });
  }
  
  function setupTypedText() {
    const typedElement = document.querySelector('.typed-text');
    if (!typedElement) return;
    
    const strings = [
      "iOS Developer",
      "Swift Expert",
      "Mobile Innovator"
    ];
    
    let currentStringIndex = 0;
    let currentCharIndex = 0;
    let isDeleting = false;
    let typingSpeed = 100;
    
    function type() {
      const currentString = strings[currentStringIndex];
      
      if (isDeleting) {
        typedElement.textContent = currentString.substring(0, currentCharIndex - 1);
        currentCharIndex--;
        typingSpeed = 50;
      } else {
        typedElement.textContent = currentString.substring(0, currentCharIndex + 1);
        currentCharIndex++;
        typingSpeed = 100;
      }
      
      if (!isDeleting && currentCharIndex === currentString.length) {
        isDeleting = true;
        typingSpeed = 1000;
      } else if (isDeleting && currentCharIndex === 0) {
        isDeleting = false;
        currentStringIndex = (currentStringIndex + 1) % strings.length;
        typingSpeed = 500; 
      }
      
      setTimeout(type, typingSpeed);
    }
    
    setTimeout(type, 1000);
  }
  
  export {
    debounce,
    lerp,
    isInViewport,
    getRandomNumber,
    getRandomInt,
    clamp,
    mapRange,
    hexToRgb,
    formatDate,
    setupRevealAnimations,
    setupStaggeredAnimations,
    setupProgressBars,
    setupCursorFollower,
    setupFormValidation,
    setupParallax,
    setupTypedText
  };