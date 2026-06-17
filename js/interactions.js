// ========================================
// Interactive Elements Handler
// Click, Drag, Mini-games, and Page-Specific Interactions
// ========================================

class InteractionManager {
    constructor() {
        this.draggedElement = null;
        this.dragOffset = { x: 0, y: 0 };
        this.currentPageInteractions = {};
        this.completedInteractions = new Set();
        
        this.setupEventListeners();
    }
    
    setupEventListeners() {
        // Mouse events for dragging
        document.addEventListener('mousedown', (e) => this.handleMouseDown(e));
        document.addEventListener('mousemove', (e) => this.handleMouseMove(e));
        document.addEventListener('mouseup', (e) => this.handleMouseUp(e));
        
        // Touch events for mobile
        document.addEventListener('touchstart', (e) => this.handleTouchStart(e));
        document.addEventListener('touchmove', (e) => this.handleTouchMove(e));
        document.addEventListener('touchend', (e) => this.handleTouchEnd(e));
    }
    
    // ========================================
    // Page 1: Gate Discovery Interactions
    // ========================================
    setupGateDiscovery() {
        const gate = document.getElementById('gate');
        const vines = document.querySelectorAll('.vine');
        const sparkles = document.querySelectorAll('.sparkle');
        
        let vinesCleared = 0;
        let sparklesFound = 0;
        
        // Gate click to open
        if (gate) {
            gate.addEventListener('click', () => {
                if (vinesCleared >= 2) {
                    gate.classList.add('open');
                    effects.screenShake(3, 200);
                    effects.manager.createSparkle(
                        gate.getBoundingClientRect().left + 150,
                        gate.getBoundingClientRect().top + 200,
                        20
                    );
                    
                    setTimeout(() => {
                        this.completeInteraction('gate-opened');
                    }, 1000);
                } else {
                    effects.flashEffect('rgba(255, 165, 0, 0.3)', 300);
                    alert('Clear more vines first! Drag them away from the gate!');
                }
            });
        }
        
        // Vine dragging with proper mouse/touch events
        vines.forEach(vine => {
            let isDragging = false;
            let startX, startY;
            
            const startDrag = (e) => {
                isDragging = true;
                const clientX = e.clientX || (e.touches && e.touches[0].clientX);
                const clientY = e.clientY || (e.touches && e.touches[0].clientY);
                startX = clientX;
                startY = clientY;
                vine.style.cursor = 'grabbing';
                e.preventDefault();
            };
            
            const doDrag = (e) => {
                if (!isDragging) return;
                
                const clientX = e.clientX || (e.touches && e.touches[0].clientX);
                const clientY = e.clientY || (e.touches && e.touches[0].clientY);
                
                const deltaX = clientX - startX;
                const deltaY = clientY - startY;
                
                vine.style.transform = `translate(${deltaX}px, ${deltaY}px)`;
                vine.style.transition = 'none';
                e.preventDefault();
            };
            
            const endDrag = (e) => {
                if (!isDragging) return;
                isDragging = false;
                vine.style.cursor = 'grab';
                
                const clientX = e.clientX || (e.changedTouches && e.changedTouches[0].clientX);
                const clientY = e.clientY || (e.changedTouches && e.changedTouches[0].clientY);
                
                const distance = Math.hypot(clientX - startX, clientY - startY);
                
                // If dragged more than 50 pixels, count as cleared
                if (distance > 50) {
                    if (!vine.classList.contains('cleared')) {
                        vine.classList.add('cleared');
                        vinesCleared++;
                        vine.style.opacity = '0.3';
                        vine.style.pointerEvents = 'none';
                        effects.manager.createSparkle(
                            clientX,
                            clientY,
                            10,
                            '#34D399'
                        );
                    }
                } else {
                    // Snap back to original position
                    vine.style.transform = 'translate(0, 0)';
                    vine.style.transition = 'transform 0.3s ease';
                }
            };
            
            // Mouse events
            vine.addEventListener('mousedown', startDrag);
            document.addEventListener('mousemove', doDrag);
            document.addEventListener('mouseup', endDrag);
            
            // Touch events
            vine.addEventListener('touchstart', startDrag);
            document.addEventListener('touchmove', doDrag);
            document.addEventListener('touchend', endDrag);
        });
        
        // Sparkle clicking
        sparkles.forEach(sparkle => {
            sparkle.addEventListener('click', (e) => {
                sparkle.style.display = 'none';
                sparklesFound++;
                
                const lore = sparkle.dataset.lore;
                this.showLorePopup(e.clientX, e.clientY, lore);
                
                effects.manager.createSparkle(e.clientX, e.clientY, 15, '#FFD700');
                
                if (sparklesFound >= 3) {
                    this.completeInteraction('all-sparkles-found');
                }
            });
        });
    }
    
