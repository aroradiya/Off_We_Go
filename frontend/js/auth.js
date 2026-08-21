// const loginForm = document.getElementById("loginForm");

// loginForm.addEventListener("submit", async (e) => {

//     e.preventDefault();

    // const email = document
    //     .getElementById("email")
    //     .value
    //     .trim();

    // const password = document
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


/* =========================================
   LOGIN
   ========================================= */

const loginForm = document.getElementById("loginForm");

if (loginForm) {

    loginForm.addEventListener("submit", function (e) {

        e.preventDefault();


        // Get form values
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


        // Get registered users
        const users =
            JSON.parse(localStorage.getItem("offwegoUsers")) || [];


        // Find user with matching email
        const user = users.find(function (user) {

            return user.email === email;

        });


        // Check if user exists
        if (!user) {

            alert("No account found with this email.");
            return;

        }


        // Check password
        if (user.password !== password) {

            alert("Incorrect password.");
            return;

        }


        // Login successful
        localStorage.setItem(
            "offwegoLoggedInUser",
            JSON.stringify(user)
        );


        alert("Login successful!");


        // Go to dashboard
        window.location.href = "dashboard.html";

    });

}


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

//     });

// }


/* =========================================
   SIGN UP / REGISTER
   ========================================= */


const registerForm = document.getElementById("registerForm");

if (registerForm) {

    registerForm.addEventListener("submit", function (e) {

        e.preventDefault();


        // Get form values
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


        // Get existing users from Local Storage
        const users =
            JSON.parse(localStorage.getItem("offwegoUsers")) || [];


        // Check if email is already registered
        const existingUser = users.find(function (user) {

            return user.email === email;

        });


        if (existingUser) {

            alert("An account with this email already exists.");
            return;

        }


        // Create new user
        const newUser = {

            name: name,
            email: email,
            password: password

        };


        // Add new user to users array
        users.push(newUser);


        // Save updated users array
        localStorage.setItem(
            "offwegoUsers",
            JSON.stringify(users)
        );


        alert("Account created successfully!");


        // Redirect to login
        window.location.href = "login.html";

    });

}

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

    // });

// }

