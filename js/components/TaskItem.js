/**
 * TaskItem Component - Renders a single task
 */

import { deleteTask, toggleTask, updateTaskOrder } from '../storage.js';

/**
 * Create a TaskItem DOM element
 * @param {Object} task - Task object { id, title, completed, createdAt, order }
 * @param {Function} onUpdate - Callback when tasks need to re-render
 * @returns {HTMLElement}
 */
export function createTaskItem(task, onUpdate) {
  const el = document.createElement('div');
  el.className = `task-item${task.completed ? ' completed' : ''}`;
  el.setAttribute('role', 'listitem');
  el.setAttribute('draggable', 'true');
  el.dataset.taskId = task.id;

  el.innerHTML = `
    <div class="task-checkbox-wrapper">
      <button 
        class="task-checkbox" 
        aria-label="${task.completed ? 'ทำเครื่องหมายว่ายังไม่เสร็จ' : 'ทำเครื่องหมายเสร็จแล้ว'}"
        role="checkbox"
        aria-checked="${task.completed}"
      ></button>
    </div>
    <span class="task-title">${escapeHtml(task.title)}</span>
    <button class="delete-btn" aria-label="ลบงาน">
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <polyline points="3 6 5 6 21 6"></polyline>
        <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
      </svg>
    </button>
  `;

  // Checkbox click handler
  const checkbox = el.querySelector('.task-checkbox');
  checkbox.addEventListener('click', (e) => {
    e.stopPropagation();
    toggleTask(task.id);
    onUpdate();
  });

  // Delete button handler
  const deleteBtn = el.querySelector('.delete-btn');
  deleteBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    deleteTask(task.id);
    onUpdate();
  });

  // Drag event attributes will be set by dragdrop.js
  return el;
}

/**
 * Escape HTML to prevent XSS
 * @param {string} str
 * @returns {string}
 */
function escapeHtml(str) {
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}
