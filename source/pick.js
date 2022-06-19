import { getMappedPosition, getRelativePositions, getRelativePosition, getScaledPosition, getMappedPositions, isMappedPositionInCorners } from "./position.js"
import { makeScreen } from "./screen.js"
import { getMousePosition } from "./hand.js"
import { PART_TYPE, getMappedPositionPart } from "./part.js"
import { getZeroedCorners, VIEW_CORNERS } from "./corners.js"
import { addScreen, removeScreen, removeScreenAddress, removeScreenNumber, removeScreensSet } from "./colour.js"
import { getScreenFromAddress, makeAddress } from "./address.js"

//======//
// PICK //
//======//
// A pick 
const makePick = ({screen, corners, position, part, parent, number, depth, address} = {}) => {
	if (address === undefined && parent !== undefined) address = makeAddress(parent.colour, number)
	const pick = {screen, corners, position, part, parent, number, depth, address}
	return pick
}

export const pickInScreen = (screen, position, options = {}) => {

	let {
		parent = undefined,
		pity = [0, 0],
		depth = 0,
		maxDepth = 1000,
		ignore = undefined,
		part = undefined,
		number = undefined,
		snap = undefined,
		address = undefined,
	} = options

	let snapped = false
	if (snap !== undefined && address !== undefined) {
		const addressedScreen = getScreenFromAddress(address)
		if (snap === addressedScreen) {
			snapped = true
		}
	}

	if (!snapped && depth < maxDepth) {
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
				...options,
				pity: scaledPity,
				parent: screen,
				part: childPart,
				number: i,
				depth: depth + 1,
				address: makeAddress(screen.colour, i),
			})
		}
	}

	if (part === undefined) part = getMappedPositionPart(position, pity)

	let pickedScreen = parent === undefined? screen : parent.colour.screens[number]
	//if (snap === screen) pickedScreen = snap
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

// LEGACY FUNCTION! newer alternative: 'replaceAddress' (which is better because it tries harder to stay in the current screen before swapping)
// Finds where to put a screen in a colour
// Returns a pick object for the placed screen
export const placeScreen = (screen, target, options = {}) => {
	
	const picks = screen.corners.map(corner => pickInScreen(target, corner, {...options}))
	const [a] = picks

	// Assess this placement!
	// Required: All picks have the same depth
	// Required: All picks have the same screen
	let depth = a.depth
	let deepestDepth = -Infinity
	let parent = a.screen
	let hasSingleParent = true
	let hasSingleDepth = true
	for (const pick of picks) {
		if (pick.depth !== depth) hasSingleDepth = false
		if (parent !== pick.screen) hasSingleParent = false
		if (pick.depth > deepestDepth) deepestDepth = pick.depth
	}

	if (!hasSingleParent || !hasSingleDepth) {
		let {maxDepth = deepestDepth} = options
		maxDepth--
		return placeScreen(screen, target, {...options, maxDepth})
	}

	const relativeCorners = getMappedPositions(screen.corners, a.corners)
	const relativeScreen = makeScreen(screen.colour, relativeCorners)

	const number = addScreen(parent.colour, relativeScreen)
	const {part = PART_TYPE.UNKNOWN} = options

	const pick = makePick({
		screen,
		corners: screen.corners,
		position: a.position,
		parent,
		number,
		part,
		depth,
	})

	return pick
}

// address = Address of the screen we want to replace
// screen = What we want to replace the it with
// target = The screen that we are placing into (at the top level)
// parent = The current screen's parent, which we should try our best to stay in
export const replaceAddress = ({address, screen, target, parent, ...options} = {}) => {

	const oldScreen = getScreenFromAddress(address)
	const picks = screen.corners.map(corner => pickInScreen(target, corner, {...options, snap: parent, ignore: oldScreen}))
	const isStillWithParent = picks.some(pick => pick.screen === parent)

	// Decide which pick (out of the 4) to use as the basis for the placement
	const [head, ...tail] = picks
	let pickLeader = head
	if (isStillWithParent) {
		pickLeader = picks.find(pick => pick.screen === parent)
	} else for (const pick of tail) {
		if (pick.depth > pickLeader.depth) {
			pickLeader = pick
		}
	}

	const relativeCorners = getMappedPositions(screen.corners, pickLeader.corners)
	const relativeScreen = makeScreen(screen.colour, relativeCorners)
	
	let number = address.number
	if (isStillWithParent) {
		oldScreen.corners = relativeCorners
	} else {
		removeScreenAddress(address)
		number = addScreen(pickLeader.screen.colour, relativeScreen)
		//print("switch")
	}

	const {part = PART_TYPE.UNKNOWN} = options
	const pick = makePick({
		screen,
		corners: screen.corners,
		position: pickLeader.position,
		parent: pickLeader.screen,
		number,
		part,
		depth: pickLeader.depth,
	})

	return pick

}

export const tryToSurroundScreens = (screen, colour) => {

	const surroundedScreensSet = new Set()
	const length = colour.screens.length

	for (let i = 0; i < length; i++) {
		const child = colour.screens[i]
		if (child === screen) continue

		const mappedChildCorners = getMappedPositions(child.corners, screen.corners)
		const insideScreen = mappedChildCorners.every(corner => isMappedPositionInCorners(corner))

		if (!insideScreen) continue
		surroundedScreensSet.add(child)
		const newChild = makeScreen(child.colour, mappedChildCorners)
		addScreen(screen.colour, newChild)
	}

	removeScreensSet(colour, surroundedScreensSet)

}