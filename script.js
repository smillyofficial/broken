// --- Game Variables ---
let pixels = 0;
let clickPower = 1;

// Define the buildings/upgrades
const buildings = [
    { 
        id: 'autoClicker', 
        name: 'Auto-Clicker', 
        baseCost: 15, 
        basePps: 0.1, 
        count: 0 
    },
    { 
        id: 'sharkGenerator', 
        name: 'Shark Generator', 
        baseCost: 100, 
        basePps: 1, 
        count: 0 
    },
    { 
        id: 'mcdonaldsFactory', 
        name: 'McDonald\'s Factory', 
        baseCost: 1100, 
        basePps: 8, 
        count: 0 
    }
    // Add more buildings here (e.g., 'Pixel Bank', 'Cosmic Portal')
];

// --- DOM Elements ---
const pixelCountElement = document.getElementById('pixel-count');
const ppsCountElement = document.getElementById('pps-count');
const avatarClicker = document.getElementById('avatar-clicker');
const upgradeList = document.getElementById('upgrade-list');
const saveButton = document.getElementById('save-button');
const resetButton = document.getElementById('reset-button');

// --- Helper Functions ---

/** Calculates the exponential cost of a building. */
function getCost(building) {
    // Formula: Base Cost * (1.15 ^ count)
    return Math.floor(building.baseCost * Math.pow(1.15, building.count));
}

/** Calculates total Pixels Per Second from all buildings. */
function calculatePps() {
    let totalPps = 0;
    buildings.forEach(b => {
        totalPps += b.count * b.basePps;
    });
    return totalPps;
}

/** Updates the displayed pixel count and PPS. */
function updateDisplay() {
    const totalPps = calculatePps();
    
    // Update main stats
    pixelCountElement.textContent = Math.floor(pixels).toLocaleString();
    ppsCountElement.textContent = totalPps.toFixed(1);

    // Update building displays and button states
    buildings.forEach(building => {
        const cost = getCost(building);
        const buyButton = document.getElementById(`buy-${building.id}`);
        const countDisplay = document.getElementById(`count-${building.id}`);
        const costDisplay = document.getElementById(`cost-${building.id}`);

        if (countDisplay) countDisplay.textContent = building.count.toLocaleString();
        if (costDisplay) costDisplay.textContent = cost.toLocaleString();

        // Enable/disable buy button
        if (buyButton) {
            buyButton.disabled = pixels < cost;
        }
    });
}

/** Handles the purchase of a building. */
function buyBuilding(buildingId) {
    const building = buildings.find(b => b.id === buildingId);
    const cost = getCost(building);

    if (pixels >= cost) {
        pixels -= cost;
        building.count++;
        updateDisplay();
    }
}

/** Renders the building list in the store panel. */
function renderBuildings() {
    upgradeList.innerHTML = '';
    buildings.forEach(building => {
        const cost = getCost(building);
        
        const html = `
            <div class="building">
                <div class="building-info">
                    <strong>${building.name}</strong> 
                    <span class="building-count" id="count-${building.id}">0</span>
                    <p>Cost: <span id="cost-${building.id}">${cost.toLocaleString()}</span> Pixels</p>
                    <p>Produces: ${building.basePps} PPS</p>
                </div>
                <button 
                    class="buy-button" 
                    id="buy-${building.id}" 
                    onclick="buyBuilding('${building.id}')">
                    Buy
                </button>
            </div>
        `;
        upgradeList.insertAdjacentHTML('beforeend', html);
    });
}

// --- Save/Load Functions ---

function saveGame() {
    const gameData = {
        pixels: pixels,
        clickPower: clickPower,
        buildings: buildings.map(b => ({ id: b.id, count: b.count }))
    };
    localStorage.setItem('pixelClickerSave', JSON.stringify(gameData));
    alert('Game Saved!');
}

function loadGame() {
    const savedData = localStorage.getItem('pixelClickerSave');
    if (savedData) {
        const data = JSON.parse(savedData);
        pixels = data.pixels || 0;
        clickPower = data.clickPower || 1;
        
        // Merge saved counts back into the buildings array
        data.buildings.forEach(savedB => {
            const currentB = buildings.find(b => b.id === savedB.id);
            if (currentB) {
                currentB.count = savedB.count;
            }
        });
        alert('Game Loaded!');
    }
}

function resetGame() {
    if (confirm("Are you sure you want to reset all progress?")) {
        localStorage.removeItem('pixelClickerSave');
        pixels = 0;
        clickPower = 1;
        buildings.forEach(b => b.count = 0);
        renderBuildings(); // Re-render to show zero counts
        updateDisplay();
        alert('Game Reset!');
    }
}

// --- Event Listeners and Game Loop ---

// Main Click Handler
avatarClicker.addEventListener('click', () => {
    pixels += clickPower;
    updateDisplay();
});

// Utility Button Handlers
saveButton.addEventListener('click', saveGame);
resetButton.addEventListener('click', resetGame);

// Game Loop (The main PPS calculation)
setInterval(() => {
    const totalPps = calculatePps();
    pixels += totalPps;
    updateDisplay();
}, 1000); // Runs every 1000 milliseconds (1 second)

// --- Initialization ---
document.addEventListener('DOMContentLoaded', () => {
    loadGame();       // Load saved data first
    renderBuildings(); // Draw the store items
    updateDisplay();  // Initial display update
});
