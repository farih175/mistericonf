/**
 * Personalization Module
 * Handles URL parameter parsing, message encoding/decoding, and share URL generation
 * 
 * URL Parameters Schema:
 * - n: Visitor nickname (string)
 * - f: Visitor full name (string, optional)
 * - c: Confessor name (string)
 * - m: Message (base64 encoded for privacy)
 * - t: Theme (pink, rose, lavender)
 * - a: Animation style (hearts-flowers, sparkles, petals)
 * - l: Language (id, en)
 */
(function() {
  'use strict';

  const PersonalizationManager = (function() {
    // Default configuration
    const defaultConfig = {
      visitor: {
        nickname: 'Acell',
        fullName: 'Salma Yumna Putri'
      },
      confessor: 'Ian',
      message: '',
      theme: 'pink',
      animationStyle: 'hearts-flowers',
      language: 'id'
    };

    // Current configuration (merged with URL params)
    let currentConfig = { ...defaultConfig };

    /**
     * Parse URL parameters and update configuration
     * @returns {Object} Parsed configuration object
     */
    function parseUrlParams() {
      const params = new URLSearchParams(window.location.search);
      
      const config = {
        visitor: {
          nickname: params.get('n') || defaultConfig.visitor.nickname,
          fullName: params.get('f') || defaultConfig.visitor.fullName
        },
        confessor: params.get('c') || defaultConfig.confessor,
        message: decodeMessage(params.get('m')),
        theme: params.get('t') || defaultConfig.theme,
        animationStyle: params.get('a') || defaultConfig.animationStyle,
        language: params.get('l') || defaultConfig.language
      };

      currentConfig = config;
      return config;
    }

    /**
     * Encode a message for URL sharing (base64 URL-safe)
     * @param {string} message - The message to encode
     * @returns {string} Base64 URL-safe encoded string
     */
    function encodeMessage(message) {
      if (!message) return '';
      try {
        // Convert to base64 and make URL-safe
        const base64 = btoa(unescape(encodeURIComponent(message)));
        return base64
          .replace(/\+/g, '-')
          .replace(/\//g, '_')
          .replace(/=+$/, '');
      } catch (e) {
        console.error('Failed to encode message:', e);
        return '';
      }
    }

    /**
     * Decode a base64 URL-safe encoded message
     * @param {string} encoded - The encoded message string
     * @returns {string} Decoded message or empty string if failed
     */
    function decodeMessage(encoded) {
      if (!encoded) return '';
      try {
        // Restore base64 from URL-safe format
        let base64 = encoded
          .replace(/-/g, '+')
          .replace(/_/g, '/');
        
        // Add padding if needed
        while (base64.length % 4) {
          base64 += '=';
        }
        
        return decodeURIComponent(escape(atob(base64)));
      } catch (e) {
        console.error('Failed to decode message:', e);
        return '';
      }
    }

    /**
     * Generate a shareable URL with the given configuration
     * @param {Object} options - Configuration options
     * @param {string} options.nickname - Visitor's nickname
     * @param {string} options.fullName - Visitor's full name (optional)
     * @param {string} options.confessor - Confessor's name
     * @param {string} options.message - The confession message
     * @param {string} options.theme - Theme name (default: 'pink')
     * @param {string} options.animationStyle - Animation style (default: 'hearts-flowers')
     * @param {string} options.language - Language code (default: 'id')
     * @returns {string} Complete shareable URL
     */
    function generateShareUrl(options) {
      const baseUrl = window.location.origin + window.location.pathname;
      const params = new URLSearchParams();

      if (options.nickname) params.set('n', options.nickname);
      if (options.fullName) params.set('f', options.fullName);
      if (options.confessor) params.set('c', options.confessor);
      if (options.message) params.set('m', encodeMessage(options.message));
      if (options.theme && options.theme !== 'pink') params.set('t', options.theme);
      if (options.animationStyle && options.animationStyle !== 'hearts-flowers') {
        params.set('a', options.animationStyle);
      }
      if (options.language && options.language !== 'id') params.set('l', options.language);

      const queryString = params.toString();
      return queryString ? `${baseUrl}?${queryString}` : baseUrl;
    }

    /**
     * Get the current configuration
     * @returns {Object} Current configuration object
     */
    function getConfig() {
      return { ...currentConfig };
    }

    // Public API
    return {
      parseUrlParams,
      encodeMessage,
      decodeMessage,
      generateShareUrl,
      getConfig
    };
  })();

  // Expose globally
  window.PersonalizationManager = PersonalizationManager;

})();
