import { global } from "./global.js"
import { loadPreset } from "./preset.js"

//==========//
// KEYBOARD //
//==========//
const KEYDOWN = {}
on.keydown(e => {
	const {key} = e
	const event = KEYDOWN[key]
	if (event === undefined) return
	event(e)
})

//======//
// KEYS //
//======//
KEYDOWN["c"] = () => loadPreset(global, "EMPTY")
KEYDOWN["v"] = () => loadPreset(global, "GRID")
KEYDOWN["b"] = () => loadPreset(global, "MINI_GRID")