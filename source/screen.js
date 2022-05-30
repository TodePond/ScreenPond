//========//
// SCREEN //
//========//
const makeScreen = ({colour, parent, corners} = {}) => {
	if (colour === undefined) colour = Colour.Blue.hex
	if (parent === undefined) parent = undefined
	if (corners === undefined) corners = [
		[0.0, 0.0],
		[0.0, 0.0],
		[0.0, 0.0],
		[0.0, 0.0],
	]

	return {colour, parent, corners}
}