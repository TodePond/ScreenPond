import { getColourParents } from "./colour.js"
import { makeRectangleCorners } from "./corners.js"
import { getMappedPositionPart, PART_TYPE } from "./part.js"
import { getRelativePositions } from "./position.js"
import { makeScreen } from "./screen.js"

//=======//
// WORLD //
//=======//
export const makeWorld = (colours) => {
	const colour = colours[GREY]
	const corners = makeRectangleCorners(0, 0, 1, 1)
	const world = makeScreen(colour, corners)
	return world
}

export const setWorldCorners = (world, corners, colours) => {
	world.corners = corners

	// Check if any children fill the whole world
	for (const child of world.colour.screens) {
		const relativeChildCorners = getRelativePositions(child.corners, world.corners)
		const parts = relativeChildCorners.map(corner => getMappedPositionPart(corner))
		if (parts.every(part => part.type === PART_TYPE.OUTSIDE)) {
			// Fully entered world!!
		}
	}

	// Check that all world corners are outside the view
	const parts = corners.map(corner => getMappedPositionPart(corner))
	if (parts.every(part => part.type === PART_TYPE.OUTSIDE)) {
		return
	}

	const parents = getColourParents(world.colour, colours)
	
}