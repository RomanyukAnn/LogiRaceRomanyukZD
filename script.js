// Функція відкриття рюкзака
function openBackpack(event) {
    if (event) {
        event.stopPropagation();
    }
    const modal = document.getElementById('backpack-modal');
    if (modal) {
        modal.style.display = 'flex';
    }
}

// Закриття модального вікна рюкзака
function closeModal(event) {
    const modal = document.getElementById('backpack-modal');
    if (event.target === modal) {
        modal.style.display = 'none';
    }
}

function closeModalDirect() {
    document.getElementById('backpack-modal').style.display = 'none';
}

// Логування
document.addEventListener('DOMContentLoaded', function() {
    console.log('🚀 Система холу активована. Ласкаво просимо на станцію Logirace-04.');
});
