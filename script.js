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

			const [mx, my] = Mouse.position
			const [x, y] = [mx / context.canvas.width, my / context.canvas.height]
			hand.startPosition = [mx, my]

			const parent = pickScreen([x, y], global.world, global.world.corners)

			hand.screen = makeScreen({
				colour: hand.colour,
				corners: [
					[x, y],
					[x, y],
					[x, y],
					[x, y],
				],
			})

			registerScreen(hand.screen, parent.colour)

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

		const [mx, my] = Mouse.position
		const [sx, sy] = hand.startPosition
		const [dx, dy] = [mx - sx, my - sy]
		const [width, height] = [dx / context.canvas.width, dy / context.canvas.height]

		const [[x, y]] = hand.screen.corners
		hand.screen.corners = [
			[x, y],
			[x + width, y],
			[x + width, y + height],
			[x, y + height],
		]

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

const getPositionInCorners = ([x, y], corners) => {
	return [x, y]
}

const drawScreenBorder = (context, screen, corners) => {

	const [head, ...tail] = screen.corners
		.map(corner => getPositionInCorners(corner, corners))
		.map(([x, y]) => [x * context.canvas.width-1, y * context.canvas.height-1])

	context.beginPath()
	context.moveTo(...head)
	for (const corner of tail) {
		context.lineTo(...corner)
	}
	context.closePath()
	context.strokeStyle = screen.colour
	context.lineWidth = BORDER_THICKNESS
	context.stroke()
}

const drawScreenInner = (context, screen, corners) => {
	const screens = global.screens[screen.colour]

	const innerCorners = screen.corners.map(corner => getPositionInCorners(corner, corners))

	for (const child of screens) {
		//print(child.corners)
		drawScreenBorder(context, child, innerCorners)
	}

}

const pickScreen = (position, parent, corners) => {

	const screens = global.screens[parent.colour]

	const [x, y] = getPositionInCorners(position, corners)

	for (const screen of screens) {
		// TODO: check for being inside a different screen
	}

	return parent

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

	drawScreenBorder(context, global.world, global.world.corners)
	drawScreenInner(context, global.world, global.world.corners)

}

//=======//
// DEBUG //
//=======//

