// const loginForm = document.getElementById("loginForm");

// loginForm.addEventListener("submit", async (e) => {

//     e.preventDefault();

//     const email = document
//         .getElementById("email")
//         .value
//         .trim();

//     const password = document
//         .getElementById("password")
//         .value;

//     const remember = document
//         .getElementById("remember")
//         .checked;


//     // Basic validation
//     if (!email || !password) {
//         alert("Please fill in both fields.");
//         return;
//     }


//     console.log("Login attempt:", {
//         email,
//         password,
//         remember
//     });


//     /*
//     =========================================
//     BACKEND CONNECTION
//     =========================================

//     Later replace the console.log above with:

//     try {

//         const response = await fetch(
//             "http://localhost:5000/api/auth/login",
//             {
//                 method: "POST",

//                 headers: {
//                     "Content-Type": "application/json"
//                 },

//                 body: JSON.stringify({
//                     email,
//                     password
//                 })
//             }
//         );

//         const data = await response.json();

//         if (!response.ok) {
//             alert(data.message || "Login failed.");
//             return;
//         }

//         localStorage.setItem(
//             "token",
//             data.token
//         );

//         window.location.href = "dashboard.html";

//     } catch (error) {

//         console.error(error);

//         alert(
//             "Unable to connect to the server."
//         );
//     }
//     */

// });

```javascript
/* =========================================
   LOGIN
   ========================================= */

const loginForm = document.getElementById("loginForm");

if (loginForm) {

    loginForm.addEventListener("submit", async (e) => {

        e.preventDefault();

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


        // Basic validation
        if (!email || !password) {
            alert("Please fill in both fields.");
            return;
        }


        console.log("Login attempt:", {
            email,
            password,
            remember
        });


        /*
        =========================================
        BACKEND CONNECTION
        =========================================

        try {

            const response = await fetch(
                "http://localhost:5000/api/auth/login",
                {
                    method: "POST",

                    headers: {
                        "Content-Type": "application/json"
                    },

                    body: JSON.stringify({
                        email,
                        password
                    })
                }
            );

            const data = await response.json();

            if (!response.ok) {
                alert(data.message || "Login failed.");
                return;
            }

            localStorage.setItem(
                "token",
                data.token
            );

            window.location.href = "dashboard.html";

        } catch (error) {

            console.error(error);

            alert(
                "Unable to connect to the server."
            );
        }
        */

    });

}


/* =========================================
   SIGN UP / REGISTER
   ========================================= */

const registerForm = document.getElementById("registerForm");

if (registerForm) {

    registerForm.addEventListener("submit", async (e) => {

        e.preventDefault();


        const name = document
            .getElementById("name")
            .value
            .trim();

        const email = document
            .getElementById("email")
            .value
            .trim();

        const password = document
            .getElementById("password")
            .value;

        const confirmPassword = document
            .getElementById("confirmPassword")
            .value;


        // Basic validation
        if (!name || !email || !password || !confirmPassword) {
            alert("Please fill in all fields.");
            return;
        }


        // Password confirmation
        if (password !== confirmPassword) {
            alert("Passwords do not match.");
            return;
        }


        // Password length
        if (password.length < 6) {
            alert("Password must be at least 6 characters.");
            return;
        }


        console.log("Registration attempt:", {
            name,
            email,
            password
        });


        /*
        =========================================
        BACKEND CONNECTION
        =========================================

        try {

            const response = await fetch(
                "http://localhost:5000/api/auth/register",
                {
                    method: "POST",

                    headers: {
                        "Content-Type": "application/json"
                    },

                    body: JSON.stringify({
                        name,
                        email,
                        password
                    })
                }
            );

            const data = await response.json();

            if (!response.ok) {
                alert(data.message || "Registration failed.");
                return;
            }

            alert("Account created successfully!");

            window.location.href = "login.html";

        } catch (error) {

            console.error(error);

            alert(
                "Unable to connect to the server."
            );
        }
        */

    });

}
```
