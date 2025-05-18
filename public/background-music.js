/**
 * Background Music System for Click Me Game
 * Handles 5 different music tracks that change based on progress
 * Auto-plays on website load
 */

class MusicSystem {
  constructor() {
    this.currentMusic = null;
    this.currentTrack = 0;
    this.volume = 0.3; // Lower default volume (30%) for better user experience
    this.isMuted = false;
    this.hasInteracted = false;
    
    // Track definitions - add your MP3 files to the project directory
    this.tracks = [
      { file: 'Mozart - Eine Kleine Nachtmusik.mp3', unlockAt: 0 },         // Starting music
      { file: 'Spring (La Primavera) Op.8 No.1 E Major_ Allegro.mp3', unlockAt: 100 },       // Unlocks at 100 clicks
      { file: 'Hungarian Dance no. 5.mp3', unlockAt: 1000 },      // Unlocks at 1,000 clicks
      { file: 'In The Hall of The Mountain King - Edvard Grieg (Remastered).mp3', unlockAt: 10000 },     // Unlocks at 10,000 clicks
      { file: 'Clair de Lune (Studio Version).mp3', unlockAt: 100000 }     // Unlocks at 100,000 clicks
    ];
    
    // Create audio element
    this.audioElement = new Audio();
    this.audioElement.loop = true;
    this.audioElement.volume = this.volume;
    this.audioElement.autoplay = true; // Enable autoplay
    
    // Auto-play next track when one ends
    this.audioElement.addEventListener('ended', () => {
      this.playNextTrack();
    });
    
    // Load saved state before creating interface
    this.loadState();
    
    // Initialize music interface elements
    this.createMusicInterface();
    
    // Set up event listeners to detect user interaction
    this.setupInteractionDetection();
  }
  
  // Set up event listeners to detect first user interaction
  setupInteractionDetection() {
    const interactionEvents = ['click', 'touchstart', 'keydown'];
    
    const handleFirstInteraction = () => {
      if (!this.hasInteracted) {
        this.hasInteracted = true;
        // Try to play audio after user interaction
        this.audioElement.play().catch(e => console.log("Still couldn't play audio:", e));
        
        // Remove all event listeners after first interaction
        interactionEvents.forEach(event => {
          document.removeEventListener(event, handleFirstInteraction);
        });
      }
    };
    
    // Add event listeners
    interactionEvents.forEach(event => {
      document.addEventListener(event, handleFirstInteraction);
    });
  }
  
  // Creates UI for music controls
  createMusicInterface() {
    // Create container
    const musicControls = document.createElement('div');
    musicControls.className = 'music-controls';
    musicControls.style.position = 'fixed';
    musicControls.style.bottom = '20px';
    musicControls.style.right = '20px';
    musicControls.style.background = 'rgba(0, 0, 0, 0.5)';
    musicControls.style.padding = '10px';
    musicControls.style.borderRadius = '5px';
    musicControls.style.color = 'white';
    musicControls.style.zIndex = '100';
    
    // Create music toggle button
    const toggleButton = document.createElement('button');
    toggleButton.textContent = this.isMuted ? '🔇' : '🔊';
    toggleButton.style.background = 'none';
    toggleButton.style.border = '1px solid white';
    toggleButton.style.borderRadius = '5px';
    toggleButton.style.color = 'white';
    toggleButton.style.padding = '5px 10px';
    toggleButton.style.cursor = 'pointer';
    toggleButton.style.marginRight = '10px';
    
    toggleButton.addEventListener('click', () => {
      this.toggleMute();
      toggleButton.textContent = this.isMuted ? '🔇' : '🔊';
      this.saveState(); // Save state immediately after change
    });
    
    // Create track info display
    const trackInfo = document.createElement('span');
    trackInfo.id = 'track-info';
    trackInfo.textContent = 'Music loading...';
    
    // Create volume slider
    const volumeSlider = document.createElement('input');
    volumeSlider.type = 'range';
    volumeSlider.min = '0';
    volumeSlider.max = '100';
    volumeSlider.value = this.volume * 100;
    volumeSlider.style.width = '100px';
    volumeSlider.style.marginLeft = '10px';
    
    volumeSlider.addEventListener('input', (e) => {
      this.setVolume(e.target.value / 100);
      this.saveState(); // Save state immediately after change
    });
    
    // Add elements to control panel
    musicControls.appendChild(toggleButton);
    musicControls.appendChild(trackInfo);
    musicControls.appendChild(volumeSlider);
    
    // Add to document
    document.body.appendChild(musicControls);
    
    // Store reference
    this.trackInfoElement = trackInfo;
    this.toggleButton = toggleButton;
    this.volumeSlider = volumeSlider;
    
    // Update display
    this.updateTrackInfo();
  }
  
  // Update the music based on click count
  updateMusic(clickCount) {
    console.log("Updating music based on click count:", clickCount);
    // Find the highest track unlocked
    let highestUnlocked = 0;
    
    for (let i = 0; i < this.tracks.length; i++) {
      if (clickCount >= this.tracks[i].unlockAt) {
        highestUnlocked = i;
      } else {
        break;
      }
    }
    
    // If a new track is unlocked, play it
    if (highestUnlocked > this.currentTrack) {
      console.log("New track unlocked:", this.tracks[highestUnlocked].file);
      this.currentTrack = highestUnlocked;
      this.playTrack(this.currentTrack);
      
      // Show notification for new music
      this.showUnlockNotification(this.tracks[this.currentTrack].file);
      
      // Save state when track changes
      this.saveState();
    }
  }
  
