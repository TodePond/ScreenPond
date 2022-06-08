import {VIEW_CORNERS} from "./corners.js"
import {drawChildren} from "./draw.js"
import {LinkedList} from "./list.js"

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
	const queue = new LinkedList()
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
	colour.queue.clear()
}

export const continueDrawingColour = (colour) => {
	const {context, queue} = colour
	if (queue.isEmpty) {
		drawChildren(context, colour, VIEW_CORNERS)
		return
	}

	// TODO: this doesn't work properly when there's multiple of the same colour or something (check out all the presets to see what I mean)
	let i = 0
	for (const link of queue) {
		const {item} = link
		if (i >= 1) {
			queue.setStart(link)
			break
		}
		drawChildren(context, item.colour, item.corners, colour)
		i++
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