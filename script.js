document.addEventListener("DOMContentLoaded", function() {
		generateDemoGuides();
		  generateDemoEvents();
		  loadEvents();
    showTab('home');
    loadEvents();
});



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
// Sample static data (this would eventually come from a backend or form submission)


function renderStudyGuides(data) {
  const container = document.getElementById("study-guide-list");
  container.innerHTML = "";

  data.forEach(guide => {
    const card = document.createElement("div");
    card.className = "guide-card";
    card.innerHTML = `
      <h3>${guide.title}</h3>
      <p><strong>University:</strong> ${guide.university}</p>
      <p><strong>Course:</strong> ${guide.course}</p>
      <p><strong>Subject:</strong> ${guide.subject}</p>
      <p><strong>Format:</strong> ${guide.format}</p>
      <p><strong>Downloads:</strong> ${guide.downloads} | <strong>Rating:</strong> ${"⭐".repeat(Math.floor(guide.rating))}</p>
      <button class="download-btn">Download</button>
    `;
    container.appendChild(card);
  });
}

function applyFiltersAndSort() {
  let filtered = [...studyGuides];

  const university = document.getElementById("university-filter").value;
  const faculty = document.getElementById("faculty-filter").value;
  const course = document.getElementById("course-filter").value;
  const subject = document.getElementById("subject-filter").value;
  const language = document.getElementById("language-filter").value;
  const format = document.getElementById("format-filter").value;
  const level = document.getElementById("level-filter").value;
  const sortBy = document.getElementById("sort-options").value;

  filtered = filtered.filter(guide => {
    return (
      (university === "All Universities" || guide.university === university) &&
      (faculty === "All Faculties" || guide.faculty === faculty) &&
      (course === "All Courses" || guide.course === course) &&
      (subject === "All Subjects" || guide.subject === subject) &&
      (language === "All Languages" || guide.language === language) &&
      (format === "All Formats" || guide.format === format) &&
      (level === "All Levels" || guide.level === level)
    );
  });

  if (sortBy === "downloads") {
    filtered.sort((a, b) => b.downloads - a.downloads);
  } else if (sortBy === "rating") {
    filtered.sort((a, b) => b.rating - a.rating);
  } else if (sortBy === "newest") {
    // assuming newer entries are last in the array
    filtered.reverse();
  }

  renderStudyGuides(filtered);
}

// Attach events to filters and sort
["university-filter", "faculty-filter", "course-filter", "subject-filter", "language-filter", "format-filter", "level-filter", "sort-options"].forEach(id => {
  document.getElementById(id).addEventListener("change", applyFiltersAndSort);
});

// Initial render
document.addEventListener("DOMContentLoaded", () => {
  renderStudyGuides(studyGuides);
});
document.getElementById("upload-form").addEventListener("submit", function(e) {
  e.preventDefault();

  const statusDiv = document.getElementById("upload-status");
  const title = document.getElementById("guide-title").value;
  const university = document.getElementById("university").value;
  const course = document.getElementById("course").value;
  const subject = document.getElementById("subject").value;
  const format = document.getElementById("format").value;
  const file = document.getElementById("file-upload").files[0];

  if (!file) {
    statusDiv.innerText = "Please select a file.";
    return;
  }

  // Simulate upload process
  const reader = new FileReader();
  reader.onload = function() {
    statusDiv.innerText = `Study Guide "${title}" uploaded successfully!`;
    // Here you'd normally send the file and metadata to a backend or Firebase
  };
  reader.readAsDataURL(file);
});
// Toggle upload form dropdown
document.getElementById("upload-toggle").addEventListener("click", function () {
  const dropdown = document.getElementById("upload-dropdown");
  dropdown.classList.toggle("open");
});


