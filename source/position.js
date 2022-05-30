//==========//
// POSITION //
//==========//
const getCanvasPosition = (context, [x, y]) => {
	return [x * context.canvas.width, y * context.canvas.height]
}

const getViewPosition = (context, [x, y]) => {
	return [x / context.canvas.width, y / context.canvas.height]
}

const getRelativePosition = (corners, [x, y]) => {


}

const getDisplayPosition = (index) => {
	const x = index % DISPLAY_COLUMN_COUNT
	const y = Math.floor(index / DISPLAY_COLUMN_COUNT)
	return [x, y]
}

const getDisplayCorners = (index) => {
	const [x, y] = getDisplayPosition(index)
	const corners = [
		[x*DISPLAY_WIDTH, y*DISPLAY_HEIGHT],
		[(x+1)*DISPLAY_WIDTH, y*DISPLAY_HEIGHT],
		[(x+1)*DISPLAY_WIDTH, (y+1)*DISPLAY_HEIGHT],
		[x*DISPLAY_WIDTH, (y+1)*DISPLAY_HEIGHT],
	]
	return corners
}