document.addEventListener("DOMContentLoaded", function () {
    const loginForm = document.getElementById("loginForm");
    if (loginForm) {
        loginForm.addEventListener("submit", function (event) {
            event.preventDefault();

            const email = document.getElementById("email").value.trim();
            const password = document.getElementById("password").value;

            if (email === "customer@gmail.com" && password === "customer1") {
                window.location.href = "../index.html";
            } else {
                alert("Invalid email or password.");
            }
        });
    }
    
    const passwordInput = document.getElementById("password");
    const passwordToggle = document.getElementById("passwordToggle");
    const passwordIcon = document.getElementById("passwordIcon");

    if (passwordToggle && passwordInput && passwordIcon) {
        passwordToggle.addEventListener("click", function () {
            if (passwordInput.type === "password") {
                passwordInput.type = "text";
                passwordIcon.src = "../image/hidden.png";
                passwordIcon.alt = "Hide password";
            } else {
                passwordInput.type = "password";
                passwordIcon.src = "../image/show.png";
                passwordIcon.alt = "Show password";
            }
        });
    }
});