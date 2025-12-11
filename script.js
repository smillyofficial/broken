// --- Game Setup ---
const player = document.getElementById('player');
const prompt = document.getElementById('prompt');
const dialogueBox = document.getElementById('dialogue-box');
const dialogueText = document.getElementById('dialogue-text');
const closeDialogueButton = document.getElementById('close-dialogue');
const phaseOrbs = document.querySelectorAll('.phase-orb');
const GAME_CONTAINER_WIDTH = 800;
const GAME_CONTAINER_HEIGHT = 450;
const PLAYER_SPEED = 5;

let playerX = 385;
let playerY = 380; // Adjusted for player height
let isTalking = false;
let currentPhase = null;

// Object to store the custom stories for each phase
const phaseStories = {
    '1': "PHASE 1: Betrayal - I spent weeks learning the exploits of a competitive online game, sharing the 'cheats' only with Pao and Lemonje. It started small—a slight advantage. But when Pao's rank dropped, he publicly accused me. Lemonje, seeing an opportunity for favor, backed Pao, revealing a private chat where we planned. The two teamed up, voting me out of the main guild, leaving me to face the community's judgment alone. The 'game' ended, but the lesson in trust had just begun.",
    
    '2': "PHASE 2: Royalty and Brutality - Aiken and I formed a strong duo in an MMO; he was my 'Royal Guard.' I trusted him, even when my in-game anger management issues (lashing out, demanding perfection) caused problems. He'd always return, until one day, a charismatic 'Queen' of a rival guild called. He answered the call immediately, abandoning our joint dungeon run mid-boss. He sided with her, attracted by the glory and status, leaving me to realize my 'brutality' had simply been an excuse for him to seek a higher-status friend when one finally appeared.",
    
    '3': "PHASE 3: Lust and Gluttony - This phase started in the public chat of a large-scale war game. The 'gluttons' were players obsessed with exploiting and hoarding wealth, destroying the game's economy. The 'lustful' were those who abused anonymity, sending disturbing, inappropriate images (like 'weird stuff of children') to others in private DMs, thinking the game's chaos covered their tracks. I was caught in the middle: a witness to both the destructive greed and the sickening abuse, forced to choose between reporting the 'lust' and surviving the 'gluttony' of the ongoing in-game war.",
};

// --- Player Movement Logic ---
const keys = {};

document.addEventListener('keydown', (e) => {
    keys[e.key] = true;
    if (e.key === 'e' || e.key === 'E') {
        handleInteraction();
    }
});
document.addEventListener('keyup', (e) => {
    keys[e.key] = false;
});

function updatePlayerPosition() {
    if (isTalking) return; // Prevent movement during dialogue

    // Horizontal Movement (A/D or Left/Right)
    if (keys['a'] || keys['A'] || keys['ArrowLeft']) {
        playerX = Math.max(0, playerX - PLAYER_SPEED);
    }
    if (keys['d'] || keys['D'] || keys['ArrowRight']) {
        playerX = Math.min(GAME_CONTAINER_WIDTH - 30, playerX + PLAYER_SPEED); // 30 is player width
    }
    
    // Vertical Movement (W/S or Up/Down)
    if (keys['w'] || keys['W'] || keys['ArrowUp']) {
        playerY = Math.max(0, playerY - PLAYER_SPEED);
    }
    if (keys['s'] || keys['S'] || keys['ArrowDown']) {
        playerY = Math.min(GAME_CONTAINER_HEIGHT - 50, playerY + PLAYER_SPEED); // 50 is player height
    }

    player.style.left = `${playerX}px`;
    player.style.top = `${playerY}px`;
}

// --- Collision/Interaction Logic ---

function checkCollision(element1, element2) {
    const rect1 = element1.getBoundingClientRect();
    const rect2 = element2.getBoundingClientRect();
    
    // Need to adjust for game-container's position, but a simple check for proximity is enough
    const dx = (playerX + 15) - (element2.offsetLeft + 40); // 15 is half player width, 40 is half orb width
    const dy = (playerY + 25) - (element2.offsetTop + 40); // 25 is half player height, 40 is half orb height
    const distance = Math.sqrt(dx * dx + dy * dy);
    
    return distance < 70; // If distance is less than a threshold (70px)
}

function handleInteraction() {
    if (currentPhase && !isTalking) {
        isTalking = true;
        prompt.classList.add('hidden');
        dialogueText.textContent = phaseStories[currentPhase];
        dialogueBox.classList.remove('hidden');
    }
}

closeDialogueButton.addEventListener('click', () => {
    isTalking = false;
    dialogueBox.classList.add('hidden');
    currentPhase = null; // Reset current phase after closing dialogue
});


function gameLoop() {
    updatePlayerPosition();
    
    let isNearOrb = false;
    currentPhase = null;
    
    phaseOrbs.forEach(orb => {
        if (checkCollision(player, orb)) {
            isNearOrb = true;
            currentPhase = orb.dataset.phase;
        }
    });
    
    if (isNearOrb && !isTalking) {
        prompt.classList.remove('hidden');
    } else {
        prompt.classList.add('hidden');
    }
    
    requestAnimationFrame(gameLoop);
}

// Initial positioning and start the loop
player.style.left = `${playerX}px`;
player.style.top = `${playerY}px`;
gameLoop();
