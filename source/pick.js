import { getMappedPosition, getMappedPositions, getRelativePositions } from "./position.js"
import { makeScreen } from "./screen.js"

//======//
// PICK //
//======//
const makePick = (screen, position) => {
	const pick = {screen, position}
	return pick
}

export const pickInScreen = (screen, position) => {

	const {colour, corners} = screen

	for (const child of colour.screens) {
		const mappedPosition = getMappedPosition(position, child.corners)
		const outsideScreen = mappedPosition.some(axis => axis >= 1.0 || axis <= 0.0)
		if (outsideScreen) continue 
		const relativeCorners = getRelativePositions(child.corners, corners)
		const relativeChild = makeScreen(child.colour, relativeCorners)
		return pickInScreen(relativeChild, mappedPosition)
	}

	const pick = makePick(screen, position)
	return pick
}