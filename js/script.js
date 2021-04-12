"use strict"

// Page
const bodyPage = document.querySelector('body'); // Body Page
// New Task
const input = document.getElementById('input'); // Input
const btnNewTask = document.getElementById('plus'); // Btn New Task
// Task
const tasksBody = document.getElementById('tasks-body'); // Tasks Body 
// Task Completed
const taskCompletedBody = document.getElementById('completed-task-body'); // Completed Task Body
// Right Click
const rightClick = document.getElementById('right-click'); // Mouse Right Click
const rightClickTask = document.getElementById('rc-task'); // Ckick on Task
const rightClickPageColor = document.getElementById('rc-page-color'); // Click on page except task
const removeTask = document.getElementById('remove-task'); // Remove Task
const pageColorChoose = document.getElementById('page-color-choose'); // Change color page
const rightClickPriority = document.getElementById('change-priotiry'); // Change Priority
const btnPriority = document.getElementById('btn-priority'); // Btn Change Priority


// Data
let data = [];
let dataCompleted = [];
let dataBgColor = []

let x = 1;

(x == 0) ? console.log('Hello') : console.log('Bye'); 



// Local Storage
if (localStorage.getItem('userData')) {

    data = JSON.parse(localStorage.getItem('userData'))

}

if (localStorage.getItem('userDataCompleted')) {

    dataCompleted = JSON.parse(localStorage.getItem('userDataCompleted'))
}



// Куда нажали ПКМ в последний раз (для удаления задачи)
let lastClickRightMouse = 0;
let whereLastClickRightMouse = false; // if true - tusk, false - completedTask

// Temporary
rightClick.style.display = 'none';




// ? CODE CODE CODE CODE CODE CODE //


// By pressing the button we add a new task
btnNewTask.onclick = () => sendTask();

// Or pressing enter
document.addEventListener('keydown', (event) => {
    if (event.keyCode === 13) {
        sendTask();
    }
})

// Что делать при отправке новой задачи
function sendTask() {
    // Check emptiness
    if (input.value === '') {
        // nothing
    } else { // If not empty
        let newUserTask = { // Creating a new Object
            value: input.value,
            important: 'default',
        }
        data.unshift(newUserTask); // Add object to the array
        input.value = ''; // Clear Input
        renderTasks();
    }
}

// Render Tasks
const renderTasks = () => {

    // Отправляем данные в JSON формате local storage
    localStorage.setItem('userData', JSON.stringify(data))

    // Remove all tasks from the Tasks Body
    tasksBody.style.display = 'block'
    tasksBody.innerHTML = '';
    if (data.length != 0) {
        tasksBody.innerHTML = `<div class="task__subtitle">список задач</div>` // Add block title
    }

    // Display all tasks from the array
    for (let i = 0; i < data.length; i++) {
        // Important
        const colorImportant = (data[i].important == 'default') ? 'white' : (data[i].important == 'red') ? 'red' :
            'green';

        let content = `<div class="task" counter='${i}' id="task"><span class="task-color" style="background: ${colorImportant}" id='task-color'></span><img counter='${i}' class="circle" src="img/circle.svg" id='circle' alt="icon"><div class="task__title">${data[i].value}</div></div>`
        tasksBody.innerHTML += content;
    }
}

// Render Completed Task
const renderCompletedTask = () => {

    // Отправляем данные в JSON формате local storage
    localStorage.setItem('userDataCompleted', JSON.stringify(dataCompleted));
    console.log('Добавили в local Storgae в dataCompleted');

    taskCompletedBody.innerHTML = '';
    if (dataCompleted.length != 0) {
        taskCompletedBody.innerHTML = `<div class="completed-task__subtitle">завершенные задачи</div>`;
    }

    for (let i = 0; i < dataCompleted.length; i++) {
        let content = `<div class="completed-task" counterCompleted='${i}'><img counterCompleted='${i}' class='circle-check' src="img/circle-check.svg" alt="icon"><div сlass="completed-task__title">${dataCompleted[i].value}</div></div>`;
        taskCompletedBody.innerHTML += content;
    }
}

// Обработчик нажатия на круг
tasksBody.addEventListener('click', (event) => {
    if (event.target.classList.contains('circle')) {
        // Если нажали на кружок, то переместить объект в другой массив и отрендерить заново всё    

        let numberOfTask = Number(event.target.getAttribute('counter')); // Get number of Task
        dataCompleted.unshift(data[numberOfTask]); // Вставляем нужный объект из старого массива в новый
        data.splice(numberOfTask, 1); // Удаляем из старого массива
        renderTasks();
        renderCompletedTask();
    }
})

// Обработчик нажатия на заполненный круг
taskCompletedBody.addEventListener('click', (event) => {
    if (event.target.classList.contains('circle-check')) {
        let numberOfTask = Number(event.target.getAttribute('counterCompleted')); // Get number of Task
        data.unshift(dataCompleted[numberOfTask]);
        dataCompleted.splice(numberOfTask, 1); // Удаляем из старого массива
        renderTasks();
        renderCompletedTask();
    }
})

