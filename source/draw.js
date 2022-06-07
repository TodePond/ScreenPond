import { getCanvasPositions, getRelativePositions } from "./position.js"

//======//
// DRAW //
//======//
export const drawChildren = (context, colour, corners, depth = 100) => {
	if (depth <= 0) return
	for (const child of colour.screens) {
		const relativeCorners = getRelativePositions(child.corners, corners)
		drawBackground(context, child.colour, relativeCorners)
		drawChildren(context, child.colour, relativeCorners, depth-1)
	}
}

export const drawBackground = (context, colour, corners) => {

	const canvasCornerPositions = getCanvasPositions(context, corners)
	const [a, b, c, d] = canvasCornerPositions

	context.beginPath()
	context.moveTo(...a)
	context.lineTo(...b)
	context.lineTo(...d)
	context.lineTo(...c)
	context.closePath()

	context.fillStyle = colour.hex
	context.fill()
}