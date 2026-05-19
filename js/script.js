function getWorkingDaysLeft(targetDate) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    let count = 0;
    let current = new Date(today);
    
    // We starten met tellen vanaf morgen
    current.setDate(current.getDate() + 1);

    if (current >= targetDate) return 0;

    while (current < targetDate) {
        const dayOfWeek = current.getDay(); 

        const isWeekend = (dayOfWeek === 0 || dayOfWeek === 6); // 0 = zondag, 6 = zaterdag
        const isVrijdag = (dayOfWeek === 5);                  // 5 = vrijdag

        // Tel de dag alleen mee als het van maandag t/m donderdag is
        if (!isWeekend && !isVrijdag) {
            count++;
        }
        current.setDate(current.getDate() + 1);
    }
    return count;
}

window.onload = function() {
    // 1. Amerika (27 juni 2026)
    const targetAmerika = new Date(2026, 5, 27); 
    const dagenAmerika = getWorkingDaysLeft(targetAmerika);
    document.getElementById('amerika').innerText = `Amerika in ${dagenAmerika} werkdagen`;

    // 2. Zomervakantie (25 juli 2026)
    const targetZomer = new Date(2026, 6, 25); 
    const dagenZomer = getWorkingDaysLeft(targetZomer);
    document.getElementById('zomer').innerText = `Zomervakantie in ${dagenZomer} werkdagen`;

    // 3. Kerstvakantie (25 december 2026)
    const targetKerst = new Date(2026, 11, 25); 
    const dagenKerst = getWorkingDaysLeft(targetKerst);
    document.getElementById('kerst').innerText = `Kerstvakantie in ${dagenKerst} werkdagen`;

    // 4. Oud & Nieuw (31 december 2026)
    const targetOudNieuw = new Date(2026, 11, 31); 
    const dagenOudNieuw = getWorkingDaysLeft(targetOudNieuw);
    document.getElementById('oudnieuw').innerText = `Oud & Nieuw in ${dagenOudNieuw} werkdagen`;
};
