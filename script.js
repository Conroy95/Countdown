function getThanksgiving(year) {
  // 4e donderdag van november
  const novFirst = new Date(year, 10, 1);
  const dayOfWeek = novFirst.getDay();
  const offset = (4 - dayOfWeek + 7) % 7;
  return new Date(year, 10, 1 + offset + 21, 0, 0, 0);
}

function getNextDate(getDateForYear) {
  const now = new Date();
  const currentYear = now.getFullYear();
  let target = getDateForYear(currentYear);

  if (now >= target) {
    target = getDateForYear(currentYear + 1);
  }
  return target;
}

const events = [
  {
    id: 'thanksgiving',
    name: 'Thanksgiving',
    getDate: () => getNextDate(getThanksgiving)
  },
  {
    id: 'christmas',
    name: 'Christmas',
    getDate: () => getNextDate((year) => new Date(year, 11, 25, 0, 0, 0))
  },
  {
    id: 'newyear',
    name: 'New Year',
    getDate: () => getNextDate((year) => new Date(year, 0, 1, 0, 0, 0))
  }
];

const container = document.getElementById('countdown-list');

// Bouw de HTML-structuur op
events.forEach((event) => {
  const targetDate = event.getDate();
  const formattedDate = targetDate.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });

  const section = document.createElement('section');
  section.className = 'countdown-item';
  section.innerHTML = `
    <div class="event-header">
      <h2 class="event-title">${event.name}</h2>
      <span class="event-date" id="${event.id}-date">${formattedDate}</span>
    </div>
    <div class="timer">
      <div class="unit">
        <span class="number" id="${event.id}-days">00</span>
        <span class="label">Days</span>
      </div>
      <div class="unit">
        <span class="number" id="${event.id}-hours">00</span>
        <span class="label">Hours</span>
      </div>
      <div class="unit">
        <span class="number" id="${event.id}-minutes">00</span>
        <span class="label">Minutes</span>
      </div>
      <div class="unit">
        <span class="number" id="${event.id}-seconds">00</span>
        <span class="label">Seconds</span>
      </div>
    </div>
  `;
  container.appendChild(section);
});

function pad(num) {
  return String(num).padStart(2, '0');
}

function updateCountdowns() {
  const now = new Date();

  events.forEach((event) => {
    const target = event.getDate();
    const diff = Math.max(0, target - now);

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
    const minutes = Math.floor((diff / 1000 / 60) % 60);
    const seconds = Math.floor((diff / 1000) % 60);

    document.getElementById(`${event.id}-days`).textContent = pad(days);
    document.getElementById(`${event.id}-hours`).textContent = pad(hours);
    document.getElementById(`${event.id}-minutes`).textContent = pad(minutes);
    document.getElementById(`${event.id}-seconds`).textContent = pad(seconds);
  });
}

updateCountdowns();
setInterval(updateCountdowns, 1000);
