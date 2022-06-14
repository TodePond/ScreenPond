import { getMappedPosition, getMappedPositions, getViewPosition } from "./position.js"
import { makeRectangleCorners } from "./corners.js"
import { makeScreen } from "./screen.js"
import { pickInScreen } from "./pick.js"
import { addScreen, removeScreensSet } from "./colour.js"
import { subtractVector } from "./vector.js"
import { clearQueue } from "./draw.js"

//======//
// HAND //
//======//
export const makeHand = (colours) => ({
	state: HAND_STATE.START,
	colour: colours[GREEN],
	screen: undefined,
	pick: undefined,
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
	if (newState.cursor !== hand.state.cursor) {
		context.canvas.style["cursor"] = newState.cursor
	}

	hand.state = newState
}

export const getMousePosition = (context, screen) => {
	const viewPosition = getViewPosition(context, Mouse.position)
	const position = getMappedPosition(viewPosition, screen.corners)
	return position
}

//========//
// STATES //
//========//
HAND_STATE.START = {
	cursor: "default",
	tick: () => HAND_STATE.FREE,
}

HAND_STATE.FREE = {
	cursor: "default",
	tick: ({context, hand, world, queue}) => {
		
		if (Mouse.Left) {

			const position = getMousePosition(context, world)

			const pick = pickInScreen(world, position)
			hand.pick = pick

			const [x, y] = pick.position
			const corners = makeRectangleCorners(x, y, 0, 0)
			const screen = makeScreen(hand.colour, corners)
			hand.screen = screen

			addScreen(pick.screen.colour, screen)
			clearQueue(context, queue, world)
			return HAND_STATE.DRAWING
		}

		return HAND_STATE.FREE
	},
}

HAND_STATE.DRAWING = {
	cursor: "default",
	tick: ({context, hand, world, queue}) => {

		const position = getMousePosition(context, hand.pick.screen)

		const [dx, dy] = subtractVector(position, hand.pick.position)
		const [sx, sy] = hand.pick.position
		const corners = makeRectangleCorners(sx, sy, dx, dy)
		hand.screen.corners = corners

		clearQueue(context, queue, world)

		if (!Mouse.Left) {

			const {pick, screen} = hand
			const {colour} = pick.screen
			
			const surroundedScreensSet = new Set()

			const length = colour.screens.length
			for (let i = 0; i < length; i++) {
				const child = colour.screens[i]
				if (child === screen) continue

				const mappedChildCorners = getMappedPositions(child.corners, corners)
				const outsideScreen = mappedChildCorners.some(corner => {
					return corner.some(axis => axis > 1.0 || axis < 0.0)
				})

				if (outsideScreen) continue
				surroundedScreensSet.add(child)
				const newChild = makeScreen(child.colour, mappedChildCorners)
				addScreen(screen.colour, newChild)
			}

			removeScreensSet(colour, surroundedScreensSet)
			clearQueue(context, queue, world)
			return HAND_STATE.FREE

		}

		return HAND_STATE.DRAWING

	},
}