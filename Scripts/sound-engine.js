/* ==========================================================================
   Web Audio API 音效合成引擎（共用模組）
   ========================================================================== */
const SoundEngine = {
    ctx: null,
    enabled: true,

    init() {
        if (!this.ctx) {
            const AudioCtx = window.AudioContext || window.webkitAudioContext;
            if (!AudioCtx) return;
            this.ctx = new AudioCtx();
        }
        if (this.ctx && this.ctx.state === 'suspended') {
            this.ctx.resume();
        }
    },

    playTone(freq, type, duration, delay = 0, volume = 0.22) {
        if (!this.enabled) return;
        this.init();
        if (!this.ctx) return;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = type;
        osc.frequency.setValueAtTime(freq, this.ctx.currentTime + delay);

        gain.gain.setValueAtTime(volume, this.ctx.currentTime + delay);
        gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + delay + duration);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(this.ctx.currentTime + delay);
        osc.stop(this.ctx.currentTime + delay + duration);
    },

    click() {
        this.playTone(620, 'sine', 0.07, 0, 0.14);
    },

    hit() {
        this.playTone(420, 'triangle', 0.08, 0, 0.24);
        this.playTone(760, 'triangle', 0.12, 0.05, 0.22);
    },

    correct(combo = 1) {
        const base = 523.25 * Math.pow(1.05, Math.min(combo - 1, 5));
        this.playTone(base, 'triangle', 0.13, 0, 0.25);
        this.playTone(base * 1.25, 'triangle', 0.13, 0.09, 0.25);
        this.playTone(base * 1.5, 'triangle', 0.26, 0.18, 0.28);
    },

    wrong() {
        this.playTone(230, 'sawtooth', 0.18, 0, 0.16);
        this.playTone(180, 'sawtooth', 0.3, 0.14, 0.16);
    },

    victory() {
        const notes = [523.25, 659.25, 783.99, 1046.50];
        notes.forEach((n, idx) => {
            this.playTone(n, 'triangle', 0.24, idx * 0.11, 0.26);
        });
    }
};

function toggleSound() {
    SoundEngine.enabled = !SoundEngine.enabled;
    const icon = document.getElementById('sound-icon');
    const btn = document.getElementById('sound-toggle');
    if (!btn || !icon) return;
    const activeBg = btn.dataset.activeBg || (btn.classList.contains('bg-teal-500') ? 'bg-teal-500' : 'bg-emerald-500');
    btn.dataset.activeBg = activeBg;
    if (SoundEngine.enabled) {
        icon.textContent = '🔊';
        btn.classList.replace('bg-slate-400', activeBg);
        SoundEngine.click();
    } else {
        icon.textContent = '🔇';
        btn.classList.replace(activeBg, 'bg-slate-400');
    }
}
