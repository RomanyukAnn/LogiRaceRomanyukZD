/*===============================================
    corridor.js - Sektor-04 Access System
    Марсіанський бункер: код доступу
===============================================*/

let currentCode = "";
// Код: Земля(1 супутник - Місяць) = 1
//       Планети(8) = 8
//       Марс(2 супутники) = 2
//       Сонце(зірка) = 1
const targetCode = "1821";

// Відкриття клавіатури
function openKeypad() {
    const overlay = document.getElementById('ui-overlay');
    overlay.style.display = 'flex';
    
    // Скидаємо записку до закритого стану
    const note = document.getElementById('folded-note');
    if (note.classList.contains('open')) {
        note.classList.remove('open');
    }
    
    // Скидаємо введений код
    resetInput();
    
    // Додаємо невелику затримку для анімації
    setTimeout(() => {
        const firstButton = document.querySelector('.button-grid button');
        if (firstButton) firstButton.focus();
    }, 100);
}

// Закриття клавіатури
function closeKeypad() {
    const overlay = document.getElementById('ui-overlay');
    overlay.style.display = 'none';
    resetInput();
}

// Перемикання записки
function toggleNoteView(event) {
    event.stopPropagation();
    const note = document.getElementById('folded-note');
    note.classList.toggle('open');
}

// Додавання цифри
function addDigit(digit) {
    if (currentCode.length < 4) {
        currentCode += digit;
        updateScreen();
        
        // Вібрація (якщо підтримується)
        if (navigator.vibrate) {
            navigator.vibrate(20);
        }
    }
}

// Скидання введення
function resetInput() {
    currentCode = "";
    updateScreen();
}

// Оновлення екрану клавіатури
function updateScreen() {
    const screen = document.getElementById('code-screen');
    if (screen) {
        let display = currentCode;
        while (display.length < 4) {
            display += "_";
        }
        screen.innerText = display;
    }
}

// Валідація коду
function validateCode() {
    if (currentCode === targetCode) {
        // Успішний доступ - перенаправлення на end.html
        showSuccessAndRedirect();
    } else {
        // Невірний код
        showErrorMessage();
        resetInput();
        
        // Ефект помилки на екрані
        const screen = document.getElementById('code-screen');
        if (screen) {
            screen.style.color = "#ff0000";
            screen.style.textShadow = "0 0 15px #ff0000";
            setTimeout(() => {
                screen.style.color = "var(--danger)";
                screen.style.textShadow = "0 0 12px var(--danger)";
            }, 300);
        }
    }
}

// Показати повідомлення успіху та перенаправити
function showSuccessAndRedirect() {
    const overlay = document.getElementById('ui-overlay');
    const successDiv = document.createElement('div');
    successDiv.className = 'success-message';
    successDiv.innerHTML = `
        <div class="success-content">
            <div class="success-icon">✓</div>
            <div class="success-text">ACCESS GRANTED</div>
            <div class="success-sub">SECTOR 04 UNLOCKED</div>
            <div class="redirect-timer">Redirecting in <span id="timer">3</span>...</div>
        </div>
    `;
    successDiv.style.cssText = `
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background: linear-gradient(135deg, rgba(0,30,0,0.95), rgba(0,15,0,0.98));
        border: 2px solid #0f0;
        border-radius: 20px;
        padding: 30px 50px;
        text-align: center;
        z-index: 2000;
        animation: successPulse 0.5s ease;
        backdrop-filter: blur(10px);
    `;
    
    const style = document.createElement('style');
    style.textContent = `
        @keyframes successPulse {
            0% { transform: translate(-50%, -50%) scale(0.8); opacity: 0; }
            50% { transform: translate(-50%, -50%) scale(1.1); }
            100% { transform: translate(-50%, -50%) scale(1); opacity: 1; }
        }
        .success-icon {
            font-size: 60px;
            color: #0f0;
            text-shadow: 0 0 20px #0f0;
            animation: iconGlow 0.8s ease-in-out infinite alternate;
        }
        @keyframes iconGlow {
            from { text-shadow: 0 0 10px #0f0; }
            to { text-shadow: 0 0 30px #0f0; }
        }
        .success-text {
            font-size: 28px;
            font-weight: bold;
            color: #0f0;
            letter-spacing: 5px;
            margin-top: 15px;
        }
        .success-sub {
            font-size: 14px;
            color: #8f8;
            margin-top: 8px;
            letter-spacing: 2px;
        }
        .redirect-timer {
            margin-top: 20px;
            font-size: 14px;
            color: #ccc;
            letter-spacing: 1px;
        }
        .redirect-timer span {
            color: #0f0;
            font-size: 18px;
            font-weight: bold;
        }
    `;
    document.head.appendChild(style);
    document.body.appendChild(successDiv);
    
    // Відчиняємо двері
    const vault = document.querySelector('.vault-structure');
    if (vault) {
        vault.classList.add('doors-open');
    }
    
    // Змінюємо статус інтеркому
    const statusDot = document.querySelector('.status-dot');
    if (statusDot) {
        statusDot.style.background = "#0f0";
        statusDot.style.boxShadow = "0 0 12px #0f0";
    }
    
    // Таймер для перенаправлення
    let timeLeft = 3;
    const timerElement = successDiv.querySelector('#timer');
    
    const timerInterval = setInterval(() => {
        timeLeft--;
        if (timerElement) {
            timerElement.textContent = timeLeft;
        }
        
        if (timeLeft <= 0) {
            clearInterval(timerInterval);
            // Перенаправлення на end.html
            window.location.href = 'end.html';
        }
    }, 1000);
    
    // Закриваємо клавіатуру
    setTimeout(() => {
        closeKeypad();
    }, 500);
}