    showLorePopup(x, y, text) {
        const popup = document.createElement('div');
        popup.style.cssText = `
            position: fixed;
            left: ${x}px;
            top: ${y}px;
            background: white;
            border: 3px solid #7C3AED;
            border-radius: 8px;
            padding: 1rem;
            max-width: 250px;
            z-index: 10000;
            animation: fadeInUp 0.3s ease-out;
            box-shadow: 4px 4px 0px #1F2937;
        `;
        popup.textContent = text;
        
        document.body.appendChild(popup);
        
        setTimeout(() => {
            popup.style.animation = 'fadeIn 0.3s ease-out reverse';
            setTimeout(() => popup.remove(), 300);
        }, 3000);
    }
    
    // ========================================
    // Page 2: Portal Interactions
    // ========================================
    setupPortalEntry() {
        const portal = document.getElementById('portal');
        const orbs = document.querySelectorAll('.magic-orb');
        
        let orbsCollected = 0;
        
        // Orb collection
        orbs.forEach(orb => {
            orb.addEventListener('click', (e) => {
                if (!orb.classList.contains('collected')) {
                    orb.classList.add('collected');
                    orbsCollected++;
                    story.state.magicPoints += 10;
                    
                    effects.manager.createBurst(e.clientX, e.clientY, 15);
                    effects.glowPulse(orb, '#FFD700', 500);
                    
                    if (orbsCollected >= 5) {
                        this.completeInteraction('all-orbs-collected');
                    }
                }
            });
        });
        
        // Portal click to enter
        if (portal) {
            portal.addEventListener('click', () => {
                if (orbsCollected >= 3) {
                    effects.flashEffect('rgba(124, 58, 237, 0.5)', 500);
                    effects.screenShake(5, 300);
                    
                    setTimeout(() => {
                        this.completeInteraction('entered-portal');
                    }, 1000);
                }
            });
        }
        
        // Mouse trail effect
        document.addEventListener('mousemove', (e) => {
            if (portal) {
                const rect = portal.getBoundingClientRect();
                const centerX = rect.left + rect.width / 2;
                const centerY = rect.top + rect.height / 2;
                const distance = Math.hypot(e.clientX - centerX, e.clientY - centerY);
                
                if (distance < 200) {
                    effects.manager.createMagicTrail(e.clientX, e.clientY, '#7C3AED');
                }
            }
        });
    }
    
    // ========================================
    // Page 3: Meet the Guide Interactions
    // ========================================
    setupMeetCreature() {
        const creature = document.getElementById('pip');
        
        // Creature click reactions
        if (creature) {
            creature.addEventListener('click', () => {
                const reactions = ['wiggle', 'bounce', 'pulse'];
                const randomReaction = reactions[Math.floor(Math.random() * reactions.length)];
                
                creature.classList.add(`animate-${randomReaction}`);
                effects.manager.createSparkle(
                    creature.getBoundingClientRect().left + 100,
                    creature.getBoundingClientRect().top + 100,
                    10,
                    '#A78BFA'
                );
                
                setTimeout(() => {
                    creature.classList.remove(`animate-${randomReaction}`);
                }, 1000);
            });
        }
        
        // Symbol match mini-game
        this.setupSymbolMatchGame();
    }
    
