
export enum UserRole {
  MERCHANT = 'MERCHANT',
  CUSTOMER = 'CUSTOMER'
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  storeName?: string;
  isOpen?: boolean;
  basePrepTime?: number; // Minutes
  openingTime?: string; // HH:mm Shift 1
  closingTime?: string; // HH:mm Shift 1
  openingTime2?: string; // HH:mm Shift 2 (Optional)
  closingTime2?: string; // HH:mm Shift 2 (Optional)
  lat?: number;
  lng?: number;
  currency?: string; // E.g., '€', '$', '£', '¥', 'ARS', 'MXN'
}

export interface Product {
  id: string;
  merchantId: string;
  name: string;
  price: number;
  stock: number;
  description: string;
  category: string;
  prepTimeAdjustment: number; // Extra minutes for this specific item
  imageUrl: string;
  merchantName?: string;
  merchantOpening?: string;
  merchantClosing?: string;
  merchantOpening2?: string;
  merchantClosing2?: string;
  merchantLat?: number;
  merchantLng?: number;
  currency?: string;
}

export interface Order {
  id: string;
  customerId: string;
  merchantId: string;
  productId: string;
  productName: string;
  status: 'PENDING' | 'ACCEPTED' | 'READY' | 'COMPLETED' | 'CANCELLED';
  estimatedMinutes: number;
  createdAt: number;
  type: 'PICKUP' | 'DELIVERY';
}
