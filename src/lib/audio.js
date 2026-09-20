class UIAudioManager {
  constructor() {
    this.audioCtx = null;
    this.enabled = localStorage.getItem('portfolio-sound') !== 'false';
    
    // Listen for changes from ThemeCustomizer
    window.addEventListener('sound-preference-changed', (e) => {
      this.enabled = e['detail']?.enabled;
    });
  }

  initContext() {
    if (!this.audioCtx) {
      this.audioCtx = new (window.AudioContext || window['webkitAudioContext'])();
    }
    if (this.audioCtx.state === 'suspended') {
      this.audioCtx.resume();
    }
  }

  playHover() {
    if (!this.enabled) return;
    try {
      this.initContext();
      const t = this.audioCtx.currentTime;
      const osc = this.audioCtx.createOscillator();
      const gain = this.audioCtx.createGain();
      
      osc.type = 'sine';
      // Pitch drop for a "pop" sound
      osc.frequency.setValueAtTime(600, t);
      osc.frequency.exponentialRampToValueAtTime(100, t + 0.1);
      
      gain.gain.setValueAtTime(0, t);
      gain.gain.linearRampToValueAtTime(0.05, t + 0.01);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.1);
      
      osc.connect(gain);
      gain.connect(this.audioCtx.destination);
      
      osc.start(t);
      osc.stop(t + 0.1);
    } catch (e) {}
  }

  playClick() {
    if (!this.enabled) return;
    try {
      this.initContext();
      const t = this.audioCtx.currentTime;
      const osc = this.audioCtx.createOscillator();
      const gain = this.audioCtx.createGain();
      
      osc.type = 'square';
      // High pitch sharp click
      osc.frequency.setValueAtTime(800, t);
      osc.frequency.exponentialRampToValueAtTime(200, t + 0.05);
      
      gain.gain.setValueAtTime(0, t);
      gain.gain.linearRampToValueAtTime(0.03, t + 0.005);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.05);
      
      // Filter out harsh highs
      const filter = this.audioCtx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.value = 2000;
      
      osc.connect(filter);
      filter.connect(gain);
      gain.connect(this.audioCtx.destination);
      
      osc.start(t);
      osc.stop(t + 0.05);
    } catch (e) {}
  }

  playTyping() {
    if (!this.enabled) return;
    try {
      this.initContext();
      const t = this.audioCtx.currentTime;
      
      // We use a very short, low-pitch triangle combined with noise to simulate mechanical keyboard
      const osc = this.audioCtx.createOscillator();
      const gain = this.audioCtx.createGain();
      
      osc.type = 'triangle';
      const baseFreq = 200 + Math.random() * 50;
      osc.frequency.setValueAtTime(baseFreq, t);
      
      gain.gain.setValueAtTime(0, t);
      gain.gain.linearRampToValueAtTime(0.04, t + 0.01);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.06);
      
      osc.connect(gain);
      gain.connect(this.audioCtx.destination);
      
      osc.start(t);
      osc.stop(t + 0.06);
    } catch (e) {}
  }
}

export const uiAudio = new UIAudioManager();
