/** STYLES */
import './styles/style.css';

import {taskManager} from './taskFunctions.js';

taskManager.createNewTask("New Task",
 "This is the description",
 "School",
 new Date(),
 "low",
 false
 )
 
console.log(taskManager.getAllTasks());