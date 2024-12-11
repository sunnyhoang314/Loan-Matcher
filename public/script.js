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

let matchedPosts = [];

async function renderMatchedPosts () {
    const matchedPostsContainer = document.getElementById('matched-posts-container');
    matchedPostsContainer.innerHTML = ''; // Clear container

    // Filter matched posts
    //const matchedPosts = posts.filter(post => post.matched);
    await fetchClientMatchedPosts();
    console.log('email: ',email);
    if (matchedPosts.length === 0) {
        matchedPostsContainer.innerHTML = '<h2>You don\'t have any matched posts. Perhaps you didn\'t create a post?</h2>';
    } else {
        matchedPosts.forEach((post, index) => {
            const postElement = document.createElement('div');
            postElement.classList.add('post');
            postElement.innerHTML = `
                <h3>Your post: ${post.Ptitle} matches Loan Offer: ${post.Otitle}</h3>
                <!-- Emphasized Score -->
                <div class="score-container">
                    <p><strong>Matching Score: </strong><span class="score-badge">${post.score}</span></p>
                </div>
                <p><strong>Minimum Interest Rate: </strong>${post.minInterestRate}%</p>
                <p><strong>Minimum Term Length: </strong>${post.minTermLength}</p>
                <p><strong>Maximum Term Length: </strong>${post.maxTermLength}</p>
                <p><strong>Description: </strong>${post.description}</p>
                <p><strong>Category: </strong>${post.category}</p>
                <p><strong>Maximum Loan Amount: </strong>$${post.maxLoanAmount}</p>
                ${!post.CDecision  ? 
                `
                    <div class="post-actions">
                        <button class="accept-button" data-index="${index},${post.M_ID}">Accept</button>
                        <button class="decline-button" data-index="${index},${post.M_ID}">Decline</button>
                    </div>
                ` : post.status === "Declined" ? `
                    <p><strong>Status:</strong> Acceptance Declined</p>
                ` : `
                    <p><strong>Status:</strong> Acceptance Pending</p>
                `}
                }
            `;
            matchedPostsContainer.appendChild(postElement);
        });

        // Add event listeners for buttons
        const acceptButtons = document.querySelectorAll('.accept-button');
        const declineButtons = document.querySelectorAll('.decline-button');

        acceptButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                const [index, matchedPostID] = e.target.dataset.index.split(',');
                handleAccept(index, matchedPostID);
            });
        });
    
        declineButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                const [index,matchedPostID] = e.target.dataset.index.split(',');
                handleDecline(index, matchedPostID);
            });
        });
    }
}

async function renderMatchedOffers () {
    const matchedPostsContainer = document.getElementById('matched-posts-container');
    matchedPostsContainer.innerHTML = ''; // Clear container

    // Filter matched posts
    //const matchedPosts = posts.filter(post => post.matched);
    await fetchLoanProviderMatchedPosts();
    console.log('email: ',email);
    if (matchedPosts.length === 0) {
        matchedPostsContainer.innerHTML = '<h2>You don\'t have any matched offers. Perhaps you didn\'t create a offer?</h2>';
    } else {
        matchedPosts.forEach((post, index) => {
            const postElement = document.createElement('div');
            postElement.classList.add('post');
            postElement.innerHTML = `
                <h3>Your Offer: ${post.Otitle} matches Client Post: ${post.Ptitle}</h3>
                <!-- Emphasized Score -->
                <div class="score-container">
                    <p><strong>Matching Score: </strong><span class="score-badge">${post.score}</span></p>
                </div>
                <p><strong>Maximum Interest Rate: </strong>${post.maxInterestRate}%</p>
                <p><strong>Minimum Term Length: </strong>${post.minTermLength}</p>
                <p><strong>Maximum Term Length: </strong>${post.maxTermLength}</p>
                <p><strong>Description: </strong>${post.description}</p>
                <p><strong>Category: </strong>${post.category}</p>
                <p><strong>Desired Loan Amount: </strong>$${post.loanAmount}</p>
                ${post.status === 'Declined'  ? 
                `
                    <p><strong>Status:</strong> Acceptance Declined</p>
                ` : !post.LDecision ? `
                    <div class="post-actions">
                        <button class="accept-button" data-index="${index},${post.M_ID}">Accept</button>
                        <button class="decline-button" data-index="${index},${post.M_ID}">Decline</button>
                    </div>
                ` : `
                    <p><strong>Status:</strong> Acceptance Pending</p>
                `}
            `;
            matchedPostsContainer.appendChild(postElement);
        });

        // Add event listeners for buttons
        const acceptButtons = document.querySelectorAll('.accept-button');
        const declineButtons = document.querySelectorAll('.decline-button');

        acceptButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                const [index, matchedPostID] = e.target.dataset.index.split(',');
                handleAccept(index, matchedPostID);
            });
        });
    
        declineButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                const [index,matchedPostID] = e.target.dataset.index.split(',');
                handleDecline(index, matchedPostID);
            });
        });
    }
}

