/* ========================================
   END.JS - 3D Panorama with 360° rotation
   Epic Mars Finale
   ======================================== */

let scene, camera, renderer, sphere;
let isDragging = false;
let previousMousePosition = { x: 0, y: 0 };
let targetRotation = { x: 0, y: 0 };
let currentRotation = { x: 0, y: 0 };
let autoRotate = true;
let autoRotateSpeed = 0.002;

// Текст для друку
const finalMessage = "Ти зробив неможливе. Марс тепер має нового героя. Панорама червоної планети відкривається перед тобою. Запам'ятай цей момент.";

// Безкоштовні панорами Марса (одна з них завантажиться)
const panoramaUrls = [
    'https://raw.githubusercontent.com/mrdoob/three.js/dev/examples/textures/planets/mars_atmos_2048.jpg',
];

let currentUrlIndex = 0;

// Ініціалізація 3D сцени
function initPanorama() {
    const container = document.getElementById('panorama-container');
    if (!container) return;
    
    // Створюємо сцену
    scene = new THREE.Scene();
    
    // Створюємо камеру (всередині сфери)
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.set(0, 0, 0.1);
    
    // Створюємо рендерер
    renderer = new THREE.WebGLRenderer({ preserveDrawingBuffer: true, alpha: false });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    container.appendChild(renderer.domElement);
    
    // Додаємо фоновий градієнт (на випадок, якщо текстура не завантажиться)
    scene.background = new THREE.Color(0x0a0a2a);
    
    // Створюємо геометрію сфери
    const geometry = new THREE.SphereGeometry(500, 128, 128);
    
    // Створюємо матеріал з кольором за замовчуванням
    const material = new THREE.MeshBasicMaterial({
        color: 0xcc8844,
        side: THREE.BackSide
    });
    
    sphere = new THREE.Mesh(geometry, material);
    scene.add(sphere);
    
    // Завантажуємо текстуру
    loadPanoramaTexture(currentUrlIndex);
    
    // Додаємо зоряне поле
    addStarfield();
    
    // Додаємо червоне світіння (атмосфера Марса)
    addMarsGlow();
    
    // Запускаємо анімацію
    animate();
    
    // Додаємо обробники подій
    addEventListeners();
    
    console.log('✅ 3D Panorama initialized');
}

// Завантаження текстури панорами
function loadPanoramaTexture(index) {
    if (index >= panoramaUrls.length) {
        console.log('🎨 Використовуємо колір за замовчуванням (марсіанський пейзаж)');
        return;
    }
    
    const textureLoader = new THREE.TextureLoader();
    const url = panoramaUrls[index];
    
    console.log(`📷 Завантаження панорами: ${url}`);
    
    textureLoader.load(url, 
        // Success callback
        (texture) => {
            console.log('✅ Панорама завантажена успішно!');
            sphere.material.map = texture;
            sphere.material.color.setHex(0xffffff);
            sphere.material.needsUpdate = true;
        },
        // Progress callback
        undefined,
        // Error callback
        (error) => {
            console.warn(`❌ Не вдалося завантажити ${url}`);
            // Спроба наступної текстури
            currentUrlIndex++;
            loadPanoramaTexture(currentUrlIndex);
        }
    );
}

// Додаємо зоряне поле
function addStarfield() {
    const starGeometry = new THREE.BufferGeometry();
    const starCount = 3000;
    const starPositions = new Float32Array(starCount * 3);
    
    for (let i = 0; i < starCount; i++) {
        starPositions[i * 3] = (Math.random() - 0.5) * 2000;
        starPositions[i * 3 + 1] = (Math.random() - 0.5) * 2000;
        starPositions[i * 3 + 2] = (Math.random() - 0.5) * 800 - 400;
    }
    
    starGeometry.setAttribute('position', new THREE.BufferAttribute(starPositions, 3));
    
    const starMaterial = new THREE.PointsMaterial({
        color: 0xffffff,
        size: 0.4,
        transparent: true,
        opacity: 0.8
    });
    
    const stars = new THREE.Points(starGeometry, starMaterial);
    scene.add(stars);
}

// Додаємо ефект марсіанського світіння
function addMarsGlow() {
    // Додаємо червонувате ambient світло для ефекту
    const ambientLight = new THREE.AmbientLight(0x442200);
    scene.add(ambientLight);
    
    // Додаємо точкове світло для ефекту
    const pointLight = new THREE.PointLight(0xff6622, 0.5);
    pointLight.position.set(100, 100, 100);
    scene.add(pointLight);
}

