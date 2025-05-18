// Constants (for clarity and maintainability)
const JAVASCRIPT_LOADED = 2;

// Function to check if JavaScript is loaded correctly
function checkJavaScriptLoad(status) {
    if (status === JAVASCRIPT_LOADED) {
        console.log("JavaScript loaded successfully.");
        // Consider adding more relevant debugging information here
        // For example, logging specific variables or states

        // If you still want to include the image in the console (for fun):
        console.log("%c ", "font-size: 1px; padding: 100px 150px; background-size: 200px 100px; background: no-repeat url(public/consolelog.png);");
    } else {
        console.error("JavaScript initialization failed. Status:", status);
        // Consider adding more specific error handling or logging
        // For example, logging the specific error that occurred
    }
}

// Example usage (call this function after your JavaScript is initialized)
checkJavaScriptLoad(JAVASCRIPT_LOADED); // Or whatever status value you have