function handleAccept(index,matchedPostID) {
    fetch('/acceptPost', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            M_ID: matchedPostID,
            Email: email,
            userType: userType
        })
    })
    .then(response => response.json())
    .then(data => {
        if (data.status === "success") {
            alert(data.message);
            handleAcceptUI(index);
        } else {
            alert(data.message);
        }
    })
    .catch(error => {
        console.error('Error:', error);
    });
}

function handleAcceptUI(index) {
    // Refresh matched and accepted posts
    if(userType === "client") renderMatchedPosts();
    if(userType === "loanProvider") renderMatchedOffers();
    if(userType === "client") renderAcceptedClientPosts();;
    if(userType === "loanProvider") renderAcceptedLoanProviderPosts();
}


function handleDecline(index, matchedPostID) {
    fetch('/declinePost', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            M_ID: matchedPostID
        })
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            alert(data.message);
            handleDeclineUI(index);
        } else {
            alert(data.message);
        }
    })
    .catch(error => {
        console.error('Error:', error); 
    })
}

function handleDeclineUI(index) {

    if(userType === "client") renderMatchedPosts();  // Refresh matched posts
    if(userType === "loanProvider") renderMatchedOffers();
}

// Render posts on page load
document.addEventListener('DOMContentLoaded' , () => {
    if(userType === "client") renderMatchedPosts();
    if(userType === "loanProvider") renderMatchedOffers();
    if(userType === "client") updateMyPosts();
    if(userType === "loanProvider") updateMyOffers();
});

document.getElementById('matched-post-link').addEventListener('click', () => {
    // Hide other tabs
    document.getElementById('create-post-popup').style.display = 'none';
    document.getElementById('accepted-post-popup').style.display = 'none'; // Example for another tab

    // Show the matched posts tab
    matchedPostPopup.style.display = 'block';
    if(userType === "client") renderMatchedPosts(); // Refresh the posts if necessary
    if(userType === "loanProvider") renderMatchedOffers();
});

var acceptedPosts = [];  // Store accepted posts here

async function renderAcceptedClientPosts() {
    // Add console.log for debugging
    console.log('Rendering accepted posts. Current length:', acceptedPosts.length);

    const acceptedPostsContainer = document.getElementById('accepted-posts-container');
    
    // Additional null check
    if (!acceptedPostsContainer) {
        console.error('Could not find accepted-posts-container element');
        return;
    }

    acceptedPostsContainer.innerHTML = ''; // Clear the container
    await fetchClientMatchedPosts();
    console.log('accpetedPosts: ',acceptedPosts);  

    // Check if there are any accepted posts
    if (acceptedPosts.length === 0) {
        console.log('No accepted offers, setting empty message');
        acceptedPostsContainer.innerHTML = '<h2>You don\'t have any accepted offers.</h2>';
    } else {
        // Iterate through acceptedPosts and create post elements
        console.log(acceptedPosts);
        acceptedPosts.forEach(post => {
            const postElement = document.createElement('div');
            postElement.classList.add('post');
            postElement.innerHTML = `
                <h3>Your Post: ${post.Ptitle} - Matching Loan Offer: ${post.Otitle}</h3>
                <p><strong>Minimum Interest Rate: </strong>${post.minInterestRate}%</p>
                <p><strong>Minimum Term Length: </strong>${post.minTermLength}</p>
                <p><strong>Maximum Term Length: </strong>${post.maxTermLength}</p>
                <p><strong>Description: ${post.description}</p>
                <p><strong>Category: </strong>${post.category}</p>
                <p><strong>Maximum Loan Amount: </strong>$${post.maxLoanAmount}</p>
                <p><strong>Loan Provider Email: </strong>${post.Lemail}</p>
                <p><strong>Loan Provider Phone: </strong>${post.phone}</p>
                <p><strong>Loan Provider Name: </strong>${post.Fname} ${post.Lname}</p>
            `;
            /* <div class="post-actions">
                    ${post.status == 'Accepted'
                        ? `<button class="view-contact-button" onclick="viewContact('${post.Lemail}', '${post.contactInfo.phone}')">View Contact Information</button>`
                        : `<p>Acceptance: ${post.status}</p>`
                    }
                </div> */
            acceptedPostsContainer.appendChild(postElement);
        });
    }
}

