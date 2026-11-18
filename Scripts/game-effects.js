/* ==========================================================================
   過關彩帶、煙火、分數滾動與錯題怪獸 Boss 特效引擎（共用模組）
   ========================================================================== */
let scoreRollAnimId = null;

function animateScoreTo(targetScore, elementId = 'total-score') {
    const el = document.getElementById(elementId) || document.getElementById('demo-score');
    if (!el) return;
    const startVal = parseInt(el.textContent, 10) || 0;
    if (startVal === targetScore || typeof requestAnimationFrame !== 'function' || typeof performance === 'undefined') {
        el.textContent = targetScore;
        return;
    }
    const startTime = performance.now();
    const duration = 420;
    if (scoreRollAnimId && typeof cancelAnimationFrame === 'function') {
        cancelAnimationFrame(scoreRollAnimId);
    }
    const step = (now) => {
        const progress = Math.min(1, (now - startTime) / duration);
        const eased = 1 - Math.pow(1 - progress, 3);
        el.textContent = Math.round(startVal + (targetScore - startVal) * eased);
        if (progress < 1) {
            scoreRollAnimId = requestAnimationFrame(step);
        }
    };
    scoreRollAnimId = requestAnimationFrame(step);
}

function spawnFloatingText(x, y, text, colorClass = 'text-emerald-600') {
    if (!document.body || typeof document.createElement !== 'function') return;
    const el = document.createElement('div');
    el.className = `float-popup font-black text-xl sm:text-2xl drop-shadow-sm ${colorClass}`;
    el.style.left = `${x}px`;
    el.style.top = `${y}px`;
    el.textContent = text;
    document.body.appendChild(el);
    setTimeout(() => { if (el.remove) el.remove(); }, 920);
}