    setupSymbolMatchGame() {
        const symbols = ['✨', '🌟', '💫', '⭐', '🔮', '🌙'];
        const cards = [];
        let flippedCards = [];
        let matchedPairs = 0;
        
        // Create pairs
        symbols.forEach(symbol => {
            cards.push({ symbol, matched: false });
            cards.push({ symbol, matched: false });
        });
        
        // Shuffle
        cards.sort(() => Math.random() - 0.5);
        
        // Render cards
        const gameContainer = document.getElementById('symbol-match-game');
        if (gameContainer) {
            gameContainer.innerHTML = '';
            cards.forEach((card, index) => {
                const cardElement = document.createElement('div');
                cardElement.className = 'symbol-card';
                cardElement.dataset.index = index;
                cardElement.dataset.symbol = card.symbol;
                cardElement.textContent = '?';
                
                cardElement.addEventListener('click', () => {
                    if (flippedCards.length < 2 && !cardElement.classList.contains('flipped')) {
                        cardElement.classList.add('flipped');
                        cardElement.textContent = card.symbol;
                        flippedCards.push(cardElement);
                        
                        if (flippedCards.length === 2) {
                            setTimeout(() => {
                                if (flippedCards[0].dataset.symbol === flippedCards[1].dataset.symbol) {
                                    flippedCards.forEach(c => c.classList.add('matched'));
                                    matchedPairs++;
                                    
                                    if (matchedPairs >= 6) {
                                        this.completeInteraction('symbol-match-complete');
                                    }
                                } else {
                                    flippedCards.forEach(c => {
                                        c.classList.remove('flipped');
                                        c.textContent = '?';
                                    });
                                }
                                flippedCards = [];
                            }, 1000);
                        }
                    }
                });
                
                gameContainer.appendChild(cardElement);
            });
        }
    }
    
    // ========================================
    // Page 4: Forest Navigation
    // ========================================
    setupForestNavigation() {
        const trees = document.querySelectorAll('.tree');
        const paths = document.querySelectorAll('.glowing-path');
        const hiddenObjects = document.querySelectorAll('.hidden-object');
        
        let treesClicked = 0;
        let pathsDragged = 0;
        let objectsFound = 0;
        
        // Tree clicking for riddles
        trees.forEach(tree => {
            tree.addEventListener('click', (e) => {
                treesClicked++;
                const riddle = tree.dataset.riddle;
                
                if (riddle) {
                    this.showLorePopup(e.clientX, e.clientY, riddle);
                    story.state.riddlesSolved++;
                }
                
                effects.manager.createSparkle(e.clientX, e.clientY, 10, '#34D399');
                
                if (treesClicked >= 3) {
                    this.completeInteraction('all-ticles-clicked');
                }
            });
        });
        
        // Path dragging
        paths.forEach(path => {
            path.addEventListener('dragend', () => {
                pathsDragged++;
                path.style.opacity = '1';
                effects.manager.createSparkle(
                    path.getBoundingClientRect().left + 50,
                    path.getBoundingClientRect().top + 10,
                    15,
                    '#FFD700'
                );
                
                if (pathsDragged >= 3) {
                    this.completeInteraction('paths-revealed');
                }
            });
        });
        
        // Hidden object finding
        hiddenObjects.forEach(obj => {
            obj.addEventListener('click', (e) => {
                obj.style.opacity = '1';
                obj.style.transform = 'scale(1.5)';
                objectsFound++;
                story.state.hiddenObjectsFound++;
                
                effects.manager.createBurst(e.clientX, e.clientY, 10);
                
                if (objectsFound >= 3) {
                    this.completeInteraction('all-hidden-found');
                }
            });
        });
    }
    
    // ========================================
    // Page 5: Crystal Cave
    // ========================================
    setupCrystalVision() {
        const crystals = document.querySelectorAll('.crystal');
        
        crystals.forEach(crystal => {
            crystal.addEventListener('click', (e) => {
                crystal.classList.add('active');
                const vision = crystal.dataset.vision;
                
                if (vision) {
                    this.showLorePopup(e.clientX, e.clientY, vision);
                }
                
                effects.manager.createSparkle(e.clientX, e.clientY, 20, '#A78BFA');
                effects.glowPulse(crystal, '#7C3AED', 1000);
            });
        });
        
        // Crystal puzzle
        this.setupCrystalPuzzle();
    }
    
