/**
 * ROBUST PRISMA TYPE DEFINITIONS
 * 
 * This file provides a fallback type system that works regardless of Prisma client
 * generation status. It attempts to import from Prisma first, then falls back to
 * our own type definitions that match the database schema.
 */

// Attempt to import from Prisma client, with fallback types
let PrismaTypes: any = {};

try {
  // Try to import Prisma types
  PrismaTypes = require('@prisma/client');
} catch (error: any) {
  // Prisma client not available, we'll use fallback types
  console.warn('Prisma client not available, using fallback types');
}

// ============================================================================
// FALLBACK TYPE DEFINITIONS
// These match our actual database schema from prisma/schema.prisma
// ============================================================================

// Use conditional types based on Prisma availability
export type BestDeal = typeof PrismaTypes.BestDeal extends undefined ? {
  id: number;
  imageUrl: string;
  title: string;
  description: string;
  url: string;
  price: number;
  createdAt?: Date;
  updatedAt?: Date;
} : typeof PrismaTypes.BestDeal;

export type HeroBanner = typeof PrismaTypes.HeroBanner extends undefined ? {
  id: number;
  title: string;
  description: string;
  basePrice: number;
  offerPrice: number;
  imageUrlSm: string;
  imageUrlLg: string;
  createdAt?: Date;
  updatedAt?: Date;
} : typeof PrismaTypes.HeroBanner;

export type Product = typeof PrismaTypes.Product extends undefined ? {
  id: string;
  slug: string;
  title: string;
  description: string;
  categoryId: number;
  basePrice: number;
  offerPrice?: number;
  stock: number;
  shortDescription?: string;
  createdAt?: Date;
  updatedAt?: Date;
  Image?: ProductImage[];
} : typeof PrismaTypes.Product;

export type ProductImage = typeof PrismaTypes.Image extends undefined ? {
  id: number;
  url: string;
  productId: string;
  createdAt?: Date;
  updatedAt?: Date;
} : typeof PrismaTypes.Image;

export type Category = typeof PrismaTypes.Category extends undefined ? {
  id: number;
  name: string;
  parentId?: number;
  parent?: Category;
  Category?: Category[];
  Product?: Product[];
  createdAt?: Date;
  updatedAt?: Date;
} : typeof PrismaTypes.Category;

export type User = typeof PrismaTypes.User extends undefined ? {
  id: string;
  name: string;
  email: string;
  gender?: string;
  phone?: string;
  image?: string;
  emailVerified?: Date;
  createdAt?: Date;
  updatedAt?: Date;
  lastLogin?: Date;
} : typeof PrismaTypes.User;

// Alias User as Customer for app consistency
export type Customer = User;

export type Order = typeof PrismaTypes.Order extends undefined ? {
  id: string;
  orderDate: Date;
  packedDate?: Date;
  deliveredDate?: Date;
  total: number;
  status: string;
  userId: string;
  addressId: number;
  User?: User;
  Address?: Address;
  OrderItem?: OrderItem[];
  Payment?: Payment;
} : typeof PrismaTypes.Order;

export type OrderItem = typeof PrismaTypes.OrderItem extends undefined ? {
  id: number;
  productId: string;
  quantity: number;
  color?: string;
  orderId: string;
  Product?: Product;
  Order?: Order;
} : typeof PrismaTypes.OrderItem;

export type Admin = typeof PrismaTypes.Admin extends undefined ? {
  id: string;
  name: string;
  email: string;
  password: string;
  role: 'ADMIN' | 'GUEST' | 'SUPERADMIN';
  image?: string;
  createdAt?: Date;
  updatedAt?: Date;
} : typeof PrismaTypes.Admin;

export type Address = typeof PrismaTypes.Address extends undefined ? {
  address_id: number;
  name: string;
  phone?: string;
  address: string;
  district: string;
  state: string;
  pincode: string;
  landmark?: string;
  alternate_phone?: string;
  is_default: boolean;
  is_deleted: boolean;
  userId: string;
  locality: string;
  User?: User;
  Order?: Order[];
} : typeof PrismaTypes.Address;

export type Payment = typeof PrismaTypes.Payment extends undefined ? {
  id: string;
  orderId: string;
  amount: number;
  method: string;
  status: string;
  createdAt?: Date;
  updatedAt?: Date;
  Order?: Order;
} : typeof PrismaTypes.Payment;

// Additional utility types
export type Image = ProductImage;

// MarqueeOffers type (fallback definition)
export type MarqueeOffers = typeof PrismaTypes.MarqueeOffers extends undefined ? {
  id: number;
  title: string;
  description?: string;
  imageUrl: string;
  link?: string;
  isActive: boolean;
  createdAt?: Date;
  updatedAt?: Date;
} : typeof PrismaTypes.MarqueeOffers;

// Legacy compatibility
export type AddressPrisma = Address;

// Export all types for easy importing
export type {
  BestDeal as PrismaBestDeal,
  HeroBanner as PrismaHeroBanner,
  Product as PrismaProduct,
  ProductImage as PrismaImage,
  Category as PrismaCategory,
  User as PrismaUser,
  Customer as PrismaCustomer,
  Order as PrismaOrder,
  OrderItem as PrismaOrderItem,
  Admin as PrismaAdmin,
  Address as PrismaAddress,
  Payment as PrismaPayment,
};
