import { bilerp } from "./lerp.js"

//======//
// VIEW //
//======//
export const getViewPosition = (context, canvasPosition) => {
	const {canvas} = context
	const [x, y] = canvasPosition
	const viewPosition = [x / canvas.width, y / canvas.height]
	return viewPosition
}

export const getCanvasPosition = (context, viewPosition) => {
	const {canvas} = context
	const [x, y] = viewPosition
	const canvasPosition = [x * canvas.width, y * canvas.height]
	return canvasPosition
}

export const getCanvasPositions = (context, viewPositions) => {
	const canvasPositions = viewPositions.map(viewPosition => getCanvasPosition(context, viewPosition))
	return canvasPositions
}

export const getRelativePosition = (position, corners) => {
	const relativePosition = bilerp(position, corners)
	return relativePosition
}

export const getRelativePositions = (positions, corners) => {
	const relativePositions = positions.map(position => getRelativePosition(position, corners))
	return relativePositions
}