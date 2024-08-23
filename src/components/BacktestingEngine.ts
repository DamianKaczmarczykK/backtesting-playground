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

export function profit(closePosition: ClosePosition): number {
	return (closePosition.endPrice - closePosition.startPrice) * closePosition.quantity;
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
		startPrice: price,
		quantity: quantity
	});
	account.currentBalance -= positionValue;
}

function closeAllPositions(account: Account, price: Price, timestamp: Timestamp): void {
	for (let openPosition of account.openPositions) {
		const positionValue = (price * openPosition.quantity);
		account.closedPositions.push({
			startDate: openPosition.startDate,
			startPrice: openPosition.startPrice,
			quantity: openPosition.quantity,
			endDate: timestamp,
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

		const strategyResult = strategy(index, marketData);

		if (strategyResult === 0.0) {
			continue;
		} else if (strategyResult > 0) {
			const positionValue = currentCandle.close * strategyResult;
			if (account.openPositions.length > 0) {
				console.warn("[BACKTESTING] There are too many opened positions");
			} else if (positionValue > account.currentBalance) {
				console.warn("[BACKTESTING] Position value bigger than current balance");
			}
			else {
				openPosition(account, currentCandle.close, currentCandle.timestamp, strategyResult);
			}
		} else {
			closeAllPositions(account, currentCandle.close, currentCandle.timestamp);
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
