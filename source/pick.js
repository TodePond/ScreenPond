import { getMappedPosition, getRelativePositions, getMappedPositionPart, getRelativePosition } from "./position.js"
import { makeScreen } from "./screen.js"
import { getMousePosition } from "./hand.js"
import { PART_TYPE } from "./part.js"
import { getZeroedCorners } from "./corners.js"

//======//
// PICK //
//======//
const makePick = (screen, position, part) => {
	const pick = {screen, position, part}
	return pick
}

export const pickInScreen = (screen, position, options = {}) => {

	let {ignore = undefined, pity = [0, 0], part = undefined} = options
	const {colour, corners} = screen

	for (const child of colour.screens) {
		if (child === ignore) continue

		const zeroedChildCorners = getZeroedCorners(child.corners)
		const mappedPity = getMappedPosition(pity, zeroedChildCorners).map(axis => Math.abs(axis))
		const mappedPosition = getMappedPosition(position, child.corners)
		const childPart = getMappedPositionPart(mappedPosition, mappedPity)

		if (childPart.type === PART_TYPE.OUTSIDE) continue

		const relativeCorners = getRelativePositions(child.corners, corners)
		const relativeChild = makeScreen(child.colour, relativeCorners)
		return pickInScreen(relativeChild, mappedPosition, {ignore, pity: mappedPity, part: childPart})
	}

	if (part === undefined) part = getMappedPositionPart(position, pity)
	const pick = makePick(screen, position, part)
	return pick
}

export const pickInScreenWithMouse = (context, world, options) => {
	const position = getMousePosition(context, world)
	const pick = pickInScreen(world, position, options)
	return pick
}