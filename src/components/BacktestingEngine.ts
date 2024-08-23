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
	id: number,
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
	if (closePosition.type === PositionType.BUY) {
		return (closePosition.endPrice - closePosition.startPrice) * closePosition.quantity;
	} else {
		return (closePosition.startPrice - closePosition.endPrice) * closePosition.quantity;
	}
}

export class Broker {
	private idSequence: number;
	marketData: MarketData;

	initialBalance: Quantity;
	currentBalance: Quantity;
	commissionPercentage: number;
	openPositions: OpenPosition[];
	closedPositions: ClosedPosition[];

	constructor(marketData: MarketData, initialBalance: Quantity, commissionPercentage: number) {
		this.idSequence = 1;
		this.marketData = marketData;
		this.initialBalance = initialBalance;
		this.currentBalance = initialBalance;
		this.commissionPercentage = commissionPercentage;
		this.openPositions = [];
		this.closedPositions = [];
	}

	public marketBuy(quantity: Quantity) {
		const currentCandle = this.marketData.last(0);
		// OPTIMIZE: calculated double times
		const positionValue = currentCandle.close * quantity;
		// TODO: check what margin is sufficient
		if (positionValue > this.currentBalance) {
			console.warn("[BACKTESTING] Position value bigger than current balance");
		} else {
			this.openPosition(PositionType.BUY, currentCandle.close, currentCandle.time, quantity);
		}
	}

	// TODO: add guards
	public marketSell(quantity: Quantity) {
		const currentCandle = this.marketData.last(0);
		// OPTIMIZE: calculated double times
		const positionValue = currentCandle.close * quantity;
		// TODO: check what margin is sufficient
		if (positionValue > this.currentBalance) {
			console.warn("[BACKTESTING] Position value bigger than current balance");
		} else {
			this.openPosition(PositionType.SELL, currentCandle.close, currentCandle.time, quantity);
		}
	}

	public closeAll() {
		const currentCandle = this.marketData.last(0);
		this.closeAllPositions(currentCandle.close, currentCandle.time);
	}

	openPosition(type: PositionType, price: Price, time: Timestamp, quantity: Quantity): void {
		this.openPositions.push({
			id: this.idSequence,
			startDate: time,
			startPrice: price,
			quantity: quantity,
			type: type
		});
		const positionValue = price * quantity;
		console.log("[OPEN]" + positionValue)
		// FIX: correctly calculate commission
		const commissionValue = 0
		this.currentBalance -= (positionValue + commissionValue);
		this.idSequence += 1;
	}

	closeAllPositions(price: Price, time: Timestamp): void {
		for (let openPosition of this.openPositions) {
			const closedPosition = {
				id: openPosition.id,
				startDate: openPosition.startDate,
				startPrice: openPosition.startPrice,
				quantity: openPosition.quantity,
				type: openPosition.type,
				endDate: time,
				endPrice: price,
			};
			this.closedPositions.push(closedPosition);
			const positionValue = (price * openPosition.quantity);
			// FIX: correctly calculate commission
			const commissionValue = 0;
			const startPositionValue = (closedPosition.startPrice * closedPosition.quantity);
			// TODO: check if it works for BUY
			const profit = profitWithoutCommission(closedPosition) + startPositionValue;
			console.log("[CLOSE]" + startPositionValue)
			console.log(profit)
			this.currentBalance += (profit - commissionValue);
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

export const EXAMPLE_STRATEGIES = [
	{
		label: 'Simple buy',
		disabled: false,

		strategy: "window['strategy'] = (broker) => {\n\
    const currentCandle = broker.marketData.last(0);\n\
    if (currentCandle.close < 30000.0) {\n\
        broker.marketBuy(0.1);\n\
    } else if (currentCandle.close > 60000.0) {\n\
        broker.closeAll();\n\
    }\n\
};",
	},
	{
		label: 'Simple sell',
		disabled: false,
		strategy: "window['strategy'] = (broker) => {\n\
    const currentCandle = broker.marketData.last(0);\n\
    if (currentCandle.close < 30000.0) {\n\
        broker.closeAll();\n\
    } else if (currentCandle.close > 60000.0) {\n\
        broker.marketSell(0.1);\n\
    }\n\
};"
	}
];

export const DEFAULT_STRATEGY = EXAMPLE_STRATEGIES[0].strategy;

export function runBacktesting(strategy: Strategy, broker: Broker): BacktestingReport {
	console.time("backtesting")

	let iterator;
	const marketData = broker.marketData;
	do {
		strategy(broker);
		iterator = marketData.next();
	} while (!iterator.done)

	broker.closeAll();

	console.timeEnd("backtesting")
	return {
		initialBalance: broker.initialBalance,
		equity: broker.currentBalance,
		commissionPercentage: broker.commissionPercentage,
		openPositions: broker.openPositions,
		closedPositions: broker.closedPositions
	};
}
