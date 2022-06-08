import { global } from "./global.js"
import { fireHandEvent } from "./hand.js"
import { stampColour } from "./draw.js"
import { loadPresetName } from "./preset.js"
import { rotateCorners, moveCorners } from "./corners.js"
import { callWorker } from "./colour.js"

//======//
// MAIN //
//======//
const show = Show.start({paused: false})

show.resize = (context) => {
	const {world} = global
	const {colour, corners} = world
	stampColour(context, colour, corners)
}

let t = 0
show.tick = (context) => {

	const {hand, world, colours} = global
	fireHandEvent(context, hand, "tick")
	
	for (const colour of colours) {
		const {worker} = colour
		callWorker(worker, "tick", [colours])
	}

	const {colour, corners} = world
	const {canvas} = context
	context.clearRect(0, 0, canvas.width, canvas.height)
	stampColour(context, colour, corners)

}

loadPresetName(global, "INFINITE")
