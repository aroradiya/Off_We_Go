/* =========================================
   LOGIN
   ========================================= */

const loginForm = document.getElementById("loginForm");

if (loginForm) {

    loginForm.addEventListener("submit", async function (e) {

        e.preventDefault();

        const email = document.getElementById("email").value.trim();
        const password = document.getElementById("password").value;

        // Basic validation
        if (!email || !password) {
            alert("Please fill in both fields.");
            return;
        }

        const button = loginForm.querySelector("button[type='submit']");
        if (button) button.disabled = true;

        try {
            // Ask the backend to check the email and password
            const data = await OffWeGoAPI.login(email, password);

            // Keep the token and user so other pages know who is logged in
            OffWeGoAPI.saveSession(data.token, data.user);

            window.location.href = "dashboard.html";

        } catch (error) {
            alert(error.message);

        } finally {
            if (button) button.disabled = false;
        }

    });

}


/* =========================================
   SIGN UP / REGISTER
   ========================================= */

const registerForm = document.getElementById("registerForm");

if (registerForm) {

    registerForm.addEventListener("submit", async function (e) {

        e.preventDefault();

        const name = document.getElementById("name").value.trim();
        const email = document.getElementById("email").value.trim();
        const password = document.getElementById("password").value;
        const confirmPassword = document.getElementById("confirmPassword").value;

        // Check empty fields
        if (!name || !email || !password || !confirmPassword) {
            alert("Please fill in all fields.");
            return;
        }

        // Check password confirmation
        if (password !== confirmPassword) {
            alert("Passwords do not match.");
            return;
        }

        // Check password length
        if (password.length < 6) {
            alert("Password must be at least 6 characters.");
            return;
        }

        const button = registerForm.querySelector("button[type='submit']");
        if (button) button.disabled = true;

        try {
            // Ask the backend to create the account
            await OffWeGoAPI.register(name, email, password);

            alert("Account created successfully!");

            window.location.href = "login.html";

        } catch (error) {
            alert(error.message);

        } finally {
            if (button) button.disabled = false;
        }

    });

}