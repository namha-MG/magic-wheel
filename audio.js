/**
 * audio.js - Premium Web Audio API Sound Synthesizer
 * Authentic CS:GO / Casino Wheel Mechanical Ratchet Clicks,
 * Power Turbine Whoosh, Suspense Heartbeats, Hextech Lock-In Chimes & Orchestral Fanfare.
 */

class GachaAudio {
  constructor() {
    this.ctx = null;
    this.masterGain = null;
    this.compressor = null;
    this.noiseBuffer = null;
    this.enabled = true;
    this.lastTickTime = 0;

    // Load saved sound preference
    const saved = localStorage.getItem('gacha_sound_enabled');
    if (saved !== null) {
      this.enabled = saved === 'true';
    }
  }

  init() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (!AudioCtx) return;
      this.ctx = new AudioCtx();

      // Master Compressor to prevent any clipping and make sound punchy & warm
      this.compressor = this.ctx.createDynamicsCompressor();
      this.compressor.threshold.setValueAtTime(-18, this.ctx.currentTime);
      this.compressor.knee.setValueAtTime(12, this.ctx.currentTime);
      this.compressor.ratio.setValueAtTime(5, this.ctx.currentTime);
      this.compressor.attack.setValueAtTime(0.003, this.ctx.currentTime);
      this.compressor.release.setValueAtTime(0.12, this.ctx.currentTime);

      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.setValueAtTime(0.85, this.ctx.currentTime);

      this.masterGain.connect(this.compressor);
      this.compressor.connect(this.ctx.destination);

