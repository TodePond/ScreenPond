import { VIEW_CORNERS } from "./corners.js"
import { drawBorder } from "./draw.js"
import { LinkedList } from "./list.js"
import { makeScreen } from "./screen.js"
import { getRelativePositions } from "./position.js"

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

export const COLOUR_CANVAS_SCALE = 2.0

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

	const screen = makeScreen(colour, VIEW_CORNERS)
	colour.queue.clear()
	colour.queue.push(screen)
}

export const continueDrawingColour = (colour) => {
	const {context, queue} = colour

	// If the draw queue is empty, that means we've drawn everything already :)
	if (queue.isEmpty) {
		print("done")
		return
	}

	let i = 0
	while (!queue.isEmpty) {
		if (i >= 1000) break
		const screen = queue.shift()
		drawBorder(context, screen)
		addChildrenToQueue(queue, screen)
		i++
	}

}

export const addChildrenToQueue = (queue, screen) => {
	const {colour, corners} = screen
	for (const child of colour.screens) {
		const relativeCorners = getRelativePositions(child.corners, corners)
		const screen = makeScreen(child.colour, relativeCorners)
		queue.push(screen)
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