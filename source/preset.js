import {makeCamera} from "./camera.js"
import {makeRectangleCorners, rotateCorners, moveCorners} from "./corners.js"
import {addScreen, removeAllScreens} from "./colour.js"
import {makeScreen} from "./screen.js"
import {onkeydown} from "./keyboard.js"

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

}

const createPreset = ({key, camera, colours = {}} = {}) => {
	const preset = {camera, colours}
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
			{hex: GREY, corners: rotateCorners(makeRectangleCorners(0, 0, 1/2, 1/2), -0.0)},
			{hex: BLUE, corners: makeRectangleCorners(1/2, 0.0, 1/2, 1/2)},
			{hex: GREY, corners: makeRectangleCorners(0, 1/2, 1/2, 1/2)},
			{hex: GREY, corners: makeRectangleCorners(1/2, 1/2, 1/2, 1/2)},
		],
	}
})