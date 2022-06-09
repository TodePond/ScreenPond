import { makeHand } from "./hand.js"
import { makeColours } from "./colour.js"
import { makeCamera } from "./camera.js"

//========//
// GLOBAL //
//========//
const hand = makeHand()
const colours = makeColours()
const camera = makeCamera(colours)
const update = () => {}

export const global = {
	hand,
	colours,
	camera,
	update,
}

window.global = global