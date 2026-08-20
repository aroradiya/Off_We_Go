const loginForm = document.getElementById("loginForm");

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

    Later replace the console.log above with:

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