import { makeHand } from "./hand.js"
import { makeColours } from "./colour.js"
import { makeWorld } from "./world.js"
import { LinkedList } from "./list.js"

//========//
// GLOBAL //
//========//
const colours = makeColours()
const hand = makeHand(colours)
const world = makeWorld(colours)
const queue = new LinkedList()
const show = Show.start()
const update = () => {}

export const global = {
	
	// Updating
	world,
	colours,
	hand,
	update,

	// Drawing
	show,
	queue,

}

window.global = global