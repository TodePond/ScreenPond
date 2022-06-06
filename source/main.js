import { global } from "./global.js"
import { fireHandEvent } from "./hand.js"
import { drawScreen } from "./draw.js"

//======//
// MAIN //
//======//
const show = Show.start()
show.tick = (context) => {

	fireHandEvent(context, global.hand, "tick")
	drawScreen(context, global.world)

}
