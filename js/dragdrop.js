/**
 * Drag & Drop Module - Handles task reordering via HTML5 Drag API
 */

import { loadTasks, updateTaskOrder } from './storage.js';

let draggedEl = null;
let draggedId = null;
let onUpdateCallback = null;

/**
 * Initialize drag & drop functionality
 * @param {HTMLElement} container - The task list container
 * @param {Function} onUpdate - Callback when tasks are reordered
 */
export function initDragDrop(container, onUpdate) {
  onUpdateCallback = onUpdate;

  container.addEventListener('dragstart', handleDragStart, false);
  container.addEventListener('dragend', handleDragEnd, false);
  container.addEventListener('dragover', handleDragOver, false);
  container.addEventListener('dragenter', handleDragEnter, false);
  container.addEventListener('dragleave', handleDragLeave, false);
  container.addEventListener('drop', handleDrop, false);
}

/**
 * Handle drag start
 * @param {DragEvent} e
 */
function handleDragStart(e) {
  if (!e.target.classList.contains('task-item')) return;
  
  draggedEl = e.target;
  draggedId = e.target.dataset.taskId;
  
  e.target.classList.add('dragging');
  e.dataTransfer.effectAllowed = 'move';
  e.dataTransfer.setData('text/plain', draggedId);
  
  // Make drag image slightly transparent
  setTimeout(() => {
    if (draggedEl) {
      draggedEl.style.opacity = '0.5';
    }
  }, 0);
}

/**
 * Handle drag end
 * @param {DragEvent} e
 */
function handleDragEnd(e) {
  if (!e.target.classList.contains('task-item')) return;
  
  e.target.classList.remove('dragging');
  e.target.style.opacity = '';
  
  // Clean up all drag-over states
  document.querySelectorAll('.drag-over').forEach(el => {
    el.classList.remove('drag-over');
  });
  
  draggedEl = null;
  draggedId = null;
}

/**
 * Handle drag over - determine drop position
 * @param {DragEvent} e
 */
function handleDragOver(e) {
  if (!draggedEl) return;
  e.preventDefault();
  e.dataTransfer.dropEffect = 'move';
}

/**
 * Handle drag enter - show drop indicator
 * @param {DragEvent} e
 */
function handleDragEnter(e) {
  if (!draggedEl) return;
  
  const target = e.target.closest('.task-item');
  if (!target || target === draggedEl) return;
  
  // Remove from other items
  document.querySelectorAll('.task-item.drag-over').forEach(el => {
    if (el !== target) el.classList.remove('drag-over');
  });
  
  target.classList.add('drag-over');
}

/**
 * Handle drag leave
 * @param {DragEvent} e
 */
function handleDragLeave(e) {
  const target = e.target.closest('.task-item');
  if (!target) return;
  
  // Check if we're actually leaving the element
  const relatedTarget = e.relatedTarget;
  if (relatedTarget && target.contains(relatedTarget)) return;
  
  target.classList.remove('drag-over');
}

/**
 * Handle drop - reorder tasks
 * @param {DragEvent} e
 */
function handleDrop(e) {
  e.preventDefault();
  
  if (!draggedEl) return;
  
  const target = e.target.closest('.task-item');
  if (!target || target === draggedEl) {
    draggedEl.classList.remove('drag-over');
    return;
  }
  
  const targetId = target.dataset.taskId;
  
  // Get current tasks and reorder
  const tasks = loadTasks();
  const sortedTasks = [...tasks].sort((a, b) => a.order - b.order);
  
  const draggedIndex = sortedTasks.findIndex(t => t.id === draggedId);
  const targetIndex = sortedTasks.findIndex(t => t.id === targetId);
  
  if (draggedIndex === -1 || targetIndex === -1) return;
  
  // Remove dragged item and insert at new position
  const [draggedTask] = sortedTasks.splice(draggedIndex, 1);
  sortedTasks.splice(targetIndex, 0, draggedTask);
  
  // Update order and save
  updateTaskOrder(sortedTasks);
  
  // Clean up
  target.classList.remove('drag-over');
  draggedEl.classList.remove('drag-over');
  
  // Notify parent to re-render
  if (onUpdateCallback) {
    onUpdateCallback();
  }
}
