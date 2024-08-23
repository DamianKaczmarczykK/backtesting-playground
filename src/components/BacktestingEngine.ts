type Timestamp = string;
type Price = number;
type Quantity = number;

export interface TOHLCV {
	timestamp: Timestamp,
	open: Price,
	high: Price,
	low: Price,
	close: Price,
	volume: Quantity
}

export interface OpenPosition {
	startDate: Timestamp,
	startPrice: Price,
	quantity: Quantity
}

export interface ClosePosition extends OpenPosition {
	endDate: Timestamp,
	endPrice: Price
}

export interface Account {
	initialBalance: Quantity,
	currentBalance: Quantity,
	openPositions: OpenPosition[],
	closedPositions: ClosePosition[]
}

function openPosition(account: Account, price: Price, timestamp: Timestamp, quantity: Quantity): void {
	const positionValue = price * quantity;
	account.openPositions.push({
		startDate: timestamp,
		// TODO: add possibility to enter position on open price
		startPrice: price,
		quantity: quantity
	});
	account.currentBalance -= positionValue;
}

function closePosition(account: Account, price: Price, timestamp: Timestamp, openPosition: OpenPosition): void {
	const positionValue = (price * openPosition.quantity);
	account.closedPositions.push({
		startDate: openPosition.startDate,
		startPrice: openPosition.startPrice,
		quantity: openPosition.quantity,
		endDate: timestamp,
		// TODO: add possibility to enter position on open price
		endPrice: price,
	});
	account.currentBalance += positionValue;
}

export interface BacktestingReport extends Account {

}

export interface Strategy {
	(index: number, data: TOHLCV[]): Quantity
}

export function runStrategy(strategy: Strategy, data: TOHLCV[], account: Account): BacktestingReport {
	console.time("backtesting")
	for (let index = 0; index < data.length; index++) {
		const currentCandle = data[index];

		const strategyResult = strategy(index, data);

		if (strategyResult === 0.0) {
			continue;
		} else if (strategyResult > 0) {
			if (account.openPositions.length > 0) {
				console.warn("There are too many opened positions")
			} else {
				openPosition(account, currentCandle.close, currentCandle.timestamp, strategyResult);
			}
		} else {
			for (let openPosition of account.openPositions) {
				closePosition(account, currentCandle.close, currentCandle.timestamp, openPosition);
			}
			account.openPositions = [];
		}
	}

	console.timeEnd("backtesting")
	return {
		initialBalance: account.initialBalance,
		currentBalance: account.currentBalance,
		openPositions: account.openPositions,
		closedPositions: account.closedPositions
	};
}
