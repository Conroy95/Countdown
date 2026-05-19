function getWorkingDaysLeft(targetDate) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    let count = 0;
    let current = new Date(today); // We starten direct vanaf vandaag (19 mei)

    if (current >= targetDate) return 0;

    while (current < targetDate) {
        const dayOfWeek = current.getDay(); 
        const currentMonth = current.getMonth(); // 4 = Mei, 5 = Juni, 6 = Juli, 11 = Dec, 0 = Jan
        const currentDate = current.getDate();
        const currentTime = current.getTime();

        const isWeekend = (dayOfWeek === 0 || dayOfWeek === 6); // Zondag = 0, Zaterdag = 6
        
        // Specifieke vrije dag: Maandag 25 mei 2026 (Maand 4 = Mei)
        const isPinksteren = (currentMonth === 4 && currentDate === 25);

        // Vrijdag logica:
        // Vrijdag (5) is een vrije dag in Juni (maand 5) EN in Juli (maand 6) tot en met 20 juli.
        let isVrijdagVrij = false;
        if (dayOfWeek === 5) {
            if (currentMonth === 5) { 
                isVrijdagVrij = true;
            } else if (currentMonth === 6 && currentDate <= 20) {
                isVrijdagVrij = true;
            }
        }

        // Kerstvakantie logica:
        // Vrij van 25 december (maand 11) t/m 3 januari (maand 0)
        let isKerstVakantie = false;
        if ((currentMonth === 11 && currentDate >= 25) || (currentMonth === 0 && currentDate <= 3)) {
            isKerstVakantie = true;
        }

        // De dag telt ALLEEN als werkdag als het:
        // GEEN weekend is, GEEN 25 mei is, GEEN vrije vrijdag is én GEEN kerstvakantie is
        if (!isWeekend && !isPinksteren && !isVrijdagVrij && !isKerstVakantie) {
            count++;
        }
        
        current.setDate(current.getDate() + 1);
    }
    return count;
}

window.onload = function() {
    // 1. Amerika (27 juni 2026)
    const targetAmerika = new Date(2026, 5, 27); 
    document.getElementById('amerika').innerText = `Amerika in ${getWorkingDaysLeft(targetAmerika)} werkdagen`;

    // 2. Zomervakantie (25 juli 2026)
    const targetZomer = new Date(2026, 6, 25); 
    document.getElementById('zomer').innerText = `Zomervakantie in ${getWorkingDaysLeft(targetZomer)} werkdagen`;

    // 3. Kerstvakantie (25 december 2026)
    const targetKerst = new Date(2026, 11, 25); 
    document.getElementById('kerst').innerText = `Kerstvakantie in ${getWorkingDaysLeft(targetKerst)} werkdagen`;

    // 4. Oud & Nieuw (31 december 2026)
    const targetOudNieuw = new Date(2026, 11, 31); 
    document.getElementById('oudnieuw').innerText = `Oud & Nieuw in ${getWorkingDaysLeft(targetOudNieuw)} werkdagen`;
};
