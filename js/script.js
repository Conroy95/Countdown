function calculate() {
    // Deadline: 27 juni 2026
    const target = new Date(2026, 5, 27); 
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Jouw vrije dagen (Mei = maand 4, Juni = maand 5)
    const freeDays = [
        new Date(2026, 4, 14).getTime(),
        new Date(2026, 4, 15).getTime(),
        new Date(2026, 4, 25).getTime(),
        new Date(2026, 5, 5).getTime(),
        new Date(2026, 5, 12).getTime(),
        new Date(2026, 5, 19).getTime(),
        new Date(2026, 5, 26).getTime()
    ];

    let count = 0;
    let current = new Date(today);

    while (current < target) {
        const dayOfWeek = current.getDay(); 
        const currentTime = current.getTime();

        const isWeekend = (dayOfWeek === 0 || dayOfWeek === 6);
        const isFreeDay = freeDays.includes(currentTime);

        if (!isWeekend && !isFreeDay) {
            count++;
        }
        current.setDate(current.getDate() + 1);
    }
    return count;
}

// Zet de berekende dagen in de HTML
document.getElementById('days').innerText = calculate();
