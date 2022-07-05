//========//
// NUMBER //
//========//
export const wrap = (number, min, max) => {
	if (number < min) return min
	if (number > max) return max
	return number
}