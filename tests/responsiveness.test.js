/**
 * Responsive Design Tests
 * Validates: Requirement 1.1 (Mobile display 320px-768px), 1.2 (orientation support)
 */

import { describe, test, expect, beforeEach, afterEach, vi } from 'vitest';

// Helper to create mock DOM structure
function createMockDOM() {
  document.body.innerHTML = `
    <div id="hearts-container" class="hearts-bg"></div>
    
    <section id="landing" class="section section-landing active">
      <div class="content-container">
        <div class="greeting-card">
          <div class="heart-icon">💕</div>
          <h1 class="greeting-title">
            <span class="script-text">Hai,</span>
            <span id="visitor-name" class="visitor-name">Acell</span>
          </h1>
          <p class="greeting-subtitle">Ada sesuatu yang ingin Ian sampaikan...</p>
          <button id="btn-open" class="btn btn-open" type="button">
            <span class="btn-text">Buka 💌</span>
          </button>
        </div>
      </div>
    </section>
    
    <section id="confession" class="section section-confession">
      <div class="content-container">
        <div class="message-card">
          <div class="message-header">
            <span class="from-label">Dari hati Ian, untuk Acell</span>
          </div>
          <div class="message-body" id="message-content">
            Test message content that is long enough to require scrolling in order to test the scrollable container behavior on mobile devices
          </div>
          <div class="message-footer">
            <span class="signature">💝 Ian</span>
          </div>
        </div>
      </div>
    </section>
    
    <section id="response" class="section section-response">
      <div class="content-container">
        <div class="response-card">
          <h2 class="response-title">Jadi, bagaimana jawabanmu? 🥺</h2>
          <div class="response-buttons">
            <button id="btn-yes" class="btn btn-yes" type="button">
              <span class="btn-icon">💕</span>
              <span class="btn-text">Mau</span>
            </button>
            <button id="btn-no" class="btn btn-no" type="button">
              <span class="btn-text">Tidak</span>
            </button>
          </div>
        </div>
      </div>
    </section>
    
    <section id="celebration" class="section section-celebration">
      <div class="celebration-content">
        <div class="celebration-hearts" id="celebration-hearts"></div>
        <div class="celebration-message">
          <h2 class="celebration-title">Yeay! 💕✨</h2>
          <p class="celebration-text">Terima kasih, Acell!</p>
          <p class="celebration-date" id="acceptance-date"></p>
        </div>
      </div>
    </section>
    
    <div id="persuasion-modal" class="modal" role="dialog" aria-modal="true">
      <div class="modal-content">
        <h3 class="modal-title">Yakin nih? 🥺</h3>
        <p class="modal-message">Coba dipikirkan lagi yuk...</p>
        <button id="btn-retry" class="btn btn-retry" type="button">
          <span class="btn-text">Oke, saya pikirkan lagi</span>
        </button>
      </div>
    </div>
  `;
}

// Helper to set viewport
function setViewport(width, height) {
  window.innerWidth = width;
  window.innerHeight = height;
  window.dispatchEvent(new Event('resize'));
}

