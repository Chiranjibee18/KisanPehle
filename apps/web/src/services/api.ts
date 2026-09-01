// =================================================================
// Kisan Pehele — REST API Client & Offline Fallback Layer
// "Pehle pata, phir mandi."
// =================================================================

const BASE_URL = import.meta.env.VITE_API_URL || '/api/v1';

export class ApiClient {
  private static getHeaders(idempotencyKey?: string): HeadersInit {
    const token = localStorage.getItem('kisan_pehele_token');
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
    if (idempotencyKey) {
      headers['Idempotency-Key'] = idempotencyKey;
    }
    return headers;
  }

  private static async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    try {
      const res = await fetch(`${BASE_URL}${endpoint}`, {
        ...options,
        headers: {
          ...this.getHeaders((options as any).idempotencyKey),
          ...options.headers,
        },
      });

      const contentType = res.headers.get('content-type') || '';
      const text = await res.text();
      let data: any = null;

      if (text && text.trim().length > 0) {
        if (contentType.includes('application/json') || text.startsWith('{') || text.startsWith('[')) {
          try {
            data = JSON.parse(text);
          } catch (jsonErr) {
            if (!res.ok) {
              throw new Error(`Server error (${res.status}): ${text.slice(0, 150)}`);
            }
            throw new Error(`Invalid JSON response from server (${res.status})`);
          }
        } else {
          if (!res.ok) {
            throw new Error(`Server returned error (${res.status}): ${text.slice(0, 150)}`);
          }
          throw new Error(`Expected JSON response, but received ${contentType || 'non-JSON'} (${res.status})`);
        }
      } else {
        if (!res.ok) {
          throw new Error(`Server error (${res.status}): Empty response from ${endpoint}`);
        }
        data = {} as T;
      }

      if (!res.ok) {
        throw new Error(data?.message || data?.error?.message || `Request failed with status ${res.status}`);
      }

      return data;
    } catch (err: any) {
      console.warn(`[API Network / Offline]: ${endpoint} -> ${err.message}`);
      throw err;
    }
  }

  // Auth
  static async sendOtp(mobile: string) {
    return this.request<any>('/auth/send-otp', {
      method: 'POST',
      body: JSON.stringify({ mobile }),
    });
  }

  static async verifyOtp(dto: any) {
    const res = await this.request<any>('/auth/verify-otp', {
      method: 'POST',
      body: JSON.stringify(dto),
    });
    if (res.accessToken) {
      localStorage.setItem('kisan_pehele_token', res.accessToken);
      localStorage.setItem('kisan_pehele_user', JSON.stringify(res.user));
    }
    return res;
  }

  static async login(mobile: string, password = 'kisan123') {
    const res = await this.request<any>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ mobile, password }),
    });
    if (res.accessToken) {
      localStorage.setItem('kisan_pehele_token', res.accessToken);
      localStorage.setItem('kisan_pehele_user', JSON.stringify(res.user));
    }
    return res;
  }

  static logout() {
    localStorage.removeItem('kisan_pehele_token');
    localStorage.removeItem('kisan_pehele_user');
  }

  static async demoLogin(role: string) {
    const res = await this.request<any>('/auth/demo-login', {
      method: 'POST',
      body: JSON.stringify({ role }),
    });
    if (res.accessToken) {
      localStorage.setItem('kisan_pehele_token', res.accessToken);
      localStorage.setItem('kisan_pehele_user', JSON.stringify(res.user));
    }
    return res;
  }

  static async getProfile() {
    return this.request<any>('/auth/me');
  }

  // Crops & Centers
  private static toQueryString(params?: Record<string, any>): string {
    if (!params) return '';
    const clean: Record<string, string> = {};
    Object.entries(params).forEach(([k, v]) => {
      if (v !== undefined && v !== null && v !== '' && v !== 'undefined' && v !== 'null') {
        clean[k] = String(v);
      }
    });
    const qs = new URLSearchParams(clean).toString();
    return qs ? `?${qs}` : '';
  }

  // Crops & Centers
  static async getCrops() {
    return this.request<any>('/crops');
  }

  static async getCenters(params?: { cropId?: string; district?: string; status?: string }) {
    return this.request<any>(`/procurement-centers${this.toQueryString(params)}`);
  }

  static async getCenterById(id: string) {
    return this.request<any>(`/procurement-centers/${id}`);
  }

  static async updateCenterStatus(id: string, status: string, reason?: string, activeCounters?: number) {
    return this.request<any>(`/procurement-centers/${id}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status, reason, activeCounters }),
    });
  }

  // Schedules
  static async getCenterSchedules(centerId: string, date?: string, cropId?: string) {
    return this.request<any>(`/schedules/center/${centerId}${this.toQueryString({ date, cropId })}`);
  }

  // Bookings
  static async createBooking(payload: any, idempotencyKey?: string) {
    return this.request<any>('/bookings', {
      method: 'POST',
      body: JSON.stringify(payload),
      ...(idempotencyKey ? { idempotencyKey } : {}),
    } as any);
  }

  static async getMyBookings() {
    return this.request<any>('/bookings/my');
  }

  static async getBookingById(id: string) {
    return this.request<any>(`/bookings/${id}`);
  }

  static async cancelBooking(id: string, reason: string) {
    return this.request<any>(`/bookings/${id}/cancel`, {
      method: 'POST',
      body: JSON.stringify({ reason }),
    });
  }

  // Queue
  static async getQueue(centerId: string, tokenId?: string) {
    return this.request<any>(`/queue/${centerId}${this.toQueryString({ tokenId })}`);
  }

  static async advanceQueue(centerId: string) {
    return this.request<any>(`/queue/${centerId}/advance`, {
      method: 'POST',
    });
  }

  static async updateTokenStatus(tokenId: string, status: string) {
    return this.request<any>(`/queue/token/${tokenId}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status }),
    });
  }

  // Procurement Case State Machine
  static async getProcurementCases(centerId: string, status?: string) {
    return this.request<any>(`/procurement/cases${this.toQueryString({ centerId, status })}`);
  }

  static async getProcurementCaseById(id: string) {
    return this.request<any>(`/procurement/cases/${id}`);
  }

  static async markArrived(caseId: string) {
    return this.request<any>(`/procurement/cases/${caseId}/arrive`, { method: 'POST' });
  }

  static async verifyFarmer(caseId: string, dto: any) {
    return this.request<any>(`/procurement/cases/${caseId}/verify`, {
      method: 'POST',
      body: JSON.stringify(dto),
    });
  }

  static async inspectCrop(caseId: string, dto: any) {
    return this.request<any>(`/procurement/cases/${caseId}/inspect`, {
      method: 'POST',
      body: JSON.stringify(dto),
    });
  }

  static async processPayment(caseId: string) {
    return this.request<any>(`/procurement/cases/${caseId}/pay`, { method: 'POST' });
  }

  // AI & Voice
  static async getWaitPrediction(centerId: string) {
    return this.request<any>(`/ai/wait-time/${centerId}`);
  }

  static async getDemandForecast(centerId: string, cropId?: string) {
    return this.request<any>(`/ai/demand-forecast/${centerId}${this.toQueryString({ cropId })}`);
  }

  static async getAlternativeCenters(cropId: string, currentCenterId?: string) {
    return this.request<any>(`/ai/recommendations${this.toQueryString({ cropId, currentCenterId })}`);
  }

  static async parseVoiceIntent(transcript: string, language: string) {
    return this.request<any>('/voice/parse-intent', {
      method: 'POST',
      body: JSON.stringify({ transcript, language }),
    });
  }

  // IVR Simulation
  static async simulateIvr(dto: any) {
    return this.request<any>('/ivr/simulate', {
      method: 'POST',
      body: JSON.stringify(dto),
    });
  }

  static async getIvrLogs() {
    return this.request<any>('/ivr/logs');
  }

  // Admin Analytics & Audit Logs
  static async getAdminAnalytics(district?: string) {
    return this.request<any>(`/admin/analytics${this.toQueryString({ district })}`);
  }

  static async getAuditLogs(params?: any) {
    return this.request<any>(`/audit-logs${this.toQueryString(params)}`);
  }

  static async getNotifications() {
    return this.request<any>('/notifications/my');
  }

  static async getSmsLogs() {
    return this.request<any>('/notifications/sms-log');
  }

  // Helpers
  static async addHelper(dto: any) {
    return this.request<any>('/users/helpers', {
      method: 'POST',
      body: JSON.stringify({
        helperName: dto.name || dto.helperName,
        helperMobile: dto.mobile || dto.helperMobile,
        relationship: dto.relationship || 'Family Member',
        permissions: dto.permissions || 'VIEW_AND_BOOK',
      }),
    });
  }

  static async revokeHelper(id: string) {
    return this.request<any>(`/users/helpers/${id}`, {
      method: 'DELETE',
    });
  }
}
