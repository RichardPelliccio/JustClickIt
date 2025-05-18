// Changelog Modal Script
document.addEventListener('DOMContentLoaded', () => {
    // Create the modal first if it doesn't exist
    if (!document.getElementById('changelogModal')) {
        console.log("Adding changelog modal to page");
        
        // Get the modal HTML and inject it into the document
        const modalHTML = document.getElementById('changelogModal')?.outerHTML || 
            `<!-- Changelog Modal -->
            <div id="changelogModal" class="changelog-modal">
              <div class="changelog-content">
                <span class="close-changelog">&times;</span>
                <h2>Changelog</h2>
                <div class="changelog-body">
                  <div class="changelog-entry">
                    <h3>v1.2.0 - March 13, 2025</h3>
                    <ul>
                      <li>Increased maximum clicks to 1,000,000</li>
                      <li>Added rainbow color effects</li>
                      <li>Improved loading performance</li>
                      <li>Fixed audio playback issues</li>
                    </ul>
                  </div>
                  <div class="changelog-entry">
                    <h3>v1.1.0 - Previous Update</h3>
                    <ul>
                      <li>Added background music system</li>
                      <li>Added click sound effects</li>
                      <li>Implemented progress saving</li>
                    </ul>
                  </div>
                  <div class="changelog-entry">
                    <h3>v1.0.0 - Initial Release</h3>
                    <ul>
                      <li>Basic clicking game with counter</li>
                      <li>Click animations</li>
                      <li>Custom cursor</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            <!-- Changelog Button -->
            <button id="changelogButton" class="changelog-btn">Changelog</button>`;
            
        const tempContainer = document.createElement('div');
        tempContainer.innerHTML = modalHTML;
        
        // Append elements to body
        while (tempContainer.firstChild) {
            document.body.appendChild(tempContainer.firstChild);
        }
    }
    
    // Get modal elements
    const modal = document.getElementById('changelogModal');
    const btn = document.getElementById('changelogButton');
    const span = document.getElementsByClassName('close-changelog')[0];
    
    if (!modal || !btn || !span) {
        console.error("Changelog elements not found");
        return;
    }
    
    // Check if this is the first visit in this session
    const isFirstVisit = !sessionStorage.getItem('hasVisited');
    
    // Open modal when button is clicked
    btn.onclick = function() {
        modal.classList.add('active');
    };
    
    // Close modal when X is clicked
    span.onclick = function() {
        closeModal();
    };
    
    // Close modal when clicking outside of it
    window.onclick = function(event) {
        if (event.target === modal) {
            closeModal();
        }
    };
    
    // Close with ESC key
    document.addEventListener('keydown', function(event) {
        if (event.key === 'Escape' && modal.classList.contains('active')) {
            closeModal();
        }
    });
    
    // Function to close modal with animation
    function closeModal() {
        modal.classList.remove('active');
    }
    
    // Auto-show changelog for new version (uncomment and customize as needed)
    /*
    const currentVersion = "1.2.0";
    const lastSeenVersion = localStorage.getItem('lastSeenVersion');
    
    if (lastSeenVersion !== currentVersion) {
        // Show changelog on page load if there's a new version
        setTimeout(() => {
            modal.classList.add('active');
            localStorage.setItem('lastSeenVersion', currentVersion);
        }, 1000);
    }
    */
    
    // Mark that user has visited
    sessionStorage.setItem('hasVisited', 'true');
});