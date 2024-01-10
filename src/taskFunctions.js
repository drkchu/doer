import { add, format, isWithinInterval, isSameDay} from "date-fns"; 

export const taskManager = (function() {
    const allTasks = [];
    let projects = [];

    let currentDisplay = 'all'; // default to displaying all tasks from the start
    let currentProject = '';

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
        // Update the count for the number of tasks in localStorage
        let totalTasks = localStorage.getItem("numTasks");
        localStorage.setItem('numTasks', totalTasks === null ? 
            1 : parseInt(totalTasks) + 1);
        
        // Add the task to the local storage
        let currTaskIndex = localStorage.getItem('numTasks');
        localStorage.setItem('title' + currTaskIndex, title);
        localStorage.setItem('description' + currTaskIndex, description);
        localStorage.setItem('project' + currTaskIndex, project);
        localStorage.setItem('dueDate' + currTaskIndex, dueDate);
        localStorage.setItem('priority' + currTaskIndex, priority);
        localStorage.setItem('checked' + currTaskIndex, checked);
    }

    function deleteTask(index) {
        // Remove the task from local storage
        localStorage.removeItem('title' + (index + 1));
        localStorage.removeItem('description' + (index + 1));
        localStorage.removeItem('project' + (index + 1));
        localStorage.removeItem('dueDate' + (index + 1));
        localStorage.removeItem('priority' + (index + 1));
        localStorage.removeItem('checked' + (index + 1));
        localStorage.setItem('numTasks', parseInt(localStorage.getItem('numTasks')) - 1);

        const deletedTasks = allTasks.splice(index, 1);

        updateLocalStorageIndices();

        // Comment this out if I want the project to remain even when there are no tasks associated
        if (getAllTasks().filter((task) => task.project === deletedTasks[0].project).length === 0) {
            removeProject(deletedTasks[0].project);
        }
    }

    function getAllTasks() {
        return allTasks;
    }

    function getAllProjects() {
        return projects;
    }

    function generateDefaultTasks() { // For testing
        createNewTask('Go to the gym', 'Do some squats and bench press', 'Gym', new Date(), 'low', true);
        createNewTask('Walk Cocoa', 'She the cutest', '', new Date(), 'medium', true);
        createNewTask('Clean kitchen', 'Oven needs a thorough cleaning', '', add(new Date(), {
            days: 1,
        }), 'high', false);
        createNewTask('Review 3D integrals', 'Chapter 18', 'School', add(new Date(), {
            days: 6,
        }), 'medium', true);
        createNewTask('Data Structures Final Exam', 'Room 3030 @ 9am', 'School', add(new Date(), {
            weeks: 2,
        }), 'high', false);
        createNewTask('Japan Vacation', 'With Jay', 'Vacation', add(new Date(), {
            weeks: 2,
            months: 3,
            days: 12,
        }), 'medium', false);
        createNewTask('Get a cool job', 'Something that is fulfilling and makes me a lot of money', 'Career', add(new Date(), {
            days: 10,
            months: 4,
            years: 2,
        }), 'low', false);
    }
    
    function getCurrentDisplay() {
        return currentDisplay;
    }

    function getCurrentProject() {
        return currentProject;
    }

    function setCurrentDisplay(newDisplay) {
        currentDisplay = newDisplay;
    }

    function setCurrentProject(newProject) {
        currentProject = newProject;
    }

    // Returns a boolean based on whether or not the current task is active and should be displayed
    function isActive(task) {
        const today = new Date();
        const oneWeekLater = add(today, {days: 7});
        const oneMonthLater = add(today, {months: 1});
        
        switch (currentDisplay) { // Checking for isSameDay in week/month case for precision errors?
            case 'all':
                return true;
            case 'today':
                return isSameDay(task.dueDate, today);
            case 'week':
                return isSameDay(task.dueDate, today) || isWithinInterval(task.dueDate, { start: today, end: oneWeekLater });
            case 'month':
                return isSameDay(task.dueDate, today) || isWithinInterval(task.dueDate, { start: today, end: oneMonthLater });
            default:
                return task.project === getCurrentProject();
        }
    }

    function removeProject(projectToRemove) {
        projects = projects.filter((project) => project !== projectToRemove);
    }

    function checkTask(task) {
        task.checked = !task.checked;
    }

    function updateLocalStorageIndices() { // Not ideal run time, but with this scale, won't be an issue
        const totalTasks = allTasks.length;
        localStorage.clear();
        localStorage.setItem('numTasks', allTasks.length);

        for (let index = 1; index <= totalTasks; index++) {
            var currTask = allTasks[index - 1];
            localStorage.setItem('title' + index, currTask.title);
            localStorage.setItem('description' + index, currTask.description);
            localStorage.setItem('project' + index, currTask.project);
            localStorage.setItem('dueDate' + index, format(currTask.dueDate, 'yyyy-MM-dd'));
            localStorage.setItem('priority' + index, currTask.priority);
            localStorage.setItem('checked' + index, currTask.checked);
        }
    }

    return { generateDefaultTasks, createNewTask, getAllTasks, getCurrentDisplay, getCurrentProject, setCurrentDisplay,
         isActive, deleteTask, checkTask, getAllProjects, setCurrentProject, removeProject, updateLocalStorageIndices };

})();

