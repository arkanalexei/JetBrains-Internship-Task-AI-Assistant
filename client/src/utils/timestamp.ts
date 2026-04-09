import { format } from "date-fns";

export const formatDateOnly = (timestamp: number) => {
  const date = new Date(timestamp);
  const today = new Date();
  const isToday =
    date.getDate() === today.getDate() &&
    date.getMonth() === today.getMonth() &&
    date.getFullYear() === today.getFullYear();
  return isToday ? "Today" : format(date, "MMM d, yyyy");
};

export const formatTimeOnly = (timestamp: number) => {
  return format(new Date(timestamp), "h:mm a");
};
