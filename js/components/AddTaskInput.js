/**
 * AddTaskInput Component - Handles adding new tasks
 */

import { addTask } from '../storage.js';

const MAX_TITLE_LENGTH = 200;

/**
 * Create the AddTaskInput component
 * @param {HTMLElement} inputEl - The input element
 * @param {HTMLElement} addBtnEl - The add button element
 * @param {HTMLElement} errorEl - The error message element
 * @param {Function} onUpdate - Callback when a new task is added
 * @returns {Object} AddTaskInput API
 */
export function createAddTaskInput(inputEl, addBtnEl, errorEl, onUpdate) {
  let isSubmitting = false;

  /**
   * Validate the input
   * @param {string} title
   * @returns {{ valid: boolean, error: string }}
   */
  function validate(title) {
    const trimmed = title.trim();
    if (!trimmed) {
      return { valid: false, error: 'กรุณาพิมพ์ชื่องาน' };
    }
    if (trimmed.length > MAX_TITLE_LENGTH) {
      return { valid: false, error: `ชื่องานต้องไม่เกิน ${MAX_TITLE_LENGTH} ตัวอักษร` };
    }
    return { valid: true, error: '' };
  }

  /**
   * Handle form submission
   */
  function handleSubmit() {
    if (isSubmitting) return;

    const title = inputEl.value;
    const validation = validate(title);

    if (!validation.valid) {
      showError(validation.error);
      return;
    }

    clearError();
    isSubmitting = true;
    inputEl.disabled = true;
    addBtnEl.disabled = true;

    addTask(title.trim());

    // Reset input
    inputEl.value = '';
    inputEl.disabled = false;
    addBtnEl.disabled = false;
    isSubmitting = false;

    onUpdate();
  }

  /**
   * Show error message
   * @param {string} message
   */
  function showError(message) {
    errorEl.textContent = message;
    inputEl.classList.add('error');
  }

  /**
   * Clear error message
   */
  function clearError() {
    errorEl.textContent = '';
    inputEl.classList.remove('error');
  }

  // Event listeners
  addBtnEl.addEventListener('click', handleSubmit);

  inputEl.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSubmit();
    }
  });

  inputEl.addEventListener('input', () => {
    if (errorEl.textContent) {
      clearError();
    }
  });

  return {
    handleSubmit,
    showError,
    clearError
  };
}
