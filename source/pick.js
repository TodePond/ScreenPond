import { getMappedPosition, getRelativePositions, getRelativePosition, getScaledPosition } from "./position.js"
import { makeScreen } from "./screen.js"
import { getMousePosition } from "./hand.js"
import { PART_TYPE, getMappedPositionPart } from "./part.js"
import { getZeroedCorners } from "./corners.js"

//======//
// PICK //
//======//
const makePick = ({screen, position, part, parent, number} = {}) => {
	const pick = {screen, position, part, parent, number}
	return pick
}

export const pickInScreen = (screen, position, options = {}) => {

	let {ignore = undefined, pity = [0, 0], part = undefined, number, parent} = options

	let i = -1
	for (const child of screen.colour.screens) {
		i++
		if (child === ignore) continue

		const scaledPity = getScaledPosition(pity, child.corners).map(axis => Math.abs(axis))
		const mappedPosition = getMappedPosition(position, child.corners)
		const childPart = getMappedPositionPart(mappedPosition, scaledPity)

		if (childPart.type === PART_TYPE.OUTSIDE) continue

		const relativeCorners = getRelativePositions(child.corners, screen.corners)
		const relativeChild = makeScreen(child.colour, relativeCorners)
		return pickInScreen(relativeChild, mappedPosition, {ignore, pity: scaledPity, parent: screen, part: childPart, number: i})
	}

	if (part === undefined) part = getMappedPositionPart(position, pity)
	const pick = makePick({screen, position, part, parent, number})
	return pick
}