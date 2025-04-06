document.addEventListener('DOMContentLoaded', () => {
    let score = 0;
    let foundItems = 0;

    const scoreDisplay = document.querySelector('.game-score');
    const gameContainer = document.getElementById('game-container');

    const usedPositions = [];

    function isOverlapping(newPos) {
        const minDistance = 10;
        
        return usedPositions.some(pos => {
            return Math.abs(pos.left - newPos.left) < minDistance &&
                   Math.abs(pos.top - newPos.top) < minDistance;
        });
    }

    fetch('/items')
        .then(response => response.json())
        .then(itemsData => {
            console.log('Получени предмети:', itemsData);
            const correctItemsCount = itemsData.filter(item => item.correct == 1).length;
            console.log(`Общ брой правилни предмети: ${correctItemsCount}`);
            
            itemsData.forEach(item => {
                const img = document.createElement('img');
                img.src = `/static/images/${item.image}`;
                img.classList.add('game-item');

                let position;
                do {
                    position = {
                        left: Math.random() * (gameContainer.clientWidth - 50),
                        top: Math.random() * (gameContainer.clientHeight - 50)
                    };
                } while (isOverlapping(position));
                
                usedPositions.push(position);
                img.style.left = `${position.left}px`;
                img.style.top = `${position.top}px`;            
                img.dataset.correct = item.correct;

                img.addEventListener('click', () => handleItemClick(img, correctItemsCount));
                document.getElementById('game-area').appendChild(img);
            });
        })
        .catch(error => {
            console.error('Грешка при зареждане на предметите:', error);
        });

    function handleItemClick(img, correctItemsCount) {

        if (img.classList.contains('found')) return;

        console.log("Кликнат предмет:", img.dataset.correct);

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
            alert('Край на играта! Избрахте грешен предмет.');
            resetGame();
        }
    }

    function resetGame() {
        score = 0;
        foundItems = 0;
        scoreDisplay.textContent = `Точки: ${score}`;
        setTimeout(() => location.reload(), 500);
    }

    document.addEventListener('mousemove', (e) => {
        const overlay = document.getElementById('overlay');
        overlay.style.setProperty('--x', `${e.clientX}px`);
        overlay.style.setProperty('--y', `${e.clientY}px`);
    });
});
