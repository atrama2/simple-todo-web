/**
 * Todo App - Main Entry Point
 * Mobile-first task management with drag & drop reordering
 */

import { loadTasks, getPendingCount } from './storage.js';
import { createTaskList } from './components/TaskList.js';
import { createAddTaskInput } from './components/AddTaskInput.js';
import { initDragDrop } from './dragdrop.js';

// Theme management
const THEME_KEY = 'todo-theme';

/**
 * Get the preferred theme based on localStorage or system preference
 * @returns {'light' | 'dark'}
 */
function getPreferredTheme() {
  const stored = localStorage.getItem(THEME_KEY);
  if (stored) return stored;
  
  // Check system preference
  if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
    return 'dark';
  }
  return 'light';
}

/**
 * Apply the theme to the document
 * @param {'light' | 'dark'} theme 
 */
function applyTheme(theme) {
  document.documentElement.setAttribute('data-theme', theme);
  localStorage.setItem(THEME_KEY, theme);
}

/**
 * Initialize theme toggle
 */
function initTheme() {
  const theme = getPreferredTheme();
  applyTheme(theme);

  const toggleBtn = document.getElementById('themeToggle');
  toggleBtn.addEventListener('click', () => {
    const current = document.documentElement.getAttribute('data-theme');
    const newTheme = current === 'dark' ? 'light' : 'dark';
    applyTheme(newTheme);
  });

  // Listen for system theme changes
  if (window.matchMedia) {
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
      // Only apply system preference if no stored preference
      if (!localStorage.getItem(THEME_KEY)) {
        applyTheme(e.matches ? 'dark' : 'light');
      }
    });
  }
}

document.addEventListener('DOMContentLoaded', () => {
  // Initialize theme first
  initTheme();

  // DOM Elements
  const taskListEl = document.getElementById('taskList');
  const emptyStateEl = document.getElementById('emptyState');
  const pendingCountEl = document.getElementById('pendingCount');
  const taskInputEl = document.getElementById('taskInput');
  const addBtnEl = document.getElementById('addBtn');
  const inputErrorEl = document.getElementById('inputError');

  // Create components
  const taskList = createTaskList(taskListEl, [], updateUI);
  const addTaskInput = createAddTaskInput(taskInputEl, addBtnEl, inputErrorEl, updateUI);

  // Initialize drag & drop
  initDragDrop(taskListEl, updateUI);

  /**
   * Update the entire UI
   */
  function updateUI() {
    const tasks = loadTasks();
    
    // Update task list
    taskList.setTasks(tasks);
    
    // Update pending count
    const count = getPendingCount(tasks);
    pendingCountEl.textContent = `${count} left`;
    
    // Update empty state visibility
    taskList.showEmpty(emptyStateEl);
  }

  // Initial render
  updateUI();

  // Focus input on load (mobile)
  taskInputEl.focus();
});
