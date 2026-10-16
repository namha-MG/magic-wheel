/**
 * wheel.js - Canvas Wheel Engine with Realistic Deceleration & 99% Rigging Logic
 */

class RandomWheel {
  constructor(canvasId, options = {}) {
    this.canvas = document.getElementById(canvasId);
    this.ctx = this.canvas ? this.canvas.getContext('2d') : null;
    this.pointerEl = document.getElementById('wheelPointer');

    // Configuration
    this.options = Object.assign({
      duration: 8000, // 8 seconds spin
      soundEnabled: true,
      riggedTarget: 'Nguyễn Trọng Linh',
      rigProbability: 0.99, // 99% chance for Nguyễn Trọng Linh
      rigActive: false,
      forceWinNext: false,
      palette: 'rainbow'
    }, options);

    // Palettes
    this.palettes = {
      rainbow: [
        '#10B981', '#3B82F6', '#8B5CF6', '#EC4899', '#EF4444',
        '#F59E0B', '#06B6D4', '#6366F1', '#14B8A6', '#F97316'
      ],
      neon: [
        '#00f5d4', '#7b2cbf', '#f72585', '#4cc9f0', '#ffb703',
        '#3a0ca3', '#b5179e', '#4361ee', '#480ca8', '#f15bb5'
      ],
      pastel: [
        '#a0c4ff', '#bdb2ff', '#ffc6ff', '#ffd6a5', '#fdffb6',
        '#caffbf', '#9bf6ff', '#ffadad', '#d0f4de', '#ffcbf2'
      ],
      sunset: [
        '#f72585', '#b5179e', '#7209b7', '#560bad', '#480ca8',
        '#3a0ca3', '#3f37c9', '#4361ee', '#4895ef', '#4cc9f0'
      ]
    };

    // State
    this.entries = [];
    this.currentAngle = 0; // in radians
    this.isSpinning = false;
    this.spinStartTime = null;
    this.spinStartAngle = 0;
    this.spinTargetAngle = 0;
    this.lastTickSliceIndex = -1;
    this.onSpinComplete = null;
    this.onSpinStart = null;

    // Handle high-DPI
    this.setupCanvas();
    window.addEventListener('resize', () => this.setupCanvas());
  }

  setupCanvas() {
    if (!this.canvas) return;
    const rect = this.canvas.getBoundingClientRect();
    const dpr = window.devicePixelRatio || 2;
    const size = Math.min(rect.width || 560, rect.height || 560);

    this.canvas.width = size * dpr;
    this.canvas.height = size * dpr;
    this.canvas.style.width = `${size}px`;
    this.canvas.style.height = `${size}px`;

    this.ctx.scale(dpr, dpr);
    this.width = size;
    this.height = size;
    this.cx = size / 2;
    this.cy = size / 2;
    this.radius = size / 2 - 14;

    this.draw();
  }

  setEntries(entriesList) {
    this.entries = entriesList.filter(e => e.trim().length > 0);
    this.draw();
  }

  setPalette(name) {
    if (this.palettes[name]) {
      this.options.palette = name;
      this.draw();
    }
  }

