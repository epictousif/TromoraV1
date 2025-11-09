import { apiFetch } from "../lib/api";

export interface PaymentRequest {
  bookingId: string;
  paymentMethod?: 'razorpay' | 'pay_on_visit';
}

export interface PaymentResponse {
  status: string;
  payment: {
    id: string;
    paymentId: string;
    amount: number;
    currency: string;
    status: string;
    paymentMethod: string;
    razorpayOrderId?: string;
  };
  razorpayOrder?: {
    id: string;
    amount: number;
    currency: string;
    receipt: string;
  };
  booking: {
    id: string;
    bookingId: string;
    customerName: string;
    salonName: string;
  };
}

export interface VerifyPaymentRequest {
  razorpay_order_id: string;
  razorpay_payment_id: string;
  razorpay_signature: string;
  paymentId: string;
}

export interface RazorpayOptions {
  key: string;
  amount: number;
  currency: string;
  name: string;
  description: string;
  order_id: string;
  handler: (response: any) => void;
  prefill: {
    name: string;
    email: string;
    contact: string;
  };
  theme: {
    color: string;
  };
  modal: {
    ondismiss: () => void;
  };
}

// Create payment order
export async function createPayment(paymentData: PaymentRequest): Promise<PaymentResponse> {
  const res = await apiFetch(`/payments/create`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(paymentData),
  });
  
  if (!res.ok) {
    const j = await res.json().catch(() => ({} as any));
    throw new Error(j.message || `Payment creation failed (${res.status})`);
  }
  
  return res.json();
}

// Verify Razorpay payment
export async function verifyPayment(verificationData: VerifyPaymentRequest): Promise<any> {
  const res = await apiFetch(`/payments/verify`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(verificationData),
  });
  
  if (!res.ok) {
    const j = await res.json().catch(() => ({} as any));
    throw new Error(j.message || `Payment verification failed (${res.status})`);
  }
  
  return res.json();
}

// Get payment details
export async function getPayment(paymentId: string): Promise<any> {
  const res = await apiFetch(`/payments/${paymentId}`);
  
  if (!res.ok) {
    const j = await res.json().catch(() => ({} as any));
    throw new Error(j.message || `Failed to fetch payment (${res.status})`);
  }
  
  return res.json();
}

// Get payment history
export async function getPaymentHistory(params?: { page?: number; limit?: number; status?: string }): Promise<any> {
  const queryParams = new URLSearchParams();
  if (params?.page) queryParams.append('page', params.page.toString());
  if (params?.limit) queryParams.append('limit', params.limit.toString());
  if (params?.status) queryParams.append('status', params.status);
  
  const res = await apiFetch(`/payments?${queryParams.toString()}`);
  
  if (!res.ok) {
    const j = await res.json().catch(() => ({} as any));
    throw new Error(j.message || `Failed to fetch payment history (${res.status})`);
  }
  
  return res.json();
}

// Initialize Razorpay payment
export function initializeRazorpay(options: RazorpayOptions): void {
  const script = document.createElement('script');
  script.src = 'https://checkout.razorpay.com/v1/checkout.js';
  script.onload = () => {
    const rzp = new (window as any).Razorpay(options);
    rzp.open();
  };
  script.onerror = () => {
    throw new Error('Failed to load Razorpay SDK');
  };
  document.body.appendChild(script);
}

// Load Razorpay script
export function loadRazorpayScript(): Promise<boolean> {
  return new Promise((resolve) => {
    if ((window as any).Razorpay) {
      resolve(true);
      return;
    }

    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
}
