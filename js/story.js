// ========================================
// Story Data & Dialogue
// ========================================

const storyData = {
    title: "The Secret Behind the Garden Gate",
    totalPages: 8,
    
    pages: [
        // Page 1: The Discovery
        {
            id: 'page1',
            title: 'The Discovery',
            type: 'comic',
            background: 'page-discovery',
            narrative: 'It was a lazy summer afternoon when Alex first noticed the old gate hidden behind the overgrown garden...',
            
            panels: [
                {
                    id: 'panel1',
                    position: { row: '1 / 2', col: '1 / 3' },
                    content: {
                        type: 'image',
                        description: 'A young person (Alex) looking curious in a beautiful garden',
                        text: 'Alex had played in this garden a hundred times before. But today... something was different.'
                    }
                },
                {
                    id: 'panel2',
                    position: { row: '1 / 2', col: '3 / 4' },
                    content: {
                        type: 'speech',
                        speaker: 'Alex',
                        text: 'Wait... I\'ve never seen that before!'
                    }
                },
                {
                    id: 'panel3',
                    position: { row: '2 / 3', col: '1 / 4' },
                    content: {
                        type: 'interactive',
                        interactionType: 'gate',
                        description: 'An ancient, ornate gate covered in vines and glowing sparkles',
                        instruction: 'Click the gate to open it! Drag the vines away to see better.'
                    }
                }
            ],
            
            interactions: {
                type: 'gate-discovery',
                elements: {
                    gate: { id: 'gate', clickable: true },
                    vines: [
                        { id: 'vine1', draggable: true },
                        { id: 'vine2', draggable: true },
                        { id: 'vine3', draggable: true }
                    ],
                    sparkles: [
                        { id: 'sparkle1', clickable: true, lore: 'This gate has been hidden for centuries...' },
                        { id: 'sparkle2', clickable: true, lore: 'Only those who are curious can see it.' },
                        { id: 'sparkle3', clickable: true, lore: 'Magic awaits on the other side...' }
                    ]
                },
                onComplete: 'unlockPage2'
            },
            
            nextText: 'Alex pushed open the creaky gate...'
        },
        
        // Page 2: The Portal Opens
        {
            id: 'page2',
            title: 'The Portal Opens',
            type: 'visual-novel',
            background: 'page-portal',
            narrative: 'Beyond the gate, reality itself seemed to bend and swirl...',
            
            scenes: [
                {
                    id: 'scene1',
                    background: 'portal',
                    characters: ['alex'],
                    dialogue: {
                        speaker: 'Narrator',
                        text: 'The space beyond the gate shimmered with impossible colors. A swirling portal pulsed with magical energy.'
                    }
                },
                {
                    id: 'scene2',
                    background: 'portal',
                    characters: ['alex'],
                    dialogue: {
                        speaker: 'Alex',
                        text: 'This can\'t be real... but it IS! I can feel the magic!'
                    }
                }
            ],
            
            interactions: {
                type: 'portal-entry',
                elements: {
                    portal: { id: 'portal', interactive: true },
                    magicOrbs: [
                        { id: 'orb1', collectible: true },
                        { id: 'orb2', collectible: true },
                        { id: 'orb3', collectible: true },
                        { id: 'orb4', collectible: true },
                        { id: 'orb5', collectible: true }
                    ]
                },
                instruction: 'Collect the floating magic orbs, then click the portal to enter!',
                onComplete: 'unlockPage3'
            },
            
            nextText: 'With a deep breath, Alex stepped through the portal...'
        },
        
        // Page 3: Meet the Guide
        {
            id: 'page3',
            title: 'Meet the Guide',
            type: 'visual-novel',
            background: 'page-guide',
            narrative: 'On the other side, a peculiar creature was waiting...',
            
            scenes: [
                {
                    id: 'scene1',
                    background: 'magical-forest-clearing',
                    characters: ['alex', 'creature'],
                    dialogue: {
                        speaker: '???',
                        text: 'Well, well! A visitor! It\'s been SO long since anyone came through the gate!'
                    }
                },
                {
                    id: 'scene2',
                    background: 'magical-forest-clearing',
                    characters: ['alex', 'creature'],
                    dialogue: {
                        speaker: 'Alex',
                        text: 'What... what are you?'
                    }
                },
                {
                    id: 'scene3',
                    background: 'magical-forest-clearing',
                    characters: ['alex', 'creature'],
                    dialogue: {
                        speaker: 'Creature',
                        text: 'I\'m a Lumibit! My name\'s Pip. And YOU, my friend, are in the Realm of Whimsy!'
                    }
                }
            ],
            
            interactions: {
                type: 'meet-creature',
                elements: {
                    creature: { id: 'pip', clickable: true, reactions: ['happy', 'excited', 'curious'] },
                    miniGame: {
                        type: 'symbol-match',
                        instruction: 'Match the symbols to learn Pip\'s language!'
                    }
                },
                choices: [
                    {
                        id: 'choice1',
                        text: 'This place is amazing! Tell me more!',
                        nextScene: 'enthusiastic',
                        effect: { pipMood: 'excited' }
                    },
                    {
                        id: 'choice2',
                        text: 'I\'m a bit scared... but also curious.',
                        nextScene: 'reassuring',
                        effect: { pipMood: 'gentle' }
                    }
                ],
                onComplete: 'unlockPage4'
            },
            
            nextText: 'Pip became Alex\'s guide in this magical realm...'
        },
        
        // Page 4: The Whispering Forest
        {
            id: 'page4',
            title: 'The Whispering Forest',
            type: 'comic',
            background: 'page-forest',
            narrative: 'Pip led Alex deep into a forest where the trees spoke in ancient riddles...',
            
            panels: [
                {
                    id: 'panel1',
                    position: { row: '1 / 2', col: '1 / 2' },
                    content: {
                        type: 'speech',
                        speaker: 'Pip',
                        text: 'These are the Whispering Trees! They know secrets of the realm. Click them to listen!'
                    }
                },
                {
                    id: 'panel2',
                    position: { row: '1 / 3', col: '2 / 4' },
                    content: {
                        type: 'interactive',
                        interactionType: 'forest',
                        description: 'A mystical forest with glowing trees and hidden paths'
                    }
                },
                {
                    id: 'panel3',
                    position: { row: '2 / 3', col: '1 / 4' },
                    content: {
                        type: 'narrative',
                        text: 'The trees spoke in riddles, each one holding a piece of the path forward...'
                    }
                }
            ],
            
            interactions: {
                type: 'forest-navigation',
                elements: {
                    trees: [
                        { id: 'tree1', riddle: 'I have roots but no trunk. I grow but have no leaves. What am I? (Answer: A mountain)' },
                        { id: 'tree2', riddle: 'The more you take, the more you leave behind. What am I? (Answer: Footsteps)' },
                        { id: 'tree3', riddle: 'I speak without a mouth and hear without ears. What am I? (Answer: An echo)' }
                    ],
                    glowingPaths: [
                        { id: 'path1', draggable: true },
                        { id: 'path2', draggable: true },
                        { id: 'path3', draggable: true }
                    ],
                    hiddenObjects: [
                        { id: 'hidden1', type: 'fairy' },
                        { id: 'hidden2', type: 'mushroom' },
                        { id: 'hidden3', type: 'owl' }
                    ]
                },
                instruction: 'Click trees for riddles, drag glowing paths to reveal the way, find hidden creatures!',
                onComplete: 'unlockPage5'
            },
            
            nextText: 'Following the whispered wisdom, Alex discovered the way deeper into the realm...'
        },
        
        // Page 5: The Crystal Cave
        {
            id: 'page5',
            title: 'The Crystal Cave',
            type: 'visual-novel',
            background: 'page-cave',
            narrative: 'Deep underground, a cave filled with crystals that showed visions of the past...',
            
            scenes: [
                {
                    id: 'scene1',
                    background: 'crystal-cave',
                    characters: ['alex', 'pip'],
                    dialogue: {
                        speaker: 'Pip',
                        text: 'These crystals hold memories of everyone who\'s ever visited the realm. Touch one!'
                    }
                },
                {
                    id: 'scene2',
                    background: 'crystal-cave',
                    characters: ['alex', 'pip'],
                    dialogue: {
                        speaker: 'Alex',
                        text: 'Wow... I can see... another kid playing here, years ago!'
                    }
                }
            ],
            
            interactions: {
                type: 'crystal-vision',
                elements: {
                    crystals: [
                        { id: 'crystal1', vision: 'A young girl discovering the realm for the first time', clickable: true },
                        { id: 'crystal2', vision: 'Pip as a baby Lumibit, just hatched', clickable: true },
                        { id: 'crystal3', vision: 'An ancient celebration in the realm', clickable: true }
                    ],
                    crystalPuzzle: {
                        type: 'arrange-shards',
                        instruction: 'Arrange the crystal shards in the correct pattern to unlock the memory!'
                    }
                },
                onComplete: 'unlockPage6'
            },
            
            nextText: 'The crystals revealed that many children had walked this path before...'
        },
        
        // Page 6: The Bridge of Choices
        {
            id: 'page6',
            title: 'The Bridge of Choices',
            type: 'comic',
            background: 'page-bridge',
            narrative: 'A magnificent bridge appeared, splitting into three different paths...',
            
            panels: [
                {
                    id: 'panel1',
                    position: { row: '1 / 2', col: '1 / 4' },
                    content: {
                        type: 'speech',
                        speaker: 'Pip',
                        text: 'Every visitor must choose their own path. There\'s no wrong choice—just different adventures!'
                    }
                },
                {
                    id: 'panel2',
                    position: { row: '2 / 3', col: '1 / 4' },
                    content: {
                        type: 'interactive',
                        interactionType: 'bridge-choices',
                        description: 'Three magnificent paths stretch out before Alex'
                    }
                }
            ],
            
            interactions: {
                type: 'bridge-choice',
                elements: {
                    paths: [
                        { 
                            id: 'path-brave', 
                            name: 'The Path of Courage',
                            description: 'Face your fears and discover inner strength',
                            icon: '🦁'
                        },
                        { 
                            id: 'path-wisdom', 
                            name: 'The Path of Wisdom',
                            description: 'Learn ancient secrets and solve mysteries',
                            icon: '📚'
                        },
                        { 
                            id: 'path-kindness', 
                            name: 'The Path of Kindness',
                            description: 'Help others and find the power of compassion',
                            icon: '💝'
                        }
                    ],
                    floatingPlatforms: [
                        { id: 'platform1', clickable: true },
                        { id: 'platform2', clickable: true },
                        { id: 'platform3', clickable: true }
                    ]
                },
                instruction: 'Choose your path! This decision will shape your ending.',
                onComplete: 'unlockPage7'
            },
            
            nextText: 'Alex made a choice that would change everything...'
        },
        
        // Page 7: The Guardian's Challenge
        {
            id: 'page7',
            title: 'The Guardian\'s Challenge',
            type: 'visual-novel',
            background: 'page-guardian',
            narrative: 'At the end of the path, a magnificent guardian blocked the way...',
            
            scenes: [
                {
                    id: 'scene1',
                    background: 'guardian-arena',
                    characters: ['alex', 'pip', 'guardian'],
                    dialogue: {
                        speaker: 'Guardian',
                        text: 'To reach the Heart of Magic, you must prove yourself worthy! Solve my challenge!'
                    }
                },
                {
                    id: 'scene2',
                    background: 'guardian-arena',
                    characters: ['alex', 'pip'],
                    dialogue: {
                        speaker: 'Pip',
                        text: 'Don\'t worry! You\'ve got this. I believe in you!'
                    }
                }
            ],
            
            interactions: {
                type: 'guardian-challenge',
                elements: {
                    memoryGame: {
                        type: 'memory-match',
                        instruction: 'Match the pairs of magical symbols!',
                        gridSize: '4x4'
                    },
                    fallingStars: {
                        type: 'catch-stars',
                        instruction: 'Catch the falling stars!',
                        count: 10
                    }
                },
                onComplete: 'unlockPage8'
            },
            
            nextText: 'Having proven their worth, Alex could finally approach the Heart of Magic...'
        },
        
        // Page 8: The Heart of Magic
        {
            id: 'page8',
            title: 'The Heart of Magic',
            type: 'visual-novel',
            background: 'page-heart',
            narrative: 'At the center of the realm, a glowing heart of pure magic pulsed with infinite possibility...',
            
            scenes: [
                {
                    id: 'scene1',
                    background: 'heart-chamber',
                    characters: ['alex', 'pip'],
                    dialogue: {
                        speaker: 'Pip',
                        text: 'This is it... the Heart of Magic. You can absorb its power, or release it back to the world. The choice is yours.'
                    }
                },
                {
                    id: 'scene2',
                    background: 'heart-chamber',
                    characters: ['alex'],
                    dialogue: {
                        speaker: 'Alex',
                        text: 'I understand now. Magic isn\'t meant to be kept. It\'s meant to be shared.'
                    }
                }
            ],
            
            interactions: {
                type: 'final-choice',
                elements: {
                    magicHeart: { id: 'heart', clickable: true, interactive: true },
                    choices: [
                        {
                            id: 'absorb',
                            text: 'Absorb the Magic',
                            description: 'Keep the power for yourself',
                            ending: 'personal-power'
                        },
                        {
                            id: 'release',
                            text: 'Release the Magic',
                            description: 'Share it with the entire world',
                            ending: 'shared-wonder'
                        }
                    ]
                },
                onComplete: 'completeStory'
            },
            
            ending: {
                'absorb': {
                    title: 'The Keeper of Magic',
                    message: 'Alex absorbed the magic and became the new guardian of the realm. Powerful, but forever bound to this place. Pip stayed by their side, and together they protected the magic for future visitors. Some say if you\'re very lucky, you might still see them in the garden...'
                },
                'release': {
                    title: 'The Spreader of Wonder',
                    message: 'Alex released the magic, and it spread across the entire world! Gardens bloomed everywhere, children found hidden gates in their backyards, and wonder returned to everyday life. Alex and Pip became ambassadors of magic, traveling between worlds and spreading joy. The best adventures were just beginning!'
                }
            },
            
            nextText: 'And so, Alex\'s adventure came to an end... or was it just the beginning?'
        }
    ]
};

// Story state management
const storyState = {
    currentPage: 0,
    choices: [],
    magicPoints: 0,
    hiddenObjectsFound: 0,
    riddlesSolved: 0,
    pathChosen: null,
    pipMood: 'friendly',
    completed: false
};

// Save/Load functionality
function saveProgress() {
    localStorage.setItem('storybookProgress', JSON.stringify(storyState));
}

function loadProgress() {
    const saved = localStorage.getItem('storybookProgress');
    if (saved) {
        const data = JSON.parse(saved);
        Object.assign(storyState, data);
        return true;
    }
    return false;
}

function clearProgress() {
    localStorage.removeItem('storybookProgress');
    storyState.currentPage = 0;
    storyState.choices = [];
    storyState.magicPoints = 0;
    storyState.hiddenObjectsFound = 0;
    storyState.riddlesSolved = 0;
    storyState.pathChosen = null;
    storyState.pipMood = 'friendly';
    storyState.completed = false;
}

// Export story data and state
window.story = {
    data: storyData,
    state: storyState,
    saveProgress,
    loadProgress,
    clearProgress
};
