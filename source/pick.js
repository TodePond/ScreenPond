import { getMappedPosition, getMappedPositions, getRelativePositions, isMappedPositionInCorners } from "./position.js"
import { makeScreen } from "./screen.js"
import { getMousePosition } from "./hand.js"

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
		const insideScreen = isMappedPositionInCorners(mappedPosition, pity)
		if (!insideScreen) continue
		const relativeCorners = getRelativePositions(child.corners, corners)
		const relativeChild = makeScreen(child.colour, relativeCorners)
		return pickInScreen(relativeChild, mappedPosition, {ignore, pity})
	}

	//position.d
	const part = makePart()
	const pick = makePick(screen, position, part)
	return pick
}

export const pickInScreenWithMouse = (context, world, options) => {	
	const position = getMousePosition(context, world)
	const pick = pickInScreen(world, position, options)
	return pick
}

//======//
// PART //
//======//
const PART_TYPE = {
	BODY: Symbol("PART_TYPE.BODY"),
	EDGE: Symbol("PART_TYPE.EDGE"),
	CORNER: Symbol("PART_TYPE.CORNER"),
}

const makePart = (type, number = 0) => {
	return {type, number}
}