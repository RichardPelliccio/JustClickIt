let cookieCount = 0;
const winningScore = 1000000; // Changed to 1 million clicks

// Function to get elements only after document is fully loaded
function getElements() {
  const cookieElement = document.getElementById('cookie');
  const cookieCountElement = document.getElementById('cookieCount');
  const body = document.body;
  const volumeControl = document.getElementById('volumeControl'); // Volume control slider
  
  return { cookieElement, cookieCountElement, body, volumeControl };
}

// Create audio element for click sound
const clickSound = new Audio('click.mp3'); // Make sure to add this file to your project directory
clickSound.volume = 0.2; // Default volume to max

// Initial size of the cookie (in pixels)
let cookieSize = 150;
const maxCookieSize = 300; // Maximum size the cookie can grow to

// Maximum click count for full color transition (adjusted to 400 clicks)
const maxClicksForFullTransition = 400;

// Function to convert HSL to RGB
function hslToRgb(h, s, l) {
  let r, g, b;

  if (s === 0) {
    r = g = b = l; // achromatic
  } else {
    const hue2rgb = (p, q, t) => {
      if (t < 0) t += 1;
      if (t > 1) t -= 1;
      if (t < 1/6) return p + (q - p) * 6 * t;
      if (t < 1/2) return q;
      if (t < 2/3) return p + (q - p) * (2/3 - t) * 6;
      return p;
    };

    const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
    const p = 2 * l - q;
    r = hue2rgb(p, q, h + 1/3);
    g = hue2rgb(p, q, h);
    b = hue2rgb(p, q, h - 1/3);
  }

  return [Math.round(r * 255), Math.round(g * 255), Math.round(b * 255)];
}

// Function to get rainbow looping color
function getCookieColor(count) {
  const hue = (count % maxClicksForFullTransition) * (360 / maxClicksForFullTransition);
  const [r, g, b] = hslToRgb(hue / 360, 1, 0.5);
  return `rgb(${r}, ${g}, ${b})`;
}

// Function to get background gradient color
function getBackgroundColor(count) {
  const hue1 = (count % maxClicksForFullTransition) * (360 / maxClicksForFullTransition);
  const hue2 = ((count + maxClicksForFullTransition / 2) % maxClicksForFullTransition) * (360 / maxClicksForFullTransition);
  const [r1, g1, b1] = hslToRgb(hue1 / 360, 0.7, 0.2);
  const [r2, g2, b2] = hslToRgb(hue2 / 360, 0.7, 0.4);
  return `linear-gradient(45deg, rgb(${r1}, ${g1}, ${b1}), rgb(${r2}, ${g2}, ${b2}))`;
}

// Function to update visuals
function updateVisuals() {
  const elements = getElements();
  if (!elements.cookieElement || !elements.cookieCountElement) return;
  
  elements.cookieElement.style.backgroundColor = getCookieColor(cookieCount);
  elements.cookieElement.style.transition = 'background-color 0.3s ease-in-out';
  elements.body.style.background = getBackgroundColor(cookieCount);
  elements.body.style.transition = 'background 0.5s ease-in-out';
  elements.cookieCountElement.textContent = `Clicks: ${cookieCount.toLocaleString()}`;
}

// Function to check win condition
function checkWinCondition() {
  if (cookieCount >= winningScore) {
    saveProgress(); // Save progress before redirecting
    localStorage.setItem('winnerVerified', 'true');
    localStorage.setItem('finalScore', cookieCount);
    window.location.href = 'winner.html';
  }
}

// Save progress to localStorage
function saveProgress() {
  console.log("Saving progress: " + cookieCount + " clicks");
  localStorage.setItem('clickerGameProgress', cookieCount.toString());
  
  // Use a cookie as backup (expires in 365 days)
  document.cookie = `clickerGameProgress=${cookieCount};max-age=${60*60*24*365};path=/`;
  
  // If background music system is available, update music based on progress
  if (window.backgroundMusic) {
    window.backgroundMusic.updateMusic(cookieCount);
  }
}

// Load progress from localStorage or cookies
function loadProgress() {
  // Try localStorage first
  let savedProgress = localStorage.getItem('clickerGameProgress');
  
  // If not in localStorage, try cookies
  if (!savedProgress) {
    const cookies = document.cookie.split(';');
    for (let i = 0; i < cookies.length; i++) {
      const cookie = cookies[i].trim();
      if (cookie.startsWith('clickerGameProgress=')) {
        savedProgress = cookie.substring('clickerGameProgress='.length);
        break;
      }
    }
  }
  
  // Parse and apply if found
  if (savedProgress) {
    console.log("Loading saved progress: " + savedProgress);
    cookieCount = parseInt(savedProgress, 10) || 0;
    updateVisuals();
    
    // If background music system is available, update music based on loaded progress
    if (window.backgroundMusic) {
      window.backgroundMusic.updateMusic(cookieCount);
    }
  }
}

// Initialize the game
function initGame() {
  const elements = getElements();
  if (!elements.cookieElement) {
    console.error("Cookie element not found, delaying initialization");
    setTimeout(initGame, 100);
    return;
  }
  
  // Load saved progress
  loadProgress();
  
  // Set up click event
  elements.cookieElement.addEventListener('click', () => {
    clickSound.currentTime = 0;
    clickSound.play().catch(e => console.log("Audio playback error:", e));
    cookieCount++;
    updateVisuals();
    checkWinCondition();
    elements.cookieElement.style.transform = 'scale(0.95)';
    setTimeout(() => { elements.cookieElement.style.transform = ''; }, 100);
    
    // Update music on significant milestones
    if (window.backgroundMusic && [100, 1000, 10000, 100000].includes(cookieCount)) {
      window.backgroundMusic.updateMusic(cookieCount);
    }
  });

  // Set up volume control
  if (elements.volumeControl) {
    // Load saved click sound volume
    const savedVolume = localStorage.getItem('clickSoundVolume');
    if (savedVolume !== null) {
      clickSound.volume = parseFloat(savedVolume);
      elements.volumeControl.value = savedVolume;
    }
    
    // Handle volume changes
    elements.volumeControl.addEventListener('input', (event) => {
      clickSound.volume = event.target.value;
      // Save click sound volume setting
      localStorage.setItem('clickSoundVolume', event.target.value);
    });
  }
  
  // Save progress every 60 seconds
  setInterval(() => {
    saveProgress();
  }, 60000);
  
  // Initialize visuals
  updateVisuals();
  
  console.log("Game initialized with " + cookieCount + " clicks");
}

// Start the game after DOM is fully loaded
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initGame);
} else {
  initGame();
}