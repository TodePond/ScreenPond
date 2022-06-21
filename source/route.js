import { LinkedList } from "./list.js"
import { getRelativePositions } from "./position.js"
import { makeScreen } from "./screen.js"

//=======//
// ROUTE //
//=======//
export const makeRoute = (start) => {
	const steps = new LinkedList()
	const route = {start, steps, length: 1}
	return route
}

export const addStep = (route, number) => {
	route.steps.push(number)
	route.length++
}

export const getDrawnScreenFromRoute = (route, stepNumber = route.length) => {
	const {start, steps} = route
	let screen = start
	let i = 0
	for (const step of steps) {
		if (i >= stepNumber) return screen

		const number = step.item
		const child = screen.colour.screens[number]
		const relativeCorners = getRelativePositions(child.corners, screen.corners)
		screen = makeScreen(child.colour, relativeCorners)
		
		i++
	}
	return screen
}

export const getAddressedScreenFromRoute = (route, stepNumber = route.length) => {
	const {start, steps} = route
	let screen = start
	let i = 0
	for (const step of steps) {
		if (i >= stepNumber) return screen

		const number = step.item
		screen = screen.colour.screens[number]
		
		i++
	}
	return screen
}