    setupCrystalPuzzle() {
        const puzzleContainer = document.getElementById('crystal-puzzle');
        if (!puzzleContainer) return;
        
        const shards = ['🔮', '💎', '✨', '🌟', '💫', '⭐'];
        let selectedShards = [];
        
        shards.forEach((shard, index) => {
            const shardElement = document.createElement('div');
            shardElement.className = 'crystal-shard clickable';
            shardElement.dataset.index = index;
            shardElement.textContent = shard;
            shardElement.style.display = 'flex';
            shardElement.style.justifyContent = 'center';
            shardElement.style.alignItems = 'center';
            shardElement.style.fontSize = '2rem';
            
            shardElement.addEventListener('click', () => {
                if (!shardElement.classList.contains('selected')) {
                    shardElement.classList.add('selected');
                    shardElement.style.border = '4px solid #FFD700';
                    selectedShards.push(shardElement);
                    
                    if (selectedShards.length === 3) {
                        setTimeout(() => {
                            this.completeInteraction('crystal-puzzle-solved');
                            selectedShards = [];
                        }, 500);
                    }
                }
            });
            
            puzzleContainer.appendChild(shardElement);
        });
    }
    
    // ========================================
    // Page 6: Bridge of Choices
    // ========================================
    setupBridgeChoice() {
        const paths = document.querySelectorAll('.bridge-path');
        const platforms = document.querySelectorAll('.floating-platform');
        
        let platformsActivated = 0;
        
        // Path selection
        paths.forEach(path => {
            path.addEventListener('click', () => {
                paths.forEach(p => p.classList.remove('selected'));
                path.classList.add('selected');
                
                story.state.pathChosen = path.id;
                effects.manager.createBurst(
                    path.getBoundingClientRect().left + path.offsetWidth / 2,
                    path.getBoundingClientRect().top + path.offsetHeight / 2,
                    20
                );
                
                this.completeInteraction('path-chosen');
            });
        });
        
        // Platform clicking
        platforms.forEach(platform => {
            platform.addEventListener('click', (e) => {
                platform.style.background = 'linear-gradient(180deg, #34D399 0%, #10B981 100%)';
                platformsActivated++;
                
                effects.manager.createSparkle(e.clientX, e.clientY, 15, '#FBBF24');
                
                if (platformsActivated >= 3) {
                    this.completeInteraction('platforms-activated');
                }
            });
        });
    }
    
    // ========================================
    // Page 7: Guardian's Challenge
    // ========================================
    setupGuardianChallenge() {
        // Memory match game
        this.setupMemoryGame();
        
        // Falling stars game
        this.setupFallingStars();
    }
    
    setupMemoryGame() {
        const symbols = ['🦁', '🐉', '🦅', '🐺', '🦊', '🦉', '🐸', '🦋'];
        const cards = [];
        let flippedCards = [];
        let matchedPairs = 0;
        
        symbols.forEach(symbol => {
            cards.push({ symbol, matched: false });
            cards.push({ symbol, matched: false });
        });
        
        cards.sort(() => Math.random() - 0.5);
        
        const gameContainer = document.getElementById('memory-game');
        if (gameContainer) {
            gameContainer.innerHTML = '';
            cards.forEach((card, index) => {
                const cardElement = document.createElement('div');
                cardElement.className = 'memory-card';
                cardElement.dataset.index = index;
                cardElement.dataset.symbol = card.symbol;
                cardElement.textContent = '?';
                
                cardElement.addEventListener('click', () => {
                    if (flippedCards.length < 2 && !cardElement.classList.contains('revealed')) {
                        cardElement.classList.add('revealed');
                        cardElement.textContent = card.symbol;
                        flippedCards.push(cardElement);
                        
                        if (flippedCards.length === 2) {
                            setTimeout(() => {
                                if (flippedCards[0].dataset.symbol === flippedCards[1].dataset.symbol) {
                                    flippedCards.forEach(c => c.classList.add('matched'));
                                    matchedPairs++;
                                    
                                    if (matchedPairs >= 8) {
                                        this.completeInteraction('memory-game-complete');
                                    }
                                } else {
                                    flippedCards.forEach(c => {
                                        c.classList.remove('revealed');
                                        c.textContent = '?';
                                    });
                                }
                                flippedCards = [];
                            }, 1000);
                        }
                    }
                });
                
                gameContainer.appendChild(cardElement);
            });
        }
    }
    
