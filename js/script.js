function getWorkingDaysLeft(targetDate) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    let count = 0;
    let current = new Date(today); // Start direct op vandaag (19 mei)

    if (current >= targetDate) return 0;

    while (current < targetDate) {
        const dayOfWeek = current.getDay(); 
        const currentMonth = current.getMonth(); // 4=Mei, 5=Juni, 6=Juli, 11=Dec, 0=Jan
        const currentDate = current.getDate();

        const isWeekend = (dayOfWeek === 0 || dayOfWeek === 6);
        
        // 1. Vrije dag: Maandag 25 mei 2026
        const isPinksteren = (currentMonth === 4 && currentDate === 25);

        // 2. Vrijdagen vrij vanaf juni tot en met 20 juli
        let isVrijdagVrij = false;
        if (dayOfWeek === 5) {
            if (currentMonth === 5) { 
                isVrijdagVrij = true; // Juni
            } else if (currentMonth === 6 && currentDate <= 20) {
                isVrijdagVrij = true; // Juli t/m de 20e
            }
        }

        // 3. Jouw vakantie: 27 juni t/m 18 juli
        let isMijnVakantie = false;
        // Controleer of de datum binnen 27-06 en 18-07 valt
        if ((currentMonth === 5 && currentDate >= 27) || (currentMonth === 6 && currentDate <= 18)) {
            isMijnVakantie = true;
        }

        // 4. Kerstvakantie: 25 december t/m 3 januari
        let isKerstVakantie = false;
        if ((currentMonth === 11 && currentDate >= 25) || (currentMonth === 0 && currentDate <= 3)) {
            isKerstVakantie = true;
        }

        // De dag telt alleen als er GEEN enkele uitzondering actief is
        if (!isWeekend && !isPinksteren && !isVrijdagVrij && !isMijnVakantie && !isKerstVakantie) {
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