async function renderAcceptedLoanProviderPosts() {
    // Add console.log for debugging
    console.log('Rendering accepted posts. Current length:', acceptedPosts.length);

    const acceptedPostsContainer = document.getElementById('accepted-posts-container');
    
    // Additional null check
    if (!acceptedPostsContainer) {
        console.error('Could not find accepted-posts-container element');
        return;
    }

    acceptedPostsContainer.innerHTML = ''; // Clear the container
    await fetchLoanProviderMatchedPosts();
    console.log('accpetedPosts: ',acceptedPosts);  

    // Check if there are any accepted posts
    if (acceptedPosts.length === 0) {
        console.log('No accepted posts, setting empty message');
        acceptedPostsContainer.innerHTML = '<h2>You don\'t have any accepted posts.</h2>';
    } else {
        // Iterate through acceptedPosts and create post elements
        console.log(acceptedPosts);
        acceptedPosts.forEach(post => {
            const postElement = document.createElement('div');
            postElement.classList.add('post');
            postElement.innerHTML = `
                <h3>Your Offer: ${post.Otitle} - Matching Client Post: ${post.Ptitle}</h3>
                <p><strong>Maximum Interest Rate: </strong>${post.maxInterestRate}%</p>
                <p><strong>Minimum Term Length: </strong>${post.minTermLength}</p>
                <p><strong>Maximum Term Length: </strong>${post.maxTermLength}</p>
                <p>${post.description}</p>
                <p><strong>Category: </strong>${post.category}</p>
                <p><strong>Desired Loan Amount: </strong>$${post.loanAmount}</p>
                <p><strong>Loan Provider Email: </strong>${post.Cemail}</p>
                <p><strong>Loan Provider Phone: </strong>${post.phone}</p>
                <p><strong>Loan Provider Name: </strong>${post.Fname} ${post.Lname}</p>
            `;
            /* <div class="post-actions">
                    ${post.status == 'Accepted'
                        ? `<button class="view-contact-button" onclick="viewContact('${post.Lemail}', '${post.contactInfo.phone}')">View Contact Information</button>`
                        : `<p>Acceptance: ${post.status}</p>`
                    }
                </div> */
            acceptedPostsContainer.appendChild(postElement);
        });
    }
}

// Ensure the function is called when the DOM is fully loaded
document.addEventListener('DOMContentLoaded', renderAcceptedClientPosts);
document.addEventListener('DOMContentLoaded', renderAcceptedLoanProviderPosts);

document.getElementById('accepted-post-link').addEventListener('click', () => {
    // Hide other tabs
    document.getElementById('create-post-popup').style.display = 'none';
    matchedPostPopup.style.display = 'none';
    // Show the accepted posts tab
    const acceptedPostsTab = document.getElementById('accepted-post-popup');
    acceptedPostsTab.style.display = 'block';  // Show the accepted posts popup
    if(userType === "client") renderAcceptedClientPosts(); // Refresh the posts if necessary
    if(userType === "loanProvider") renderAcceptedLoanProviderPosts();
});



// Function to view contact information
function viewContact(email, phone) {
    alert(`Contact Information:\nEmail: ${email}\nPhone: ${phone}`);
}

// Array to store posts
let myPosts = [];

