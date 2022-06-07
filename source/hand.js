//======//
// HAND //
//======//
export const makeHand = () => ({
	state: HAND_STATE.START,
	colour: Colour.Green.hex,
})

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

//=======//
// STATE //
//=======//
const HAND_STATE = {}

HAND_STATE.START = {
	cursor: "default",
	tick: () => HAND_STATE.FREE,
}

HAND_STATE.FREE = {
	cursor: "crosshair",
	tick: ({context}) => {
		

		//const [x, y] = getViewPosition(context, Mouse.position)

		if (Mouse.Left) {

			return HAND_STATE.DRAWING
		}

		return HAND_STATE.FREE
	},
}

HAND_STATE.DRAWING = {
	cursor: "crosshair",
	tick: (context) => {

		if (!Mouse.Left) {
			return HAND_STATE.FREE
		}

		return HAND_STATE.DRAWING

	},
}