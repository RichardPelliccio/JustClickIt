window.addEventListener("load", () => {
    const loader = document.querySelector(".loader");

    if (loader) {
        loader.classList.add("loader--hidden");

        loader.addEventListener("transitionend", () => {
            setTimeout(() => { // Add a delay
                if (loader.parentNode === document.body) {
                    document.body.removeChild(loader);
                } else {
                    console.error("Loader is not a direct child of the body.");
                }
            }, 50); // Adjust the delay (50ms) as needed
        });
    } else {
        console.error("Loader element not found.");
    }
});