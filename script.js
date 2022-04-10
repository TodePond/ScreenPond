//========//
// CONFIG //
//========//
const urlParams = new URLSearchParams(location.search)
const BORDER_THICKNESS = 6

const COLOURS = [
	Colour.Green.hex,
	Colour.Red.hex,
	Colour.Blue.hex,
	Colour.Yellow.hex,
	Colour.Orange.hex,
	Colour.Rose.hex,
	Colour.Cyan.hex,
	Colour.Purple.hex,
]

const MULTI_DISPLAY_MODE = true
const DISPLAY_COLUMN_COUNT = MULTI_DISPLAY_MODE? Math.ceil(Math.sqrt(COLOURS.length + 1)) : 1
const DISPLAY_ROW_COUNT = MULTI_DISPLAY_MODE? Math.ceil((COLOURS.length + 1) / DISPLAY_COLUMN_COUNT) : 1
const DISPLAY_WIDTH = 1.0 / DISPLAY_COLUMN_COUNT
const DISPLAY_HEIGHT = 1.0 / DISPLAY_ROW_COUNT

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
			/*
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
			parent.needsInnerDraw */

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
		/*
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
		*/

		return HAND_STATE.DRAWING

	},
}

const fireHandEvent = (context, hand, eventName) => {
	
	let oldState = hand.state
	let newState = hand.state

	do {
		oldState = newState
		const event = oldState[eventName]
		if (event === undefined) break
		newState = event(context, hand)
	} while (oldState !== newState)

	if (newState.cursor !== hand.state.cursor) {
		context.canvas.style["cursor"] = newState.cursor
	}

	hand.state = newState
}

//======//
// DRAW //
//======//
const drawWorld = (context, world) => {
	const corners = getWorldCorners(context)
	const [head, ...tail] = corners.map(corner => getCanvasPosition(context, corner))

	context.beginPath()
	context.moveTo(...head)
	for (const corner of tail) {
		context.lineTo(...corner)
	}
	context.closePath()
	context.fillStyle = Colour.Black.hex
	context.fill()
}

const drawColour = (context, colour, corners) => {
	const [head, ...tail] = corners.map(corner => getCanvasPosition(context, corner))

	context.beginPath()
	context.moveTo(...head)
	for (const corner of tail) {
		context.lineTo(...corner)
	}
	context.closePath()
	context.fillStyle = colour
	context.fill()
}

//=============//
// POSITIONING //
//=============//
const getCanvasPosition = (context, [x, y]) => {
	return [x * context.canvas.width, y * context.canvas.height]
}

// TODO: fix this. currently it mixes canvas positioning (BORDER_THICKNESS) with view positioning (corners)
const getInnerCorners = (corners) => {
	const [[ax, ay], [bx, by], [cx, cy], [dx, dy]] = corners
	return [
		[ax + BORDER_THICKNESS, ay + BORDER_THICKNESS],
		[bx - BORDER_THICKNESS, by + BORDER_THICKNESS],
		[cx - BORDER_THICKNESS, cy - BORDER_THICKNESS],
		[dx + BORDER_THICKNESS, dy - BORDER_THICKNESS],
	]
}

const getDisplayPosition = (index) => {
	const x = index % DISPLAY_COLUMN_COUNT
	const y = Math.floor(index / DISPLAY_COLUMN_COUNT)
	return [x, y]
}

const getDisplayCorners = (index) => {
	const [x, y] = getDisplayPosition(index)
	const corners = [
		[x*DISPLAY_WIDTH, y*DISPLAY_HEIGHT],
		[(x+1)*DISPLAY_WIDTH, y*DISPLAY_HEIGHT],
		[(x+1)*DISPLAY_WIDTH, (y+1)*DISPLAY_HEIGHT],
		[x*DISPLAY_WIDTH, (y+1)*DISPLAY_HEIGHT],
	]
	return corners
}

const getWorldCorners = () => {
	return getDisplayCorners(0)
}

//========//
// GLOBAL //
//========//
const global = {
	world: [],
	colours: {},
	hand: {
		state: HAND_STATE.START,
		colour: Colour.Green.hex,
	},
}

for (const colour of COLOURS) {
	global.colours[colour] = []
}

//======//
// SHOW //
//======//
const show = Show.start()

show.tick = (context) => {
	fireHandEvent(context, global.hand, "update")

	drawWorld(context, global.world)

	let x = 1
	let y = 0
	let i = 1
	for (const i of (0).to(COLOURS.length-1)) {
		const corners = getDisplayCorners(i)
	}
}

//=======//
// DEBUG //
//=======//

