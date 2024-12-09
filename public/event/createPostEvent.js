document.getElementById("post-form").addEventListener("submit", (event) => {
    event.preventDefault();
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
            window.location.href = "/client-main"; // Redirect to posts page
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
    });
