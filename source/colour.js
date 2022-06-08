//========//
// COLOUR //
//========//
export const COLOUR_HEXES = [
	GREY,
	GREEN,
	RED,
	BLUE,
	YELLOW,
	/*ORANGE,
	ROSE,
	CYAN,
	PURPLE,*/
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
	const worker = new Worker("source/worker.js", {type: "module"})
	worker.onmessage = (e) => {
		//print(e.data)
	}
	callWorker(worker, "receiveCanvas", [canvas], [canvas])
	
	const colour = {hex, worker, canvas, screens: []}
	return colour
}

export const callWorker = (worker, funcName, args = [], transfers) => {
	worker.postMessage({funcName, args}, transfers)
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