import { BollingerBands, EMA, RSI, SMA, Stochastic } from "@debut/indicators";

/**
 * TA indicators that are available in strategy via e.g. `new Indicators.SMA()`
 * */
export const Indicators = {
	SMA: SMA,
	EMA: EMA,
	Stochastic: Stochastic,
	BollingerBands: BollingerBands,
	RSI: RSI
}
