const TIMEZONE = 'Europe/Amsterdam';

function getDutchMidnight(year, month, day) {
  const approxUtc = new Date(Date.UTC(year, month - 1, day, 0, 0, 0));
  const parts = new Intl.DateTimeFormat('en-US', {
    timeZone: TIMEZONE,
    timeZoneName: 'shortOffset'
  }).formatToParts(approxUtc);

  const tzPart = parts.find((p) => p.type === 'timeZoneName').value;
  const match = tzPart.match(/GMT([+-]\d+)(?::(\d+))?/);
  const offsetHours = match ? parseInt(match[1], 10) : 1;
  const offsetMinutes = match && match[2] ? parseInt(match[2], 10) : 0;
  const totalOffsetMs = (offsetHours * 60 + Math.sign(offsetHours) * offsetMinutes) * 60 * 1000;

  return new Date(Date.UTC(year, month - 1, day, 0, 0, 0) - totalOffsetMs);
}

function addDays(dateObj, days) {
  const d = new Date(Date.UTC(dateObj.year, dateObj.month - 1, dateObj.day + days));
  return {
    year: d.getUTCFullYear(),
    month: d.getUTCMonth() + 1,
    day: d.getUTCDate()
  };
}

function getEaster(year) {
  const a = year % 19;
  const b = Math.floor(year / 100);
  const c = year % 100;
  const d = Math.floor(b / 4);
  const e = b % 4;
  const f = Math.floor((b + 8) / 25);
  const g = Math.floor((b - f + 1) / 3);
  const h = (19 * a + b - d - g + 15) % 30;
  const i = Math.floor(c / 4);
  const k = c % 4;
  const l = (32 + 2 * e + 2 * i - h - k) % 7;
  const m = Math.floor((a + 11 * h + 22 * l) / 451);
  const month = Math.floor((h + l - 7 * m + 114) / 31);
  const day = ((h + l - 7 * m + 114) % 31) + 1;
  return { year, month, day };
}

function getThanksgiving(year) {
  const novFirst = new Date(Date.UTC(year, 10, 1));
  const dayOfWeek = novFirst.getUTCDay();
  const offset = (4 - dayOfWeek + 7) % 7;
  return { year, month: 11, day: 1 + offset + 21 };
}

function getNextOccurrence(getDatePartsForYear) {
  const now = new Date();
  const currentYear = Number(
    new Intl.DateTimeFormat('en-US', { timeZone: TIMEZONE, year: 'numeric' }).format(now)
  );

  let parts = getDatePartsForYear(currentYear);
  let target = getDutchMidnight(parts.year, parts.month, parts.day);

  if (now >= target) {
    parts = getDatePartsForYear(currentYear + 1);
    target = getDutchMidnight(parts.year, parts.month, parts.day);
  }
  return target;
}

const rawEvents = [
  {
    name: 'Nieuwjaarsdag',
    getDate: () => getNextOccurrence((y) => ({ year: y, month: 1, day: 1 }))
  },
  {
    name: 'Goede Vrijdag',
    getDate: () => getNextOccurrence((y) => addDays(getEaster(y), -2))
  },
  {
    name: 'Eerste Paasdag',
    getDate: () => getNextOccurrence((y) => getEaster(y))
  },
  {
    name: 'Tweede Paasdag',
    getDate: () => getNextOccurrence((y) => addDays(getEaster(y), 1))
  },
  {
    name: 'Koningsdag',
    getDate: () =>
      getNextOccurrence((y) => {
        const isSunday = new Date(Date.UTC(y, 3, 27)).getUTCDay() === 0;
        return { year: y, month: 4, day: isSunday ? 26 : 27 };
      })
  },
  {
    name: 'Hemelvaartsdag',
    getDate: () => getNextOccurrence((y) => addDays(getEaster(y), 39))
  },
  {
    name: 'Eerste Pinksterdag',
    getDate: () => getNextOccurrence((y) => addDays(getEaster(y), 49))
  },
  {
    name: 'Tweede Pinksterdag',
    getDate: () => getNextOccurrence((y) => addDays(getEaster(y), 50))
  },
  {
    name: 'Thanksgiving',
    getDate: () => getNextOccurrence((y) => getThanksgiving(y))
  },
  {
    name: 'Eerste Kerstdag',
    getDate: () => getNextOccurrence((y) => ({ year: y, month: 12, day: 25 }))
  },
  {
    name: 'Tweede Kerstdag',
    getDate: () => getNextOccurrence((y) => ({ year: y, month: 12, day: 26 }))
  }
];

function getSortedEvents() {
  return rawEvents
    .map((ev) => ({ ...ev, target: ev.getDate() }))
    .sort((a, b) => a.target - b.target);
}

let events = getSortedEvents();
let currentIndex = 0;

const widget = document.getElementById('widget');

widget.innerHTML = `
  <div class="header-row">
    <button class="nav-btn" id="prev-btn" aria-label="Vorige">&lsaquo;</button>
    <div class="event-info">
      <h1 class="event-title" id="event-title"></h1>
      <span class="event-date" id="event-date"></span>
    </div>
    <button class="nav-btn" id="next-btn" aria-label="Volgende">&rsaquo;</button>
  </div>
  <div class="timer">
    <div class="unit">
      <span class="number" id="days">00</span>
      <span class="label">Dagen</span>
    </div>
    <div class="unit">
      <span class="number" id="hours">00</span>
      <span class="label">Uren</span>
    </div>
    <div class="unit">
      <span class="number" id="minutes">00</span>
      <span class="label">Minuten</span>
    </div>
    <div class="unit">
      <span class="number" id="seconds">00</span>
      <span class="label">Seconden</span>
    </div>
  </div>
`;

function pad(num) {
  return String(num).padStart(2, '0');
}

function renderHeader() {
  const current = events[currentIndex];
  document.getElementById('event-title').textContent = current.name;
  document.getElementById('event-date').textContent = current.target.toLocaleDateString('nl-NL', {
    timeZone: TIMEZONE,
    weekday: 'short',
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });
}

function updateTimer() {
  const now = new Date();
  let current = events[currentIndex];

  // Herbereken als een datum zojuist verstreken is
  if (now >= current.target) {
    events = getSortedEvents();
    currentIndex = 0;
    current = events[0];
    renderHeader();
  }

  const diff = Math.max(0, current.target - now);
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
  const minutes = Math.floor((diff / 1000 / 60) % 60);
  const seconds = Math.floor((diff / 1000) % 60);

  document.getElementById('days').textContent = pad(days);
  document.getElementById('hours').textContent = pad(hours);
  document.getElementById('minutes').textContent = pad(minutes);
  document.getElementById('seconds').textContent = pad(seconds);
}

document.getElementById('prev-btn').addEventListener('click', () => {
  currentIndex = (currentIndex - 1 + events.length) % events.length;
  renderHeader();
  updateTimer();
});

document.getElementById('next-btn').addEventListener('click', () => {
  currentIndex = (currentIndex + 1) % events.length;
  renderHeader();
  updateTimer();
});

renderHeader();
updateTimer();
setInterval(updateTimer, 1000);
