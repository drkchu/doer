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
    
})();