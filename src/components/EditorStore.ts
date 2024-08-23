import { createStore } from "solid-js/store";
import { DEFAULT_STRATEGY } from "./BacktestingEngine";

export interface BacktestingOptions {
	initialBalance: number,
	commissionPercentage: number
}

export const [strategyCode, setStrategyCode] = createStore({ value: DEFAULT_STRATEGY });
export const [backtestingOptions, setBacktestingOptions] = createStore({
	initialBalance: 10_000,
	commissionPercentage: 0.005
});
