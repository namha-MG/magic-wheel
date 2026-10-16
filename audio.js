/**
 * audio.js - Web Audio API Sound Synthesizer
 * CS:GO case opening mechanical clicks and sweet romantic fanfare
 */

class GachaAudio {
  constructor() {
    this.ctx = null;
    this.enabled = true;
    this.lastTickTime = 0;
  }

  init() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (AudioCtx) this.ctx = new AudioCtx();
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
   * Iconic CS:GO Case Opening click sound
   */
  playCsgoTick(pitch = 1) {
    if (!this.enabled) return;
    this.init();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    if (now - this.lastTickTime < 0.02) return;
    this.lastTickTime = now;

    try {
      // Woodblock / Plastic flapper snap
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'triangle';
      const baseFreq = 880 * pitch;
      osc.frequency.setValueAtTime(baseFreq, now);
      osc.frequency.exponentialRampToValueAtTime(160, now + 0.035);

      gain.gain.setValueAtTime(0.32, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.038);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 0.04);
    } catch {
      // Audio fallback
    }
  }

  /**
   * Initial spin whoosh
   */
  playWhoosh() {
    if (!this.enabled) return;
    this.init();
    if (!this.ctx) return;

    try {
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(140, now);
      osc.frequency.exponentialRampToValueAtTime(380, now + 0.3);

      gain.gain.setValueAtTime(0.18, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 0.36);
    } catch {}
  }

  /**
   * Cheerful victory fanfare when coworker pair is revealed (Vui vẻ, hào hứng)
   */
  playCelebrationFanfare() {
    if (!this.enabled) return;
    this.init();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    // Upbeat celebratory fanfare notes (C Major triad cheer: C5, E5, G5, C6, G6)
    const melody = [
      { freq: 523.25, time: 0.00, dur: 0.22, type: 'triangle' }, // C5
      { freq: 659.25, time: 0.10, dur: 0.22, type: 'triangle' }, // E5
      { freq: 783.99, time: 0.20, dur: 0.25, type: 'triangle' }, // G5
      { freq: 1046.50, time: 0.32, dur: 0.70, type: 'sine' },    // High C6
      { freq: 1318.51, time: 0.44, dur: 0.85, type: 'sine' }     // High E6 sparkle
    ];

    melody.forEach(note => {
      try {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = note.type || 'triangle';
        osc.frequency.setValueAtTime(note.freq, now + note.time);

        const startTime = now + note.time;
        const endTime = startTime + note.dur;

        gain.gain.setValueAtTime(0.001, startTime);
        gain.gain.linearRampToValueAtTime(0.24, startTime + 0.03);
        gain.gain.exponentialRampToValueAtTime(0.001, endTime);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(startTime);
        osc.stop(endTime);
      } catch {}
    });
  }

  playRomanticChime() {
    this.playCelebrationFanfare();
  }
}

window.gachaAudio = new GachaAudio();
