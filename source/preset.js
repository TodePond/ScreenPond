import { makeWorld } from "./world.js"
import { makeRectangle } from "./corners.js"
import { addScreen, removeAllScreens } from "./colour.js"
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

	if (preset.world === undefined) {
		preset.world = makeWorld(colours)
	} 
	
	global.world = preset.world

}

const createPreset = ({key, world, colours = {}} = {}) => {
	const preset = {world, colours}
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
		[BLACK]: [
			{hex: BLUE, corners: makeRectangle(1/3, 1/3, 1/3, 1/3)},
		]
	}
})

PRESET.DOUBLE = createPreset({
	key: "d",
	colours: {
		[BLACK]: [
			{hex: BLUE, corners: makeRectangle(1/3, 1/3, 1/3, 1/3)},
		],
		[BLUE]: [
			{hex: RED, corners: makeRectangle(1/3, 1/3, 1/3, 1/3)},
		],
	}
})

PRESET.INFINITE = createPreset({
	key: "f",
	colours: {
		[BLACK]: [
			{hex: BLUE, corners: makeRectangle(0.05, 0.05, 0.9, 0.9)},
		],
		[BLUE]: [
			{hex: RED, corners: makeRectangle(0.05, 0.05, 0.8, 0.8)},
		],
		[RED]: [
			{hex: BLUE, corners: makeRectangle(0.1, 0.1, 0.7, 0.7)},
		],
	}
})

PRESET.GRID = createPreset({
	key: "v",
	colours: {
		[BLACK]: [
			{hex: GREY, corners: makeRectangle(0, 0, 1/3, 1/3)},
			{hex: GREEN, corners: makeRectangle(1/3, 0, 1/3, 1/3)},
			{hex: RED, corners: makeRectangle(2/3, 0, 1/3, 1/3)},
			{hex: BLUE, corners: makeRectangle(0, 1/3, 1/3, 1/3)},
			{hex: YELLOW, corners: makeRectangle(1/3, 1/3, 1/3, 1/3)},
			{hex: ORANGE, corners: makeRectangle(2/3, 1/3, 1/3, 1/3)},
			{hex: ROSE, corners: makeRectangle(0, 2/3, 1/3, 1/3)},
			{hex: CYAN, corners: makeRectangle(1/3, 2/3, 1/3, 1/3)},
			{hex: PURPLE, corners: makeRectangle(2/3, 2/3, 1/3, 1/3)},
		]
	}
})

PRESET.MINI_GRID = createPreset({
	key: "b",
	colours: {
		[BLACK]: [
			{hex: GREY, corners: makeRectangle(0, 0, 1/2, 1/2)},
			{hex: GREEN, corners: makeRectangle(1/2, 0, 1/2, 1/2)},
			{hex: RED, corners: makeRectangle(0, 1/2, 1/2, 1/2)},
			{hex: BLUE, corners: makeRectangle(1/2, 1/2, 1/2, 1/2)},
		],
		[GREY]: [
			{hex: RED, corners: makeRectangle(0, 0, 1/2, 1/2)},
		],
	}
})