  /**
   * Normalize Vietnamese string for robust matching
   */
  normalizeText(str) {
    if (!str) return '';
    return str
      .toLowerCase()
      .trim()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '');
  }

  /**
   * Determine winning slice index based on the 99% rigging algorithm
   */
  selectTargetIndex() {
    const N = this.entries.length;
    if (N === 0) return 0;

    // Find all matching indices for the rigged target
    const targetNormalized = this.normalizeText(this.options.riggedTarget);
    const targetIndices = [];

    this.entries.forEach((entry, idx) => {
      const entryNormalized = this.normalizeText(entry);
      if (entryNormalized === targetNormalized || entryNormalized.includes(targetNormalized)) {
        targetIndices.push(idx);
      }
    });

    const hasTarget = targetIndices.length > 0;
    let shouldRig = false;

    if (this.options.forceWinNext && hasTarget) {
      shouldRig = true;
      this.options.forceWinNext = false; // Reset one-time force
    } else if (this.options.rigActive && hasTarget) {
      // 99% probability roll
      const roll = Math.random();
      if (roll < this.options.rigProbability) {
        shouldRig = true;
      }
    }

    if (shouldRig) {
      // Pick randomly among target slices if multiple exist
      const chosen = targetIndices[Math.floor(Math.random() * targetIndices.length)];
      console.log(`[Rigged Engine] Target "${this.options.riggedTarget}" selected at slice ${chosen}`);
      return chosen;
    }

    // Truly random fallback (1% of the time, or if target is not present)
    const randomIdx = Math.floor(Math.random() * N);
    console.log(`[Random Engine] Random slice ${randomIdx} selected`);
    return randomIdx;
  }

  /**
   * Start spinning the wheel
   */
  spin() {
    if (this.isSpinning || this.entries.length === 0) return false;

    this.isSpinning = true;
    if (this.onSpinStart) this.onSpinStart();

    const N = this.entries.length;
    const arc = (2 * Math.PI) / N;

    // Determine target slice
    const targetIndex = this.selectTargetIndex();

    // Pick an organic random offset inside the winning slice (20% to 80% to avoid edges)
    const offsetRatio = 0.2 + Math.random() * 0.6;
    const targetAlpha = (targetIndex + offsetRatio) * arc;

    // Calculate rotation needed so targetAlpha aligns with pointer at angle 0 (3 o'clock)
    // alpha = (2*PI - (angle % 2*PI)) % 2*PI === targetAlpha
    let currentNorm = this.currentAngle % (2 * Math.PI);
    if (currentNorm < 0) currentNorm += 2 * Math.PI;

    let desiredNorm = (2 * Math.PI - targetAlpha) % (2 * Math.PI);
    if (desiredNorm < 0) desiredNorm += 2 * Math.PI;

    let diff = desiredNorm - currentNorm;
    if (diff < 0) diff += 2 * Math.PI;

    // Minimum 7 to 9 full spins for dramatic suspense
    const minSpins = 7 + Math.floor(Math.random() * 2);
    const totalRotation = minSpins * 2 * Math.PI + diff;

    this.spinStartAngle = this.currentAngle;
    this.spinTargetAngle = this.currentAngle + totalRotation;
    this.spinStartTime = performance.now();
    this.lastTickSliceIndex = this.getCurrentSliceIndex();

    this.animateSpin();
    return true;
  }

  /**
   * Custom smooth deceleration (Quartic ease-out)
   */
  easeOutQuart(t) {
    return 1 - Math.pow(1 - t, 4);
  }

  animateSpin() {
    const now = performance.now();
    const elapsed = now - this.spinStartTime;
    const duration = this.options.duration;

    if (elapsed < duration) {
      const progress = elapsed / duration;
      const ease = this.easeOutQuart(progress);

      this.currentAngle = this.spinStartAngle + (this.spinTargetAngle - this.spinStartAngle) * ease;

      // Check slice crossing for ratchet click & pointer wobble
      const currentSlice = this.getCurrentSliceIndex();
      if (currentSlice !== this.lastTickSliceIndex) {
        this.lastTickSliceIndex = currentSlice;
        if (window.wheelAudio) window.wheelAudio.playTick();

        if (this.pointerEl) {
          this.pointerEl.classList.remove('tick-wobble');
          // Trigger reflow to restart animation
          void this.pointerEl.offsetWidth;
          this.pointerEl.classList.add('tick-wobble');
        }
      }

      this.draw();
      requestAnimationFrame(() => this.animateSpin());
    } else {
      // Completed
      this.currentAngle = this.spinTargetAngle;
      this.isSpinning = false;
      this.draw();

      const winningIndex = this.getCurrentSliceIndex();
      const winnerName = this.entries[winningIndex] || '';

      if (this.onSpinComplete) {
        this.onSpinComplete(winnerName, winningIndex);
      }
    }
  }

  getCurrentSliceIndex() {
    const N = this.entries.length;
    if (N === 0) return 0;
    const arc = (2 * Math.PI) / N;

    // Pointer is at angle 0 (3 o'clock)
    let norm = (2 * Math.PI - (this.currentAngle % (2 * Math.PI))) % (2 * Math.PI);
    if (norm < 0) norm += 2 * Math.PI;

    return Math.floor(norm / arc) % N;
  }

  /**
   * Render the wheel on canvas
   */
  draw() {
    if (!this.ctx) return;
    const ctx = this.ctx;
    const cx = this.cx;
    const cy = this.cy;
    const radius = this.radius;
    const N = this.entries.length;

    ctx.clearRect(0, 0, this.width, this.height);

    if (N === 0) {
      // Empty state
      ctx.beginPath();
      ctx.arc(cx, cy, radius, 0, Math.PI * 2);
      ctx.fillStyle = '#201a3c';
      ctx.fill();
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)';
      ctx.lineWidth = 4;
      ctx.stroke();

      ctx.fillStyle = '#9f97bf';
      ctx.font = '600 16px "Be Vietnam Pro", sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('Nhập danh sách để tạo vòng quay', cx, cy);
      return;
    }

    const arc = (2 * Math.PI) / N;
    const colors = this.palettes[this.options.palette] || this.palettes.rainbow;

    ctx.save();
    ctx.translate(cx, cy);
    ctx.rotate(this.currentAngle);

    // Draw slices
    for (let i = 0; i < N; i++) {
      const sliceStart = i * arc;
      const sliceEnd = sliceStart + arc;
      const color = colors[i % colors.length];

      // Slice background
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.arc(0, 0, radius, sliceStart, sliceEnd);
      ctx.closePath();
      ctx.fillStyle = color;
      ctx.fill();

      // Slice divider
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.35)';
      ctx.lineWidth = N > 60 ? 1 : (N > 30 ? 1.5 : 2);
      ctx.stroke();

      // Slice text
      ctx.save();
      const midAngle = sliceStart + arc / 2;
      ctx.rotate(midAngle);

      // Typography adjustments depending on entry count
      let fontSize = 16;
      if (N > 100) fontSize = 9;
      else if (N > 60) fontSize = 11;
      else if (N > 35) fontSize = 13;
      else if (N > 15) fontSize = 15;
      else fontSize = 17;

      ctx.fillStyle = '#ffffff';
      ctx.font = `700 ${fontSize}px "Be Vietnam Pro", "Montserrat", sans-serif`;
      ctx.textAlign = 'right';
      ctx.textBaseline = 'middle';
      ctx.shadowColor = 'rgba(0, 0, 0, 0.55)';
      ctx.shadowBlur = 4;

      // Text truncation to fit slice radius
      const text = this.entries[i];
      const maxTextWidth = radius - 55;
      let displayText = text;

      if (ctx.measureText(displayText).width > maxTextWidth) {
        while (displayText.length > 3 && ctx.measureText(displayText + '...').width > maxTextWidth) {
          displayText = displayText.slice(0, -1);
        }
        displayText += '...';
      }

      ctx.fillText(displayText, radius - 18, 0);
      ctx.restore();
    }

    // Outer wheel border & decorative silver rim
    ctx.beginPath();
    ctx.arc(0, 0, radius, 0, Math.PI * 2);
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 5;
    ctx.stroke();

    ctx.beginPath();
    ctx.arc(0, 0, radius + 4, 0, Math.PI * 2);
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)';
    ctx.lineWidth = 4;
    ctx.stroke();

    // Decorative edge pegs
    const pegCount = Math.min(N * (N <= 40 ? 1 : 1), 60);
    const pegArc = (2 * Math.PI) / pegCount;
    for (let p = 0; p < pegCount; p++) {
      const pAngle = p * pegArc;
      const px = (radius - 2) * Math.cos(pAngle);
      const py = (radius - 2) * Math.sin(pAngle);

      ctx.beginPath();
      ctx.arc(px, py, 3, 0, Math.PI * 2);
      ctx.fillStyle = '#ffffff';
      ctx.shadowColor = 'rgba(0,0,0,0.5)';
      ctx.shadowBlur = 3;
      ctx.fill();
    }

    ctx.restore();

    // Center Hub (Stays stationary or rotates)
    ctx.save();
    ctx.translate(cx, cy);

    // Outer glow for hub
    ctx.beginPath();
    ctx.arc(0, 0, 48, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(0, 0, 0, 0.25)';
    ctx.fill();

    // Center white disc
    ctx.beginPath();
    ctx.arc(0, 0, 40, 0, Math.PI * 2);
    const hubGrad = ctx.createRadialGradient(0, 0, 10, 0, 0, 40);
    hubGrad.addColorStop(0, '#ffffff');
    hubGrad.addColorStop(0.85, '#e8e8ee');
    hubGrad.addColorStop(1, '#cccccc');
    ctx.fillStyle = hubGrad;
    ctx.shadowColor = 'rgba(0, 0, 0, 0.45)';
    ctx.shadowBlur = 12;
    ctx.fill();

    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 4;
    ctx.stroke();

    // Inner silver ring
    ctx.beginPath();
    ctx.arc(0, 0, 20, 0, Math.PI * 2);
    ctx.fillStyle = '#1c1736';
    ctx.shadowBlur = 0;
    ctx.fill();
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.4)';
    ctx.lineWidth = 2;
    ctx.stroke();

    ctx.restore();
  }
}

window.RandomWheel = RandomWheel;
