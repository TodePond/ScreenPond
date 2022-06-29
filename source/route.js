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

export const popStep = (route) => {
	if (!route.steps.isEmpty) {
		route.length--
	}
	route.steps.pop()
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

export const areRoutesEqual = (a, b) => {
	if (a.start !== b.start) return false
	if (a.length !== b.length) return false
	const aSteps = [...a.steps]
	let i = 0
	for (const bStep of b.steps) {
		const aStep = aSteps[i]
		if (aStep.item !== bStep.item) return false
		i++
	}
	return true
}