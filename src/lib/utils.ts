import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function ensureStartsWith(stringToCheck: string, startsWith: string): string {
  return stringToCheck.startsWith(startsWith) ? stringToCheck : `${startsWith}${stringToCheck}`;
}
