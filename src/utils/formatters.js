export function formatDate(dateString) {
  return new Intl.DateTimeFormat('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  }).format(new Date(`${dateString}T00:00:00`));
}

export function formatMonthYear(date) {
  return new Intl.DateTimeFormat('en-IN', {
    month: 'long',
    year: 'numeric',
  }).format(date);
}

export function toDateKey(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function priorityTone(priority) {
  return {
    Critical: 'danger',
    High: 'warning',
    Medium: 'info',
    Low: 'neutral',
  }[priority] || 'neutral';
}
