import { global } from "./global.js"
import { fireHandEvent } from "./hand.js"
import { drawBackground, drawChildren, stampColour } from "./draw.js"
import { loadPresetName } from "./preset.js"
import { VIEW_CORNERS } from "./corners.js"

//======//
// MAIN //
//======//
const show = Show.start({paused: false})

show.resize = (context) => {
	const {world} = global
	const {colour, corners} = world
	stampColour(context, colour, corners)
}

show.tick = (context) => {

	const {hand, world, colours} = global
	fireHandEvent(context, hand, "tick")
	
	for (const colour of colours) {
		const {canvas} = colour.context
		colour.context.clearRect(0, 0, canvas.width, canvas.height)
		drawBackground(colour.context, colour, VIEW_CORNERS)
		drawChildren(colour.context, colour, VIEW_CORNERS)
	}

	const {colour, corners} = world
	const {canvas} = context
	context.clearRect(0, 0, canvas.width, canvas.height)
	stampColour(context, colour, corners)

}

loadPresetName(global, "INFINITE")
