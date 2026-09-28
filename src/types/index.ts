export interface ApiEnvelope<T> {
  success: boolean;
  data: T;
  message?: string | string[];
  statusCode?: number;
}

export interface Paginated<T> {
  items: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface Vendor {
  id: string;
  ownerUserId: string;
  businessNameAr: string;
  businessNameEn: string;
  category: string;
  lat: number;
  lng: number;
  addressText: string;
  priceRange: string;
  moodTags: string[];
  companionTags: string[];
  verified: boolean;
  avgRating: number;
  ratingCount: number;
  operatingHours: Record<string, string>;
  images: string[];
  isActive: boolean;
}

export interface VendorStats {
  views: number;
  bookings: number;
  used: number;
  conversionRate: number;
}

export interface Booking {
  id: string;
  userId: string;
  vendorId: string;
  moodSessionId: string | null;
  status: string;
  paymentMethod: string;
  amount: number | string;
  discountPct: number | string;
  qrCode: string | null;
  qrScannedAt: string | null;
  rating: number | null;
  reviewText: string | null;
  createdAt: string;
  expiresAt: string;
}

export interface Review {
  id: string;
  userId: string;
  vendorId: string;
  bookingId: string;
  rating: number;
  comment: string | null;
  createdAt: string;
}

export interface AuthUser {
  id: string;
  phone: string;
  displayName?: string;
  points?: number;
  tier?: string;
}

export interface Offer {
  id: string;
  vendorId: string;
  title: string;
  discountPct: number;
  startDate: string;
  endDate: string;
  isActive: boolean;
  createdAt: string;
}