// Existing upload form logic
document.getElementById("upload-form").addEventListener("submit", function(e) {
  e.preventDefault();

  const statusDiv = document.getElementById("upload-status");
  const title = document.getElementById("guide-title").value;
  const university = document.getElementById("university").value;
  const course = document.getElementById("course").value;
  const subject = document.getElementById("subject").value;
  const format = document.getElementById("format").value;
  const file = document.getElementById("file-upload").files[0];

  if (!file) {
    statusDiv.innerText = "Please select a file.";
    return;
  }

  // Simulate upload process (replace with actual upload logic)
  const reader = new FileReader();
  reader.onload = function() {
    statusDiv.innerText = `Study Guide "${title}" uploaded successfully!`;
    // Here you would normally send the file and metadata to a backend service
  };
  reader.readAsDataURL(file);
});
function showTab(tabId) {
  const newTab = document.getElementById(tabId);
  const currentTab = document.querySelector('.tab-content.active');

  if (!newTab || newTab === currentTab) return;

  // Slide out current tab
  if (currentTab) {
    currentTab.classList.remove('active');
    currentTab.classList.add('slide-out');

    setTimeout(() => {
      currentTab.classList.remove('slide-out');
    }, 400);
  }

  // Show and slide in new tab
  newTab.classList.add('active');
}




function revealOnScroll() {
    const cards = document.querySelectorAll('.card');
    const trigger = window.innerHeight * 0.85;

    cards.forEach(card => {
        const rect = card.getBoundingClientRect();
        if (rect.top < trigger) {
            card.classList.add('visible');
        }
    });
}

window.addEventListener('scroll', revealOnScroll);
window.addEventListener('load', revealOnScroll);
const filters = {
  university: 'All Universities',
  faculty: 'All Faculties',
  course: 'All Courses',
  subject: 'All Subjects',
  language: 'All Languages',
  format: 'All Formats',
  level: 'All Levels',
  tag: 'All Tags'
};

document.querySelectorAll('.filters-bar select').forEach(select => {
  select.addEventListener('change', e => {
    const id = e.target.id.replace('-filter', '');
    filters[id] = e.target.value;
    filterGuides();
  });
});

function filterGuides() {
  const cards = document.querySelectorAll('.guide-card');

  cards.forEach(card => {
    let visible = true;

    for (const key in filters) {
      const filterValue = filters[key];
      const dataValue = card.dataset[key]?.toLowerCase();

      if (key === 'tag') {
        if (filterValue !== 'All Tags') {
          const tags = card.dataset.tags?.toLowerCase().split(',').map(t => t.trim()) || [];
          if (!tags.includes(filterValue.toLowerCase())) {
            visible = false;
            break;
          }
        }
      } else {
        const allLabel = `All ${key.charAt(0).toUpperCase() + key.slice(1)}s`;
        if (filterValue !== allLabel && filterValue.toLowerCase() !== dataValue) {
          visible = false;
          break;
        }
      }
    }

    card.classList.toggle('hide', !visible);
  });
}



function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}
function toggleAdvancedFilters() {
  const section = document.querySelector('.advanced-filters');
  section.classList.toggle('collapsed');
}
function toggleUploadModal() {
  const modal = document.getElementById('upload-modal');
  modal.classList.toggle('hidden');
}
document.addEventListener('keydown', function (e) {
  const modal = document.getElementById('upload-modal');
  if (e.key === 'Escape' && modal && !modal.classList.contains('hidden')) {
    modal.classList.add('hidden');
  }
});

document.getElementById('tag-filter').addEventListener('change', e => {
  filters.tag = e.target.value;
  filterGuides();
});
let selectedRating = 0;
let currentGuide = "";

function openReviewModal(guideTitle) {
  currentGuide = guideTitle;
  selectedRating = 0;
  document.getElementById('review-guide-title').textContent = guideTitle;
  document.getElementById('review-comment').value = '';
  document.querySelectorAll('.rating-stars span').forEach(star => star.classList.remove('selected'));
  document.getElementById('review-modal').classList.remove('hidden');
}

function closeReviewModal() {
  document.getElementById('review-modal').classList.add('hidden');
}

