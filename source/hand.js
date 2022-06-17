import { getMappedPosition, getMappedPositions, getRelativePosition, getRelativePositions, getScaledPosition, getViewPosition, isMappedPositionInCorners } from "./position.js"
import { makeRectangleCorners, getPositionedCorners, getCornersPosition } from "./corners.js"
import { makeScreen } from "./screen.js"
import { pickInScreen, placeScreen } from "./pick.js"
import { addScreen, removeScreen, removeScreenNumber, removeScreensSet } from "./colour.js"
import { subtractVector, addVector } from "./vector.js"
import { clearQueue } from "./draw.js"
import { onkeydown } from "./keyboard.js"
import { PART_TYPE } from "./part.js"

//======//
// HAND //
//======//
export const makeHand = (colours) => ({

	state: HAND_STATE.START,
	cursor: HAND_STATE.START.cursor,
	colour: colours[GREEN],
	
	// What is the hand holding?
	pick: undefined,
	screen: undefined,

	// Where is the hand coming from?
	handStart: [undefined, undefined],
	screenStart: [undefined, undefined],
	pickStart: [undefined, undefined],

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
	if (newState.cursor !== hand.cursor) {
		context.canvas.style["cursor"] = newState.cursor
		hand.cursor = newState.cursor
	}

	hand.state = newState
}

export const getMousePosition = (context, corners) => {
	const viewPosition = getViewPosition(context, Mouse.position)
	const position = getMappedPosition(viewPosition, corners)
	return position
}

export const updateHandPick = (context, hand, world) => {

}

//==========//
// KEYBOARD //
//==========//
export const registerColourPickers = (hand, hexes, colours) => {
	for (let i = 0; i < hexes.length; i++) {
		const hex = hexes[i]
		onkeydown(`${i+1}`, () => hand.colour = colours[hex])
	}
}

//========//
// STATES //
//========//
HAND_STATE.START = {
	cursor: "default",
	tick: () => HAND_STATE.FREE,
}

const HAND_PICK_PITY = [0.006].repeat(2)
HAND_STATE.FREE = {
	cursor: "default",
	tick: ({context, hand, world, queue}) => {
		
		const position = getMousePosition(context, world.corners)
		hand.handStart = position

		const pity = HAND_PICK_PITY
		const pick = pickInScreen(world, position, {pity})
		hand.pick = pick
		hand.pickStart = getCornersPosition(pick.corners)

		if (pick.part.type === PART_TYPE.EDGE) {
			HAND_STATE.FREE.cursor = "move"
		} else if (pick.part.type === PART_TYPE.CORNER) {
			HAND_STATE.FREE.cursor = "pointer"
		} else {
			HAND_STATE.FREE.cursor = "default"
		}

		if (Mouse.Left) {

			// MOVE
			if (pick.part.type === PART_TYPE.EDGE) {

				if (pick.parent === undefined) {
					const message = "Unimplemented: You can't drag the world yet."
					alert(message)
					throw new Error(message)
				}

				return HAND_STATE.MOVING

			// ROTATE + SCALE
			} else if (pick.part.type === PART_TYPE.CORNER) {
				// TODO: rotate/scale
			}

			// DRAW
			const [x, y] = pick.position
			const corners = makeRectangleCorners(x, y, 0, 0)
			const screen = makeScreen(hand.colour, corners)

			hand.screen = screen
			addScreen(pick.screen.colour, screen)
			return HAND_STATE.DRAWING
		}

		return HAND_STATE.FREE
	},
}

HAND_STATE.MOVING = {
	cursor: "move",
	tick: ({context, hand, world, queue}) => {

		const {pick} = hand

		// Pick up the screen! (we'll place it down again later)
		removeScreenNumber(pick.parent.colour, pick.number)

		// Move
		const mousePosition = getMousePosition(context, world.corners)
		const handMovement = subtractVector(mousePosition, hand.handStart)
		const pickMovement = addVector(hand.pickStart, handMovement)
		const movedCorners = getPositionedCorners(pick.corners, pickMovement)
		const movedScreen = makeScreen(pick.screen.colour, movedCorners)

		// Place down the screen again
		hand.pick = placeScreen(movedScreen, world.colour)

		if (!Mouse.Left) {
			hand.pick = undefined
			clearQueue(context, queue, world)
			return HAND_STATE.FREE
		}

		clearQueue(context, queue, world)
		return HAND_STATE.MOVING
	},
}

HAND_STATE.DRAWING = {
	cursor: "default",
	tick: ({context, hand, world, queue}) => {

		// TODO: change all this to use the 'placeScreen' function
		// so just IGNORE this code for now

		// Update which screen we're drawing into!
		// (because it might have moved or something)
		// (or we might have moved the mouse to a different screen of the same colour)
		const worldPosition = getMousePosition(context, world.corners)
		const worldPick = pickInScreen(world, worldPosition, {ignore: hand.screen})
		if (hand.pick.screen.colour === worldPick.screen.colour) {
			hand.pick.screen = worldPick.screen
		} else {
			//removeScreen(hand.pick.screen.colour, hand.screen)
			//addScreen(world.colour, hand.screen)
		}

		const position = getMousePosition(context, hand.pick.screen.corners)
		
		const [dx, dy] = subtractVector(position, hand.pick.position)
		const [sx, sy] = hand.pick.position
		const corners = makeRectangleCorners(sx, sy, dx, dy)
		hand.screen.corners = corners

		if (!Mouse.Left) {
			
			const {pick, screen} = hand
			const {colour} = pick.screen
			
			// Check for surrounded screens
			const surroundedScreensSet = new Set()
			const length = colour.screens.length
			for (let i = 0; i < length; i++) {
				const child = colour.screens[i]
				if (child === screen) continue

				const mappedChildCorners = getMappedPositions(child.corners, corners)
				const insideScreen = mappedChildCorners.every(corner => isMappedPositionInCorners(corner))

				if (!insideScreen) continue
				surroundedScreensSet.add(child)
				const newChild = makeScreen(child.colour, mappedChildCorners)
				addScreen(screen.colour, newChild)
			}
			removeScreensSet(colour, surroundedScreensSet)
			
			clearQueue(context, queue, world)

			hand.pick = undefined
			hand.screen = undefined
			
			return HAND_STATE.FREE
		}

		clearQueue(context, queue, world)
		return HAND_STATE.DRAWING

	},
}