import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatLanguage(lang: string): string {
  return lang
    .split(",")
    .map((l) => l.trim())
    .filter(Boolean)
    .map((l) => l.charAt(0).toUpperCase() + l.slice(1))
    .join(", ");
}

export function getStationInitials(name: string): string {
  return name
    .split(" ")
    .slice(0, 2)
    .map((w) => w[0])
    .join("")
    .toUpperCase();
}

export function getAvatarColor(name: string): string {
  const colors = [
    "from-orange-500 to-red-500",
    "from-green-500 to-teal-500",
    "from-blue-500 to-indigo-500",
    "from-purple-500 to-pink-500",
    "from-yellow-500 to-orange-500",
    "from-cyan-500 to-blue-500",
    "from-rose-500 to-pink-500",
    "from-emerald-500 to-green-500",
  ];
  const index =
    name.split("").reduce((acc, c) => acc + c.charCodeAt(0), 0) % colors.length;
  return colors[index];
}