// Показати повідомлення помилки
function showErrorMessage() {
    const screen = document.getElementById('code-screen');
    
    screen.style.animation = 'shake 0.3s ease-in-out';
    
    const shakeStyle = document.createElement('style');
    shakeStyle.textContent = `
        @keyframes shake {
            0%, 100% { transform: translateX(0); }
            25% { transform: translateX(-8px); }
            75% { transform: translateX(8px); }
        }
    `;
    document.head.appendChild(shakeStyle);
    
    // Створюємо тимчасове повідомлення про помилку
    const errorMsg = document.createElement('div');
    errorMsg.textContent = '❌ ACCESS DENIED ❌';
    errorMsg.style.cssText = `
        position: fixed;
        top: 30%;
        left: 50%;
        transform: translateX(-50%);
        background: rgba(255,0,0,0.9);
        color: white;
        padding: 10px 20px;
        border-radius: 8px;
        font-size: 14px;
        font-weight: bold;
        z-index: 2000;
        animation: fadeOut 1.5s ease forwards;
        pointer-events: none;
    `;
    
    const fadeStyle = document.createElement('style');
    fadeStyle.textContent = `
        @keyframes fadeOut {
            0% { opacity: 1; transform: translateX(-50%) translateY(0); }
            70% { opacity: 1; }
            100% { opacity: 0; transform: translateX(-50%) translateY(-20px); visibility: hidden; }
        }
    `;
    document.head.appendChild(fadeStyle);
    document.body.appendChild(errorMsg);
    
    setTimeout(() => {
        screen.style.animation = '';
        shakeStyle.remove();
        errorMsg.remove();
        fadeStyle.remove();
    }, 1500);
}

// Додаткова функція для debug (можна використовувати в консолі)
window.debugUnlock = function() {
    currentCode = targetCode;
    validateCode();
};

// Додаємо обробник клавіш клавіатури
document.addEventListener('keydown', function(event) {
    const overlay = document.getElementById('ui-overlay');
    if (overlay && overlay.style.display === 'flex') {
        const key = event.key;
        if (key >= '0' && key <= '9') {
            addDigit(key);
            event.preventDefault();
        } else if (key === 'Enter') {
            validateCode();
            event.preventDefault();
        } else if (key === 'Escape') {
            closeKeypad();
            event.preventDefault();
        } else if (key === 'c' || key === 'C') {
            resetInput();
            event.preventDefault();
        }
    }
});

// Додаємо ефект наведення на двері
document.addEventListener('DOMContentLoaded', function() {
    const intercom = document.querySelector('.intercom-device');
    if (intercom) {
        intercom.addEventListener('mouseenter', function() {
            const dot = document.querySelector('.status-dot');
            if (dot && dot.style.background !== 'rgb(0, 255, 0)') {
                dot.style.background = "#8a0000";
                dot.style.boxShadow = "0 0 8px rgba(255,0,0,0.5)";
            }
        });
        
        intercom.addEventListener('mouseleave', function() {
            const dot = document.querySelector('.status-dot');
            if (dot && dot.style.background !== 'rgb(0, 255, 0)') {
                dot.style.background = "#4a0000";
                dot.style.boxShadow = "0 0 5px rgba(255,0,0,0.3)";
            }
        });
    }
    
    // Анімація "дихання" для небезпечних елементів
    const dangerElements = document.querySelectorAll('.under-floor-light, .scanner-line');
    dangerElements.forEach(el => {
        el.style.animation = 'flicker 3.5s infinite';
    });
    
    console.log("Sektor-04 System Online");
    console.log("Підказка: код з 4 цифр можна знайти у записці");
    console.log("Для дебагу: window.debugUnlock() - відчинити двері");
});

// Перевірка чи end.html існує (для дебагу)
window.checkEndPage = function() {
    fetch('end.html', { method: 'HEAD' })
        .then(response => {
            if (response.ok) {
                console.log("✅ end.html знайдено");
            } else {
                console.warn("⚠️ end.html не знайдено! Створіть файл end.html");
            }
        })
        .catch(() => console.error("❌ Помилка перевірки end.html"));
};