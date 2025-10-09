// Paystack inline payment types
interface PaystackPopupOptions {
  key: string;
  email: string;
  amount: number;
  currency?: string;
  ref: string;
  callback: (response: { reference: string }) => void;
  onClose: () => void;
  metadata?: Record<string, any>;
}

interface PaystackPopup {
  openIframe: () => void;
}

declare global {
  interface Window {
    PaystackPop: {
      setup: (options: PaystackPopupOptions) => PaystackPopup;
    };
  }
}

export const initializePaystackPayment = (options: PaystackPopupOptions): PaystackPopup => {
  if (!window.PaystackPop) {
    throw new Error('Paystack library not loaded');
  }
  return window.PaystackPop.setup(options);
};
