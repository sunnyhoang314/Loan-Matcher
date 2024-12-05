// const background = document.querySelector('.background');

// document.addEventListener('mousemove', (e) => {
//     const { clientX, clientY } = e;
//     const movementX = (clientX / window.innerWidth) * 10 - 5;
//     const movementY = (clientY / window.innerHeight) * 10 - 5;

//     background.style.transform = `translate(${movementX}px, ${movementY}px)`;
// });

// Wait for the page to load
window.addEventListener('DOMContentLoaded', function () {
    // Get all links (directories)
    const links = document.querySelectorAll('nav ul li a');

    // Loop through each link and add a click event listener
    links.forEach(function (link) {
        link.addEventListener('click', function (event) {
            // Prevent fade-out on tab buttons
            if (link.id === 'settings-button' || link.id === 'notif-button' || link.id === 'create-post-link' || link.id === 'matched-post-link' || link.id === 'accepted-post-link') {
                return; // Do nothing for settings
            }

            event.preventDefault(); // Prevent the default link behavior (navigation)

            // Apply the fade-out class to the body or any other elements
            document.body.classList.add('fade-out');

            // After the animation ends, redirect to the target page
            setTimeout(function () {
                window.location.href = link.href;
            }, 1000); // Adjust the timeout based on the fade-out duration
        });
    });
});

// Sidebar handling
const sidebar = document.getElementById('settings-sidebar');
const overlay = document.getElementById('sidebar-overlay');
const settingsButton = document.getElementById('settings-button');

// Open the sidebar
settingsButton.addEventListener('click', () => {
    sidebar.classList.add('open');
    overlay.classList.add('show');
});

// Close the sidebar when clicking on the overlay
overlay.addEventListener('click', (event) => {
    closeSidebar();
});

function closeSidebar() {
    sidebar.classList.remove('open');
    overlay.classList.remove('show');
}

// Example actions for sidebar buttons
function editUserInfo() {
    closeSidebar();
    window.location.href = 'edit-client.html'; // Redirect to edit-client.html
}

function showLogout() {
    Swal.fire({
        title: 'Are you sure you want to logout?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Yes',
        cancelButtonText: 'No',
    }).then((result) => {
        if (result.isConfirmed) {
            console.log('User confirmed logout');
            fetch('/logout', {
                method: 'POST',
            }).then(response => {
                if (response.status === 200) {
                    window.location.href = '/';  // Redirect after successful logout
                } else {
                    console.error('Logout failed');
                }
            }).catch(() => {
                console.log('Error during logout');
            });
        } else {
            console.log('User canceled logout');
        }
    });
}


// JavaScript for Notification Popup
const notifButton = document.getElementById('notif-button');
const notificationPopup = document.getElementById('notification-popup');

// Show notification popup
notifButton.addEventListener('click', (event) => {
    event.stopPropagation(); // Prevent the click event from propagating to the document
    notificationPopup.style.display = 'block';
});

// Close notification popup when clicking outside of it
document.addEventListener('click', (event) => {
    if (!notificationPopup.contains(event.target) && event.target !== notifButton) {
        notificationPopup.style.display = 'none';
    }
});

// Close notification popup explicitly with a button inside the popup
function closeNotification() {
    notificationPopup.style.display = 'none';
}

// Select elements
const createPostPopup = document.getElementById('create-post-popup');
const createPostLink = document.getElementById('create-post-link');
const cancelPostButton = document.getElementById('cancel-post');

createPostPopup.classList.add('show'); // For showing
createPostPopup.classList.remove('show'); // For hiding


// Show the popup when clicking "Create Post"
createPostLink.addEventListener('click', (e) => {
    e.preventDefault(); // Prevent default link behavior
    console.log("Create Post clicked!"); // Debug log
    createPostPopup.style.display = 'block';
    closeMatchedPostPopup();
    closeAcceptedPostPopup();
    console.log("Popup display set to block");});

// Hide the popup when clicking "Cancel"
cancelPostButton.addEventListener('click', () => {
    createPostPopup.style.display = 'none'; // Hide the popup
});

// Unique Post ID Generator
function generateUniquePostID() {
    const timestamp = Date.now().toString(36); // Base-36 encoded timestamp
    const randomString = Math.random().toString(36).substring(2, 8); // Random alphanumeric string
    return `POST-${timestamp}-${randomString}`;
}

const matchedPostLink = document.getElementById('matched-post-link');
const matchedPostPopup = document.getElementById('matched-post-popup');
const acceptedPostLink = document.getElementById('accepted-post-link');
const acceptedPostPopup = document.getElementById('accepted-post-popup');

// Function to close Create Post Popup
function closeCreatePostPopup() {
    createPostPopup.style.display = 'none'; // Hide the Create Post popup
}

function closeMatchedPostPopup() {
    matchedPostPopup.style.display = 'none';
}

function closeAcceptedPostPopup() {
    acceptedPostPopup.style.display = 'none';
}

// Event listener for Matched Posts button
matchedPostLink.addEventListener('click', (e) => {
    e.preventDefault(); // Prevent default link behavior
    closeCreatePostPopup(); // Close the Create Post popup
    closeAcceptedPostPopup();
    matchedPostPopup.style.display = 'block';
    console.log('Matched Posts tab opened'); // Debug log
    // Add logic to show Matched Posts tab content
    // Example: Show matched posts and hide other tabs
});

// Event listener for Accepted Posts button
acceptedPostLink.addEventListener('click', (e) => {
    e.preventDefault(); // Prevent default link behavior
    closeCreatePostPopup(); // Close the Create Post popup
    closeMatchedPostPopup();
    acceptedPostPopup.style.display = 'block';
    console.log('Accepted Posts tab opened'); // Debug log
    // Add logic to show Accepted Posts tab content
    // Example: Show accepted posts and hide other tabs
});