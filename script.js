const content = document.getElementById('content');
const oxDisplay = document.getElementById('ox-level');
const errorOverlay = document.getElementById('error-overlay');
const errorMsg = document.getElementById('error-msg');
const modal = document.getElementById('hint-modal');
const pauseBtn = document.getElementById('screen-pause-btn');
const gameOverScreen = document.getElementById('game-over-screen');

let step = 0;
let oxygen = 99;
let attempts = 0;
let gameActive = false;
let isPaused = false;
let openedHints = []; 

const questions = [
    { 
        q: "Загадка: Скільки літер у назві 'LogiRace'?", 
        a: ["8", "вісім"], 
        hint: "Просто порахуй букви в слові L-o-g-i-R-a-c-e", 
        img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTnZs58SDwn0_k-P8wny3dQ7XK9HWxLlYztgw&s" 
    },
    { 
        q: "Сонце — це планета чи зірка?", 
        a: ["зірка"], 
        hint: "Це величезна гаряча куля, що світить нам щодня.", 
        img: "https://i.pinimg.com/originals/1a/4e/a5/1a4ea50c266ca383edca5a61c8f89508.gif" 
    },
    { 
        q: "Яка планета Сонячної системи є четвертою від Сонця?", 
        a: ["марс"], 
        hint: "Ти зараз на цій планеті!", 
        img: "https://i.pinimg.com/originals/57/d0/4e/57d04ec2fb7c183adfe167887718bede.gif" 
    },
    { 
        q: "Що ми шукаємо на інших планетах: воду чи сік?", 
        a: ["воду"], 
        hint: "Без неї неможливе життя.", 
        img: "https://i.pinimg.com/originals/bd/25/ea/bd25ea96fe36fc48b2041a8d4bf7e3b2.gif" 
    },
    { 
        q: "Чи є на Марсі повітря, яким можна дихати людині?", 
        a: ["ні", "немає", "нема"], 
        hint: "Саме тому тобі потрібен скафандр і кисень у грі.", 
        img: "https://i.pinimg.com/originals/37/8e/ab/378eabe3f90259f97d680449dee494cc.gif" 
    },
    { 
        q: "Скільки літер у слові 'Logika'?", 
        a: ["6", "шість"], 
        hint: "Порахуй символи: L-O-G-I-K-A", 
        img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTnZs58SDwn0_k-P8wny3dQ7XK9HWxLlYztgw&s" 
    },
    { 
        q: "Яка мова програмування робить цей квест інтерактивним?", 
        a: ["javascript", "js", "джаваскрипт"], 
        hint: "Головними є HTML, CSS, ...", 
        img: "https://i.pinimg.com/originals/34/a9/de/34a9de0ab7e39c4307932436329334f2.gif" 
    },  
    { 
        q: "Якщо на станції було 10 марсоходів, а 3 з них зламалися. Скільки залишилося?", 
        a: ["7", "сім"], 
        hint: "Проста арифметика: 10 мінус 3.", 
        img: "https://i.pinimg.com/originals/e1/f3/cf/e1f3cf55feee3abb89a6932c80583fbb.gif"
    },
    { 
        q: "Скільки секунд в одній хвилині?", 
        a: ["60", "шістдесят"], 
        hint: "Це базовий час для будь-якої місії.", 
        img: "https://i.pinimg.com/originals/83/d6/1c/83d61c2311a386a4c85c008eb652da03.gif" 
    }
];

// Таймер
setInterval(() => {
    if (gameActive && !isPaused && oxygen > 0) {
        oxygen--;
        updateUI();
        if (oxygen <= 0) gameOver();
    }
}, 2000);

function updateUI() {
    oxDisplay.innerText = `Кисень: ${oxygen}%`;
}

function render() {
    if (step === 0) {
        content.innerHTML = `
            <h1>МІСІЯ: МАРС</h1>
            <p>Твій корабель приземлився. У тебе 99% кисню. Виконай завдання, щоб дійти до бази</p>
            <button onclick="startGame()">ПОЧАТИ МІСІЮ</button>
        `;
    } else if (step <= questions.length) {
        const q = questions[step - 1];
        content.innerHTML = `
            <h2>ЗАВДАННЯ ${step}</h2>
            <p>${q.q}</p>
            <input type="text" id="ans" placeholder="Введіть відповідь..." autocomplete="off">
            <button onclick="checkAnswer()">ПЕРЕВІРИТИ</button>
            <br>
            <button onclick="showHint()" style="margin-top:20px; background:none; border:1px dashed #777; color: #aaa; cursor: pointer;">
                💡 ПІДКАЗКА (-15% O2)
            </button>
        `;
        
        const inputField = document.getElementById('ans');
        if (inputField) {
            inputField.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') checkAnswer();
            });
            inputField.focus();
        }
    } else {
        winGame();
    }
}

window.startGame = () => { step = 1; gameActive = true; render(); };

window.checkAnswer = () => {
    if (isPaused || !gameActive) return;
    
    const input = document.getElementById('ans');
    if (!input) return;
    
    const val = input.value.toLowerCase().trim();
    
    const currentA = questions[step - 1].a;
    const possibleAnswers = Array.isArray(currentA) ? currentA : [currentA];
    const isCorrect = possibleAnswers.some(ans => ans.toString().toLowerCase() === val);

    if (isCorrect) {
        oxygen = Math.min(100, oxygen + 5); // +5% за правильну відповідь
        updateUI();
        attempts = 0; 
        step++; 
        render();
    } else {
        attempts++;
        if (attempts < 2) {
            showError("Неправильно! Спробуй ще раз.");
            input.value = '';
            input.focus();
        } else {
            showError("Системна помилка! Автоматичний перехід (-15% кисню)");
            oxygen -= 15; 
            attempts = 0; 
            step++; 
            updateUI(); 
            render();
        }
    }
};

window.showHint = () => {
    if (isPaused || !gameActive) return;
    const qIndex = step - 1;
    if (!openedHints.includes(qIndex)) {
        if (oxygen <= 15) {
            showError("Занадто мало кисню для активації підказки!");
            return;
        }
        oxygen -= 15;
        openedHints.push(qIndex);
        updateUI();
    }
    const q = questions[qIndex];
    document.getElementById('hint-text').innerText = q.hint;
    document.getElementById('hint-media').innerHTML = `<img src="${q.img}" style="width:90%; border-radius:15px; margin-top:10px;">`;
    modal.classList.add('active');
};

window.togglePause = () => {
    if (!gameActive) return;
    isPaused = !isPaused;
    pauseBtn.innerText = isPaused ? "▶ ВІДНОВИТИ" : "⏸ ПАУЗА";
    content.style.opacity = isPaused ? "0.2" : "1";
    content.style.pointerEvents = isPaused ? "none" : "all";
};

window.closeHint = () => modal.classList.remove('active');
window.closeError = () => errorOverlay.style.display = "none";

function showError(text) { 
    errorMsg.innerText = text; 
    errorOverlay.style.display = "flex"; 
}

function gameOver() { 
    gameActive = false; 
    gameOverScreen.style.display = "flex"; // Показуємо червоний екран
}

function winGame() { 
    gameActive = false; 
    content.innerHTML = `
        <h1>МІСІЯ ВИКОНАНА!</h1>
        <p>Вітаємо! Ви врятували базу. Залишок кисню: ${oxygen}%</p>
        <button onclick="goToCorridor()">ПРОЙТИ ДАЛІ →</button>
    `; 
}

// Нова функція для переходу на corridor.html
function goToCorridor() {
    window.location.href = 'corridor.html';
}

// Запуск при завантаженні
window.onload = render;