import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function error400(message: string) {
  return new Response(JSON.stringify({ message }), { status: 400 });
}

export function error401(message: string) {
  return new Response(JSON.stringify({ message }), { status: 401 });
}

export function error403(message: string) {
  return new Response(JSON.stringify({ message }), { status: 403 });
}

export function error404(message: string) {
  return new Response(JSON.stringify({ message }), { status: 404 });
}

export function error500(message: string) {
  return new Response(JSON.stringify({ message }), { status: 500 });
}

export function success200(data: any) {
  return new Response(JSON.stringify(data), { status: 200 });
}

export function formateDate(date: string | Date) {
  return new Date(date).toLocaleDateString();
}

export function textTruncate(text: string, length: number) {
  if (text.length > length) {
    return text.substring(0, length) + "...";
  }
  return text;
}

export function capitalize(text: string) {
  if (!text) return "";
  return text.charAt(0).toUpperCase() + text.slice(1);
}

export function capitalizeSearchParam(text: string) {
  if (!text) return "";
  return text.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
}

export function makeColorVariant(color: string) {
  return color; // Placeholder, implement actual color variant logic here
}

export function makeColorVariantForEdit(color: string) {
  return color; // Placeholder, implement actual color variant for edit logic here
}