import { getMappedPosition, getRelativePosition, getViewPosition } from "./position.js"
import { makeRectangleCorners } from "./corners.js"
import { makeScreen } from "./screen.js"
import { pickInColour } from "./pick.js"
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

			const pick = pickInColour(world.colour, position)
			hand.start = pick.position

			const [x, y] = hand.start
			const corners = makeRectangleCorners(x, y, 0, 0)
			const screen = makeScreen(hand.colour, corners)
			hand.screen = screen

			addScreen(pick.colour, screen)
			clearQueue(context, queue, world)
			return HAND_STATE.DRAWING
		}

		return HAND_STATE.FREE
	},
}

HAND_STATE.DRAWING = {
	cursor: "default",
	tick: ({context, hand, world, queue}) => {

		const position = getMousePosition(context, world)
		
		const [dx, dy] = subtractVector(position, hand.start)
		const [sx, sy] = hand.start
		const corners = makeRectangleCorners(sx, sy, dx, dy)
		hand.screen.corners = corners

		clearQueue(context, queue, world)

		if (!Mouse.Left) {

			// When the mouse button is released...
			// ... work out if we should place the screen AROUND anything else?
			// FUN BONUS EXPERIMENT: what if we do this every time the mouse moves? it'll make it get stuck right?
			return HAND_STATE.FREE

		}

		return HAND_STATE.DRAWING

	},
}