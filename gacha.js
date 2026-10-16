/**
 * gacha.js - CS:GO / Hextech Style Dual Roller Physics Engine
 * Features:
 *  - Reactive needle flick physics with tactile kickback & electric sparks
 *  - Dynamic velocity-based motion blur & high-speed light streaks
 *  - 3D Drum Curvature & Center Card Spotlight Magnification
 *  - High-suspense crawl deceleration curve
 *  - Dramatic Winner Lock-In moment with golden shockwave, jackpot chime & fireworks
 */

class GachaRollerTrack {
  constructor(options) {
    this.viewportEl = document.getElementById(options.viewportId);
    this.stripEl = document.getElementById(options.stripId);
    this.gender = options.gender; // 'male' or 'female'
    this.cardWidth = 175; // px matching CSS --card-width
    this.totalCardsInTape = 65;
    this.winnerIndexInTape = 52; // Winner card placement in the tape

    this.needleContainer = this.viewportEl ? this.viewportEl.querySelector('.gacha-needle-container') : null;

    this.candidates = [];
    this.tapeCards = [];
    this.currentX = 0;
    this.targetX = 0;
    this.startX = 0;
    this.isRolling = false;
    this.startTime = 0;
    this.duration = 7500; // ms for perfect suspense rhythm
    this.lastCardTick = -1;
    this.lastFocusedCardIndex = -1;
    this.winningCandidate = null;
    this.winningCardEl = null;

    this.onComplete = null;
  }

  setCandidates(list) {
    this.candidates = list && list.length > 0 ? list : [];
    this.initStaticPreview();
  }

  /**
   * Populate initial static view so strip is never empty
   */
  initStaticPreview() {
    if (!this.stripEl || this.candidates.length === 0) return;
    this.stripEl.innerHTML = '';
    this.stripEl.style.transform = 'translateX(0px)';
    this.stripEl.style.filter = 'none';

    // Show 15 cards initially centered
    const previewCards = [];
    for (let i = 0; i < 15; i++) {
      const candidate = this.candidates[i % this.candidates.length];
      previewCards.push(candidate);
    }

    previewCards.forEach(c => {
      this.stripEl.appendChild(this.createCardElement(c));
    });
  }

  createCardElement(candidate, isWinner = false) {
    const rank = (typeof window !== 'undefined' && window.getMemberRank)
      ? window.getMemberRank(candidate.name)
      : { id: 'emerald', name: 'Lục Bảo', icon: '🟢' };

    const card = document.createElement('div');
    card.className = `gacha-card ${this.gender}-card rank-${rank.id} ${isWinner ? 'winner-target' : ''}`;
    
    // Avatar with mini LOL rank frame
    const avatarWrapper = document.createElement('div');
    avatarWrapper.className = `card-avatar-wrapper rank-${rank.id}`;
    
    const avatarImg = document.createElement('img');
    avatarImg.className = 'card-avatar-img';
    avatarImg.src = candidate.avatar;
    avatarImg.alt = candidate.name;
    avatarWrapper.appendChild(avatarImg);

    // LOL Summoner Crest Overlay from user image
    const crestOverlay = document.createElement('img');
    crestOverlay.className = 'card-crest-overlay';
    crestOverlay.src = rank.crestImg || `avatars/ranks/crest_${rank.id}.png`;
    crestOverlay.alt = rank.name;
    avatarWrapper.appendChild(crestOverlay);

    // Mini Rank Badge
    const rankBadge = document.createElement('div');
    rankBadge.className = `card-rank-mini rank-${rank.id}`;
    rankBadge.innerHTML = `<span class="mini-icon">${rank.icon}</span><span class="mini-name">${rank.name}</span>`;
    avatarWrapper.appendChild(rankBadge);

    // Name
    const nameEl = document.createElement('div');
    nameEl.className = 'card-name';
    nameEl.textContent = candidate.name;

    // Role
    const roleEl = document.createElement('div');
    roleEl.className = 'card-gender-role';
    roleEl.textContent = this.gender === 'male' ? 'Đàng Trai' : 'Đàng Gái';

    // Rarity strip styled with rank gradient
    const rarityStrip = document.createElement('div');
    rarityStrip.className = `card-rarity-strip rank-${rank.id}`;

    // Winner highlight ring container
    if (isWinner) {
      const shockwave = document.createElement('div');
      shockwave.className = 'winner-shockwave-ring';
      card.appendChild(shockwave);
    }

    card.appendChild(avatarWrapper);
    card.appendChild(nameEl);
    card.appendChild(roleEl);
    card.appendChild(rarityStrip);

    return card;
  }

