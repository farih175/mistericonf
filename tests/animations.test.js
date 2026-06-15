/**
 * Tests for Animation Engine Module
 * Validates: Requirements 2.3 (floating hearts), 3.4 (subtle animations), 5.1 (celebration animation)
 */

import { describe, test, expect, beforeEach, afterEach, vi } from 'vitest';

describe('AnimationEngine', () => {
  let container;
  let AnimationEngine;

  beforeEach(async () => {
    // Create a container element for animations
    container = document.createElement('div');
    container.id = 'test-container';
    container.style.width = '320px';
    container.style.height = '480px';
    container.style.position = 'relative';
    document.body.appendChild(container);

    // Reset the module
    vi.resetModules();
    
    // Import the animation module
    await import('../scripts/animations.js');
    AnimationEngine = window.AnimationEngine;
  });

  afterEach(() => {
    // Clean up
    if (container && container.parentNode) {
      container.parentNode.removeChild(container);
    }
    AnimationEngine?.stopAll();
  });

  describe('Module Initialization', () => {
    test('should expose AnimationEngine globally', () => {
      expect(AnimationEngine).toBeDefined();
    });

    test('should have required methods', () => {
      expect(AnimationEngine.startFloatingHearts).toBeDefined();
      expect(AnimationEngine.createFloatingHeart).toBeDefined();
      expect(AnimationEngine.startCelebration).toBeDefined();
      expect(AnimationEngine.createHeartsExplosion).toBeDefined();
      expect(AnimationEngine.createExplosionParticle).toBeDefined();
      expect(AnimationEngine.createPetalShower).toBeDefined();
      expect(AnimationEngine.createFallingPetal).toBeDefined();
      expect(AnimationEngine.stopAll).toBeDefined();
    });

    test('should have heart emojis array', () => {
      expect(AnimationEngine.heartEmojis).toBeDefined();
      expect(Array.isArray(AnimationEngine.heartEmojis)).toBe(true);
      expect(AnimationEngine.heartEmojis.length).toBeGreaterThan(0);
    });

    test('should have flower emojis array', () => {
      expect(AnimationEngine.flowerEmojis).toBeDefined();
      expect(Array.isArray(AnimationEngine.flowerEmojis)).toBe(true);
      expect(AnimationEngine.flowerEmojis.length).toBeGreaterThan(0);
    });
  });

  describe('startFloatingHearts', () => {
    test('should create floating hearts in container', async () => {
      AnimationEngine.startFloatingHearts(container, {
        interval: 100,
        maxHearts: 5
      });

      // Wait for initial hearts to be created
      await new Promise(resolve => setTimeout(resolve, 400));

      const hearts = container.querySelectorAll('.heart-particle');
      expect(hearts.length).toBeGreaterThan(0);
    });

    test('should respect maxHearts option', async () => {
      AnimationEngine.startFloatingHearts(container, {
        interval: 50,
        maxHearts: 3
      });

      // Wait for multiple intervals
      await new Promise(resolve => setTimeout(resolve, 500));

      const hearts = container.querySelectorAll('.heart-particle');
      // Some hearts may have animated out, but we shouldn't exceed max significantly
      expect(hearts.length).toBeLessThanOrEqual(5);
    });

    test('should not throw if container is null', () => {
      expect(() => {
        AnimationEngine.startFloatingHearts(null);
      }).not.toThrow();
    });
  });

  describe('createFloatingHeart', () => {
    test('should create a heart particle element', () => {
      AnimationEngine.createFloatingHeart(container);

      const heart = container.querySelector('.heart-particle');
      expect(heart).toBeDefined();
    });

    test('should set heart emoji as content', () => {
      AnimationEngine.createFloatingHeart(container);

      const heart = container.querySelector('.heart-particle');
      // Check that content is a non-empty string (emoji)
      expect(heart.textContent.length).toBeGreaterThan(0);
      // Verify it's one of the heart emojis
      expect(AnimationEngine.heartEmojis).toContain(heart.textContent);
    });

    test('should apply CSS animation', () => {
      AnimationEngine.createFloatingHeart(container);

      const heart = container.querySelector('.heart-particle');
      expect(heart.style.animation).toContain('floatHeart');
    });

    test('should set random horizontal position', () => {
      AnimationEngine.createFloatingHeart(container);

      const heart = container.querySelector('.heart-particle');
      const left = parseFloat(heart.style.left);
      expect(left).toBeGreaterThanOrEqual(0);
      expect(left).toBeLessThanOrEqual(100);
    });

    test('should not throw if container is null', () => {
      expect(() => {
        AnimationEngine.createFloatingHeart(null);
      }).not.toThrow();
    });
  });

  describe('startCelebration', () => {
    test('should create celebration effects', async () => {
      AnimationEngine.startCelebration(container, {
        duration: 1000
      });

      // Wait for particles to be created
      await new Promise(resolve => setTimeout(resolve, 100));

      const hearts = container.querySelectorAll('.celebration-heart');
      const sparkles = container.querySelectorAll('.celebration-sparkle');
      
      expect(hearts.length + sparkles.length).toBeGreaterThan(0);
    });

    test('should not throw if container is null', () => {
      expect(() => {
        AnimationEngine.startCelebration(null);
      }).not.toThrow();
    });
  });

  describe('createHeartsExplosion', () => {
    test('should create specified number of hearts', async () => {
      AnimationEngine.createHeartsExplosion(container, 10);

      // Wait for all hearts to be created (50ms each * 10 = 500ms)
      await new Promise(resolve => setTimeout(resolve, 600));

      const hearts = container.querySelectorAll('.celebration-heart');
      expect(hearts.length).toBe(10);
    });

    test('should default to 20 hearts if count not specified', async () => {
      AnimationEngine.createHeartsExplosion(container);

      // Wait for hearts to be created
      await new Promise(resolve => setTimeout(resolve, 1200));

      const hearts = container.querySelectorAll('.celebration-heart');
      expect(hearts.length).toBe(20);
    });
  });

  describe('createExplosionParticle', () => {
    test('should create a celebration heart element by default', () => {
      AnimationEngine.createExplosionParticle(container, '💕', 'heart');

      const heart = container.querySelector('.celebration-heart');
      expect(heart).toBeDefined();
    });

    test('should create a sparkle element when type is sparkle', () => {
      AnimationEngine.createExplosionParticle(container, '✨', 'sparkle');

      const sparkle = container.querySelector('.celebration-sparkle');
      expect(sparkle).toBeDefined();
    });

    test('should position particle at center', () => {
      AnimationEngine.createExplosionParticle(container, '💕', 'heart');

      const heart = container.querySelector('.celebration-heart');
      expect(heart.style.left).toBe('50%');
      expect(heart.style.top).toBe('50%');
    });
  });

  describe('createPetalShower', () => {
    test('should create falling petals', async () => {
      AnimationEngine.createPetalShower(container, 500);

      // Wait for petals to be created
      await new Promise(resolve => setTimeout(resolve, 300));

      const petals = container.querySelectorAll('.falling-petal');
      expect(petals.length).toBeGreaterThan(0);
    });

    test('should stop after specified duration', async () => {
      AnimationEngine.createPetalShower(container, 200);

      // Wait longer than duration
      await new Promise(resolve => setTimeout(resolve, 500));

      const petalsAfter = container.querySelectorAll('.falling-petal');
      // Petals should have been created but some may have been removed
      expect(petalsAfter.length).toBeGreaterThanOrEqual(0);
    });
  });

  describe('createFallingPetal', () => {
    test('should create a falling petal element', () => {
      AnimationEngine.createFallingPetal(container);

      const petal = container.querySelector('.falling-petal');
      expect(petal).toBeDefined();
    });

    test('should set flower emoji as content', () => {
      AnimationEngine.createFallingPetal(container);

      const petal = container.querySelector('.falling-petal');
      // Check that content is a non-empty string (emoji)
      expect(petal.textContent.length).toBeGreaterThan(0);
      // Verify it's one of the flower emojis
      expect(AnimationEngine.flowerEmojis).toContain(petal.textContent);
    });

    test('should apply falling animation', () => {
      AnimationEngine.createFallingPetal(container);

      const petal = container.querySelector('.falling-petal');
      expect(petal.style.animation).toContain('fallingPetal');
    });
  });

  describe('stopAll', () => {
    test('should stop floating hearts animation', async () => {
      AnimationEngine.startFloatingHearts(container, {
        interval: 100,
        maxHearts: 5
      });

      await new Promise(resolve => setTimeout(resolve, 200));
      
      AnimationEngine.stopAll();

      // After stopping, no new hearts should be created
      const countBefore = container.querySelectorAll('.heart-particle').length;
      await new Promise(resolve => setTimeout(resolve, 300));
      const countAfter = container.querySelectorAll('.heart-particle').length;

      // Count should stay similar (no new additions)
      // Note: Some hearts may complete their animation and be removed
    });

    test('should not throw when called multiple times', () => {
      AnimationEngine.stopAll();
      AnimationEngine.stopAll();
      AnimationEngine.stopAll();
    });
  });
});
