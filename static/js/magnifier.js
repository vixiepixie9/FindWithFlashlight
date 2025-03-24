let score = 0;
let foundItems = 0;

const scoreDisplay = document.getElementById('score');
const gameContainer = document.getElementById('game-container');

const usedPositions = [];  // Списък със заетите координати

fetch('/items')
    .then(response => response.json())
    .then(itemsData => {
        console.log("Получени предмети от бекенда:", itemsData);

        const correctItemsCount = itemsData.filter(item => item.correct == 1).length;
        console.log(`Общ брой правилни предмети: ${correctItemsCount}`);

        itemsData.forEach(item => {
            const img = document.createElement('img');
            img.src = `/static/images/${item.image}`;
            img.classList.add('game-item');

            // Генерираме уникални координати
            let position;
            do {
                position = {
                    left: Math.random() * 80 + 10,  // Процент от ширината
                    top: Math.random() * 80 + 10   // Процент от височината
                };
            } while (isOverlapping(position));  // Проверяваме за припокриване

            usedPositions.push(position);  // Запазваме позицията
            img.style.left = `${position.left}%`;
            img.style.top = `${position.top}%`;
            img.dataset.correct = item.correct;

            console.log(`Създаден предмет:`, item, `на позиция:`, position);

            img.addEventListener('click', () => handleItemClick(img, correctItemsCount));
            gameContainer.appendChild(img);
        });
    })
    .catch(error => {
        console.error('Грешка при зареждане на предметите:', error);
    });

// Функция за проверка на припокриването
function isOverlapping(newPos) {
    const minDistance = 10; // Минимално разстояние между предметите (в проценти)
    
    return usedPositions.some(pos => {
        return Math.abs(pos.left - newPos.left) < minDistance &&
               Math.abs(pos.top - newPos.top) < minDistance;
    });
}

function handleItemClick(img, correctItemsCount) {

    if (img.classList.contains('found')) return;

    if (img.dataset.correct === "1") {
        img.classList.add('found');
        score += 10;
        foundItems++;
        scoreDisplay.textContent = `Точки: ${score}`;
        img.style.display = 'none';

        console.log(`Намерени предмети: ${foundItems}/${correctItemsCount}`);

        if (foundItems === correctItemsCount) {
            setTimeout(() => {
                alert('Поздравления! Намерихте всички правилни предмети!');
            }, 100);
        }
    } else {
        alert('Game Over! Опитахте се да изберете грешен предмет.');
        resetGame();
    }
}

// Функция за рестартиране на играта
function resetGame() {
    score = 0;
    foundItems = 0;
    scoreDisplay.textContent = `Точки: ${score}`;
    setTimeout(() => location.reload(), 500);
}

// Логика за движение на лупичката
document.addEventListener('mousemove', (e) => {
    const overlay = document.getElementById('overlay');
    overlay.style.setProperty('--x', `${e.clientX}px`);
    overlay.style.setProperty('--y', `${e.clientY}px`);
});