const ConfettiEngine = {
    canvas: null,
    ctx: null,
    particles: [],
    rafId: null,
    lastTime: 0,
    dpr: 1,

    init() {
        this.canvas = document.getElementById('confetti-canvas');
        if (!this.canvas || !this.canvas.getContext) return;
        this.ctx = this.canvas.getContext('2d');
        this.resize();
        window.addEventListener('resize', () => this.resize());
    },

    resize() {
        if (!this.canvas || !this.ctx) return;
        this.dpr = window.devicePixelRatio || 1;
        const w = window.innerWidth || 800;
        const h = window.innerHeight || 600;
        this.canvas.width = Math.round(w * this.dpr);
        this.canvas.height = Math.round(h * this.dpr);
        this.ctx.setTransform(this.dpr, 0, 0, this.dpr, 0, 0);
    },

    spawnBurst({ x, y, count = 60, angleMin = -Math.PI, angleMax = 0, speedMin = 240, speedMax = 720, gravity = 820 }) {
        if (!this.ctx) return;
        const colors = ['#f43f5e', '#f59e0b', '#10b981', '#0ea5e9', '#8b5cf6', '#ec4899', '#facc15'];
        const shapes = ['ribbon', 'ribbon', 'circle', 'star'];

        for (let i = 0; i < count; i++) {
            const angle = angleMin + Math.random() * (angleMax - angleMin);
            const speed = speedMin + Math.random() * (speedMax - speedMin);
            this.particles.push({
                x, y,
                vx: Math.cos(angle) * speed,
                vy: Math.sin(angle) * speed,
                gravity,
                drag: 0.985,
                color: colors[Math.floor(Math.random() * colors.length)],
                shape: shapes[Math.floor(Math.random() * shapes.length)],
                size: 6 + Math.random() * 7,
                rotation: Math.random() * Math.PI * 2,
                rotSpeed: (Math.random() - 0.5) * 10,
                wobble: Math.random() * Math.PI * 2,
                wobbleSpeed: 4 + Math.random() * 5,
                life: 0,
                maxLife: 2.1 + Math.random() * 1.1
            });
        }

        if (!this.rafId && typeof requestAnimationFrame === 'function') {
            this.lastTime = typeof performance !== 'undefined' ? performance.now() : Date.now();
            this.rafId = requestAnimationFrame((t) => this.loop(t));
        }
    },

    fireCannons() {
        const w = window.innerWidth || 800;
        const h = window.innerHeight || 600;
        this.spawnBurst({ x: 24, y: h * 0.72, count: 60, angleMin: -Math.PI * 0.44, angleMax: -Math.PI * 0.16, speedMin: 460, speedMax: 980 });
        this.spawnBurst({ x: w - 24, y: h * 0.72, count: 60, angleMin: -Math.PI * 0.84, angleMax: -Math.PI * 0.56, speedMin: 460, speedMax: 980 });
    },

    fireFireworks() {
        const w = window.innerWidth || 800;
        const h = window.innerHeight || 600;
        const spots = [
            { x: w * 0.25, y: h * 0.35, delay: 0 },
            { x: w * 0.75, y: h * 0.32, delay: 180 },
            { x: w * 0.5, y: h * 0.26, delay: 360 },
            { x: w * 0.35, y: h * 0.45, delay: 560 },
            { x: w * 0.68, y: h * 0.42, delay: 740 }
        ];
        spots.forEach(s => {
            setTimeout(() => {
                this.spawnBurst({ x: s.x, y: s.y, count: 55, angleMin: 0, angleMax: Math.PI * 2, speedMin: 140, speedMax: 480, gravity: 420 });
            }, s.delay);
        });
    },

    drawStar(ctx, cx, cy, outerR, innerR, points = 5) {
        ctx.beginPath();
        for (let i = 0; i < points * 2; i++) {
            const r = i % 2 === 0 ? outerR : innerR;
            const a = (i * Math.PI) / points - Math.PI / 2;
            const px = cx + Math.cos(a) * r;
            const py = cy + Math.sin(a) * r;
            if (i === 0) ctx.moveTo(px, py);
            else ctx.lineTo(px, py);
        }
        ctx.closePath();
        ctx.fill();
    },

    loop(now) {
        const dt = Math.min(0.035, (now - this.lastTime) / 1000);
        this.lastTime = now;
        const w = window.innerWidth || 800;
        const h = window.innerHeight || 600;
        this.ctx.clearRect(0, 0, w, h);

        for (let i = this.particles.length - 1; i >= 0; i--) {
            const p = this.particles[i];
            p.life += dt;
            if (p.life >= p.maxLife || p.y > h + 40) {
                this.particles.splice(i, 1);
                continue;
            }
            p.vx *= p.drag;
            p.vy = p.vy * p.drag + p.gravity * dt;
            p.x += p.vx * dt;
            p.y += p.vy * dt;
            p.rotation += p.rotSpeed * dt;
            p.wobble += p.wobbleSpeed * dt;

            const alpha = p.life > p.maxLife * 0.72
                ? Math.max(0, 1 - (p.life - p.maxLife * 0.72) / (p.maxLife * 0.28))
                : 1;

            this.ctx.save();
            this.ctx.globalAlpha = alpha;
            this.ctx.translate(p.x, p.y);
            this.ctx.rotate(p.rotation);
            this.ctx.fillStyle = p.color;

            if (p.shape === 'ribbon') {
                const flipScale = Math.cos(p.wobble);
                this.ctx.scale(1, Math.abs(flipScale) < 0.15 ? 0.15 : flipScale);
                this.ctx.fillRect(-p.size * 0.65, -p.size * 0.35, p.size * 1.3, p.size * 0.7);
            } else if (p.shape === 'star') {
                this.drawStar(this.ctx, 0, 0, p.size * 0.65, p.size * 0.3, 5);
            } else {
                this.ctx.beginPath();
                this.ctx.arc(0, 0, p.size * 0.38, 0, Math.PI * 2);
                this.ctx.fill();
            }
            this.ctx.restore();
        }

        if (this.particles.length > 0) {
            this.rafId = requestAnimationFrame((t) => this.loop(t));
        } else {
            this.rafId = null;
        }
    }
};

