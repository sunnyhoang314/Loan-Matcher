// document.getElementById("offer-form").addEventListener("submit", (event) => {
//     event.preventDefault();
//     const formData = new FormData(document.getElementById("offer-form"));
    

//     fetch("loan-provider/createOffer", {
//         method: "POST",
//         body: formData,
//     })
//     .then((res) => res.json())
//     .then((data) => {
//         if (data.status === "error") {
//             Swal.fire({
//             icon: "error",
//             title: "Error",
//             text: data.error,
//             });
//         } else {
//             Swal.fire({
//             icon: "success",
//             title: "Offer Created",
//             text: "Your offer was created successfully!",
//             }).then(() => {
//             window.location.href = "/loan-provider-main"; // Redirect to posts page
//             });
//         }
//         })
//         .catch((err) => {
//         Swal.fire({
//             icon: "error",
//             title: "Oops...",
//             text: "Something went wrong!",
//         });
//         });
//     });
