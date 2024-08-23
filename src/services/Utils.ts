export type ValueOrError<A, B> = [A, B | null]

/**
 * @returns number without zeroes after comma
 * */
export function fixedWithoutTrailingZeroes(num: number | null, precision: number = 16): number {
	return Number.parseFloat(num?.toFixed(precision) || "");
}
