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

	Colour.Black.hex,
	Colour.Grey.hex,
	Colour.Silver.hex,
	Colour.White.hex,
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
	colour = COLOUR_IDS[Colour.Blue.hex],
	x = 0,
	y = 0,
	width = 50,
	height = 50,
} = {}) => {
	const screen = {
		colour,
		x, y,
		width, height,
		needsDrawing: true,
	}
	return screen
}

const registerScreen = (screen) => {
	global.screens.push(screen)
}

const createScreen = (...args) => {
	const screen = makeScreen(...args)
	registerScreen(screen)
	return screen
}

const drawScreen = (context, screen) => {

	const x = screen.x * context.canvas.width
	const y = screen.y * context.canvas.height
	const width = screen.width * context.canvas.width
	const height = screen.height * context.canvas.height

	context.fillStyle = Colour.Black.hex
	context.fillRect(x, y, width, height)

	context.lineWidth = BORDER_THICKNESS
	context.strokeStyle = COLOURS[screen.colour]

	/*
	const xInner = x + BORDER_THICKNESS/2
	const yInner = y + BORDER_THICKNESS/2
	const widthInner = width - BORDER_THICKNESS - 0.5
	const heightInner = height - BORDER_THICKNESS - 0.5
	context.strokeRect(xInner, yInner, widthInner, heightInner)
	*/
	context.strokeRect(x, y, width, height)
	
}

const getBounds = ({x, y, width, height}) => {

	const left = x
	const right = x + width
	const top = y
	const bottom = y + height

	const bounds = [left, right, top, bottom]
	bounds.left = left
	bounds.right = right
	bounds.top = top
	bounds.bottom = bottom

	return bounds
}

const getScreenParents = (screen) => {

	const screenBounds = getBounds(screen)

	const parents = []
	for (const other of global.screens) {
		const otherBounds = getBounds(other)

		if (screenBounds.left < otherBounds.left) continue
		if (screenBounds.right > otherBounds.right) continue
		if (screenBounds.top < otherBounds.top) continue
		if (screenBounds.bottom > otherBounds.bottom) continue

		parents.push(other)

	}

	return parents
}

const getScreenChildren = (screen) => {

	const screenBounds = getBounds(screen)

	const children = []
	for (const other of global.screens) {
		const otherBounds = getBounds(other)

		if (screenBounds.left > otherBounds.left) continue
		if (screenBounds.right < otherBounds.right) continue
		if (screenBounds.top > otherBounds.top) continue
		if (screenBounds.bottom < otherBounds.bottom) continue

		children.push(other)

	}

	return children

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
	cursor: "crosshair",
	update: (context, hand) => {
		
		if (Mouse.Left) {

			const [x, y] = Mouse.position

			hand.startX = x
			hand.startY = y

			hand.screen = createScreen({
				x: x / context.canvas.width,
				y: y / context.canvas.height,
				colour: hand.colour,
				width: 1,
				height: 1,
			})

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

		const [x, y] = Mouse.position
		const width = x - hand.startX
		const height = y - hand.startY

		hand.screen.width = width / context.canvas.width
		hand.screen.height = height / context.canvas.height

		const parents = getScreenParents(hand.screen)
		for (const parent of parents) {
			parent.needsDrawing = true
		}
		hand.screen.needsDrawing = true

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
	baseScreen: undefined,
	hand: {
		state: HAND_STATE.START,
		colour: COLOUR_IDS[Colour.Blue.hex],
	},
}

global.baseScreen = createScreen({
	x: 0,
	y: 0,
	width: 1,
	height: 1,
})

//======//
// SHOW //
//======//
const show = Show.start()

show.tick = (context) => {
	fireHandEvent(context, global.hand, "update")
	for (const screen of global.screens) {
		if (!screen.needsDrawing) continue
		drawScreen(context, screen)
		const children = getScreenChildren(screen)
		for (const child of children) {
			child.needsDrawing = true
		}
		screen.needsDrawing = false
	}
}

//=======//
// DEBUG //
//=======//

