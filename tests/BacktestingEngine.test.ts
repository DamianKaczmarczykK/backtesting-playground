import { importFromCsv } from '../src/components/DataImporter';
import { ClosedPosition, FuturesAccount, MarketData, profitWithoutCommission, runBacktesting } from '../src/components/BacktestingEngine';
import { expect, test } from 'vitest'

const closePosition: ClosedPosition = {
	startDate: '2020-01-01',
	startPrice: 100,
	endDate: '2020-01-02',
	endPrice: 200,
	quantity: 0.1
};


test('Profit without commissions hould be 10', () => {
	const actual = profitWithoutCommission(closePosition);
	expect(actual).toBe(10)
})

/////////////////////////////////////////////

test('Run backtesting for 2021-2022 BTC/USD data', () => {
	// given
	const strategy = (marketData: MarketData) => {
		const currentCandle = marketData.last(0);
		if (currentCandle.close < 30000.0) {
			return 0.1;
		} else if (currentCandle.close > 60000.0) {
			return -0.1;
		}
		return 0.0;
	};
	const marketData = new MarketData((importFromCsv()));
	const account = new FuturesAccount(10_000, 0);

	// when
	const backtestingReport = runBacktesting(strategy, marketData, account);

	// then
	expect(backtestingReport.initialBalance).toBe(10_000);
	expect(backtestingReport.equity.toFixed(2)).toBe("16365.55");
	expect(backtestingReport.closedPositions).toHaveLength(2);
	expect(backtestingReport.openPositions).toHaveLength(0);
})
