
export interface VacantUnit {
  id: string;
  price: number;
  type: string; 
}

export interface Property {
  id: string;
  name: string;
  totalUnits: number;
  vacantUnits: number;
  avgAnnualRent: number; 
  type: 'Residential' | 'Commercial';
  manualMonthlyLeakage?: number; 
  vacantUnitDetails?: VacantUnit[]; 
}

export interface PortfolioStats {
  id: string;
  name: string;
  properties: Property[];
}

// --- NEW TYPES FOR STR PERFORMANCE ---
export interface NegotiatedRate {
    label: string;
    price: number;
}

export interface STRUnit {
    id: string;
    unitNumber: string;
    buildingName: string;
    actualRevenue: number;    // Money made this month
    forecastedRevenue: number; // Expected target
    occupancyRate: number;    // For context
    status: 'Occupied' | 'Vacant' | 'Maintenance';
    daysRemaining: number;
    comments: string;
    negotiatedRates: NegotiatedRate[];
}

export interface STRPerformanceData {
    period: string;
    units: STRUnit[];
}

// Legacy types preserved below
export enum ScenarioType {
  HYBRID = 'HYBRID',
  LONG_TERM = 'LONG_TERM',
  SHORT_TERM = 'SHORT_TERM',
}

export interface UnitMixItem {
  name: string;
  count: number;
  avgPrice: number;
  priceRange?: {
    min: number;
    max: number;
    avg: number;
  };
  videoUrl?: string;
}

export interface CaseFinancials {
  revenue: number;
  netIncome: number;
  mabaatShare: number;
  roi: number;
}

export interface Scenario {
  id: string;
  type: ScenarioType;
  name: string;
  color: string;
  description: string;
  financials: {
    worst: CaseFinancials;
    base: CaseFinancials;
    best: CaseFinancials;
  };
  propertyValue: number;
  unitCount: number;
  unitLabel: string;
  occupancyDurationLabel: string;
  unitMix: UnitMixItem[];
}

export interface MarketingVideo {
  id: string;
  title: string;
  thumbnailUrl: string;
  videoUrl: string;
}

export interface ComparisonLink {
  platform: string;
  title: string;
  url: string;
  location?: string;
  area?: string;
  price?: number;
  type?: string;
  period?: string;
  photosUrl?: string;
}

export enum ApartmentStatus {
  VACANT = 'VACANT',
  RENTED = 'RENTED',
  RESERVED = 'RESERVED',
}

export enum ApartmentType {
  STUDIO = 'Studio',
  ONE_BEDROOM = '1 Bedroom',
  TWO_BEDROOM = '2 Bedroom',
}

export interface Apartment {
  id: string;
  number: string;
  type: ApartmentType;
  status: ApartmentStatus;
  monthlyRent: number;
  cashCollected: number;
  lifetimeValue: number;
  contractDurationMonths?: number;
  howHeard?: string;
}

export interface Branch {
  id: string;
  name: string;
  targetYearlyRevenue: {
    min: number;
    max: number;
  };
  apartments: Apartment[];
}

export interface NewBooking {
  branchId: string;
  apartmentId: string;
  contractDurationMonths: number;
  howHeard: string;
}
