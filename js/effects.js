// ========================================
// Particle Effects & Canvas Animations
// ========================================

class EffectsManager {
    constructor() {
        this.canvas = document.getElementById('effects-canvas');
        this.ctx = this.canvas.getContext('2d');
        this.particles = [];
        this.animations = [];
        this.isRunning = false;
        
        this.resize();
        window.addEventListener('resize', () => this.resize());
    }
    
    resize() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    }
    
    // Create sparkle effect
    createSparkle(x, y, count = 10, color = '#FFD700') {
        for (let i = 0; i < count; i++) {
            this.particles.push({
                x: x,
                y: y,
                vx: (Math.random() - 0.5) * 4,
                vy: (Math.random() - 0.5) * 4 - 2,
                size: Math.random() * 4 + 2,
                color: color,
                life: 1,
                decay: 0.02 + Math.random() * 0.02,
                type: 'sparkle'
            });
        }
        
        if (!this.isRunning) {
            this.start();
        }
    }
    
    // Create magic trail effect
    createMagicTrail(x, y, color = '#7C3AED') {
        this.particles.push({
            x: x,
            y: y,
            vx: (Math.random() - 0.5) * 2,
            vy: (Math.random() - 0.5) * 2,
            size: Math.random() * 3 + 1,
            color: color,
            life: 1,
            decay: 0.03,
            type: 'trail'
        });
        
        if (!this.isRunning) {
            this.start();
        }
    }
    
    // Create burst explosion
    createBurst(x, y, count = 20, colors = ['#FFD700', '#EC4899', '#7C3AED', '#60A5FA']) {
        for (let i = 0; i < count; i++) {
            const angle = (Math.PI * 2 * i) / count;
            const speed = Math.random() * 6 + 3;
            
            this.particles.push({
                x: x,
                y: y,
                vx: Math.cos(angle) * speed,
                vy: Math.sin(angle) * speed,
                size: Math.random() * 6 + 3,
                color: colors[Math.floor(Math.random() * colors.length)],
                life: 1,
                decay: 0.015 + Math.random() * 0.015,
                type: 'burst'
            });
        }
        
        if (!this.isRunning) {
            this.start();
        }
    }
    
    // Create floating orbs
    createFloatingOrbs(count = 5, area = { x: 0, y: 0, w: window.innerWidth, h: window.innerHeight }) {
        const colors = ['#FFD700', '#EC4899', '#7C3AED', '#60A5FA', '#34D399'];
        
        for (let i = 0; i < count; i++) {
            this.particles.push({
                x: area.x + Math.random() * area.w,
                y: area.y + Math.random() * area.h,
                vx: (Math.random() - 0.5) * 0.5,
                vy: (Math.random() - 0.5) * 0.5,
                size: Math.random() * 8 + 4,
                color: colors[Math.floor(Math.random() * colors.length)],
                life: 1,
                decay: 0.001,
                type: 'orb',
                floatOffset: Math.random() * Math.PI * 2,
                floatSpeed: 0.02 + Math.random() * 0.02
            });
        }
        
        if (!this.isRunning) {
            this.start();
        }
    }
    
    // Create rain effect
    createRain(count = 50) {
        for (let i = 0; i < count; i++) {
            this.particles.push({
                x: Math.random() * this.canvas.width,
                y: Math.random() * this.canvas.height - this.canvas.height,
                vx: 0,
                vy: Math.random() * 5 + 5,
                size: Math.random() * 2 + 1,
                color: 'rgba(96, 165, 250, 0.6)',
                life: 1,
                decay: 0.005,
                type: 'rain',
                length: Math.random() * 20 + 10
            });
        }
        
        if (!this.isRunning) {
            this.start();
        }
    }
    
    // Create snow effect
    createSnow(count = 40) {
        for (let i = 0; i < count; i++) {
            this.particles.push({
                x: Math.random() * this.canvas.width,
                y: Math.random() * this.canvas.height - this.canvas.height,
                vx: (Math.random() - 0.5) * 2,
                vy: Math.random() * 2 + 1,
                size: Math.random() * 4 + 2,
                color: 'rgba(255, 255, 255, 0.8)',
                life: 1,
                decay: 0.002,
                type: 'snow',
                wobbleOffset: Math.random() * Math.PI * 2,
                wobbleSpeed: 0.03 + Math.random() * 0.02
            });
        }
        
        if (!this.isRunning) {
            this.start();
        }
    }
    
    // Create celebration fireworks
    createFireworks(count = 3) {
        let launched = 0;
        const launchInterval = setInterval(() => {
            if (launched >= count) {
                clearInterval(launchInterval);
                return;
            }
            
            const x = Math.random() * this.canvas.width * 0.6 + this.canvas.width * 0.2;
            const y = Math.random() * this.canvas.height * 0.4 + this.canvas.height * 0.1;
            
            this.createBurst(x, y, 30);
            launched++;
        }, 500);
    }
    
    // Update particles
    update() {
        this.particles = this.particles.filter(p => {
            // Update position
            p.x += p.vx;
            p.y += p.vy;
            
            // Apply gravity for certain types
            if (p.type === 'sparkle' || p.type === 'burst') {
                p.vy += 0.1;
            }
            
            // Apply floating motion
            if (p.type === 'orb') {
                p.floatOffset += p.floatSpeed;
                p.y += Math.sin(p.floatOffset) * 0.5;
            }
            
            // Apply wobble for snow
            if (p.type === 'snow') {
                p.wobbleOffset += p.wobbleSpeed;
                p.x += Math.sin(p.wobbleOffset) * 0.5;
            }
            
            // Decay life
            p.life -= p.decay;
            
            return p.life > 0;
        });
    }
    
    // Draw particles
    draw() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        this.particles.forEach(p => {
            this.ctx.save();
            this.ctx.globalAlpha = p.life;
            
            if (p.type === 'sparkle' || p.type === 'burst') {
                // Draw star shape
                this.ctx.fillStyle = p.color;
                this.ctx.beginPath();
                const spikes = 4;
                const outerRadius = p.size;
                const innerRadius = p.size / 2;
                
                for (let i = 0; i < spikes * 2; i++) {
                    const radius = i % 2 === 0 ? outerRadius : innerRadius;
                    const angle = (Math.PI * i) / spikes;
                    const x = p.x + Math.cos(angle) * radius;
                    const y = p.y + Math.sin(angle) * radius;
                    
                    if (i === 0) {
                        this.ctx.moveTo(x, y);
                    } else {
                        this.ctx.lineTo(x, y);
                    }
                }
                
                this.ctx.closePath();
                this.ctx.fill();
            } else if (p.type === 'trail') {
                // Draw circle trail
                const gradient = this.ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.size);
                gradient.addColorStop(0, p.color);
                gradient.addColorStop(1, 'transparent');
                
                this.ctx.fillStyle = gradient;
                this.ctx.beginPath();
                this.ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
                this.ctx.fill();
            } else if (p.type === 'orb') {
                // Draw glowing orb
                const gradient = this.ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.size);
                gradient.addColorStop(0, p.color);
                gradient.addColorStop(0.5, p.color + '80');
                gradient.addColorStop(1, 'transparent');
                
                this.ctx.fillStyle = gradient;
                this.ctx.beginPath();
                this.ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
                this.ctx.fill();
            } else if (p.type === 'rain') {
                // Draw rain line
                this.ctx.strokeStyle = p.color;
                this.ctx.lineWidth = p.size;
                this.ctx.beginPath();
                this.ctx.moveTo(p.x, p.y);
                this.ctx.lineTo(p.x, p.y + p.length);
                this.ctx.stroke();
            } else if (p.type === 'snow') {
                // Draw snowflake
                this.ctx.fillStyle = p.color;
                this.ctx.beginPath();
                this.ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
                this.ctx.fill();
            }
            
            this.ctx.restore();
        });
    }
    
    // Animation loop
    animate() {
        if (!this.isRunning) return;
        
        this.update();
        this.draw();
        
        if (this.particles.length > 0) {
            requestAnimationFrame(() => this.animate());
        } else {
            this.isRunning = false;
        }
    }
    
    // Start animation
    start() {
        this.isRunning = true;
        this.animate();
    }
    
    // Stop all effects
    stop() {
        this.isRunning = false;
        this.particles = [];
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }
    
    // Clear all particles
    clear() {
        this.particles = [];
    }
}

