import { makeArrangement } from "./arrangement.js"
import { makeHand } from "./hand.js"
import { PARAM_ARRANGEMENT_MODE } from "./config.js"

//========//
// GLOBAL //
//========//
export const global = {

	arrangement: makeArrangement(PARAM_ARRANGEMENT_MODE),
	hand: makeHand(),
	
	screens: [],
	sources: {},

}