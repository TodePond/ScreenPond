//========//
// CONFIG //
//========//
const urlParams = new URLSearchParams(location.search)
const DISPLAY_MODE = urlParams.get("display") === null? "multi" : urlParams.get("display")

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
	Colour.Rose.hex,
	Colour.Cyan.hex,
	Colour.Purple.hex,
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
const drawWorld = (context, world, corners) => {
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

const getMultiDisplayArrangement = (context) => {

	const numberOfColumns = Math.ceil(Math.sqrt(COLOURS.length + 1))
	const numberOfRows = Math.ceil(COLOURS.length / numberOfColumns)

	const columnWidth = 1.0 / numberOfColumns
	const rowHeight = 1.0 / numberOfRows

	return {numberOfColumns, numberOfRows, columnWidth, rowHeight}
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
	const display = DISPLAY_MODES[DISPLAY_MODE]
	display(context)
}

const DISPLAY_MODES = {}
DISPLAY_MODES["single"] = (context) => {
	drawWorld(context, global.world, [
		[0.0, 0.0],
		[1.0, 0.0],
		[1.0, 1.0],
		[0.0, 1.0],
	])
}

DISPLAY_MODES["multi"] = (context) => {

	const arrangement = getMultiDisplayArrangement(context)
	const {numberOfColumns, columnWidth, rowHeight} = arrangement

	drawWorld(context, global.world, [
		[0.0, 0.0],
		[columnWidth, 0.0],
		[columnWidth, rowHeight],
		[0.0, rowHeight],
	])

	let x = 1
	let y = 0
	for (const colour of COLOURS) {
		const corners = [
			[x*columnWidth, y*rowHeight],
			[(x+1)*columnWidth, y*rowHeight],
			[(x+1)*columnWidth, (y+1)*rowHeight],
			[x*columnWidth, (y+1)*rowHeight],
		]
		drawColour(context, colour, corners)
		x++
		if (x >= numberOfColumns) {
			x = 0
			y++
		}
	}
}

//=======//
// DEBUG //
//=======//

