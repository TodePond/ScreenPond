import { LinkedList } from "./list.js"
import { getRelativePositions } from "./position.js"
import { makeScreen } from "./screen.js"

//=======//
// ROUTE //
//=======//
export const makeRoute = (start) => {
	const steps = new LinkedList()
	const route = {start, steps}
	return route
}

export const addStep = (route, number) => {
	route.steps.push(number)
}

export const getDrawnScreenFromRoute = (route) => {
	const {start, steps} = route
	let screen = start
	for (const step of steps) {
		const number = step.item
		const child = screen.colour.screens[number]
		const mappedCorners = getRelativePositions(child.corners, screen.corners)
		screen = makeScreen(child.colour, mappedCorners)
	}
	return screen
}