export const domManager = (function() {
    let activeTaskIndex;

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
            localStorage.setItem('checked' + (index + 1), task.checked);
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
        timeDisplaySpan.textContent = `${format(task.dueDate, 'MMMM do, yyyy')}`;

        const editTaskIcon = document.createElement('i');
        editTaskIcon.classList.add('edit-task', 'fa-solid', 'fa-pen-to-square');
        editTaskIcon.addEventListener('click', () => {
            const editTaskModal = document.getElementById('edit-task');
            activeTaskIndex = index;
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
            defaultOption.value = -1; // Signal that no project was chosen
            projectSelection.appendChild(defaultOption);

            taskManager.getAllProjects().forEach(project => {
                var newOption = document.createElement('option');
                newOption.textContent = project;
                newOption.value = project;
                newOption.selected = task.project === project ? true : false;
                projectSelection.appendChild(newOption);
            });

            // Update the submit button with a function to update the task with  
            const saveChangesButton = document.querySelector('.save-changes-button');
            saveChangesButton.addEventListener('click', () => {
                // Update the task based on the current information
                if (activeTaskIndex !== index) // Fixes the cloning bug
                    return;

                task.title = document.querySelector('.title-input').value;
                task.description = document.querySelector('.description-input').value;

                const [year, month, date] = document.querySelector('.date-input').value.split('-');
                task.dueDate = new Date(year, month - 1, date);

                // Check if the task's old project was the last one
                const edittedProject = document.querySelector('.project-select').value === -1 || '' ? 
                '' : document.querySelector('.project-select').value;

                if (taskManager.getAllTasks().filter((thisTask) => thisTask.project === task.project && edittedProject !== task.project).length === 1) {
                    taskManager.removeProject(task.project);
                }
                task.project = edittedProject;

                task.priority = document.querySelector('input[name="priority"]:checked').value;
                
                // Update the display
                updateTaskDisplay(taskManager);
                updateProjectsDisplay(taskManager);
                taskManager.updateLocalStorageIndices();
            }, {once: true}) // w/o this line, I end up with duplicate tasks over time

            editTaskModal.showModal();
        });

        const deleteTaskIcon = document.createElement('i');
        deleteTaskIcon.classList.add('delete-task', 'fa-solid', 'fa-trash');
        deleteTaskIcon.addEventListener('click', () => {
            taskManager.deleteTask(index);
            updateTaskDisplay(taskManager);
            updateProjectsDisplay(taskManager);
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

    function updateTaskDisplay(taskManager) {
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

    // Links all tabs except dynamic project tabs to appropriate display managers
    function linkNavBar(taskManager) {
        updateProjectsDisplay(taskManager);
        const allTab = document.querySelector('.all-tab');
        allTab.addEventListener('click', () => {
            deactivateChildren(document.querySelector('.sidebar'));
            allTab.classList.add('active');
            taskManager.setCurrentDisplay('all');
            updateTaskDisplay(taskManager);
        });

        const todayTab = document.querySelector('.today-tab');
        todayTab.addEventListener('click', () => {
            deactivateChildren(document.querySelector('.sidebar'));
            todayTab.classList.add('active');
            taskManager.setCurrentDisplay('today');
            updateTaskDisplay(taskManager);
        });

        const weekTab = document.querySelector('.week-tab');
        weekTab.addEventListener('click', () => {
            deactivateChildren(document.querySelector('.sidebar'));
            weekTab.classList.add('active');
            taskManager.setCurrentDisplay('week');
            updateTaskDisplay(taskManager);
        });

        const monthTab = document.querySelector('.month-tab');
        monthTab.addEventListener('click', () => {
            deactivateChildren(document.querySelector('.sidebar'));
            monthTab.classList.add('active');
            taskManager.setCurrentDisplay('month');
            updateTaskDisplay(taskManager);
        });

        const addTaskButton = document.querySelector('.add-task-button');
        addTaskButton.addEventListener('click', () => {
            // Show the create new task modal
            const createTaskModal = document.getElementById('create-task');
            
            // Populate the project suggestions with the current projects
            const suggestedProjectsDatalist = document.getElementById('available-projects');
            suggestedProjectsDatalist.textContent = '';
            taskManager.getAllProjects().forEach((project) => {
                var newOption = document.createElement('option');
                newOption.value = project;
                suggestedProjectsDatalist.appendChild(newOption);
            });

            const createTaskForm = document.querySelector('.create-task-form');
            createTaskForm.addEventListener('submit', () => {
                const newTitle = document.querySelector('.title-input-create').value;
                const newDescription = document.querySelector('.description-input-create').value;

                const [newYear, newMonth, newDate] = document.querySelector('.date-input-create').value.split('-');

                const newProject = document.querySelector('.project-input-create').value;

                const newPriority = document.querySelector('input[name="priority-create"]:checked').value;
                
                taskManager.createNewTask(newTitle, newDescription, newProject, new Date(newYear, (newMonth - 1), newDate), newPriority, false);
                


                // Update the displays
                updateTaskDisplay(taskManager);
                updateProjectsDisplay(taskManager);
            }, {once: true});

            createTaskModal.showModal();
        })
    }  

    // Just add the projects to the dom whilst linking
    function updateProjectsDisplay(taskManager) { 
        const projectTaskContainer = document.querySelector('.project-container');
        projectTaskContainer.textContent = '';
        taskManager.getAllProjects().forEach((project) => {
            var projectTabContainer = document.createElement('li');
            var projectTab = document.createElement('a');
            projectTab.textContent = project;
            projectTab.classList.add('project-tab');
            projectTabContainer.appendChild(projectTab);
            projectTaskContainer.appendChild(projectTabContainer);
        });

        // Moved from 
        const allProjectTabs = document.querySelectorAll('.project-tab');
        allProjectTabs.forEach((projectTab)  => {
            projectTab.addEventListener('click', () => {
                deactivateChildren(document.querySelector('.sidebar'));
                projectTab.classList.add('active');
                taskManager.setCurrentDisplay('project');
                taskManager.setCurrentProject(projectTab.textContent);
                updateTaskDisplay(taskManager);
            })
        });
    }

    function deactivateChildren(parentContainer) {
        const children = parentContainer.querySelectorAll('*');
        children.forEach((child) => {
            child.classList.remove('active');
        })
    }

    return { updateTaskDisplay, linkNavBar };
})();