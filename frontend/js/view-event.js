document.addEventListener("DOMContentLoaded", async () => {
    const params = new URLSearchParams(window.location.search);
    const eventId = params.get("id"); // Get the event ID from the URL

    if (!eventId) {
        alert("No event selected.");
        window.location.href = "/index.html";
        return;
    }

    const accessToken = localStorage.getItem("access_token");

    if (!accessToken) {
        alert("You must be logged in to view this event.");
        window.location.href = "/pages/login.html";
        return;
    }

    try {
        const response = await fetch(`http://localhost:3000/events/${eventId}`, {
            method: "GET",
            headers: {
                "Accept": "application/json",
                "Authorization": `Bearer ${accessToken}`,
            },
        });

        if (!response.ok) {
            throw new Error(`Failed to fetch event details. Status: ${response.status}`);
        }

        const event = await response.json();

        // Populate the event details
        document.getElementById("event-title").innerText = `Details of Event: ${event.title}`;
        document.getElementById("event-name").innerText = event.title;
        document.getElementById("event-date").innerText = new Date(event.date).toLocaleString();
        document.getElementById("event-location").innerText = event.location;
        document.getElementById("event-description").innerText = event.description;
    } catch (error) {
        console.error("Error loading event:", error);
        alert("Failed to load event details. Please try again later.");
    }
});
