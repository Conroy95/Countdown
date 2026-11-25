const TIMEZONE = 'Europe/Amsterdam';

// Converteer een kalenderdatum (jaar, maand 1-12, dag) naar exact 00:00:00 Nederlandse tijd
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

// Gregoriaanse paasberekening (voor elk jaar)
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

// 4e donderdag van november
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
    id: 'nieuwjaarsdag',
    name: 'Nieuwjaarsdag',
    getDate: () => getNextOccurrence((y) => ({ year: y, month: 1, day: 1 }))
  },
  {
    id: 'goede-vrijdag',
    name: 'Goede Vrijdag',
    getDate: () => getNextOccurrence((y) => addDays(getEaster(y), -2))
  },
  {
    id: 'eerste-paasdag',
    name: 'Eerste Paasdag',
    getDate: () => getNextOccurrence((y) => getEaster(y))
  },
  {
    id: 'tweede-paasdag',
    name: 'Tweede Paasdag',
    getDate: () => getNextOccurrence((y) => addDays(getEaster(y), 1))
  },
  {
    id: 'koningsdag',
    name: 'Koningsdag',
    getDate: () =>
      getNextOccurrence((y) => {
        // Als 27 april op een zondag valt, wordt Koningsdag op 26 april gevierd
        const isSunday = new Date(Date.UTC(y, 3, 27)).getUTCDay() === 0;
        return { year: y, month: 4, day: isSunday ? 26 : 27 };
      })
  },
  {
    id: 'hemelvaartsdag',
    name: 'Hemelvaartsdag',
    getDate: () => getNextOccurrence((y) => addDays(getEaster(y), 39))
  },
  {
    id: 'eerste-pinksterdag',
    name: 'Eerste Pinksterdag',
    getDate: () => getNextOccurrence((y) => addDays(getEaster(y), 49))
  },
  {
    id: 'tweede-pinksterdag',
    name: 'Tweede Pinksterdag',
    getDate: () => getNextOccurrence((y) => addDays(getEaster(y), 50))
  },
  {
    id: 'thanksgiving',
    name: 'Thanksgiving',
    getDate: () => getNextOccurrence((y) => getThanksgiving(y))
  },
  {
    id: 'eerste-kerstdag',
    name: 'Christmas / Eerste Kerstdag',
    getDate: () => getNextOccurrence((y) => ({ year: y, month: 12, day: 25 }))
  },
  {
    id: 'tweede-kerstdag',
    name: 'Tweede Kerstdag',
    getDate: () => getNextOccurrence((y) => ({ year: y, month: 12, day: 26 }))
  }
];

const container = document.getElementById('countdown-list');

// Sorteer zodat de eerstvolgende feestdag altijd bovenaan staat
const sortedEvents = rawEvents
  .map((ev) => ({ ...ev, target: ev.getDate() }))
  .sort((a, b) => a.target - b.target);

sortedEvents.forEach((event) => {
  const formattedDate = event.target.toLocaleDateString('nl-NL', {
    timeZone: TIMEZONE,
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });

  const section = document.createElement('section');
  section.className = 'countdown-item';
  section.innerHTML = `
    <div class="event-header">
      <h2 class="event-title">${event.name}</h2>
      <span class="event-date">${formattedDate}</span>
    </div>
    <div class="timer">
      <div class="unit">
        <span class="number" id="${event.id}-days">00</span>
        <span class="label">Dagen</span>
      </div>
      <div class="unit">
        <span class="number" id="${event.id}-hours">00</span>
        <span class="label">Uren</span>
      </div>
      <div class="unit">
        <span class="number" id="${event.id}-minutes">00</span>
        <span class="label">Minuten</span>
      </div>
      <div class="unit">
        <span class="number" id="${event.id}-seconds">00</span>
        <span class="label">Seconden</span>
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

  sortedEvents.forEach((event) => {
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
