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
		

		const [x, y] = getViewPosition(context, Mouse.position)
		const worldPosition = getRelativePosition(WORLD_CORNERS, [x, y])

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