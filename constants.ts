
import { PortfolioStats, STRPerformanceData, Scenario, ScenarioType, MarketingVideo, Branch, ComparisonLink } from './types';

// --- NEW DATA FOR STR DASHBOARD ---
export const STR_DATA: STRPerformanceData = {
    period: 'January 2026',
    units: [
        {
            id: 'u1',
            unitNumber: '3305',
            buildingName: 'Mathwaa 33 - Al Olaya',
            actualRevenue: 5570,
            forecastedRevenue: 7675,
            occupancyRate: 100,
            status: 'Occupied',
            daysRemaining: 0,
            comments: "We are 33% away from target. This is primarily because we accepted 1 booking for 28 nights instead of giving it on STR. At this rate, we are renting at the equivalent of our second price. ADR = SAR 175 to SAR 197",
            negotiatedRates: [
                { label: 'Negotiation 1', price: 6140 },
                { label: 'Negotiation 2', price: 5830 },
                { label: 'Negotiation 3', price: 5680 }
            ]
        },
        {
            id: 'u2',
            unitNumber: '3321',
            buildingName: 'Mathwaa 33 - Al Olaya',
            actualRevenue: 3193,
            forecastedRevenue: 7400,
            occupancyRate: 43,
            status: 'Vacant', // Low occupancy relative to others
            daysRemaining: 18,
            comments: "- Since the beginning of January, we've had 2 vacant days so far.\n- 9 days occupied in the month so far.\n- Current daily rate: SAR 255 to SAR 300",
            negotiatedRates: [
                { label: 'Negotiation 1', price: 5920 },
                { label: 'Negotiation 2', price: 5620 },
                { label: 'Negotiation 3', price: 5480 }
            ]
        },
        {
            id: 'u3',
            unitNumber: '3322',
            buildingName: 'Mathwaa 33 - Al Olaya',
            actualRevenue: 5965,
            forecastedRevenue: 7237,
            occupancyRate: 87,
            status: 'Occupied',
            daysRemaining: 5,
            comments: "- Since the beginning of January we've had zero vacant days.\n- 26 days out of 31 occupied so far.\n- Current ADR = SAR 214 to SAR 305",
            negotiatedRates: [
                { label: 'Negotiation 1', price: 5790 },
                { label: 'Negotiation 2', price: 5500 },
                { label: 'Negotiation 3', price: 5360 }
            ]
        }
    ]
};

// --- LEGACY DATA PRESERVED ---
export const PORTFOLIO_STATS: PortfolioStats = {
    id: 'mathwaa-portfolio',
    name: 'Mathwaa Portfolio',
    properties: [] // Emptied as we are focusing on STR now
};

export const SCENARIOS: Scenario[] = [
  {
    id: 'study_a',
    type: ScenarioType.LONG_TERM,
    name: 'Study A: Apartments',
    color: '#2A5B64',
    description: 'Analysis for 7 units comprising 6 One-Bedroom and 1 Two-Bedroom apartments (Section D). Prices reflect annual leasing rates based on monthly operation. Management Fee set at 15%.',
    financials: {
        worst: { revenue: 485520, mabaatShare: 485520 * 0.15, netIncome: 485520 * 0.85, roi: 9.8 },
        base: { revenue: 543900, mabaatShare: 543900 * 0.15, netIncome: 543900 * 0.85, roi: 11.0 },
        best: { revenue: 602196, mabaatShare: 602196 * 0.15, netIncome: 602196 * 0.85, roi: 12.2 }
    },
    propertyValue: 4200000,
    unitCount: 7,
    unitLabel: 'Units',
    occupancyDurationLabel: 'Annual Leasing',
    unitMix: [
        { name: '1 Bedroom Apartment', count: 6, avgPrice: 77700, priceRange: { min: 69360, avg: 77700, max: 86028 } },
        { name: '2 Bedroom Apartment', count: 1, avgPrice: 77700, priceRange: { min: 69360, avg: 77700, max: 86028 } }
    ],
  },
  {
    id: 'study_b',
    type: ScenarioType.LONG_TERM,
    name: 'Study B: Co-living Plus',
    color: '#C98B8B',
    description: 'Enhanced Co-living model.',
    financials: {
        worst: { revenue: 2102400, mabaatShare: 2102400 * 0.15, netIncome: 2102400 * 0.85, roi: 11.7 },
        base: { revenue: 2221200, mabaatShare: 2221200 * 0.15, netIncome: 2221200 * 0.85, roi: 12.3 },
        best: { revenue: 2379600, mabaatShare: 2379600 * 0.15, netIncome: 2379600 * 0.85, roi: 13.2 }
    },
    propertyValue: 15300000,
    unitCount: 57,
    unitLabel: 'Rooms',
    occupancyDurationLabel: 'Annual Contracts',
    unitMix: [
        { name: 'Master Room', count: 33, avgPrice: 42000, priceRange: { min: 38400, avg: 42000, max: 46800 } },
        { name: 'Single Room', count: 24, avgPrice: 34800, priceRange: { min: 34800, avg: 34800, max: 34800 } }
    ],
  }
];

export const MARKETING_VIDEOS: MarketingVideo[] = [
    { id: 'v1', title: 'Community Overview', thumbnailUrl: 'https://images.unsplash.com/photo-1556761175-5973dc0f32e7?auto=format&fit=crop&w=800&q=80', videoUrl: '#' },
    { id: 'v2', title: 'Townhouse Interior', thumbnailUrl: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=800&q=80', videoUrl: '#' }
];

export const COMPARISON_LINKS: Record<string, ComparisonLink[]> = {
  study_a: [],
  study_b: []
};

export const MABAAT_SHARE_PERCENTAGE = 0.15;
export const BRANCHES: Branch[] = [];
