// Developer Console Commands
// Add this code to game.js or create a new file and include it in index.html

class DevConsole {
    constructor() {
      this.isAuthenticated = false;
      this.username = null;
      this.commandPrefix = "/";
      this.users = null;
      
      // Initialize the console
      this.init();
    }
    
    async init() {
      // Listen for keydown events to catch console commands
      window.addEventListener('keydown', (e) => {
        // Check for / key to start command input
        if (e.key === '/' && !e.ctrlKey && !e.metaKey && !e.altKey) {
          e.preventDefault();
          this.promptCommand();
        }
      });
      
      // Try to load user database
      try {
        const response = await fetch('db.json');
        if (!response.ok) {
          console.error('Failed to load user database:', response.statusText);
          return;
        }
        this.users = await response.json();
        console.log('%c🔑 Developer console initialized. Use "devConsole.processCommand("/help");" to access commands.', 'color: #4CAF50; font-weight: bold;');
      } catch (error) {
        console.error('Error loading user database:', error);
      }
    }
    
    promptCommand() {
      const commandInput = prompt('Enter developer command:');
      if (!commandInput) return;
      
      this.processCommand(commandInput);
    }
    
    processCommand(input) {
      // Check if input starts with the command prefix
      if (!input.startsWith(this.commandPrefix)) {
        this.showError('Commands must start with "/"');
        return;
      }
      
      // Remove prefix and split into command parts
      const parts = input.substring(1).trim().split(' ');
      const command = parts[0].toLowerCase();
      
      // Process different commands
      switch (command) {
        case 'login':
          this.handleLogin(parts.slice(1));
          break;
        case 'logout':
          this.handleLogout();
          break;
        case 'cookie':
          this.handleCookieCommand(parts.slice(1));
          break;
        case 'help':
          this.showHelp();
          break;
        default:
          this.showError(`Unknown command: ${command}`);
      }
    }
    
    handleLogin(args) {
      if (args.length < 2) {
        this.showError('Usage: /login username password');
        return;
      }
      
      const [username, password] = args;
      
      // Check if database is loaded
      if (!this.users) {
        this.showError('User database not loaded');
        return;
      }
      
      // Find user in database
      const user = this.users.find(u => u.username === username);
      
      if (!user) {
        this.showError('Invalid username or password');
        return;
      }
      
      // Verify password
      if (user.password === password) {
        this.isAuthenticated = true;
        this.username = username;
        this.showSuccess(`Logged in as ${username}`);
      } else {
        this.showError('Invalid username or password');
      }
    }
    
    handleLogout() {
      if (!this.isAuthenticated) {
        this.showError('Not logged in');
        return;
      }
      
      this.isAuthenticated = false;
      this.username = null;
      this.showSuccess('Logged out successfully');
    }
    
    handleCookieCommand(args) {
      // Check if authenticated
      if (!this.isAuthenticated) {
        this.showError('Authentication required. Use /login username password');
        return;
      }
      
      if (args.length < 2) {
        this.showError('Usage: /cookie set number');
        return;
      }
      
      const [action, value] = args;
      
      if (action === 'set') {
        const newCount = parseInt(value, 10);
        
        if (isNaN(newCount)) {
          this.showError('Invalid number');
          return;
        }
        
        // Set the cookie count
        if (typeof cookieCount !== 'undefined') {
          cookieCount = newCount;
          updateVisuals();
          this.showSuccess(`Cookie count set to ${newCount.toLocaleString()}`);
          
          // Log the action
          console.log(`%c👨‍💻 DEV ACTION: ${this.username} set cookie count to ${newCount.toLocaleString()}`, 'color: #FF9800; font-weight: bold;');
        } else {
          this.showError('Game variables not accessible');
        }
      } else {
        this.showError(`Unknown cookie action: ${action}`);
      }
    }
    
    showHelp() {
      console.log('%c=== Developer Console Commands ===', 'color: #2196F3; font-weight: bold;');
      console.log('%c/login username password', 'color: #2196F3;', '- Login with developer credentials');
      console.log('%c/logout', 'color: #2196F3;', '- Log out of developer console');
      console.log('%c/cookie set number', 'color: #2196F3;', '- Set cookie count to specified number');
      console.log('%c/help', 'color: #2196F3;', '- Show this help message');
    }
    
    showError(message) {
      console.error(`%c❌ DEV ERROR: ${message}`, 'color: #F44336; font-weight: bold;');
    }
    
    showSuccess(message) {
      console.log(`%c✅ DEV SUCCESS: ${message}`, 'color: #4CAF50; font-weight: bold;');
    }
  }
  
  // Initialize the developer console
  const devConsole = new DevConsole();