//========//
// CONFIG //
//========//
const BORDER_THICKNESS = 5

//========//
// COLOUR //
//========//
const COLOURS = [
	Colour.Blue.hex,
	Colour.Red.hex,
	Colour.Green.hex,
]

const COLOUR_IDS = {}
for (let id = 0; id < COLOURS.length; id++) {
	const colour = COLOURS[id]
	COLOUR_IDS[colour] = id
}

//========//
// SCREEN //
//========//
const makeScreen = ({
	colour = 0,
	x = 0,
	y = 0,
	width = 50,
	height = 50,
} = {}) => {
	const screen = {
		colour,
		x, y,
		width, height,
	}
	return screen
}

//======//
// HAND //
//======//
const HAND_STATE = {}

HAND_STATE.START = {
	cursor: "default",
	update: (context, hand) => {
		return HAND_STATE.FREE
	}
}

HAND_STATE.FREE = {
	cursor: "pointer",
	update: (context, hand) => {
		
		if (Mouse.Left) {
			return HAND_STATE.DRAWING
		}

		return HAND_STATE.FREE
	},
}

HAND_STATE.DRAWING = {
	cursor: "crosshair",
	update: (context, hand) => {

		if (!Mouse.Left) {
			return HAND_STATE.FREE
		}

		return HAND_STATE.DRAWING

	},
}

const fireHandEvent = (context, hand, eventName) => {
	
	let oldState = hand.state
	let newState = hand.state

	do {
		oldState = newState
		newState = oldState[eventName](context, hand)
	} while (oldState !== newState)

	if (newState.cursor !== hand.state.cursor) {
		context.canvas.style["cursor"] = newState.cursor
	}

	hand.state = newState
}

//========//
// GLOBAL //
//========//
const global = {
	screens: [],
	hand: {
		state: HAND_STATE.START,
	},
}

//======//
// SHOW //
//======//
const show = Show.start()

show.tick = (context) => {
	fireHandEvent(context, global.hand, "update")
}

//=======//
// DEBUG //
//=======//

