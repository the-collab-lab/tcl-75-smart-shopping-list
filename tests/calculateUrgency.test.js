import { vi } from 'vitest';
import {
	calculateUrgency,
	getDateLastPurchasedOrDateCreated,
	getDaysFromDate,
	getDaysBetweenDates,
} from '../src/utils';

const item = {
	dateLastPurchased: new Date(),
	dateCreated: new Date(),
	dateNextPurchased: { toDate: () => new Date() },
};

describe('calculateUrgency', () => {
	beforeEach(() => {
		vi.mock('../src/utils/dates', () => ({
			getDateLastPurchasedOrDateCreated: vi.fn(),
			getDaysFromDate: vi.fn(),
			getDaysBetweenDates: vi.fn(),
		}));
	});

	test('returns "inactive" if more than 60 days have passed since last purchase', () => {
		getDateLastPurchasedOrDateCreated.mockReturnValue(new Date());
		getDaysFromDate.mockReturnValue(65);
		getDaysBetweenDates.mockReturnValue(10);

		const urgency = calculateUrgency(item);
		expect(urgency).toBe('inactive');
	});

	test('returns "soon" if daysUntilNextPurchase is less than 7', () => {
		getDateLastPurchasedOrDateCreated.mockReturnValue(new Date());
		getDaysFromDate.mockReturnValue(10);
		getDaysBetweenDates.mockReturnValue(5);

		const urgency = calculateUrgency(item);
		expect(urgency).toBe('soon');
	});

	test('returns "kindOfSoon" if daysUntilNextPurchase is between 7 and 30', () => {
		getDateLastPurchasedOrDateCreated.mockReturnValue(new Date());
		getDaysFromDate.mockReturnValue(10);
		getDaysBetweenDates.mockReturnValue(15);

		const urgency = calculateUrgency(item);
		expect(urgency).toBe('kindOfSoon');
	});

	test('returns "notSoon" if daysUntilNextPurchase is more than 30', () => {
		getDateLastPurchasedOrDateCreated.mockReturnValue(new Date());
		getDaysFromDate.mockReturnValue(10);
		getDaysBetweenDates.mockReturnValue(40);

		const urgency = calculateUrgency(item);
		expect(urgency).toBe('notSoon');
	});

	test('returns "overdue" if daysUntilNextPurchase is negative', () => {
		getDateLastPurchasedOrDateCreated.mockReturnValue(new Date());
		getDaysFromDate.mockReturnValue(10);
		getDaysBetweenDates.mockReturnValue(-1);

		const urgency = calculateUrgency(item);
		expect(urgency).toBe('overdue');
	});
});
