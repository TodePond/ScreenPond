//=========//
// CORNERS //
//=========//
// a b
// c d
export const makeRectangleCorners = (x, y, width, height) => {
	const a = [x, y]
	const b = [x + width, y]
	const c = [x + width, y + height]
	const d = [x, y + height]
	const corners = [a, b, c, d]
	return corners
}