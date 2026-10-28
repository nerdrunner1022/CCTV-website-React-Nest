export type PageView =
  | 'overview-and-3d-showcase'
  | 'hardware-catalog'
  | 'installation-and-engineering-services'
  | 'system-configurator-and-estimator'
  | 'contact-and-site-survey'
  | 'admin-dashboard';

export interface HardwareItem {
  id: string;
  sku: string;
  name: string;
  category: string;
  series: string;
  price: number;
  image: string;
  imageUrl?: string;
  badge: string;
  statusBadge: string;
  resLabel: string;
  tagline: string;
  specs: string[];
  metricLabel: string;
  metricValue: string;
  metricIcon: string;
  formFactor: 'ptz' | 'dome' | 'bullet' | 'panoramic' | 'nvr' | 'access';
  resolution: string;
  ingress: {
    ik10: boolean;
    ip67: boolean;
    heated: boolean;
  };
  nightTech: 'smart-matrix-ir' | 'starlight' | 'thermal-core';
  quantity?: number;
  fov?: string;
  ipRating?: string;
  irRange?: string;
  sensor?: string;
}

export interface LeadItem {
  id: string;
  contactName: string;
  phone: string;
  email: string;
  facilityName: string;
  location?: string;
  region: string;
  status: 'NEW' | 'CONTACTED' | 'SURVEY_BOOKED' | 'QUOTED' | 'WON' | 'LOST' | 'INSTALLED';
  source: string;
  assignedStaff: string;
  assignedRole?: string;
  assignedInitials?: string;
  assignedColor?: string;
  assignedStaffId?: string;
  age: string;
  slaStatus?: string;
  cameraPayload?: string;
  cameraCountSpec: string;
  estimatedValuation?: number;
  valuation: string;
  surveyDate?: string;
  notes?: string;
  reconImage?: string;
  imageUrl?: string;
  timeline: string[];
}

export interface SurveySubmission {
  contactName?: string;
  name?: string;
  facilityName?: string;
  facility?: string;
  phone?: string;
  email?: string;
  nodes?: string;
  cameras?: string;
  preferredDate?: string;
  date?: string;
  notes?: string;
  source?: string;
}

export interface ConfiguratorState {
  propertyType: 'warehouse' | 'retail' | 'hq' | 'estate';
  sqft: number;
  domeCount: number;
  ptzCount: number;
  thermalCount: number;
  storageType: 'on-prem' | 'hybrid-cloud';
  retentionDays: 30 | 60 | 90;
  slaType: 'self' | 'turnkey' | 'soc';
}
