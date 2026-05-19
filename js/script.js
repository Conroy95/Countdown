function getWorkingDaysLeft(targetDate) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    let count = 0;
    let current = new Date(today); // We starten DIRECT vanaf vandaag (19 mei) te tellen

    if (current >= targetDate) return 0;

    while (current < targetDate) {
        const dayOfWeek = current.getDay(); 
        const currentMonth = current.getMonth(); // 4 = Mei, 5 = Juni, 6 = Juli, 11 = Dec, 0 = Jan
        const currentDate = current.getDate();

        const isWeekend = (dayOfWeek === 0 || dayOfWeek === 6); // Zondag = 0, Zaterdag = 6
        
        // Vrijdag logica:
        // Vrijdag (5) is een vrije dag in Juni (maand 5) EN in Juli (maand 6) tot en met 20 juli.
        let isVrijdagVrij = false;
        if (dayOfWeek === 5) {
            if (currentMonth === 5) { 
                isVrijdagVrij = true; // Hele maand juni alle vrijdagen vrij
            } else if (currentMonth === 6 && currentDate <= 20) {
                isVrijdagVrij = true; // In juli alleen vrijdagen vrij tot en met de 20e
            }
        }

        // Kerstvakantie logica:
        // Vrij van 25 december (maand 11) t/m 3 januari (maand 0)
        let isKerstVakantie = false;
        if ((currentMonth === 11 && currentDate >= 25) || (currentMonth === 0 && currentDate <= 3)) {
            isKerstVakantie = true;
        }

        // De dag telt alleen als werkdag als het geen weekend, geen vrije vrijdag én geen kerstvakantie is
        if (!isWeekend && !isVrijdagVrij && !isKerstVakantie) {
            count++;
        }
        
        current.setDate(current.getDate() + 1);
    }
    return count;
}

window.onload = function() {
    // 1. Amerika (27 juni 2026) -> Maand 5 = Juni
    const targetAmerika = new Date(2026, 5, 27); 
    document.getElementById('amerika').innerText = `Amerika in ${getWorkingDaysLeft(targetAmerika)} werkdagen`;

    // 2. Zomervakantie (25 juli 2026) -> Maand 6 = Juli
    const targetZomer = new Date(2026, 6, 25); 
    document.getElementById('zomer').innerText = `Zomervakantie in ${getWorkingDaysLeft(targetZomer)} werkdagen`;

    // 3. Kerstvakantie (25 december 2026) -> Maand 11 = December
    const targetKerst = new Date(2026, 11, 25); 
    document.getElementById('kerst').innerText = `Kerstvakantie in ${getWorkingDaysLeft(targetKerst)} werkdagen`;

    // 4. Oud & Nieuw (31 december 2026) -> Maand 11 = December
    const targetOudNieuw = new Date(2026, 11, 31); 
    document.getElementById('oudnieuw').innerText = `Oud & Nieuw in ${getWorkingDaysLeft(targetOudNieuw)} werkdagen`;
};
