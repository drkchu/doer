/** STYLES */
import './styles/style.css';

import {taskManager, domManager} from './taskFunctions.js';

taskManager.generateDefaultTasks();                 // generate
domManager.updateDisplay(taskManager);

// Iterate through all tasks, based on taskManager isActive. 
// If we got an active one, add it to the display after resetting using domManager
// Make sure to link the appropriate buttons based on the index from taskManager
// Create functions that open the details / edit / delete buttons