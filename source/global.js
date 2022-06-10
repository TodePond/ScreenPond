import { makeHand } from "./hand.js"
import { makeColours } from "./colour.js"
import { makeCamera } from "./camera.js"
import { LinkedList } from "./list.js"

//========//
// GLOBAL //
//========//
const colours = makeColours()
const hand = makeHand(colours)
const camera = makeCamera(colours)
const queue = new LinkedList()
const show = Show.start()
const update = () => {}

export const global = {
	
	// Updating
	hand,
	colours,
	update,

	// Drawing
	show,
	queue,
	camera,

}

window.global = global