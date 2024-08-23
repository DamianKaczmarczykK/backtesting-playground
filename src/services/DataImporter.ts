import { TOHLCV } from "./BacktestingEngine";
import btcUsdData from '../../data/BTC-USD-2021-01-01_2022-01-01.json'
import bnbEthData from '../../data/BNB-ETH-2023-01-01_2024-01-01.json'
import { ValueOrError } from "../services/Utils";

export function detectCurrencySymbols(filename: string): [string, string] {
	if (filename === null || filename === undefined || filename === "") return ['', ''];

	const splitted = filename.split("-");
	if (splitted.length < 2) return ['', '']

	return [splitted[0], splitted[1]]
}

export function parseYahooCsv(csvString: string, hasHeader: boolean = true, delimiter: string = ","): ValueOrError<TOHLCV[], Error> {
	let rows = csvString.split('\n').filter(row => row.trimEnd() !== "");
	let result = [];
	if (hasHeader) {
		rows.shift();
	}
	for (const [i, row] of rows.entries()) {
		const columns = row.split(delimiter);
		if (columns.length !== 7) {
			return [null!, Error(`ParseError [line ${i + 1}] Wrong column numbers in row: ${row}`)];
		}
		const candle = {
			time: columns[0],
			open: Number.parseFloat(columns[1]),
			high: Number.parseFloat(columns[2]),
			low: Number.parseFloat(columns[3]),
			close: Number.parseFloat(columns[4]),
			volume: Number.parseFloat(columns[6]),
		};
		result.push(candle);
	}
	return [result, null];
}

export function importFromJson(json: any): TOHLCV[] {
	const result: TOHLCV[] = json.map(node => {
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

export function importBtcUsdJson(): TOHLCV[] {
	return importFromJson(btcUsdData);
}

export function importBnbEthJson(): TOHLCV[] {
	return importFromJson(bnbEthData);
}