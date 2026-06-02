import { Product, VariableCost, FixedCost, PricingResult, ReverseSimulatorResult } from '@/types';

export function calculatePricing(
  product: Product,
  variableCosts: VariableCost[],
  fixedCosts: FixedCost[],
  totalProducts: number
): PricingResult {
  // Calculate Fixed Cost Share
  const totalFixedCosts = fixedCosts.reduce((sum, cost) => sum + cost.value, 0);
  const fixedCostShare = totalProducts > 0 ? totalFixedCosts / totalProducts : 0;

  // Calculate Variable Costs
  const variableCostPercent = variableCosts
    .filter(vc => vc.type === 'percent')
    .reduce((sum, vc) => sum + vc.value, 0);

  const variableCostFixed = variableCosts
    .filter(vc => vc.type === 'fixed')
    .reduce((sum, vc) => sum + vc.value, 0);

  // Calculate Effective Cost Base
  const effectiveCostBase = product.cost_price + fixedCostShare + variableCostFixed;

  // Calculate Suggested Selling Price
  // Selling Price = Effective Cost Base / (1 - Variable Cost % / 100 - desired_margin / 100)
  const denominator = 1 - (variableCostPercent / 100) - (product.desired_margin / 100);
  
  if (denominator <= 0) {
    throw new Error('Invalid pricing: variable costs + margin >= 100%');
  }

  const suggestedSellingPrice = effectiveCostBase / denominator;

  // Calculate Net Profit
  const netProfit =
    suggestedSellingPrice -
    product.cost_price -
    fixedCostShare -
    variableCostFixed -
    (suggestedSellingPrice * variableCostPercent) / 100;

  // Calculate Real Margin %
  const realMarginPercent = suggestedSellingPrice > 0
    ? (netProfit / suggestedSellingPrice) * 100
    : 0;

  return {
    fixedCostShare,
    variableCostPercent,
    variableCostFixed,
    effectiveCostBase,
    suggestedSellingPrice: Math.round(suggestedSellingPrice * 100) / 100,
    netProfit: Math.round(netProfit * 100) / 100,
    realMarginPercent: Math.round(realMarginPercent * 100) / 100,
  };
}

export function reverseSimulator(
  customPrice: number,
  product: Product,
  variableCosts: VariableCost[],
  fixedCosts: FixedCost[],
  totalProducts: number
): ReverseSimulatorResult {
  const totalFixedCosts = fixedCosts.reduce((sum, cost) => sum + cost.value, 0);
  const fixedCostShare = totalProducts > 0 ? totalFixedCosts / totalProducts : 0;

  const variableCostPercent = variableCosts
    .filter(vc => vc.type === 'percent')
    .reduce((sum, vc) => sum + vc.value, 0);

  const variableCostFixed = variableCosts
    .filter(vc => vc.type === 'fixed')
    .reduce((sum, vc) => sum + vc.value, 0);

  const effectiveCostBase = product.cost_price + fixedCostShare + variableCostFixed;

  const netProfit =
    customPrice -
    product.cost_price -
    fixedCostShare -
    variableCostFixed -
    (customPrice * variableCostPercent) / 100;

  const realMarginPercent = customPrice > 0 ? (netProfit / customPrice) * 100 : 0;

  return {
    fixedCostShare,
    variableCostPercent,
    variableCostFixed,
    effectiveCostBase,
    suggestedSellingPrice: Math.round(customPrice * 100) / 100,
    netProfit: Math.round(netProfit * 100) / 100,
    realMarginPercent: Math.round(realMarginPercent * 100) / 100,
    customPrice,
  };
}

export function getMarginAlert(marginPercent: number): 'danger' | 'warning' | 'success' | null {
  if (marginPercent < 0) return 'danger';
  if (marginPercent < 10) return 'warning';
  if (marginPercent >= 20) return 'success';
  return null;
}

export function formatCurrency(value: number): string {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value);
}

export function formatPercent(value: number): string {
  return `${Math.round(value * 100) / 100}%`;
}
