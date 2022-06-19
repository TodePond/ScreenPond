//=========//
// ADDRESS //
//=========//
export const makeAddress = (colour, number) => {
	const address = {colour, number}
	return address
}

export const getScreenFromAddress = (address) => {
	const {colour, number} = address
	const screen = colour.screens[number]
	return screen
}