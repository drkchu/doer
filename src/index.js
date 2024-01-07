/** STYLES */
import './styles/style.css';

import {taskManager, domManager} from './taskFunctions.js';

// Since webpack bundles JS, it wraps all the individual files/modules in functions
// so they are no longer run in the global scope, saying the following line means
// I can still access taskManager in the console

window.taskManager = taskManager; // delete in production build

taskManager.generateDefaultTasks();
domManager.updateDisplay(taskManager);

// Iterate through all tasks, based on taskManager isActive. 
// If we got an active one, add it to the display after resetting using domManager
// Make sure to link the appropriate buttons based on the index from taskManager
// Create functions that open the details / edit / delete buttons