function setRating(rating) {
  selectedRating = rating;
  document.querySelectorAll('.rating-stars span').forEach((star, i) => {
    star.classList.toggle('selected', i < rating);
  });
}

function submitReview() {
    const guideTitle = document.getElementById('review-guide-title').textContent;
    const comment = document.getElementById('review-comment').value;
    const rating = document.querySelectorAll('.rating-stars .selected').length;

    let guides = JSON.parse(localStorage.getItem('studyGuides')) || [];
    const guide = guides.find(g => g.title === guideTitle);

    if (!guide) {
        alert('Guide not found!');
        return;
    }

    if (!guide.reviews) guide.reviews = [];
    guide.reviews.push({ rating, comment });

    const avgRating = calculateAverageRating(guide.reviews).avg;
    const totalRatings = guide.reviews.length;

    if (!guide.pointsAwarded && avgRating >= 4 && totalRatings >= 3) {
        guide.pointsAwarded = true;
        if (guide.username === JSON.parse(localStorage.getItem('currentUser')).username) {
            addUserPoints(10);
        }
    }

    if (!guide.bonusAwarded && avgRating >= 4.5) {
        guide.bonusAwarded = true;
        if (guide.username === JSON.parse(localStorage.getItem('currentUser')).username) {
            addUserPoints(10);
        }
    }

    localStorage.setItem('studyGuides', JSON.stringify(guides));
    closeReviewModal();

    renderGuidesFromLocal();
    alert('Thank you for your review!');
}

function openReviewModal(guideTitle) {
    const modal = document.getElementById('review-modal');
    const titleElement = document.getElementById('review-guide-title');
    
    titleElement.textContent = guideTitle;
    modal.classList.remove('hidden');
}

// Also, add this to close the modal:
function closeReviewModal() {
    const modal = document.getElementById('review-modal');
    modal.classList.add('hidden');
}

// Check event listener for submitting review:
// Set rating stars visually
function setRating(stars) {
    const starsElements = document.querySelectorAll('.rating-stars span');
    starsElements.forEach((star, index) => {
        star.classList.toggle('selected', index < stars);
    });
}


function submitReview() {
    const comment = document.getElementById('review-comment').value;
    const selectedStars = document.querySelectorAll('.rating-stars .selected').length;
    
    alert(`Review submitted: ${selectedStars} stars, Comment: ${comment}`);
    closeReviewModal();
}
// Handle upload form submission
document.getElementById('upload-form').addEventListener('submit', function(e) {
    e.preventDefault();

    const user = JSON.parse(localStorage.getItem('currentUser'));
    if (!user || !user.username) {
        alert('Please log in first.');
        toggleUserModal();
        return;
    }

    const guideTitle = document.getElementById('guide-title').value;
const university = document.getElementById('university').value;
const faculty = document.getElementById('faculty').value;
const course = document.getElementById('course').value;
const subject = document.getElementById('subject').value;
const description = document.getElementById('description').value;
const format = document.getElementById('format').value;
const level = document.getElementById('level').value;
const language = document.getElementById('language').value;
const tags = document.getElementById('tags').value.split(',').map(tag => tag.trim()).filter(tag => tag.length > 0);

    const fileInput = document.getElementById('file-upload');

    if (fileInput.files.length === 0) {
        alert('Please select a file.');
        return;
    }

    const file = fileInput.files[0];
    const reader = new FileReader();

    reader.onload = function(event) {
        const fileData = event.target.result;

       const guide = {
  id: Date.now(),
  title: guideTitle,
  university,
  faculty,
  course,
  subject,
  format,
  level,
  language,
  tags,
  description,
  fileName: file.name,
  fileData,
  username: user.username
};


        saveGuideToLocal(guide);
        alert('Guide uploaded successfully!');
        document.getElementById('upload-form').reset();
        renderGuidesFromLocal();
    };

    reader.readAsDataURL(file);
});


