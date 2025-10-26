import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

// This function merges Tailwind classes
export function cn(...inputs) {
  return twMerge(clsx(inputs));
}
