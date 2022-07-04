//=========//
// ADDRESS //
//=========//
export const makeAddress = (colour, number) => {
	const address = {colour, number}
	return address
}

export const getScreenFromAddress = (address, world = undefined) => {
	if (address === undefined) return world
	const {colour, number} = address
	const screen = colour.screens[number]
	return screen
}

export const areAddressesEqual = (a, b) => {
	if (a.colour !== b.colour) return false
	if (a.number !== b.number) return false
	return true
}