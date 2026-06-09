const registerEmailInput = document.getElementById("email-input");
const passwordInput = document.querySelectorAll(".password-input");
const repeatPasswordInput = document.getElementById("repeat-password");
const registerSubmitBtn = document.getElementById("submit-btn");
const toggleButtons = document.querySelectorAll(".toggle-password");


toggleButtons.forEach((button) => {
    button.addEventListener("click", (e) => { 
        e.preventDefault();
        const input = button.previousElementSibling;

        if (input.type === "password") {
            input.type = "text";
            button.textContent = "Hide";
        } else {
            input.type = "password";
            button.textContent = "Show";
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
