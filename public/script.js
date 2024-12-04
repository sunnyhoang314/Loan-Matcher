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
            // Prevent fade-out on Settings button
            if (link.id === 'settings-button' || link.id === 'notif-button') {
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
