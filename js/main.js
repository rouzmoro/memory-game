const launchBtn = document.querySelector('.launch-screen__button');
const gameBtn = document.querySelector('.game__button');
const resultBtn = document.querySelector('.result-screen__button');
const gameScreen = document.querySelector('.game');
const cards = document.querySelectorAll('.card');
const currentPoints = document.querySelector('.counter__points');
let timeouts = [];
let firstCard,
    secondCard,
    lockBoard,
    unopenedPairs


launchBtn.addEventListener('click', () => {
    launchBtn.closest('.screen').classList.add('screen--hidden');
    resetGame();
    startGame();
});

gameBtn.addEventListener('click', () => {
    showResult();
});

resultBtn.addEventListener('click', () => {
    gameScreen.classList.remove('screen--hidden');
    resetGame();
    startGame();
});

// Выбрать карту
function selectCard() {
    // Если игровое поле заблокировано, то не реагируем на нажатие
    if (lockBoard) return;
    // Если нажали на ту же карту, то не реагируем на нажатие
    if (this === firstCard) return;

    this.classList.add('card--flipped');

    // Выбираем первую карту
    if (!firstCard) {
        firstCard = this;
        return;
    }

    secondCard = this;
    lockBoard = true;

    // Проверяем карты на совпадение
    if (firstCard.dataset.value === secondCard.dataset.value) {
        disableCards();
    } else {
        unflipCards();
    }
}

// Скрыть разгаданные карты
function disableCards() {
    firstCard.removeEventListener('click', selectCard);
    secondCard.removeEventListener('click', selectCard);

    setTimeout(() => {
        firstCard.classList.add('card--hidden');
        secondCard.classList.add('card--hidden');

        resetMove();
    }, 1000);

    // Число баллов увеличивается на количество нераскрытых пар
    currentPoints.textContent = parseInt(currentPoints.textContent) + --unopenedPairs;

    if (unopenedPairs == 0) {
        showResult();
    }
}

// Перевернуть неразгаданные карты обратно
function unflipCards() {
    setTimeout(() => {
        firstCard.classList.remove('card--flipped');
        secondCard.classList.remove('card--flipped');

        resetMove();
    }, 1000);

    // Число баллов уменьшается на количество раскрытых пар
    const resultPoints = currentPoints.textContent - (cards.length / 2 - unopenedPairs);
    currentPoints.textContent = resultPoints > 0 ? resultPoints : 0;
}

// Сбросить результаты хода
function resetMove() {
    lockBoard = false;
    [firstCard, secondCard] = [null, null];
}

// Сбросить все параметры
function resetGame() {
    unopenedPairs = cards.length / 2;
    currentPoints.textContent = 0;

    resetMove();

    for (let card of cards) {
        card.classList.remove('card--hidden');
        card.classList.remove('card--flipped');
        card.removeEventListener('click', selectCard);
    }

    // Очищаем таймеры
    if (timeouts.length) {
        timeouts.forEach(timeout => {
            clearTimeout(timeout);
        });
        timeouts = [];
    }
}

// Запустить игру
function startGame() {
    // Перемешиваем карты
    cards.forEach(card => {
        card.style.order = randomInteger(0, cards.length);
    });

    // Раскрываем карты на 5 секунд и переворачиваем обратно
    for (let card of cards) {
        card.classList.add('card--flipped');

        let timeout = setTimeout(() => {
            card.classList.remove('card--flipped');
            card.addEventListener('click', selectCard);
        }, 5000);
        timeouts.push(timeout);
    }
}

// Показать результат
function showResult() {
    const resultString = document.querySelector('.result-screen__text');
    const resultPoints = parseInt(currentPoints.textContent);
    const resultWord = getNoun(resultPoints, 'балл', 'балла', 'баллов');

    gameScreen.classList.add('screen--hidden');
    resultString.innerHTML = `Вы набрали <span class="result-screen__points">${resultPoints}</span> ${resultWord}`;
}

// Сгенерировать случайное целое число
function randomInteger(min, max) {
    let random = min + Math.random() * (max + 1 - min);
    return Math.floor(random);
}

// Склонение числительных
function getNoun(number, one, two, five) {
    let n = Math.abs(number);
    n %= 100;
    if (n >= 5 && n <= 20) {
        return five;
    }
    n %= 10;
    if (n === 1) {
        return one;
    }
    if (n >= 2 && n <= 4) {
        return two;
    }
    return five;
}
