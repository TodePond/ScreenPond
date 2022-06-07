import { makeRectangle } from "./corners.js"
import { makeScreen } from "./screen.js"

//=======//
// WORLD //
//=======//
export const makeWorld = (colours) => {
	const [colour] = colours
	const corners = makeRectangle(0.0, 0.0, 1.0, 1.0)
	const world = makeScreen(colour, corners)
	return world
}