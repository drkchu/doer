import { compareAsc, format } from "date-fns"; 

export const taskManager = (function() {
    const allTasks = [];

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

    return { generateDefaultTasks, createNewTask, getAllTasks};

})();

export const domManager = (function() {
    function resetContainer(element) {
        element.textContent = '';
    }
    
    function generateTaskElement(task) {
        const taskDiv = document.createElement('div');
        taskDiv.classList.add('task',
        'border-l-4',
        task.priority === 'high' ? 'border-l-red-800' :
            task.priority === 'medium' ? 'border-l-yellow-800' :
                'border-l-green-800');
        
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
        detailsButton.classList.add('btn', 'btn-sm', 'border-green-500', 'btn-outline');
        detailsButton.textContent = 'DETAILS';

        const timeDisplaySpan = document.createElement('span');
        timeDisplaySpan.classList.add('time-display');
        timeDisplaySpan.textContent = 'September 30th';

        const infoTaskIcon = document.createElement('i');
        infoTaskIcon.classList.add('info-task', 'fa-solid', 'fa-pen-to-square');

        const deleteTaskIcon = document.createElement('i');
        deleteTaskIcon.classList.add('delete-task', 'fa-solid', 'fa-trash');

        taskInfoRightDiv.appendChild(detailsButton);
        taskInfoRightDiv.appendChild(timeDisplaySpan);
        taskInfoRightDiv.appendChild(infoTaskIcon);
        taskInfoRightDiv.appendChild(deleteTaskIcon);

        taskDiv.appendChild(taskInfoLeftDiv);
        taskDiv.appendChild(taskInfoRightDiv);

        return taskDiv;
    }

    function displayTasks(tasks) {
        const taskDisplay = document.querySelector('.display');
        resetContainer(taskDisplay);
        if (tasks.length === 0) {
            const emptyTaskDiv = document.createElement('div');
            emptyTaskDiv.classList.add('empty-task');
            emptyTaskDiv.textContent = "It's quiet here...";
            taskDisplay.appendChild(emptyTaskDiv);
            return;
        }
        tasks.forEach(task => {
            var newTask = generateTaskElement(task);
            taskDisplay.appendChild(newTask);
        });
    }

    return { displayTasks };
})();