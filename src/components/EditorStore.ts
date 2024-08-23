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
	valueSymbol: string,
	baseSymbol: string,
	value: TOHLCV[],
	disabled: boolean
}

export const [marketDatas, setMarketDatas] = createSignal<MarketDataSelection[]>([
	{
		label: 'BTC-USD-2021-2022.json',
		valueSymbol: 'BTC',
		baseSymbol: 'USD',
		value: importBtcUsdJson(),
		disabled: false
	},
	// {
	// 	label: 'BNB-ETH-2023-2024.json',
	// 	valueSymbol: 'BNB',
	// 	baseSymbol: 'ETH',
	// 	value: importBnbEthJson(),
	// 	disabled: false
	// }
]);

export const addMarketData = (marketDataSelection: MarketDataSelection) => {
	setMarketDatas(marketDatas => [...marketDatas, marketDataSelection]);
};

export const [selectedMarketData, setSelectedMarketData] = createSignal<MarketDataSelection>(marketDatas()[0]);
