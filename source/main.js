import { global } from "./global.js"
import { fireHandEvent } from "./hand.js"
import { drawScreen } from "./draw.js"

//======//
// MAIN //
//======//
const show = Show.start()
show.tick = (context) => {

	const {hand, world} = global

	fireHandEvent(context, hand, "tick")
	drawScreen(context, world)

}
