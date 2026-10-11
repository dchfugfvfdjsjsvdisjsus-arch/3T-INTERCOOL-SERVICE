export type ServiceCategory = 
  | 'AIR_CONDITIONING'
  | 'COLD_ROOM'
  | 'DUCT_PIPE'
  | 'CHILLER'
  | 'FREEZER_SHOWCASE'
  | 'OTHER';

export type QuotationStatus =
  | 'pending'
  | 'contacted'
  | 'quoted'
  | 'scheduled'
  | 'completed'
  | 'cancelled';

export interface QuotationRequest {
  id?: string;
  customerName: string;
  phone: string;
  email?: string;
  lineId?: string;
  serviceType: ServiceCategory;
  location?: string;
  details?: string;
  urgent?: boolean;
  status: QuotationStatus;
  adminNotes?: string;
  createdAt: string;
  updatedAt?: string;
}

export interface ServiceItem {
  id?: string;
  title: string;
  category: ServiceCategory;
  summary: string;
  features?: string;
  isActive: boolean;
  order?: number;
  updatedAt?: string;
}

export interface CompanyProfile {
  id?: string;
  companyNameTh: string;
  companyNameEn: string;
  managingDirectorTh: string;
  managingDirectorEn: string;
  phone: string;
  lineId: string;
  managerTh?: string;
  managerEn?: string;
  managerPhone?: string;
  managerLineId?: string;
  email: string;
  address: string;
  announcement?: string;
  updatedAt?: string;
}
