import { describe, it, expect } from 'vitest';
import { getAveragePurchaseInterval } from '../src/utils/dates';

describe('getAveragePurchaseInterval function', () => {
	it('correctly calculates average purchase intervals', () => {
		const purchaseIntervals = {
			lastEstimatedInterval: 4,
			daysSinceLastPurchase: 6,
		};
		const estimatedDaysUntilPurchase = 5;
		const result = getAveragePurchaseInterval(
			purchaseIntervals,
			estimatedDaysUntilPurchase,
		);
		expect(result).toBe(5);
	});

	it('handles zero values in the intervals', () => {
		const purchaseIntervals = {
			lastEstimatedInterval: 0,
			daysSinceLastPurchase: 6,
		};
		const estimatedDaysUntilPurchase = 5;

		const result = getAveragePurchaseInterval(
			purchaseIntervals,
			estimatedDaysUntilPurchase,
		);

		expect(result).toBeCloseTo(3.67, 2);
	});

	it('returns 0 when all intervals are zero', () => {
		const purchaseIntervals = {
			lastEstimatedInterval: 0,
			daysSinceLastPurchase: 0,
		};
		const estimatedDaysUntilPurchase = 0;

		const result = getAveragePurchaseInterval(
			purchaseIntervals,
			estimatedDaysUntilPurchase,
		);

		expect(result).toBe(0);
	});
});
