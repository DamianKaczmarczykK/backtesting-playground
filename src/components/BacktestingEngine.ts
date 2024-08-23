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

export function runBacktesting(strategy: Strategy, marketData: MarketData, account: FuturesAccount): BacktestingReport {
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
				account.openPosition(currentCandle.close, currentCandle.time, requestedQuantity);
			}
		} else {
			account.closeAllPositions(currentCandle.close, currentCandle.time);
		}
	}

	console.timeEnd("backtesting")
	return {
		initialBalance: account.initialBalance,
		equity: account.currentBalance,
		commissionPercentage: account.commissionPercentage,
		openPositions: account.openPositions,
		closedPositions: account.closedPositions
	};
}
