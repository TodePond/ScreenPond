import { global } from "./global.js"
import { fireHandEvent, registerColourPickers, updateHandPick } from "./hand.js"
import { loadPresetName } from "./preset.js"
import { clearQueue, continueDrawingQueue } from "./draw.js"
import { COLOUR_HEXES } from "./colour.js"

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
	const {queue, hand, world} = global
	
	updateHandPick(context, hand, world)
	fireHandEvent(context, hand, "tick", global)
	continueDrawingQueue(context, queue)
}

registerColourPickers(global.hand, COLOUR_HEXES, global.colours)
loadPresetName(global, "GRID2")