import { global } from "./global.js"
import { fireHandEvent } from "./hand.js"
import { stampColour, continueDrawingColour, resetColourCanvas } from "./colour.js"
import { loadPresetName } from "./preset.js"
import { rotateCorners } from "./corners.js"
import { COLOUR_CANVAS_SCALE } from "./colour.js"

//======//
// MAIN //
//======//
const show = Show.start({paused: false})

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

	const {hand, colours, update, camera} = global
	fireHandEvent(context, hand, "tick", {camera})

	update(colours)

}

show.supertick = (context) => {

	const {camera} = global
	const {colour} = camera
	continueDrawingColour(colour)

	const {canvas} = context
	context.clearRect(0, 0, canvas.width, canvas.height)
	stampColour(context, colour)

}

loadPresetName(global, "GRID2")
