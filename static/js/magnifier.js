let score = 0;
let foundItems = 0;

const scoreDisplay = document.getElementById('score');
const magnifyingGlass = document.getElementById('magnifying-glass');
const glass = document.getElementById('glass');

// Примерни позиции на предмети (можеш да ги променяш)
const itemPositions = [
    { left: '20%', top: '30%' },
    { left: '60%', top: '50%' },
    { left: '40%', top: '70%' },
    { left: '80%', top: '20%' }
];

const items = document.querySelectorAll('.item');

// Присвояваме на всеки елемент случайна позиция
items.forEach((item, index) => {
    item.style.left = itemPositions[index].left;
    item.style.top = itemPositions[index].top;

    // Добавяне на клик събитие
    item.addEventListener('click', () => {
        if (!item.classList.contains('found')) {
            if (item.dataset.correct === "1") {  // Ако е правилен предмет
                item.classList.add('found');
                score += 10;
                foundItems++;
                scoreDisplay.textContent = `Точки: ${score}`;

                // Премахваме правилния предмет от DOM след като е намерен
                item.style.display = 'none'; // Скриваме елемента от екрана

                // Проверяваме дали всички предмети са намерени
                if (foundItems === items.length) {
                    // Добавяме забавяне преди показване на поздравлението
                    setTimeout(() => {
                        alert('Поздравления! Намерихте всички предмети!');
                    }, 100); // Забавяне, за да може съобщението да се покаже след последния клик
                }
            } else {  // Ако е грешен предмет
                alert('Game Over! Опитахте се да изберете грешен предмет.');
                score = 0; // Нулираме точките при грешка
                foundItems = 0; // Нулираме намерените предмети
                scoreDisplay.textContent = `Точки: ${score}`;

                // Рестартираме страницата (периодично презареждане)
                setTimeout(() => {
                    location.reload(); // Рестартира страницата
                }, 500); // Забавяне преди рестартиране (можеш да промениш времето)
            }
        }
    });
});

// Логика за движение на лупичката
document.addEventListener('mousemove', (e) => {
    const overlay = document.getElementById('overlay');
    overlay.style.setProperty('--x', `${e.clientX}px`);
    overlay.style.setProperty('--y', `${e.clientY}px`);
});

// Изтегляне на предмети от Flask (или сървър)
fetch('http://127.0.0.1:5500/items') // Взима данните от Flask
    .then(response => response.json()) // Преобразува в JSON
    .then(data => {
        console.log(data); // Покажи предметите в конзолата
    })
    .catch(error => console.error('Грешка:', error));

// Добавяне на предмети от сървъра
fetch('/items')
.then(response => response.json())
.then(itemsData => {
    const container = document.getElementById('game-container');
    itemsData.forEach(item => {
        const img = document.createElement('img');
        img.src = `/static/images/${item.image}`;
        img.classList.add('game-item');
        img.style.left = `${Math.random() * 80 + 10}%`; // Случайна позиция
        img.style.top = `${Math.random() * 80 + 10}%`;

        img.dataset.correct = item.correct; // Запазва дали е правилен (1 - правилен, 0 - грешен)

        img.addEventListener('click', () => {
            if (img.dataset.correct === "1") {
                img.classList.add('found'); // Добавя стил за намерени предмети
                score += 10;
                foundItems++;
                scoreDisplay.textContent = `Точки: ${score}`;

                // Премахваме правилния предмет от DOM
                img.style.display = 'none'; // Скриваме елемента от екрана

                // Проверяваме дали всички предмети са намерени
                if (foundItems === itemsData.length) {
                    // Добавяме забавяне преди показване на поздравлението
                    setTimeout(() => {
                        alert('Поздравления! Намерихте всички предмети!');
                    }, 100); // Забавяне, за да може съобщението да се покаже след последния клик
                }
            } else {
                alert('Game Over! Опитахте се да изберете грешен предмет.');
                score = 0;
                foundItems = 0;
                scoreDisplay.textContent = `Точки: ${score}`;

                // Рестартираме страницата след грешка
                setTimeout(() => {
                    location.reload(); // Рестартира страницата
                }, 500); // Забавяне преди рестартиране
            }
        });

        container.appendChild(img);
    });
})
.catch(error => console.error('Грешка:', error));
