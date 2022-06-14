import { bilerp, ibilerp } from "./lerp.js"

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

export const getMappedPosition = (position, corners) => {
	const mappedPosition = ibilerp(position, corners)
	return mappedPosition
}

export const getMappedPositions = (positions, corners) => {
	const mappedPositions = positions.map(position => getMappedPosition(position, corners))
	return mappedPositions
}

export const rotatePosition = (position, origin, angle) => {

	const [px, py] = position
	const [ox, oy] = origin

	const cos = Math.cos(angle)
	const sin = Math.sin(angle)
	const dy = py - oy
	const dx = px - ox

	const x = dx*cos + dy*sin + ox
	const y = dy*cos - dx*sin + oy
	return [x, y]

}

export const isPositionInCorners = (position, corners) => {
	const relativePosition = getMappedPosition(position, corners)
	for (const axis of relativePosition) {
		if (axis > 1.0 || axis < 0.0) return false
	}
	return true
}

export const arePositionsInCorners = (positions, corners) => {
	const positionsAreInCorners = positions.every(position => isPositionInCorners)
	return positionsAreInCorners
}