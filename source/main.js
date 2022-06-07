import { global } from "./global.js"
import { fireHandEvent } from "./hand.js"
import { drawBackground, drawChildren } from "./draw.js"
import { loadPresetName } from "./preset.js"
import { rotateCorners } from "./corners.js"

//======//
// MAIN //
//======//
const show = Show.start({paused: true})

show.resize = (context) => {
	const {world} = global
	const {colour, corners} = world
	drawBackground(context, colour, corners)
	drawChildren(context, colour, corners)
}

show.tick = (context) => {

	const {hand, world, colours} = global

	fireHandEvent(context, hand, "tick")

	const {colour, corners} = world
	drawBackground(context, colour, corners)
	drawChildren(context, colour, corners)

	// DEBUG
	const blue = colours[GREEN].screens[0]
	blue.corners = rotateCorners(blue.corners, 0.005)
	
	const green = colours[BLUE].screens[0]
	green.corners = rotateCorners(green.corners, 0.00)

}

loadPresetName(global, "INFINITE")
