/**
 * Main Application Module
 * Handles all application logic: initialization, navigation, responses, celebration
 */
(function() {
  'use strict';

  // ========================================
  // Configuration
  // ========================================

  const CONFIG = {
    visitor: {
      nickname: 'Acell',
      fullName: 'Salma Yumna Putri'
    },
    confessor: 'Ian',
    
    // The full confession message
    message: `gimana lucuu gaa? aku mau ngomong sesuatu kamu kan sempet bener soal nebak aku tuh cuek walaupun lewat zodiak itu, pasti kalau yang cuma sekilas kenal aku nilai aku kayak gitu cuek, judes, gajelas emang orang orang, padahal aku biasa ajaa, tapi kalau yang temen deket pasti bilangnya bertolak belakang sama itu, begitu pun sama kamu, didepan kamu tuhh aku gabisa cuek gitu, pengennya ngabarin, nanya dan segala macem, karena jujur aku suka sama kamu dan aku sayang sama kamuu, aku pengen selalu ada buat kamu sedih maupun seneng, jadi pendengar setia mu juga, aku gatau kalau kamu gimana, kamu juga mungkin udah sadar dari caraku ke kamu selama kita deket ini.

tapi dihubungan dewasa itu aku ngerti dan sadar kalau cinta dan sayang itu ga cukup, dan sekarang kondisi ku ibaratnya masih jauh dari KKM kalau soal finansial realitanya, karena masih banyak kebutuhan dan tanggungan yang perlu ku jalanin, sedangkan kamu udah hampir siap, mungkin satu atau dua tahun lagi paling lama udah siap secara finansial dan mungkin kamu juga gasiap buat ldr.

Aku ngomong gini karena mau confess, tapi juga mau ngomong soal realitanya. Pertama aku gamau nahan ego soal nunda ngungkapin ini dan Aku nggak mau nahan kamu dengan ego-ku masuk di situasi ini. Kalau kamu pada akhirnya memilih jalan yang lebih realistis dan sesuai sama timeline kamu, karena kamu bilang kan gamau buang buang waktu dan Kamu udah banyak tuntutan dari lingkungan juga buat nikah kan, aku paham dan nggak apa-apa. Tapi, dari lubuk hatiku, aku bakal seneng banget kalau ternyata kamu mau bareng sama aku. udah aku mau ngungkapin itu ajaa tapi selalu gatau waktu yang tepat kapan jadi daripada terlambat.`,
    
    // Persuasion messages (Indonesian)
    persuasionMessages: [
      'Yakin nih? 🥺',
      'Benar-benar yakin? 💔',
      'Coba dipikirkan lagi yuk... 🙏',
      'Jangan buru-buru memutuskan... 💕',
      'Aku masih menunggu jawaban yang baik lho... 🥹'
    ]
  };

  // ========================================
  // Application State
  // ========================================

  const state = {
    currentSection: 'landing',
    noAttempts: 0,
    answered: false,
    answer: null,
    timestamp: null
  };

  // ========================================
  // DOM Elements 
  // ========================================

  const elements = {
    landing: document.getElementById('landing'),
    confession: document.getElementById('confession'),
    response: document.getElementById('response'),
    celebration: document.getElementById('celebration'),
    heartsContainer: document.getElementById('hearts-container'),
    celebrationHearts: document.getElementById('celebration-hearts'),
    visitorName: document.getElementById('visitor-name'),
    messageContent: document.getElementById('message-content'),
    acceptanceDate: document.getElementById('acceptance-date'),
    btnOpen: document.getElementById('btn-open'),
    btnYes: document.getElementById('btn-yes'),
    btnNo: document.getElementById('btn-no'),
    btnContinue: document.getElementById('btn-continue'),
    btnNext: document.getElementById('btn-next'),
    btnRetry: document.getElementById('btn-retry'),
    persuasionModal: document.getElementById('persuasion-modal'),
    bgMusic: document.getElementById('bg-music'),
    musicToggle: document.getElementById('music-toggle')
  };

  // Music state
  const musicState = {
    isPlaying: false,
    isMuted: false
  };

  // ========================================
  // Initialization (Subtask 4.4)
  // ========================================

  /**
   * Initialize the application
   */
  function init() {
    // Load personalization from URL or use defaults
    loadPersonalization();
    
    // Set up event listeners
    setupEventListeners();
    
    // Start background animations
    startBackgroundAnimations();
    
    // Setup and try to play background music
    setupBackgroundMusic();
    
    // Initialize cute ornaments if available
    initCuteOrnaments();
  }

  /**
   * Setup background music with autoplay and user interaction fallback
   */
  function setupBackgroundMusic() {
    if (!elements.bgMusic || !elements.musicToggle) return;

    // Set initial volume
    elements.bgMusic.volume = 0.5;

    // Try to autoplay (will work on some browsers)
    const playPromise = elements.bgMusic.play();

    if (playPromise !== undefined) {
      playPromise.then(() => {
        // Autoplay started successfully
        musicState.isPlaying = true;
        elements.musicToggle.classList.add('playing');
        elements.musicToggle.classList.remove('muted');
      }).catch(() => {
        // Autoplay was prevented - user needs to interact first
        musicState.isPlaying = false;
        elements.musicToggle.classList.add('muted');
        elements.musicToggle.classList.remove('playing');
      });
    }

    // Add click handler to music toggle button
    elements.musicToggle.addEventListener('click', toggleMusic);

    // Also try to play on first user interaction with the page
    document.addEventListener('click', function startMusicOnFirstClick() {
      if (!musicState.isPlaying && elements.bgMusic) {
        elements.bgMusic.play().then(() => {
          musicState.isPlaying = true;
          elements.musicToggle.classList.add('playing');
          elements.musicToggle.classList.remove('muted');
        }).catch(() => {
          // Still can't play, that's okay
        });
      }
      // Remove this listener after first click
      document.removeEventListener('click', startMusicOnFirstClick);
    }, { once: true });
  }

  /**
   * Toggle music play/pause
   */
  function toggleMusic() {
    if (!elements.bgMusic) return;

    if (musicState.isPlaying) {
      // Pause music
      elements.bgMusic.pause();
      musicState.isPlaying = false;
      elements.musicToggle.classList.remove('playing');
      elements.musicToggle.classList.add('muted');
    } else {
      // Play music
      elements.bgMusic.play().then(() => {
        musicState.isPlaying = true;
        elements.musicToggle.classList.add('playing');
        elements.musicToggle.classList.remove('muted');
      }).catch((error) => {
        console.log('Could not play music:', error);
      });
    }
  }

  /**
   * Load personalization data from URL parameters
   */
  function loadPersonalization() {
    // Use PersonalizationManager if available
    const config = window.PersonalizationManager 
      ? window.PersonalizationManager.parseUrlParams()
      : { visitor: CONFIG.visitor, confessor: CONFIG.confessor, message: CONFIG.message };

    // Apply personalization to DOM
    const nickname = config.visitor.nickname;
    const fullName = config.visitor.fullName;
    const confessor = config.confessor;
    const message = config.message || CONFIG.message;

    // Update visitor name display
    if (elements.visitorName) {
      elements.visitorName.textContent = nickname;
    }

    // Update message content
    if (elements.messageContent) {
      elements.messageContent.textContent = message;
    }

    // Update "from" label in confession section
    const fromLabel = document.querySelector('.from-label');
    if (fromLabel) {
      fromLabel.textContent = `Dari hati ${confessor}, untuk ${nickname}`;
    }

    // Update greeting subtitle
    const greetingSubtitle = document.querySelector('.greeting-subtitle');
    if (greetingSubtitle) {
      greetingSubtitle.textContent = 'Hai Salma Yumna Putri, keren kan aku masih inget nama lengkap kamuu 🥰';
      greetingSubtitle.textContent = `Ada sesuatu yang ingin ${confessor} sampaikan...`;
    }

    // Update signature
    const signature = document.querySelector('.signature');
    if (signature) {
      signature.textContent = `💝 ${confessor}`;
    }

    // Update celebration text
    const celebrationText = document.querySelector('.celebration-text');
    if (celebrationText) {
      celebrationText.textContent = `Terima kasih, ${nickname}!`;
    }

    // Update page title with visitor name
    document.title = `Untuk ${nickname} 💕`;
  }

  /**
   * Set up all event listeners
   */
  function setupEventListeners() {
    // Open button - show confession
    if (elements.btnOpen) {
      elements.btnOpen.addEventListener('click', showConfession);
    }

    // Yes button - proceed to celebration
    if (elements.btnYes) {
      elements.btnYes.addEventListener('click', handleYes);
    }

    // No button - show persuasion
    if (elements.btnNo) {
      elements.btnNo.addEventListener('click', handleNo);
    }

    // Continue button - show response section
    if (elements.btnContinue) {
      elements.btnContinue.addEventListener('click', showResponse);
    }

    // Next button (fixed outside) - navigate sections
    if (elements.btnNext) {
      elements.btnNext.addEventListener('click', function() {
        if (state.currentSection === 'landing') {
          showConfession();
        } else if (state.currentSection === 'confession') {
          showResponse();
        } else if (state.currentSection === 'response') {
          showCelebration();
        }
      });
    }

    // Retry button - close persuasion modal
    if (elements.btnRetry) {
      elements.btnRetry.addEventListener('click', closePersuasionModal);
    }

    // Prevent accidental navigation
    window.addEventListener('beforeunload', function(e) {
      if (state.answered) return; // Allow navigation after answering
      
      if (state.currentSection !== 'landing') {
        e.preventDefault();
        // Standard way to show confirmation dialog
        const message = 'Yakin mau pergi? Jawabanmu belum disimpan.';
        e.returnValue = message; // For older browsers
        return message;
      }
    });
  }

  /**
   * Start background animations (floating hearts)
   */
  function startBackgroundAnimations() {
    // Check for AnimationEngine
    if (window.AnimationEngine && elements.heartsContainer) {
      window.AnimationEngine.startFloatingHearts(elements.heartsContainer, {
        interval: 1000,
        maxHearts: 12
      });
    }
  }

  // ========================================
  // Section Navigation (Subtask 4.5)
  // ========================================

  /**
   * Show confession section
   */
  function showConfession() {
    transitionTo('confession');
  }

  /**
   * Show response section
   */
  function showResponse() {
    transitionTo('response');
  }

  /**
   * Show celebration section
   */
  function showCelebration() {
    transitionTo('celebration');
    startCelebrationAnimations();
    displayAcceptanceDate();
  }

  /**
   * Transition to a new section with smooth animation
   * @param {string} section - Section name to transition to
   */
  function transitionTo(section) {
    // Hide current section
    if (elements[state.currentSection]) {
      elements[state.currentSection].classList.remove('active');
    }

    // Show new section
    if (elements[section]) {
      elements[section].classList.add('active');
    }

    // Update state
    state.currentSection = section;

    // Auto-show response after scrolling confession
    if (section === 'confession') {
      setupScrollDetection();
    }
  }

  /**
   * Set up scroll detection on confession message
   * Shows response section when scrolled to bottom
   */
  function setupScrollDetection() {
    const messageCard = elements.confession.querySelector('.message-card');
    if (!messageCard) return;

    let hasScrolledToEnd = false;

    messageCard.addEventListener('scroll', function onScroll() {
      if (hasScrolledToEnd) return;

      const { scrollTop, scrollHeight, clientHeight } = messageCard;
      
      // Check if scrolled to near bottom (within 50px)
      if (scrollTop + clientHeight >= scrollHeight - 50) {
        hasScrolledToEnd = true;
        messageCard.removeEventListener('scroll', onScroll);
        
        // Show response section after a short delay
        setTimeout(showResponse, 300);
      }
    });
  }

  // ========================================
  // Response Handlers (Subtask 4.6)
  // ========================================

  /**
   * Handle "Yes" button click
   */
  function handleYes() {
    console.log('handleYes called');
    if (state.answered) {
      console.log('Already answered, returning');
      return;
    }
    
    console.log('Setting answered state to yes');
    state.answered = true;
    state.answer = 'yes';
    state.timestamp = new Date();
    
    console.log('Proceeding to celebration');
    showCelebration();
  }

  /**
   * Handle "No" button click
   */
  function handleNo() {
    console.log('handleNo called');
    if (state.answered) {
      console.log('Already answered, returning');
      return;
    }

    state.noAttempts++;
    console.log(`No attempts: ${state.noAttempts}`);
    
    // Reposition the "No" button playfully
    repositionNoButton();
    
    // Show persuasion modal
    showPersuasionModal();
  }

  /**
   * Show persuasion modal with rotating messages
   */
  function showPersuasionModal() {
    console.log('showPersuasionModal called');
    if (!elements.persuasionModal) {
      console.log('Persuasion modal element not found');
      return;
    }

    console.log('Persuasion modal element found');
    // Get the message element
    const messageEl = elements.persuasionModal.querySelector('.modal-message');
    console.log('Message element:', messageEl);
    
    // Rotate through persuasion messages based on attempts
    const messageIndex = Math.min(state.noAttempts - 1, CONFIG.persuasionMessages.length - 1);
    console.log(`Message index: ${messageIndex}, message: "${CONFIG.persuasionMessages[messageIndex]}"`);
    
    if (messageEl) {
      messageEl.textContent = CONFIG.persuasionMessages[messageIndex];
      console.log('Message updated');
    }

    // Show modal with animation
    elements.persuasionModal.classList.add('active');
    console.log('Modal class "active" added');
  }

  /**
   * Close persuasion modal
   */
  function closePersuasionModal() {
    if (!elements.persuasionModal) return;
    
    elements.persuasionModal.classList.remove('active');
  }

  /**
   * Reposition the "No" button playfully
   */
  function repositionNoButton() {
    if (!elements.btnNo) return;

    // Only reposition a few times (max 3 times)
    if (state.noAttempts > 3) return;

    const container = elements.btnNo.parentElement;
    if (!container) return;

    // Get container dimensions
    const containerRect = container.getBoundingClientRect();
    const btnRect = elements.btnNo.getBoundingClientRect();

    // Calculate random offset
    const maxX = containerRect.width - btnRect.width;
    const maxY = 60; // Max vertical movement

    const randomX = Math.random() * maxX - maxX / 2;
    const randomY = -Math.random() * maxY;

    // Apply transform
    elements.btnNo.style.transform = `translate(${randomX}px, ${randomY}px)`;
    elements.btnNo.style.transition = 'transform 0.3s ease-out';

    // Reset transform after a while
    setTimeout(() => {
      elements.btnNo.style.transform = '';
    }, 2000);
  }

  // ========================================
  // Celebration (Subtask 4.7)
  // ========================================

  /**
   * Start celebration animations
   */
  function startCelebrationAnimations() {
    if (window.AnimationEngine && elements.celebrationHearts) {
      // Start celebration with hearts explosion and petals
      window.AnimationEngine.startCelebration(elements.celebrationHearts, {
        duration: 5000
      });
    }

    // Also add floating hearts to celebration section
    if (window.AnimationEngine && elements.celebration) {
      window.AnimationEngine.startFloatingHearts(elements.celebration, {
        interval: 600,
        maxHearts: 20
      });
    }
  }

  /**
   * Display the acceptance date in Indonesian locale
   */
  function displayAcceptanceDate() {
    if (!elements.acceptanceDate) return;

    const now = new Date();
    
    // Format in Indonesian locale (id-ID)
    const options = {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    };

    const formattedDate = now.toLocaleDateString('id-ID', options);
    
    elements.acceptanceDate.textContent = `Diterima pada: ${formattedDate}`;
  }

  /**
   * Initialize cute ornaments for Requirement 6
   */
  function initCuteOrnaments() {
    if (window.CuteOrnaments && document.body) {
      window.CuteOrnaments.init(document.body, {
        interval: 1500,
        maxOrnaments: 10
      });
    }
  }

  // ========================================
  // Initialize on DOMContentLoaded
  // ========================================

  document.addEventListener('DOMContentLoaded', init);

})();
