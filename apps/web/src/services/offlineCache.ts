// =================================================================
// Kisan Pehele — Offline & Low-Connectivity Cache Service
// "Critical Rule: Never lose a confirmed booking because connectivity disappears."
// =================================================================

const ACTIVE_BOOKING_KEY = 'kisan_pehele_active_booking';
const TOKEN_CACHE_KEY = 'kisan_pehele_token_cache';
const CENTERS_CACHE_KEY = 'kisan_pehele_centers_cache';
const CACHE_TIMESTAMP_KEY = 'kisan_pehele_cache_timestamp';

export class OfflineCacheService {
  static saveActiveBooking(booking: any) {
    if (!booking) return;
    try {
      localStorage.setItem(ACTIVE_BOOKING_KEY, JSON.stringify(booking));
      if (booking.token) {
        localStorage.setItem(TOKEN_CACHE_KEY, JSON.stringify(booking.token));
      }
      localStorage.setItem(CACHE_TIMESTAMP_KEY, new Date().toISOString());
    } catch (e) {
      console.warn('LocalStorage error:', e);
    }
  }

  static getActiveBooking(): any | null {
    try {
      const data = localStorage.getItem(ACTIVE_BOOKING_KEY);
      return data ? JSON.parse(data) : null;
    } catch (e) {
      return null;
    }
  }

  static getCachedToken(): any | null {
    try {
      const data = localStorage.getItem(TOKEN_CACHE_KEY);
      return data ? JSON.parse(data) : null;
    } catch (e) {
      return null;
    }
  }

  static saveCenters(centers: any[]) {
    try {
      localStorage.setItem(CENTERS_CACHE_KEY, JSON.stringify(centers));
    } catch (e) {}
  }

  static getCachedCenters(): any[] {
    try {
      const data = localStorage.getItem(CENTERS_CACHE_KEY);
      return data ? JSON.parse(data) : [];
    } catch (e) {
      return [];
    }
  }

  static getLastUpdated(): string | null {
    return localStorage.getItem(CACHE_TIMESTAMP_KEY);
  }
}
