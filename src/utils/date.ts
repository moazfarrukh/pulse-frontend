/**
 * Formats a date as "DD Month YYYY" (e.g., "12 February 2024")
 * @param date The date to format. Defaults to current date if not provided.
 * @returns A string with the formatted date
 */
export function formatDate(date: Date = new Date()): string {
    const day = date.getDate();
    const month = date.toLocaleString('en-US', { month: 'long' });
    const year = date.getFullYear();
    
    return `${day} ${month} ${year}`;
}

/**
 * Formats a date string as "DD Month YYYY" (e.g., "12 February 2024")
 * @param dateString The date string to format
 * @returns A string with the formatted date
 */
export function formatDateString(dateString: string): string {
    const date = new Date(dateString);
    return formatDate(date);
}

/**
 * Formats a date for use in chat timestamps, like "10:30 AM" or "Yesterday at 2:45 PM"
 * @param date The date to format. Defaults to current date if not provided.
 * @returns A string with the formatted timestamp for chat display
 */
export function formatChatTimestamp(date: Date = new Date()): string {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    date = new Date(date); // Ensure date is a Date object
    // Format time as 12-hour with AM/PM
    const timeStr = date.toLocaleString('en-US', {
        hour: 'numeric',
        minute: '2-digit',
        hour12: true
    });
    
    // Check if date is today
    if (date >= today) {
        return timeStr;
    }
    // Check if date is yesterday
    else if (date >= yesterday) {
        return `Yesterday at ${timeStr}`;
    }
    // For older dates, show the full date and time
    else {
        return `${formatDate(date)} at ${timeStr}`;
    }
}

/**
 * Formats a date string for use in chat timestamps, like "10:30 AM" or "Yesterday at 2:45 PM"
 * @param dateString The date string to format
 * @returns A string with the formatted timestamp for chat display
 */
export function formatChatTimestampString(dateString: string): string {
    const date = new Date(dateString);
    return formatChatTimestamp(date);
}