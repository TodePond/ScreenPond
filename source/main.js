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
	const {canvas} = context
	context.clearRect(0, 0, canvas.width, canvas.height)
	drawBackground(context, colour, corners)
	drawChildren(context, colour, corners)

	// DEBUG
	/*const s1 = colours[GREY].screens[4]
	const s2 = colours[GREY].screens[8]

	s1.corners = rotateCorners(s1.corners, 0.02)
	s2.corners = rotateCorners(s2.corners, -0.03)*/

	//const green = colours[GREEN].screens[0]
	//green.corners = rotateCorners(green.corners, 0.001)
	//green.corners = rotateCorners(green.corners, Math.sin(t) * 0.001)
	//green.corners = moveCorners(green.corners, [Math.sin(t) * 0.001, -Math.cos(t) * 0.001])
	//t += 0.01
	
	/*const black = colours[GREEN].screens[0]
	black.corners = rotateCorners(black.corners, Math.cos(t) * -0.002)*/

}

loadPresetName(global, "INFINITE")
//loadPresetName(global, "GRID")
