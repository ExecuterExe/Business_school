const mysql = require('mysql2');

const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root', // замените на ваше имя пользователя
    password: 'Executer1', // замените на ваш пароль
    database: 'finunivers_db' // имя вашей базы данных
});

connection.connect(err => {
    if (err) {
        console.error('Ошибка подключения к базе данных:', err);
        return;
    }
    console.log('Успешное подключение к базе данных MySQL!');
});

module.exports = connection;
