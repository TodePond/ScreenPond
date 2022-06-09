import {getCanvasPositions, getRelativePositions} from "./position.js"
import {getCornersPerimeter} from "./corners.js"
import {makeScreen} from "./screen.js"

//======//
// DRAW //
//======//
// This file contains primitive + agnostic drawing functions
// For higher-level drawing functions, go to 'colour.js'

export const drawChildren = (context, colour, corners, parent = colour, depth = 0) => {

	for (const child of colour.screens) {
		const relativeCorners = getRelativePositions(child.corners, corners)

		if (depth >= 1) {
			const perimeter = getCornersPerimeter(relativeCorners)
			if (perimeter < Infinity) {
				drawBackground(context, child.colour, relativeCorners)
				const screen = makeScreen(child.colour, relativeCorners)
				parent.queue.push(screen)
				return
			}
		}

		drawBackground(context, child.colour, relativeCorners)
		drawChildren(context, child.colour, relativeCorners, parent, depth + 1)
	}
}

export const drawBackground = (context, colour, corners) => {

	//fillBackground(context, Colour.Black, corners)

	const canvasCornerPositions = getCanvasPositions(context, corners)
	const [a, b, c, d] = canvasCornerPositions

	context.beginPath()
	context.moveTo(...a)
	context.lineTo(...b)
	context.lineTo(...d)
	context.lineTo(...c)
	context.closePath()

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