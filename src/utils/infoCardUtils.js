export const describeAveragePurchaseInterval = (averageInterval) => {
	if (averageInterval > 1) {
		return `On average, this item is purchased every ${averageInterval} days`;
	} else if (1 >= averageInterval) {
		return 'On average, this item is purchased every day';
	} else {
		return 'No average purchase interval available yet';
	}
};
