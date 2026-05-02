/**
 * Safely parses a date from various formats including Firestore Timestamps.
 * @param {any} dateValue - The date value to parse.
 * @returns {Date} - A JavaScript Date object.
 */
export const parseDate = (dateValue) => {
  if (!dateValue) return new Date();

  // Handle Firestore Timestamp (_seconds, _nanoseconds)
  if (dateValue._seconds !== undefined) {
    return new Date(dateValue._seconds * 1000);
  }

  // Handle Firestore Timestamp (seconds, nanoseconds)
  if (dateValue.seconds !== undefined) {
    return new Date(dateValue.seconds * 1000);
  }

  // Handle already a Date object
  if (dateValue instanceof Date) {
    return dateValue;
  }

  // Handle string or number
  const date = new Date(dateValue);
  return isNaN(date.getTime()) ? new Date() : date;
};
