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
            if (link.id === 'settings-button' || link.id === 'my-post-link' || link.id === 'create-post-link' || link.id === 'matched-post-link' || link.id === 'accepted-post-link') {
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
    window.location.href = '/edit-client'; // Redirect to edit-client.html
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
// const notifButton = document.getElementById('notif-button');
// const notificationPopup = document.getElementById('notification-popup');

// Show notification popup
// notifButton.addEventListener('click', (event) => {
//     event.stopPropagation(); // Prevent the click event from propagating to the document
//     notificationPopup.style.display = 'block';
// });

// Close notification popup when clicking outside of it
// document.addEventListener('click', (event) => {
//     if (!notificationPopup.contains(event.target) && event.target !== notifButton) {
//         notificationPopup.style.display = 'none';
//     }
// });

// // Close notification popup explicitly with a button inside the popup
// function closeNotification() {
//     notificationPopup.style.display = 'none';
// }

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
    closeMyPostPopup();
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

function closeMyPostPopup() {
    myPostPopup.style.display = 'none';
}

// Event listener for Matched Posts button
matchedPostLink.addEventListener('click', (e) => {
    e.preventDefault(); // Prevent default link behavior
    closeCreatePostPopup(); // Close the Create Post popup
    closeAcceptedPostPopup();
    closeMyPostPopup();
    matchedPostPopup.style.display = 'block';
});

// Event listener for Accepted Posts button
acceptedPostLink.addEventListener('click', (e) => {
    e.preventDefault(); // Prevent default link behavior
    closeCreatePostPopup(); // Close the Create Post popup
    closeMatchedPostPopup();
    closeMyPostPopup();
    acceptedPostPopup.style.display = 'block';
    console.log('Accepted Posts tab opened'); // Debug log
    // Add logic to show Accepted Posts tab content
    // Example: Show accepted posts and hide other tabs
});

// Placeholder posts
const posts = [
    { 
        title: "Loan Offer A", 
        mintermlength: "01/01/2024 to 01/01/2025", 
        maxtermlength: "01/01/2024 to 12/31/2026",
        description: "Low interest rate loan for small businesses.", 
        minloanamount: 10000, 
        mininterestrate: 5, 
        category: "Business", 
        matched: true,  // Initially available for action
        accepted: false,  // Not accepted initially
        posterAccepted: false,  // Poster hasn't accepted yet
        contactInfo: { email: "posterA@example.com", phone: "1234567890" }
    },
    { 
        title: "Loan Offer B", 
        mintermlength: "02/15/2024 to 02/15/2025", 
        maxtermlength: "02/15/2024 to 02/15/2027",
        description: "Flexible term loan for real estate projects.", 
        minloanamount: 50000, 
        mininterestrate: 3.5, 
        category: "Real Estate", 
        matched: true,  // Initially available for action
        accepted: false,  // Not accepted initially
        posterAccepted: false,  // Poster hasn't accepted yet
        contactInfo: { email: "posterb@example.com", phone: "0987654321" }
    },
    { 
        title: "Loan Offer C",
        mintermlength: "03/01/2024 to 03/01/2025", 
        maxtermlength: "03/01/2024 to 03/01/2026", 
        description: "Short-term loan for startups.", 
        minloanamount: 20000, 
        mininterestrate: 4, 
        category: "Other", 
        matched: true,  // Initially available for action
        accepted: false,  // Not accepted initially
        posterAccepted: true,  // Poster hasn't accepted yet
        contactInfo: { email: "posterc@example.com", phone: "6942066669" }
    },
    { 
        title: "Loan Offer D", 
        mintermlength: "05/01/2024 to 05/01/2025", 
        maxtermlength: "05/01/2024 to 05/01/2026",
        description: "Educational loan with no collateral.", 
        minloanamount: 15000, 
        mininterestrate: 4.2, 
        category: "Other", 
        matched: true,  // Initially available for action
        accepted: false,  // Not accepted initially
        posterAccepted: true,  // Poster hasn't accepted yet
        contactInfo: { email: "posterA@example.com", phone: "5588420123" }
    }
];

function renderMatchedPosts() {
    const matchedPostsContainer = document.getElementById('matched-posts-container');
    matchedPostsContainer.innerHTML = ''; // Clear container

    // Filter matched posts
    const matchedPosts = posts.filter(post => post.matched);

    if (matchedPosts.length === 0) {
        matchedPostsContainer.innerHTML = '<h2>You don\'t have any matched posts. Perhaps you didn\'t create a post?</h2>';
    } else {
        matchedPosts.forEach((post, index) => {
            const postElement = document.createElement('div');
            postElement.classList.add('post');
            postElement.innerHTML = `
                <h3>${post.title}</h3>
                <p><strong>Minimum Interest Rate: </strong>${post.mininterestrate}%</p>
                <p><strong>Minimum Term Length: </strong>${post.mintermlength}</p>
                <p><strong>Maximum Term Length: </strong>${post.maxtermlength}</p>
                <p>${post.description}</p>
                <p><strong>Category: </strong>${post.category}</p>
                <p><strong>Minimum Loan Amount: </strong>$${post.minloanamount}</p>
                <div class="post-actions">
                    <button class="accept-button" data-index="${index}">Accept</button>
                    <button class="decline-button" data-index="${index}">Decline</button>
                </div>
            `;
            matchedPostsContainer.appendChild(postElement);
        });

        // Add event listeners for buttons
        const acceptButtons = document.querySelectorAll('.accept-button');
        const declineButtons = document.querySelectorAll('.decline-button');

        acceptButtons.forEach(button => {
            button.addEventListener('click', (e) => handleAccept(e.target.dataset.index));
        });

        declineButtons.forEach(button => {
            button.addEventListener('click', (e) => handleDecline(e.target.dataset.index));
        });
    }
}

function handleAccept(index) {
    const post = posts[index];

    // Mark the post as accepted
    post.accepted = true;
    post.matched = false;  // Remove it from the matched list

    // Log which post is accepted
    console.log(`Accepting post at index: ${index}, Post Title: ${post.title}`);

    // Add to the accepted posts list
    acceptedPosts.push(post);

    // Remove the accepted post from the array
    posts.splice(index, 1);  // This removes the post at the given index

    // Refresh matched and accepted posts
    renderMatchedPosts();
    renderAcceptedPosts();
}


function handleDecline(index) {
    const post = posts[index];
    post.accepted = false;  // Keep as not accepted
    post.matched = false;  // Remove from the matched section
    posts.splice(index, 1);  // This removes the post at the given index
    alert(`You declined the post: ${post.title}`);
    renderMatchedPosts();  // Refresh matched posts
}

// Render posts on page load
document.addEventListener('DOMContentLoaded', () => {
    renderMatchedPosts();
});

document.getElementById('matched-post-link').addEventListener('click', () => {
    // Hide other tabs
    document.getElementById('create-post-popup').style.display = 'none';
    document.getElementById('accepted-post-popup').style.display = 'none'; // Example for another tab

    // Show the matched posts tab
    const matchedPostsTab = document.getElementById('matched-posts-popup');
    matchedPostsTab.style.display = 'block';
    renderMatchedPosts(); // Refresh the posts if necessary
});

const acceptedPosts = [];  // Store accepted posts here

function renderAcceptedPosts() {
    const acceptedPostsContainer = document.getElementById('accepted-posts-container');
    acceptedPostsContainer.innerHTML = ''; // Clear the container

    // Check if there are any accepted posts
    if (acceptedPosts.length === 0) {
        acceptedPostsContainer.innerHTML = '<h2>You don\'t have any accepted posts.</h2>';
    } else {
        // Iterate through acceptedPosts and create post elements
        acceptedPosts.forEach(post => {
            const postElement = document.createElement('div');
            postElement.classList.add('post');
            postElement.innerHTML = `
                <h3>${post.title}</h3>
                <p><strong>Minimum Interest Rate: </strong>${post.mininterestrate}%</p>
                <p><strong>Minimum Term Length: </strong>${post.mintermlength}</p>
                <p><strong>Maximum Term Length: </strong>${post.maxtermlength}</p>
                <p>${post.description}</p>
                <p><strong>Category: </strong>${post.category}</p>
                <p><strong>Minimum Loan Amount: </strong>$${post.minloanamount}</p>
                <div class="post-actions">
                    ${post.posterAccepted
                        ? `<button class="view-contact-button" onclick="viewContact('${post.contactInfo.email}', '${post.contactInfo.phone}')">View Contact Information</button>`
                        : '<p>Acceptance Pending</p>'
                    }
                </div>
            `;
            acceptedPostsContainer.appendChild(postElement);
        });
    }
}

document.getElementById('accepted-post-link').addEventListener('click', () => {
    // Hide other tabs
    document.getElementById('create-post-popup').style.display = 'none';
    document.getElementById('matched-posts-popup').style.display = 'none';

    // Show the accepted posts tab
    const acceptedPostsTab = document.getElementById('accepted-post-popup');
    acceptedPostsTab.style.display = 'block';  // Show the accepted posts popup
    renderAcceptedPosts(); // Refresh the posts if necessary
});



// Function to view contact information
function viewContact(email, phone) {
    alert(`Contact Information:\nEmail: ${email}\nPhone: ${phone}`);
}

// Array to store posts
let myPosts = [];

// Capture form submission
const postForm = document.getElementById('post-form');
postForm.addEventListener('submit', (event) => {
    event.preventDefault();

    // Get form data
    const post = {
        title: document.getElementById('title').value,
        maxRate: document.getElementById('max-rate').value,
        minStartDate: document.getElementById('min-start-date').value,
        minEndDate: document.getElementById('min-end-date').value,
        maxStartDate: document.getElementById('max-start-date').value,
        maxEndDate: document.getElementById('max-end-date').value,
        description: document.getElementById('post-description').value,
        category: document.getElementById('post-category').value,
        maxAmount: document.getElementById('post-max-amount').value,
    };

    // Add post to myPosts array
    myPosts.push(post);

    // Clear the form
    postForm.reset();

    // Hide the "Create Post" popup
    document.getElementById('create-post-popup').style.display = 'none';

    // Update "My Posts" popup
    updateMyPosts();
});

// Function to update "My Posts" popup
function updateMyPosts() {
    const myPostContainer = document.getElementById('my-posts-container');
    myPostContainer.innerHTML = ''; // Clear existing posts

    myPosts.forEach((post, index) => {
        const postDiv = document.createElement('div');
        postDiv.className = 'post';

        postDiv.innerHTML = `
            <h3>${post.title}</h3>
            <p><strong>Interest Rate:</strong> ${post.maxRate}%</p>
            <p><strong>Term Length:</strong> ${post.minStartDate} to ${post.minEndDate} (min), ${post.maxStartDate} to ${post.maxEndDate} (max)</p>
            <p><strong>Description:</strong> ${post.description}</p>
            <p><strong>Category:</strong> ${post.category}</p>
            <p><strong>Maximum Loan Amount:</strong> $${post.maxAmount}</p>
            <button onclick="deletePost(${index})">Delete</button>
        `;

        myPostContainer.appendChild(postDiv);
    });
}

// Function to delete a post
function deletePost(index) {
    myPosts.splice(index, 1);
    updateMyPosts();
}

// Show/Hide "My Post" Popup
const myPostLink = document.getElementById('my-post-link');
const myPostPopup = document.getElementById('my-post-popup');
const closeMyPostsButton = document.getElementById('close-my-posts');

myPostLink.addEventListener('click', (e) => {
    e.preventDefault();
    myPostPopup.style.display = 'block';
    closeAcceptedPostPopup();
    closeCreatePostPopup();
    closeMatchedPostPopup();
});

