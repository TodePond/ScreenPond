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

export const removeScreen = (colour, screen) => {
	colour.screens = colour.screens.filter(s => s !== screen)
}

export const removeScreenNumber = (colour, number) => {
	colour.screens.splice(number, 1)
}

export const removeScreenAddress = (address) => {
	const {colour, number} = address
	removeScreenNumber(colour, number)
}

export const addScreen = (colour, screen) => {
	const number = colour.screens.push(screen) - 1
	return number
}

export const setScreenNumber = (colour, number, screen) => {
	colour.screens[number] = screen
}

export const rotateScreenNumber = (colour, number, angle) => {
	const screen = colour.screens[number]
	screen.corners = getRotatedCorners(screen.corners, angle)
}