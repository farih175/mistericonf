/**
 * Cute Ornaments Module
 * Adds adorable decorative elements to enhance the cute aesthetic of the website
 * 
 * Features:
 * - Floating cute emoji decorations
 * - Corner decorations (teddy bears, hearts, flowers)
 * - Sparkle effects on hover
 * - Subtle animated decorations
 * 
 * Validates: Requirements 6 (cute visual elements)
 */
(function() {
  'use strict';

  const CuteOrnaments = (function() {
    // Cute emoji arrays for ornaments
    const cuteEmojis = [
      '🧸', '🐻', '🐰', '🐱', '🐶', '🦊', '🐼', '🐨', '🐯', '🐮',
      '🌸', '🌺', '🌷', '🌹', '💐', '🌼', '🌻', '🌺', '💮', '🏵️',
      '💖', '💗', '💓', '💞', '💕', '💘', '💝', '💟', '💌', '💋',
      '✨', '🌟', '💫', '⭐', '☄️', '☀️', '🌠', '🎇', '🎆', '🧨'
    ];

    // State
    let ornamentsInterval = null;
    const activeOrnaments = [];

    /**
     * Initialize cute ornaments
     * @param {HTMLElement} container - Container element for ornaments
     * @param {Object} options - Configuration options
     */
    function init(container, options = {}) {
      if (!container) return;
      
      // Add corner decorations
      addCornerDecorations(container);
      
      // Add floating ornaments
      startFloatingOrnaments(container, options);
      
      // Add hover effects to buttons
      addHoverEffects();
    }

    /**
     * Add decorative elements to corners of the page
     * @param {HTMLElement} container - Container element
     */
    function addCornerDecorations(container) {
      const corners = [
        { position: 'top-left', emoji: '🧸' },
        { position: 'top-right', emoji: '🌸' },
        { position: 'bottom-left', emoji: '💕' },
        { position: 'bottom-right', emoji: '✨' }
      ];

      corners.forEach(corner => {
        const ornament = document.createElement('div');
        ornament.className = `corner-ornament corner-${corner.position}`;
        ornament.textContent = corner.emoji;
        ornament.setAttribute('aria-hidden', 'true');
        
        ornament.style.cssText = `
          position: fixed;
          font-size: 32px;
          opacity: 0.7;
          z-index: 0;
          animation: floatSlow 8s ease-in-out infinite;
        `;

        switch(corner.position) {
          case 'top-left':
            ornament.style.top = '20px';
            ornament.style.left = '20px';
            break;
          case 'top-right':
            ornament.style.top = '20px';
            ornament.style.right = '20px';
            break;
          case 'bottom-left':
            ornament.style.bottom = '20px';
            ornament.style.left = '20px';
            break;
          case 'bottom-right':
            ornament.style.bottom = '20px';
            ornament.style.right = '20px';
            break;
        }

        container.appendChild(ornament);
        activeOrnaments.push(ornament);
      });
    }

    /**
     * Start floating ornaments animation
     * @param {HTMLElement} container - Container element
     * @param {Object} options - Animation options
     */
    function startFloatingOrnaments(container, options = {}) {
      if (!container) return;
      
      const interval = options.interval || 1500;
      const maxOrnaments = options.maxOrnaments || 8;

      // Clear existing interval
      if (ornamentsInterval) {
        clearInterval(ornamentsInterval);
      }

      // Create initial ornaments
      for (let i = 0; i < 3; i++) {
        setTimeout(() => createFloatingOrnament(container), i * 500);
      }

      // Start continuous generation
      ornamentsInterval = setInterval(() => {
        const currentOrnaments = container.querySelectorAll('.floating-ornament').length;
        if (currentOrnaments < maxOrnaments) {
          createFloatingOrnament(container);
        }
      }, interval);
    }

    /**
     * Create a single floating ornament
     * @param {HTMLElement} container - Container element
     */
    function createFloatingOrnament(container) {
      if (!container) return;

      const ornament = document.createElement('div');
      ornament.className = 'floating-ornament';
      ornament.textContent = cuteEmojis[Math.floor(Math.random() * cuteEmojis.length)];
      ornament.setAttribute('aria-hidden', 'true');

      // Random properties
      const startX = Math.random() * 100;
      const size = 20 + Math.random() * 20; // 20px to 40px
      const duration = 6 + Math.random() * 4; // 6s to 10s
      const delay = Math.random() * 2; // 0s to 2s
      const rotation = Math.random() * 360; // Random starting rotation

      ornament.style.cssText = `
        position: fixed;
        left: ${startX}%;
        top: 110%; /* Start below screen */
        font-size: ${size}px;
        animation: floatOrnament ${duration}s ease-in-out ${delay}s infinite;
        transform: rotate(${rotation}deg);
        opacity: 0;
        pointer-events: none;
        z-index: 0;
        filter: drop-shadow(0 2px 4px rgba(255, 105, 180, 0.3));
      `;

      container.appendChild(ornament);
      activeOrnaments.push(ornament);

      // Clean up after animation
      setTimeout(() => {
        if (ornament.parentNode) {
          ornament.parentNode.removeChild(ornament);
          const index = activeOrnaments.indexOf(ornament);
          if (index > -1) {
            activeOrnaments.splice(index, 1);
          }
        }
      }, (duration + delay) * 1000 + 500);
    }

    /**
     * Add hover effects to buttons
     */
    function addHoverEffects() {
      const buttons = document.querySelectorAll('.btn');
      
      buttons.forEach(button => {
        // Add sparkle effect on hover
        button.addEventListener('mouseenter', function() {
          createButtonSparkle(this);
        });
      });
    }

    /**
     * Create sparkle effect around a button
     * @param {HTMLElement} button - Button element
     */
    function createButtonSparkle(button) {
      if (!button) return;

      const sparkles = ['✨', '🌟', '💫', '⭐'];
      
      for (let i = 0; i < 3; i++) {
        setTimeout(() => {
          const sparkle = document.createElement('span');
          sparkle.className = 'button-sparkle';
          sparkle.textContent = sparkles[Math.floor(Math.random() * sparkles.length)];
          sparkle.setAttribute('aria-hidden', 'true');

          const rect = button.getBoundingClientRect();
          const offsetX = Math.random() * rect.width;
          const offsetY = Math.random() * rect.height;

          sparkle.style.cssText = `
            position: absolute;
            left: ${offsetX}px;
            top: ${offsetY}px;
            font-size: 16px;
            animation: sparkle 0.8s ease-out forwards;
            pointer-events: none;
            z-index: 100;
          `;

          button.style.position = 'relative';
          button.appendChild(sparkle);

          // Remove sparkle after animation
          setTimeout(() => {
            if (sparkle.parentNode) {
              sparkle.parentNode.removeChild(sparkle);
            }
          }, 800);
        }, i * 100);
      }
    }

    /**
     * Clean up all ornaments
     */
    function cleanup() {
      if (ornamentsInterval) {
        clearInterval(ornamentsInterval);
        ornamentsInterval = null;
      }

      activeOrnaments.forEach(ornament => {
        if (ornament.parentNode) {
          ornament.parentNode.removeChild(ornament);
        }
      });
      activeOrnaments.length = 0;
    }

    // Public API
    return {
      init,
      cleanup,
      addCornerDecorations,
      startFloatingOrnaments,
      createFloatingOrnament,
      addHoverEffects,
      cuteEmojis
    };
  })();

  // Expose globally
  window.CuteOrnaments = CuteOrnaments;

})();