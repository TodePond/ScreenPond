import {global} from "./global.js"
import {fireHandEvent} from "./hand.js"
import {stampColour, continueDrawingColour, resetColourCanvas} from "./colour.js"
import {loadPresetName} from "./preset.js"
import {rotateCorners} from "./corners.js"

//======//
// MAIN //
//======//
const show = Show.start({paused: false})

const COLOUR_CANVAS_SCALE = 2.0
show.resize = (context) => {
	show.tick(context)
	const {canvas} = context
	const {colours} = global
	for (const colour of colours) {
		const colourCanvas = colour.context.canvas
		colourCanvas.width = canvas.width * COLOUR_CANVAS_SCALE
		colourCanvas.height = canvas.height * COLOUR_CANVAS_SCALE
		resetColourCanvas(colour)
	}
}

show.tick = (context) => {

	const {hand, camera, colours, update} = global
	fireHandEvent(context, hand, "tick")
	
	const {colour} = camera
	continueDrawingColour(colour)

	const {canvas} = context
	context.clearRect(0, 0, canvas.width, canvas.height)
	stampColour(context, colour)

	update(colours)

}

loadPresetName(global, "INFINITE")
