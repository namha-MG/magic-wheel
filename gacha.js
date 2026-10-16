/**
 * gacha.js - CS:GO Style Dual Roller Physics Engine with 99% Rigging
 */

class GachaRollerTrack {
  constructor(options) {
    this.viewportEl = document.getElementById(options.viewportId);
    this.stripEl = document.getElementById(options.stripId);
    this.gender = options.gender; // 'male' or 'female'
    this.cardWidth = 175; // px matching CSS --card-width
    this.totalCardsInTape = 65;
    this.winnerIndexInTape = 52; // Winner card placement in the tape

    this.candidates = [];
    this.tapeCards = [];
    this.currentX = 0;
    this.targetX = 0;
    this.startX = 0;
    this.isRolling = false;
    this.startTime = 0;
    this.duration = 7200; // ms
    this.lastCardTick = -1;
    this.winningCandidate = null;

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

    // Show 12 cards initially centered
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
    const card = document.createElement('div');
    card.className = `gacha-card ${this.gender}-card ${isWinner ? 'winner-target' : ''}`;
    
    // Avatar
    const avatarWrapper = document.createElement('div');
    avatarWrapper.className = 'card-avatar-wrapper';
    const avatarImg = document.createElement('img');
    avatarImg.className = 'card-avatar-img';
    avatarImg.src = candidate.avatar;
    avatarImg.alt = candidate.name;
    avatarWrapper.appendChild(avatarImg);

    // Name
    const nameEl = document.createElement('div');
    nameEl.className = 'card-name';
    nameEl.textContent = candidate.name;

    // Role
    const roleEl = document.createElement('div');
    roleEl.className = 'card-gender-role';
    roleEl.textContent = this.gender === 'male' ? 'Nam' : 'Nữ';

    // Rarity strip
    const rarityStrip = document.createElement('div');
    rarityStrip.className = 'card-rarity-strip';

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

    const N = this.candidates.length;

    for (let i = 0; i < this.totalCardsInTape; i++) {
      let candidate;
      if (i === this.winnerIndexInTape) {
        candidate = winningCandidate;
      } else {
        // Random candidate, try not to repeat the exact same one immediately
        const randomIdx = Math.floor(Math.random() * N);
        candidate = this.candidates[randomIdx];
      }

      this.tapeCards.push(candidate);
      const cardEl = this.createCardElement(candidate, i === this.winnerIndexInTape);
      this.stripEl.appendChild(cardEl);
    }
  }

  /**
   * Start the rolling animation towards target
   */
  startRoll(winningCandidate, targetJitter = 0) {
    if (this.candidates.length === 0) return;
    this.isRolling = true;
    this.buildTape(winningCandidate);

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
   * CS:GO Quartic Ease-Out deceleration
   */
  easeOutQuartic(t) {
    return 1 - Math.pow(1 - t, 4.2);
  }

  animate() {
    if (!this.isRolling) return;
    const now = performance.now();
    const elapsed = now - this.startTime;

    if (elapsed < this.duration) {
      const progress = elapsed / this.duration;
      const ease = this.easeOutQuartic(progress);

      this.currentX = this.startX + (this.targetX - this.startX) * ease;
      this.stripEl.style.transform = `translateX(${this.currentX}px)`;

      // Audio click calculation
      const cardPassed = Math.floor(Math.abs(this.currentX) / this.cardWidth);
      if (cardPassed !== this.lastCardTick) {
        this.lastCardTick = cardPassed;
        const pitch = this.gender === 'male' ? 1 : 1.15;
        if (window.gachaAudio) window.gachaAudio.playCsgoTick(pitch);
      }

      requestAnimationFrame(() => this.animate());
    } else {
      // Finished
      this.currentX = this.targetX;
      this.stripEl.style.transform = `translateX(${this.currentX}px)`;
      this.isRolling = false;

      // Highlight winning card
      const winnerCards = this.stripEl.querySelectorAll('.winner-target');
      winnerCards.forEach(c => c.classList.add('is-selected'));

      if (this.onComplete) {
        this.onComplete(this.winningCandidate);
      }
    }
  }
}

window.GachaRollerTrack = GachaRollerTrack;
