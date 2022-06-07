import { global } from "./global.js"
import { fireHandEvent } from "./hand.js"
import { drawBackground, drawChildren } from "./draw.js"
import { loadPresetName } from "./preset.js"

//======//
// MAIN //
//======//
const show = Show.start()
show.tick = (context) => {

	const {hand, world} = global

	fireHandEvent(context, hand, "tick")

	const {colour, corners} = world
	drawBackground(context, colour, corners)
	drawChildren(context, colour, corners)

}

loadPresetName(global, "INFINITE")
