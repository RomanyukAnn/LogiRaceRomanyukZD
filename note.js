function checkConnection() {
    const errorBox = document.getElementById('conn-error');
    errorBox.style.display = 'block';
    
    // Сховати через 3 секунди
    setTimeout(() => {
        errorBox.style.display = 'none';
    }, 3000);
}

function toggleAudio() {
    // Тут можна додати логіку ввімкнення музики, 
    // але поки що зробимо просто сповіщення
    alert("Audio system: Offline due to low power.");
}

// Додамо легке тремтіння записки при наведенні
const note = document.querySelector('.paper-note');
note.addEventListener('mouseover', () => {
    note.style.transform = 'rotate(0deg) scale(1.02)';
});
note.addEventListener('mouseout', () => {
    note.style.transform = 'rotate(-1deg) scale(1)';
});