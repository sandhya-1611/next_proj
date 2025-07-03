/**
 * Formats an ISO date string into a readable format
 * @param isoDateString - ISO date string (e.g., "2025-07-01T10:00:00")
 * @returns Formatted date string (e.g., "July 1, 2025 at 10:00 AM")
 */
export const formatAppointmentDate = (isoDateString: string): string => {
  const date = new Date(isoDateString);
  
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    hour12: true
  });
};

/**
 * Formats an ISO date string into a short readable format
 * @param isoDateString - ISO date string (e.g., "2025-07-01T10:00:00")
 * @returns Formatted date string (e.g., "Jul 1, 2025 10:00 AM")
 */
export const formatAppointmentDateShort = (isoDateString: string): string => {
  const date = new Date(isoDateString);
  
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    hour12: true
  });
}; 