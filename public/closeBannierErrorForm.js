console.log("hello bannier error");

const buttonBannier = document.querySelector(".close");
const banniers = document.querySelectorAll(".alert-warning");

// close the bannier when the user clicks on the close button
if (buttonBannier) {
  buttonBannier.addEventListener("click", () => {
    banniers.forEach((b) => (b.style.display = "none"));
    console.log("bannier clicked");
  });
}

setTimeout(() => {
  banniers.forEach((b) => (b.style.display = "none"));
}, 3000);
