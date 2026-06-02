export interface User {
  id: string;
  email: string;
  company_name: string;
}

export interface FixedCost {
  id: string;
  user_id: string;
  name: string;
  value: number;
  category?: string;
  created_at: string;
}

export interface VariableCost {
  id: string;
  product_id: string;
  name: string;
  value: number;
  type: 'percent' | 'fixed';
  created_at: string;
}

export interface Product {
  id: string;
  user_id: string;
  name: string;
  category?: string;
  sku?: string;
  cost_price: number;
  desired_margin: number;
  created_at: string;
}

export interface PricingResult {
  fixedCostShare: number;
  variableCostPercent: number;
  variableCostFixed: number;
  effectiveCostBase: number;
  suggestedSellingPrice: number;
  netProfit: number;
  realMarginPercent: number;
}

export interface ReverseSimulatorResult extends PricingResult {
  customPrice: number;
}
