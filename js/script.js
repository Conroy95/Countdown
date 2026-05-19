function getWorkingDaysLeft(targetDate, freeDaysArray = []) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    let count = 0;
    let current = new Date(today);

    if (current >= targetDate) return 0;

    while (current < targetDate) {
        const dayOfWeek = current.getDay(); 
        const currentTime = current.getTime();

        const isWeekend = (dayOfWeek === 0 || dayOfWeek === 6);
        const isFreeDay = freeDaysArray.includes(currentTime);

        // Alleen tellen als het een doordeweekse dag is én geen vrije dag
        if (!isWeekend && !isFreeDay) {
            count++;
        }
        current.setDate(current.getDate() + 1);
    }
    return count;
}

window.onload = function() {
    // 1. Amerika (als voorbeeld de deadline gezet op 27 juni 2026)
    const targetAmerika = new Date(2026, 5, 27); 
    
    // Jouw specifieke vrije dagen die worden afgetrokken:
    const freeDaysAmerika = [
        new Date(2026, 3, 14).getTime(), // 14-04-2026
        new Date(2026, 3, 15).getTime(), // 15-04-2026
        new Date(2026, 3, 25).getTime(), // 25-04-2026
        new Date(2026, 5, 5).getTime(),  // 05-06-2026
        new Date(2026, 5, 12).getTime(), // 12-06-2026
        new Date(2026, 5, 19).getTime(), // 19-06-2026
        new Date(2026, 5, 26).getTime()  // 26-06-2026
    ];
    document.getElementById('amerika').innerText = getWorkingDaysLeft(targetAmerika, freeDaysAmerika);

    // 2. Kerst
    const targetKerst = new Date(2026, 11, 25); 
    document.getElementById('kerst').innerText = getWorkingDaysLeft(targetKerst);

    // 3. Zomervakantie
    const targetZomer = new Date(2026, 5, 27); 
    document.getElementById('zomer').innerText = getWorkingDaysLeft(targetZomer);

    // 4. Weekend!
    const nextFriday = new Date();
    nextFriday.setDate(nextFriday.getDate() + (5 - nextFriday.getDay() + 7) % 7);
    document.getElementById('weekend').innerText = getWorkingDaysLeft(nextFriday);
};
