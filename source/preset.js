import { makeCamera } from "./camera.js"
import { makeRectangleCorners, rotateCorners, moveCorners } from "./corners.js"
import { addScreen, removeAllScreens, resetColourCanvas, rotateScreenNumber } from "./colour.js"
import { makeScreen } from "./screen.js"
import { onkeydown } from "./keyboard.js"

//========//
// PRESET //
//========//
const PRESET = {}
export const loadPresetName = (global, presetName) => {
	const preset = PRESET[presetName]
	if (preset === undefined) {
		throw new Error(`Could not find preset: '${presetName}'`)
	}
	return loadPreset(global, preset)
}

export const loadPreset = (global, preset) => {

	const {colours} = global
	for (const colour of colours) {
		removeAllScreens(colour)
	}

	for (const colourName in preset.colours) {
		const colour = colours[colourName]
		const screenPresets = preset.colours[colourName]
		for (const screenPreset of screenPresets) {
			const screenColour = colours[screenPreset.hex]
			const screen = makeScreen(screenColour, screenPreset.corners)
			addScreen(colour, screen)
		}
	}

	if (preset.camera === undefined) {
		preset.camera = makeCamera(colours)
	} 
	
	global.camera = preset.camera
	global.update = preset.update

	resetColourCanvas(global.camera.colour)

}

const createPreset = ({key, camera, colours = {}, update = () => {}} = {}) => {
	const preset = {camera, colours, update}
	if (key !== undefined) {
		onkeydown(key, () => loadPreset(global, preset))
	}
	return preset
}

//=========//
// PRESETS //
//=========//
PRESET.EMPTY = createPreset({
	key: "c",
})

PRESET.SINGLE = createPreset({
	key: "s",
	colours: {
		[GREY]: [
			{hex: BLUE, corners: makeRectangleCorners(1/3, 1/3, 1/3, 1/3)},
		]
	}
})

PRESET.DOUBLE = createPreset({
	key: "d",
	colours: {
		[GREY]: [
			{hex: BLUE, corners: makeRectangleCorners(0.05, 0.05, 0.425, 0.9)},
			{hex: RED, corners: makeRectangleCorners(0.525, 0.05, 0.425, 0.9)},
		],
		[BLUE]: [
			{hex: BLUE, corners: makeRectangleCorners(0.1, 0.1, 0.8, 0.8)},
		],
		[RED]: [
			{hex: RED, corners: makeRectangleCorners(0.1, 0.1, 0.8, 0.8)},
		],
	},
	update: (colours) => {
		rotateScreenNumber(colours[RED], 0, 0.002)
		resetColourCanvas(colours[GREY])
	}
})

PRESET.INFINITE = createPreset({
	key: "f",
	colours: {
		[GREY]: [
			{hex: GREEN, corners: makeRectangleCorners(0.05, 0.05, 0.9, 0.9)},
		],
		[GREEN]: [
			{hex: GREEN, corners: rotateCorners(makeRectangleCorners(0.05, 0.05, 0.90, 0.90), 0.2)},
		],
	},
	update: (colours) => {
		const s1 = colours[GREEN].screens[0]
		s1.corners = rotateCorners(s1.corners, 0.0001)
		resetColourCanvas(colours[GREY])
	}
})

PRESET.GRID = createPreset({
	key: "v",
	colours: {
		[GREY]: [
			{hex: YELLOW, corners: makeRectangleCorners(0, 0, 1/3, 1/3)},
			{hex: GREEN, corners: makeRectangleCorners(1/3, 0, 1/3, 1/3)},
			{hex: GREY, corners: makeRectangleCorners(2/3, 0, 1/3, 1/3)},
			{hex: BLUE, corners: makeRectangleCorners(0, 1/3, 1/3, 1/3)},
			{hex: GREY, corners: rotateCorners(makeRectangleCorners(1/3, 1/3, 1/3, 1/3), 0.1)},
			{hex: ORANGE, corners: makeRectangleCorners(2/3, 1/3, 1/3, 1/3)},
			{hex: ROSE, corners: makeRectangleCorners(0, 2/3, 1/3, 1/3)},
			{hex: CYAN, corners: makeRectangleCorners(1/3, 2/3, 1/3, 1/3)},
			{hex: GREY, corners: rotateCorners(makeRectangleCorners(2/3, 2/3, 1/3, 1/3), -0.1)},
		]
	}
})

PRESET.MINI_GRID = createPreset({
	key: "b",
	colours: {
		[GREY]: [
			{hex: RED, corners: makeRectangleCorners(0.1, 0.1, 0.8, 0.8)}
		],
		[RED]: [
			{hex: RED, corners: rotateCorners(makeRectangleCorners(0, 0, 1/2, 1/2), 0.2)},
			{hex: RED, corners: rotateCorners(makeRectangleCorners(0, 1/2, 1/2, 1/2), 0.0)},
			{hex: RED, corners: rotateCorners(makeRectangleCorners(1/2, 1/2, 1/2, 1/2), -0.2)},
			{hex: BLUE, corners: makeRectangleCorners(1/2, 0.0, 1/2, 1/2)},
		],
	},
	update: (colours) => {
		//const s = colours[RED].screens[3]
		//s.corners = rotateCorners(s.corners, 0.001)
		//resetColourCanvas(colours[GREY])
	}
})

PRESET.GRID2 = createPreset({
	key: "g",
	colours: {
		[GREY]: [
			//{hex: RED, corners: rotateCorners(makeRectangleCorners(0.1, 0.1, 0.3, 0.3), 0.0)},
			//{hex: RED, corners: rotateCorners(makeRectangleCorners(0.6, 0.1, 0.3, 0.3), 0.0)},
			//{hex: RED, corners: rotateCorners(makeRectangleCorners(0.1, 0.6, 0.3, 0.3), 0.0)},
			{hex: RED, corners: rotateCorners(makeRectangleCorners(0.5, 0.5, 0.45, 0.45), 0.0)},
		],
		[RED]: [
			{hex: GREY, corners: rotateCorners(makeRectangleCorners(0.1, 0.1, 0.8, 0.8), 0.0)}
		],
	},
	update: (colours) => {
		//const s = colours[RED].screens[0]
		//s.corners = rotateCorners(s.corners, 0.01)
		//resetColourCanvas(colours[GREY])
	}
})