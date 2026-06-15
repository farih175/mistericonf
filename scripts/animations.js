/**
 * Animation Engine Module
 * Handles all visual animations: floating hearts, falling petals, celebration effects
 * 
 * Features:
 * - Continuous floating hearts background
 * - Celebration hearts explosion
 * - Falling petals shower
 * - Configurable particle counts and speeds
 */
(function() {
  'use strict';

  const AnimationEngine = (function() {
    // Heart and flower emoji arrays
    const heartEmojis = ['💕', '💗', '💖', '💝', '💘', '❤️', '💞', '💓', '💘', '🌸'];
    const flowerEmojis = ['🌸', '🌺', '🌷', '🌹', '💐', '🌼', '🌻', '🪷', '✨', '💫'];

    // Animation state
    let floatingHeartsInterval = null;
    let celebrationTimeout = null;
    let petalShowerInterval = null;
    const activeParticles = [];

    /**
     * Start continuous floating hearts animation
     * @param {HTMLElement} container - Container element for hearts
     * @param {Object} options - Animation options
     * @param {number} options.interval - Time between new hearts (default: 800ms)
     * @param {number} options.maxHearts - Maximum hearts on screen (default: 15)
     */
    function startFloatingHearts(container, options = {}) {
      if (!container) return;
      
      const interval = options.interval || 800;
      const maxHearts = options.maxHearts || 15;

      // Clear any existing animation
      if (floatingHeartsInterval) {
        clearInterval(floatingHeartsInterval);
      }

      // Create initial hearts
      for (let i = 0; i < 3; i++) {
        setTimeout(() => createFloatingHeart(container), i * 300);
      }

      // Start continuous generation
      floatingHeartsInterval = setInterval(() => {
        const currentHearts = container.querySelectorAll('.heart-particle').length;
        if (currentHearts < maxHearts) {
          createFloatingHeart(container);
        }
      }, interval);
    }

    /**
     * Create a single floating heart particle
     * @param {HTMLElement} container - Container element
     */
    function createFloatingHeart(container) {
      if (!container) return;

      const heart = document.createElement('div');
      heart.className = 'heart-particle';
      heart.textContent = heartEmojis[Math.floor(Math.random() * heartEmojis.length)];
      
      // Random positioning and animation
      const startX = Math.random() * 100;
      const size = 16 + Math.random() * 24; // 16px to 40px
      const duration = 4 + Math.random() * 4; // 4s to 8s
      const delay = Math.random() * 2; // 0s to 2s delay

      heart.style.cssText = `
        left: ${startX}%;
        font-size: ${size}px;
        animation: floatHeart ${duration}s ease-in-out ${delay}s infinite;
        opacity: 0;
      `;

      container.appendChild(heart);
      activeParticles.push(heart);

      // Remove after animation completes (cleanup)
      setTimeout(() => {
        if (heart.parentNode) {
          heart.parentNode.removeChild(heart);
          const index = activeParticles.indexOf(heart);
          if (index > -1) {
            activeParticles.splice(index, 1);
          }
        }
      }, (duration + delay) * 1000 + 500);
    }

    /**
     * Start celebration animation with hearts explosion and petals
     * @param {HTMLElement} container - Container for celebration elements
     * @param {Object} options - Celebration options
     */
    function startCelebration(container, options = {}) {
      if (!container) return;

      // Create hearts explosion
      createHeartsExplosion(container);

      // Start petal shower
      createPetalShower(container);

      // Add sparkles
      for (let i = 0; i < 5; i++) {
        setTimeout(() => {
          createExplosionParticle(container, '✨', 'sparkle');
        }, i * 200);
      }
    }

    /**
     * Create hearts explosion effect
     * @param {HTMLElement} container - Container element
     * @param {number} count - Number of hearts (default: 20)
     */
    function createHeartsExplosion(container, count = 20) {
      if (!container) return;

      for (let i = 0; i < count; i++) {
        setTimeout(() => {
          createExplosionParticle(container, heartEmojis[Math.floor(Math.random() * heartEmojis.length)], 'heart');
        }, i * 50);
      }
    }

    /**
     * Create a single explosion particle for celebration
     * @param {HTMLElement} container - Container element
     * @param {string} emoji - Emoji to use
     * @param {string} type - Particle type ('heart' or 'sparkle')
     */
    function createExplosionParticle(container, emoji, type = 'heart') {
      if (!container) return;

      const particle = document.createElement('div');
      particle.className = type === 'heart' ? 'celebration-heart' : 'celebration-sparkle';
      particle.textContent = emoji;

      // Random position from center explosion
      const angle = Math.random() * 360;
      const distance = 100 + Math.random() * 200; // 100px to 300px
      const startX = 50; // Center
      const startY = 50; // Center
      const endX = startX + (Math.cos(angle * Math.PI / 180) * distance / container.offsetWidth * 100);
      const endY = startY + (Math.sin(angle * Math.PI / 180) * distance / container.offsetHeight * 100);
      
      const size = type === 'heart' ? (20 + Math.random() * 20) : (14 + Math.random() * 10);
      const duration = type === 'heart' ? (1.5 + Math.random() * 1) : (0.8 + Math.random() * 0.5);

      particle.style.cssText = `
        position: absolute;
        left: ${startX}%;
        top: ${startY}%;
        font-size: ${size}px;
        transform: translate(-50%, -50%);
        animation: explodeHeart ${duration}s ease-out forwards;
        --end-x: ${endX}%;
        --end-y: ${endY}%;
        z-index: 10;
      `;

      container.appendChild(particle);

      // Remove after animation
      setTimeout(() => {
        if (particle.parentNode) {
          particle.parentNode.removeChild(particle);
        }
      }, duration * 1000 + 100);
    }

    /**
     * Create falling petals shower effect
     * @param {HTMLElement} container - Container element
     * @param {number} duration - Duration in milliseconds (default: 5000)
     */
    function createPetalShower(container, duration = 5000) {
      if (!container) return;

      const interval = 200; // New petal every 200ms
      const endTime = Date.now() + duration;

      petalShowerInterval = setInterval(() => {
        if (Date.now() >= endTime) {
          clearInterval(petalShowerInterval);
          petalShowerInterval = null;
          return;
        }
        createFallingPetal(container);
      }, interval);
    }

    /**
     * Create a single falling petal
     * @param {HTMLElement} container - Container element
     */
    function createFallingPetal(container) {
      if (!container) return;

      const petal = document.createElement('div');
      petal.className = 'falling-petal';
      petal.textContent = flowerEmojis[Math.floor(Math.random() * flowerEmojis.length)];

      const startX = Math.random() * 100;
      const size = 12 + Math.random() * 16; // 12px to 28px
      const animDuration = 3 + Math.random() * 2; // 3s to 5s
      const swayAmount = 20 + Math.random() * 40; // Horizontal sway

      petal.style.cssText = `
        left: ${startX}%;
        top: -30px;
        font-size: ${size}px;
        animation: fallingPetal ${animDuration}s ease-in-out forwards;
        --sway: ${swayAmount}px;
        z-index: 5;
      `;

      container.appendChild(petal);

      // Remove after animation
      setTimeout(() => {
        if (petal.parentNode) {
          petal.parentNode.removeChild(petal);
        }
      }, animDuration * 1000 + 500);
    }

    /**
     * Stop all running animations
     */
    function stopAll() {
      // Clear intervals
      if (floatingHeartsInterval) {
        clearInterval(floatingHeartsInterval);
        floatingHeartsInterval = null;
      }

      if (petalShowerInterval) {
        clearInterval(petalShowerInterval);
        petalShowerInterval = null;
      }

      if (celebrationTimeout) {
        clearTimeout(celebrationTimeout);
        celebrationTimeout = null;
      }

      // Remove all active particles
      activeParticles.forEach(particle => {
        if (particle.parentNode) {
          particle.parentNode.removeChild(particle);
        }
      });
      activeParticles.length = 0;
    }

    // Public API
    return {
      startFloatingHearts,
      createFloatingHeart,
      startCelebration,
      createHeartsExplosion,
      createExplosionParticle,
      createPetalShower,
      createFallingPetal,
      stopAll,
      heartEmojis,
      flowerEmojis
    };
  })();

  // Expose globally
  window.AnimationEngine = AnimationEngine;

})();
