import { EMA, SMA } from "@debut/indicators";

/**
 * TA indicators that are available in strategy via e.g. `new Indicators.SMA()`
 * */
export const Indicators = {
	Sma: SMA,
	Ema: EMA
}
