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

const WORLD_CORNERS = [
	[0.1, 0.0],
	[DISPLAY_WIDTH, 0.1],
	[DISPLAY_WIDTH-0.1, DISPLAY_HEIGHT],
	[0.0, DISPLAY_HEIGHT-0.1],
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
	update: (context) => {
		
		if (Mouse.Left) {

			const [x, y] = getViewPosition(context, Mouse.position)
			const worldPosition = getRelativePosition(WORLD_CORNERS, [x, y])

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
	update: (context) => {

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

const fireHandEvent = (context, eventName) => {
	
	let oldState = global.hand.state
	let newState = global.hand.state

	do {
		oldState = newState
		const event = oldState[eventName]
		if (event === undefined) break
		newState = event(context, global.hand)
	} while (oldState !== newState)

	if (newState.cursor !== global.hand.state.cursor) {
		context.canvas.style["cursor"] = newState.cursor
	}

	global.hand.state = newState
}

//========//
// SCREEN //
//========//
const makeScreen = ({colour, parent, corners} = {}) => {
	if (colour === undefined) colour = Colour.Blue.hex
	if (parent === undefined) parent = undefined
	if (corners === undefined) corners = [
		[0.0, 0.0],
		[0.0, 0.0],
		[0.0, 0.0],
		[0.0, 0.0],
	]

	return {colour, parent, corners}
}

//======//
// DRAW //
//======//
const drawWorld = (context) => {
	const [head, ...tail] = WORLD_CORNERS.map(corner => getCanvasPosition(context, corner))

	context.beginPath()
	context.moveTo(...head)
	for (const corner of tail) {
		context.lineTo(...corner)
	}
	context.closePath()
	context.fillStyle = Colour.Black.hex
	context.fill()

	for (const screen of global.screens) {
		stampSource(context, screen.colour, screen.corners)
	}
}

const stampSource = (context, colour, corners) => {

}

const drawSource = (context, source) => {
	const [head, ...tail] = source.corners.map(corner => getCanvasPosition(context, corner))

	context.beginPath()
	context.moveTo(...head)
	for (const corner of tail) {
		context.lineTo(...corner)
	}
	context.closePath()
	context.fillStyle = source.colour
	context.fill()
}

//=============//
// POSITIONING //
//=============//
const getCanvasPosition = (context, [x, y]) => {
	return [x * context.canvas.width, y * context.canvas.height]
}

const getViewPosition = (context, [x, y]) => {
	return [x / context.canvas.width, y / context.canvas.height]
}

const getRelativePosition = (corners, [x, y]) => {

	const [a, b, c, d] = corners
	const [ax, ay] = a
	const [bx, by] = b
	const [cx, cy] = c
	const [dx, dy] = d

	const left = ax
	const top = ay
	const right = cx
	const bottom = cy

	const topHeight = by - ay
	const bottomHeight = cy - dy
	const leftWidth = dx - ax
	const rightWidth = cx - bx

	const leftHeight = dy - ay
	const rightHeight = cy - by
	const topWidth = bx - ax
	const bottomWidth = cx - dx

	

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

//========//
// GLOBAL //
//========//
const global = {
	screens: [],
	sources: {},
	hand: {
		state: HAND_STATE.START,
		colour: Colour.Green.hex,
	},
}

for (const i of (0).to(COLOURS.length-1)) {
	const colour = COLOURS[i]
	global.sources[colour] = {
		id: i+1,
		colour,
		corners: getDisplayCorners(i+1),
		screens: [],
	}
}

//======//
// SHOW //
//======//
const show = Show.start()

show.tick = (context) => {
	fireHandEvent(context, "update")

	drawWorld(context)

	for (const source of global.sources) {
		drawSource(context, source)
	}
}

//=======//
// DEBUG //
//=======//

