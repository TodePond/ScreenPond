import { getMappedPosition, getRelativePositions, getRelativePosition, getScaledPosition, getMappedPositions } from "./position.js"
import { makeScreen } from "./screen.js"
import { getMousePosition } from "./hand.js"
import { PART_TYPE, getMappedPositionPart } from "./part.js"
import { getZeroedCorners, VIEW_CORNERS } from "./corners.js"
import { addScreen } from "./colour.js"

//======//
// PICK //
//======//
// A pick 
const makePick = ({screen, corners, position, part, parent, number, depth} = {}) => {
	const pick = {screen, corners, position, part, parent, number, depth}
	return pick
}

export const pickInScreen = (screen, position, options = {}) => {

	let {
		pity = [0, 0],
		depth = 0,
		ignore = undefined,
		part = undefined,
		number = undefined,
		parent = undefined,
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

	const pickedScreen = parent === undefined? screen : parent.colour.screens[number]
	const pick = makePick({
		screen: pickedScreen,
		corners: screen.corners,
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
	const picks = screen.corners.map(corner => pickInScreen(parent, corner, {...options, ignore: screen}))

	let highestDepth = Infinity
	let highestPick = undefined
	for (const pick of picks) {
		if (pick.depth < highestDepth) {
			highestDepth = pick.depth
			highestPick = pick
		}
	}

	const relativeCorners = getMappedPositions(screen.corners, highestPick.screen.corners)
	const relativeScreen = makeScreen(screen.colour, relativeCorners)

	const number = addScreen(highestPick.screen.colour, relativeScreen)
	const [a] = picks
	const {part = PART_TYPE.UNKNOWN} = options

	const pick = makePick({
		screen,
		corners: screen.corners,
		position: a.position,
		parent: highestPick.screen,
		number,
		part,
		depth: highestDepth,
	})

	return pick
}