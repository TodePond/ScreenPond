import {global} from "./global.js"
import {fireHandEvent} from "./hand.js"
import {stampColour, continueDrawingColour} from "./colour.js"
import {loadPresetName} from "./preset.js"
import {rotateCorners} from "./corners.js"

//======//
// MAIN //
//======//
const show = Show.start({paused: false})

show.resize = (context) => {
	show.tick(context)
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

loadPresetName(global, "GRID2")