  /**
   * Build the full rolling tape with the predetermined winner at winnerIndexInTape
   */
  buildTape(winningCandidate) {
    this.stripEl.innerHTML = '';
    this.tapeCards = [];
    this.winningCandidate = winningCandidate;
    this.winningCardEl = null;
    this.lastFocusedCardIndex = -1;

    const N = this.candidates.length;

    for (let i = 0; i < this.totalCardsInTape; i++) {
      let candidate;
      const isWinner = (i === this.winnerIndexInTape);
      if (isWinner) {
        candidate = winningCandidate;
      } else {
        const randomIdx = Math.floor(Math.random() * N);
        candidate = this.candidates[randomIdx];
      }

      this.tapeCards.push(candidate);
      const cardEl = this.createCardElement(candidate, isWinner);
      if (isWinner) {
        this.winningCardEl = cardEl;
      }
      this.stripEl.appendChild(cardEl);
    }
  }

  /**
   * Physically flick the needle with elastic kickback
   */
  flickNeedle(direction = 1) {
    if (!this.needleContainer) return;
    this.needleContainer.classList.remove('needle-flick-left', 'needle-flick-right');
    // Force DOM reflow to restart keyframe animation
    void this.needleContainer.offsetWidth;
    this.needleContainer.classList.add(direction > 0 ? 'needle-flick-left' : 'needle-flick-right');
  }

  /**
   * Start the rolling animation towards target
   */
  startRoll(winningCandidate, targetJitter = 0) {
    if (this.candidates.length === 0) return;
    this.isRolling = true;
    this.buildTape(winningCandidate);

    if (this.needleContainer) {
      this.needleContainer.classList.remove('needle-locked');
    }
    if (this.viewportEl) {
      this.viewportEl.classList.remove('has-locked-winner', 'is-creeping-suspense');
      this.viewportEl.classList.add('is-fast-spinning', 'is-launching');
      setTimeout(() => {
        if (this.viewportEl) this.viewportEl.classList.remove('is-launching');
      }, 420);
    }

    const viewportWidth = this.viewportEl.clientWidth || 900;
    const centerPoint = viewportWidth / 2;

    // Calculate destination: center of winner card aligns with centerPoint + slight jitter
    const winnerCardCenter = this.winnerIndexInTape * this.cardWidth + this.cardWidth / 2;
    this.startX = 0;
    this.targetX = -(winnerCardCenter - centerPoint) + targetJitter;
    this.currentX = 0;
    this.startTime = performance.now();
    this.lastCardTick = 0;

    this.stripEl.style.transform = `translateX(0px)`;
    this.animate();
  }

  /**
   * High-Suspense Quintic Ease-Out with Long Tactile Crawl
   * Rapid burst -> energetic glide -> progressive brake -> intense 1.5s creeping suspense
   */
  easeOutSuspense(t) {
    return 1 - Math.pow(1 - t, 4.6);
  }