  // Play a specific track
  playTrack(trackIndex) {
    if (trackIndex >= 0 && trackIndex < this.tracks.length) {
        // Save the current position if switching tracks
        const wasPlaying = !this.audioElement.paused;

        // Set the new source
        this.audioElement.src = this.tracks[trackIndex].file;
        this.currentTrack = trackIndex;

        // Update track info display
        this.updateTrackInfo();

        // If it was playing before, try to play the new track
        if (wasPlaying && this.hasInteracted) {
            this.audioElement.play().catch(e => {
                console.log("Audio playback error:", e);
            });
        }
        
        // Save state after track change
        this.saveState();
    }
  }
  
  // Show a notification when new music is unlocked
  showUnlockNotification(trackName) {
    // Create notification element
    const notification = document.createElement('div');
    notification.textContent = `🎵 New music unlocked: ${trackName.replace('.mp3', '')}`;
    notification.style.position = 'fixed';
    notification.style.top = '20px';
    notification.style.left = '50%';
    notification.style.transform = 'translateX(-50%)';
    notification.style.background = 'rgba(0, 0, 0, 0.7)';
    notification.style.color = 'white';
    notification.style.padding = '10px 20px';
    notification.style.borderRadius = '5px';
    notification.style.zIndex = '1000';
    
    // Add to document
    document.body.appendChild(notification);
    
    // Remove after 3 seconds
    setTimeout(() => {
      notification.style.opacity = '0';
      notification.style.transition = 'opacity 1s';
      setTimeout(() => {
        document.body.removeChild(notification);
      }, 1000);
    }, 3000);
  }
  
  // Play next track
  playNextTrack() {
    const nextTrack = (this.currentTrack + 1) % this.tracks.length;
    this.playTrack(nextTrack);
  }
  
  // Toggle mute state
  toggleMute() {
    this.isMuted = !this.isMuted;
    this.audioElement.muted = this.isMuted;
    
    // Update button if available
    if (this.toggleButton) {
      this.toggleButton.textContent = this.isMuted ? '🔇' : '🔊';
    }
    
    this.saveState(); // Save state after toggling mute
  }
  
  // Set volume (0-1)
  setVolume(volume) {
    this.volume = Math.max(0, Math.min(1, volume));
    this.audioElement.volume = this.volume;
    
    // Update slider if available
    if (this.volumeSlider) {
      this.volumeSlider.value = this.volume * 100;
    }
    
    this.saveState(); // Save state after changing volume
  }
  
  // Update the track info display
  updateTrackInfo() {
    if (this.trackInfoElement && this.currentTrack < this.tracks.length) {
      const trackName = this.tracks[this.currentTrack].file.replace('.mp3', '');
      this.trackInfoElement.textContent = `Playing: ${trackName}`;
    }
  }
  
  // Save current music state to localStorage and cookies
  saveState() {
    const musicState = {
      currentTrack: this.currentTrack,
      volume: this.volume,
      isMuted: this.isMuted
    };
    
    // Save to localStorage
    localStorage.setItem('backgroundMusicState', JSON.stringify(musicState));
    
    // Also save to cookies as backup (expires in 365 days)
    const stateStr = JSON.stringify(musicState);
    document.cookie = `backgroundMusicState=${encodeURIComponent(stateStr)};max-age=${60*60*24*365};path=/`;
    
    console.log("Music state saved:", musicState);
  }
  
  // Load saved music state from localStorage or cookies
  loadState() {
    // Try localStorage first
    let savedState = localStorage.getItem('backgroundMusicState');
    
    // If not in localStorage, try cookies
    if (!savedState) {
      const cookies = document.cookie.split(';');
      for (let i = 0; i < cookies.length; i++) {
        const cookie = cookies[i].trim();
        if (cookie.startsWith('backgroundMusicState=')) {
          savedState = decodeURIComponent(cookie.substring('backgroundMusicState='.length));
          break;
        }
      }
    }
    
    // Parse and apply if found
    if (savedState) {
      try {
        const musicState = JSON.parse(savedState);
        console.log("Loading saved music state:", musicState);
        
        this.currentTrack = musicState.currentTrack !== undefined ? musicState.currentTrack : 0;
        this.volume = musicState.volume !== undefined ? musicState.volume : 0.3;
        this.isMuted = musicState.isMuted !== undefined ? musicState.isMuted : false;
        
        // Apply loaded settings
        this.audioElement.volume = this.volume;
        this.audioElement.muted = this.isMuted;
        
        // Only set source if we have track info
        if (this.currentTrack < this.tracks.length) {
          this.audioElement.src = this.tracks[this.currentTrack].file;
        }
      } catch (e) {
        console.error("Error loading music state:", e);
      }
    }
  }
  
  // Initialize the music system
  init() {
    // Set up auto-save interval (every 60 seconds)
    setInterval(() => {
      this.saveState();
    }, 60000);
    
    // Try to play if we have track info
    if (this.audioElement.src) {
      this.audioElement.play().catch(e => {
        console.log("Audio autoplay blocked. Will play after user interaction:", e);
      });
    } else {
      // If no saved state, start with first track
      this.playTrack(0);
    }
  }
}

// Create and export the music system
const backgroundMusic = new MusicSystem();

// Initialize on window load
window.addEventListener('load', () => {
  backgroundMusic.init();
});

// Export so it can be used from other scripts
window.backgroundMusic = backgroundMusic;