//=========//
// CORNERS //
//=========//
// a b
// c d
export const makeRectangle = (x, y, width, height) => {
	const a = [x, y]
	const b = [x + width, y]
	const c = [x, y + height]
	const d = [x + width, y + height]
	const corners = [a, b, c, d]
	return corners
}