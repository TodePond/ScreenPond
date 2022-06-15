import { bilerp, ibilerp } from "./lerp.js"
import { PART_TYPE, makePart } from "./part.js"

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
	return mappedPosition.map(axis => isNaN(axis)? 0 : axis)
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

export const isPositionInCorners = (position, corners, pity = [0, 0]) => {
	const mappedPosition = getMappedPosition(position, corners)
	return isMappedPositionInCorners(mappedPosition, pity)
}

export const isMappedPositionInCorners = (position, pity = [0, 0]) => {
	const [x, y] = position
	const [px, py] = pity
	if (x <= 0.0-px) return false
	if (x >= 1.0+px) return false
	if (y <= 0.0-py) return false
	if (y >= 1.0+py) return false
	return true
}

// Corners
// 0 1
// 2 3
//
// Edges
//  0
// 1 2
//  3
export const getMappedPositionPart = (position, pity = [0, 0]) => {
	const [x, y] = position
	const [px, py] = pity

	if (x <= 0.0-px) return makePart(PART_TYPE.OUTSIDE)
	if (x >= 1.0+px) return makePart(PART_TYPE.OUTSIDE)
	if (y <= 0.0-py) return makePart(PART_TYPE.OUTSIDE)
	if (y >= 1.0+py) return makePart(PART_TYPE.OUTSIDE)

	// Left Edge
	if (x <= 0.0+px) {
		if (y <= 0.0+py) return makePart(PART_TYPE.CORNER, 0)
		if (y >= 1.0-py) return makePart(PART_TYPE.CORNER, 2)
		return makePart(PART_TYPE.EDGE, 1)
	}
	
	// Right Edge
	if (x >= 1.0-px) {
		if (y <= 0.0+py) return makePart(PART_TYPE.CORNER, 1)
		if (y >= 1.0-py) return makePart(PART_TYPE.CORNER, 3)
		return makePart(PART_TYPE.EDGE, 2)
	}
	
	// Top + Bottom Edges
	if (y <= 0.0+py) return makePart(PART_TYPE.EDGE, 0)
	if (y >= 1.0-py) return makePart(PART_TYPE.EDGE, 3)

	return makePart(PART_TYPE.INSIDE)
}