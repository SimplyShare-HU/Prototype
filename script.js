document.addEventListener("DOMContentLoaded", function() {
    showTab('home');
    loadEvents();
});

function showTab(tabId) {
    document.querySelectorAll('.tab-content').forEach(tab => {
        tab.classList.add('hidden');
    });
    document.getElementById(tabId).classList.remove('hidden');
}

function toggleEventForm() {
    let form = document.getElementById('add-event-form');
    form.classList.toggle('hidden');
}

function addEvent() {
    const title = document.getElementById("event-title").value;
    const category = document.getElementById("event-category").value;
	const attendance = document.getElementById("event-attendance").value;
    const description = document.getElementById("event-description").value;
    const location = document.getElementById("event-location").value;
    const price = document.getElementById("event-price").value;
    const bgImage = document.getElementById("event-bg-select").value || "default.jpg";

    if (!title || !category || !description || !location || !price) {
        alert("Please fill out all fields!");
        return;
    }

    // Generate a unique ID for the event
    const eventId = Date.now(); 

    const event = {
        id: eventId,
        title,
        category,
		attendance,
        description,
        location,
        price,
        bgImage
    };

    let events = JSON.parse(localStorage.getItem("events")) || [];
    events.push(event);
    localStorage.setItem("events", JSON.stringify(events));

    displayEvent(event); // Show new event in UI

    clearForm();
    showNotification("Event added successfully!");
}

function displayEvent(event) {
    const eventCard = document.createElement("div");
    eventCard.classList.add("event");
    eventCard.setAttribute("data-category", event.category);
	eventCard.setAttribute("data-attendance", event.attendance);
    eventCard.style.backgroundImage = `url('./images/${event.bgImage}')`;
    eventCard.style.backgroundSize = "cover";
    eventCard.style.backgroundPosition = "center";
    eventCard.style.color = "white";
    eventCard.style.padding = "20px";
    eventCard.style.borderRadius = "10px";
    eventCard.style.boxShadow = "2px 2px 8px rgba(0, 0, 0, 0.2)";
    eventCard.style.position = "relative";
    eventCard.style.overflow = "hidden";

    // Create dark overlay
    const overlay = document.createElement("div");
    overlay.classList.add("overlay");

    // Create content container
    const contentContainer = document.createElement("div");
    contentContainer.classList.add("content-container");
    
    contentContainer.innerHTML = `
        <h3>${event.title}</h3>
        <p><strong>Category:</strong> ${event.category}</p>
		<p><strong>Attendance:</strong> ${event.attendance}</p>
        <p><strong>Location:</strong> ${event.location}</p>
        <p><strong>Price:</strong> ${event.price}</p>
        <p>${event.description}</p>
        <button class="delete-btn" onclick="deleteEvent(${event.id})">Delete</button>
    `;

    eventCard.appendChild(overlay);
    eventCard.appendChild(contentContainer);
    document.getElementById("events-list").appendChild(eventCard);
}

function loadEvents() {
    let events = JSON.parse(localStorage.getItem('events')) || [];
    let eventsList = document.getElementById('events-list');
    eventsList.innerHTML = "";

    events.forEach(displayEvent);
}

function deleteEvent(eventId) {
    let events = JSON.parse(localStorage.getItem('events')) || [];
    let updatedEvents = events.filter(event => event.id !== eventId);
    localStorage.setItem('events', JSON.stringify(updatedEvents));
    loadEvents();
    showNotification("Event deleted successfully!");
}

function searchEvents() {
    let searchValue = document.getElementById('search-bar').value.toLowerCase();
    let events = document.querySelectorAll('.event');

    events.forEach(event => {
        let title = event.querySelector('h3').textContent.toLowerCase();
        let description = event.querySelector('p:nth-child(3)').textContent.toLowerCase();
        
        if (title.includes(searchValue) || description.includes(searchValue)) {
            event.style.display = "block";
            event.style.background = "#fffae6"; // Highlight search results
        } else {
            event.style.display = "none";
        }
    });
}

function filterEvents(filterType) {
    let events = document.querySelectorAll('.event');

    events.forEach(event => {
        let category = event.getAttribute("data-category");
        let attendance = event.getAttribute("data-attendance");

        if (category === filterType || attendance === filterType || filterType === "all") {
            event.style.display = "block";
        } else {
            event.style.display = "none";
        }
    });
}


function clearForm() {
    document.getElementById('event-title').value = "";
    document.getElementById('event-category').value = "";
	document.getElementById('event-attendance').value = "";
    document.getElementById('event-description').value = "";
    document.getElementById('event-location').value = "";
    document.getElementById('event-price').value = "";
    document.getElementById('event-bg-select').value = "";
}

function showNotification(message) {
    let notification = document.createElement('div');
    notification.classList.add('notification');
    notification.textContent = message;
    document.body.appendChild(notification);
    setTimeout(() => {
        notification.remove();
    }, 3000);
}

// Collaboration Feature
function addCollaboration() {
    let title = prompt("Enter the project title:");
    let lookingFor = prompt("Who are you looking for?");
    
    if (!title || !lookingFor) {
        alert("All fields are required");
        return;
    }

    let collabSection = document.querySelector('#collaborations');
    let collabDiv = document.createElement('div');
    collabDiv.classList.add('collab');
    collabDiv.innerHTML = `<h3>${title}</h3><p>Looking for: ${lookingFor}</p>`;
    collabSection.appendChild(collabDiv);
    showNotification("Collaboration added successfully!");
}
