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
    }

    function getAllTasks() {
        return allTasks;
    }

    function getAllProjects() {
        return projects;
    }

    function generateDefaultTasks() { // For testing
        createNewTask('Go to the gym', 'Do some squats and bench press', 'Gym', new Date(), 'low', true);
        createNewTask('Review 3D integrals', 'Chapter 18', 'School', add(new Date(), {
            days: 6,
        }), 'medium', true);
        createNewTask('Clean kitchen', 'Oven needs a thorough cleaning', '', add(new Date(), {
            days: 1,
        }), 'high', false);
        createNewTask('Data Structures Final Exam', 'Room 3030 @ 9am', 'School', add(new Date(), {
            weeks: 2,
        }), 'high', false);
        createNewTask('Japan Vacation', 'With Jay', 'Vacation', add(new Date(), {
            weeks: 2,
            months: 3,
            days: 12,
        }), 'medium', false);
        createNewTask('Get a cool job', 'Something that fulfilling and makes me a lot of money', 'Career', add(new Date(), {
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

        switch (currentDisplay) {
            case 'all':
                return true;
            case 'today':
                return isSameDay(task.dueDate, today);
            case 'week':
                return isWithinInterval(task.dueDate, { start: today, end: oneWeekLater });
            case 'month':
                return isWithinInterval(task.dueDate, { start: today, end: oneMonthLater });
            default:
                return task.project === getCurrentProject();
        }
    }

    function deleteTask(index) {
        const deletedTasks = allTasks.splice(index, 1);

        // Uncomment this next block if code if I want to delete the project if there are no projects inside
        // if (getAllTasks().filter((task) => task.project === deletedTasks[0].project).length === 0) {
        //     removeProject(deletedTasks[0].project);
        // }
    }

    function removeProject(projectToRemove) {
        projects = projects.filter((project) => project !== projectToRemove);
    }

    function checkTask(task) {
        task.checked = !task.checked;
    }

    return { generateDefaultTasks, createNewTask, getAllTasks, getCurrentDisplay, getCurrentProject, setCurrentDisplay,
         isActive, deleteTask, checkTask, getAllProjects, setCurrentProject };

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
            const editTaskModal = document.getElementById('edit-task');
            
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
                task.title = document.querySelector('.title-input').value;
                task.description = document.querySelector('.description-input').value;

                const [year, month, date] = document.querySelector('.date-input').value.split('-');
                task.dueDate = new Date(year, month - 1, date);

                task.project = document.querySelector('.project-select').value === -1 || '' ? 
                    '' : document.querySelector('.project-select').value;
                task.priority = document.querySelector('input[name="priority"]:checked').value;
                
                // Update the display
                updateTaskDisplay(taskManager);
            })

            editTaskModal.showModal();
        });

        const deleteTaskIcon = document.createElement('i');
        deleteTaskIcon.classList.add('delete-task', 'fa-solid', 'fa-trash');
        deleteTaskIcon.addEventListener('click', () => {
            taskManager.deleteTask(index);
            updateTaskDisplay(taskManager);
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

    // Links all tabs to in the nav bar
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

        const allProjectTabs = document.querySelectorAll('.project-tab');
        allProjectTabs.forEach((projectTab)  => {
            projectTab.addEventListener('click', () => {
                deactivateChildren(document.querySelector('.sidebar'));
                projectTab.classList.add('active');
                taskManager.setCurrentDisplay('project');
                taskManager.setCurrentProject(projectTab.textContent);
                updateTaskDisplay(taskManager);
            })
        })

    }  

    // Just add the projects to the dom, don't worry about linking anything
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
    }

    function deactivateChildren(parentContainer) {
        const children = parentContainer.querySelectorAll('*');
        children.forEach((child) => {
            child.classList.remove('active');
        })
    }

    return { updateTaskDisplay, linkNavBar };
})();