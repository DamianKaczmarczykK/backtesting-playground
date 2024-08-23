type Timestamp = string;
type Price = number;
type Quantity = number;

export interface TOHLCV {
	time: Timestamp,
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

export function profit(closePosition: ClosePosition): number {
	return (closePosition.endPrice - closePosition.startPrice) * closePosition.quantity;
}

export interface Account {
	initialBalance: Quantity,
	currentBalance: Quantity,
	// ISSUE: currently unsupported
	commission: number,
	openPositions: OpenPosition[],
	closedPositions: ClosePosition[]
}

function openPosition(account: Account, price: Price, time: Timestamp, quantity: Quantity): void {
	account.openPositions.push({
		startDate: time,
		startPrice: price,
		quantity: quantity
	});
	const positionValue = price * quantity;
	account.currentBalance -= positionValue;
}

function closeAllPositions(account: Account, price: Price, time: Timestamp): void {
	for (let openPosition of account.openPositions) {
		const positionValue = (price * openPosition.quantity);
		account.closedPositions.push({
			startDate: openPosition.startDate,
			startPrice: openPosition.startPrice,
			quantity: openPosition.quantity,
			endDate: time,
			endPrice: price,
		});
		account.currentBalance += positionValue;
	}
	account.openPositions = [];
}

export interface BacktestingReport extends Account { }

export class MarketData {
	data: TOHLCV[];

	public constructor(data: TOHLCV[]) {
		this.data = data;
	}

	public at(index: number): TOHLCV {
		return this.data[index];
	}

	public length(): number {
		return this.data.length;
	}
}

export interface Strategy {
	(index: number, marketData: MarketData): Quantity
}

export const DEFAULT_STRATEGY = "window['strategy'] = (index, marketData) => {\n\
    const currentCandle = marketData.at(index);\n\
    if (currentCandle.close < 30000.0) {\n\
        return 0.1;\n\
    } else if (currentCandle.close > 60000.0) {\n\
        return -0.1;\n\
    }\n\
    return 0.0;\n\
};"

export function runBacktesting(strategy: Strategy, marketData: MarketData, account: Account): BacktestingReport {
	console.time("backtesting")
	const length = marketData.length();

	for (let index = 0; index < length; index++) {
		const currentCandle = marketData.at(index);
		const requestedQuantity = strategy(index, marketData);

		if (requestedQuantity === 0.0) {
			continue;
		} else if (requestedQuantity > 0) {
			const positionValue = currentCandle.close * requestedQuantity;
			if (account.openPositions.length > 0) {
				console.warn("[BACKTESTING] There are too many opened positions");
			} else if (positionValue > account.currentBalance) {
				console.warn("[BACKTESTING] Position value bigger than current balance");
			}
			else {
				openPosition(account, currentCandle.close, currentCandle.time, requestedQuantity);
			}
		} else {
			closeAllPositions(account, currentCandle.close, currentCandle.time);
		}
	}

	console.timeEnd("backtesting")
	return {
		initialBalance: account.initialBalance,
		currentBalance: account.currentBalance,
		commission: account.commission,
		openPositions: account.openPositions,
		closedPositions: account.closedPositions
	};
}
