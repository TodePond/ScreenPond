//=============//
// ARRANGEMENT //
//=============//
const makeArrangement = (mode) => {
	const arrangement = {}
	setArrangementMode(arrangement, mode)
	return arrangement
}

// true = show all colours
// false = show only first colour
const setArrangementMode = (arrangement, mode) => {

	arrangement.mode = mode

	if (mode) {
		arrangement.columnCount = Math.ceil(Math.sqrt(COLOURS.length))
		arrangement.rowCount = Math.ceil(COLOURS.length / arrangement.columnCount)
	} else {
		arrangement.columnCount = 1
		arrangement.rowCount = 1
	}
	
	arrangement.width = 1.0 / arrangement.columnCount
	arrangement.height = 1.0 / arrangement.rowCount
}
