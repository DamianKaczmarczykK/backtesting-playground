import { importBtcUsdJson } from '../src/components/DataImporter';
import { ClosedPosition, Broker, MarketData, PositionType, profitWithoutCommission, runBacktesting } from '../src/components/BacktestingEngine';
import { expect, test } from 'vitest'

const closePosition: ClosedPosition = {
	id: 1,
	startDate: '2020-01-01',
	startPrice: 100,
	endDate: '2020-01-02',
	endPrice: 200,
	quantity: 0.1,
	type: PositionType.BUY
};


test('Profit without commissions hould be 10', () => {
	const actual = profitWithoutCommission(closePosition);
	expect(actual).toBe(10)
})

/////////////////////////////////////////////

test('Run backtesting for 2021-2022 BTC/USD data', () => {
	// given
	const strategy = (broker: Broker) => {
		const currentCandle = broker.marketData.last(0);
		if (currentCandle.close < 30000.0) {
			broker.marketBuy(0.1);
		} else if (currentCandle.close > 60000.0) {
			broker.closeAll();
		}
	};
	const marketData = new MarketData((importBtcUsdJson()));
	const broker = new Broker(marketData, 10_000, 0);

	// when
	const backtestingReport = runBacktesting(strategy, broker);

	// then
	expect(backtestingReport.initialBalance).toBe(10_000);
	expect(backtestingReport.equity.toFixed(2)).toBe("16365.55");
	expect(backtestingReport.closedPositions).toHaveLength(2);
	expect(backtestingReport.openPositions).toHaveLength(0);
})
