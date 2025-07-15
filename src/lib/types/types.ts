// Import robust Prisma types that work regardless of client generation status
import {
  BestDeal,
  HeroBanner,
  Product,
  ProductImage as Image,
  Category,
  User,
  Customer,
  Order,
  OrderItem,
  Admin,
  Address,
  Payment,
  AddressPrisma,
  MarqueeOffers,
} from "./prisma-types";
import { LucideIcon } from "lucide-react";
import { z } from "zod";
import { ZodProductSchema } from "../zod-schemas/schema";
import { Dispatch, SetStateAction } from "react";

// Re-export all Prisma types for consistent imports across the application
export type {
  BestDeal,
  HeroBanner,
  Product,
  Image,
  Category,
  User,
  Customer,
  Order,
  OrderItem,
  Admin,
  Address,
  Payment,
  AddressPrisma,
  MarqueeOffers,
} from "./prisma-types";

type SummaryCardProps = {
  icon: LucideIcon;
  title: string;
  value: number;
  url?: string;
  color: string;
  bgcolor: string;
  percentage?: { increased: boolean; value: string | number };
  isCurrency?: boolean;
  isLoading?: boolean;
};

type Res = {
  success: boolean;
  message: string;
};

type AdminProfileResProps = Res & {
  name: string;
  image?: string;
  email: string;
  role: "SUPERADMIN" | "ADMIN" | "GUEST";
};

type AdminProps = {
  id: string;
  name: string;
  role: "SUPERADMIN" | "ADMIN" | "GUEST";
  email: string;
};

type AdminsResProps = Res & {
  admins: AdminProps[];
};

// Customer type is now defined above in the main types section

type CustomersResProps = Res & {
  customers: Customer[];
};

type CustomerResProps = Res & {
  customer: Customer | null;
};

type GuestUserProps = {
  user_id: string;
  expiration_date: string;
  status: "active" | "expired";
};

type GuestUserResProps = Res & {
  guest_users: GuestUserProps[];
};

type EditAdminResProps = Res & {
  admin: AdminProps | null;
};

// Address type is now defined above in the main types section

type AddressResProps = Res & {
  addresses: Address[];
};

type OrderProps = Omit<
  Omit<Omit<Order, "orderDate">, "packedDate">,
  "deliveredDate"
> & {
  itemsCount: number;
  orderDate: string;
  packedDate: string;
  deliveredDate: string;
};

type OrderItemProps = OrderItem & { title: string; Image: string };

type SingleOrder = Order & {
  Address: Address;
  Payment: Payment;
  User: {
    id: string;
    name: string;
    email: string;
    phone: string | null;
    image: string | null;
  };
  OrderItem: OrderItemProps[];
};

type SingleOrderResProps = Res & {
  order: SingleOrder | null;
};

type OrderResProps = Res & {
  orders: OrderProps[];
};

type CustomerOrderProps = {
  oid: string;
  amount: number;
  date: string;
  payment: boolean;
  status: string;
  addressId: number;
};

type CustomerProfileProps = {
  id: string;
  name: string;
  email: string;
  gender: "male" | "female";
  phone: string;
  image?: string;
  createdAt: string;
  updatedAt: string;
  lastLogin: string;
};

type CustomerOrderResProps = Res & {
  customer: CustomerProfileProps;
  orders: CustomerOrderProps[] | null;
};

type ProductProps = Omit<Product, "createAt"> & {
  image: string;
  category: string;
  createdAt: string;
};

type ProductResProps = Res & {
  product: Product & { Image: Image[] };
};

type ProductsResProps = Res & {
  products: ProductProps[];
};

type ProductOrdersResProps = Res & {
  orders: (OrderItem & { Order: Order })[];
};

type ProductFormProps = {
  form: any; // Simplified to avoid react-hook-form type conflicts
  setDisable: Dispatch<SetStateAction<boolean>>;
};

type EditProductProps = {
  id: string;
  title: string;
  slug: string;
  shortDescription?: string | null;
  description: string;
  categoryId: number;
  stock: number;
  basePrice: number;
  offerPrice: number;
  variantName?: string | null;
  variantValues?: string | null;
  keywords: string[];
  colorVariants: ColorVariantReturn[];
};

type EditProductResProps = Res & {
  product: EditProductProps;
};

// Category type is now imported from prisma-types.ts

type CategoryRes = Res & { categories: Category[] };

type EditCategoryRes = Res & { category: Category };

type ColorVariant = {
  color: string;
  thumbnail: string;
  others: string[];
};

type ColorVariantReturn = {
  color: string | null;
  thumbnail: {
    id: number | undefined;
    url: string | undefined;
  };
  others: {
    id: number;
    url: string;
  }[];
};

type AddColorSectionProps = {
  variant: ColorVariant;
  index: number;
  setDisable: Dispatch<SetStateAction<boolean>>;
} & ProductFormProps;

type AddProductResProps = Res & {
  info: any;
};

type ImagePickerProps = {
  action: "thumbnail" | "others";
  variant: ColorVariant;
  variantIndex: number;
};

type ImagePreviewProps = {
  image: string;
  variantIndex: number;
  imageIndex?: number;
  action: "thumbnail" | "others";
};

type ColorVariantRes = {
  color: string | null;
  images: {
    id: number;
    url: string;
  }[];
};

type MakeColorVariant = {
  colors: string | null;
  images: Image[];
};

type DealsAndOffers = {
  deal: BestDeal | null;
  offers: MarqueeOffers[];
  banners: HeroBanner[];
};

type DealsAndOffersRes = Res & DealsAndOffers;

export type {
  SummaryCardProps,
  AdminProfileResProps,
  AdminsResProps,
  // Customer, Address, Category are now exported from prisma-types.ts
  CustomersResProps,
  CustomerResProps,
  GuestUserResProps,
  GuestUserProps,
  AdminProps,
  EditAdminResProps,
  AddressResProps,
  OrderItemProps,
  OrderProps,
  SingleOrder,
  SingleOrderResProps,
  CustomerOrderProps,
  CustomerProfileProps,
  CustomerOrderResProps,
  ProductResProps,
  ProductsResProps,
  ProductOrdersResProps,
  ProductProps,
  ProductFormProps,
  EditProductProps,
  EditProductResProps,
  OrderResProps,
  CategoryRes,
  EditCategoryRes,
  ColorVariant,
  ColorVariantReturn,
  AddColorSectionProps,
  AddProductResProps,
  ImagePickerProps,
  ImagePreviewProps,
  MakeColorVariant,
  ColorVariantRes,
  DealsAndOffers,
  DealsAndOffersRes,
};
