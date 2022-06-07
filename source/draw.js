import { getCanvasPositions, getRelativePositions } from "./position.js"

//======//
// DRAW //
//======//
export const drawScreenBackground = (context, screen) => {
	const {colour, corners} = screen
	drawColourBackground(context, colour, corners)
}

export const drawScreenChildren = (context, screen) => {
	for (const child of screen.colour.screens) {
		const {colour} = child
		const corners = getRelativePositions(child.corners, screen.corners)
		drawColourBackground(context, colour, corners)
	}
}

export const drawColourBackground = (context, colour, corners) => {

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