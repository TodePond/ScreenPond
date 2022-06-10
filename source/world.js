//=======//
// WORLD //
//=======//
export const makeWorld = (colours) => {
	const [colour] = colours
	const scale = 1.0
	const position = [0.0, 0.0]
	const camera = {colour, scale, position}
	return camera
}

export const pickColour = (screen, colours, position) => {

}