export type ToastType = 'success' | 'error' | 'conflict' | 'info';

export function showToast(title: string, message: string, type: ToastType = 'info', durationMs = 4500) {
  const container = document.getElementById('toast-container');
  if (!container) return;

  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;

  const iconMap: Record<ToastType, string> = {
    success: '✅',
    error: '❌',
    conflict: '⚠️',
    info: 'ℹ️',
  };

  toast.innerHTML = `
    <div class="toast-icon">${iconMap[type] || 'ℹ️'}</div>
    <div class="toast-content">
      <div class="toast-title">${escapeHtml(title)}</div>
      <div class="toast-message">${escapeHtml(message)}</div>
    </div>
    <button class="toast-close" aria-label="Close">&times;</button>
  `;

  const closeBtn = toast.querySelector('.toast-close');
  const dismiss = () => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateX(100%)';
    setTimeout(() => toast.remove(), 250);
  };

  closeBtn?.addEventListener('click', dismiss);

  container.appendChild(toast);

  if (durationMs > 0) {
    setTimeout(dismiss, durationMs);
  }
}

function escapeHtml(str: string): string {
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}
