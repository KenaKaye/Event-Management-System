document.addEventListener("DOMContentLoaded", () => {
    const loginForm = document.getElementById("loginForm") as HTMLFormElement;

    loginForm.addEventListener("submit", async (event: Event) => {
        event.preventDefault();

        const email = (document.getElementById("email") as HTMLInputElement).value.trim();
        const password = (document.getElementById("password") as HTMLInputElement).value.trim();

        try {
            const response = await fetch("http://localhost:3000/auth/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Accept: "application/json",
                },
                body: JSON.stringify({ email, password }),
            });

            if (!response.ok) {
                throw new Error("Login failed! Please check your credentials.");
            }

            const data = await response.json();

            // Save user data and token to localStorage
            localStorage.setItem("access_token", data.access_token);
            localStorage.setItem("user", JSON.stringify(data.user));

            // Redirect based on role
            if (data.user.role === "admin") {
                window.location.href = "/pages/admin_dashboard.html";
            } else {
                window.location.href = "/index.html";
            }
        } catch (error) {
            alert((error as Error).message); // Ensure error is treated as an Error object
        }
    });
});