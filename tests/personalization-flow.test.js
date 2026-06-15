/**
 * Tests for URL Parameter Personalization Flow
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
  delete global.window.PersonalizationManager;
  await import('../scripts/personalization.js');
  return window.PersonalizationManager;
};

describe('URL Parameter Personalization Flow', () => {
  beforeEach(() => {
    vi.resetModules();
  });

  describe('Requirement 8.1: Custom Confession Message', () => {
    test('should accept custom message via URL parameter', async () => {
      const customMessage = 'This is my custom confession message!';
      const encoded = btoa(encodeURIComponent(customMessage).replace(/%([0-9A-F]{2})/g, (_, p1) => String.fromCharCode('0x' + p1)));
      
      mockWindow(`?m=${encoded}`);
      const PM = await loadPersonalizationModule();
      
      const config = PM.parseUrlParams();
      
      expect(config.message).toBe(customMessage);
    });

    test('should handle long custom messages', async () => {
      const longMessage = 'A'.repeat(500);
      const encoded = btoa(encodeURIComponent(longMessage).replace(/%([0-9A-F]{2})/g, (_, p1) => String.fromCharCode('0x' + p1)));
      
      mockWindow(`?m=${encoded}`);
      const PM = await loadPersonalizationModule();
      
      const config = PM.parseUrlParams();
      
      expect(config.message).toBe(longMessage);
      expect(config.message.length).toBe(500);
    });

    test('should handle special characters in message', async () => {
      const specialMessage = 'I love you! 💕💖💗 With emojis and symbols: @#$%';
      
      mockWindow('');
      const PM = await loadPersonalizationModule();
      
      const encoded = PM.encodeMessage(specialMessage);
      const config = PM.parseUrlParams();
      
      // Encode and decode should preserve the message
      const decoded = PM.decodeMessage(encoded);
      expect(decoded).toBe(specialMessage);
    });
  });

  describe('Requirement 8.2: Visitor Name/Nickname', () => {
    test('should accept visitor nickname via URL parameter "n"', async () => {
      mockWindow('?n=Bella');
      const PM = await loadPersonalizationModule();
      
      const config = PM.parseUrlParams();
      
      expect(config.visitor.nickname).toBe('Bella');
    });

    test('should use default nickname when not provided', async () => {
      mockWindow('');
      const PM = await loadPersonalizationModule();
      
      const config = PM.parseUrlParams();
      
      expect(config.visitor.nickname).toBe('Acell');
    });

    test('should handle URL-encoded names', async () => {
      mockWindow('?n=John%20Doe');
      const PM = await loadPersonalizationModule();
      
      const config = PM.parseUrlParams();
      
      expect(config.visitor.nickname).toBe('John Doe');
    });
  });

  describe('Requirement 8.3: Confessor Name', () => {
    test('should accept confessor name via URL parameter "c"', async () => {
      mockWindow('?c=Bob');
      const PM = await loadPersonalizationModule();
      
      const config = PM.parseUrlParams();
      
      expect(config.confessor).toBe('Bob');
    });

    test('should use default confessor name when not provided', async () => {
      mockWindow('');
      const PM = await loadPersonalizationModule();
      
      const config = PM.parseUrlParams();
      
      expect(config.confessor).toBe('Ian');
    });
  });

  describe('Requirement 8.4: URL Parameter Storage', () => {
    test('should generate shareable URL with all parameters', async () => {
      mockWindow('');
      const PM = await loadPersonalizationModule();
      
      const url = PM.generateShareUrl({
        nickname: 'Bella',
        fullName: 'Bella Swan',
        confessor: 'Edward',
        message: 'I love you forever!',
        theme: 'rose',
        animationStyle: 'sparkles',
        language: 'en'
      });
      
      expect(url).toContain('n=Bella');
      expect(url).toContain('c=Edward');
      expect(url).toContain('t=rose');
      expect(url).toContain('a=sparkles');
      expect(url).toContain('l=en');
      expect(url).toContain('m=');
    });

    test('should create URL that can be parsed back', async () => {
      mockWindow('');
      const PM = await loadPersonalizationModule();
      
      const originalConfig = {
        nickname: 'TestUser',
        fullName: 'Test User Full',
        confessor: 'TestConfessor',
        message: 'Test message content',
        theme: 'lavender',
        animationStyle: 'petals',
        language: 'id'
      };
      
      const url = PM.generateShareUrl(originalConfig);
      
      // Parse the URL back
      const urlObj = new URL(url);
      mockWindow(urlObj.search);
      const parsedConfig = PM.parseUrlParams();
      
      expect(parsedConfig.visitor.nickname).toBe(originalConfig.nickname);
      expect(parsedConfig.visitor.fullName).toBe(originalConfig.fullName);
      expect(parsedConfig.confessor).toBe(originalConfig.confessor);
      expect(parsedConfig.message).toBe(originalConfig.message);
      expect(parsedConfig.theme).toBe(originalConfig.theme);
      expect(parsedConfig.animationStyle).toBe(originalConfig.animationStyle);
      expect(parsedConfig.language).toBe(originalConfig.language);
    });
  });

  describe('Requirement 8.5: Display Personalized Content', () => {
    test('should return config that can be applied to DOM', async () => {
      mockWindow('?n=CustomName&c=CustomConfessor');
      const PM = await loadPersonalizationModule();
      
      const config = PM.parseUrlParams();
      
      // Simulate applying to DOM
      const visitorNameEl = { textContent: '' };
      const fromLabelEl = { textContent: '' };
      
      visitorNameEl.textContent = config.visitor.nickname;
      fromLabelEl.textContent = `Dari hati ${config.confessor}, untuk ${config.visitor.nickname}`;
      
      expect(visitorNameEl.textContent).toBe('CustomName');
      expect(fromLabelEl.textContent).toBe('Dari hati CustomConfessor, untuk CustomName');
    });
  });

  describe('Privacy and Encoding', () => {
    test('should encode message to prevent casual reading', async () => {
      mockWindow('');
      const PM = await loadPersonalizationModule();
      
      const message = 'Secret confession message';
      const encoded = PM.encodeMessage(message);
      
      // The encoded string should not be directly readable
      expect(encoded).not.toBe(message);
      expect(encoded).not.toContain('Secret');
    });

    test('should use URL-safe base64 encoding', async () => {
      mockWindow('');
      const PM = await loadPersonalizationModule();
      
      const message = 'Test message that might produce + and / in base64';
      const encoded = PM.encodeMessage(message);
      
      // Should not contain characters that need URL encoding
      expect(encoded).not.toMatch(/[+/=]/);
    });
  });

  describe('Error Handling', () => {
    test('should gracefully handle malformed base64', async () => {
      mockWindow('?m=invalid-base64!!!');
      const PM = await loadPersonalizationModule();
      
      // Should not throw
      const config = PM.parseUrlParams();
      
      expect(config.message).toBe('');
    });

    test('should handle empty URL parameters', async () => {
      mockWindow('?n=&c=&m=');
      const PM = await loadPersonalizationModule();
      
      const config = PM.parseUrlParams();
      
      // Empty params should use defaults
      expect(config.visitor.nickname).toBe('Acell');
      expect(config.confessor).toBe('Ian');
    });
  });
});

describe('Personalization Integration Scenarios', () => {
  beforeEach(() => {
    vi.resetModules();
  });

  test('should support complete personalization flow', async () => {
    // Step 1: User creates a shareable URL
    mockWindow('');
    const PM = await loadPersonalizationModule();
    
    const shareUrl = PM.generateShareUrl({
      nickname: 'MyLove',
      fullName: 'My Love Full Name',
      confessor: 'Me',
      message: 'I have loved you since the day we met. Will you be mine? 💕'
    });
    
    // Step 2: Recipient opens the URL
    const urlObj = new URL(shareUrl);
    mockWindow(urlObj.search);
    const recipientConfig = PM.parseUrlParams();
    
    // Step 3: Personalization is applied
    expect(recipientConfig.visitor.nickname).toBe('MyLove');
    expect(recipientConfig.visitor.fullName).toBe('My Love Full Name');
    expect(recipientConfig.confessor).toBe('Me');
    expect(recipientConfig.message).toContain('I have loved you');
  });

  test('should support partial personalization (defaults for missing)', async () => {
    mockWindow('?n=OnlyNickname');
    const PM = await loadPersonalizationModule();
    
    const config = PM.parseUrlParams();
    
    // Nickname is customized
    expect(config.visitor.nickname).toBe('OnlyNickname');
    // Other values use defaults
    expect(config.confessor).toBe('Ian');
    expect(config.theme).toBe('pink');
    expect(config.animationStyle).toBe('hearts-flowers');
    expect(config.language).toBe('id');
  });
});