// Save guide to localStorage
function saveGuideToLocal(guide) {
    let guides = JSON.parse(localStorage.getItem('studyGuides')) || [];
    guides.push(guide);
    localStorage.setItem('studyGuides', JSON.stringify(guides));
}
// Render guides from localStorage to HTML
function renderGuidesFromLocal() {
    const guidesContainer = document.getElementById('study-guide-list');
    guidesContainer.innerHTML = '';

    const guides = JSON.parse(localStorage.getItem('studyGuides')) || [];

    guides.forEach(guide => {
        const ratingData = calculateAverageRating(guide.reviews);

        const guideCard = document.createElement('div');
        guideCard.className = 'guide-card';

        guideCard.innerHTML = `
            <div class="guide-icon"><i class="fas fa-book"></i></div>
            <div class="guide-content">
                <h3>${guide.title}</h3>
                <div class="guide-tags">
                    <span class="tag format">${guide.format}</span>
                    <span class="tag uni">${guide.university}</span>
                    <span class="tag rating">⭐ ${ratingData.avg} (${ratingData.count})</span>
                </div>
                <p><strong>Course:</strong> ${guide.course}</p>
                <p><strong>Subject:</strong> ${guide.subject}</p>
				<p>${guide.description || 'No description provided.'}</p>
				<p><em>Uploaded by: ${guide.username || 'Anonymous'}</em></p>

				<p><strong>Downloads:</strong> ${guide.downloadCount || 0}</p>
                <button class="download-btn" onclick="downloadGuide(${guide.id})">Download</button>
                <button class="rate-btn" onclick="openReviewModal('${guide.title}')">★ Rate this guide</button>
            </div>
        `;

        guidesContainer.appendChild(guideCard);
    });
}



// Allow downloading guides
function downloadGuide(id) {
    const guides = JSON.parse(localStorage.getItem('studyGuides')) || [];
    const guide = guides.find(g => g.id === id);
    const user = JSON.parse(localStorage.getItem('currentUser'));

    if (!guide) {
        alert('Guide not found!');
        return;
    }

    const ratingInfo = calculateAverageRating(guide.reviews);
    let cost = 0;

    if (ratingInfo.avg >= 4.5) cost = 15;
    else if (ratingInfo.avg >= 4.0) cost = 10;
    else if (ratingInfo.avg >= 3.5) cost = 5;

    if (cost > 0 && !spendUserPoints(cost)) {
        return;
    }

    const link = document.createElement('a');
    link.href = guide.fileData;
    link.download = guide.fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    guide.downloadCount = (guide.downloadCount || 0) + 1;

    // Milestone reward every 50 downloads for uploader
    if (guide.downloadCount % 50 === 0 && guide.username === user.username) {
        addUserPoints(5);
    }

    localStorage.setItem('studyGuides', JSON.stringify(guides));
	renderGuidesFromLocal();
}


// Initial rendering on page load
document.addEventListener('DOMContentLoaded', renderGuidesFromLocal);
// Submit Review and Save to localStorage
function submitReview() {
    const guideTitle = document.getElementById('review-guide-title').textContent;
    const comment = document.getElementById('review-comment').value;
    const rating = document.querySelectorAll('.rating-stars .selected').length;

    let guides = JSON.parse(localStorage.getItem('studyGuides')) || [];

    // Find the specific guide
    const guide = guides.find(g => g.title === guideTitle);
    if (!guide) {
        alert('Guide not found!');
        return;
    }

    // Add reviews array if not exists
    if (!guide.reviews) guide.reviews = [];

    guide.reviews.push({ rating, comment });

    localStorage.setItem('studyGuides', JSON.stringify(guides));

    closeReviewModal();
    renderGuidesFromLocal();
    alert('Thank you for your review!');
}

// Calculate Average Rating
function calculateAverageRating(reviews) {
    if (!reviews || reviews.length === 0) return { avg: 0, count: 0 };

    const sum = reviews.reduce((total, review) => total + review.rating, 0);
    return { avg: (sum / reviews.length).toFixed(1), count: reviews.length };
}
// Toggle User Modal Visibility
function toggleUserModal() {
    document.getElementById('user-modal').classList.toggle('hidden');
}

