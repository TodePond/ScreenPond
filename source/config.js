//========//
// CONFIG //
//========//
const urlParams = new URLSearchParams(location.search)

export const PARAM_ARRANGEMENT_MODE = urlParams.get("multi")
export const BORDER_THICKNESS = 6
export const COLOURS = [
	Colour.Black.hex,
	Colour.Green.hex,
	Colour.Red.hex,
	Colour.Blue.hex,
	Colour.Yellow.hex,
	Colour.Orange.hex,
	Colour.Rose.hex,
	Colour.Cyan.hex,
	Colour.Purple.hex,
]
