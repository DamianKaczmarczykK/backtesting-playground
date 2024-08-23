import { ClosePosition, profitWithoutCommission } from '../src/components/BacktestingEngine';
import { expect, test } from 'vitest'

const closePosition: ClosePosition = {
	startDate: '2020-01-01',
	startPrice: 100,
	endDate: '2020-01-02',
	endPrice: 200,
	quantity: 0.1
};


test('profit should be 10', () => {
	const actual = profitWithoutCommission(closePosition);
	expect(actual).toBe(10)
})
