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
	const canvas = new OffscreenCanvas(1920, 1080)
	const context = canvas.getContext("2d")
	const colour = {hex, context, screens: []}
	return colour
}

//=========//
// METHODS //
//=========//
export const removeAllScreens = (colour) => {
	colour.screens.length = 0
}

export const addScreen = (colour, screen) => {
	colour.screens.push(screen)
}