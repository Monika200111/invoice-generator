export interface User {
  _id: string;
  email: string;
}

export interface InvoiceItem {
  name: string;
  qty: number;
  rate: number;
}

export interface Invoice {
  _id: string;
  user: string;
  clientName: string;

  items: InvoiceItem[];

  total: number;
  gst: number;
  gstAmount: number;
  grandTotal: number;

  validUntil: string;

  createdAt?: string;
  updatedAt?: string;
}