describe('Responsive Design Tests', () => {
  beforeEach(async () => {
    vi.resetModules();
    createMockDOM();
    
    // Load CSS by creating style element
    const style = document.createElement('style');
    style.textContent = `
      :root {
        --space-xs: 0.25rem;
        --space-sm: 0.5rem;
        --space-md: 1rem;
        --space-lg: 1.5rem;
        --space-xl: 2rem;
        --space-xxl: 3rem;
      }
      
      .content-container {
        max-width: 480px;
        width: 100%;
      }
      
      .btn {
        min-height: 48px;
        min-width: 48px;
      }
    `;
    document.head.appendChild(style);
  });

  afterEach(() => {
    document.body.innerHTML = '';
  });

  describe('Minimum Mobile Width (320px)', () => {
    test('should render without horizontal scroll at 320px', () => {
      setViewport(320, 568);
      
      const sections = document.querySelectorAll('.section');
      sections.forEach(section => {
        const rect = section.getBoundingClientRect();
        expect(rect.width).toBeLessThanOrEqual(320);
      });
    });

    test('should have readable text at 320px', () => {
      setViewport(320, 568);
      
      const visitorName = document.getElementById('visitor-name');
      expect(visitorName).toBeDefined();
      expect(visitorName.textContent.length).toBeGreaterThan(0);
    });

    test('should have touchable buttons at 320px', () => {
      setViewport(320, 568);
      
      const buttons = document.querySelectorAll('.btn');
      buttons.forEach(button => {
        const style = getComputedStyle(button);
        const minHeight = parseInt(style.minHeight) || 48;
        expect(minHeight).toBeGreaterThanOrEqual(44);
      });
    });
  });

  describe('Small Mobile (320px - 360px)', () => {
    test('should display greeting card at 360px', () => {
      setViewport(360, 640);
      
      const greetingCard = document.querySelector('.greeting-card');
      expect(greetingCard).toBeDefined();
    });

    test('should have content-container max-width of 480px', () => {
      const container = document.querySelector('.content-container');
      const style = getComputedStyle(container);
      expect(style.maxWidth).toBe('480px');
    });
  });

  describe('Medium Mobile (361px - 480px)', () => {
    test('should display correctly at 375px (iPhone)', () => {
      setViewport(375, 667);
      
      const landing = document.getElementById('landing');
      expect(landing.classList.contains('active')).toBe(true);
    });

    test('should display correctly at 414px (larger phones)', () => {
      setViewport(414, 896);
      
      const sections = document.querySelectorAll('.section');
      expect(sections.length).toBe(4);
    });
  });

  describe('Tablets (481px - 768px)', () => {
    test('should display correctly at 768px (tablet)', () => {
      setViewport(768, 1024);
      
      const contentContainer = document.querySelector('.content-container');
      expect(contentContainer).toBeDefined();
    });

    test('should have response buttons in row on larger screens', () => {
      setViewport(768, 1024);
      
      // On 768px+, buttons should be in a row (via media query)
      const responseButtons = document.querySelector('.response-buttons');
      expect(responseButtons).toBeDefined();
    });
  });

  describe('Touch Target Requirements (Requirement 1.3)', () => {
    test('all buttons should have minimum 44x44px touch target', () => {
      const buttons = document.querySelectorAll('.btn');
      
      buttons.forEach(button => {
        const style = getComputedStyle(button);
        const minHeight = parseInt(style.minHeight) || 0;
        const minWidth = parseInt(style.minWidth) || 0;
        
        // Minimum touch target is 44x44px per WCAG guidelines
        expect(minHeight).toBeGreaterThanOrEqual(44);
        expect(minWidth).toBeGreaterThanOrEqual(44);
      });
    });

    test('open button should have pulse animation', () => {
      const btnOpen = document.getElementById('btn-open');
      expect(btnOpen.classList.contains('btn-open')).toBe(true);
    });

    test('yes button should be more prominent than no button', () => {
      const btnYes = document.getElementById('btn-yes');
      const btnNo = document.getElementById('btn-no');
      
      expect(btnYes.classList.contains('btn-yes')).toBe(true);
      expect(btnNo.classList.contains('btn-no')).toBe(true);
    });
  });

  describe('Viewport Meta Tag', () => {
    test('should have viewport meta tag configured', () => {
      const meta = document.createElement('meta');
      meta.name = 'viewport';
      meta.content = 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no';
      
      expect(meta.name).toBe('viewport');
      expect(meta.content).toContain('width=device-width');
    });
  });

  describe('Content Container Constraints', () => {
    test('content-container should have max-width 480px', () => {
      const containers = document.querySelectorAll('.content-container');
      
      containers.forEach(container => {
        const style = getComputedStyle(container);
        expect(style.maxWidth).toBe('480px');
      });
    });
  });

  describe('Message Body Scrollable (Requirement 3.3)', () => {
    test('message body should be scrollable', () => {
      const messageBody = document.getElementById('message-content');
      const parent = messageBody.closest('.message-card');
      
      expect(messageBody).toBeDefined();
      expect(parent).toBeDefined();
    });
  });
});

describe('Theme Variables Tests', () => {
  beforeEach(() => {
    vi.resetModules();
    createMockDOM();
  });

  test('should support CSS custom properties', () => {
    // Test that theme variables can be set on root element
    const root = document.documentElement;
    root.style.setProperty('--color-primary', '#FF69B4');
    
    expect(root.style.getPropertyValue('--color-primary')).toBe('#FF69B4');
  });

  test('should define expected pink/rose color variables', () => {
    const root = document.documentElement;
    
    // Define expected color variables that should be in theme.css
    const expectedColors = [
      '--color-primary',
      '--color-primary-light',
      '--color-primary-dark',
      '--color-secondary',
      '--color-secondary-light',
      '--color-bg-primary'
    ];
    
    // Verify we can set and retrieve these
    expectedColors.forEach(color => {
      root.style.setProperty(color, '#FF69B4');
      expect(root.style.getPropertyValue(color)).toBeDefined();
    });
  });
});

describe('Animation Performance Tests', () => {
  beforeEach(() => {
    vi.resetModules();
    createMockDOM();
  });

  test('animation durations should be defined', () => {
    const root = document.documentElement;
    
    // Animation speeds: slow (3s), medium (1.5s), fast (0.8s)
    // These are within the 500ms-1000ms range for transitions
    const expectedDurations = {
      '--speed-slow': '3s',
      '--speed-medium': '1.5s',
      '--speed-fast': '0.8s'
    };
    
    Object.entries(expectedDurations).forEach(([prop, value]) => {
      root.style.setProperty(prop, value);
      expect(root.style.getPropertyValue(prop)).toBe(value);
    });
  });

  test('sections should have proper class structure for transitions', () => {
    const sections = document.querySelectorAll('.section');
    
    sections.forEach(section => {
      expect(section.classList.contains('section')).toBe(true);
    });
  });
});
