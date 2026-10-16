/**
 * audio.js - Web Audio API Sound Synthesizer for Random Wheel
 * Provides authentic mechanical ratchet clicking and celebration fanfare without external files.
 */

class WheelAudio {
  constructor() {
    this.ctx = null;
    this.enabled = true;
    this.lastTickTime = 0;
  }

  init() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  toggleSound(enable) {
    this.enabled = enable !== undefined ? enable : !this.enabled;
    return this.enabled;
  }

  /**
   * Mechanical ratchet click when slice boundary passes the pointer
   */
  playTick() {
    if (!this.enabled) return;
    this.init();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    // Throttle clicks slightly to avoid audio glitching at super-fast speeds
    if (now - this.lastTickTime < 0.015) return;
    this.lastTickTime = now;

    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      // Sharp woodblock / plastic flapper snap
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(680, now);
      osc.frequency.exponentialRampToValueAtTime(140, now + 0.04);

      gain.gain.setValueAtTime(0.28, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.04);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 0.045);
    } catch {
      // Audio context might be restricted
    }
  }

  /**
   * Joyful victory fanfare when a winner is chosen
   */
  playFanfare() {
    if (!this.enabled) return;
    this.init();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    // Triumphant chord notes (C5, E5, G5, C6)
    const notes = [
      { freq: 523.25, time: 0.0, dur: 0.15 },
      { freq: 659.25, time: 0.14, dur: 0.15 },
      { freq: 783.99, time: 0.28, dur: 0.2 },
      { freq: 1046.50, time: 0.46, dur: 0.8 },
      { freq: 1318.51, time: 0.46, dur: 0.8 } // harmonized top note
    ];

    notes.forEach(note => {
      try {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(note.freq, now + note.time);

        const startTime = now + note.time;
        const endTime = startTime + note.dur;

        gain.gain.setValueAtTime(0.001, startTime);
        gain.gain.linearRampToValueAtTime(0.3, startTime + 0.03);
        gain.gain.exponentialRampToValueAtTime(0.001, endTime);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(startTime);
        osc.stop(endTime);
      } catch {
        // Fallback gracefully
      }
    });
  }
}

// Global audio instance
window.wheelAudio = new WheelAudio();
