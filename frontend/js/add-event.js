document.addEventListener("DOMContentLoaded", () => {
    const eventForm = document.getElementById("eventForm");
    const apiUrl = "http://localhost:3000/events";

    eventForm.addEventListener("submit", async (e) => {
        e.preventDefault();

        const title = document.getElementById("eventName").value.trim();
        const date = document.getElementById("eventDate").value.trim();
        const time = document.getElementById("eventTime").value.trim();
        const location = document.getElementById("location").value.trim();
        const description = document.getElementById("eventDescription").value.trim();

        const fullDate = new Date(`${date}T${time}`).toISOString();

        const eventData = {
            title,
            description,
            date: fullDate,
            location
        };

        // Retrieve the token from localStorage
        const authToken = localStorage.getItem("access_token");
        if (!authToken) {
            alert("You are not logged in. Please log in to continue.");
            window.location.href = "/pages/login.html";
            return;
        }

        try {
            const response = await fetch(apiUrl, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${authToken}`
                },
                body: JSON.stringify(eventData)
            });

            if (!response.ok) {
                throw new Error(`Error: ${response.status} - ${response.statusText}`);
            }

            const result = await response.json();

            alert(`Event "${result.title}" has been successfully added!`);
            window.location.href = "/pages/admin_dashboard.html"; // Redirect to admin dashboard
        } catch (error) {
            console.error("Error adding event:", error);
            alert("Failed to add the event. Please try again.");
        }
    });
});