//======//
// VIEW //
//======//
export const getCanvasPosition = (context, [x, y]) => {
	const {canvas} = context
	const canvasPosition = [x * canvas.width, y * canvas.height]
	return canvasPosition
}

export const getViewPosition = (context, [x, y]) => {
	const {canvas} = context
	const viewPosition = [x / canvas.width, y / canvas.height]
	return viewPosition
}

export const getCanvasCorners = (context, corners) => {
	const canvasCorners = corners.map(corner => getCanvasPosition(context, corner))
	return canvasCorners
}