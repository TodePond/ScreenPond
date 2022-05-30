//========//
// CONFIG //
//========//
const urlParams = new URLSearchParams(location.search)
const BORDER_THICKNESS = 6

const COLOURS = [
	Colour.Green.hex,
	Colour.Red.hex,
	Colour.Blue.hex,
	Colour.Yellow.hex,
	Colour.Orange.hex,
	Colour.Rose.hex,
	Colour.Cyan.hex,
	Colour.Purple.hex,
]

const MULTI_DISPLAY_MODE = urlParams
const DISPLAY_COLUMN_COUNT = MULTI_DISPLAY_MODE? Math.ceil(Math.sqrt(COLOURS.length + 1)) : 1
const DISPLAY_ROW_COUNT = MULTI_DISPLAY_MODE? Math.ceil((COLOURS.length + 1) / DISPLAY_COLUMN_COUNT) : 1
const DISPLAY_WIDTH = 1.0 / DISPLAY_COLUMN_COUNT
const DISPLAY_HEIGHT = 1.0 / DISPLAY_ROW_COUNT

// intentionally weird for debugging
const WORLD_CORNERS = [
	[0.1, 0.0],
	[DISPLAY_WIDTH, 0.1],
	[DISPLAY_WIDTH-0.1, DISPLAY_HEIGHT],
	[0.05, DISPLAY_HEIGHT-0.1],
]