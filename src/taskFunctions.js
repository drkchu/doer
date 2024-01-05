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

    return { createNewTask, getAllTasks}; // these are the functions that I want available in index.js

})();