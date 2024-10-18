import { describe, it, expect } from 'vitest';
import { sortByUrgency } from '../src/utils/urgencyUtils';

describe('sortByUrgency', () => {
	it('should return "overdue" if daysUntilNextPurchase is less than 0', () => {
		const item = { name: 'Milk' };
		const daysUntilNextPurchase = -1;
		const result = sortByUrgency(item, daysUntilNextPurchase);
		expect(result).toBe('overdue');
	});

	it('should return "soon" if daysUntilNextPurchase is less than 7 and non-negative', () => {
		const item = { name: 'Cheese' };
		const daysUntilNextPurchase = 3;
		const result = sortByUrgency(item, daysUntilNextPurchase);
		expect(result).toBe('soon');
	});

	it('should return "kindOfSoon" if daysUntilNextPurchase is between 7 and 30', () => {
		const item = { name: 'Jam' };
		const daysUntilNextPurchase = 15;
		const result = sortByUrgency(item, daysUntilNextPurchase);
		expect(result).toBe('kindOfSoon');
	});

	it('should return "notSoon" if daysUntilNextPurchase is 30 or more', () => {
		const item = { name: 'Nutella' };
		const daysUntilNextPurchase = 30;
		const result = sortByUrgency(item, daysUntilNextPurchase);
		expect(result).toBe('notSoon');
	});

	it('should throw an error if daysUntilNextPurchase cannot be classified', () => {
		const item = { name: 'Coffee' };
		const daysUntilNextPurchase = NaN;
		expect(() => sortByUrgency(item, daysUntilNextPurchase)).toThrowError(
			`Failed to place [${item.name}]`,
		);
	});
});