// ========================================
// Screen Shake Effect
// ========================================
function screenShake(intensity = 5, duration = 300) {
    const pageArea = document.getElementById('page-area');
    const startTime = Date.now();
    
    const shake = () => {
        const elapsed = Date.now() - startTime;
        const progress = elapsed / duration;
        
        if (progress < 1) {
            const x = (Math.random() - 0.5) * intensity * (1 - progress);
            const y = (Math.random() - 0.5) * intensity * (1 - progress);
            pageArea.style.transform = `translate(${x}px, ${y}px)`;
            requestAnimationFrame(shake);
        } else {
            pageArea.style.transform = 'translate(0, 0)';
        }
    };
    
    shake();
}

// ========================================
// Flash Effect
// ========================================
function flashEffect(color = 'white', duration = 200) {
    const flash = document.createElement('div');
    flash.style.position = 'fixed';
    flash.style.top = '0';
    flash.style.left = '0';
    flash.style.width = '100%';
    flash.style.height = '100%';
    flash.style.background = color;
    flash.style.opacity = '0.8';
    flash.style.pointerEvents = 'none';
    flash.style.zIndex = '9999';
    flash.style.transition = `opacity ${duration}ms ease-out`;
    
    document.body.appendChild(flash);
    
    setTimeout(() => {
        flash.style.opacity = '0';
    }, 50);
    
    setTimeout(() => {
        document.body.removeChild(flash);
    }, duration + 50);
}

// ========================================
// Typewriter Text Effect
// ========================================
function typewriterEffect(element, text, speed = 50) {
    return new Promise((resolve) => {
        let i = 0;
        element.textContent = '';
        
        const type = () => {
            if (i < text.length) {
                element.textContent += text.charAt(i);
                i++;
                setTimeout(type, speed);
            } else {
                resolve();
            }
        };
        
        type();
    });
}

// ========================================
// Glow Pulse Effect
// ========================================
function glowPulse(element, color = '#7C3AED', duration = 1000) {
    element.style.transition = `box-shadow ${duration / 2}ms ease-in-out`;
    element.style.boxShadow = `0 0 20px ${color}, 0 0 40px ${color}`;
    
    setTimeout(() => {
        element.style.boxShadow = 'none';
    }, duration);
}

// Export effects
window.effects = {
    manager: new EffectsManager(),
    screenShake,
    flashEffect,
    typewriterEffect,
    glowPulse
};
