/**
 * Adapters to transform backend API responses into frontend interfaces.
 *
 * Backend Equipment shape (from MongoDB):
 *   { _id, title, description, category, pricePerDay, location: { state, district, village },
 *     images: string[], isAvailable, owner: { _id, name, email, phone }, createdAt }
 *
 * Frontend Equipment shape (from data/equipment.ts):
 *   { id, name, category, subcategory, owner: { name, avatar, ... }, location: string,
 *     pricePerDay, minDays, rating, reviewCount, availability, image, gallery, description,
 *     specs, horsepower, year, features }
 */

import type { Equipment } from '@/data/equipment';

// ── Types for raw backend responses ─────────────────────────────────

export interface BackendEquipment {
  _id: string;
  title: string;
  description: string;
  category: string;
  pricePerDay: number;
  location: {
    state: string;
    district: string;
    village: string;
  };
  images: string[];
  isAvailable: boolean;
  owner: {
    _id: string;
    name: string;
    email: string;
    phone?: string;
  } | string; // Could be un-populated (just an ID string)
  averageRating?: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface BackendUser {
  _id: string;
  id: string;
  name: string;
  email: string;
  phone: string;
  role: 'farmer' | 'owner' | 'admin';
}

export interface BackendAuthResponse {
  user: BackendUser;
  accessToken: string;
  refreshToken: string;
  token: string;
}

export interface BackendBooking {
  _id: string;
  equipment: BackendEquipment | { _id: string; title: string; images: string[]; pricePerDay: number };
  renter: string;
  owner: string;
  startDate: string;
  endDate: string;
  totalPrice: number;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  createdAt: string;
}

export interface BackendReview {
  _id: string;
  booking: string;
  reviewer: { _id: string; name: string } | string;
  equipment: string;
  rating: number;
  comment: string;
  createdAt: string;
}

// ── Placeholder SVG for missing images ──────────────────────────────

const NO_IMAGE = `data:image/svg+xml,${encodeURIComponent(
  '<svg xmlns="http://www.w3.org/2000/svg" width="400" height="300" fill="none"><rect width="400" height="300" rx="16" fill="#0f172a"/><text x="200" y="158" text-anchor="middle" fill="#34d399" font-size="16" font-family="sans-serif">No Image</text></svg>'
)}`;

// ── Adapt backend Equipment → frontend Equipment ────────────────────

export function adaptEquipment(raw: BackendEquipment): Equipment {
  const ownerObj = typeof raw.owner === 'object' ? raw.owner : null;
  const locationStr = [raw.location?.village, raw.location?.district, raw.location?.state]
    .filter(Boolean)
    .join(', ');

  const firstImage = raw.images && raw.images.length > 0 ? raw.images[0] : NO_IMAGE;

  return {
    id: raw._id,
    name: raw.title,
    category: raw.category || 'Other',
    subcategory: raw.category || 'General',
    owner: {
      name: ownerObj?.name || 'Unknown Owner',
      avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(ownerObj?.name || 'U')}&background=c96442&color=fff&size=100`,
      memberSince: raw.createdAt ? new Date(raw.createdAt).getFullYear().toString() : '2025',
      rating: raw.averageRating || 4.5,
      responseRate: '95%',
    },
    location: locationStr || 'India',
    pricePerDay: raw.pricePerDay,
    minDays: 1,
    rating: raw.averageRating || 4.5,
    reviewCount: 0,
    availability: raw.isAvailable ? 'available' : 'booked',
    image: firstImage,
    gallery: raw.images && raw.images.length > 0 ? raw.images : [NO_IMAGE],
    description: raw.description || 'No description provided.',
    specs: {
      Category: raw.category,
      'Price/Day': `₹${raw.pricePerDay}`,
      Location: raw.location?.district || 'N/A',
    },
    year: raw.createdAt ? new Date(raw.createdAt).getFullYear() : 2025,
    features: ['Verified Owner'],
  };
}

/** Adapt a list of backend equipment */
export function adaptEquipmentList(rawList: BackendEquipment[]): Equipment[] {
  return rawList.map(adaptEquipment);
}

// ── Adapt backend user → frontend User ──────────────────────────────

export function adaptUser(raw: BackendUser) {
  return {
    id: raw._id || raw.id,
    name: raw.name,
    email: raw.email,
    phone: raw.phone,
    avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(raw.name)}&background=c96442&color=fff&size=100`,
    role: raw.role === 'owner' ? ('renter' as const) : (raw.role as 'farmer' | 'admin'),
    memberSince: new Date().getFullYear().toString(),
  };
}

// ── Adapt backend review ────────────────────────────────────────────

export function adaptReview(raw: BackendReview) {
  const reviewerName = typeof raw.reviewer === 'object' ? raw.reviewer.name : 'Anonymous';
  return {
    id: raw._id,
    name: reviewerName,
    date: raw.createdAt ? formatTimeAgo(raw.createdAt) : 'Recently',
    rating: raw.rating,
    text: raw.comment,
  };
}

function formatTimeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  if (days < 1) return 'Today';
  if (days === 1) return '1 day ago';
  if (days < 7) return `${days} days ago`;
  if (days < 30) return `${Math.floor(days / 7)} week${Math.floor(days / 7) > 1 ? 's' : ''} ago`;
  if (days < 365) return `${Math.floor(days / 30)} month${Math.floor(days / 30) > 1 ? 's' : ''} ago`;
  return `${Math.floor(days / 365)} year${Math.floor(days / 365) > 1 ? 's' : ''} ago`;
}
