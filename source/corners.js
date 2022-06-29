import { addVector, scaleVector, distanceBetweenVectors, subtractVector } from "./vector.js"
import { getRotatedPosition } from "./position.js"

//=========//
// CORNERS //
//=========//
// a b
// c d
export const makeRectangleCorners = (x, y, width, height) => {
	const a = [x, y]
	const b = [x + width, y]
	const c = [x, y + height]
	const d = [x + width, y + height]
	const corners = [a, b, c, d]
	return corners
}

export const VIEW_CORNERS = makeRectangleCorners(0, 0, 1, 1)

export const getRotatedCorners = (corners, angle) => {
	const center = getCornersCenter(corners)
	const rotatedCorners = corners.map(corner => getRotatedPosition(corner, center, angle))
	return rotatedCorners
}

export const getCornersCenter = (corners) => {
	const sum = corners.reduce((a, b) => addVector(a, b))
	const center = scaleVector(sum, 1/4)
	return center
}

export const getMovedCorners = (corners, displacement) => {
	const movedCorners = corners.map(corner => addVector(corner, displacement))
	return movedCorners
}

export const getPositionedCorners = (corners, position) => {
	const [a] = corners
	const displacement = subtractVector(position, a)
	const movedCorners = getMovedCorners(corners, displacement)
	return movedCorners
}

export const getCornersPerimeter = (corners) => {
	const [a, b, c, d] = corners
	const ab = distanceBetweenVectors(a, b)
	const bd = distanceBetweenVectors(b, d)
	const dc = distanceBetweenVectors(d, c)
	const ca = distanceBetweenVectors(c, a)
	const perimeter = ab + bd + dc + ca
	return perimeter
}

export const getZeroedCorners = (corners) => {
	const [a] = corners
	const [ax, ay] = a
	const zeroedCorners = corners.map(([x, y]) => [x-ax, y-ay])
	return zeroedCorners
}

export const getCornersPosition = (corners) => {
	const [a] = corners
	const position = [...a]
	return position
}
