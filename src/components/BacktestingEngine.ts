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

export interface ClosedPosition extends OpenPosition {
	endDate: Timestamp,
	endPrice: Price
}

export function profitWithoutCommission(closePosition: ClosedPosition): number {
	return (closePosition.endPrice - closePosition.startPrice) * closePosition.quantity;
}

export class FuturesAccount {
	initialBalance: Quantity;
	currentBalance: Quantity;
	commissionPercentage: number;
	openPositions: OpenPosition[];
	closedPositions: ClosedPosition[];

	constructor(initialBalance: Quantity, commissionPercentage: number) {
		this.initialBalance = initialBalance;
		this.currentBalance = initialBalance;
		this.commissionPercentage = commissionPercentage;
		this.openPositions = [];
		this.closedPositions = [];
	}

	openPosition(price: Price, time: Timestamp, quantity: Quantity): void {
		this.openPositions.push({
			startDate: time,
			startPrice: price,
			quantity: quantity
		});
		const positionValue = price * quantity;
		// FIX: correctly calculate commission
		const commissionValue = positionValue * this.commissionPercentage;
		this.currentBalance -= (positionValue + commissionValue);
	}

	closeAllPositions(price: Price, time: Timestamp): void {
		for (let openPosition of this.openPositions) {
			this.closedPositions.push({
				startDate: openPosition.startDate,
				startPrice: openPosition.startPrice,
				quantity: openPosition.quantity,
				endDate: time,
				endPrice: price,
			});
			const positionValue = (price * openPosition.quantity);
			// FIX: correctly calculate commission
			const commissionValue = positionValue * this.commissionPercentage;
			this.currentBalance += (positionValue - commissionValue);
		}
		this.openPositions = [];
	}
}

export interface BacktestingReport {
	initialBalance: number,
	equity: number,
	commissionPercentage: number,
	openPositions: OpenPosition[],
	closedPositions: ClosedPosition[]
}

export class MarketData {
	private index: number;
	private data: TOHLCV[];

	public constructor(data: TOHLCV[]) {
		this.index = 0;
		this.data = data;
	}

	next() {
		if (this.index + 1 >= this.data.length) {
			return { value: this.data[this.index], done: true };
		}
		const result = { value: this.data[this.index], done: false };
		this.index += 1;
		return result;
	}

	public last(index: number): TOHLCV {
		const dataIndex = (this.index - index);
		return this.data[dataIndex];
	}
}

export interface Strategy {
	(marketData: MarketData): Quantity
}

export const DEFAULT_STRATEGY = "window['strategy'] = (marketData) => {\n\
    const currentCandle = marketData.last(0);\n\
    if (currentCandle.close < 30000.0) {\n\
        return 0.1;\n\
    } else if (currentCandle.close > 60000.0) {\n\
        return -0.1;\n\
    }\n\
    return 0.0;\n\
};"

export function runBacktesting(strategy: Strategy, marketData: MarketData, account: FuturesAccount): BacktestingReport {
	console.time("backtesting")

	let iterator;
	do {
		const requestedQuantity = strategy(marketData);
		const currentCandle = marketData.last(0);

		if (requestedQuantity === 0.0) {
			// NOTE: do nothing
		} else if (requestedQuantity > 0) {
			// NOTE: open BUY position
			const positionValue = currentCandle.close * requestedQuantity;
			if (account.openPositions.length > 0) {
				console.warn("[BACKTESTING] There are too many opened positions");
			} else if (positionValue > account.currentBalance) {
				console.warn("[BACKTESTING] Position value bigger than current balance");
			}
			else {
				account.openPosition(currentCandle.close, currentCandle.time, requestedQuantity);
			}
		} else {
			// NOTE: close all positions
			account.closeAllPositions(currentCandle.close, currentCandle.time);
		}

		iterator = marketData.next();
	} while (!iterator.done)

	console.timeEnd("backtesting")
	return {
		initialBalance: account.initialBalance,
		equity: account.currentBalance,
		commissionPercentage: account.commissionPercentage,
		openPositions: account.openPositions,
		closedPositions: account.closedPositions
	};
}
