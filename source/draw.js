import { getCanvasPositions, getRelativePositions } from "./position.js"
import { getCornersPerimeter } from "./corners.js"

//======//
// DRAW //
//======//
export const drawChildren = (context, colour, corners, depth = 5) => {
	for (const child of colour.screens) {
		const relativeCorners = getRelativePositions(child.corners, corners)

		if (depth <= 0) {
			const perimeter = getCornersPerimeter(relativeCorners)
			if (perimeter < 0.01) {
				fillBackground(context, child.colour, relativeCorners)
				return
			}
		}

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

	
	context.fillStyle = Colour.Black
	context.fill()
	
	context.strokeStyle = colour.hex
	context.stroke()
}

export const fillBackground = (context, colour, corners) => {

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