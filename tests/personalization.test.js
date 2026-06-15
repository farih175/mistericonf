/**
 * Tests for Personalization Module
 * Validates: Requirements 8.1-8.5 (Personalization Support)
 */

import { describe, test, expect, beforeEach, vi } from 'vitest';

// Mock window and URL for testing
const mockWindow = (search = '') => {
  const url = new URL(`http://localhost/${search}`);
  global.window = {
    location: {
      search: url.search,
      origin: url.origin,
      pathname: url.pathname
    }
  };
};

// Load the personalization module
const loadPersonalizationModule = async () => {
  // Reset window.PersonalizationManager
  delete global.window.PersonalizationManager;
  
  // Import the module
  await import('../scripts/personalization.js');
  return window.PersonalizationManager;
};

describe('PersonalizationManager', () => {
  beforeEach(() => {
    // Reset modules to get fresh imports
    vi.resetModules();
  });

  describe('parseUrlParams', () => {
    test('should return default config when no URL params provided', async () => {
      mockWindow('');
      const PM = await loadPersonalizationModule();
      
      const config = PM.parseUrlParams();
      
      expect(config.visitor.nickname).toBe('Acell');
      expect(config.visitor.fullName).toBe('Salma Yumna Putri');
      expect(config.confessor).toBe('Ian');
      expect(config.theme).toBe('pink');
      expect(config.animationStyle).toBe('hearts-flowers');
      expect(config.language).toBe('id');
    });

    test('should parse visitor nickname from URL param "n"', async () => {
      mockWindow('?n=TestName');
      const PM = await loadPersonalizationModule();
      
      const config = PM.parseUrlParams();
      
      expect(config.visitor.nickname).toBe('TestName');
    });

    test('should parse visitor full name from URL param "f"', async () => {
      mockWindow('?f=Test%20Full%20Name');
      const PM = await loadPersonalizationModule();
      
      const config = PM.parseUrlParams();
      
      expect(config.visitor.fullName).toBe('Test Full Name');
    });

    test('should parse confessor name from URL param "c"', async () => {
      mockWindow('?c=John');
      const PM = await loadPersonalizationModule();
      
      const config = PM.parseUrlParams();
      
      expect(config.confessor).toBe('John');
    });

    test('should parse theme from URL param "t"', async () => {
      mockWindow('?t=rose');
      const PM = await loadPersonalizationModule();
      
      const config = PM.parseUrlParams();
      
      expect(config.theme).toBe('rose');
    });

    test('should parse animation style from URL param "a"', async () => {
      mockWindow('?a=sparkles');
      const PM = await loadPersonalizationModule();
      
      const config = PM.parseUrlParams();
      
      expect(config.animationStyle).toBe('sparkles');
    });

    test('should parse language from URL param "l"', async () => {
      mockWindow('?l=en');
      const PM = await loadPersonalizationModule();
      
      const config = PM.parseUrlParams();
      
      expect(config.language).toBe('en');
    });

    test('should parse multiple params at once', async () => {
      mockWindow('?n=Bella&c=Bob&t=lavender&a=petals&l=en');
      const PM = await loadPersonalizationModule();
      
      const config = PM.parseUrlParams();
      
      expect(config.visitor.nickname).toBe('Bella');
      expect(config.confessor).toBe('Bob');
      expect(config.theme).toBe('lavender');
      expect(config.animationStyle).toBe('petals');
      expect(config.language).toBe('en');
    });
  });

  describe('encodeMessage', () => {
    test('should return empty string for null/undefined input', async () => {
      mockWindow('');
      const PM = await loadPersonalizationModule();
      
      expect(PM.encodeMessage(null)).toBe('');
      expect(PM.encodeMessage(undefined)).toBe('');
      expect(PM.encodeMessage('')).toBe('');
    });

    test('should encode simple ASCII text to base64', async () => {
      mockWindow('');
      const PM = await loadPersonalizationModule();
      
      const encoded = PM.encodeMessage('Hello World');
      
      expect(encoded).toBeDefined();
      expect(typeof encoded).toBe('string');
      expect(encoded.length).toBeGreaterThan(0);
    });

    test('should encode Unicode text to base64', async () => {
      mockWindow('');
      const PM = await loadPersonalizationModule();
      
      const encoded = PM.encodeMessage('Halo, apa kabar? 💕');
      
      expect(encoded).toBeDefined();
      expect(typeof encoded).toBe('string');
    });

    test('should produce URL-safe encoding (no +, /, or =)', async () => {
      mockWindow('');
      const PM = await loadPersonalizationModule();
      
      const encoded = PM.encodeMessage('Test message with special chars! @#$%');
      
      expect(encoded).not.toMatch(/\+/);
      expect(encoded).not.toMatch(/\//);
      expect(encoded).not.toMatch(/=/);
    });
  });

  describe('decodeMessage', () => {
    test('should return empty string for null/undefined input', async () => {
      mockWindow('');
      const PM = await loadPersonalizationModule();
      
      expect(PM.decodeMessage(null)).toBe('');
      expect(PM.decodeMessage(undefined)).toBe('');
      expect(PM.decodeMessage('')).toBe('');
    });

    test('should decode base64 URL-safe encoded message', async () => {
      mockWindow('');
      const PM = await loadPersonalizationModule();
      
      const original = 'Hello World';
      const encoded = PM.encodeMessage(original);
      const decoded = PM.decodeMessage(encoded);
      
      expect(decoded).toBe(original);
    });

    test('should decode Unicode message correctly', async () => {
      mockWindow('');
      const PM = await loadPersonalizationModule();
      
      const original = 'Halo, apa kabar? 💕 🌸';
      const encoded = PM.encodeMessage(original);
      const decoded = PM.decodeMessage(encoded);
      
      expect(decoded).toBe(original);
    });

    test('should handle malformed encoded string gracefully', async () => {
      mockWindow('');
      const PM = await loadPersonalizationModule();
      
      const decoded = PM.decodeMessage('invalid-base64!!!');
      
      // Should not throw and return empty string
      expect(decoded).toBe('');
    });
  });

  describe('generateShareUrl', () => {
    test('should generate URL with all options', async () => {
      mockWindow('');
      const PM = await loadPersonalizationModule();
      
      const url = PM.generateShareUrl({
        nickname: 'Test',
        fullName: 'Test User',
        confessor: 'Sender',
        message: 'Test message',
        theme: 'rose',
        animationStyle: 'sparkles',
        language: 'en'
      });
      
      expect(url).toContain('n=Test');
      // URLSearchParams uses + for spaces, which is equivalent to %20
      expect(url).toContain('f=Test+User');
      expect(url).toContain('c=Sender');
      expect(url).toContain('t=rose');
      expect(url).toContain('a=sparkles');
      expect(url).toContain('l=en');
    });

    test('should not include default theme in URL', async () => {
      mockWindow('');
      const PM = await loadPersonalizationModule();
      
      const url = PM.generateShareUrl({
        nickname: 'Test',
        confessor: 'Sender',
        theme: 'pink'
      });
      
      expect(url).not.toContain('t=pink');
    });

    test('should not include default animation style in URL', async () => {
      mockWindow('');
      const PM = await loadPersonalizationModule();
      
      const url = PM.generateShareUrl({
        nickname: 'Test',
        confessor: 'Sender',
        animationStyle: 'hearts-flowers'
      });
      
      expect(url).not.toContain('a=hearts-flowers');
    });

    test('should not include default language in URL', async () => {
      mockWindow('');
      const PM = await loadPersonalizationModule();
      
      const url = PM.generateShareUrl({
        nickname: 'Test',
        confessor: 'Sender',
        language: 'id'
      });
      
      expect(url).not.toContain('l=id');
    });

    test('should encode message in URL', async () => {
      mockWindow('');
      const PM = await loadPersonalizationModule();
      
      const url = PM.generateShareUrl({
        nickname: 'Test',
        confessor: 'Sender',
        message: 'Hello World!'
      });
      
      expect(url).toContain('m=');
      // The message should be encoded
      expect(url).not.toContain('Hello World!');
    });
  });

  describe('getConfig', () => {
    test('should return current configuration', async () => {
      mockWindow('?n=CustomName');
      const PM = await loadPersonalizationModule();
      
      PM.parseUrlParams();
      const config = PM.getConfig();
      
      expect(config.visitor.nickname).toBe('CustomName');
    });
  });

  describe('Round-trip encoding', () => {
    test('should preserve long confession message through encode/decode', async () => {
      mockWindow('');
      const PM = await loadPersonalizationModule();
      
      const longMessage = `gimana lucuu gaa? aku mau ngomong sesuatu kamu kan sempet bener soal nebak aku tuh cuek walaupun lewat zodiak itu, pasti kalau yang cuma sekilas kenal aku nilai aku kayak gitu cuek, judes ada yang bilang auranya beda, gajelas emang orang orang, padahal aku biasa ajaa, tapi kalau yang temen deket pasti bilangnya bertolak belakang sama itu.

Aku ngomong gini karena mau confess, tapi juga mau ngomong soal realitanya. 💕 🌸`;
      
      const encoded = PM.encodeMessage(longMessage);
      const decoded = PM.decodeMessage(encoded);
      
      expect(decoded).toBe(longMessage);
    });
  });
});
