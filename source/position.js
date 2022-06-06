//==========//
// POSITION //
//==========//
export const getCanvasPosition = (context, [x, y]) => {
	return [x * context.canvas.width, y * context.canvas.height]
}

export const getViewPosition = (context, [x, y]) => {
	return [x / context.canvas.width, y / context.canvas.height]
}

export const getRelativePosition = (corners, [x, y]) => {

}