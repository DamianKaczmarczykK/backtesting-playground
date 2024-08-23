export type ValueOrError<A, B> = [A, B | null]

export function fixedWithoutTrailingZeroes(num: number | null, precision: number = 16): number {
	return Number.parseFloat(num?.toFixed(precision) || "");
}
