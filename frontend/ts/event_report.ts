const API_URL = 'http://localhost:3000/events';

// Fetch token from localStorage
function getAuthToken(): string {
    return `Bearer ${localStorage.getItem('access_token')}`;
}

// Define Event interface
interface Event {
    id: number;
    title: string;
    description: string;
    date: string;
    location: string;
}

// Fetch events and populate the table
function fetchEvents(): void {
    fetch(API_BASE_URL, {
        method: 'GET',
        headers: {
            'accept': '*/*',
            'Authorization': getAuthToken(),
        },
    })
    .then(response => response.json() as Promise<Event[]>)
    .then(events => {
        const tableBody = document.getElementById('events-table-body') as HTMLTableSectionElement;
        tableBody.innerHTML = '';

        events.forEach(event => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${event.title}</td>
                <td>${new Date(event.date).toLocaleString()}</td>
                <td>
                    <button class="btn btn-info btn-sm" onclick="toggleDetails(${event.id})">Toggle Details</button>
                    <button class="btn btn-warning btn-sm" onclick="toggleUpdateEvent(${event.id})">Update</button>
                    <button class="btn btn-danger btn-sm" onclick="deleteEvent(${event.id})">Delete</button>
                </td>
            `;

            const detailsRow = document.createElement('tr');
            detailsRow.classList.add('event-details-row');
            detailsRow.id = `details-row-${event.id}`;
            detailsRow.innerHTML = `
                <td colspan="3" id="details-${event.id}">
                    <!-- Event details will be fetched dynamically -->
                </td>
            `;

            tableBody.appendChild(row);
            tableBody.appendChild(detailsRow);

            // Fetch additional details for each event
            fetch(`${API_BASE_URL}/${event.id}`, {
                method: 'GET',
                headers: {
                    'accept': '*/*',
                    'Authorization': getAuthToken(),
                },
            })
            .then(response => response.json() as Promise<Event>)
            .then(eventDetails => {
                const detailsCell = document.getElementById(`details-${event.id}`) as HTMLElement;
                detailsCell.innerHTML = `
                    <strong>Title:</strong> ${eventDetails.title}<br>
                    <strong>Description:</strong> ${eventDetails.description}<br>
                    <strong>Date:</strong> ${new Date(eventDetails.date).toLocaleString()}<br>
                    <strong>Location:</strong> ${eventDetails.location}
                `;
            })
            .catch(error => console.error('Error fetching event details:', error));
        });
    })
    .catch(error => console.error('Error fetching events:', error));
}

// Toggle visibility of event details
function toggleDetails(eventId: number): void {
    const detailsRow = document.getElementById(`details-row-${eventId}`) as HTMLTableRowElement;
    detailsRow.style.display = detailsRow.style.display === 'none' ? 'table-row' : 'none';
}

// Toggle update event section
function toggleUpdateEvent(eventId: number): void {
    const updateSection = document.getElementById('update-event-section') as HTMLElement;

    // Fetch event details
    fetch(`${API_BASE_URL}/${eventId}`, {
        method: 'GET',
        headers: {
            'accept': '*/*',
            'Authorization': getAuthToken(),
        },
    })
    .then(response => response.json() as Promise<Event>)
    .then(event => {
        (document.getElementById('update-event-id') as HTMLInputElement).value = event.id.toString();
        (document.getElementById('update-event-title') as HTMLInputElement).value = event.title;
        (document.getElementById('update-event-description') as HTMLTextAreaElement).value = event.description;
        (document.getElementById('update-event-date') as HTMLInputElement).value = new Date(event.date).toISOString().slice(0, 16);
        (document.getElementById('update-event-location') as HTMLInputElement).value = event.location;

        updateSection.style.display = updateSection.style.display === 'none' ? 'block' : 'none';
    })
    .catch(error => console.error('Error fetching event details:', error));
}

// Submit updated event
function submitUpdateEvent(): void {
    const eventId = (document.getElementById('update-event-id') as HTMLInputElement).value;
    const updatedEvent = {
        title: (document.getElementById('update-event-title') as HTMLInputElement).value,
        description: (document.getElementById('update-event-description') as HTMLTextAreaElement).value,
        date: (document.getElementById('update-event-date') as HTMLInputElement).value,
        location: (document.getElementById('update-event-location') as HTMLInputElement).value,
    };

    fetch(`${API_BASE_URL}/${eventId}`, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': getAuthToken(),
        },
        body: JSON.stringify(updatedEvent),
    })
    .then(response => {
        if (response.ok) {
            alert('Event updated successfully');
            (document.getElementById('update-event-section') as HTMLElement).style.display = 'none';
            fetchEvents();
        } else {
            alert('Failed to update the event');
        }
    })
    .catch(error => console.error('Error updating event:', error));
}

// Delete event
function deleteEvent(eventId: number): void {
    if (confirm('Are you sure you want to delete this event?')) {
        fetch(`${API_BASE_URL}/${eventId}`, {
            method: 'DELETE',
            headers: {
                'accept': '*/*',
                'Authorization': getAuthToken(),
            },
        })
        .then(response => {
            if (response.ok) {
                alert('Event deleted successfully');
                fetchEvents();
            } else {
                alert('Failed to delete the event');
            }
        })
        .catch(error => console.error('Error deleting event:', error));
}

// Fetch events on DOM content loaded
document.addEventListener('DOMContentLoaded', fetchEvents)};