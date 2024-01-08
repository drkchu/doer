/** STYLES */
import './styles/style.css';

import {taskManager, domManager} from './taskFunctions.js';

// Since webpack bundles JS, it wraps all the individual files/modules in functions
// so they are no longer run in the global scope, saying the following line means
// I can still access taskManager in the console

window.taskManager = taskManager; // delete in production build

// Get local tasks or generate tasks
taskManager.generateDefaultTasks();

domManager.linkNavBar(taskManager); // Get's the nav bar looking right
domManager.updateTaskDisplay(taskManager);