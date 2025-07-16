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

interface Image {
  id: number;
  url: string;
  productId?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

interface ColorVariantRes {
  color: string;
  images: Image[];
}

export function makeColorVariant({
  colors,
  images,
}: { colors: string; images: Image[] }): ColorVariantRes[] {
  const colorArray = colors.split(",");
  const result: ColorVariantRes[] = [];

  colorArray.forEach((color) => {
    const colorImages = images.filter((image) =>
      image.imagePublicId.includes(color.toLowerCase()),
    );
    result.push({ color, images: colorImages });
  });

  return result;
}

export function makeColorVariantForEdit({
  colors,
  images,
}: { colors: string; images: Image[] }): ColorVariantReturn[] {
  const colorArray = colors.split(",");
  const result: ColorVariantReturn[] = [];

  colorArray.forEach((color) => {
    const thumbnailImage = images.find(
      (image) =>
        image.url.includes(color.toLowerCase()) &&
        image.url.endsWith("-thumb"),
    );
    const otherImages = images.filter(
      (image) =>
        image.url.includes(color.toLowerCase()) &&
        !image.url.endsWith("-thumb"),
    );

    result.push({
      color,
      thumbnail: {
        id: thumbnailImage?.id,
        url: thumbnailImage?.url,
      },
      others: otherImages.map((image) => ({
        id: image.id,
        url: image.url,
      })),
    });
  });

  return result;
}

export function formatCurrency(amount: number, currency: string = "USD") {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
  }).format(amount);
}