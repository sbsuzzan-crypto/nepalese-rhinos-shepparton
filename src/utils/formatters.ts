
import { format } from "date-fns";

export const formatDate = (dateString: string) => {
  try {
    return format(new Date(dateString), "MMMM do, yyyy");
  } catch {
    return dateString;
  }
};

export const formatDateTime = (dateString: string) => {
  try {
    return format(new Date(dateString), "EEEE, MMMM do, yyyy");
  } catch {
    return dateString;
  }
};

export const formatTime = (dateString: string) => {
  try {
    return format(new Date(dateString), "h:mm a");
  } catch {
    return "TBD";
  }
};

export const truncateText = (text: string, maxLength: number) => {
  return text.length > maxLength ? text.substring(0, maxLength) + "..." : text;
};

export const getReadingTime = (content: string) => {
  const words = content.replace(/<[^>]*>/g, '').split(' ').length;
  const avgWordsPerMinute = 200;
  return Math.ceil(words / avgWordsPerMinute);
};

export const stripHtml = (html: string) => {
  return html.replace(/<[^>]*>/g, '');
};
