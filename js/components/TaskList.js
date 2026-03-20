/**
 * TaskList Component - Manages the task list container and rendering
 */

import { createTaskItem } from './TaskItem.js';

/**
 * Create the TaskList component
 * @param {HTMLElement} container - The container element (usually #taskList)
 * @param {Array} tasks - Array of task objects
 * @param {Function} onUpdate - Callback when tasks need to re-render
 * @returns {Object} TaskList API
 */
export function createTaskList(container, tasks, onUpdate) {
  let currentTasks = [...tasks];

  /**
   * Render all tasks
   */
  function render() {
    container.innerHTML = '';
    
    // Sort by order
    const sorted = [...currentTasks].sort((a, b) => a.order - b.order);
    
    sorted.forEach(task => {
      const el = createTaskItem(task, onUpdate);
      container.appendChild(el);
    });
  }

  /**
   * Update tasks and re-render
   * @param {Array} tasks
   */
  function setTasks(tasks) {
    currentTasks = [...tasks];
    render();
  }

  /**
   * Get the task element for a given ID
   * @param {string} id
   * @returns {HTMLElement|null}
   */
  function getTaskElement(id) {
    return container.querySelector(`[data-task-id="${id}"]`);
  }

  /**
   * Show empty state
   * @param {HTMLElement} emptyEl
   */
  function showEmpty(emptyEl) {
    if (currentTasks.length === 0) {
      emptyEl.style.display = 'flex';
    } else {
      emptyEl.style.display = 'none';
    }
  }

  return {
    render,
    setTasks,
    getTaskElement,
    showEmpty,
    get container() { return container; }
  };
}
