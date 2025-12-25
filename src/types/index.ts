export type UserRole = "GESTOR" | "COMERCIAL" | "LOGISTICA" | "ADMIN";

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar_url?: string;
  created_at?: string;
}

export interface Sector {
  id: string;
  name: string;
}

export interface ReturnReason {
  id: string;
  name: string;
  sector_id: string;
  sector?: Sector;
}

export interface ReturnItem {
  id: string;
  return_id?: string;
  description: string;
  unit: string;
  quantity: number;
  unit_value: number;
  total_value: number;
  item_number: string;
}

export interface ReturnRequest {
  id: string;
  created_at: string;
  date: string; // ISO Date
  customer_name: string;
  customer_cnpj: string;
  customer_city: string;
  customer_uf: string;
  seller_name: string;
  sector_id?: string;
  reason_id?: string;
  status: "PENDING" | "APPROVED" | "REJECTED";
  total_value: number;
  invoice_number: string;
  invoice_date: string;
  origin_city: string;
  origin_uf: string;
  network?: string;
  items?: ReturnItem[];
  
  // Joined fields
  sectors?: Sector;
  return_reasons?: ReturnReason;
}

export type Period =
  | "TODAY"
  | "YESTERDAY"
  | "THIS_WEEK"
  | "LAST_WEEK"
  | "THIS_MONTH"
  | "LAST_MONTH"
  | "THIS_QUARTER"
  | "THIS_SEMESTER"
  | "THIS_YEAR";

export interface Filters {
  search?: string;
  startDate?: Date;
  endDate?: Date;
  period?: Period;
  seller?: string[];
  city?: string[];
  customer?: string[];
  uf?: string[];
  network?: string[];
  reason?: string[];
  sector?: string[];
}
