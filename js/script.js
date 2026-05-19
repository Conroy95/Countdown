function getWorkingDaysLeft(targetDate, freeDaysArray = []) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    let count = 0;
    let current = new Date(today);
    
    // Begin de volgende dag te tellen om correct af te ronden
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

// Hulpfunctie om een aaneengesloten datumbereik (t/m) toe te voegen
function addRangeToFreeDays(startDate, endDate, freeDaysArray) {
    let current = new Date(startDate);
    while (current <= endDate) {
        freeDaysArray.push(current.getTime());
        current.setDate(current.getDate() + 1);
    }
}

window.onload = function() {
    // Jouw gezamenlijke basislijst met losse vrije dagen (Maand is 0-geindexeerd, dus april=3, juni=5)
    const mijnVrijeDagen = [
        new Date(2026, 3, 14).getTime(), // 14-04-2026
        new Date(2026, 3, 15).getTime(), // 15-04-2026
        new Date(2026, 3, 25).getTime(), // 25-04-2026
        new Date(2026, 5, 5).getTime(),  // 05-06-2026
        new Date(2026, 5, 12).getTime(), // 12-06-2026
        new Date(2026, 5, 19).getTime(), // 19-06-2026
        new Date(2026, 5, 24).getTime(), // 24-06-2026
        new Date(2026, 5, 26).getTime()  // 26-06-2026
    ];

    // Voeg de vakantieperiode toe: 27 juni 2026 t/m 18 juli 2026 (juli = maand 6)
    const startPeriode = new Date(2026, 5, 27);
    const eindPeriode = new Date(2026, 6, 18);
    addRangeToFreeDays(startPeriode, eindPeriode, mijnVrijeDagen);


    // 1. Amerika (Voorbeeld deadline op 27 juni gehouden, past zich aan o.b.v. jouw vrije dagen)
    const targetAmerika = new Date(2026, 5, 27); 
    const dagenAmerika = getWorkingDaysLeft(targetAmerika, mijnVrijeDagen);
    document.getElementById('amerika').innerText = `Amerika in ${dagenAmerika} dagen`;

    // 2. Kerst (25 december 2026)
    const targetKerst = new Date(2026, 11, 25); 
    const dagenKerst = getWorkingDaysLeft(targetKerst, mijnVrijeDagen);
    document.getElementById('kerst').innerText = `Kerstvakantie in ${dagenKerst} dagen`;

    // 3. Zomervakantie (Nu aangepast naar 25 juli 2026!)
    const targetZomer = new Date(2026, 6, 25); 
    const dagenZomer = getWorkingDaysLeft(targetZomer, mijnVrijeDagen);
    document.getElementById('zomer').innerText = `Zomervakantie in ${dagenZomer} dagen`;

    // 4. Weekend!
    const nextFriday = new Date();
    nextFriday.setDate(nextFriday.getDate() + (5 - nextFriday.getDay() + 7) % 7);
    const dagenWeekend = getWorkingDaysLeft(nextFriday, mijnVrijeDagen);
    document.getElementById('weekend').innerText = `Weekend in ${dagenWeekend} dagen`;
};
