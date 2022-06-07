import { addVector, scaleVector } from "./vector.js"
import { rotatePosition } from "./position.js"

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

export const rotateCorners = (corners, angle) => {
	const center = getCornersCenter(corners)
	const rotatedCorners = corners.map(corner => rotatePosition(corner, center, angle))
	return rotatedCorners
}

export const getCornersCenter = (corners) => {
	const sum = corners.reduce((a, b) => addVector(a, b))
	const center = scaleVector(sum, 1/4)
	return center
}

export const moveCorners = (corners, displacement) => {
	const movedCorners = corners.map(corner => addVector(corner, displacement))
	return movedCorners
}