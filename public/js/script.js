const registerEmailInput = document.getElementById("email-input");
const passwordInput = document.querySelectorAll(".password-input");
const repeatPasswordInput = document.getElementById("repeat-password");
const registerSubmitBtn = document.getElementById("submit-btn");
const toggleButtons = document.querySelectorAll(".toggle-password");
const togglePasswordButton = document.querySelectorAll(".toggle-password-image");


toggleButtons.forEach((button) => {
    button.addEventListener("click", (e) => { 
        e.preventDefault();
        const input = button.previousElementSibling;
        const img = button.querySelector("img");

        if (input.type === "password") {
            input.type = "text";
            img.src = "/images/passwordShowSVG.svg";
        } else {
            input.type = "password";
            img.src = "/images/passwordHideSVG.svg";
        }
    });
});


if (repeatPasswordInput) {
    registerSubmitBtn.disabled = true;

    function checkPasswords() {
        if (
            passwordInput.value === repeatPasswordInput.value &&
            passwordInput.value !== "" &&
            passwordInput.value.length > 7
        ) {
            registerSubmitBtn.disabled = false;
        } else {
            registerSubmitBtn.disabled = true;
        }
    }

    passwordInput.addEventListener("input", checkPasswords);
    repeatPasswordInput.addEventListener("input", checkPasswords);
}

setTimeout(() => {
    const flash = document.getElementById("flash-message");

    if (flash) {
        flash.classList.add("hide");

        setTimeout(() => {
            flash.remove();
        }, 500);
    }
}, 3000);
