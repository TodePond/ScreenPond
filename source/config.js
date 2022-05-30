//========//
// CONFIG //
//========//
const urlParams = new URLSearchParams(location.search)

const PARAM_ARRANGEMENT_MODE = urlParams.get("multi")
const BORDER_THICKNESS = 6
const COLOURS = [
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