    setupFallingStars() {
        const container = document.getElementById('falling-stars-container');
        if (!container) return;
        
        let starsCaught = 0;
        const totalStars = 10;
        let starsSpawned = 0;
        
        const spawnStar = () => {
            if (starsSpawned >= totalStars) return;
            
            const star = document.createElement('div');
            star.className = 'falling-star';
            star.style.left = Math.random() * (container.offsetWidth - 30) + 'px';
            star.style.top = '-30px';
            
            container.appendChild(star);
            starsSpawned++;
            
            let position = -30;
            const fallSpeed = 2 + Math.random() * 2;
            
            const fall = setInterval(() => {
                position += fallSpeed;
                star.style.top = position + 'px';
                
                if (position > container.offsetHeight) {
                    clearInterval(fall);
                    star.remove();
                }
            }, 20);
            
            star.addEventListener('click', () => {
                clearInterval(fall);
                star.remove();
                starsCaught++;
                
                effects.manager.createSparkle(
                    parseInt(star.style.left) + 15,
                    position + 15,
                    10,
                    '#FFD700'
                );
                
                if (starsCaught >= 7) {
                    this.completeInteraction('stars-caught');
                }
            });
            
            setTimeout(spawnStar, 800 + Math.random() * 500);
        };
        
        spawnStar();
    }
    
    // ========================================
    // Page 8: Final Choice
    // ========================================
    setupFinalChoice() {
        const heart = document.getElementById('heart');
        const choices = document.querySelectorAll('.choice-button');
        
        // Heart interaction
        if (heart) {
            heart.addEventListener('click', (e) => {
                effects.manager.createBurst(e.clientX, e.clientY, 30);
                effects.screenShake(3, 200);
            });
        }
        
        // Final choice
        choices.forEach(choice => {
            choice.addEventListener('click', () => {
                const choiceType = choice.id;
                story.state.choices.push(choiceType);
                
                effects.flashEffect('white', 1000);
                effects.manager.createFireworks(5);
                
                setTimeout(() => {
                    this.completeInteraction('final-choice-made');
                }, 1500);
            });
        });
    }
    
    // ========================================
    // Utility Methods
    // ========================================
    handleMouseDown(e) {
        if (e.target.classList.contains('draggable')) {
            this.draggedElement = e.target;
            const rect = e.target.getBoundingClientRect();
            this.dragOffset.x = e.clientX - rect.left;
            this.dragOffset.y = e.clientY - rect.top;
            
            e.target.classList.add('dragging');
        }
    }
    
    handleMouseMove(e) {
        if (this.draggedElement) {
            const x = e.clientX - this.dragOffset.x;
            const y = e.clientY - this.dragOffset.y;
            
            this.draggedElement.style.position = 'absolute';
            this.draggedElement.style.left = x + 'px';
            this.draggedElement.style.top = y + 'px';
        }
    }
    
    handleMouseUp(e) {
        if (this.draggedElement) {
            this.draggedElement.classList.remove('dragging');
            this.draggedElement = null;
        }
    }
    
    handleTouchStart(e) {
        const touch = e.touches[0];
        this.handleMouseDown({ target: touch.target, clientX: touch.clientX, clientY: touch.clientY });
    }
    
    handleTouchMove(e) {
        const touch = e.touches[0];
        this.handleMouseMove({ clientX: touch.clientX, clientY: touch.clientY });
    }
    
    handleTouchEnd(e) {
        this.handleMouseUp({});
    }
    
    completeInteraction(interactionId) {
        this.completedInteractions.add(interactionId);
        story.saveProgress();
    }
    
    isInteractionComplete(interactionId) {
        return this.completedInteractions.has(interactionId);
    }
    
    reset() {
        this.completedInteractions.clear();
        this.draggedElement = null;
    }
}

// Export interaction manager
window.interactions = new InteractionManager();