// Save User Data to LocalStorage
function saveUser() {
    const username = document.getElementById('username').value.trim();
    if (username === '') {
        alert('Please enter a username.');
        return;
    }

    localStorage.setItem('currentUser', JSON.stringify({ username, points: 0 }));
    toggleUserModal();
    alert(`Welcome, ${username}!`);
    document.querySelector('.login-btn').textContent = `👤 ${username}`;
    updateUserProfileCard();
}


// Load username if available
document.addEventListener('DOMContentLoaded', () => {
    const user = JSON.parse(localStorage.getItem('currentUser'));
    if (user && user.username) {
        document.querySelector('.login-btn').textContent = `👤 ${user.username}`;
    }
    updateUserProfileCard();
});



// Update Profile Card
function updateUserProfileCard() {
    const user = JSON.parse(localStorage.getItem('currentUser'));
    const guides = JSON.parse(localStorage.getItem('studyGuides')) || [];

    const userNameDisplay = document.getElementById('user-name-display');
    const guidesCountDisplay = document.getElementById('uploaded-guides-count');
    const avgRatingDisplay = document.getElementById('average-rating-display');
	const pointsDisplay = document.getElementById('points-display');
pointsDisplay.textContent = `Points: ${user.points || 0}`;


    if (!user || !user.username) {
        userNameDisplay.textContent = 'Not logged in';
        guidesCountDisplay.textContent = 'Guides: 0';
        avgRatingDisplay.textContent = 'Rating: N/A';
        return;
    }

    userNameDisplay.textContent = `👤 ${user.username}`;

    const userGuides = guides.filter(g => g.username === user.username);
    guidesCountDisplay.textContent = `Guides: ${userGuides.length}`;

    let totalRatings = 0;
    let ratingsCount = 0;
    userGuides.forEach(g => {
        if (g.reviews && g.reviews.length > 0) {
            ratingsCount += g.reviews.length;
            totalRatings += g.reviews.reduce((sum, r) => sum + r.rating, 0);
        }
    });

    const averageRating = ratingsCount ? (totalRatings / ratingsCount).toFixed(1) : 'N/A';
    avgRatingDisplay.textContent = `Rating: ${averageRating}`;
}

// Ensure profile updates whenever content renders
document.addEventListener('DOMContentLoaded', updateUserProfileCard);
function toggleDetails() {
  const details = document.getElementById('points-details');
  details.classList.toggle('hidden');
}
// ✅ Initialize user points
function initUserPoints() {
    const user = JSON.parse(localStorage.getItem('currentUser'));
    if (user && user.points === undefined) {
        user.points = 0;
        localStorage.setItem('currentUser', JSON.stringify(user));
    }
}

// ✅ Add points to user
function addUserPoints(amount) {
    const user = JSON.parse(localStorage.getItem('currentUser'));
    if (!user) return;
    user.points = (user.points || 0) + amount;
    localStorage.setItem('currentUser', JSON.stringify(user));
    updateUserProfileCard();
}

