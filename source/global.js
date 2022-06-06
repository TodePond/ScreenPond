import { makeHand } from "./hand.js"
import { makeColours } from "./colour.js"
import { makeWorld } from "./world.js"

//========//
// GLOBAL //
//========//
const hand = makeHand()
const colours = makeColours()
const world = makeWorld(colours)

export const global = {
	hand,
	colours,
	world,
}