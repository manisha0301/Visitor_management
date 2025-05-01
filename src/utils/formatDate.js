export function formatReadableDate(dateString) {
    const date = new Date(dateString);
  
    return date.toLocaleString('en-US', {
      dateStyle: 'medium',
      timeStyle: 'short',
    });
  }
  