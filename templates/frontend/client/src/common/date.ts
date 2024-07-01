
import { format, formatDistanceToNow } from 'date-fns';

export function displayTimeSince(dateStr: string): string {
    const date = new Date(dateStr)
    return formatDistanceToNow(date, { includeSeconds: false });
}


export function formatDate(dateStr: string): string {
    const date = new Date(dateStr)
    return format(date, 'dd/MM/yyyy');
}