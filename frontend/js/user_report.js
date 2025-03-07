const API_BASE_URL = 'http://localhost:3000/users';

// Fetch token from localStorage
function getAuthToken() {
    return `Bearer ${localStorage.getItem('access_token')}`;
}

function fetchUsers() {
    fetch(API_BASE_URL, {
        method: 'GET',
        headers: {
            'Accept': '*/*',
            'Authorization': getAuthToken()
        }
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Failed to fetch users');
        }
        return response.json();
    })
    .then(users => {
        const tableBody = document.getElementById('users-table-body');
        tableBody.innerHTML = '';

        users.forEach(user => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${user.name}</td>
                <td>${user.email}</td>
            `;

            tableBody.appendChild(row);
        });
    })
    .catch(error => console.error('Error fetching users:', error));
}

document.addEventListener('DOMContentLoaded', fetchUsers);