/** STYLES */
import './styles/style.css';

import {taskManager, domManager} from './taskFunctions.js';

// Since webpack bundles JS, it wraps all the individual files/modules in functions
// so they are no longer run in the global scope, saying the following line means
// I can still access taskManager in the console

window.taskManager = taskManager; // delete in production build

// Get local tasks or generate tasks
generateTasks();

domManager.linkNavBar(taskManager); // Get's the nav bar looking right
domManager.updateTaskDisplay(taskManager);

function generateTasks() {
    const numTasks = localStorage.getItem('numTasks');

    if (!numTasks) {
        taskManager.generateDefaultTasks();
    } else {
        localStorage.setItem('numTasks', 0);
        for (let index = 1; index <= parseInt(numTasks);  index++) { // generate all the tasks
            taskManager.createNewTask(
                localStorage.getItem('title' + index),
                localStorage.getItem('description' + index),
                localStorage.getItem('project' + index),
                localStorage.getItem('dueDate' + index),
                localStorage.getItem('priority' + index),
                localStorage.getItem('checked' + index)   
            )
        }
    }
}