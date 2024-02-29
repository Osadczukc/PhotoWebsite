// Declare our index variable to keep track of the current image
let index = 0; // Start with the first image

// Grab all the slider images
const sliderImages = document.querySelectorAll('.imageSlider img'); // Select all <img> tags within .imageSlider

// Function to set initial state of all images
function initializeImages() {
    sliderImages.forEach((img, idx) => {
        img.style.opacity = '0'; // Initially hide all images
        img.style.display = 'block'; // Keep them as block to maintain layout
        if (idx === 0) {
            img.style.opacity = '1'; // Only the first image is visible
        }
    });
}
// Function to transition to the next image with a fade effect
function nextImage() {
    // Hide current image
    const currentImage = sliderImages[index];
    currentImage.style.opacity = '0';
    setTimeout(() => {
        currentImage.style.display = 'none';

        // Move to the next image
        index = (index + 1) % sliderImages.length;
        const nextImage = sliderImages[index];
        nextImage.style.display = 'block';

        // Use requestAnimationFrame to ensure the display update has taken effect
        requestAnimationFrame(() => {
            // A slight delay to ensure the transition is applied
            setTimeout(() => {
                nextImage.style.opacity = '1';
            }, 10); // A tiny delay to ensure the CSS transition can take effect
        });
    }, 1000); // Corresponds to the CSS transition time
}

// Initial setup
window.onload = function () {
    initializeImages(); // Set initial image visibility
    setInterval(nextImage, 8000); // Change image every 8 seconds to account for the fade transition
};
