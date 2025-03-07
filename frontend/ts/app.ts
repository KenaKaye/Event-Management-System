document.addEventListener("DOMContentLoaded", async () => {
    const navItems = document.getElementById("nav-items") as HTMLElement;
    const eventsContainer = document.getElementById("events") as HTMLElement;
    const searchButton = document.querySelector(".btn-primary") as HTMLButtonElement;
    const searchInput = document.querySelector("input[placeholder='Search by name']") as HTMLInputElement;
    let allEvents: Event[] = []; // Store all events here
    const user = JSON.parse(localStorage.getItem("user") || 'null') as { name: string } | null;

    // Populate navbar
    if (user) {
        navItems.innerHTML = `
            <li class="nav-item">
                <a class="nav-link" href="index.html">Home</a>
            </li>
            <li class="nav-item dropdown">
                <a class="nav-link dropdown-toggle" href="#" id="userDropdown" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                    ${user.name}
                </a>
                <ul class="dropdown-menu dropdown-menu-end" aria-labelledby="userDropdown">
                    <li><button class="dropdown-item" id="logout">Logout</button></li>
                </ul>
            </li>
        `;
    } else {
        navItems.innerHTML = `
            <li class="nav-item">
                <a class="nav-link" href="index.html">Home</a>
            </li>
            <li class="nav-item">
                <a class="nav-link" href="pages/login.html">Login</a>
            </li>
            <li class="nav-item">
                <a class="nav-link" href="pages/signup.html">Sign Up</a>
            </li>
        `;
    }

    // Logout functionality
    const logoutBtn = document.getElementById("logout") as HTMLButtonElement | null;
    if (logoutBtn) {
        logoutBtn.addEventListener("click", () => {
            localStorage.removeItem("user");
            localStorage.removeItem("access_token");
            window.location.reload();
        });
    }

    // Fetch and display events
    try {
        const response = await fetch("http://localhost:3000/events", {
            method: "GET",
            headers: { Accept: "application/json" },
        });

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        allEvents = await response.json() as Event[]; // Store fetched events
        displayEvents(allEvents); // Display all events initially
    } catch (error) {
        console.error("Error fetching events:", error);
        eventsContainer.innerHTML = `<p class="text-danger">Failed to load events. Please try again later.</p>`;
    }

    // Event listener for search functionality
    searchButton.addEventListener("click", () => {
        const searchTerm = searchInput.value.toLowerCase();
        const filteredEvents = allEvents.filter(event =>
            event.title.toLowerCase().includes(searchTerm)
        );
        displayEvents(filteredEvents); // Display filtered events
    });

    // Function to display events
    function displayEvents(events: Event[]) {
        eventsContainer.innerHTML = ""; // Clear previous events
        events.forEach(event => {
            const eventCard = document.createElement("div");
            eventCard.className = "col-md-4";
            eventCard.innerHTML = `
                <div class="card mb-4">
                    <div class="card-body">
                        <img src="images/event-image.jpg" alt="" class="event-image">
                        <h5>${event.title}</h5>
                        <p>${new Date(event.date).toLocaleDateString()}</p>
                        <a href="${user ? `/pages/view_event.html?id=${event.id}` : '/pages/login.html'}" 
                            class="btn btn-success">
                            ${user ? "View Event" : "Login to View"}
                        </a>
                    </div>
                </div>
            `;
            eventsContainer.appendChild(eventCard);
        });
    }

    // Define Event interface
    interface Event {
        id: number;
        title: string;
        date: string;
    }
});