// ========================================
// Main Application Controller
// Page Routing, State Management, Navigation
// ========================================

class StorybookApp {
    constructor() {
        this.currentPage = 0;
        this.soundEnabled = true;
        this.isTransitioning = false;
        
        this.init();
    }
    
    init() {
        this.setupEventListeners();
        this.checkForSavedProgress();
        
        // Set canvas size
        const canvas = document.getElementById('effects-canvas');
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    
    setupEventListeners() {
        // Title screen buttons
        document.getElementById('start-btn').addEventListener('click', () => this.startStory());
        document.getElementById('continue-btn').addEventListener('click', () => this.continueStory());
        document.getElementById('restart-btn').addEventListener('click', () => this.restartStory());
        
        // Navigation buttons
        document.getElementById('next-btn').addEventListener('click', () => this.nextPage());
        document.getElementById('back-btn').addEventListener('click', () => this.previousPage());
        document.getElementById('sound-btn').addEventListener('click', () => this.toggleSound());
        
        // Dialogue continue button
        document.getElementById('dialogue-continue').addEventListener('click', () => this.continueDialogue());
        
        // Keyboard navigation
        document.addEventListener('keydown', (e) => {
            if (e.key === 'ArrowRight' || e.key === ' ') {
                e.preventDefault();
                this.nextPage();
            } else if (e.key === 'ArrowLeft') {
                e.preventDefault();
                this.previousPage();
            } else if (e.key === 'm' || e.key === 'M') {
                this.toggleSound();
            }
        });
        
        // Window resize
        window.addEventListener('resize', () => {
            const canvas = document.getElementById('effects-canvas');
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        });
    }
    
    checkForSavedProgress() {
        const hasProgress = story.loadProgress();
        if (hasProgress && story.state.currentPage > 0) {
            document.getElementById('continue-btn').style.display = 'block';
        }
    }
    
    // ========================================
    // Story Flow Control
    // ========================================
    
    startStory() {
        story.clearProgress();
        this.currentPage = 0;
        this.showScreen('story-container');
        this.renderPage(0);
        this.playSound('start');
    }
    
    continueStory() {
        this.currentPage = story.state.currentPage;
        this.showScreen('story-container');
        this.renderPage(this.currentPage);
    }
    
    restartStory() {
        story.clearProgress();
        interactions.reset();
        this.currentPage = 0;
        this.showScreen('title-screen');
        document.getElementById('continue-btn').style.display = 'none';
    }
    
    nextPage() {
        if (this.isTransitioning) return;
        if (this.currentPage >= story.data.totalPages - 1) {
            this.completeStory();
            return;
        }
        
        this.isTransitioning = true;
        this.currentPage++;
        story.state.currentPage = this.currentPage;
        story.saveProgress();
        
        this.transitionPage('next', () => {
            this.renderPage(this.currentPage);
            this.isTransitioning = false;
        });
        
        this.playSound('page-turn');
    }
    
    previousPage() {
        if (this.isTransitioning) return;
        if (this.currentPage <= 0) return;
        
        this.isTransitioning = true;
        this.currentPage--;
        story.state.currentPage = this.currentPage;
        story.saveProgress();
        
        this.transitionPage('prev', () => {
            this.renderPage(this.currentPage);
            this.isTransitioning = false;
        });
        
        this.playSound('page-turn');
    }
    
    transitionPage(direction, callback) {
        const pageArea = document.getElementById('current-page');
        
        pageArea.style.animation = direction === 'next' 
            ? 'slideOutToLeft 0.4s ease-in' 
            : 'fadeInRight 0.4s ease-out';
        
        setTimeout(() => {
            pageArea.style.animation = direction === 'next'
                ? 'slideInFromRight 0.4s ease-out'
                : 'fadeInLeft 0.4s ease-out';
            
            setTimeout(callback, 400);
        }, 400);
    }
    
    // ========================================
    // Page Rendering
    // ========================================
    
    renderPage(pageIndex) {
        const pageData = story.data.pages[pageIndex];
        const pageArea = document.getElementById('current-page');
        
        // Update navigation
        this.updateNavigation();
        
        // Clear previous page
        pageArea.innerHTML = '';
        pageArea.className = 'page-content';
        
        // Render based on page type
        if (pageData.type === 'comic') {
            this.renderComicPage(pageData, pageArea);
        } else if (pageData.type === 'visual-novel') {
            this.renderVisualNovelPage(pageData, pageArea);
        }
        
        // Setup page-specific interactions
        this.setupPageInteractions(pageData);
        
        // Add entrance animation
        pageArea.classList.add('animate-fade-in');
        
        this.playSound('page-load');
    }
    
    renderComicPage(pageData, container) {
        // Add background class
        container.classList.add(pageData.background);
        
        // Create narrative text
        const narrative = document.createElement('div');
        narrative.className = 'narrative-text animate-fade-in-up';
        narrative.style.cssText = 'font-size: 1.2rem; margin-bottom: 2rem; font-weight: 600; color: var(--dark-purple);';
        narrative.textContent = pageData.narrative;
        container.appendChild(narrative);
        
        // Create comic layout
        const comicLayout = document.createElement('div');
        comicLayout.className = 'comic-layout';
        comicLayout.style.gridTemplateColumns = 'repeat(4, 1fr)';
        comicLayout.style.gridTemplateRows = 'repeat(2, 1fr)';
        
        pageData.panels.forEach((panel, index) => {
            const panelElement = document.createElement('div');
            panelElement.className = 'comic-panel';
            panelElement.style.gridRow = panel.position.row;
            panelElement.style.gridColumn = panel.position.col;
            panelElement.style.animationDelay = `${index * 0.1}s`;
            panelElement.classList.add('animate-fade-in-up');
            
            this.renderPanelContent(panel.content, panelElement);
            
            comicLayout.appendChild(panelElement);
        });
        
        container.appendChild(comicLayout);
        
        // Add next text
        const nextText = document.createElement('div');
        nextText.className = 'next-text animate-fade-in-up';
        nextText.style.cssText = 'margin-top: 2rem; font-style: italic; color: var(--dark-gray); text-align: center;';
        nextText.textContent = pageData.nextText;
        container.appendChild(nextText);
    }
    
    renderPanelContent(content, panelElement) {
        if (content.type === 'image') {
            const imagePlaceholder = document.createElement('div');
            imagePlaceholder.style.cssText = 'width: 100%; height: 200px; background: linear-gradient(135deg, #60A5FA 0%, #3B82F6 100%); border-radius: 8px; margin-bottom: 1rem;';
            
            const text = document.createElement('p');
            text.textContent = content.text;
            text.style.cssText = 'font-size: 1rem; line-height: 1.6;';
            
            panelElement.appendChild(imagePlaceholder);
            panelElement.appendChild(text);
            
        } else if (content.type === 'speech') {
            const speechBubble = document.createElement('div');
            speechBubble.className = 'speech-bubble';
            
            const speaker = document.createElement('strong');
            speaker.textContent = content.speaker + ': ';
            speaker.style.color = 'var(--primary-purple)';
            
            const text = document.createTextNode(content.text);
            
            speechBubble.appendChild(speaker);
            speechBubble.appendChild(text);
            panelElement.appendChild(speechBubble);
            
        } else if (content.type === 'interactive') {
            const instruction = document.createElement('p');
            instruction.style.cssText = 'font-weight: bold; color: var(--primary-orange); margin-bottom: 1rem;';
            instruction.textContent = content.instruction || 'Interact with the elements below!';
            panelElement.appendChild(instruction);
            
            // Add interactive container
            const interactiveContainer = document.createElement('div');
            interactiveContainer.className = 'interactive-area';
            interactiveContainer.id = `interactive-${content.interactionType}`;
            panelElement.appendChild(interactiveContainer);
            
        } else if (content.type === 'narrative') {
            const text = document.createElement('p');
            text.style.cssText = 'font-size: 1.1rem; line-height: 1.8; font-style: italic;';
            text.textContent = content.text;
            panelElement.appendChild(text);
        }
    }
    
    renderVisualNovelPage(pageData, container) {
        // Add background class
        container.classList.add(pageData.background);
        
        // Create full-scene background
        const sceneBackground = document.createElement('div');
        sceneBackground.style.cssText = 'position: absolute; top: 0; left: 0; width: 100%; height: 100%; opacity: 0.3;';
        sceneBackground.style.background = 'var(--gradient-magic)';
        container.appendChild(sceneBackground);
        
        // Create character area
        const characterArea = document.createElement('div');
        characterArea.className = 'character-area';
        characterArea.style.cssText = 'position: relative; height: 300px; margin-bottom: 2rem;';
        
        // Add characters (placeholder for now)
        if (pageData.scenes && pageData.scenes[0]) {
            pageData.scenes[0].characters.forEach(char => {
                const characterElement = document.createElement('div');
                characterElement.className = `character character-${char}`;
                characterElement.id = char;
                
                if (char === 'alex') {
                    characterElement.style.cssText = 'position: absolute; left: 10%; bottom: 0; width: 150px; height: 250px; background: linear-gradient(180deg, #60A5FA 0%, #3B82F6 100%); border-radius: 75px 75px 0 0; border: 4px solid var(--charcoal);';
                } else if (char === 'pip') {
                    characterElement.style.cssText = 'position: absolute; right: 10%; bottom: 0; width: 120px; height: 120px; background: linear-gradient(135deg, #A78BFA 0%, #7C3AED 100%); border-radius: 50%; border: 4px solid var(--charcoal); animation: float 3s ease-in-out infinite;';
                } else if (char === 'guardian') {
                    characterElement.style.cssText = 'position: absolute; left: 50%; transform: translateX(-50%); bottom: 0; width: 200px; height: 300px; background: linear-gradient(180deg, #F59E0B 0%, #DC2626 100%); border-radius: 100px 100px 0 0; border: 4px solid var(--charcoal);';
                }
                
                characterArea.appendChild(characterElement);
            });
        }
        
        container.appendChild(characterArea);
        
        // Create dialogue box
        const dialogueBox = document.createElement('div');
        dialogueBox.className = 'dialogue-box';
        dialogueBox.style.position = 'relative';
        dialogueBox.style.transform = 'none';
        dialogueBox.style.left = 'auto';
        
        const dialogueSpeaker = document.createElement('div');
        dialogueSpeaker.className = 'dialogue-speaker';
        dialogueSpeaker.id = 'dialogue-speaker';
        
        const dialogueText = document.createElement('div');
        dialogueText.className = 'dialogue-text';
        dialogueText.id = 'dialogue-text';
        
        const dialogueChoices = document.createElement('div');
        dialogueChoices.className = 'dialogue-choices';
        dialogueChoices.id = 'dialogue-choices';
        
        dialogueBox.appendChild(dialogueSpeaker);
        dialogueBox.appendChild(dialogueText);
        dialogueBox.appendChild(dialogueChoices);
        container.appendChild(dialogueBox);
        
        // Start dialogue sequence
        this.startDialogueSequence(pageData.scenes);
    }
    
    async startDialogueSequence(scenes) {
        const speakerElement = document.getElementById('dialogue-speaker');
        const textElement = document.getElementById('dialogue-text');
        const choicesElement = document.getElementById('dialogue-choices');
        
        for (const scene of scenes) {
            // Update speaker and text
            speakerElement.textContent = scene.dialogue.speaker;
            textElement.textContent = '';
            
            // Typewriter effect
            await effects.typewriterEffect(textElement, scene.dialogue.text, 30);
            
            // Wait for user to continue
            await this.waitForContinue();
        }
        
        // Show choices if available
        const currentPage = story.data.pages[this.currentPage];
        if (currentPage.interactions.choices) {
            this.showChoices(currentPage.interactions.choices);
        }
    }
    
    waitForContinue() {
        return new Promise((resolve) => {
            const continueBtn = document.getElementById('dialogue-continue');
            const handler = () => {
                continueBtn.removeEventListener('click', handler);
                resolve();
            };
            continueBtn.addEventListener('click', handler);
        });
    }
    
    showChoices(choices) {
        const choicesElement = document.getElementById('dialogue-choices');
        choicesElement.innerHTML = '';
        
        choices.forEach(choice => {
            const choiceBtn = document.createElement('button');
            choiceBtn.className = 'dialogue-choice-btn';
            choiceBtn.textContent = choice.text;
            
            choiceBtn.addEventListener('click', () => {
                story.state.choices.push(choice);
                
                if (choice.effect) {
                    Object.assign(story.state, choice.effect);
                }
                
                story.saveProgress();
                choicesElement.innerHTML = '';
                
                effects.manager.createSparkle(
                    choiceBtn.getBoundingClientRect().left + choiceBtn.offsetWidth / 2,
                    choiceBtn.getBoundingClientRect().top,
                    15
                );
            });
            
            choicesElement.appendChild(choiceBtn);
        });
    }
    
    continueDialogue() {
        // Handled by waitForContinue
    }
    
    // ========================================
    // Page-Specific Interactions Setup
    // ========================================
    
    setupPageInteractions(pageData) {
        const interactionType = pageData.interactions.type;
        
        switch (interactionType) {
            case 'gate-discovery':
                this.setupPage1Interactions(pageData);
                break;
            case 'portal-entry':
                this.setupPage2Interactions(pageData);
                break;
            case 'meet-creature':
                this.setupPage3Interactions(pageData);
                break;
            case 'forest-navigation':
                this.setupPage4Interactions(pageData);
                break;
            case 'crystal-vision':
                this.setupPage5Interactions(pageData);
                break;
            case 'bridge-choice':
                this.setupPage6Interactions(pageData);
                break;
            case 'guardian-challenge':
                this.setupPage7Interactions(pageData);
                break;
            case 'final-choice':
                this.setupPage8Interactions(pageData);
                break;
        }
    }
    
    setupPage1Interactions(pageData) {
        // Create gate element
        const interactiveArea = document.getElementById('interactive-gate');
        if (interactiveArea) {
            const gateContainer = document.createElement('div');
            gateContainer.className = 'gate-container';
            gateContainer.innerHTML = `
                <div class="gate" id="gate">
                    <div class="gate-door left"></div>
                    <div class="gate-door right"></div>
                </div>
                <div class="vine" id="vine1" style="top: 20%; left: 10%; width: 80px; height: 20px;" title="Drag me!">
                    <span style="position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); font-size: 0.7rem; color: white; font-weight: bold; pointer-events: none;">👆 DRAG</span>
                </div>
                <div class="vine" id="vine2" style="top: 40%; right: 15%; width: 100px; height: 20px;" title="Drag me!">
                    <span style="position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); font-size: 0.7rem; color: white; font-weight: bold; pointer-events: none;">👆 DRAG</span>
                </div>
                <div class="vine" id="vine3" style="top: 60%; left: 20%; width: 90px; height: 20px;" title="Drag me!">
                    <span style="position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); font-size: 0.7rem; color: white; font-weight: bold; pointer-events: none;">👆 DRAG</span>
                </div>
                <div class="sparkle" id="sparkle1" data-lore="This gate has been hidden for centuries..." style="top: 30%; left: 30%;"></div>
                <div class="sparkle" id="sparkle2" data-lore="Only those who are curious can see it." style="top: 50%; right: 25%;"></div>
                <div class="sparkle" id="sparkle3" data-lore="Magic awaits on the other side..." style="bottom: 20%; left: 40%;"></div>
            `;
            interactiveArea.appendChild(gateContainer);
            
            // Setup interactions
            setTimeout(() => interactions.setupGateDiscovery(), 100);
        }
    }
    
    setupPage2Interactions(pageData) {
        const container = document.getElementById('current-page');
        
        // Create portal
        const portalContainer = document.createElement('div');
        portalContainer.className = 'portal-container';
        portalContainer.innerHTML = `
            <div class="portal" id="portal"></div>
            <div class="magic-orb" id="orb1" style="top: 20%; left: 20%;"></div>
            <div class="magic-orb" id="orb2" style="top: 30%; right: 15%;"></div>
            <div class="magic-orb" id="orb3" style="bottom: 30%; left: 25%;"></div>
            <div class="magic-orb" id="orb4" style="bottom: 20%; right: 20%;"></div>
            <div class="magic-orb" id="orb5" style="top: 50%; left: 50%;"></div>
        `;
        container.insertBefore(portalContainer, container.firstChild.nextSibling);
        
        setTimeout(() => interactions.setupPortalEntry(), 100);
    }
    
    setupPage3Interactions(pageData) {
        const container = document.getElementById('current-page');
        
        // Create creature
        const creatureContainer = document.createElement('div');
        creatureContainer.className = 'creature-container';
        creatureContainer.innerHTML = `
            <div class="creature" id="pip">
                <div class="creature-body">
                    <div class="creature-eye left"><div class="creature-pupil"></div></div>
                    <div class="creature-eye right"><div class="creature-pupil"></div></div>
                </div>
            </div>
        `;
        container.insertBefore(creatureContainer, container.lastChild);
        
        // Add symbol match game
        const symbolGame = document.createElement('div');
        symbolGame.id = 'symbol-match-game';
        symbolGame.className = 'symbol-match-game';
        container.appendChild(symbolGame);
        
        setTimeout(() => interactions.setupMeetCreature(), 100);
    }
    
    setupPage4Interactions(pageData) {
        const container = document.getElementById('current-page');
        
        // Create forest elements
        const forestContainer = document.createElement('div');
        forestContainer.style.cssText = 'position: relative; height: 400px; margin: 2rem 0;';
        forestContainer.innerHTML = `
            <div class="tree" id="tree1" data-riddle="I have roots but no trunk. I grow but have no leaves. What am I? (A mountain)" style="left: 10%; top: 20%;">
                <div class="tree-canopy"></div>
                <div class="tree-trunk"></div>
            </div>
            <div class="tree" id="tree2" data-riddle="The more you take, the more you leave behind. What am I? (Footsteps)" style="left: 40%; top: 10%;">
                <div class="tree-canopy"></div>
                <div class="tree-trunk"></div>
            </div>
            <div class="tree" id="tree3" data-riddle="I speak without a mouth and hear without ears. What am I? (An echo)" style="right: 10%; top: 30%;">
                <div class="tree-canopy"></div>
                <div class="tree-trunk"></div>
            </div>
            <div class="glowing-path" id="path1" style="top: 60%; left: 15%;"></div>
            <div class="glowing-path" id="path2" style="top: 65%; left: 40%;"></div>
            <div class="glowing-path" id="path3" style="top: 70%; right: 20%;"></div>
            <div class="hidden-object" id="hidden1" style="top: 25%; left: 30%;"></div>
            <div class="hidden-object" id="hidden2" style="top: 45%; right: 25%;"></div>
            <div class="hidden-object" id="hidden3" style="top: 35%; left: 60%;"></div>
        `;
        container.insertBefore(forestContainer, container.lastChild);
        
        setTimeout(() => interactions.setupForestNavigation(), 100);
    }
    
    setupPage5Interactions(pageData) {
        const container = document.getElementById('current-page');
        
        // Create crystals
        const crystalContainer = document.createElement('div');
        crystalContainer.style.cssText = 'display: flex; justify-content: space-around; margin: 2rem 0;';
        crystalContainer.innerHTML = `
            <div class="crystal" id="crystal1" data-vision="A young girl discovering the realm for the first time">
                <div class="crystal-shard"></div>
            </div>
            <div class="crystal" id="crystal2" data-vision="Pip as a baby Lumibit, just hatched">
                <div class="crystal-shard"></div>
            </div>
            <div class="crystal" id="crystal3" data-vision="An ancient celebration in the realm">
                <div class="crystal-shard"></div>
            </div>
        `;
        container.insertBefore(crystalContainer, container.lastChild);
        
        // Crystal puzzle
        const puzzleContainer = document.createElement('div');
        puzzleContainer.id = 'crystal-puzzle';
        puzzleContainer.className = 'crystal-puzzle';
        container.appendChild(puzzleContainer);
        
        setTimeout(() => interactions.setupCrystalVision(), 100);
    }
    
    setupPage6Interactions(pageData) {
        const container = document.getElementById('current-page');
        
        // Create bridge paths
        const bridgeContainer = document.createElement('div');
        bridgeContainer.className = 'bridge-container';
        bridgeContainer.innerHTML = `
            <div class="bridge-path" id="path-brave">
                <div style="font-size: 3rem; margin-bottom: 1rem;">🦁</div>
                <h3>The Path of Courage</h3>
                <p>Face your fears and discover inner strength</p>
            </div>
            <div class="bridge-path" id="path-wisdom">
                <div style="font-size: 3rem; margin-bottom: 1rem;">📚</div>
                <h3>The Path of Wisdom</h3>
                <p>Learn ancient secrets and solve mysteries</p>
            </div>
            <div class="bridge-path" id="path-kindness">
                <div style="font-size: 3rem; margin-bottom: 1rem;">💝</div>
                <h3>The Path of Kindness</h3>
                <p>Help others and find the power of compassion</p>
            </div>
        `;
        container.insertBefore(bridgeContainer, container.lastChild);
        
        // Floating platforms
        const platformsContainer = document.createElement('div');
        platformsContainer.style.cssText = 'position: relative; height: 150px; margin: 2rem 0;';
        platformsContainer.innerHTML = `
            <div class="floating-platform" id="platform1" style="left: 10%; top: 30%;"></div>
            <div class="floating-platform" id="platform2" style="left: 45%; top: 20%;"></div>
            <div class="floating-platform" id="platform3" style="right: 10%; top: 40%;"></div>
        `;
        container.appendChild(platformsContainer);
        
        setTimeout(() => interactions.setupBridgeChoice(), 100);
    }
    
    setupPage7Interactions(pageData) {
        const container = document.getElementById('current-page');
        
        // Memory game
        const memoryContainer = document.createElement('div');
        memoryContainer.id = 'memory-game';
        memoryContainer.className = 'memory-game';
        container.insertBefore(memoryContainer, container.lastChild);
        
        // Falling stars container
        const starsContainer = document.createElement('div');
        starsContainer.id = 'falling-stars-container';
        starsContainer.style.cssText = 'position: relative; height: 200px; margin: 2rem 0; overflow: hidden; border: 3px solid var(--charcoal); border-radius: 8px; background: rgba(0,0,0,0.3);';
        container.appendChild(starsContainer);
        
        setTimeout(() => interactions.setupGuardianChallenge(), 100);
    }
    
    setupPage8Interactions(pageData) {
        const container = document.getElementById('current-page');
        
        // Magic heart
        const heartContainer = document.createElement('div');
        heartContainer.className = 'heart-container';
        heartContainer.innerHTML = `
            <div class="magic-heart" id="heart">
                <div class="heart-shape"></div>
            </div>
        `;
        container.insertBefore(heartContainer, container.lastChild);
        
        // Final choices
        const choicesContainer = document.createElement('div');
        choicesContainer.className = 'final-choice';
        choicesContainer.innerHTML = `
            <button class="choice-button absorb" id="absorb">
                Absorb the Magic
            </button>
            <button class="choice-button release" id="release">
                Release the Magic
            </button>
        `;
        container.appendChild(choicesContainer);
        
        setTimeout(() => interactions.setupFinalChoice(), 100);
        
        // Listen for final choice completion
        const checkCompletion = setInterval(() => {
            if (interactions.isInteractionComplete('final-choice-made')) {
                clearInterval(checkCompletion);
                setTimeout(() => this.completeStory(), 1500);
            }
        }, 500);
    }
    
    // ========================================
    // Navigation & UI Updates
    // ========================================
    
    updateNavigation() {
        const pageIndicator = document.getElementById('page-indicator');
        const progressFill = document.getElementById('progress-fill');
        const backBtn = document.getElementById('back-btn');
        const nextBtn = document.getElementById('next-btn');
        
        pageIndicator.textContent = `Page ${this.currentPage + 1} of ${story.data.totalPages}`;
        progressFill.style.width = `${((this.currentPage + 1) / story.data.totalPages) * 100}%`;
        
        backBtn.disabled = this.currentPage === 0;
        nextBtn.disabled = false;
    }
    
    showScreen(screenId) {
        document.querySelectorAll('.screen').forEach(screen => {
            screen.classList.remove('active');
        });
        document.getElementById(screenId).classList.add('active');
    }
    
    toggleSound() {
        this.soundEnabled = !this.soundEnabled;
        const soundBtn = document.getElementById('sound-btn');
        soundBtn.textContent = this.soundEnabled ? '🔊' : '🔇';
    }
    
    playSound(type) {
        if (!this.soundEnabled) return;
        
        // Simple sound effects using Web Audio API
        try {
            const audioContext = new (window.AudioContext || window.webkitAudioContext)();
            const oscillator = audioContext.createOscillator();
            const gainNode = audioContext.createGain();
            
            oscillator.connect(gainNode);
            gainNode.connect(audioContext.destination);
            
            switch (type) {
                case 'start':
                    oscillator.frequency.setValueAtTime(440, audioContext.currentTime);
                    oscillator.frequency.exponentialRampToValueAtTime(880, audioContext.currentTime + 0.3);
                    gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
                    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);
                    oscillator.start(audioContext.currentTime);
                    oscillator.stop(audioContext.currentTime + 0.5);
                    break;
                    
                case 'page-turn':
                    oscillator.frequency.setValueAtTime(300, audioContext.currentTime);
                    oscillator.frequency.exponentialRampToValueAtTime(600, audioContext.currentTime + 0.2);
                    gainNode.gain.setValueAtTime(0.2, audioContext.currentTime);
                    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3);
                    oscillator.start(audioContext.currentTime);
                    oscillator.stop(audioContext.currentTime + 0.3);
                    break;
                    
                case 'click':
                    oscillator.frequency.setValueAtTime(800, audioContext.currentTime);
                    gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
                    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.1);
                    oscillator.start(audioContext.currentTime);
                    oscillator.stop(audioContext.currentTime + 0.1);
                    break;
            }
        } catch (e) {
            // Audio not supported
        }
    }
    
    // ========================================
    // Story Completion
    // ========================================
    
    completeStory() {
        story.state.completed = true;
        story.saveProgress();
        
        const ending = story.state.choices.length > 0 
            ? story.state.choices[story.state.choices.length - 1].id 
            : 'release';
        
        const endingData = story.data.pages[7].ending[ending];
        
        // Show completion screen
        this.showScreen('completion-screen');
        
        const messageElement = document.getElementById('completion-message');
        messageElement.textContent = endingData.message;
        
        const titleElement = document.querySelector('.completion-title');
        titleElement.textContent = endingData.title;
        
        // Show stats
        const statsElement = document.getElementById('completion-stats');
        statsElement.innerHTML = `
            <h3>Adventure Stats</h3>
            <p>Magic Points Collected: ${story.state.magicPoints}</p>
            <p>Hidden Objects Found: ${story.state.hiddenObjectsFound}</p>
            <p>Riddles Solved: ${story.state.riddlesSolved}</p>
            <p>Path Chosen: ${story.state.pathChosen || 'Not selected'}</p>
        `;
        
        // Celebration effects
        effects.manager.createFireworks(8);
        this.playSound('start');
    }
}

// Initialize app when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    window.app = new StorybookApp();
});