// ✅ Spend points (returns true if successful)
function spendUserPoints(amount) {
    const user = JSON.parse(localStorage.getItem('currentUser'));
    if (!user || user.points < amount) {
        alert("Not enough points!");
        return false;
    }
    user.points -= amount;
    localStorage.setItem('currentUser', JSON.stringify(user));
    updateUserProfileCard();
    return true;
}
function generateDemoGuides() {
  const existing = JSON.parse(localStorage.getItem('studyGuides'));
  if (existing && existing.length > 0) return; // Don't overwrite real data

  const demoTitles = [
    "Intro to Psychology Notes", "Business Law Summary", "Organic Chemistry Cheat Sheet",
    "European History Flashcards", "Calculus 2 Midterm Review", "Marketing Strategy Guide"
  ];
  const universities = ["HU", "Oxford", "MIT", "Leiden", "UCL"];
  const subjects = ["Economics", "Biology", "History", "Math", "Marketing", "CS"];
  const formats = ["PDF", "DOCX", "TXT"];
  const levels = ["Beginner", "Intermediate", "Advanced"];
  const languages = ["English", "Polish", "German"];
  const usernames = ["Anna", "Ben", "Charlie", "Dana", "Eli"];

  const demoGuides = [];

  for (let i = 0; i < 6; i++) {
    const reviews = Array.from({ length: Math.floor(Math.random() * 5 + 1) }, () => ({
      rating: Math.floor(Math.random() * 5) + 1,
      comment: "Auto-generated review"
    }));

    const downloads = Math.floor(Math.random() * 100 + 1);
    const averageRating = reviews.length
      ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)
      : 0;

    demoGuides.push({
      id: Date.now() + i,
      title: demoTitles[i % demoTitles.length],
      university: universities[Math.floor(Math.random() * universities.length)],
      faculty: "Demo Faculty",
      course: "Course " + (i + 1),
      subject: subjects[i % subjects.length],
      format: formats[Math.floor(Math.random() * formats.length)],
      level: levels[Math.floor(Math.random() * levels.length)],
      language: languages[Math.floor(Math.random() * languages.length)],
      tags: ["demo", "auto"],
      description: "This is a demo description to show off what a filled-out guide looks like.",
      fileName: "demo.pdf",
      fileData: "#", // No actual file for demo
      downloadCount: downloads,
      username: usernames[Math.floor(Math.random() * usernames.length)],
      reviews,
      pointsAwarded: true,
      bonusAwarded: averageRating >= 4.5
    });
  }

  localStorage.setItem("studyGuides", JSON.stringify(demoGuides));
}
function generateDemoEvents() {
  const existing = JSON.parse(localStorage.getItem('events'));
  if (existing && existing.length > 0) return;

  const imagePool = [
    "basketballcourt.jpg", "career.jpg", "hackatons.jpg",
    "musicconcert.jpg", "science.jpg", "Stadium.jpg",
    "study.jpg", "tenniscourt.jpg", "volunteer.jpg"
  ];

  const titles = [
    "Study Group: Business Law", "Finance Quiz Prep Meetup", "Flashcards Exchange Night",
    "Marketing Brainstorm Jam", "History Final Q&A", "Cheat Sheet Swap Session"
  ];
  const categories = ["Meetup", "Workshop", "Study Group", "Online"];
  const locations = ["Library Hall", "Zoom", "Campus Café", "Main Auditorium"];
  const descriptions = [
    "Collaborative session to prepare for next week's midterm.",
    "Share tips and resources to boost your exam performance.",
    "Bring flashcards, get flashcards!",
    "Open discussion and idea sharing for your final project.",
    "Ask questions, get answers — mock exam prep.",
    "Trade, share, and rate cheat sheets together."
  ];

  const demoEvents = [];

  for (let i = 0; i < 6; i++) {
    const event = {
      id: Date.now() + i,
      title: titles[i],
      category: categories[i % categories.length],
      attendance: Math.floor(Math.random() * 30 + 5),
      description: descriptions[i],
      location: locations[i % locations.length],
      price: (Math.random() > 0.5) ? "Free" : `$${Math.floor(Math.random() * 10 + 1)}`,
      bgImage: imagePool[i % imagePool.length] // 👈 rotate images
    };

    demoEvents.push(event);
  }

  localStorage.setItem('events', JSON.stringify(demoEvents));
}
function animateHomeSectionsStaggered() {
  const elements = document.querySelectorAll('.fade-in-left, .fade-in-right, .fade-in-up');

  elements.forEach((el, index) => {
    setTimeout(() => {
      el.classList.add('show');
    }, index * 300); // ⏱ 300ms delay between each block
  });
}

window.addEventListener('DOMContentLoaded', animateHomeSectionsStaggered);
