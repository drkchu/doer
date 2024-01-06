/** STYLES */
import './styles/style.css';

import {taskManager, domManager} from './taskFunctions.js';

 
taskManager.generateDefaultTasks();
console.log(taskManager.getAllTasks());

domManager.displayTasks(taskManager.getAllTasks());