const MonsterBoss = {
    getSVG(hp, maxHp) {
        const ratio = maxHp > 0 ? hp / maxHp : 0;
        if (hp <= 0) {
            return `
                <svg viewBox="0 0 160 160" class="w-full h-full">
                    <circle cx="80" cy="85" r="52" fill="#e2e8f0" stroke="#94a3b8" stroke-width="4" stroke-dasharray="6,4"/>
                    <text x="58" y="82" font-size="22" font-weight="900" fill="#64748b">✕</text>
                    <text x="92" y="82" font-size="22" font-weight="900" fill="#64748b">✕</text>
                    <path d="M 62,108 Q 80,98 98,108" fill="none" stroke="#64748b" stroke-width="4" stroke-linecap="round"/>
                    <text x="36" y="34" font-size="22">💫</text>
                    <text x="108" y="34" font-size="22">⭐</text>
                </svg>
            `;
        }
        const bodyColor = ratio <= 0.4 ? '#fb7185' : '#a855f7';
        const strokeColor = ratio <= 0.4 ? '#be123c' : '#6b21a8';
        const eyeExpr = ratio <= 0.4
            ? `
                <circle cx="62" cy="76" r="10" fill="#ffffff" stroke="${strokeColor}" stroke-width="2.5"/>
                <circle cx="98" cy="76" r="10" fill="#ffffff" stroke="${strokeColor}" stroke-width="2.5"/>
                <line x1="56" y1="71" x2="68" y2="81" stroke="#1e293b" stroke-width="3" stroke-linecap="round"/>
                <line x1="68" y1="71" x2="56" y2="81" stroke="#1e293b" stroke-width="3" stroke-linecap="round"/>
                <circle cx="98" cy="76" r="4" fill="#1e293b"/>
                <path d="M 62,108 Q 80,96 98,108" fill="none" stroke="#ffffff" stroke-width="4" stroke-linecap="round"/>
                <text x="120" y="54" font-size="20">💦</text>
            `
            : `
                <path d="M 48,64 L 70,70" stroke="#4c1d95" stroke-width="4" stroke-linecap="round"/>
                <path d="M 112,64 L 90,70" stroke="#4c1d95" stroke-width="4" stroke-linecap="round"/>
                <circle cx="62" cy="78" r="9" fill="#ffffff"/>
                <circle cx="98" cy="78" r="9" fill="#ffffff"/>
                <circle cx="63" cy="78" r="4.5" fill="#1e293b"/>
                <circle cx="99" cy="78" r="4.5" fill="#1e293b"/>
                <path d="M 60,104 Q 80,118 100,104" fill="none" stroke="#ffffff" stroke-width="4" stroke-linecap="round"/>
                <polygon points="68,107 73,115 78,108" fill="#ffffff"/>
                <polygon points="84,108 89,115 94,107" fill="#ffffff"/>
            `;
        return `
            <svg viewBox="0 0 160 160" class="w-full h-full drop-shadow-md">
                <polygon points="44,48 32,20 62,38" fill="#fbbf24" stroke="${strokeColor}" stroke-width="3" stroke-linejoin="round"/>
                <polygon points="116,48 128,20 98,38" fill="#fbbf24" stroke="${strokeColor}" stroke-width="3" stroke-linejoin="round"/>
                <rect x="28" y="36" width="104" height="96" rx="44" fill="${bodyColor}" stroke="${strokeColor}" stroke-width="4"/>
                <ellipse cx="80" cy="116" rx="26" ry="12" fill="#f3e8ff" opacity="0.35"/>
                ${eyeExpr}
            </svg>
        `;
    },

    renderUI(session = (typeof currentSession !== 'undefined' ? currentSession : null)) {
        const panel = document.getElementById('mistake-boss-panel');
        if (!panel) return;
        if (!session || !session.isMistakeBattle) {
            panel.classList.add('hidden');
            return;
        }
        panel.classList.remove('hidden');

        const maxHp = Math.max(1, session.bossMaxHp || 1);
        const hp = Math.max(0, session.bossHp || 0);
        const pct = Math.max(0, Math.round((hp / maxHp) * 100));

        document.getElementById('hp-text').textContent = `HP ${hp} / ${maxHp}`;
        document.getElementById('hp-trail-bar').style.width = `${pct}%`;

        const mainBar = document.getElementById('hp-main-bar');
        mainBar.style.width = `${pct}%`;
        if (pct <= 25) {
            mainBar.className = 'absolute inset-y-0 left-0 bg-gradient-to-r from-red-600 to-rose-500 transition-all duration-200 ease-out';
        } else if (pct <= 55) {
            mainBar.className = 'absolute inset-y-0 left-0 bg-gradient-to-r from-amber-500 to-orange-500 transition-all duration-200 ease-out';
        } else {
            mainBar.className = 'absolute inset-y-0 left-0 bg-gradient-to-r from-rose-500 to-pink-500 transition-all duration-200 ease-out';
        }

        const segEl = document.getElementById('hp-segments');
        segEl.style.gridTemplateColumns = `repeat(${maxHp}, minmax(0, 1fr))`;
        segEl.innerHTML = Array.from({ length: maxHp }, (_, i) =>
            `<div class="${i < maxHp - 1 ? 'border-r border-white/50' : ''} h-full"></div>`
        ).join('');

        document.getElementById('monster-svg-wrap').innerHTML = this.getSVG(hp, maxHp);

        const moodEl = document.getElementById('monster-mood');
        if (hp <= 0) {
            moodEl.textContent = '💥 錯題怪獸已被徹底消滅！';
            moodEl.className = 'text-xs sm:text-sm font-black bg-emerald-100 text-emerald-800 px-2.5 py-0.5 rounded-full';
        } else if (hp <= Math.ceil(maxHp * 0.4)) {
            moodEl.textContent = `😰 錯題怪獸快撐不住了！還剩 ${hp} 題！`;
            moodEl.className = 'text-xs sm:text-sm font-black bg-amber-100 text-amber-800 px-2.5 py-0.5 rounded-full';
        } else {
            moodEl.textContent = `😈 錯題魔王：還有 ${hp} 題等你挑戰！`;
            moodEl.className = 'text-xs sm:text-sm font-black bg-purple-100 text-purple-800 px-2.5 py-0.5 rounded-full';
        }
    },

    triggerHit() {
        const wrap = document.getElementById('monster-svg-wrap');
        const overlay = document.getElementById('slash-overlay');
        const p1 = document.getElementById('slash-path-1');
        const p2 = document.getElementById('slash-path-2');
        if (wrap) {
            wrap.classList.remove('animate-hit', 'animate-lunge');
            void wrap.offsetWidth;
            wrap.classList.add('animate-hit');
        }
        if (overlay && p1 && p2) {
            overlay.classList.remove('hidden');
            p1.classList.remove('animate-slash');
            p2.classList.remove('animate-slash');
            void overlay.offsetWidth;
            p1.classList.add('animate-slash');
            p2.classList.add('animate-slash');
            setTimeout(() => overlay.classList.add('hidden'), 400);
        }
        const stage = document.getElementById('monster-stage');
        if (stage && stage.getBoundingClientRect) {
            const rect = stage.getBoundingClientRect();
            spawnFloatingText(rect.left + rect.width / 2, rect.top + 16, '-1 HP 💥', 'text-rose-600');
        }
    },

    triggerCounter() {
        const wrap = document.getElementById('monster-svg-wrap');
        const panel = document.getElementById('mistake-boss-panel') || document.getElementById('monster-card');
        if (wrap) {
            wrap.classList.remove('animate-lunge', 'animate-hit');
            void wrap.offsetWidth;
            wrap.classList.add('animate-lunge');
        }
        if (panel) {
            panel.classList.remove('animate-shake');
            void panel.offsetWidth;
            panel.classList.add('animate-shake');
        }
        const stage = document.getElementById('monster-stage');
        if (stage && stage.getBoundingClientRect) {
            const rect = stage.getBoundingClientRect();
            spawnFloatingText(rect.left + rect.width / 2, rect.top + 16, 'MISS! 😈', 'text-purple-700');
        }
    }
};

function getMonsterSVG(hp, maxHp) {
    return MonsterBoss.getSVG(hp, maxHp);
}
