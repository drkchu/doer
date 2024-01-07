import { compareAsc, format, getDate, getMonth, getYear } from "date-fns"; 

export const taskManager = (function() {
    const allTasks = [];
    let projects = [];

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
        if (!projects.includes(project) && project !== '') {
            projects.push(project);
        }
    }

    function getAllTasks() {
        return allTasks;
    }

    function getAllProjects() {
        return projects;
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
        const deletedTasks = allTasks.splice(index, 1);
        if (getAllTasks().filter((task) => task.project === deletedTasks[0].project).length === 0) {
            removeProject(deletedTasks[0].project);
        }
    }

    function removeProject(projectToRemove) {
        projects = projects.filter((project) => project !== projectToRemove);
    }

    function checkTask(task) {
        task.checked = !task.checked;
    }

    return { generateDefaultTasks, createNewTask, getAllTasks, getCurrentDisplay, setCurrentDisplay,
         isActive, deleteTask, checkTask, getAllProjects };

})();

export const domManager = (function() {
    function clearDisplay() {
        document.querySelector('#display').textContent = '';
    }
    
    function generateTaskElement(task, index, taskManager) {
        const taskDiv = document.createElement('div');
        taskDiv.classList.add('task', task.priority);
        
        const taskInfoLeftDiv = document.createElement('div');
        taskInfoLeftDiv.classList.add('task-info-left');

        const taskCheckInput = document.createElement('input');
        taskCheckInput.type = 'checkbox';
        taskCheckInput.checked = task.checked;
        taskCheckInput.classList.add('checkbox');

        taskCheckInput.addEventListener('click', () => {
            taskManager.checkTask(task);
        });

        const taskTitleSpan = document.createElement('span');
        taskTitleSpan.classList.add('task-title');
        taskTitleSpan.textContent = task.title;

        taskInfoLeftDiv.appendChild(taskCheckInput);
        taskInfoLeftDiv.appendChild(taskTitleSpan);

        const taskInfoRightDiv = document.createElement('div');
        taskInfoRightDiv.classList.add('task-info-right');

        const detailsButton = document.createElement('button');
        detailsButton.classList.add('details-button', 'btn', 'btn-sm', 'border-green-500', 'btn-outline');
        detailsButton.textContent = 'Details';
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
        timeDisplaySpan.textContent = `${format(task.dueDate, 'MMMM do, yyyy')}`;

        const editTaskIcon = document.createElement('i');
        editTaskIcon.classList.add('edit-task', 'fa-solid', 'fa-pen-to-square');
        editTaskIcon.addEventListener('click', () => {
            const modal = document.getElementById('edit-task');
            
            // Update the modal to hold the current tasks stuff
            document.querySelector('.title-input').value = task.title;
            document.querySelector('.date-input').value = format(task.dueDate, 'yyyy-MM-dd'); // yyyy-mm-dd
            document.querySelector('.description-input').value = task.description; // yyyy-mm-dd
            document.querySelector(`#radio-${task.priority}`).checked = true;
            
            // For the select element, I had to do some fancier stuff like looking up the current projects available
            const projectSelection = document.querySelector('.project-select');
            projectSelection.textContent = '';
            
            // Generate the default
            const defaultOption = document.createElement('option');
            defaultOption.disabled = true;
            defaultOption.selected = task.project === '' ? true : false;
            defaultOption.textContent = 'Select a project';
            projectSelection.appendChild(defaultOption);

            taskManager.getAllProjects().forEach(project => {
                var newOption = document.createElement('option');
                newOption.textContent = project;
                newOption.selected = task.project === project ? true : false;
                projectSelection.appendChild(newOption);
            });

            // Update the submit button with a function to update the task with  
            // DO THIS LATER TONIGHT
            modal.showModal();
        });

        const deleteTaskIcon = document.createElement('i');
        deleteTaskIcon.classList.add('delete-task', 'fa-solid', 'fa-trash');
        deleteTaskIcon.addEventListener('click', () => {
            taskManager.deleteTask(index);
            updateDisplay(taskManager);
        })

        taskInfoRightDiv.appendChild(detailsButton);
        taskInfoRightDiv.appendChild(timeDisplaySpan);
        taskInfoRightDiv.appendChild(editTaskIcon);
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