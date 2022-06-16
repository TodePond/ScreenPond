import { getMappedPosition, getMappedPositions, getRelativePosition, getViewPosition, isMappedPositionInCorners } from "./position.js"
import { makeRectangleCorners } from "./corners.js"
import { makeScreen } from "./screen.js"
import { pickInScreen, pickInScreenWithMouse } from "./pick.js"
import { addScreen, removeScreensSet } from "./colour.js"
import { subtractVector } from "./vector.js"
import { clearQueue } from "./draw.js"
import { onkeydown } from "./keyboard.js"
import { PART_TYPE } from "./part.js"

//======//
// HAND //
//======//
export const makeHand = (colours) => ({
	state: HAND_STATE.START,
	colour: colours[GREEN],
	screen: undefined,
	pick: undefined,
	cursor: HAND_STATE.START.cursor,
})

const HAND_STATE = {}
export const fireHandEvent = (context, hand, eventName, args = {}) => {
	
	let oldState = hand.state
	let newState = hand.state

	// Keep firing state's events until the state stops changing
	do {
		oldState = newState
		const event = oldState[eventName]
		if (event === undefined) break
		newState = event({context, hand, ...args})
	} while (oldState !== newState)

	// Update cursor if we need to
	if (newState.cursor !== hand.cursor) {
		context.canvas.style["cursor"] = newState.cursor
		hand.cursor = newState.cursor
	}

	hand.state = newState
}

export const getMousePosition = (context, screen) => {
	const viewPosition = getViewPosition(context, Mouse.position)
	const position = getMappedPosition(viewPosition, screen.corners)
	return position
}

export const updateHandPick = (context, hand, world) => {
	if (!hand.state.isEditing) return
	const mousePosition = getMousePosition(context, world)
	const pick = pickInScreen(world, mousePosition, {ignore: hand.screen})
	if (hand.pick.screen.colour === pick.screen.colour) {
		hand.pick.screen = pick.screen
	}
}

//==========//
// KEYBOARD //
//==========//
export const registerColourPickers = (hand, hexes, colours) => {
	for (let i = 0; i < hexes.length; i++) {
		const hex = hexes[i]
		onkeydown(`${i+1}`, () => hand.colour = colours[hex])
	}
}

//========//
// STATES //
//========//
HAND_STATE.START = {
	cursor: "default",
	tick: () => HAND_STATE.FREE,
}

const HAND_PICK_PITY = [0.0075].repeat(2)
HAND_STATE.FREE = {
	cursor: "default",
	tick: ({context, hand, world, queue}) => {
		
		//const pity = getRelativePosition(HAND_PICK_PITY, world.corners)
		const pity = HAND_PICK_PITY
		const pick = pickInScreenWithMouse(context, world, {pity})
		hand.pick = pick

		if (pick.part.type === PART_TYPE.EDGE) {
			HAND_STATE.FREE.cursor = "move"
		} else if (pick.part.type === PART_TYPE.CORNER) {
			HAND_STATE.FREE.cursor = "pointer"
		} else {
			HAND_STATE.FREE.cursor = "default"
		}

		const [x, y] = pick.position
		const corners = makeRectangleCorners(x, y, 0, 0)
		const screen = makeScreen(hand.colour, corners)
		hand.screen = screen

		if (Mouse.Left) {
			if (pick.part.type === PART_TYPE.EDGE) {
				// TODO
			}
			addScreen(pick.screen.colour, screen)
			clearQueue(context, queue, world)
			return HAND_STATE.DRAWING
		}

		return HAND_STATE.FREE
	},
}

HAND_STATE.DRAWING = {
	cursor: "default",
	isEditing: true,
	tick: ({context, hand, world, queue}) => {

		const position = getMousePosition(context, hand.pick.screen)

		const [dx, dy] = subtractVector(position, hand.pick.position)
		const [sx, sy] = hand.pick.position
		const corners = makeRectangleCorners(sx, sy, dx, dy)
		hand.screen.corners = corners

		if (!Mouse.Left) {
			
			const {pick, screen} = hand
			const {colour} = pick.screen
			
			// Check for surrounded screens
			const surroundedScreensSet = new Set()
			const length = colour.screens.length
			for (let i = 0; i < length; i++) {
				const child = colour.screens[i]
				if (child === screen) continue

				const mappedChildCorners = getMappedPositions(child.corners, corners)
				const insideScreen = mappedChildCorners.every(corner => isMappedPositionInCorners(corner))

				if (!insideScreen) continue
				surroundedScreensSet.add(child)
				const newChild = makeScreen(child.colour, mappedChildCorners)
				addScreen(screen.colour, newChild)
			}
			removeScreensSet(colour, surroundedScreensSet)
			
			clearQueue(context, queue, world)

			hand.pick = undefined
			hand.screen = undefined
			
			return HAND_STATE.FREE
		}

		clearQueue(context, queue, world)
		return HAND_STATE.DRAWING

	},
}