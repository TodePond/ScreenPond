import { getCanvasPositions } from "./position.js"

//======//
// DRAW //
//======//
export const drawScreen = (context, screen) => {
	const {colour, corners} = screen
	drawColour(context, colour, corners)
}

export const drawColour = (context, colour, corners) => {

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