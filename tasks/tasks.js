const taskData = {
    1: {
        title: "Задание 1",
        description: "Средняя величина - это значение по середине у чего-то. Представьте три дома.",
        type: "number",
        answer: 4
    },
    2: {
        title: "Задание 2",
        description: "Выберите правильное определение статистики:",
        type: "single-choice",
        options: [
            "Наука о подсчете чисел",
            "Наука о сборе, анализе и интерпретации данных",
            "Наука о создании графиков",
            "Наука о вычислении средних значений"
        ],
        answer: 1
    },
    3: {
        title: "Задание 3",
        description: "Выберите все области, где применяется статистика:",
        type: "multiple-choice",
        options: [
            "Экономика",
            "Медицина",
            "Социология",
            "Кулинария"
        ],
        answer: [0, 1, 2]
    }
};

class TaskManager {
    constructor() {
        this.tasks = document.querySelectorAll('.task');
        this.taskContent = document.getElementById('taskContent');
        this.taskTitle = document.getElementById('taskTitle');
        this.taskDescription = document.getElementById('taskDescription');
        this.taskAnswer = document.getElementById('taskAnswer');
        this.multipleChoiceContainer = document.getElementById('multipleChoiceContainer');
        this.submitTask = document.getElementById('submitTask');
        this.closeTaskButton = document.getElementById('closeTask');
        this.completedTasks = JSON.parse(localStorage.getItem('completedTasks')) || [];
        this.currentTask = null;

        this.init();
    }

    init() {
        this.updateTaskAvailability();
        this.addEventListeners();
    }

    updateTaskAvailability() {
        this.tasks.forEach((task, index) => {
            const taskId = task.dataset.taskId;
            if (index === 0 || this.completedTasks.includes(taskId) ||
                (index > 0 && this.completedTasks.includes((index).toString()))) {
                task.classList.remove('disabled');
                if (this.completedTasks.includes(taskId)) {
                    task.classList.add('completed');
                }
            } else {
                task.classList.add('disabled');
            }
        });
    }

    addEventListeners() {
        this.tasks.forEach(task => {
            task.addEventListener('click', () => this.toggleTask(task));
        });

        this.submitTask.addEventListener('click', () => this.submitAnswer());
        this.closeTaskButton.addEventListener('click', () => this.closeTask());
    }

    toggleTask(task) {
        if (task.classList.contains('disabled')) {
            alert('Пожалуйста, выполните предыдущие задания');
            return;
        }

        const taskId = task.dataset.taskId;

        if (this.currentTask === taskId) {
            this.closeTask();
        } else {
            this.openTask(taskId);
        }
    }

    openTask(taskId) {
        this.currentTask = taskId;
        const task = taskData[taskId];

        this.taskTitle.textContent = task.title;
        this.taskDescription.textContent = task.description;

        this.setupAnswerInput(task);

        this.taskContent.style.display = 'block';
    }

    setupAnswerInput(task) {
        this.taskAnswer.style.display = 'none';
        this.multipleChoiceContainer.style.display = 'none';
        this.multipleChoiceContainer.innerHTML = '';

        switch (task.type) {
            case 'number':
            case 'text':
                this.taskAnswer.style.display = 'block';
                this.taskAnswer.type = task.type;
                break;
            case 'single-choice':
            case 'multiple-choice':
                this.multipleChoiceContainer.style.display = 'block';
                task.options.forEach((option, index) => {
                    const input = document.createElement('input');
                    input.type = task.type === 'single-choice' ? 'radio' : 'checkbox';
                    input.name = 'choice';
                    input.value = index;
                    input.id = `choice-${index}`;

                    const label = document.createElement('label');
                    label.htmlFor = `choice-${index}`;
                    label.textContent = option;

                    const div = document.createElement('div');
                    div.classList.add('choice-option');
                    div.appendChild(input);
                    div.appendChild(label);

                    this.multipleChoiceContainer.appendChild(div);
                });
                break;
        }
    }

    submitAnswer() {
        if (!this.currentTask) return;

        const task = taskData[this.currentTask];
        let userAnswer;

        switch (task.type) {
            case 'number':
            case 'text':
                userAnswer = this.taskAnswer.value.trim();
                break;
            case 'single-choice':
                userAnswer = document.querySelector('input[name="choice"]:checked')?.value;
                break;
            case 'multiple-choice':
                userAnswer = Array.from(document.querySelectorAll('input[name="choice"]:checked'))
                    .map(input => parseInt(input.value));
                break;
        }

        if (this.checkAnswer(task, userAnswer)) {
            this.markTaskAsCompleted(this.currentTask);
            alert('Правильно! Задание выполнено.');
            this.closeTask();
        } else {
            alert('Неправильно. Попробуйте еще раз.');
        }
    }

    checkAnswer(task, userAnswer) {
        switch (task.type) {
            case 'number':
                return parseFloat(userAnswer) === task.answer;
            case 'text':
                return this.fuzzyCompare(task.answer, userAnswer);
            case 'single-choice':
                return parseInt(userAnswer) === task.answer;
            case 'multiple-choice':
                return JSON.stringify(userAnswer.sort()) === JSON.stringify(task.answer.sort());
            default:
                return false;
        }
    }

    fuzzyCompare(correctAnswer, userAnswer) {
        // Простая реализация нечеткого сравнения
        const correctWords = correctAnswer.toLowerCase().split(/\s+/);
        const userWords = userAnswer.toLowerCase().split(/\s+/);
        const matchedWords = correctWords.filter(word => userWords.includes(word));
        return matchedWords.length / correctWords.length > 0.7; // 70% совпадение считается правильным
    }

    markTaskAsCompleted(taskId) {
        if (!this.completedTasks.includes(taskId)) {
            this.completedTasks.push(taskId);
            localStorage.setItem('completedTasks', JSON.stringify(this.completedTasks));
            this.updateTaskAvailability();
        }
    }

    closeTask() {
        this.taskContent.style.display = 'none';
        this.currentTask = null;
        this.taskAnswer.value = '';
        this.multipleChoiceContainer.innerHTML = '';
    }

    resetProgress() {
        this.completedTasks = [];
        localStorage.removeItem('completedTasks');
        this.updateTaskAvailability();
    }
}

// Инициализация менеджера задач
const taskManager = new TaskManager();