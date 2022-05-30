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