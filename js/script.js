function getWorkingDaysLeft(targetDate, freeDaysArray = []) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    let count = 0;
    let current = new Date(today);
    
    // Begin pas de volgende dag te tellen om te corrigeren naar de 24 dagen
    current.setDate(current.getDate() + 1);

    if (current >= targetDate) return 0;

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
    // 1. Amerika
    const targetAmerika = new Date(2026, 5, 27); 
    const freeDaysAmerika = [
        new Date(2026, 3, 14).getTime(),
        new Date(2026, 3, 15).getTime(),
        new Date(2026, 3, 25).getTime(),
        new Date(2026, 5, 5).getTime(),
        new Date(2026, 5, 12).getTime(),
        new Date(2026, 5, 19).getTime(),
        new Date(2026, 5, 26).getTime()
    ];
    const dagenAmerika = getWorkingDaysLeft(targetAmerika, freeDaysAmerika);
    document.getElementById('amerika').innerText = `Amerika in ${dagenAmerika} dagen`;

    // 2. Kerst
    const targetKerst = new Date(2026, 11, 25); 
    const dagenKerst = getWorkingDaysLeft(targetKerst);
    document.getElementById('kerst').innerText = `Kerstvakantie in ${dagenKerst} dagen`;

    // 3. Zomervakantie
    const targetZomer = new Date(2026, 5, 27); 
    const dagenZomer = getWorkingDaysLeft(targetZomer);
    document.getElementById('zomer').innerText = `Zomervakantie in ${dagenZomer} dagen`;

    // 4. Weekend!
    const nextFriday = new Date();
    nextFriday.setDate(nextFriday.getDate() + (5 - nextFriday.getDay() + 7) % 7);
    const dagenWeekend = getWorkingDaysLeft(nextFriday);
    document.getElementById('weekend').innerText = `Weekend in ${dagenWeekend} dagen`;
};
