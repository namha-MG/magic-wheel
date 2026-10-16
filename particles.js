/**
 * particles.js - Festive Confetti & Sparkle Particle Engine (Vui vẻ, hào hứng)
 */

class CelebrationParticleEngine {
  constructor(canvasId = 'romanticCanvas') {
    this.canvas = document.getElementById(canvasId);
    this.ctx = this.canvas ? this.canvas.getContext('2d') : null;
    this.confetti = [];
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

  drawStar(ctx, cx, cy, spikes, outerRadius, innerRadius, color, alpha) {
    let rot = Math.PI / 2 * 3;
    let x = cx;
    let y = cy;
    const step = Math.PI / spikes;

    ctx.save();
    ctx.globalAlpha = Math.max(0, alpha);
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.moveTo(cx, cy - outerRadius);

    for (let i = 0; i < spikes; i++) {
      x = cx + Math.cos(rot) * outerRadius;
      y = cy + Math.sin(rot) * outerRadius;
      ctx.lineTo(x, y);
      rot += step;

      x = cx + Math.cos(rot) * innerRadius;
      y = cy + Math.sin(rot) * innerRadius;
      ctx.lineTo(x, y);
      rot += step;
    }
    ctx.lineTo(cx, cy - outerRadius);
    ctx.closePath();
    ctx.fill();
    ctx.restore();
  }

  createConfetti(startX, startY) {
    const colors = [
      '#ffd700', '#ff9800', '#00e676', '#00d2ff',
      '#e040fb', '#ff4081', '#7c4dff', '#ffffff'
    ];
    const angle = Math.random() * Math.PI * 2;
    const speed = 4 + Math.random() * 10;
    return {
      x: startX || window.innerWidth / 2,
      y: startY || window.innerHeight / 2,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed - 3,
      w: 8 + Math.random() * 8,
      h: 12 + Math.random() * 12,
      color: colors[Math.floor(Math.random() * colors.length)],
      alpha: 1,
      decay: 0.006 + Math.random() * 0.006,
      rotation: Math.random() * 360,
      rotationSpeed: (Math.random() - 0.5) * 12,
      tilt: Math.random() * 10,
      tiltSpeed: 0.08 + Math.random() * 0.08,
      gravity: 0.16,
      isStar: Math.random() < 0.25
    };
  }

  createSparkle(x, y) {
    const colors = ['#ffd700', '#ffffff', '#00e5ff', '#ffeb3b'];
    return {
      x: x + (Math.random() - 0.5) * 120,
      y: y + (Math.random() - 0.5) * 120,
      size: 2 + Math.random() * 4,
      color: colors[Math.floor(Math.random() * colors.length)],
      alpha: 1,
      decay: 0.02 + Math.random() * 0.02,
      vy: -0.5 - Math.random() * 2
    };
  }

  burst(x, y, count = 110) {
    if (!this.canvas || !this.ctx) return;
    this.resize();

    const originX = x !== undefined ? x : window.innerWidth / 2;
    const originY = y !== undefined ? y : window.innerHeight / 2;

    for (let i = 0; i < count; i++) {
      this.confetti.push(this.createConfetti(originX, originY));
    }
    for (let i = 0; i < count * 1.2; i++) {
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

    // Update & draw confetti & stars
    for (let i = this.confetti.length - 1; i >= 0; i--) {
      const c = this.confetti[i];
      c.x += c.vx;
      c.y += c.vy;
      c.vy += c.gravity;
      c.vx *= 0.985;
      c.rotation += c.rotationSpeed;
      c.tilt += c.tiltSpeed;
      c.alpha -= c.decay;

      if (c.alpha <= 0 || c.y > window.innerHeight + 50) {
        this.confetti.splice(i, 1);
        continue;
      }

      if (c.isStar) {
        this.drawStar(this.ctx, c.x, c.y, 5, c.w * 0.9, c.w * 0.45, c.color, c.alpha);
      } else {
        this.ctx.save();
        this.ctx.translate(c.x, c.y);
        this.ctx.rotate((c.rotation * Math.PI) / 180);
        this.ctx.scale(Math.cos(c.tilt), 1);
        this.ctx.globalAlpha = Math.max(0, c.alpha);
        this.ctx.fillStyle = c.color;
        this.ctx.fillRect(-c.w / 2, -c.h / 2, c.w, c.h);
        this.ctx.restore();
      }
    }

    if (this.confetti.length > 0 || this.sparkles.length > 0) {
      this.animationId = requestAnimationFrame(() => this.render());
    } else {
      this.animating = false;
      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }
  }

  stop() {
    this.animating = false;
    this.confetti = [];
    this.sparkles = [];
    if (this.animationId) cancelAnimationFrame(this.animationId);
    if (this.ctx && this.canvas) this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
  }
}

window.romanticParticles = new CelebrationParticleEngine();
