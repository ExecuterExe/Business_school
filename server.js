const express = require('express');
const connection = require('./db');  // Подключаем базу данных из db.js
const bcrypt = require('bcrypt');

const app = express();
const port = 3000;

// Middleware для парсинга JSON
app.use(express.json());

// Маршрут для регистрации
app.post('/register', (req, res) => {
    const { username, email, password } = req.body;

    // Проверка наличия всех необходимых данных
    if (!username || !email || !password) {
        return res.status(400).send('Необходимы все поля: username, email и password');
    }

    // Хэшируем пароль
    bcrypt.hash(password, 10, (err, hash) => {
        if (err) {
            console.error('Ошибка хэширования:', err);
            return res.status(500).send('Ошибка при хэшировании пароля');
        }

        const query = 'INSERT INTO users (username, email, password) VALUES (?, ?, ?)';

        // Выполняем запрос на добавление пользователя
        connection.query(query, [username, email, hash], (err, result) => {
            if (err) {
                console.error('Ошибка при выполнении SQL-запроса:', err);
                return res.status(500).send('Ошибка при регистрации: ' + err.sqlMessage);
            }
            res.send('Регистрация успешна!');
        });
    });
});

// Маршрут для входа
app.post('/login', (req, res) => {
    const { email, password } = req.body;

    // Проверка наличия всех необходимых данных
    if (!email || !password) {
        return res.status(400).send('Необходимы все поля: email и password');
    }

    // Проверяем, существует ли пользователь с таким email
    const query = 'SELECT * FROM users WHERE email = ?';
    connection.query(query, [email], (err, results) => {
        if (err) {
            console.error('Ошибка при выполнении SQL-запроса:', err);
            return res.status(500).send('Ошибка при входе');
        }

        // Если пользователь не найден
        if (results.length === 0) {
            return res.status(401).send('Неверный email или пароль');
        }

        // Сравниваем пароли
        const user = results[0];
        bcrypt.compare(password, user.password, (err, isMatch) => {
            if (err) {
                console.error('Ошибка при сравнении паролей:', err);
                return res.status(500).send('Ошибка при входе');
            }

            if (!isMatch) {
                return res.status(401).send('Неверный email или пароль');
            }

            res.send('Вход успешен!');
        });
    });
});


app.listen(port, () => {
    console.log(`Сервер запущен на http://localhost:${port}`);
});
