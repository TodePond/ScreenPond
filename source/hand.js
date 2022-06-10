import { getViewPosition } from "./position.js"
import { makeRectangleCorners } from "./corners.js"
import { makeScreen } from "./screen.js"
import { addScreen } from "./colour.js"
import { subtractVector } from "./vector.js"
import { clearQueue } from "./draw.js"

//======//
// HAND //
//======//
export const makeHand = (colours) => ({
	state: HAND_STATE.START,
	colour: colours[GREEN],
	screen: undefined,
	start: [0, 0],
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

			const [x, y] = getViewPosition(context, Mouse.position)
			hand.start = [x, y]

			const corners = makeRectangleCorners(x, y, 0, 0)
			const screen = makeScreen(hand.colour, corners)
			hand.screen = screen

			// TODO: it should dynamically get the colour of whatever screen you click on!
			// (and adjust the corners to fit into it!)
			const colour = world.colour
			hand.screen = screen

			addScreen(colour, screen)
			clearQueue(context, queue, world)
			return HAND_STATE.DRAWING
		}

		return HAND_STATE.FREE
	},
}

HAND_STATE.DRAWING = {
	cursor: "default",
	tick: ({context, hand, world, queue}) => {

		const position = getViewPosition(context, Mouse.position)
		const [dx, dy] = subtractVector(position, hand.start)
		const [sx, sy] = hand.start
		const corners = makeRectangleCorners(sx, sy, dx, dy)
		hand.screen.corners = corners

		// TODO: re-figure out if the screen should be placed in a different colour, based on the new screenTemplate
		// NOTE: but maybe it shouldn't actually happen here! Maybe it should only check for this when you release the mouse button
		// yes, the second one is right
		clearQueue(context, queue, world)

		if (!Mouse.Left) {
			return HAND_STATE.FREE
		}

		return HAND_STATE.DRAWING

	},
}