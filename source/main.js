import { COLOURS } from "./config.js"
import { global } from "./global.js"
import { getDisplayCorners } from "./display.js"
import { fireHandEvent } from "./hand.js"
import { drawSource } from "./draw.js"

//=======//
// SETUP //
//=======//

// Create default sources!
// TODO: move this
for (const i of (0).to(COLOURS.length-1)) {
	const colour = COLOURS[i]
	global.sources[colour] = {
		id: i,
		colour,
		corners: getDisplayCorners(i, global.arrangement),
		screens: [],
	}
}

//======//
// MAIN //
//======//
const show = Show.start()
show.tick = (context) => {

	fireHandEvent(context, global.hand, "tick")

	for (const source of global.sources) {
		drawSource(context, source)
	}

}
