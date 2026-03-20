/**
 * Storage Module - Handles JSON persistence via localStorage
 * Uses debounce to minimize I/O operations
 */

const STORAGE_KEY = 'todo-app-tasks';
const DEBOUNCE_MS = 300;

let saveTimeout = null;
let tasksCache = null;

/**
 * Generate a UUID v4
 * @returns {string}
 */
export function generateId() {
  return crypto.randomUUID ? crypto.randomUUID() :
    'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
      const r = Math.random() * 16 | 0;
      const v = c === 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
}

/**
 * Load tasks from localStorage
 * @returns {Array} Array of task objects
 */
export function loadTasks() {
  if (tasksCache !== null) return [...tasksCache];
  
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    if (!data) {
      tasksCache = [];
      return [];
    }
    const parsed = JSON.parse(data);
    tasksCache = Array.isArray(parsed.tasks) ? parsed.tasks : [];
    return [...tasksCache];
  } catch (e) {
    console.warn('Failed to load tasks from localStorage:', e);
    tasksCache = [];
    return [];
  }
}

/**
 * Save tasks to localStorage (debounced)
 * @param {Array} tasks - Array of task objects
 */
function _saveTasks(tasks) {
  if (saveTimeout) {
    clearTimeout(saveTimeout);
  }
  saveTimeout = setTimeout(() => {
    _saveTasksImmediate(tasks);
  }, DEBOUNCE_MS);
}

/**
 * Save tasks immediately (no debounce) - for critical operations
 * @param {Array} tasks - Array of task objects
 */
function _saveTasksImmediate(tasks) {
  if (saveTimeout) {
    clearTimeout(saveTimeout);
    saveTimeout = null;
  }
  try {
    const data = {
      version: '1.0',
      tasks: tasks
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    tasksCache = tasks;
  } catch (e) {
    console.warn('Failed to save tasks to localStorage:', e);
  }
}

/**
 * Get current pending (incomplete) task count
 * @param {Array} tasks
 * @returns {number}
 */
export function getPendingCount(tasks) {
  return tasks.filter(t => !t.completed).length;
}

// ========================================
// CRUD Operations
// ========================================

/**
 * Add a new task
 * @param {string} title - Task title
 * @returns {Object} The created task
 */
export function addTask(title) {
  const tasks = loadTasks();
  const maxOrder = tasks.length > 0 ? Math.max(...tasks.map(t => t.order)) : -1;
  
  const newTask = {
    id: generateId(),
    title: title,
    completed: false,
    createdAt: new Date().toISOString(),
    order: maxOrder + 1
  };
  
  tasks.push(newTask);
  _saveTasksImmediate(tasks);
  return newTask;
}

/**
 * Delete a task by ID
 * @param {string} id - Task ID
 */
export function deleteTask(id) {
  let tasks = loadTasks();
  tasks = tasks.filter(t => t.id !== id);
  _saveTasksImmediate(tasks);
}

/**
 * Toggle task completion status
 * @param {string} id - Task ID
 */
export function toggleTask(id) {
  const tasks = loadTasks();
  const task = tasks.find(t => t.id === id);
  if (task) {
    task.completed = !task.completed;
    _saveTasksImmediate(tasks);
  }
}

/**
 * Update task order after drag & drop
 * @param {Array} reorderedTasks - Tasks in new order
 */
export function updateTaskOrder(reorderedTasks) {
  // Update order field based on array index
  const updated = reorderedTasks.map((task, index) => ({
    ...task,
    order: index
  }));
  _saveTasksImmediate(updated);
}

/**
 * Get a task by ID
 * @param {string} id - Task ID
 * @returns {Object|undefined}
 */
export function getTask(id) {
  const tasks = loadTasks();
  return tasks.find(t => t.id === id);
}
