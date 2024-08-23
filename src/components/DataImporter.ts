import { TOHLCV } from "./BacktestingEngine";
import data from '../../data/BTC-USD-2021-01-01_2022-01-01.json'


export function importFromCsv(): TOHLCV[] {
	const result: TOHLCV[] = data.map(node => {
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
