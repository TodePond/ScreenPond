import {makeHand} from "./hand.js"
import {makeColours} from "./colour.js"
import {makeCamera} from "./camera.js"

//========//
// GLOBAL //
//========//
const hand = makeHand()
const colours = makeColours()
const camera = makeCamera(colours)

export const global = {
	hand,
	colours,
	camera,
}

window.global = global