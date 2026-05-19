// Centrale functie om werkdagen te berekenen tot een specifieke datum
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

// Hier voer je de berekeningen uit zodra de pagina laadt
window.onload = function() {
    
    // --- COUNTDOWN 1: Vakantie in Mei ---
    const targetMei = new Date(2026, 4, 30); // 30 mei 2026
    const freeDaysMei = [
        new Date(2026, 4, 14).getTime(),
        new Date(2026, 4, 15).getTime()
    ];
    document.getElementById('vrij-mei').innerText = getWorkingDaysLeft(targetMei, freeDaysMei);

    // --- COUNTDOWN 2: Kerstvakantie ---
    const targetKerst = new Date(2026, 11, 25); // 25 december 2026 (Maand 11 = December)
    document.getElementById('kerst').innerText = getWorkingDaysLeft(targetKerst);

    // --- COUNTDOWN 3: Zomervakantie ---
    const targetZomer = new Date(2026, 5, 27); // 27 juni 2026 (Maand 5 = Juni)
    document.getElementById('zomer').innerText = getWorkingDaysLeft(targetZomer);
};
