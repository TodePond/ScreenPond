import { makeRectangleCorners } from "./corners.js"
import { makeScreen } from "./screen.js"

//=======//
// WORLD //
//=======//
export const makeWorld = (colours) => {
	const colour = colours[GREY]
	const corners = makeRectangleCorners(0.1, 0.1, 0.8, 0.85)

	const world = makeScreen(colour, corners)
	return world
}