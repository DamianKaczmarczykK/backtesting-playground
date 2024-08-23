import { createStore } from "solid-js/store";
import { DEFAULT_STRATEGY, TOHLCV } from "./BacktestingEngine";
import { importBnbEthJson, importBtcUsdJson } from "./DataImporter";
import { createSignal } from "solid-js";

export interface BacktestingOptions {
	initialBalance: number,
	commissionPercentage: number
}

export const [strategyCode, setStrategyCode] = createStore({ value: DEFAULT_STRATEGY });
export const [backtestingOptions, setBacktestingOptions] = createStore({
	initialBalance: 10_000,
	commissionPercentage: 0.005
});

export interface MarketDataSelection {
	label: string,
	value: TOHLCV[],
	disabled: boolean
}

export const [marketDatas, setMarketDatas] = createSignal<MarketDataSelection[]>([
	{
		label: 'BTC-USD-2021-2022.json',
		value: importBtcUsdJson(),
		disabled: false
	},
	{
		label: 'BNB-ETH-2023-2024.json',
		value: importBnbEthJson(),
		disabled: false
	}
]);

export const [selectedMarketData, setSelectedMarketData] = createSignal<MarketDataSelection>(marketDatas()[1]);
