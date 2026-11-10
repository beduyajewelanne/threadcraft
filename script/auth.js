document.addEventListener("DOMContentLoaded", function () {
    const USERS_KEY = "threadcraft_users";
    const SESSION_KEY = "threadcraft_current_user";
    const demoUser = { fullname: "Customer", email: "customer@gmail.com", password: "customer1" };

    const authMessage = document.getElementById("auth-message");

    const showAuthMessage = function (text, type) {
        if (!authMessage) return;
        authMessage.textContent = text;
        authMessage.className = "auth-message show " + type;
    };

    const getUsers = () => {
        return JSON.parse(localStorage.getItem(USERS_KEY)) || [];
    };

    // Sign Up
    const signupForm = document.getElementById("signupForm");
    if (signupForm) {
        const emailField = document.getElementById("email");
        const passwordField = document.getElementById("password");
        const confirmField = document.getElementById("confirm-password");
        const emailError = document.getElementById("email-error");
        const passwordError = document.getElementById("password-error");
        const confirmError = document.getElementById("confirm-error");

        const setFieldError = function (input, errorElem, text) {
            if (!input || !errorElem) return;
            errorElem.textContent = text;
            if (text) input.classList.add("invalid");
            else input.classList.remove("invalid");
        };

        const checkPassword = function () {
            if (passwordField.value.length > 0 && passwordField.value.length < 6) {
                setFieldError(passwordField, passwordError, "Password must be at least 6 characters.");
                return;
            }
            setFieldError(passwordField, passwordError, "");
        };

        const checkConfirm = function () {
            if (confirmField.value.length > 0 && confirmField.value !== passwordField.value) {
                setFieldError(confirmField, confirmError, "Passwords do not match.");
                return;
            }
            setFieldError(confirmField, confirmError, "");
        };

        passwordField.addEventListener("input", function () {
            checkPassword();
            checkConfirm();
        });
        confirmField.addEventListener("input", checkConfirm);
        emailField.addEventListener("input", function () {
            setFieldError(emailField, emailError, "");
        });

        signupForm.addEventListener("submit", function (event) {
            event.preventDefault();

            const fullname = document.getElementById("fullname").value.trim();
            const email = emailField.value.trim().toLowerCase();
            const password = passwordField.value;
            const confirmPassword = confirmField.value;

            setFieldError(emailField, emailError, "");
            setFieldError(passwordField, passwordError, "");
            setFieldError(confirmField, confirmError, "");

            if (password.length < 6) {
                setFieldError(passwordField, passwordError, "Password must be at least 6 characters.");
                showAuthMessage("Please fix the errors below.", "error");
                passwordField.focus();
                return;
            }
            if (password !== confirmPassword) {
                setFieldError(confirmField, confirmError, "Passwords do not match.");
                showAuthMessage("Please fix the errors below.", "error");
                confirmField.focus();
                return;
            }

            const users = getUsers();
            if (email === demoUser.email || users.some(function (u) { return u.email === email; })) {
                setFieldError(emailField, emailError, "This email is already registered.");
                showAuthMessage("Please fix the errors below.", "error");
                emailField.focus();
                return;
            }

            users.push({ fullname: fullname, email: email, password: password });
            localStorage.setItem(USERS_KEY, JSON.stringify(users));
            
            const successModal = document.getElementById("success-modal");
            if (successModal) successModal.classList.add("show");
            setTimeout(function () {
                window.location.href = "login.html";
            }, 2000);
        });
    }

    // Login
    const loginForm = document.getElementById("loginForm");
    if (loginForm) {
        loginForm.addEventListener("submit", function (event) {
            event.preventDefault();

            const email = document.getElementById("email").value.trim().toLowerCase();
            const password = document.getElementById("password").value;

             const allUsers = [demoUser].concat(getUsers());
            const user = allUsers.find(function (u) {
                return u.email === email && u.password === password;
            });

            if (user) {
                localStorage.setItem(SESSION_KEY, JSON.stringify({
                    fullname: user.fullname,
                    email: user.email
                }));
                showAuthMessage("Login successful! Redirecting...", "success");
                setTimeout(function () {
                    window.location.href = "../customer.html";
                }, 1000);
            } else {
                showAuthMessage("Invalid email or password.", "error");
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
                passwordIcon.src = "../image/eye.png";
                passwordIcon.alt = "Show password";
            }
        });
    }
});