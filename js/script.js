function getWorkingDaysLeft(targetDate, freeDaysArray = []) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    let count = 0;
    // We starten met tellen vanaf morgen
    let current = new Date(today);
    current.setDate(current.getDate() + 1);

    if (current >= targetDate) return 0;

    while (current < targetDate) {
        const dayOfWeek = current.getDay(); 
        const currentTime = current.getTime();

        const isWeekend = (dayOfWeek === 0 || dayOfWeek === 6);
        const isFreeDay = freeDaysArray.includes(currentTime);

        // Tel de dag alleen mee als het een doordeweekse dag is én je geen vrije dag hebt
        if (!isWeekend && !isFreeDay) {
            count++;
        }
        current.setDate(current.getDate() + 1);
    }
    return count;
}

window.onload = function() {
    // Jouw specifieke losse vrije dagen in juni 2026 (Maand 5 = Juni)
    const mijnVrijeDagen = [
        new Date(2026, 5, 5).getTime(),  // 05-06-2026
        new Date(2026, 5, 12).getTime(), // 12-06-2026
        new Date(2026, 5, 19).getTime(), // 19-06-2026
        new Date(2026, 5, 24).getTime(), // 24-06-2026
        new Date(2026, 5, 26).getTime()  // 26-06-2026
    ];

    // 1. Amerika (27 juni 2026)
    const targetAmerika = new Date(2026, 5, 27); 
    const dagenAmerika = getWorkingDaysLeft(targetAmerika, mijnVrijeDagen);
    document.getElementById('amerika').innerText = `Amerika in ${dagenAmerika} werkdagen`;

    // 2. Zomervakantie (25 juli 2026)
    const targetZomer = new Date(2026, 6, 25); 
    const dagenZomer = getWorkingDaysLeft(targetZomer, mijnVrijeDagen);
    document.getElementById('zomer').innerText = `Zomervakantie in ${dagenZomer} werkdagen`;

    // 3. Kerstvakantie (25 december 2026)
    const targetKerst = new Date(2026, 11, 25); 
    const dagenKerst = getWorkingDaysLeft(targetKerst, mijnVrijeDagen);
    document.getElementById('kerst').innerText = `Kerstvakantie in ${dagenKerst} werkdagen`;

    // 4. Oud & Nieuw (31 december 2026)
    const targetOudNieuw = new Date(2026, 11, 31); 
    const dagenOudNieuw = getWorkingDaysLeft(targetOudNieuw, mijnVrijeDagen);
    document.getElementById('oudnieuw').innerText = `Oud & Nieuw in ${dagenOudNieuw} werkdagen`;
};
