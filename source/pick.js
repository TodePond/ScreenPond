import { getMappedPosition, getRelativePositions, getRelativePosition, getScaledPosition } from "./position.js"
import { makeScreen } from "./screen.js"
import { getMousePosition } from "./hand.js"
import { PART_TYPE, getMappedPositionPart } from "./part.js"
import { getZeroedCorners, VIEW_CORNERS } from "./corners.js"
import { addScreen } from "./colour.js"

//======//
// PICK //
//======//
// A pick 
const makePick = ({screen, colour, corners, position, part, parent, number, depth} = {}) => {
	const pick = {screen, colour, corners, position, part, parent, number, depth}
	return pick
}

export const pickInScreen = (screen, position, options = {}) => {

	let {
		ignore = undefined,
		pity = [0, 0],
		part = undefined,
		number, parent,
		depth = 0
	} = options

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
		return pickInScreen(relativeChild, mappedPosition, {
			ignore,
			pity: scaledPity,
			parent: screen,
			part: childPart,
			number: i,
			depth: depth + 1,
		})
	}

	if (part === undefined) part = getMappedPositionPart(position, pity)
	const pick = makePick({
		screen,
		corners: screen.corners,
		colour: screen.colour,
		position,
		part,
		parent,
		number,
		depth,
	})
	return pick
}

// Finds where to put a screen in a colour
// Returns a pick object for the placed screen
export const placeScreen = (screen, colour, options = {}) => {
	const parent = makeScreen(colour, VIEW_CORNERS)
	const picks = screen.corners.map(corner => pickInScreen(parent, corner, {...options, ignore: screen})).d

	let deepestDepth = -Infinity
	let deepestPick = undefined
	for (const pick of picks) {
		if (pick.depth > deepestDepth) {
			deepestDepth = pick.depth
			deepestPick = pick
		}
	}

	addScreen(deepestPick.screen.colour, screen)
	
	return screen
}