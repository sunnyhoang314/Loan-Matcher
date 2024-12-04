
document.getElementById("ClientLoginForm").addEventListener("submit", (event) => {

    event.preventDefault();

    const loginForm = document.getElementById("ClientLoginForm");
    const formData = new FormData(loginForm); // Automatically collects all the form data, including the file
    console.log("Form Data:");
    for (let [key, value] of formData.entries()) {
        console.log(`${key}: ${value}`);
    }

    fetch("/login/client", {
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
                window.location.href = "/client-main";
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
