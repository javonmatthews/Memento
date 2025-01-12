const today = new Date().toISOString().split('T')[0];

// Load stored time from localStorage (or start at 0 if no data exists)
let timeSpent = JSON.parse(localStorage.getItem('timeSpent')) || {};
timeSpent[today] = timeSpent[today] || 0;

// Track active time
let startTime = Date.now();

// Update time spent continuously while the user is on the site
const monitorTime = setInterval(() => {
  const currentSessionTime = Math.round((Date.now() - startTime) / 1000); // In seconds
  const totalTimeSpent = timeSpent[today] + currentSessionTime;
  const minutes = Math.floor(totalTimeSpent / 60);

  if (minutes > 60) {
    // Stop further monitoring
    clearInterval(monitorTime);

    // Create and display the persistent "Limit Reached" popup
    const overlay = document.createElement('div');
    overlay.style.position = 'fixed';
    overlay.style.top = '0';
    overlay.style.left = '0';
    overlay.style.width = '100%';
    overlay.style.height = '100%';
    overlay.style.backgroundColor = 'rgba(0, 0, 0, 1.0)'; // Dark background
    overlay.style.display = 'flex';
    overlay.style.justifyContent = 'center';
    overlay.style.alignItems = 'center';
    overlay.style.zIndex = '9999';

    const popup = document.createElement('div');
    popup.style.backgroundColor = '#333'; // Dark gray background for popup
    popup.style.padding = '20px';
    popup.style.borderRadius = '8px';
    popup.style.textAlign = 'center';
    popup.style.color = '#fff'; // White text for readability
    popup.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.2)';
    popup.innerHTML = `
      <p style="margin-bottom: 10px;">You have reached your limit for this site today.</p>
      <p style="margin-bottom: 10px;"><strong>Limit Reached</strong></p>
      <p style="margin-bottom: 10px;">Please consider taking a break!</p>
    `;
    overlay.appendChild(popup);
    document.body.appendChild(overlay);
  }
}, 1000); // Check every second

window.addEventListener('beforeunload', () => {
  // Calculate time spent during this session
  const sessionTime = Math.round((Date.now() - startTime) / 1000); // In seconds
  timeSpent[today] += sessionTime;

  // Save updated timeSpent data
  localStorage.setItem('timeSpent', JSON.stringify(timeSpent));
});

// Show a popup with a countdown when the site loads
window.onload = () => {
  const minutes = Math.floor(timeSpent[today] / 60);
  const seconds = timeSpent[today] % 60;

  // Create the overlay
  const overlay = document.createElement('div');
  overlay.style.position = 'fixed';
  overlay.style.top = '0';
  overlay.style.left = '0';
  overlay.style.width = '100%';
  overlay.style.height = '100%';
  overlay.style.backgroundColor = 'rgba(0, 0, 0, 0.8)'; // Dark background
  overlay.style.display = 'flex';
  overlay.style.justifyContent = 'center';
  overlay.style.alignItems = 'center';
  overlay.style.zIndex = '9999';

  // Create the popup content
  const popup = document.createElement('div');
  popup.style.backgroundColor = '#333'; // Dark gray background for popup
  popup.style.padding = '20px';
  popup.style.borderRadius = '8px';
  popup.style.textAlign = 'center';
  popup.style.color = '#fff'; // White text for readability
  popup.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.2)';

  if (minutes > 60) {
    // Show "Limit Reached" message and persistent popup
    popup.innerHTML = `
      <p style="margin-bottom: 10px;">You have reached your limit for this site today.</p>
      <p style="margin-bottom: 10px;"><strong>Limit Reached</strong></p>
      <p style="margin-bottom: 10px;">Please consider taking a break!</p>
    `;
    overlay.appendChild(popup);
    document.body.appendChild(overlay);

    // Do not remove the popup; keep it persistent
    return;
  }

  let countdown = 0;
  if (minutes > 30) {
    countdown = 45; // 45 seconds for medium usage
  } else {
    countdown = 10; // 10 seconds for low usage
  }

  popup.innerHTML = `
    <p style="margin-bottom: 10px;">You have spent <strong>${minutes} minutes and ${seconds} seconds</strong> on this site today.</p>
    <p>Please wait <strong><span id="countdown" style="color: #ff6347;">${countdown}</span></strong> seconds before accessing the site.</p>
  `;
  overlay.appendChild(popup);
  document.body.appendChild(overlay);

  const countdownElement = document.getElementById('countdown');
  let timer = null;

  // Start countdown
  const startCountdown = () => {
    if (!timer) {
      timer = setInterval(() => {
        countdown -= 1;
        countdownElement.textContent = countdown;

        if (countdown === 0) {
          clearInterval(timer);
          timer = null;
          document.body.removeChild(overlay); // Remove the overlay
        }
      }, 1000);
    }
  };

  // Stop countdown
  const stopCountdown = () => {
    if (timer) {
      clearInterval(timer);
      timer = null;
    }
  };

  // Listen for tab visibility changes
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
      stopCountdown(); // Pause countdown when tab is not visible
    } else {
      startCountdown(); // Resume countdown when tab becomes visible
    }
  });
  

  // Start countdown initially
  startCountdown();
};