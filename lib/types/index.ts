// User Types
export interface User {
  id: string;
  email: string;
  name: string;
  password: string;
  phone?: string;
  country?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface UserProfile extends User {
  billingAddress?: Address;
  shippingAddress?: Address;
}

export interface Address {
  id: string;
  userId: string;
  street: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  isDefault: boolean;
}

// Product Types
export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
  parentId?: string;
  image?: string;
  productCount: number;
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  stock: number;
  images: string[];
  categoryId: string;
  category?: Category;
  brand?: string;
  rating?: number;
  reviews?: number;
  createdAt: Date;
  updatedAt: Date;
}

// Cart Types
export interface CartItem {
  productId: string;
  product?: Product;
  quantity: number;
  price: number;
}

export interface Cart {
  id: string;
  userId: string;
  items: CartItem[];
  total: number;
  createdAt: Date;
  updatedAt: Date;
}

// Order Types
export type PaymentMethod = 'eu_bank' | 'us_bank' | 'uk_bank' | 'card_paypal' | 'bitcoin';

export interface Order {
  id: string;
  userId: string;
  items: CartItem[];
  total: number;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  paymentMethod: PaymentMethod;
  paymentStatus: 'pending' | 'completed' | 'failed';
  shippingAddress: Address;
  billingAddress: Address;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

// Payment Method Configuration
export interface PaymentMethodConfig {
  id: string;
  name: string;
  type: PaymentMethod;
  description: string;
  instructions: string;
  isActive: boolean;
  displayOrder: number;
}

// API Response Types
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

