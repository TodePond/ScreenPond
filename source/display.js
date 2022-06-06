//=========//
// DISPLAY //
//=========//
export const getDisplayArrangementPosition = (display, arrangement) => {
	const x = display % arrangement.columnCount
	const y = Math.floor(display / arrangement.columnCount)
	return [x, y]
}

export const getDisplayCorners = (display, arrangement) => {
	const [x, y] = getDisplayArrangementPosition(display, arrangement)
	const corners = [
		[x * arrangement.width, y * arrangement.height],
		[(x+1) * arrangement.width, y * arrangement.height],
		[(x+1) * arrangement.width, (y+1) * arrangement.height],
		[x * arrangement.width, (y+1) * arrangement.height],
	]
	return corners
}