// Function to update "My Posts" popup
async function updateMyPosts() {
    const myPostContainer = document.getElementById('my-posts-container');
    myPostContainer.innerHTML = ''; // Clear existing posts
    await fetchClientPosts();
    console.log(myPosts);
    myPosts.forEach((post, index) => {
        const postDiv = document.createElement('div');
        postDiv.className = 'post';

        postDiv.innerHTML = `
            <h3>${post.title}</h3>
            <p><strong>Maximum Interest Rate:</strong> ${post.maxInterestRate}%</p>
            <p><strong>Term Length:</strong> ${post.minTermLength} (min), ${post.maxTermLength} (max)</p>
            <p><strong>Description:</strong> ${post.description}</p>
            <p><strong>Category:</strong> ${post.category}</p>
            <p><strong>Desired Loan Amount:</strong> $${post.desiredAmount}</p>
            <button class  = "delete-button" data-id="${post.P_ID}">Delete</button>
        `;
        myPostContainer.appendChild(postDiv);
    });

    // Add event listeners for delete buttons
    const deleteButtons = document.querySelectorAll('.delete-button');

    deleteButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            const id = e.target.dataset.id; // Retrieve the index from data attribute
            handleClientPostDelete(id);
        });
    });
}

async function updateMyOffers() {
    const myPostContainer = document.getElementById('my-posts-container');
    myPostContainer.innerHTML = ''; // Clear existing posts
    await fetchLoanProviderPosts();
    console.log(myPosts);
    myPosts.forEach((post, index) => {
        const postDiv = document.createElement('div');
        postDiv.className = 'post';

        postDiv.innerHTML = `
            <h3>${post.title}</h3>
            <p><strong>Maximum Interest Rate:</strong> ${post.minInterestRate}%</p>
            <p><strong>Term Length:</strong> ${post.minTermLength} (min), ${post.maxTermLength} (max)</p>
            <p><strong>Description:</strong> ${post.description}</p>
            <p><strong>Category:</strong> ${post.category}</p>
            <p><strong>Minimum Loan Amount:</strong> $${post.minLoanAmount}</p>
            <p><strong>Maximum Loan Amount:</strong> $${post.maxLoanAmount}</p>
            <button class  = "delete-button" data-id="${post.O_ID}">Delete</button>
        `;
        myPostContainer.appendChild(postDiv);
    });

    // Add event listeners for delete buttons
    const deleteButtons = document.querySelectorAll('.delete-button');

    deleteButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            const id = e.target.dataset.id; // Retrieve the index from data attribute
            handleLoanPorviderPostDelete(id);
        });
    });
}

// Function to delete a post
function handleClientPostDelete(id) {
    fetch('client/deletePost', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            P_ID: id,
        })
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            alert(data.message);
            console.log("post deleted",data);
            updateMyPosts();
            renderMatchedPosts();
            renderAcceptedClientPosts();
        } else {
            alert(data.message);
            console.log("post not deleted",data);
        }
    })
    .catch(error => {
        console.error('Error:', error);
    });
}

function handleLoanPorviderPostDelete(id) {
    fetch('loanProvider/deletePost', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            O_ID: id,
        })
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            alert(data.message);
            updateMyOffers();
            renderMatchedOffers();
            renderAcceptedLoanProviderPosts();
        } else {
            alert(data.message);
        }
    })
    .catch(error => {
        console.error('Error:', error);
    });
}
// Show/Hide "My Post" Popup
const myPostLink = document.getElementById('my-post-link');
const myPostPopup = document.getElementById('my-post-popup');
const closeMyPostsButton = document.getElementById('close-my-posts');


document.addEventListener('DOMContentLoaded', () => {
    if(userType === 'client') fetchClientPosts();
    if(userType === 'loanProvider') fetchLoanProviderPosts();
})

myPostLink.addEventListener('click', (e) => {
    e.preventDefault();
    if(userType === 'client') updateMyPosts();
    if(userType === 'loanProvider') updateMyOffers();
    myPostPopup.style.display = 'block';
    closeAcceptedPostPopup();
    closeCreatePostPopup();
    closeMatchedPostPopup();
});

