function getWorkingDaysLeft(targetDate, freeDaysArray = []) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    let count = 0;
    let current = new Date(today);

    while (current < targetDate) {
        const dayOfWeek = current.getDay(); 
        const currentTime = current.getTime();

        const isWeekend = (dayOfWeek === 0 || dayOfWeek === 6);
        const isFreeDay = freeDaysArray.includes(currentTime);

        if (!isWeekend && !isFreeDay) {
            count++;
        }
        current.setDate(current.getDate() + 1);
    }
    return count;
}

window.onload = function() {
    // Stel hier je deadline en eventuele vrije dagen in
    const targetMei = new Date(2026, 4, 30); // 30 mei 2026
    const freeDaysMei = [
        new Date(2026, 4, 14).getTime(),
        new Date(2026, 4, 15).getTime()
    ];
    
    // Toon het resultaat
    document.getElementById('vrij-mei').innerText = getWorkingDaysLeft(targetMei, freeDaysMei);
};
