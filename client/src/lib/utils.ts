import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { format, formatDistanceToNow } from "date-fns";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDateTime(date: Date | string): string {
  const dateObj = typeof date === "string" ? new Date(date) : date;
  return format(dateObj, "MMM d, yyyy h:mm a");
}

export function formatDateOnly(date: Date | string): string {
  const dateObj = typeof date === "string" ? new Date(date) : date;
  return format(dateObj, "MMM d, yyyy");
}

export function formatTimeOnly(date: Date | string): string {
  const dateObj = typeof date === "string" ? new Date(date) : date;
  return format(dateObj, "h:mm a");
}

export function formatTimeAgo(date: Date | string | undefined | null): string {
  if (!date) return "some time ago";

  try {
    const dateObj = typeof date === "string" ? new Date(date) : date;
    // Check if the date is valid before formatting
    if (isNaN(dateObj.getTime())) {
      return "some time ago";
    }
    return formatDistanceToNow(dateObj, { addSuffix: true });
  } catch (error) {
    console.error("Error formatting time ago:", error);
    return "some time ago";
  }
}

export function getColorForStatus(status: string): {
  bg: string;
  text: string;
} {
  switch (status) {
    case "optimal":
      return { bg: "bg-green-100", text: "text-secondary" };
    case "low":
      return { bg: "bg-yellow-100", text: "text-warning" };
    case "critical":
      return { bg: "bg-red-100", text: "text-danger" };
    case "overstock":
      return { bg: "bg-blue-100", text: "text-primary" };
    default:
      return { bg: "bg-gray-100", text: "text-gray-500" };
  }
}

export function getColorForAgentType(agentType: string): {
  bg: string;
  border: string;
  icon: string;
} {
  switch (agentType) {
    case "forecast":
      return { 
        bg: "bg-green-50", 
        border: "border-secondary", 
        icon: "bg-secondary"
      };
    case "inventory":
      return { 
        bg: "bg-yellow-50", 
        border: "border-warning", 
        icon: "bg-warning"
      };
    case "pricing":
      return { 
        bg: "bg-blue-50", 
        border: "border-primary", 
        icon: "bg-primary"
      };
    case "supplier":
      return { 
        bg: "bg-purple-50", 
        border: "border-purple-500", 
        icon: "bg-purple-500"
      };
    default:
      return { 
        bg: "bg-gray-50", 
        border: "border-gray-400", 
        icon: "bg-gray-400"
      };
  }
}

export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength) + "...";
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amount);
}

export function formatPercentage(value: number): string {
  return `${value >= 0 ? '+' : ''}${value}%`;
}