// Обработчик нажатия ПКМ
document.addEventListener('contextmenu', (event) => {
    event.preventDefault(); // Отмена стандартного поведения

    if (event.target.classList.contains('task') || event.target.classList.contains('task-color') || event.target.classList.contains('circle') || event.target.classList.contains('task__title')) {
        // Если нажали на задачу
        whereLastClickRightMouse = true;
        lastClickRightMouse = event.target.getAttribute('counter');
        rightClick.style.left = (event.pageX) + 'px';
        rightClick.style.top = (event.pageY) + 'px';
        rightClick.style.display = 'block';
        rightClickTask.style.display = 'block';
        rightClickPageColor.style.display = 'none';
        rightClickPriority.style.display = 'block'

    } else if (event.target.classList.contains('completed-task') || event.target.classList.contains('circle-check') || event.target.classList.contains('completed-task__title')) {
        // Если нажали на выполненную задачу
        whereLastClickRightMouse = false;
        lastClickRightMouse = event.target.getAttribute('counterCompleted');
        rightClick.style.left = (event.pageX) + 'px';
        rightClick.style.top = (event.pageY) + 'px';
        rightClick.style.display = 'block';
        rightClickTask.style.display = 'block';
        rightClickPageColor.style.display = 'none';
        rightClickPriority.style.display = 'none'
    } else {
        // Если нажали в любом другом месте
        rightClick.style.left = (event.pageX) + 'px';
        rightClick.style.top = (event.pageY) + 'px';
        rightClick.style.display = 'block';
        rightClickTask.style.display = 'none';
        rightClickPageColor.style.display = 'block';
    }
})

// Скрываем контекстное меню по нажатию ЛКМ в любое место
document.addEventListener('click', () => rightClick.style.display = 'none')

// Обработчик нажатия на смену цвета приложения
pageColorChoose.addEventListener('click', (event) => {

    let attribute = event.target.getAttribute('color');

    switch (attribute) {
        case 'оcher':
            bodyPage.style.backgroundColor = '#F9BD39';
            btnNewTask.style.backgroundColor = '#F9BD39';
            break;

        case 'turquoise':
            bodyPage.style.backgroundColor = '#00B6CC';
            btnNewTask.style.backgroundColor = '#00B6CC';
            break;

        case 'coral':
            bodyPage.style.backgroundColor = '#FB6160';
            btnNewTask.style.backgroundColor = '#FB6160';
            break;

        case 'pink':
            bodyPage.style.backgroundColor = '#FD6FAF';
            btnNewTask.style.backgroundColor = '#FD6FAF';
            break;

        case 'purple':
            bodyPage.style.backgroundColor = '#D56ADC';
            btnNewTask.style.backgroundColor = '#D56ADC';
            break;

        case 'mint':
            bodyPage.style.backgroundColor = '#02C2AB';
            btnNewTask.style.backgroundColor = '#02C2AB';
            break;

        default:
            alert("Ошибка")
    }

})

// Обработчик нажатия удаления задачи
removeTask.addEventListener('click', () => {
    if (whereLastClickRightMouse) {
        data.splice(lastClickRightMouse, 1);
        renderTasks();
    } else {
        dataCompleted.splice(lastClickRightMouse, 1);
        renderCompletedTask();
    }
})

// Обработчик нажатия смены приоритета
btnPriority.addEventListener('click', (event) => {
    if (event.target.getAttribute('priority') == 'red') {
        data[lastClickRightMouse].important = 'red';
    } else if (event.target.getAttribute('priority') == 'green') {
        data[lastClickRightMouse].important = 'green';
    } else {
        data[lastClickRightMouse].important = 'default';
    }
    renderTasks()
})

// Hovers on circles
tasksBody.addEventListener('mouseover', (event) => {
    if (event.target.classList.contains('circle')) {
        event.target.src = "img/circle-check-light.svg";
    }
})
tasksBody.addEventListener('mouseout', (event) => {
    if (event.target.classList.contains('circle')) {
        event.target.src = "img/circle.svg";
    }
})
taskCompletedBody.addEventListener('mouseover', (event) => {
    if (event.target.classList.contains('circle-check')) {
        event.target.src = "img/circle-dark.svg";
    }
})
taskCompletedBody.addEventListener('mouseout', (event) => {
    if (event.target.classList.contains('circle-check')) {
        event.target.src = "img/circle-check.svg";
    }
})


renderTasks();
renderCompletedTask();



// todo 
// todo Заменить switch на if и функции
// todo Цветовая тема сохраняется в localStorage
// todo Добавить favicon и logo для приложения
// todo Адаптировать под мобильные
// todo Задачи можно менять местами drop

// Completed
// По ентеру добавить задачу
// Завершенные задачи уходят в другой блок
// Задачи записываются в массив, где 1 задача = один объект
// Если задачи нет убирать подписи: "список задач" и "Завершенные задачи"
// ПКМ по задаче можно её удалить или отметить цветом
// Все типы задач должны сохраняться в local storage 
