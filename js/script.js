 function checkAnswers() {
            const correctAnswers = {
                q1: "b",
                q2: "b",
                q3: "c",
                q4: "b",
                q5: "b"
            };
            
            let score = 0;
            const totalQuestions = Object.keys(correctAnswers).length;
            
            // Проверяем каждый вопрос
            for (let i = 1; i <= totalQuestions; i++) {
                const questionName = `q${i}`;
                const selectedOption = document.querySelector(`input[name="${questionName}"]:checked`);
                
                if (selectedOption) {
                    const questionDiv = document.getElementById(questionName);
                    
                    if (selectedOption.value === correctAnswers[questionName]) {
                        score++;
                        questionDiv.classList.add("correct");
                        questionDiv.classList.remove("incorrect");
                    } else {
                        questionDiv.classList.add("incorrect");
                        questionDiv.classList.remove("correct");
                    }
                }
            }
            
            // Показываем результат
            const resultDiv = document.getElementById("result");
            resultDiv.style.display = "block";
            
            if (score === totalQuestions) {
                resultDiv.textContent = `Поздравляем! Вы набрали ${score} из ${totalQuestions}! Вы настоящий эксперт по Миядзаки!`;
                resultDiv.className = "correct";
            } else if (score >= totalQuestions / 2) {
                resultDiv.textContent = `Хороший результат! Вы набрали ${score} из ${totalQuestions}. Вы знаете многое о вселенной Миядзаки!`;
                resultDiv.className = "correct";
            } else {
                resultDiv.textContent = `Вы набрали ${score} из ${totalQuestions}. Возможно, стоит пересмотреть фильмы Миядзаки!`;
                resultDiv.className = "incorrect";
            }
            
            // Прокручиваем к результату
            resultDiv.scrollIntoView({ behavior: 'smooth' });
}
// Переключение темы
function setupThemeToggle() {
    const themeToggle = document.createElement('div');
    themeToggle.className = 'theme-switch';
    themeToggle.id = 'themeToggle';
    themeToggle.innerHTML = `
        <i class="fas fa-moon theme-icon"></i>
        <span>Темная тема</span>
    `;

    const themeContainer = document.createElement('div');
    themeContainer.className = 'theme-switch-container';
    themeContainer.appendChild(themeToggle);

    const header = document.querySelector('header');
    if (header) {
        header.appendChild(themeContainer);
    }

    themeToggle.addEventListener('click', () => {
        document.body.classList.toggle('dark-theme');
        
        if (document.body.classList.contains('dark-theme')) {
            themeToggle.querySelector('.theme-icon').className = 'fas fa-sun theme-icon';
            themeToggle.querySelector('span').textContent = 'Светлая тема';
        } else {
            themeToggle.querySelector('.theme-icon').className = 'fas fa-moon theme-icon';
            themeToggle.querySelector('span').textContent = 'Темная тема';
        }
        
        // Сохраняем выбор пользователя
        localStorage.setItem('theme', document.body.classList.contains('dark-theme') ? 'dark' : 'light');
    });
    
    // Проверяем сохраненную тему
    if (localStorage.getItem('theme') === 'dark') {
        document.body.classList.add('dark-theme');
        const icon = themeToggle.querySelector('.theme-icon');
        const text = themeToggle.querySelector('span');
        if (icon && text) {
            icon.className = 'fas fa-sun theme-icon';
            text.textContent = 'Светлая тема';
        }
    }
}

// Инициализация при загрузке страницы
document.addEventListener('DOMContentLoaded', function() {
    setupThemeToggle();
    
    // Добавляем Font Awesome для иконок
    const faLink = document.createElement('link');
    faLink.rel = 'stylesheet';
    document.head.appendChild(faLink);
});

const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();
const port = 3000;

// Middleware для CORS
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  next();
});

// Загрузка данных
const films = JSON.parse(fs.readFileSync(path.join(__dirname, 'data', 'films.json'), 'utf8'));
const studio = JSON.parse(fs.readFileSync(path.join(__dirname, 'data', 'studio.json'), 'utf8'));
const awards = JSON.parse(fs.readFileSync(path.join(__dirname, 'data', 'awards.json'), 'utf8'));

// Маршруты API
app.get('/api/films', (req, res) => {
  res.json(films);
});

app.get('/api/films/:id', (req, res) => {
  const film = films.find(f => f.id === parseInt(req.params.id));
  if (!film) return res.status(404).json({ error: 'Фильм не найден' });
  res.json(film);
});

app.get('/api/studio', (req, res) => {
  res.json(studio);
});

app.get('/api/awards', (req, res) => {
  res.json(awards);
});

// Статические файлы
app.use(express.static(path.join(__dirname, 'public')));

// Запуск сервера
app.listen(port, () => {
  console.log(`Сервер запущен на http://localhost:${port}`);
});
