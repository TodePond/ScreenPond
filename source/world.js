import { makeRectangleCorners } from "./corners.js"
import { makeScreen } from "./screen.js"

//=======//
// WORLD //
//=======//
export const makeWorld = (colours) => {
	const [colour] = colours
	const corners = makeRectangleCorners(0.05, 0.05, 0.9, 0.9)
	const world = makeScreen(colour, corners)
	return world
}