document.addEventListener('DOMContentLoaded', () => {
    if(userType === 'client') {
        postForm = document.getElementById('post-form')
        postForm.addEventListener('submit', (event) => {
            event.preventDefault();
            handleCreatePost();
        })
    }
    if(userType === 'loanProvider') {
        offerForm = document.getElementById('offer-form')
        offerForm.addEventListener('submit', (event) => {
            event.preventDefault();
            handleCreateOffer();
        })
    }
});

function handleCreatePost() {
    const formData = new FormData(document.getElementById("post-form"));

    fetch("client/createPost", {
        method: "POST",
        body: formData,
    })
    .then((res) => res.json())
    .then((data) => {
        if (data.status === "error") {
            Swal.fire({
            icon: "error",
            title: "Error",
            text: data.error,
            });
        } else {
            Swal.fire({
            icon: "success",
            title: "Post Created",
            text: "Your post was created successfully!",
            }).then(() => {
            // Update "My Posts" popup
                updateMyPosts();
                closeCreatePostPopup();
                myPostPopup.style.display = 'block';
                document.getElementById("post-form").reset();
            });
        }
        })
        .catch((err) => {
        Swal.fire({
            icon: "error",
            title: "Oops...",
            text: "Something went wrong!",
        });
        });
    }

function handleCreateOffer() {
    event.preventDefault();
    const formData = new FormData(document.getElementById("offer-form"));
    

    fetch("loan-provider/createOffer", {
        method: "POST",
        body: formData,
    })
    .then((res) => res.json())
    .then((data) => {
        if (data.status === "error") {
            Swal.fire({
            icon: "error",
            title: "Error",
            text: data.error,
            });
        } else {
            Swal.fire({
            icon: "success",
            title: "Offer Created",
            text: "Your offer was created successfully!",
            }).then(() => {
                updateMyOffers();
                closeCreatePostPopup();
                myPostPopup.style.display = 'block';
                document.getElementById("offer-form").reset();
            });
        }
        })
        .catch((err) => {
        Swal.fire({
            icon: "error",
            title: "Oops...",
            text: "Something went wrong!",
        });
        });
    }
    

// Fetch data from the backend
async function fetchClientPosts() {
    try{
        const response = await fetch('/client/getPosts');
        const data = await response.json();
        if (data.success) {
            // Use the data to update the UI
            console.log('data: ',data.posts);
            myPosts = data.posts;
            console.log('myposts: ',myPosts);
        } else {
            console.error('Failed to fetch posts:', data.error);
        }
    }catch (error) {
        console.error('Error fetching my posts:', error);
    }
}

async function fetchLoanProviderPosts() {
    try{
        const response = await fetch('/loanProvider/getPosts');
        const data = await response.json();
        if (data.success) {
            // Use the data to update the UI
            console.log('data: ',data.posts);
            myPosts = data.posts;
            console.log('myposts: ',myPosts);
        } else {
            console.error('Failed to fetch posts:', data.error);
        }
    }catch (error) {
        console.error('Error fetching my posts:', error);
    }
}

async function fetchClientMatchedPosts() {
    try {
        const response = await fetch('/client/getMatchedPosts');
        const data = await response.json();
        if (data.success) {
            retrievedPosts = data.posts;
            console.log('data: ', retrievedPosts);
            matchedPosts = retrievedPosts.filter(post => String(post.status).includes('Pending') || (post.status == 'Declined' && post.CDecision));
            acceptedPosts = retrievedPosts.filter(post => String(post.status).includes('Accepted'));
            console.log('matchedPosts: ', matchedPosts);
        } else {
            console.error('Failed to fetch posts:', data.error);
        }
    } catch (error) {
        console.error('Error fetching matchedposts:', error);
    }
}

async function fetchLoanProviderMatchedPosts() {
    try {
        const response = await fetch('/loanProvider/getMatchedPosts');
        const data = await response.json();
        if (data.success) {
            retrievedPosts = data.posts;
            console.log('data: ', retrievedPosts);
            matchedPosts = retrievedPosts.filter(post => post.status == 'Pending' || (post.status == 'Declined' && post.LDecision));
            acceptedPosts = retrievedPosts.filter(post => post.status == 'Accepted');
            console.log('matchedPosts: ', matchedPosts);
        } else {
            console.error('Failed to fetch posts:', data.error);
        }
    } catch (error) {
        console.error('Error fetching matchedposts:', error);
    }
}