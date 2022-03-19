//========//
// CONFIG //
//========//
const BORDER_THICKNESS = 6

//========//
// COLOUR //
//========//
const COLOURS = [
	Colour.Green.hex,
	Colour.Red.hex,
	Colour.Blue.hex,
	Colour.Yellow.hex,
	Colour.Orange.hex,
	Colour.Pink.hex,
	Colour.Rose.hex,
	Colour.Cyan.hex,
	Colour.Purple.hex,
	
	Colour.Void.hex,
]

//======//
// HAND //
//======//
const HAND_STATE = {}

HAND_STATE.START = {
	cursor: "default",
	update: () => HAND_STATE.FREE,
}

HAND_STATE.FREE = {
	cursor: "crosshair",
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
// SCREEN //
//========//
const makeScreen = ({colour = Colour.Blue.hex, corners = []} = {}) => {
	const screen = {colour, corners}
	return screen
}

const registerScreen = (screen, colour) => {
	global.screens[colour].push(screen)
}

const drawScreen = (screen, corners) => {
	
}

//========//
// GLOBAL //
//========//
const global = {
	screens: {},
	shadows: {},

	world: makeScreen({
		colour: Colour.Blue.hex,
		corners: [
			[0, 0],
			[1, 0],
			[1, 1],
			[0, 1],
		],
	}),

	hand: {
		state: HAND_STATE.START,
		colour: Colour.Green.hex,
	},
}

for (const colour of COLOURS) {
	global.screens[colour] = []
}

registerScreen(global.world, Colour.Void.hex)

//======//
// SHOW //
//======//
const show = Show.start()

show.tick = (context) => {
	fireHandEvent(context, global.hand, "update")

	drawScreen(world, [
		[0, 0],
		[1, 0],
		[1, 1],
		[0, 1],
	])

}

//=======//
// DEBUG //
//=======//
