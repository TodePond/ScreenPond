import { makeHand } from "./hand.js"
import { makeColours } from "./colour.js"
import { makeCamera } from "./camera.js"

//========//
// GLOBAL //
//========//
const colours = makeColours()
const hand = makeHand(colours)
const camera = makeCamera(colours)
const update = () => {}

export const global = {
	hand,
	colours,
	camera,
	update,
}

window.global = global