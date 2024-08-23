type Timestamp = string;
type Price = number;
type Quantity = number;

type Timepoint = { time: Timestamp, value: number }

/**
 * Represents single candle 
 * */
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

/**
 * In other words, long or short position
 * */
export enum PositionType {
	BUY,
	SELL
}

export function closePositionProfitWithoutCommission(closePosition: ClosedPosition): number {
	return positionProfitWithoutCommission(closePosition, closePosition.endPrice);
}

export function positionProfitWithoutCommission(position: OpenPosition | ClosedPosition, endPrice: number): number {
	if (position.type === PositionType.BUY) {
		return (endPrice - position.startPrice) * position.quantity;
	} else {
		return (position.startPrice - endPrice) * position.quantity;
	}
}

/**
 * Keeps track of account balance, positions and provides API to manage them
 * */
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

	public baseByBalancePercentage(percentage: number): number {
		if (percentage <= 0.0) return 0;

		const currentCandle = this.marketData.last(0);
		const maxAvailableQuantity = (this.currentBalance / currentCandle.close);
		// TODO: make sure currentBalance is good value in this case (it changes only when position is opened/closed, not on every candle)
		return maxAvailableQuantity * percentage;
	}

	public marketBuy(quantity: Quantity) {
		if (quantity - Number.EPSILON < 0) return;

		const currentCandle = this.marketData.last(0);
		// OPTIMIZE: calculated double times
		// FIX: correctly calculate margin for position
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
		if (quantity - Number.EPSILON < 0) return;

		const currentCandle = this.marketData.last(0);
		// OPTIMIZE: calculated double times
		// FIX: correctly calculate margin for position
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
		this.currentBalance -= positionValue;
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
			// FIX: correctly calculate commission
			const startPositionValue = (closedPosition.startPrice * closedPosition.quantity);
			const profit = closePositionProfitWithoutCommission(closedPosition) + startPositionValue;
			console.log("[CLOSE]" + startPositionValue)
			this.currentBalance += (profit);
		}
		this.openPositions = [];
	}
}

export interface BacktestingReport {
	baseSymbol: string,
	quoteSymbol: string,
	initialBalance: number,
	equity: number,
	commissionPercentage: number,
	openPositions: OpenPosition[],
	closedPositions: ClosedPosition[],
	equityTimeseries: Timepoint[]
}

/**
 * Human-friendly wrapper for candles array
 * */
export class MarketData {
	private index: number;
	readonly baseSymbol: string;
	readonly quoteSymbol: string;
	private data: TOHLCV[];

	public constructor(data: TOHLCV[], baseSymbol: string = '', quoteSymbol: string = '') {
		this.index = 0;
		this.data = data;
		this.baseSymbol = baseSymbol;
		this.quoteSymbol = quoteSymbol;
	}

	next(): boolean {
		if (this.index >= this.data.length - 1) {
			return false;
		}
		this.index += 1;
		return true;
	}

	public last(index: number): TOHLCV {
		const dataIndex = (this.index - index);
		return this.data[dataIndex];
	}
}

export interface Strategy {
	/**
	 * @returns `context` object which will be used in `onTick(broker, context)` function
	* */
	initStrategy: () => unknown,
	/**
	 * Runs on every price movement - here you define when buy/sell assets
	* */
	onTick: (broker: Broker, context: unknown) => void
}

export const EXAMPLE_STRATEGIES = [
	{
		label: 'Simple buy',
		disabled: false,

		strategy: `// Here you initialize 'context' with indicators and request data before strategy runs
window.initStrategy = () => {
	return {
		// use Indicators object to access some standard TA indicators
		// see 'https://github.com/debut-js/Indicators' to learn, how to use them
		sma: new Indicators.SMA(25) 
	}
}

// Here is the definition of your strategy
// All info about your account and marketData is kept in broker and all your defined indicators are in context
window.onTick = (broker, context) => {
    const currentCandle = broker.marketData.last(0); // get most recent candle
    const sma = context.sma; // retrieve your custom objects from context
    const smaValue = sma.nextValue(currentCandle.close); // calculate SMA value
    
    if (smaValue < 35000.0 && broker.openPositions.length === 0) { // open only 1 position
        const baseValue = broker.baseByBalancePercentage(0.10); // get quantity equal 10% of your available capital
        broker.marketBuy(baseValue); // buy using 10% of your capital
    } else if (smaValue > 56000.0) {
        broker.closeAll(); // close all positions
    }
}`,
	},
	{
		label: 'Simple sell',
		disabled: false,
		strategy: `// Here you initialize 'context' with indicators and request data before strategy runs
window.initStrategy = () => {
	return {
		sma: new Indicators.SMA(25)
	}
}

// Here is the definition of your strategy
// All info about your account and marketData is kept in broker and all your defined indicators are in context
window.onTick = (broker, context) => {
    const currentCandle = broker.marketData.last(0); // get most recent candle
    const sma = context.sma; // retrieve your custom objects from context

    const smaValue = sma.nextValue(currentCandle.close); // calculate SMA value
    if (currentCandle.close > 60000.0) {
        broker.marketSell(0.1); // sell 0.1 quantity - e.g. for pair BTC-USD it's 0.1 BTC
    } else if (currentCandle.close < 30000.0) {
        broker.closeAll(); // close all positions
    }
}`,
	}
];

export const DEFAULT_STRATEGY = EXAMPLE_STRATEGIES[0].strategy;

/**
 * Calculates potential profit of all opened positions without commission
 * */
function calculateCurrentTotalProfit(broker: Broker) {
	const currentCandle = broker.marketData.last(0);
	let currentProfit = 0;
	for (let pos of broker.openPositions) {
		currentProfit += (pos.startPrice * pos.quantity) + positionProfitWithoutCommission(pos, currentCandle.close);
	}

	return {
		time: currentCandle.time,
		value: broker.currentBalance + currentProfit
	}
}

/**
 * Run `strategy` with defined `broker` - after iteration over `marketData` returns backtesting report
 * */
export function runBacktesting(strategy: Strategy, broker: Broker): BacktestingReport {
	console.time("backtesting")

	const equityTimeseries: Timepoint[] = []

	const marketData = broker.marketData;
	const context = strategy.initStrategy();
	do {
		strategy.onTick(broker, context);

		const currentEquity = calculateCurrentTotalProfit(broker);
		equityTimeseries.push(currentEquity);
	} while (marketData.next())

	broker.closeAll();

	console.timeEnd("backtesting")
	return {
		baseSymbol: marketData.baseSymbol,
		quoteSymbol: marketData.quoteSymbol,
		initialBalance: broker.initialBalance,
		equity: broker.currentBalance,
		commissionPercentage: broker.commissionPercentage,
		openPositions: broker.openPositions,
		closedPositions: broker.closedPositions,
		equityTimeseries: equityTimeseries
	}
}
