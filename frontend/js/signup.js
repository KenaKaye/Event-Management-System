document.getElementById("signupForm").addEventListener("submit", async (e) => {
     e.preventDefault(); // Prevent the form from submitting the traditional way

     const name = document.getElementById("name").value;
     const email = document.getElementById("email").value;
     const password = document.getElementById("create-password").value;
     const confirmPassword = document.getElementById("confirm-password").value;
     const signupMessage = document.getElementById("signupMessage");

     // Clear previous messages
     signupMessage.textContent = "";

     // Check if passwords match
     if (password !== confirmPassword) {
         signupMessage.textContent = "Passwords do not match.";
         return;
     }

     // Create request payload
     const payload = {
         name,
         email,
         password
     };

     try {
         const response = await fetch("http://localhost:3000/auth/register", {
             method: "POST",
             headers: {
                 "Accept": "application/json",
                 "Content-Type": "application/json"
             },
             body: JSON.stringify(payload)
         });

         if (response.ok) {
             // On successful registration, redirect to login page
             window.location.href = "/pages/login.html";
         } else {
             // Display error message if registration fails
             const errorData = await response.json();
             signupMessage.textContent = errorData.message || "Signup failed. Please try again.";
         }
     } catch (error) {
         signupMessage.textContent = "An error occurred. Please try again.";
         console.error("Signup error:", error);
     }
 });