      // Pre-generate 1 second of white noise for crisp mechanical clicks & whooshes
      const bufferSize = this.ctx.sampleRate;
      this.noiseBuffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
      const data = this.noiseBuffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        data[i] = Math.random() * 2 - 1;
      }
    }

    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  toggleSound(enable) {
    this.enabled = enable !== undefined ? enable : !this.enabled;
    localStorage.setItem('gacha_sound_enabled', String(this.enabled));
    return this.enabled;
  }

  /**
   * Tactile Arcade Push Button Click
   */
  playBtnClick() {
    if (!this.enabled) return;
    this.init();
    if (!this.ctx) return;

    try {
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(260, now);
      osc.frequency.exponentialRampToValueAtTime(80, now + 0.05);

      gain.gain.setValueAtTime(0.25, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.05);

      osc.connect(gain);
      gain.connect(this.masterGain);

      osc.start(now);
      osc.stop(now + 0.055);
    } catch {}
  }

  /**
   * Authentic Mechanical Roulette / CS:GO Wheel Ratchet Click
   * Layered:
   *  1. Crisp high-frequency plastic/metal flapper transient (Noise filter)
   *  2. Resonant wooden/acrylic body thump (Bandpass resonant tone)
   *  3. Sub-tactile punch
   *  4. Stereo panned (Male Left, Female Right)
   */
  playCsgoTick(pitch = 1, options = {}) {
    if (!this.enabled) return;
    this.init();
    if (!this.ctx) return;

    const {
      gender = 'male',
      velocity = 0.5 // 0.0 (crawl) to 1.0 (high speed)
    } = options;

    const now = this.ctx.currentTime;
    // Adapt click throttle to avoid mud during high-speed spin
    const minInterval = velocity > 0.6 ? 0.028 : 0.018;
    if (now - this.lastTickTime < minInterval) return;
    this.lastTickTime = now;

    try {
      // 3D Stereo Panner Node: Male on left, Female on right
      let dest = this.masterGain;
      if (this.ctx.createStereoPanner) {
        const panner = this.ctx.createStereoPanner();
        panner.pan.setValueAtTime(gender === 'male' ? -0.32 : 0.32, now);
        panner.connect(this.masterGain);
        dest = panner;
      }

      // Layer 1: Crisp Snap / Flapper Crack (Filtered noise burst)
      if (this.noiseBuffer) {
        const noiseSource = this.ctx.createBufferSource();
        noiseSource.buffer = this.noiseBuffer;

        const noiseFilter = this.ctx.createBiquadFilter();
        noiseFilter.type = 'bandpass';
        // Pitch variation per track
        const centerFreq = (gender === 'male' ? 3200 : 3800) * (0.96 + Math.random() * 0.08);
        noiseFilter.frequency.setValueAtTime(centerFreq, now);
        noiseFilter.Q.setValueAtTime(3.5, now);

        const noiseGain = this.ctx.createGain();
        const snapVol = 0.18 + velocity * 0.14;
        noiseGain.gain.setValueAtTime(snapVol, now);
        noiseGain.gain.exponentialRampToValueAtTime(0.001, now + 0.022);

        noiseSource.connect(noiseFilter);
        noiseFilter.connect(noiseGain);
        noiseGain.connect(dest);

        noiseSource.start(now);
        noiseSource.stop(now + 0.025);
      }

      // Layer 2: Resonant Body Thump (Solid acrylic/wood ratchet peg)
      const osc = this.ctx.createOscillator();
      const oscGain = this.ctx.createGain();

      osc.type = 'triangle';
      const baseFreq = (gender === 'male' ? 580 : 720) * pitch * (0.98 + Math.random() * 0.04);
      osc.frequency.setValueAtTime(baseFreq, now);
      osc.frequency.exponentialRampToValueAtTime(baseFreq * 0.28, now + 0.038);

      const bodyVol = 0.22 + (1 - velocity) * 0.12; // louder tactile body at slow crawl
      oscGain.gain.setValueAtTime(bodyVol, now);
      oscGain.gain.exponentialRampToValueAtTime(0.001, now + 0.04);

      osc.connect(oscGain);
      oscGain.connect(dest);

      osc.start(now);
      osc.stop(now + 0.042);

      // Layer 3: Flapper Rebound Micro-Click at Slow Crawl (Creates hyper-realistic physical wheel feel)
      if (velocity < 0.25) {
        const reboundTime = now + 0.016;
        const reboundOsc = this.ctx.createOscillator();
        const reboundGain = this.ctx.createGain();

        reboundOsc.type = 'triangle';
        reboundOsc.frequency.setValueAtTime(baseFreq * 1.35, reboundTime);
        reboundOsc.frequency.exponentialRampToValueAtTime(baseFreq * 0.4, reboundTime + 0.02);

        reboundGain.gain.setValueAtTime(0.08, reboundTime);
        reboundGain.gain.exponentialRampToValueAtTime(0.001, reboundTime + 0.022);

        reboundOsc.connect(reboundGain);
        reboundGain.connect(dest);

        reboundOsc.start(reboundTime);
        reboundOsc.stop(reboundTime + 0.024);
      }
    } catch {}
  }

  /**
   * Powerful Cinematic Riser & Turbine Launch Whoosh
   */
  playWhoosh() {
    if (!this.enabled) return;
    this.init();
    if (!this.ctx) return;

    try {
      const now = this.ctx.currentTime;

      // Sub-bass launch drop (Weight & Power)
      const subOsc = this.ctx.createOscillator();
      const subGain = this.ctx.createGain();
      subOsc.type = 'sine';
      subOsc.frequency.setValueAtTime(110, now);
      subOsc.frequency.exponentialRampToValueAtTime(36, now + 0.45);

      subGain.gain.setValueAtTime(0.35, now);
      subGain.gain.exponentialRampToValueAtTime(0.001, now + 0.5);

      subOsc.connect(subGain);
      subGain.connect(this.masterGain);

      subOsc.start(now);
      subOsc.stop(now + 0.52);

      // Rising Wind Turbine Sweep
      if (this.noiseBuffer) {
        const noise = this.ctx.createBufferSource();
        noise.buffer = this.noiseBuffer;

        const filter = this.ctx.createBiquadFilter();
        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(180, now);
        filter.frequency.exponentialRampToValueAtTime(2200, now + 0.35);
        filter.frequency.exponentialRampToValueAtTime(450, now + 0.85);

        const noiseGain = this.ctx.createGain();
        noiseGain.gain.setValueAtTime(0.01, now);
        noiseGain.gain.linearRampToValueAtTime(0.28, now + 0.25);
        noiseGain.gain.exponentialRampToValueAtTime(0.001, now + 0.9);

        noise.connect(filter);
        filter.connect(noiseGain);
        noiseGain.connect(this.masterGain);

        noise.start(now);
        noise.stop(now + 0.95);
      }

      // Energy laser zap
      const zapOsc = this.ctx.createOscillator();
      const zapGain = this.ctx.createGain();
      zapOsc.type = 'sawtooth';
      zapOsc.frequency.setValueAtTime(220, now);
      zapOsc.frequency.exponentialRampToValueAtTime(1400, now + 0.3);

      zapGain.gain.setValueAtTime(0.08, now);
      zapGain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);

      zapOsc.connect(zapGain);
      zapGain.connect(this.masterGain);

      zapOsc.start(now);
      zapOsc.stop(now + 0.38);
    } catch {}
  }

  /**
   * Suspense Heartbeat Thump as Wheel Crawls into the Final Cards
   */
  playTensionHeartbeat() {
    if (!this.enabled) return;
    this.init();
    if (!this.ctx) return;

    try {
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(65, now);
      osc.frequency.exponentialRampToValueAtTime(32, now + 0.12);

      gain.gain.setValueAtTime(0.28, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.14);

      osc.connect(gain);
      gain.connect(this.masterGain);

      osc.start(now);
      osc.stop(now + 0.15);
    } catch {}
  }

  /**
   * Euphoric "Jackpot Ding / Hextech Lock-In" when Winner Locks Under Needle
   */
  playLockInSound(gender = 'male') {
    if (!this.enabled) return;
    this.init();
    if (!this.ctx) return;

    try {
      const now = this.ctx.currentTime;
      const panVal = gender === 'male' ? -0.28 : 0.28;

      let dest = this.masterGain;
      if (this.ctx.createStereoPanner) {
        const panner = this.ctx.createStereoPanner();
        panner.pan.setValueAtTime(panVal, now);
        panner.connect(this.masterGain);
        dest = panner;
      }

      // Crystal Bell Harmonics (E6, B6, E7)
      const freqs = gender === 'male' 
        ? [1318.51, 1975.53, 2637.02] // E6, B6, E7
        : [1567.98, 2093.00, 3135.96]; // G6, C7, G7

      freqs.forEach((freq, idx) => {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = idx === 0 ? 'sine' : 'triangle';
        osc.frequency.setValueAtTime(freq, now);

        gain.gain.setValueAtTime(0.18 / (idx + 1), now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.8 + idx * 0.15);

        osc.connect(gain);
        gain.connect(dest);

        osc.start(now);
        osc.stop(now + 1.0);
      });

      // Warm Golden Chord Shimmer in background
      const chord = gender === 'male' ? [329.63, 493.88, 659.25] : [392.00, 523.25, 659.25];
      chord.forEach(f => {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(f, now);

        gain.gain.setValueAtTime(0.12, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.65);

        osc.connect(gain);
        gain.connect(dest);

        osc.start(now);
        osc.stop(now + 0.7);
      });
    } catch {}
  }

  /**
   * Glorious Polyphonic Orchestral Fanfare & Sparkle Cascade (Mừng Ghép Đôi)
   */
  playCelebrationFanfare() {
    if (!this.enabled) return;
    this.init();
    if (!this.ctx) return;

    try {
      const now = this.ctx.currentTime;

      // 1. Confetti Poppers (Dual Noise Thump)
      [0.0, 0.18].forEach(offset => {
        const popTime = now + offset;
        const popOsc = this.ctx.createOscillator();
        const popGain = this.ctx.createGain();
        popOsc.type = 'triangle';
        popOsc.frequency.setValueAtTime(140, popTime);
        popOsc.frequency.exponentialRampToValueAtTime(45, popTime + 0.08);

        popGain.gain.setValueAtTime(0.3, popTime);
        popGain.gain.exponentialRampToValueAtTime(0.001, popTime + 0.1);

        popOsc.connect(popGain);
        popGain.connect(this.masterGain);

        popOsc.start(popTime);
        popOsc.stop(popTime + 0.11);
      });

      // 2. Sparkling Harp Glissando (Fast ascending sparkle arpeggio)
      const arpeggio = [523.25, 659.25, 783.99, 1046.50, 1318.51, 1567.98, 2093.00]; // C5 to C7
      arpeggio.forEach((freq, idx) => {
        const noteTime = now + idx * 0.055;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, noteTime);

        gain.gain.setValueAtTime(0.12, noteTime);
        gain.gain.exponentialRampToValueAtTime(0.001, noteTime + 0.35);

        osc.connect(gain);
        gain.connect(this.masterGain);

        osc.start(noteTime);
        osc.stop(noteTime + 0.38);
      });

      // 3. Triumphant Warm Brass Fanfare Chord Stabs
      // Chord 1 (0.35s): C Major (C4, E4, G4, C5)
      // Chord 2 (0.65s): F Major (F4, A4, C5, F5)
      // Chord 3 (1.00s): G Major to C Major resolve (G4, B4, D5, G5 -> C5, E5, G5, C6)
      const fanfareStabs = [
        { time: 0.38, dur: 0.25, notes: [261.63, 329.63, 392.00, 523.25] },
        { time: 0.68, dur: 0.28, notes: [349.23, 440.00, 523.25, 698.46] },
        { time: 1.02, dur: 1.20, notes: [523.25, 659.25, 783.99, 1046.50, 1318.51] }
      ];

      fanfareStabs.forEach(stab => {
        const startTime = now + stab.time;
        stab.notes.forEach(f => {
          const osc = this.ctx.createOscillator();
          const gain = this.ctx.createGain();

          osc.type = 'triangle';
          osc.frequency.setValueAtTime(f, startTime);

          gain.gain.setValueAtTime(0.001, startTime);
          gain.gain.linearRampToValueAtTime(0.16, startTime + 0.025);
          gain.gain.exponentialRampToValueAtTime(0.001, startTime + stab.dur);

          osc.connect(gain);
          gain.connect(this.masterGain);

          osc.start(startTime);
          osc.stop(startTime + stab.dur + 0.05);
        });
      });
    } catch {}
  }

  playRomanticChime() {
    this.playCelebrationFanfare();
  }
}

window.gachaAudio = new GachaAudio();
