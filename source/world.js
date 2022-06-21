import { makeRectangleCorners } from "./corners.js"
import { makeScreen } from "./screen.js"

//=======//
// WORLD //
//=======//
export const makeWorld = (colours) => {
	const colour = colours[GREY]
	const corners = makeRectangleCorners(0.15, 0.1, 0.8, 0.85)
	//const corners = makeRectangleCorners(0, 0, 1, 1)
	//const corners = makeRectangleCorners(0, 0, 0.2, 1)
	const world = makeScreen(colour, corners)
	return world
}