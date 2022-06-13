import { getRelativePosition, isPositionInCorners } from "./position.js"

//======//
// PICK //
//======//
const makePick = (colour, position) => {
	const pick = {colour, position}
	return pick
}

export const pickInColour = (colour, position) => {

	for (const screen of colour.screens) {
		const {corners} = screen
		if (isPositionInCorners(position, corners)) {
			throw new Error("Unimplemented")
		}
	}

	const pick = makePick(colour, position)
	return pick
}