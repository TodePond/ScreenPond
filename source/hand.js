import { getMappedPosition, getMousePosition } from "./position.js"
import { makeRectangleCorners, getPositionedCorners, getCornersPosition, VIEW_CORNERS, getMovedCorners } from "./corners.js"
import { makeScreen } from "./screen.js"
import { pickInScreen, placeScreen, replaceAddress, tryToSurroundScreens } from "./pick.js"
import { subtractVector, addVector, scaleVector } from "./vector.js"
import { clearQueue } from "./draw.js"
import { onkeydown } from "./keyboard.js"
import { PART_TYPE } from "./part.js"
import { getDrawnScreenFromRoute } from "./route.js"

//======//
// HAND //
//======//
export const makeHand = (colours) => ({

	state: HAND_STATE.START,
	cursor: HAND_STATE.START.cursor,
	colour: colours[GREEN],
	
	// What is the hand holding?
	pick: undefined,

	// Where is the hand coming from?
	handStart: [undefined, undefined],
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
		
		//======== HOVER ========//
		const mousePosition = getMousePosition(context, VIEW_CORNERS)
		hand.handStart = mousePosition

		const worldMousePosition = getMappedPosition(mousePosition, world.corners)

		const pity = HAND_PICK_PITY
		const pick = pickInScreen(world, worldMousePosition, {pity})
		hand.pick = pick
			
		if (pick.part.type === PART_TYPE.EDGE) {
			HAND_STATE.FREE.cursor = "move"
		} else if (pick.part.type === PART_TYPE.CORNER) {
			HAND_STATE.FREE.cursor = "pointer"
		} else {
			HAND_STATE.FREE.cursor = "default"
		}

		if (Mouse.Left) {

			//======== MOVE ========//
			if (pick.part.type === PART_TYPE.EDGE) {

				hand.pickStart = getCornersPosition(pick.corners)
				return HAND_STATE.MOVING

			//======== ROTATE + SCALE ========//
			} else if (pick.part.type === PART_TYPE.CORNER) {
				
			}

			//======== DRAW ========//
			const [x, y] = mousePosition
			const corners = makeRectangleCorners(x, y, 0, 0)
			const screen = makeScreen(hand.colour, corners)

			hand.pick = placeScreen(screen, world)
			hand.pickStart = getCornersPosition(hand.pick.screen.corners)
			return HAND_STATE.DRAWING
		}

		return HAND_STATE.FREE
	},
}

HAND_STATE.MOVING = {
	cursor: "move",
	tick: ({context, hand, world, queue}) => {

		const {pick} = hand

		// Move
		const mousePosition = getMousePosition(context, VIEW_CORNERS)
		const handMovement = subtractVector(mousePosition, hand.handStart)
		const movedPosition = addVector(hand.pickStart, handMovement)
		const movedCorners = getPositionedCorners(pick.corners, movedPosition)
		const movedScreen = makeScreen(pick.screen.colour, movedCorners)

		// Replace
		hand.pick = replaceAddress({
			address: pick.address,
			screen: movedScreen,
			target: world,
			parent: pick.parent,
			depth: pick.depth,
		})

		const drawnScreen = getDrawnScreenFromRoute(hand.pick.route)
		const drawnPosition = getCornersPosition(drawnScreen.corners)
		//hand.pickStart = drawnPosition
		//hand.handStart = mousePosition
		//hand.pick.corners = drawnScreen.corners

		// TODO: Move world to reflect the new position of the cursor!!!
		const missDisplacement = subtractVector(movedPosition, drawnPosition)
		world.corners = getMovedCorners(world.corners, missDisplacement)

		if (!Mouse.Left) {
			tryToSurroundScreens(hand.pick.address)
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

		const {pick} = hand

		// Draw
		const mousePosition = getMousePosition(context, VIEW_CORNERS)
		const handMovement = subtractVector(mousePosition, hand.handStart)
		const [width, height] = handMovement
		const [x, y] = hand.pickStart
		const drawnCorners = makeRectangleCorners(x, y, width, height)
		const drawnScreen = makeScreen(pick.screen.colour, drawnCorners)

		// Replace
		hand.pick = replaceAddress({
			address: pick.address,
			screen: drawnScreen,
			target: world,
			parent: pick.parent,
			depth: pick.depth,
		})

		if (!Mouse.Left) {

			// Check for surrounded screens
			tryToSurroundScreens(hand.pick.address)
			clearQueue(context, queue, world)
			
			return HAND_STATE.FREE
		}

		clearQueue(context, queue, world)
		return HAND_STATE.DRAWING

	},
}