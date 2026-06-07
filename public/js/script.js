const registerEmailInput = document.getElementById("email-input");
const registerPasswordInput = document.getElementById("password-input");
const repeatPasswordInput = document.getElementById("repeat-password");
const registerSubmitBtn = document.getElementById("submit-btn");


if (repeatPasswordInput) {
    registerSubmitBtn.disabled = true;

    function checkPasswords() {
        if (
            registerPasswordInput.value === repeatPasswordInput.value &&
            registerPasswordInput.value !== "" &&
            registerPasswordInput.value.length > 7
        ) {
            registerSubmitBtn.disabled = false;
        } else {
            registerSubmitBtn.disabled = true;
        }
    }

    registerPasswordInput.addEventListener("input", checkPasswords);
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
