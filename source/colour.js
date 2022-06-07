//========//
// COLOUR //
//========//
export const COLOUR_HEXES = [
	BLACK,
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
// METHODS //
//=========//
export const removeAllScreens = (colour) => {
	colour.screens.length = 0
}

export const addScreen = (colour, screen) => {
	colour.screens.push(screen)
}