/** STYLES */
import './styles/style.css';

import {taskManager, domManager} from './taskFunctions.js';

 
taskManager.generateDefaultTasks();

domManager.displayTasks(taskManager.getAllTasks());