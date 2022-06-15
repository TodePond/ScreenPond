import { getMappedPosition, getRelativePositions, getMappedPositionPart } from "./position.js"
import { makeScreen } from "./screen.js"
import { getMousePosition } from "./hand.js"
import { makePart, PART_TYPE } from "./part.js"

//======//
// PICK //
//======//
const makePick = (screen, position) => {
	const pick = {screen, position}
	return pick
}

export const pickInScreen = (screen, position, options = {}) => {

	const {ignore = undefined, pity = [0, 0]} = options
	const {colour, corners} = screen

	for (const child of colour.screens) {
		if (child === ignore) continue
		const mappedPosition = getMappedPosition(position, child.corners)
		const part = getMappedPositionPart(mappedPosition, pity)
		if (part.type === PART_TYPE.OUTSIDE) continue
		//print(part)
		const relativeCorners = getRelativePositions(child.corners, corners)
		const relativeChild = makeScreen(child.colour, relativeCorners)
		return pickInScreen(relativeChild, mappedPosition, {ignore, pity})
	}

	const part = makePart(PART_TYPE.BODY, 0)
	const pick = makePick(screen, position, part)
	return pick
}

export const pickInScreenWithMouse = (context, world, options) => {
	const position = getMousePosition(context, world)
	const pick = pickInScreen(world, position, options)
	return pick
}