  animate() {
    if (!this.isRolling) return;
    const now = performance.now();
    const elapsed = now - this.startTime;

    if (elapsed < this.duration) {
      const progress = elapsed / this.duration;
      const ease = this.easeOutSuspense(progress);

      this.currentX = this.startX + (this.targetX - this.startX) * ease;
      this.stripEl.style.transform = `translateX(${this.currentX}px)`;

      // Instantaneous velocity (1.0 at start, decaying to 0.0)
      const velocity = Math.max(0, 1 - Math.pow(progress, 0.7));

      // Dynamic Motion Blur on strip based on speed
      if (velocity > 0.38) {
        const blurPx = Math.min(3.5, velocity * 4).toFixed(1);
        this.stripEl.style.filter = `blur(${blurPx}px)`;
      } else {
        this.stripEl.style.filter = 'none';
      }

      // Dynamic Viewport lighting states
      if (this.viewportEl) {
        if (progress > 0.45 && this.viewportEl.classList.contains('is-fast-spinning')) {
          this.viewportEl.classList.remove('is-fast-spinning');
        }
        if (progress > 0.78 && !this.viewportEl.classList.contains('is-creeping-suspense')) {
          this.viewportEl.classList.add('is-creeping-suspense');
        }
      }

      // 3D Drum Spotlight: Magnify & illuminate card currently under the needle
      const viewportWidth = this.viewportEl.clientWidth || 900;
      const centerPoint = viewportWidth / 2;
      const centerIdx = Math.round(((-this.currentX) + centerPoint - this.cardWidth / 2) / this.cardWidth);

      if (centerIdx !== this.lastFocusedCardIndex) {
        const allCards = this.stripEl.children;
        if (this.lastFocusedCardIndex >= 0 && allCards[this.lastFocusedCardIndex]) {
          allCards[this.lastFocusedCardIndex].classList.remove('is-center-focus');
        }
        if (allCards[centerIdx]) {
          allCards[centerIdx].classList.add('is-center-focus');
        }
        this.lastFocusedCardIndex = centerIdx;
      }

      // Audio click & Needle Physical Flick & Electric Sparks
      const cardPassed = Math.floor(Math.abs(this.currentX) / this.cardWidth);
      if (cardPassed !== this.lastCardTick) {
        this.lastCardTick = cardPassed;

        // Needle flick bounce
        this.flickNeedle(cardPassed % 2 === 0 ? 1 : -1);

        // Electric needle sparks
        if (this.needleContainer && window.romanticParticles) {
          const rect = this.needleContainer.getBoundingClientRect();
          const sparkX = rect.left + rect.width / 2;
          const sparkY = rect.bottom - 12;
          window.romanticParticles.emitNeedleSparks(sparkX, sparkY, this.gender, velocity > 0.5 ? 4 : 2);
        }

        // Sound ratchet click
        const pitch = this.gender === 'male' ? 1.0 : 1.15;
        if (window.gachaAudio) {
          window.gachaAudio.playCsgoTick(pitch, {
            gender: this.gender,
            velocity: velocity
          });

          // Suspense heartbeat during last 20% of spin
          if (progress > 0.80 && cardPassed % 2 === 0) {
            window.gachaAudio.playTensionHeartbeat();
          }
        }
      }

      requestAnimationFrame(() => this.animate());
    } else {
      // Reached exact target position
      this.currentX = this.targetX;
      this.stripEl.style.transform = `translateX(${this.currentX}px)`;
      this.stripEl.style.filter = 'none';
      this.isRolling = false;

      // TRIGGER EPIC LOCK-IN MOMENT
      this.handleWinnerLockIn();
    }
  }

  /**
   * Triumphant Winner Lock-In Moment
   * Snaps needle, flashes golden shockwave, emits fireworks over card,
   * plays hextech lock-in chime, pauses 850ms for suspense payoff, then triggers modal.
   */
  handleWinnerLockIn() {
    if (this.viewportEl) {
      this.viewportEl.classList.remove('is-fast-spinning', 'is-creeping-suspense');
      this.viewportEl.classList.add('has-locked-winner');
    }

    if (this.needleContainer) {
      this.needleContainer.classList.add('needle-locked');
    }

    if (this.winningCardEl) {
      this.winningCardEl.classList.add('winner-locked-in', 'is-center-focus');

      // Burst fireworks directly over the locked winner card
      if (window.romanticParticles) {
        const rect = this.winningCardEl.getBoundingClientRect();
        const burstX = rect.left + rect.width / 2;
        const burstY = rect.top + rect.height / 2;
        window.romanticParticles.burst(burstX, burstY, 35);
      }
    }

    // Play euphoric Jackpot Lock-in Chime
    if (window.gachaAudio) {
      window.gachaAudio.playLockInSound(this.gender);
    }

    // Delay callback by 850ms so user can enjoy seeing the locked card on the track
    setTimeout(() => {
      if (this.onComplete) {
        this.onComplete(this.winningCandidate);
      }
    }, 850);
  }
}

window.GachaRollerTrack = GachaRollerTrack;
