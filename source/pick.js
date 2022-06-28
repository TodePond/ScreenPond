import { getMappedPosition, getRelativePositions, getRelativePosition, getScaledPosition, getMappedPositions, isMappedPositionInCorners } from "./position.js"
import { makeScreen } from "./screen.js"
import { PART_TYPE, getMappedPositionPart } from "./part.js"
import { addScreen, removeScreenAddress, removeScreensSet } from "./colour.js"
import { getScreenFromAddress, makeAddress } from "./address.js"
import { addStep, makeRoute } from "./route.js"

//======//
// PICK //
//======//
// A pick 
const makePick = ({screen, corners, position, part, parent, number, depth, address, route} = {}) => {
	if (address === undefined && parent !== undefined && number !== undefined) {
		address = makeAddress(parent.colour, number)
	}

	const pick = {screen, corners, position, part, parent, number, depth, address, route}
	return pick
}

export const pickInScreen = (screen, position, options = {}) => {

	// Options
	let {
		parent = undefined,
		pity = [0, 0],
		depth = 0,
		maxDepth = 1000,
		ignore = undefined,
		ignoreDepth = undefined,
		part = undefined,
		number = undefined,
		snap = undefined,
		address = undefined,
		route = undefined,
	} = options

	// Check if this screen is the one we want to snap to!
	let snapped = false
	if (snap !== undefined && address !== undefined) {
		const addressedScreen = getScreenFromAddress(address)
		if (snap === addressedScreen) {
			snapped = true
		}
	}

	// Keep track of the route we go on
	if (route === undefined) {
		const start = screen
		route = makeRoute(start)
	}

	// Look through all this screen's children
	if (!snapped && depth < maxDepth) {
		let i = -1
		for (const child of screen.colour.screens) {
			i++

			if (child === ignore && (ignoreDepth === undefined || ignoreDepth === depth + 1)) {
				continue
			}

			const scaledPity = getScaledPosition(pity, child.corners).map(axis => Math.abs(axis))
			const mappedPosition = getMappedPosition(position, child.corners)
			const childPart = getMappedPositionPart(mappedPosition, scaledPity)

			if (childPart.type === PART_TYPE.OUTSIDE) continue

			const relativeCorners = getRelativePositions(child.corners, screen.corners)
			const relativeChild = makeScreen(child.colour, relativeCorners)

			addStep(route, i)
			const addressedScreen = address === undefined? screen : getScreenFromAddress(address)

			return pickInScreen(relativeChild, mappedPosition, {
				...options,
				pity: scaledPity,
				parent: addressedScreen,
				part: childPart,
				number: i,
				depth: depth + 1,
				address: makeAddress(screen.colour, i),
				route,
			})
		}
	}

	// If we didn't pick any children, pick this screen
	let pickedScreen = parent === undefined? screen : parent.colour.screens[number]

	// Get the part of the screen
	if (part === undefined) part = getMappedPositionPart(position, pity)

	// Collect together the pick information
	const pick = makePick({
		screen: pickedScreen,
		corners: screen.corners,
		position,
		part,
		parent,
		number,
		depth,
		route,
	})
	return pick
}

// Finds where to place a NEW screen in a colour
// It picks a parent based on corner A
// Returns a pick object for the placed screen
export const placeScreen = (screen, target, options = {}) => {
	
	const picks = screen.corners.map(corner => pickInScreen(target, corner, {...options}))
	const [head] = picks

	const relativeCorners = getMappedPositions(screen.corners, head.corners)
	const relativeScreen = makeScreen(screen.colour, relativeCorners)

	const parent = head.screen
	const number = addScreen(parent.colour, relativeScreen)
	const {part = PART_TYPE.UNKNOWN} = options

	const pick = makePick({
		screen,
		corners: screen.corners,
		position: head.position,
		parent,
		number,
		part,
		depth: head.depth,
	})

	return pick
}

// address = Address of the screen we want to replace
// screen = What we want to replace the it with
// target = The screen that we are placing into (at the top level) - nearly always 'world'!
// parent = The current screen's parent, which we should try our best to stay in
//
// note: 'screen' and 'target' should have their corners be relative to the view
export const replaceAddress = ({address, screen, target, parent, depth, ...options} = {}) => {

	const oldScreen = getScreenFromAddress(address)

	// Pick where to place the screen
	const pickOptions = {...options, ignore: oldScreen, ignoreDepth: depth}
	let picks = screen.corners.map(corner => pickInScreen(target, corner, pickOptions))
	let isStillWithParent = picks.some(pick => pick.screen === parent)

	if (!isStillWithParent) {
		const snapPicks = screen.corners.map(corner => pickInScreen(target, corner, {...pickOptions, snap: parent}))
		const snapIsStillWithParent = snapPicks.some(pick => pick.screen === parent)
		if (snapIsStillWithParent) {
			const depth = Math.min(...picks.map(pick => pick.depth))
			const snapDepth = Math.min(...snapPicks.map(pick => pick.depth))
			if (snapDepth >= depth) {
				picks = snapPicks
				isStillWithParent = snapIsStillWithParent
			}
		}
	}

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

	// Place the screen
	const mappedCorners = getMappedPositions(screen.corners, pickLeader.corners)
	let number = address.number
	if (false && isStillWithParent) {
		oldScreen.corners = mappedCorners
	} else {
		const mappedScreen = makeScreen(screen.colour, mappedCorners)
		removeScreenAddress(address)
		number = addScreen(pickLeader.screen.colour, mappedScreen)
	}

	// Return info about the picked placement
	const {part = PART_TYPE.UNKNOWN} = options
	const route = pickLeader.route
	addStep(route, number)
	
	//print(pickLeader.screen === window.global.colours[GREEN].screens[0])

	const pick = makePick({
		screen,
		corners: screen.corners,
		position: pickLeader.position,
		parent: pickLeader.screen,
		number,
		part,
		depth: pickLeader.depth + 1,
		route,
	})
	return pick
	
}

export const tryToSurroundScreens = (address) => {

	const {colour} = address
	const screen = getScreenFromAddress(address)

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