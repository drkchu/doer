/** STYLES */
import './styles/style.css';

import {taskManager, domManager} from './taskFunctions.js';

 
taskManager.generateDefaultTasks(); // generate
domManager.displayTasks(taskManager.getAllTasks()); // display

// Initial linking of buttons to the current active tasks

