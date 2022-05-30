//=========//
// DISPLAY //
//=========//
const makeDisplay = () => {
	const display = {}
	setDisplayMode(display, false)
	return display
}

// true = show all colours
// false = show only first colour
const setDisplayMode = (display, mode) => {
	display.mode = mode
	if (mode) {
		display.columnCount = Math.ceil(Math.sqrt(COLOURS.length+1))
		display.rowCount = Math.ceil((COLOURS.length+1) / display.columnCount)
	} else {
		display.columnCount = 1
		display.rowCount = 1
	}
	
	display.width = 1.0 / display.columnCount
	display.height = 1.0 / display.rowCount
}