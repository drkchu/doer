import { compareAsc, format } from "date-fns"; 

export const taskManager = (function() {
    const allTasks = [];

    let currentDisplay = 'all'; // default to displaying all tasks from the start

    class Task {
        constructor(title, description, project, dueDate, priority, checked = false) {
            this.title = title;
            this.description = description;
            this.project = project;
            this.dueDate = dueDate;
            this.priority = priority;
            this.checked = checked;
        }
    }

    function createNewTask(title, description, project, dueDate, priority, checked = false) {
        allTasks.push(new Task(title, description, project, dueDate, priority, checked));
    }

    function getAllTasks() {
        return allTasks;
    }

    function generateDefaultTasks() { // For testing
        createNewTask('Go to the gym', 'Do some squats and bench press', 'Gym', new Date(), 'low', false);
        createNewTask('Review 3D integrals', 'Chapter 18', 'School', new Date(2024, 0, 12), 'medium', true);
        createNewTask('Clean kitchen', 'Oven needs a thorough cleaning', '', new Date(2024, 0, 10), 'high', false);
    }
    
    function getCurrentDisplay() {
        return currentDisplay;
    }

    function setCurrentDisplay(newDisplay) {
        currentDisplay = newDisplay;
    }

    // Returns a boolean based on whether or not the current task is active and should be displayed
    function isActive(task) {
        switch (currentDisplay) {
            case 'all':
                return true;
            case 'today':
                return // implement later
            case 'week':
                return // implement later
            case 'month':
                return // implement later
            default:
                return task.project === currentDisplay;
        }
    }

    function deleteTask(index) {
        allTasks.splice(index, 1);
    }

    return { generateDefaultTasks, createNewTask, getAllTasks, getCurrentDisplay, setCurrentDisplay, isActive, deleteTask };

})();

export const domManager = (function() {
    function clearDisplay() {
        document.querySelector('#display').textContent = '';
    }
    
    function generateTaskElement(task, index, taskManager) {
        const taskDiv = document.createElement('div');
        taskDiv.classList.add('task',
        'border-l-4',
        task.priority);
        
        const taskInfoLeftDiv = document.createElement('div');
        taskInfoLeftDiv.classList.add('task-info-left');

        const taskCheckInput = document.createElement('input');
        taskCheckInput.type = 'checkbox';
        taskCheckInput.classList.add('checkbox');

        const taskTitleSpan = document.createElement('span');
        taskTitleSpan.classList.add('task-title');
        taskTitleSpan.textContent = task.title;

        taskInfoLeftDiv.appendChild(taskCheckInput);
        taskInfoLeftDiv.appendChild(taskTitleSpan);

        const taskInfoRightDiv = document.createElement('div');
        taskInfoRightDiv.classList.add('task-info-right');

        const detailsButton = document.createElement('button');
        detailsButton.classList.add('details-button', 'btn', 'btn-sm', 'border-green-500', 'btn-outline');
        detailsButton.textContent = 'DETAILS';
        detailsButton.addEventListener('click', () => {
            const modal = document.getElementById('task-details');
            document.querySelector('.modal-task-title').textContent = `Title: ${task.title}`;
            document.querySelector('.modal-task-description').textContent = `Description: ${task.description}`;
            document.querySelector('.modal-task-project').textContent = `Project: ${task.project}`;
            document.querySelector('.modal-task-date').textContent = `Date: ${format(task.dueDate, 'MMMM do, yyyy')}`;
            document.querySelector('.modal-task-priority').textContent = `Priority: ${task.priority}`;
            document.querySelector('.modal-task-checked').textContent = `Checked: ${task.checked}`;
            modal.showModal();
        })

        const timeDisplaySpan = document.createElement('span');
        timeDisplaySpan.classList.add('time-display');
        timeDisplaySpan.textContent = 'September 30th';

        const infoTaskIcon = document.createElement('i');
        infoTaskIcon.classList.add('info-task', 'fa-solid', 'fa-pen-to-square');

        const deleteTaskIcon = document.createElement('i');
        deleteTaskIcon.classList.add('delete-task', 'fa-solid', 'fa-trash');
        deleteTaskIcon.addEventListener('click', () => {
            taskManager.deleteTask(index);
            updateDisplay(taskManager);
        })

        taskInfoRightDiv.appendChild(detailsButton);
        taskInfoRightDiv.appendChild(timeDisplaySpan);
        taskInfoRightDiv.appendChild(infoTaskIcon);
        taskInfoRightDiv.appendChild(deleteTaskIcon);

        taskDiv.appendChild(taskInfoLeftDiv);
        taskDiv.appendChild(taskInfoRightDiv);

        return taskDiv;
    }

    function addTaskToDisplay(task, index, taskManager) {
        const taskDisplay = document.querySelector('#display');
        const newTaskElement = generateTaskElement(task, index, taskManager);
        taskDisplay.appendChild(newTaskElement);
    }

    function displayEmptyMessage() {
        const taskDisplay = document.querySelector('#display');
        const emptyTaskDiv = document.createElement('div');
        emptyTaskDiv.classList.add('empty-task');
        emptyTaskDiv.textContent = "It's quiet here...";
        taskDisplay.appendChild(emptyTaskDiv);
    }

    function updateDisplay(taskManager) {
        clearDisplay();

        if (taskManager.getAllTasks().filter(taskManager.isActive).length === 0) {
            displayEmptyMessage();
            return;
        }

        taskManager.getAllTasks().forEach((task, index) => {
            if (taskManager.isActive(task))
                addTaskToDisplay(task, index, taskManager);
        });
    }

    return { updateDisplay };
})();