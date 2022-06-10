import { global } from "./global.js"
import { fireHandEvent } from "./hand.js"
import { loadPresetName } from "./preset.js"
import { clearQueue, continueDrawingQueue } from "./draw.js"

//======//
// MAIN //
//======//
const {show} = global
show.resize = (context) => {
	const {queue, world} = global
	clearQueue(context, queue, world)
	show.tick(context)
}

show.tick = () => {
	const {update} = global
	update(global)
}

show.supertick = (context) => {
	const {queue, hand} = global
	fireHandEvent(context, hand, "tick", global)
	continueDrawingQueue(context, queue)
}

loadPresetName(global, "GRID2")
