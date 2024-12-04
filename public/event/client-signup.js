
document.getElementById("ClientSignupForm").addEventListener("submit", (event) => {

    event.preventDefault();

    const signupForm = document.getElementById("ClientSignupForm");
    const formData = new FormData(signupForm); // Automatically collects all the form data, including the file
    console.log("Form Data:");
    for (let [key, value] of formData.entries()) {
        console.log(`${key}: ${value}`);
    }

    fetch("/signup/client", {
        method: "POST",
        body: formData,  // Send the formData instead of JSON
    })
        .then((res) => res.json())
        .then((data) => {
            if (data.status === "error") {
                Swal.fire({
                    icon: "error",
                    title: "Error",
                    text: data.error, // Show backend error message
                });
            }else {
                // Redirect or handle success
                Swal.fire({
                    icon: "success",
                    title: "Registration Successful",
                    text: "You have registered successfully!",
                }).then(() => {
                    window.location.href = 'client-login.html';
                });
            }
        })
        .catch((error) => {
            Swal.fire({
                icon: "error",
                title: "Oops...",
                text: "Something went wrong!",
            });
        });
});
