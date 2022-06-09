import { getCanvasPositions, getRelativePositions } from "./position.js"
import { getCornersPerimeter} from "./corners.js"
import { makeScreen} from "./screen.js"
import { COLOUR_CANVAS_SCALE } from "./colour.js"

//======//
// DRAW //
//======//
// This file contains primitive + agnostic drawing functions
// For higher-level drawing functions, go to 'colour.js'
export const SCREEN_BORDER_WIDTH = 1.0
export const drawBorder = (context, screen) => {

	const {colour, corners} = screen
	fillBackground(context, {colour: Colour.Black, corners})

	const canvasCornerPositions = getCanvasPositions(context, corners)
	const [a, b, c, d] = canvasCornerPositions

	context.beginPath()
	context.moveTo(...a)
	context.lineTo(...b)
	context.lineTo(...d)
	context.lineTo(...c)
	context.closePath()

	context.lineWidth = SCREEN_BORDER_WIDTH * COLOUR_CANVAS_SCALE
	context.strokeStyle = colour.hex
	context.stroke()
}

export const fillBackground = (context, screen) => {

	const {colour, corners} = screen
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