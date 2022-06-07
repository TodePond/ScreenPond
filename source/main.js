import { global } from "./global.js"
import { fireHandEvent } from "./hand.js"
import { drawBackground, drawChildren } from "./draw.js"
import { loadPresetName } from "./preset.js"
import { rotateCorners, moveCorners } from "./corners.js"

//======//
// MAIN //
//======//
const show = Show.start({paused: false})

show.resize = (context) => {
	const {world} = global
	const {colour, corners} = world
	drawBackground(context, colour, corners)
	drawChildren(context, colour, corners)
}

let t = 0
show.tick = (context) => {

	const {hand, world, colours} = global

	fireHandEvent(context, hand, "tick")

	const {colour, corners} = world
	drawBackground(context, colour, corners)
	drawChildren(context, colour, corners)

	// DEBUG
	const green = colours[BLACK].screens[0]
	green.corners = rotateCorners(green.corners, Math.sin(t) * 0.001)
	//green.corners = moveCorners(green.corners, [Math.sin(t) * 0.001, -Math.cos(t) * 0.001])
	t += 0.01
	
	const black = colours[GREEN].screens[0]
	black.corners = rotateCorners(black.corners, Math.cos(t) * -0.002)

}

loadPresetName(global, "INFINITE")
