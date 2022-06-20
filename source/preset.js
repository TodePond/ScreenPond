import { makeWorld } from "./world.js"
import { makeRectangleCorners, getRotatedCorners } from "./corners.js"
import { addScreen, removeAllScreens, rotateScreenNumber } from "./colour.js"
import { makeScreen } from "./screen.js"
import { onkeydown } from "./keyboard.js"
import { clearQueue } from "./draw.js"

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
	global.update = preset.update

	const {show, queue, world} = global
	const {context} = show
	if (context !== undefined) {
		clearQueue(context, queue, world)
	}

}

const createPreset = ({key, world, colours = {}, update = () => {}} = {}) => {
	const preset = {world, colours, update}
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
			{hex: GREEN, corners: getRotatedCorners(makeRectangleCorners(0.25, 0.25, 0.45, 0.45), 0.0)},
		],
		[GREEN]: [
			{hex: GREEN, corners: getRotatedCorners(makeRectangleCorners(0.1, 0.1, 0.8, 0.8), 0.0)},
		],
		[BLUE]: [
			{hex: GREEN, corners: getRotatedCorners(makeRectangleCorners(0.05, 0.05, 0.9, 0.9), 0.0)},
		],
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
	update: ({colours, queue, show, world}) => {
		rotateScreenNumber(colours[RED], 0, 0.002)
		const {context} = show
		clearQueue(context, queue, world)
	}
})

PRESET.INFINITE = createPreset({
	key: "f",
	colours: {
		[GREY]: [
			{hex: GREEN, corners: makeRectangleCorners(0.05, 0.05, 0.9, 0.9)},
		],
		[GREEN]: [
			{hex: GREEN, corners: getRotatedCorners(makeRectangleCorners(0.05, 0.05, 0.9, 0.9), 0.0)},
		],
	},
	update: ({colours, queue, show, hand, world}) => {
		const s1 = colours[GREEN].screens[0]
		s1.corners = getRotatedCorners(s1.corners, 0.005)
		const {context} = show
		clearQueue(context, queue, world)
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
			{hex: GREY, corners: getRotatedCorners(makeRectangleCorners(1/3, 1/3, 1/3, 1/3), 0.1)},
			{hex: ORANGE, corners: makeRectangleCorners(2/3, 1/3, 1/3, 1/3)},
			{hex: ROSE, corners: makeRectangleCorners(0, 2/3, 1/3, 1/3)},
			{hex: CYAN, corners: makeRectangleCorners(1/3, 2/3, 1/3, 1/3)},
			{hex: GREY, corners: getRotatedCorners(makeRectangleCorners(2/3, 2/3, 1/3, 1/3), -0.1)},
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
			{hex: RED, corners: getRotatedCorners(makeRectangleCorners(0, 0, 1/2, 1/2), 0.0)},
			{hex: RED, corners: getRotatedCorners(makeRectangleCorners(0, 1/2, 1/2, 1/2), 0.0)},
			{hex: RED, corners: getRotatedCorners(makeRectangleCorners(1/2, 1/2, 1/2, 1/2), -0.0)},
			{hex: BLUE, corners: makeRectangleCorners(1/2, 0.0, 1/2, 1/2)},
		],
	},
	update: (colours) => {
		//const s = colours[RED].screens[3]
		//s.corners = getRotatedCorners(s.corners, 0.001)
		//resetColourCanvas(colours[GREY])
	}
})

PRESET.GRID2 = createPreset({
	key: "g",
	colours: {
		[GREY]: [
			{hex: RED, corners: getRotatedCorners(makeRectangleCorners(0.25, 0.25, 0.5, 0.5), 0.0)},
			//{hex: RED, corners: getRotatedCorners(makeRectangleCorners(0.1, 0.1, 0.3, 0.3), 0.0)},
			//{hex: RED, corners: getRotatedCorners(makeRectangleCorners(0.6, 0.1, 0.3, 0.3), 0.0)},
			//{hex: RED, corners: getRotatedCorners(makeRectangleCorners(0.1, 0.6, 0.3, 0.3), 0.0)},
		],
		[RED]: [
			{hex: RED, corners: getRotatedCorners(makeRectangleCorners(0.25, 0.25, 0.5, 0.5), 0.0)},
		],
	},
	update: ({colours, queue, world, show, hand}) => {
		rotateScreenNumber(colours[GREY], 0, 0.005)
		const {context} = show
		clearQueue(context, queue, world)
	}
})