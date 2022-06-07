import { getCanvasPositions, getRelativePositions } from "./position.js"

//======//
// DRAW //
//======//
export const drawChildren = (context, colour, corners) => {
	for (const child of colour.screens) {
		const relativeCorners = getRelativePositions(child.corners, corners)
		drawBackground(context, child.colour, relativeCorners)
		drawChildren(context, child.colour, relativeCorners)
	}
}

export const drawBackground = (context, colour, corners) => {

	const canvasCornerPositions = getCanvasPositions(context, corners)
	const [head, ...tail] = canvasCornerPositions

	context.beginPath()
	context.moveTo(...head)
	for (const corner of tail) {
		context.lineTo(...corner)
	}
	context.closePath()

	context.fillStyle = colour.hex
	context.fill()
}