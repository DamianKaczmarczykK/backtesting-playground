import { TOHLCV } from "./BacktestingEngine";
import btcUsdData from '../../data/BTC-USD-2021-01-01_2022-01-01.json'
import bnbEthData from '../../data/BNB-ETH-2023-01-01_2024-01-01.json'


export function importBtcUsdJson(): TOHLCV[] {
	const result: TOHLCV[] = btcUsdData.map(node => {
		return {
			time: node.Date,
			open: node.Open,
			high: node.High,
			low: node.Low,
			close: node.Close,
			volume: node.Volume
		}
	});
	return result;
}

export function importBnbEthJson(): TOHLCV[] {
	const result: TOHLCV[] = bnbEthData.map(node => {
		return {
			time: node.Date,
			open: node.Open,
			high: node.High,
			low: node.Low,
			close: node.Close,
			volume: node.Volume
		}
	});
	return result;
}
