/**
 * particles.js - Romantic Hearts & Golden Sparkle Particle Engine
 */

class RomanticParticleEngine {
  constructor(canvasId = 'romanticCanvas') {
    this.canvas = document.getElementById(canvasId);
    this.ctx = this.canvas ? this.canvas.getContext('2d') : null;
    this.hearts = [];
    this.sparkles = [];
    this.animating = false;
    this.animationId = null;

    if (this.canvas) {
      this.resize();
      window.addEventListener('resize', () => this.resize());
    }
  }

  resize() {
    if (!this.canvas) return;
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
  }

  drawHeart(ctx, x, y, size, color, alpha) {
    ctx.save();
    ctx.translate(x, y);
    ctx.scale(size / 30, size / 30);
    ctx.globalAlpha = Math.max(0, alpha);
    ctx.fillStyle = color;

    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.bezierCurveTo(-10, -15, -25, -5, -25, 10);
    ctx.bezierCurveTo(-25, 25, -5, 35, 0, 45);
    ctx.bezierCurveTo(5, 35, 25, 25, 25, 10);
    ctx.bezierCurveTo(25, -5, 10, -15, 0, 0);
    ctx.closePath();
    ctx.fill();

    // Subtle glow
    ctx.shadowColor = color;
    ctx.shadowBlur = 10;
    ctx.restore();
  }

  createHeart(startX, startY) {
    const colors = [
      '#ff2a85', '#ff4081', '#f50057', '#ff80ab',
      '#ffd700', '#ff1744', '#b388ff', '#ff6090'
    ];
    const angle = (Math.random() - 0.5) * Math.PI * 1.5 - Math.PI / 2;
    const speed = 4 + Math.random() * 9;
    return {
      x: startX || window.innerWidth / 2,
      y: startY || window.innerHeight / 2,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed,
      size: 14 + Math.random() * 26,
      color: colors[Math.floor(Math.random() * colors.length)],
      alpha: 1,
      decay: 0.007 + Math.random() * 0.008,
      wobble: Math.random() * Math.PI,
      wobbleSpeed: 0.04 + Math.random() * 0.06,
      gravity: -0.06 // Float upwards gently
    };
  }

  createSparkle(x, y) {
    const colors = ['#ffd700', '#ffffff', '#ff80ab', '#00d2ff'];
    return {
      x: x + (Math.random() - 0.5) * 80,
      y: y + (Math.random() - 0.5) * 80,
      size: 2 + Math.random() * 4,
      color: colors[Math.floor(Math.random() * colors.length)],
      alpha: 1,
      decay: 0.02 + Math.random() * 0.02,
      vy: -0.5 - Math.random() * 1.5
    };
  }

  burst(x, y, count = 90) {
    if (!this.canvas || !this.ctx) return;
    this.resize();

    const originX = x !== undefined ? x : window.innerWidth / 2;
    const originY = y !== undefined ? y : window.innerHeight / 2;

    for (let i = 0; i < count; i++) {
      this.hearts.push(this.createHeart(originX, originY));
    }
    for (let i = 0; i < count * 1.5; i++) {
      this.sparkles.push(this.createSparkle(originX, originY));
    }

    if (!this.animating) {
      this.animating = true;
      this.render();
    }
  }

  render() {
    if (!this.animating) return;
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    // Update & draw sparkles
    for (let i = this.sparkles.length - 1; i >= 0; i--) {
      const s = this.sparkles[i];
      s.y += s.vy;
      s.alpha -= s.decay;

      if (s.alpha <= 0) {
        this.sparkles.splice(i, 1);
        continue;
      }

      this.ctx.save();
      this.ctx.globalAlpha = Math.max(0, s.alpha);
      this.ctx.fillStyle = s.color;
      this.ctx.beginPath();
      this.ctx.arc(s.x, s.y, s.size, 0, Math.PI * 2);
      this.ctx.fill();
      this.ctx.restore();
    }

    // Update & draw hearts
    for (let i = this.hearts.length - 1; i >= 0; i--) {
      const h = this.hearts[i];
      h.x += h.vx + Math.sin(h.wobble) * 1.2;
      h.y += h.vy;
      h.vy += h.gravity;
      h.wobble += h.wobbleSpeed;
      h.alpha -= h.decay;

      if (h.alpha <= 0 || h.y < -50) {
        this.hearts.splice(i, 1);
        continue;
      }

      this.drawHeart(this.ctx, h.x, h.y, h.size, h.color, h.alpha);
    }

    if (this.hearts.length > 0 || this.sparkles.length > 0) {
      this.animationId = requestAnimationFrame(() => this.render());
    } else {
      this.animating = false;
      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }
  }

  stop() {
    this.animating = false;
    this.hearts = [];
    this.sparkles = [];
    if (this.animationId) cancelAnimationFrame(this.animationId);
    if (this.ctx && this.canvas) this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
  }
}

window.romanticParticles = new RomanticParticleEngine();
