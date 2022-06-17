import { getRotatedCorners } from "./corners.js"

//========//
// COLOUR //
//========//
export const COLOUR_HEXES = [
	GREEN,
	BLUE,
	RED,
	YELLOW,
	ORANGE,
	ROSE,
	CYAN,
	PURPLE,
	GREY,
]

export const makeColours = () => {
	const colours = {}
	for (const hex of COLOUR_HEXES) {
		colours[hex] = makeColour(hex)
	}
	return colours
}

export const makeColour = (hex) => {
	const screens = []
	const colour = {hex, screens}
	return colour
}

//=========//
// SCREENS //
//=========//
export const removeAllScreens = (colour) => {
	colour.screens.length = 0
}

export const removeScreensSet = (colour, screensSet) => {
	colour.screens = colour.screens.filter(screen => !screensSet.has(screen))
}

export const addScreen = (colour, screen) => {
	colour.screens.push(screen)
}

export const rotateScreenNumber = (colour, number, angle) => {
	const screen = colour.screens[number]
	screen.corners = getRotatedCorners(screen.corners, angle)
}