import { global } from "./global.js"
import { fireHandEvent } from "./hand.js"
import { drawBackground, drawChildren, stampColour } from "./draw.js"
import { loadPresetName } from "./preset.js"
import { VIEW_CORNERS, rotateCorners } from "./corners.js"

//======//
// MAIN //
//======//
const show = Show.start({paused: false})

show.resize = (context) => {
	show.tick(context)
}

show.tick = (context) => {

	const {hand, camera, colours} = global
	fireHandEvent(context, hand, "tick")
	
	for (const colour of colours) {
		const {canvas} = colour.context
		colour.context.clearRect(0, 0, canvas.width, canvas.height)
		drawBackground(colour.context, colour, VIEW_CORNERS)
		drawChildren(colour.context, colour, VIEW_CORNERS)
	}

	const {colour} = camera
	const {canvas} = context
	context.clearRect(0, 0, canvas.width, canvas.height)
	stampColour(context, colour)

	/*const s1 = colours[GREEN].screens[0]
	s1.corners = rotateCorners(s1.corners, 0.00002)*/

}

loadPresetName(global, "DOUBLE")
