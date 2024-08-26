import { TOHLCV } from "./BacktestingEngine";
import btcUsdData from '../../data/BTC-USD-2021-01-01_2022-01-01.json'
import { ValueOrError } from "../services/Utils";

/**
 * Detects base and quote names from filename 
 * E.g.: `BTC-USD-2023-2024.csv` -> `['BTC', 'USD']`
 * */
export function detectCurrencySymbols(filename: string): [string, string] {
	if (filename === null || filename === undefined || filename === "") return ['', ''];

	const splitted = filename.split("-");
	if (splitted.length < 2) return ['', '']

	const base = splitted[0];
	const quote = splitted[1].split(".")[0];

	return [base, quote];
}

/**
 * Parses Yahoo Finance market data history format and parses it to list of candles (or retrieves an error)
* */
// TODO: add more checks in the function (for parsing number and column names)
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

/**
 * Helper method for development - import market data from JSON
 * */
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
