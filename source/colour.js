import { rotateCorners } from "./corners.js"

//========//
// COLOUR //
//========//
export const COLOUR_HEXES = [
	GREY,
	GREEN,
	RED,
	BLUE,
	YELLOW,
	ORANGE,
	ROSE,
	CYAN,
	PURPLE,
]

export const makeColours = () => {
	const colours = {}
	for (const hex of COLOUR_HEXES) {
		colours[hex] = makeColour(hex)
	}
	return colours
}

export const makeColour = (hex) => {
	const colour = {hex, screens: []}
	return colour
}

//=========//
// SCREENS //
//=========//
export const removeAllScreens = (colour) => {
	colour.screens.length = 0
}

export const addScreen = (colour, screen) => {
	colour.screens.push(screen)
}

export const rotateScreenNumber = (colour, number, angle) => {
	const screen = colour.screens[number]
	screen.corners = rotateCorners(screen.corners, angle)
}