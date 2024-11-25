// const background = document.querySelector('.background');

// document.addEventListener('mousemove', (e) => {
//     const { clientX, clientY } = e;
//     const movementX = (clientX / window.innerWidth) * 10 - 5;
//     const movementY = (clientY / window.innerHeight) * 10 - 5;

//     background.style.transform = `translate(${movementX}px, ${movementY}px)`;
// });

// Wait for the page to load
window.addEventListener('DOMContentLoaded', function() {
    // Get all links (directories)
    const links = document.querySelectorAll('nav ul li a');

    // Loop through each link and add a click event listener
    links.forEach(function(link) {
        link.addEventListener('click', function(event) {
            event.preventDefault(); // Prevent the default link behavior (navigation)

            // Apply the fade-out class to the body or any other elements
            document.body.classList.add('fade-out');

            // After the animation ends, redirect to the target page
            setTimeout(function() {
                window.location.href = link.href;
            }, 1000); // Adjust the timeout based on the fade-out duration
        });
    });
});

