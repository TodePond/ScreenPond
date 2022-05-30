//======//
// DRAW //
//======//
const drawWorld = (context, world) => {
	const [head, ...tail] = WORLD_CORNERS.map(corner => getCanvasPosition(context, corner))

	context.beginPath()
	context.moveTo(...head)
	for (const corner of tail) {
		context.lineTo(...corner)
	}
	context.closePath()
	context.fillStyle = Colour.Black.hex
	context.fill()

	for (const screen of world) {
		stampSource(context, screen.colour, screen.corners)
	}
}

const stampSource = (context, colour, corners) => {

}

const drawSource = (context, source) => {
	const [head, ...tail] = source.corners.map(corner => getCanvasPosition(context, corner))

	context.beginPath()
	context.moveTo(...head)
	for (const corner of tail) {
		context.lineTo(...corner)
	}
	context.closePath()
	context.fillStyle = source.colour
	context.fill()
}