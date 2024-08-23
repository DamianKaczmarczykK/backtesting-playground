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
	quantity: Quantity,
	type: PositionType
}

export interface ClosedPosition extends OpenPosition {
	endDate: Timestamp,
	endPrice: Price
}

export enum PositionType {
	BUY,
	SELL
}

export function profitWithoutCommission(closePosition: ClosedPosition): number {
	return (closePosition.endPrice - closePosition.startPrice) * closePosition.quantity;
}

export class Broker {
	marketData: MarketData;

	initialBalance: Quantity;
	currentBalance: Quantity;
	commissionPercentage: number;
	openPositions: OpenPosition[];
	closedPositions: ClosedPosition[];

	constructor(marketData: MarketData, initialBalance: Quantity, commissionPercentage: number) {
		this.marketData = marketData;
		this.initialBalance = initialBalance;
		this.currentBalance = initialBalance;
		this.commissionPercentage = commissionPercentage;
		this.openPositions = [];
		this.closedPositions = [];
	}

	public buy(quantity: Quantity) {
		const currentCandle = this.marketData.last(0);
		const positionValue = currentCandle.close * quantity;
		if (this.openPositions.length > 0) {
			console.warn("[BACKTESTING] There are too many opened positions");
		} else if (positionValue > this.currentBalance) {
			console.warn("[BACKTESTING] Position value bigger than current balance");
		}
		else {
			this.openPosition(PositionType.BUY, currentCandle.close, currentCandle.time, quantity);
		}
	}

	// TODO: add guards
	public sell(quantity: Quantity) {
		const currentCandle = this.marketData.last(0);
		this.openPosition(PositionType.SELL, currentCandle.close, currentCandle.time, quantity);
	}

	public closeAll() {
		const currentCandle = this.marketData.last(0);
		this.closeAllPositions(currentCandle.close, currentCandle.time);
	}

	openPosition(type: PositionType, price: Price, time: Timestamp, quantity: Quantity): void {
		this.openPositions.push({
			startDate: time,
			startPrice: price,
			quantity: quantity,
			type: type
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
				type: openPosition.type,
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
	(broker: Broker): void
}

export const DEFAULT_STRATEGY = "window['strategy'] = (broker) => {\n\
    const currentCandle = broker.marketData.last(0);\n\
    if (currentCandle.close < 30000.0) {\n\
        broker.buy(0.1);\n\
    } else if (currentCandle.close > 60000.0) {\n\
        broker.closeAll();\n\
    }\n\
};"

export function runBacktesting(strategy: Strategy, broker: Broker): BacktestingReport {
	console.time("backtesting")

	let iterator;
	const marketData = broker.marketData;
	do {
		strategy(broker);
		iterator = marketData.next();
	} while (!iterator.done)

	console.timeEnd("backtesting")
	return {
		initialBalance: broker.initialBalance,
		equity: broker.currentBalance,
		commissionPercentage: broker.commissionPercentage,
		openPositions: broker.openPositions,
		closedPositions: broker.closedPositions
	};
}
