document.addEventListener("DOMContentLoaded", function () {
    const galleryContainer = document.getElementById("image-gallery");
    const paginationContainer = document.getElementById("pagination");
    const playPauseButton = document.getElementById("play-pause-button");

    let images = []; // We'll populate this array later
    const itemsPerPage = 9;
    let currentPage = 1;
    let isPlaying = true; // Flag to track whether automatic transition is active

    function createOverlay(altText) {
        const overlay = document.createElement("div");
        overlay.classList.add("overlay");
        overlay.textContent = altText;
        return overlay;
    }

    function displayImages(page) {
        galleryContainer.innerHTML = "";
        const startIndex = (page - 1) * itemsPerPage;
        const endIndex = startIndex + itemsPerPage;
        const pageImages = images.slice(startIndex, endIndex);

        pageImages.forEach((image) => {
            const imgElement = document.createElement("img");
            imgElement.src = image.filename;
            imgElement.alt = image.alt;

            const overlay = createOverlay(image.alt);

            const imageContainer = document.createElement("div");
            imageContainer.classList.add("image-container");
            imageContainer.appendChild(imgElement);
            imageContainer.appendChild(overlay);

            // Use mouseenter and mouseleave events
            imageContainer.addEventListener("mouseenter", function () {
                if (!document.fullscreenElement) {
                    overlay.style.display = "flex";
                }
            });

            imageContainer.addEventListener("mouseleave", function () {
                if (!document.fullscreenElement) {
                    overlay.style.display = "none";
                }
            });

            // Update this event listener to reference the imageContainer
            imageContainer.addEventListener("click", function () {
                toggleFullScreen(imageContainer);

                // Add logic to hide overlay on click if not in fullscreen
                if (!document.fullscreenElement) {
                    overlay.style.display = "none";
                }
            });

            galleryContainer.appendChild(imageContainer);
        });
    }

    function displayPagination() {
        paginationContainer.innerHTML = "";
        const totalPages = Math.ceil(images.length / itemsPerPage);

        for (let i = 1; i <= totalPages; i++) {
            const pageLink = document.createElement("a");
            pageLink.href = "#";
            pageLink.textContent = i;

            pageLink.addEventListener("click", function () {
                currentPage = i;
                displayImages(currentPage);
                updatePaginationStyles();
            });

            paginationContainer.appendChild(pageLink);
        }

        updatePaginationStyles();
    }

    function updatePaginationStyles() {
        const pageLinks = paginationContainer.querySelectorAll("a");

        pageLinks.forEach((link, index) => {
            if (index + 1 === currentPage) {
                link.style.backgroundColor = "#333";
                link.style.color = "#fff";
            }

            else {
                link.style.backgroundColor = "#fff";
                link.style.color = "#333";
            }
        });
    }

    function toggleFullScreen(imageContainer) {
        if (!document.fullscreenElement) {
            imageContainer.requestFullscreen().catch((err) => {
                console.error(`Error attempting to enable full-screen mode: $ {
                                err.message
                            }

                            `);
            });
        }

        else {
            document.exitFullscreen();
        }
    }

    async function initGallery() {

        // Fetch images from JSON file
        try {
            const response = await fetch("images.json"); // Adjust the path if needed
            images = await response.json();
        }

        catch (error) {
            console.error("Error fetching images:", error);
            return;
        }

        // Set up automatic page transition
        const transitionInterval = 5000; // Set the time interval in milliseconds (e.g., 5000ms for 5 seconds)
        let transitionIntervalId; // Variable to store the interval ID

        function autoTransition() {
            const totalPages = Math.ceil(images.length / itemsPerPage);

            if (currentPage < totalPages) {
                currentPage++;
            }

            else {
                currentPage = 1; // Loop back to the first page
            }

            displayImages(currentPage);
            updatePaginationStyles();
        }

        function togglePlayPause() {
            isPlaying = !isPlaying;

            if (isPlaying) {
                playPauseButton.textContent = "Pause";
                transitionIntervalId = setInterval(autoTransition, transitionInterval);
            }

            else {
                playPauseButton.textContent = "Play";
                clearInterval(transitionIntervalId);
            }
        }

        playPauseButton.addEventListener("click", togglePlayPause);

        // Initial display
        displayImages(currentPage);
        displayPagination();
        togglePlayPause(); // Start automatic transition
    }

    // Initialize the gallery
    initGallery();
});