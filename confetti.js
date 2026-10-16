/**
 * confetti.js - High-performance celebratory particle burst
 */

class ConfettiCannon {
  constructor(canvasId = 'confettiCanvas') {
    this.canvas = document.getElementById(canvasId);
    this.ctx = this.canvas ? this.canvas.getContext('2d') : null;
    this.particles = [];
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

  createParticle(x, y) {
    const colors = [
      '#ffd600', '#ff3d00', '#00e676', '#00b0ff', '#d500f9',
      '#ff4081', '#7c4dff', '#ffff00', '#00e5ff', '#ff9100'
    ];
    const angle = Math.random() * Math.PI * 2;
    const speed = 6 + Math.random() * 14;
    return {
      x,
      y,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed - 6,
      size: 6 + Math.random() * 8,
      color: colors[Math.floor(Math.random() * colors.length)],
      rotation: Math.random() * 360,
      rotSpeed: (Math.random() - 0.5) * 12,
      gravity: 0.35,
      drag: 0.94,
      wobble: Math.random() * 10,
      wobbleSpeed: 0.1 + Math.random() * 0.1,
      opacity: 1,
      decay: 0.006 + Math.random() * 0.008
    };
  }

  fire(durationMs = 3500) {
    if (!this.canvas || !this.ctx) return;
    this.resize();

    // Spawn 160-220 particles from left, center, right
    const origins = [
      { x: window.innerWidth * 0.2, y: window.innerHeight * 0.6 },
      { x: window.innerWidth * 0.5, y: window.innerHeight * 0.5 },
      { x: window.innerWidth * 0.8, y: window.innerHeight * 0.6 }
    ];

    origins.forEach(origin => {
      const count = 55;
      for (let i = 0; i < count; i++) {
        this.particles.push(this.createParticle(origin.x, origin.y));
      }
    });

    if (!this.animating) {
      this.animating = true;
      this.render();
    }
  }

  render() {
    if (!this.animating) return;
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    for (let i = this.particles.length - 1; i >= 0; i--) {
      const p = this.particles[i];

      p.vx *= p.drag;
      p.vy = p.vy * p.drag + p.gravity;
      p.x += p.vx;
      p.y += p.vy;
      p.rotation += p.rotSpeed;
      p.wobble += p.wobbleSpeed;
      p.opacity -= p.decay;

      if (p.opacity <= 0 || p.y > this.canvas.height + 20) {
        this.particles.splice(i, 1);
        continue;
      }

      this.ctx.save();
      this.ctx.translate(p.x, p.y);
      this.ctx.rotate((p.rotation * Math.PI) / 180);
      this.ctx.globalAlpha = Math.max(0, p.opacity);
      this.ctx.fillStyle = p.color;

      const scaleX = Math.cos(p.wobble);
      this.ctx.fillRect(-p.size / 2 * scaleX, -p.size / 2, p.size * Math.abs(scaleX), p.size);
      this.ctx.restore();
    }

    if (this.particles.length > 0) {
      this.animationId = requestAnimationFrame(() => this.render());
    } else {
      this.animating = false;
      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }
  }

  stop() {
    this.animating = false;
    this.particles = [];
    if (this.animationId) {
      cancelAnimationFrame(this.animationId);
    }
    if (this.ctx && this.canvas) {
      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }
  }
}

// Global confetti instance
window.confettiCannon = new ConfettiCannon();
