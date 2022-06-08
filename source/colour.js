import {VIEW_CORNERS} from "./corners.js"
import {drawChildren} from "./draw.js"

//========//
// COLOUR //
//========//
export const COLOUR_HEXES = [
	GREY,
	GREEN,
	RED,
	BLUE,
	YELLOW,
	ORANGE,
	ROSE,
	CYAN,
	PURPLE,
]

export const makeColours = () => {
	const colours = {}
	for (const hex of COLOUR_HEXES) {
		colours[hex] = makeColour(hex)
	}
	return colours
}

export const makeColour = (hex) => {
	const canvas = new OffscreenCanvas(1920, 1080)
	const context = canvas.getContext("2d")
	const queue = []
	const colour = {hex, context, queue, screens: []}
	return colour
}

//======//
// DRAW //
//======//
export const resetColourCanvas = (colour) => {
	const {context} = colour
	const {canvas} = context
	context.clearRect(0, 0, canvas.width, canvas.height)
	colour.queue.length = 0
}

export const continueDrawingColour = (colour) => {
	const {context, queue} = colour
	if (queue.length === 0) {
		drawChildren(context, colour, VIEW_CORNERS)
		return
	}

	colour.queue = []
	//queue.shuffle()

	let depth = 0
	for (const screen of queue) {
		drawChildren(context, screen.colour, screen.corners, colour, depth)
		depth++
	}
}


export const stampColour = (context, colour) => {
	const {canvas} = context
	context.drawImage(colour.context.canvas, 0, 0, canvas.width, canvas.height)
}

//=========//
// SCREENS //
//=========//
export const removeAllScreens = (colour) => {
	colour.screens.length = 0
	resetColourCanvas(colour)
}

export const addScreen = (colour, screen) => {
	colour.screens.push(screen)
	resetColourCanvas(colour)
}