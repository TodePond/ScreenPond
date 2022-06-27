import { getMappedPosition, getMappedPositions, getMousePosition, getRelativePositions, getScaledPosition } from "./position.js"
import { makeRectangleCorners, getPositionedCorners, getCornersPosition, VIEW_CORNERS, getMovedCorners } from "./corners.js"
import { makeScreen } from "./screen.js"
import { pickInScreen, placeScreen, replaceAddress, tryToSurroundScreens } from "./pick.js"
import { subtractVector, addVector, scaleVector } from "./vector.js"
import { clearQueue } from "./draw.js"
import { onkeydown } from "./keyboard.js"
import { PART_TYPE } from "./part.js"
import { areRoutesEqual, getAddressedScreenFromRoute, getDrawnScreenFromRoute } from "./route.js"
import { getScreenFromAddress } from "./address.js"

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
		const worldMousePosition = getMappedPosition(mousePosition, world.corners)
		hand.handStart = mousePosition

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
				hand.pickStart = getCornersPosition(pick.screen.corners)
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

		// Remember some stuff for after the move
		const oldAddressedScreen = pick.screen

		const oldRoute = pick.route
		const oldDrawnParent = getDrawnScreenFromRoute(oldRoute, oldRoute.length - 2)
		const oldDrawnParentPosition = getCornersPosition(oldDrawnParent.corners)

		// Work out mouse movement
		const mousePosition = getMousePosition(context, VIEW_CORNERS)
		const movement = subtractVector(mousePosition, hand.handStart)
		const scaledMovement = getScaledPosition(movement, oldDrawnParent.corners)

		// Work out screen movement
		const movedPosition = addVector(hand.pickStart, scaledMovement)
		const movedCorners = getPositionedCorners(oldAddressedScreen.corners, movedPosition)
		//const movedScreen = makeScreen(pick.screen.colour, movedCorners)
		//const mappedMovedCorners = getMappedPositions(movedCorners, pick.parent.corners)
		//const mappedMovedScreen = makeScreen(pick.screen.colour, mappedMovedCorners)

		// Move the screen
		oldAddressedScreen.corners = movedCorners

		// Replace screen with moved screen
		/*hand.pick = replaceAddress({
			address: pick.address,
			screen: movedScreen,
			target: world,
			parent: pick.parent,
			depth: pick.depth,
		})*/

		//print(...movedCorners.map(c => c.map(a => a.toFixed(2))))

		//oldAddressedScreen.corners = getMappedPositions(movedScreen.corners, oldDrawnParent.corners)
		
		//hand.pickStart = getCornersPosition(oldScreen.corners)
		//hand.handStart = mousePosition

		// Yank the camera
		if (areRoutesEqual(oldRoute, hand.pick.route)) {
			const newDrawnParent = getDrawnScreenFromRoute(hand.pick.route, hand.pick.route.length - 2)
			const newDrawnParentPosition = getCornersPosition(newDrawnParent.corners)
	
			const missDisplacement = subtractVector(oldDrawnParentPosition, newDrawnParentPosition)
			//const missDistance = Math.hypot(...missDisplacement)
			world.corners = getMovedCorners(world.corners, missDisplacement)
		}

		//print(parent.colour, drawnParent.colour)

		//hand.pickStart = drawnPosition
		//hand.handStart = mousePosition
		//hand.pick.corners = drawnScreen.corners

		// TODO: Move world to reflect the new position of the cursor!!!
		//const missDisplacement = subtractVector(movedPosition, drawnPosition)
		//world.corners = getMovedCorners(world.corners, missDisplacement)

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