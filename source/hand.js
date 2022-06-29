import { getMappedPosition, getMappedPositions, getMousePosition, getRelativePositions, getScaledPosition } from "./position.js"
import { makeRectangleCorners, getPositionedCorners, getCornersPosition, VIEW_CORNERS, getMovedCorners } from "./corners.js"
import { makeScreen } from "./screen.js"
import { pickInScreen, placeScreen, replaceAddress, tryToSurroundScreens } from "./pick.js"
import { subtractVector, addVector, scaleVector } from "./vector.js"
import { clearQueue } from "./draw.js"
import { onkeydown } from "./keyboard.js"
import { PART_TYPE } from "./part.js"
import { areRoutesEqual, getAddressedScreenFromRoute, getDrawnScreenFromRoute } from "./route.js"
import { areAddressesEqual, getScreenFromAddress, makeAddress } from "./address.js"
import { moveAddressToBack } from "./colour.js"
import { setWorldCorners } from "./world.js"

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

	startAddressedScreen: undefined,
	startDrawnParent: undefined,
	hasChangedParent: false,
	//startRoute: undefined,

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

const HAND_PICK_BRUTE_FORCE_DEPTH = 10
const HAND_MAX_BRUTE_FORCE = 1000
const HAND_PICK_PITY = [0.006].repeat(2)
HAND_STATE.FREE = {
	cursor: "default",
	tick: ({context, hand, world, queue}) => {
		
		//======== HOVER ========//
		const mousePosition = getMousePosition(context, VIEW_CORNERS)
		const worldMousePosition = getMappedPosition(mousePosition, world.corners)
		hand.handStart = mousePosition

		const pity = HAND_PICK_PITY
		const pick = pickInScreen(world, worldMousePosition, {
			pity,
			//bruteForceDepth: HAND_PICK_BRUTE_FORCE_DEPTH,
			//maxBruteForce: HAND_MAX_BRUTE_FORCE,
		})
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

				const [newAddress, newRoute] = moveAddressToBack(pick.address, pick.route)
				hand.pick.address = newAddress
				hand.pick.route = newRoute

				hand.pickStart = getCornersPosition(pick.screen.corners)
				hand.startAddressedScreen = pick.screen
				hand.startDrawnParent = getDrawnScreenFromRoute(pick.route, pick.route.length - 2)
				//hand.startRoute = pick.route
				hand.hasChangedParent = false
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
	tick: ({context, hand, world, queue, colours}) => {

		const {pick} = hand

		// Remember some stuff for after the move
		const oldAddressedScreen = hand.startAddressedScreen
		const oldDrawnParent = hand.startDrawnParent
		const oldDrawnParentPosition = getCornersPosition(oldDrawnParent.corners)

		// Work out mouse movement
		const mousePosition = getMousePosition(context, VIEW_CORNERS)
		const movement = subtractVector(mousePosition, hand.handStart)
		const scaledMovement = getScaledPosition(movement, oldDrawnParent.corners)

		// Work out screen movement
		const movedPosition = addVector(hand.pickStart, scaledMovement)
		const movedCorners = getPositionedCorners(oldAddressedScreen.corners, movedPosition)

		// Move the screen
		oldAddressedScreen.corners = movedCorners

		// Replace screen with moved screen
		const relativeMovedCorners = getRelativePositions(movedCorners, oldDrawnParent.corners)
		const relativeMovedScreen = makeScreen(pick.screen.colour, relativeMovedCorners)
		const newPick = replaceAddress({
			address: pick.address,
			screen: relativeMovedScreen,
			target: world,
			parent: pick.parent,
			depth: pick.depth,
		})
		
		pick.address = newPick.address
		pick.parent = newPick.parent
		pick.depth = newPick.depth
		
		// Yank the camera
		if (!hand.hasChangedParent && newPick.isWithinParent) {
			
			const newDrawnParent = getDrawnScreenFromRoute(hand.pick.route, hand.pick.route.length - 2)
			const newDrawnParentPosition = getCornersPosition(newDrawnParent.corners)

			const missDisplacement = subtractVector(oldDrawnParentPosition, newDrawnParentPosition)
			const worldCorners = getMovedCorners(world.corners, missDisplacement)
			setWorldCorners(world, worldCorners, colours)
			hand.startDrawnParent = getDrawnScreenFromRoute(hand.pick.route, hand.pick.route.length - 2)

		} else {
			hand.hasChangedParent = true
		}

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
			//bruteForceDepth: HAND_PICK_BRUTE_FORCE_DEPTH,
			//maxBruteForce: HAND_MAX_BRUTE_FORCE,
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