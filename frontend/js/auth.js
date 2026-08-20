// =========================================
// OFFWEGO LOGIN
// =========================================

const loginForm = document.getElementById("loginForm");
const loginMessage = document.getElementById("loginMessage");
const loginBtn = document.getElementById("loginBtn");


// =========================================
// SHOW / HIDE PASSWORD
// =========================================

const togglePassword = document.getElementById("togglePassword");
const passwordInput = document.getElementById("password");

if (togglePassword && passwordInput) {

    togglePassword.addEventListener("click", () => {

        if (passwordInput.type === "password") {

            passwordInput.type = "text";
            togglePassword.textContent = "Hide";
            togglePassword.setAttribute(
                "aria-label",
                "Hide password"
            );

        } else {

            passwordInput.type = "password";
            togglePassword.textContent = "Show";
            togglePassword.setAttribute(
                "aria-label",
                "Show password"
            );

        }

    });

}


// =========================================
// LOGIN FORM
// =========================================

if (loginForm) {

    loginForm.addEventListener("submit", async (event) => {

        event.preventDefault();

        const email = document
            .getElementById("email")
            .value
            .trim();

        const password = document
            .getElementById("password")
            .value;

        const remember = document
            .getElementById("remember")
            .checked;


        // Clear previous message
        loginMessage.textContent = "";


        // Basic validation
        if (!email || !password) {

            loginMessage.textContent =
                "Please enter your email and password.";

            return;
        }


        // Disable button while logging in
        loginBtn.disabled = true;
        loginBtn.querySelector("span").textContent = "Logging in...";


        try {

            // Backend API
            const response = await fetch(
                "http://localhost:5000/api/auth/login",
                {
                    method: "POST",

                    headers: {
                        "Content-Type": "application/json"
                    },

                    body: JSON.stringify({
                        email: email,
                        password: password
                    })
                }
            );


            const data = await response.json();


            if (!response.ok) {

                throw new Error(
                    data.message || "Invalid email or password."
                );

            }


            // =====================================
            // LOGIN SUCCESSFUL
            // =====================================

            if (data.token) {

                if (remember) {

                    localStorage.setItem(
                        "token",
                        data.token
                    );

                } else {

                    sessionStorage.setItem(
                        "token",
                        data.token
                    );

                }

            }


            if (data.user) {

                localStorage.setItem(
                    "user",
                    JSON.stringify(data.user)
                );

            }


            loginMessage.style.color = "#2e8b57";

            loginMessage.textContent =
                "Login successful! Redirecting...";


            setTimeout(() => {

                window.location.href =
                    "dashboard.html";

            }, 800);


        } catch (error) {

            console.error("Login error:", error);

            loginMessage.style.color = "#d9534f";

            loginMessage.textContent =
                error.message ||
                "Unable to login. Please try again.";

        } finally {

            loginBtn.disabled = false;

            loginBtn.querySelector("span").textContent =
                "Log in";

        }

    });

}


// =========================================
// FORGOT PASSWORD
// =========================================

const forgotPassword =
    document.getElementById("forgotPassword");

if (forgotPassword) {

    forgotPassword.addEventListener("click", (event) => {

        event.preventDefault();

        alert(
            "Password reset functionality will be available soon."
        );

    });

}