// Додаємо обробники для миші та тачів
function addEventListeners() {
    const container = document.getElementById('panorama-container');
    if (!container) return;
    
    // Події миші
    container.addEventListener('mousedown', (e) => {
        e.preventDefault();
        isDragging = true;
        autoRotate = false;
        previousMousePosition = { x: e.clientX, y: e.clientY };
        container.style.cursor = 'grabbing';
    });
    
    window.addEventListener('mousemove', (e) => {
        if (!isDragging) return;
        
        const deltaX = e.clientX - previousMousePosition.x;
        const deltaY = e.clientY - previousMousePosition.y;
        
        targetRotation.y += deltaX * 0.008;
        targetRotation.x += deltaY * 0.008;
        
        // Обмежуємо вертикальне обертання
        targetRotation.x = Math.max(-Math.PI / 2.2, Math.min(Math.PI / 2.2, targetRotation.x));
        
        previousMousePosition = { x: e.clientX, y: e.clientY };
    });
    
    window.addEventListener('mouseup', () => {
        isDragging = false;
        container.style.cursor = 'grab';
        
        // Через 5 секунд повертаємо автообертання
        setTimeout(() => {
            if (!isDragging) {
                autoRotate = true;
            }
        }, 5000);
    });
    
    // Події для сенсорних екранів
    container.addEventListener('touchstart', (e) => {
        e.preventDefault();
        isDragging = true;
        autoRotate = false;
        previousMousePosition = { x: e.touches[0].clientX, y: e.touches[0].clientY };
    });
    
    container.addEventListener('touchmove', (e) => {
        if (!isDragging) return;
        e.preventDefault();
        
        const deltaX = e.touches[0].clientX - previousMousePosition.x;
        const deltaY = e.touches[0].clientY - previousMousePosition.y;
        
        targetRotation.y += deltaX * 0.008;
        targetRotation.x += deltaY * 0.008;
        targetRotation.x = Math.max(-Math.PI / 2.2, Math.min(Math.PI / 2.2, targetRotation.x));
        
        previousMousePosition = { x: e.touches[0].clientX, y: e.touches[0].clientY };
    });
    
    container.addEventListener('touchend', () => {
        isDragging = false;
        setTimeout(() => {
            if (!isDragging) autoRotate = true;
        }, 5000);
    });
    
    container.style.cursor = 'grab';
}

// Анімація обертання
function animate() {
    requestAnimationFrame(animate);
    
    // Автоматичне обертання
    if (autoRotate && !isDragging) {
        targetRotation.y += autoRotateSpeed;
    }
    
    // Плавна інтерполяція
    currentRotation.y += (targetRotation.y - currentRotation.y) * 0.08;
    currentRotation.x += (targetRotation.x - currentRotation.x) * 0.08;
    
    if (sphere) {
        sphere.rotation.y = currentRotation.y;
        sphere.rotation.x = currentRotation.x;
    }
    
    if (renderer && scene && camera) {
        renderer.render(scene, camera);
    }
}

// Ефект друку тексту
function typewriterEffect() {
    const textElement = document.getElementById('typing-text');
    if (!textElement) return;
    
    let index = 0;
    textElement.textContent = '';
    
    function type() {
        if (index < finalMessage.length) {
            textElement.textContent += finalMessage.charAt(index);
            index++;
            setTimeout(type, 45);
        }
    }
    
    type();
}

// Рестарт гри - перехід на hall.html
function restartGame() {
    // Ефект згасання
    const overlay = document.querySelector('.overlay');
    const container = document.getElementById('panorama-container');
    
    if (overlay) {
        overlay.style.transition = 'opacity 0.8s ease';
        overlay.style.opacity = '0';
    }
    
    if (container) {
        container.style.transition = 'opacity 0.8s ease';
        container.style.opacity = '0';
    }
    
    // Зберігаємо дані про завершення
    localStorage.setItem('marsMissionCompleted', 'true');
    localStorage.setItem('completionDate', new Date().toISOString());
    
    // Перехід на hall.html
    setTimeout(() => {
        window.location.href = 'hall.html';
    }, 800);
}

// Адаптація під зміну розміру вікна
window.addEventListener('resize', () => {
    if (camera) {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
    }
    if (renderer) {
        renderer.setSize(window.innerWidth, window.innerHeight);
    }
});

// Запуск при завантаженні сторінки
window.addEventListener('load', () => {
    console.log('🎬 Epic Mars Panorama 360° Loaded!');
    
    // Ініціалізуємо 3D панораму
    initPanorama();
    
    // Запускаємо ефект друку тексту
    setTimeout(() => {
        typewriterEffect();
    }, 500);
    
    // Плавна поява оверлею
    const overlay = document.querySelector('.overlay');
    if (overlay) {
        overlay.style.opacity = '0';
        setTimeout(() => {
            overlay.style.transition = 'opacity 1.5s ease';
            overlay.style.opacity = '1';
        }, 100);
    }
    
    // Вібрація для мобільних
    if (navigator.vibrate) {
        navigator.vibrate([200, 100, 200]);
    }
    
    console.log('%c🚀 MISSION ACCOMPLISHED! 🚀', 'color: #ff5e00; font-size: 20px; font-weight: bold;');
    console.log('%cОбертай панораму мишею або пальцем!', 'color: #39ff14; font-size: 14px;');
});

// Глобальна функція для рестарту
window.restartGame = restartGame;